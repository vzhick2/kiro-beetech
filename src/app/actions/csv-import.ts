'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { parseQBOSalesCSV, validateQBOFormat } from '@/lib/utils/csv-parser'
import { createErrorResponse, createSuccessResponse } from '@/lib/error-handling'
import { z } from 'zod'

// Validation schemas
const ImportPreviewSchema = z.object({
  csvContent: z.string().min(1, 'CSV content is required')
})

const ProcessImportSchema = z.object({
  csvContent: z.string().min(1, 'CSV content is required'),
  effectiveDate: z.string().optional(), // Optional override date
  createMissingItems: z.boolean().default(true)
})

// Preview CSV data without importing
export async function previewQBOImport(formData: FormData) {
  try {
    const csvContent = formData.get('csvContent') as string
    
    // Validate input
    const validated = ImportPreviewSchema.parse({ csvContent })
    
    // Validate QBO format
    const formatValidation = validateQBOFormat(validated.csvContent)
    if (!formatValidation.isValid) {
      return createErrorResponse('Invalid QBO format', formatValidation.errors)
    }
    
    // Parse CSV data
    const parsingResult = parseQBOSalesCSV(validated.csvContent)
    
    if (!parsingResult.success) {
      return createErrorResponse('CSV parsing failed', parsingResult.errors)
    }
    
    // Group by item for summary
    const itemSummary = new Map<string, {
      itemName: string
      totalQuantity: number
      totalRevenue: number
      saleCount: number
      dateRange: { start: Date; end: Date }
    }>()
    
    parsingResult.data?.forEach(sale => {
      if (!itemSummary.has(sale.itemName)) {
        itemSummary.set(sale.itemName, {
          itemName: sale.itemName,
          totalQuantity: 0,
          totalRevenue: 0,
          saleCount: 0,
          dateRange: { start: sale.date, end: sale.date }
        })
      }
      
      const summary = itemSummary.get(sale.itemName)!
      summary.totalQuantity += sale.quantity
      summary.totalRevenue += sale.revenue || 0
      summary.saleCount += 1
      
      if (sale.date < summary.dateRange.start) {
        summary.dateRange.start = sale.date
      }
      if (sale.date > summary.dateRange.end) {
        summary.dateRange.end = sale.date
      }
    })
    
    return createSuccessResponse({
      message: 'CSV preview generated successfully',
      summary: {
        totalRows: parsingResult.totalRows,
        validRows: parsingResult.validRows,
        items: Array.from(itemSummary.values()),
        dateRange: {
          start: Math.min(...Array.from(itemSummary.values()).map(s => s.dateRange.start.getTime())),
          end: Math.max(...Array.from(itemSummary.values()).map(s => s.dateRange.end.getTime()))
        }
      },
      rawData: parsingResult.data?.slice(0, 10) // First 10 rows for preview
    })
    
  } catch (error) {
    return createErrorResponse('Failed to preview CSV data', error)
  }
}

// Process and import QBO sales data
export async function processQBOImport(formData: FormData) {
  const supabase = createClient()
  
  try {
    const csvContent = formData.get('csvContent') as string
    const effectiveDate = formData.get('effectiveDate') as string
    const createMissingItems = formData.get('createMissingItems') === 'true'
    
    // Validate input
    const validated = ProcessImportSchema.parse({
      csvContent,
      effectiveDate,
      createMissingItems
    })
    
    // Parse CSV data
    const parsingResult = parseQBOSalesCSV(validated.csvContent)
    
    if (!parsingResult.success || !parsingResult.data) {
      return createErrorResponse('CSV parsing failed', parsingResult.errors)
    }
    
    const salesData = parsingResult.data
    const results = {
      itemsCreated: 0,
      itemsUpdated: 0,
      salesLogged: 0,
      errors: [] as string[]
    }
    
    // Process each sale
    for (const sale of salesData) {
      try {
        // Check if item exists
        const { data: existingItem } = await supabase
          .from('items')
          .select('itemid, currentquantity, name')
          .eq('name', sale.itemName)
          .eq('isarchived', false)
          .single()
        
        let itemId: string
        
        if (existingItem) {
          // Update existing item quantity
          const newQuantity = (existingItem.currentquantity || 0) - sale.quantity
          
          const { error: updateError } = await supabase
            .from('items')
            .update({ currentquantity: newQuantity })
            .eq('itemid', existingItem.itemid)
          
          if (updateError) {
            results.errors.push(`Failed to update ${sale.itemName}: ${updateError.message}`)
            continue
          }
          
          itemId = existingItem.itemid
          results.itemsUpdated++
          
        } else if (createMissingItems) {
          // Create new item
          const { data: newItem, error: createError } = await supabase
            .from('items')
            .insert({
              name: sale.itemName,
              sku: `QBO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: 'product',
              inventoryunit: 'each',
              currentquantity: -sale.quantity, // Negative since it was sold
              weightedaveragecost: 0,
              reorderpoint: 0,
              isarchived: false
            })
            .select('itemid')
            .single()
          
          if (createError) {
            results.errors.push(`Failed to create ${sale.itemName}: ${createError.message}`)
            continue
          }
          
          itemId = newItem.itemid
          results.itemsCreated++
          
        } else {
          results.errors.push(`Item not found: ${sale.itemName} (create missing items is disabled)`)
          continue
        }
        
        // Log the sale transaction
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            itemid: itemId,
            transactiontype: 'sale',
            quantity: -sale.quantity,
            referenceid: `QBO-${sale.date.toISOString().split('T')[0]}`,
            effectivedate: (validated.effectiveDate ? new Date(validated.effectiveDate).toISOString().split('T')[0] : sale.date.toISOString().split('T')[0]) || new Date().toISOString().split('T')[0] || '',
            notes: `QBO import: ${sale.customer || 'Unknown customer'} - ${sale.channel || 'qbo'}`
          })
        
        if (transactionError) {
          results.errors.push(`Failed to log transaction for ${sale.itemName}: ${transactionError.message}`)
          continue
        }
        
        results.salesLogged++
        
      } catch (error) {
        results.errors.push(`Error processing ${sale.itemName}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
    
    // Revalidate relevant pages
    revalidatePath('/items')
    revalidatePath('/reports')
    
    return createSuccessResponse({
      message: 'QBO import completed',
      results: {
        ...results,
        totalProcessed: salesData.length,
        successRate: ((salesData.length - results.errors.length) / salesData.length * 100).toFixed(1) + '%'
      }
    })
    
  } catch (error) {
    return createErrorResponse('Failed to process QBO import', error)
  }
}

// Get existing items for validation
export async function getExistingItems() {
  const supabase = createClient()
  
  try {
    const { data: items, error } = await supabase
      .from('items')
      .select('itemid, name, sku, currentquantity')
      .eq('isarchived', false)
      .order('name')
    
    if (error) {
      return createErrorResponse('Failed to fetch items', error)
    }
    
    return createSuccessResponse({
      items: items || []
    })
    
  } catch (error) {
    return createErrorResponse('Failed to fetch items', error)
  }
} 