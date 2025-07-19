import { z } from 'zod'

// QBO Sales CSV Schema
const QBOSalesRowSchema = z.object({
  'Date': z.string().optional(),
  'Transaction Type': z.string().optional(),
  'Product/Service': z.string().optional(),
  'Description': z.string().optional(),
  'Qty': z.string().optional(),
  'Rate': z.string().optional(),
  'Amount': z.string().optional(),
  'Customer': z.string().optional(),
  'Channel': z.string().optional(),
})

export type QBOSalesRow = z.infer<typeof QBOSalesRowSchema>

// Processed sales data
export interface ProcessedSalesData {
  date: Date
  itemName: string
  quantity: number
  revenue?: number
  customer?: string
  channel?: string
}

// CSV parsing result
export interface CSVParsingResult {
  success: boolean
  data?: ProcessedSalesData[]
  errors?: string[]
  totalRows: number
  validRows: number
}

/**
 * Parse QBO sales CSV data
 */
export function parseQBOSalesCSV(csvContent: string): CSVParsingResult {
  const lines = csvContent.split('\n').filter(line => line.trim())
  const errors: string[] = []
  const processedData: ProcessedSalesData[] = []
  
  // Skip header row
  const dataRows = lines.slice(1)
  
  for (let i = 0; i < dataRows.length; i++) {
    const line = dataRows[i]
    const rowNumber = i + 2 // +2 because we skipped header and arrays are 0-indexed
    
    try {
      // Parse CSV line (handle quoted values)
      const columns = parseCSVLine(line)
      
      // Map to expected schema
      const rowData: Record<string, string> = {}
      const headers = ['Date', 'Transaction Type', 'Product/Service', 'Description', 'Qty', 'Rate', 'Amount', 'Customer', 'Channel']
      
      headers.forEach((header, index) => {
        rowData[header] = columns[index] || ''
      })
      
      // Validate row
      const validatedRow = QBOSalesRowSchema.parse(rowData)
      
      // Skip non-sales transactions
      if (validatedRow['Transaction Type'] !== 'Sale' && validatedRow['Transaction Type'] !== 'Invoice') {
        continue
      }
      
      // Extract and validate data
      const itemName = validatedRow['Product/Service'] || validatedRow['Description'] || ''
      const quantityStr = validatedRow['Qty'] || '1'
      const amountStr = validatedRow['Amount'] || '0'
      
      if (!itemName.trim()) {
        errors.push(`Row ${rowNumber}: Missing item name`)
        continue
      }
      
      const quantity = parseFloat(quantityStr)
      const amount = parseFloat(amountStr.replace(/[$,]/g, ''))
      
      if (isNaN(quantity) || quantity <= 0) {
        errors.push(`Row ${rowNumber}: Invalid quantity "${quantityStr}"`)
        continue
      }
      
      // Parse date
      let date = new Date()
      if (validatedRow['Date']) {
        const parsedDate = new Date(validatedRow['Date'])
        if (!isNaN(parsedDate.getTime())) {
          date = parsedDate
        }
      }
      
      processedData.push({
        date,
        itemName: itemName.trim(),
        quantity,
        revenue: isNaN(amount) ? undefined : amount,
        customer: validatedRow['Customer']?.trim(),
        channel: validatedRow['Channel']?.trim() || 'qbo'
      })
      
    } catch (error) {
      errors.push(`Row ${rowNumber}: ${error instanceof Error ? error.message : 'Invalid data'}`)
    }
  }
  
  return {
    success: errors.length === 0,
    data: processedData,
    errors: errors.length > 0 ? errors : undefined,
    totalRows: dataRows.length,
    validRows: processedData.length
  }
}

/**
 * Parse a single CSV line, handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current.trim())
  return result
}

/**
 * Validate QBO CSV format before processing
 */
export function validateQBOFormat(csvContent: string): { isValid: boolean; errors: string[] } {
  const lines = csvContent.split('\n').filter(line => line.trim())
  const errors: string[] = []
  
  if (lines.length < 2) {
    errors.push('CSV must have at least a header row and one data row')
    return { isValid: false, errors }
  }
  
  const headerLine = lines[0].toLowerCase()
  const requiredHeaders = ['date', 'transaction type', 'product/service', 'qty', 'amount']
  
  for (const header of requiredHeaders) {
    if (!headerLine.includes(header)) {
      errors.push(`Missing required header: "${header}"`)
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
} 