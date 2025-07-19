'use server'

import { supabase } from '@/lib/supabase'
import { handleError, handleSuccess, validationError } from '@/lib/error-handling'
import { CreateItemSchema, UpdateItemSchema, BulkItemIdsSchema } from '@/lib/validations/items'
// Removed unused type imports

export async function getItems() {
  try {
    // Optimized single query with last used supplier information
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        primary_supplier:suppliers!items_primarysupplierid_fkey(name)
      `)
      .order('name')

    if (error) {
      return handleError(error, 'getItems')
    }

    // Get last used supplier for all items in a single optimized query
    const { data: lastUsedSuppliers, error: supplierError } = await supabase
      .from('purchase_line_items')
      .select(`
        itemid,
        purchase:purchases!inner(
          purchasedate,
          supplier:suppliers!inner(name)
        )
      `)
      .order('purchase.purchasedate', { ascending: false })

    if (supplierError) {
      console.error('Error fetching last used suppliers:', supplierError)
      // Continue without last used supplier data rather than failing
    }

    // Create a map of itemid to last used supplier
    const lastUsedSupplierMap = new Map<string, string>()
    if (lastUsedSuppliers) {
      lastUsedSuppliers.forEach((purchase: { itemid: string; purchase: { supplier: { name: string } } }) => {
        if (!lastUsedSupplierMap.has(purchase.itemid)) {
          lastUsedSupplierMap.set(purchase.itemid, purchase.purchase.supplier.name)
        }
      })
    }

    // Merge the data
    const itemsWithLastSupplier = data.map((item: unknown) => {
      return {
        ...item,
        lastUsedSupplier: lastUsedSupplierMap.get(item.itemid) || null
      }
    })

    return handleSuccess(itemsWithLastSupplier)
  } catch (error) {
    return handleError(error, 'getItems')
  }
}

export async function createItem(itemData: unknown) {
  try {
    // Validate input data
    const validatedData = CreateItemSchema.parse(itemData)
    
    const { data, error } = await supabase
      .from('items')
      .insert([validatedData])
      .select()
      .single()

    if (error) {
      return handleError(error, 'createItem')
    }

    return handleSuccess(data)
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return validationError('Invalid item data provided')
    }
    return handleError(error, 'createItem')
  }
}

export async function updateItem(itemId: string, updates: unknown) {
  try {
    // Validate input data
    const validatedUpdates = UpdateItemSchema.parse(updates)
    
    const { data, error } = await supabase
      .from('items')
      .update(validatedUpdates)
      .eq('itemid', itemId)
      .select()
      .single()

    if (error) {
      return handleError(error, 'updateItem')
    }

    return handleSuccess(data)
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return validationError('Invalid update data provided')
    }
    return handleError(error, 'updateItem')
  }
}

export async function deleteItem(itemId: string) {
  try {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('itemid', itemId)

    if (error) {
      return handleError(error, 'deleteItem')
    }

    return handleSuccess({ deleted: true })
  } catch (error) {
    return handleError(error, 'deleteItem')
  }
}

export async function getItemDetails(itemId: string) {
  try {
    // Get item details
    const { data: item, error: itemError } = await supabase
      .from('items')
      .select('*')
      .eq('itemid', itemId)
      .single()

    if (itemError) {
      return handleError(itemError, 'getItemDetails')
    }

    // Get recent transactions for this item
    const { data: transactions, error: transactionError } = await supabase
      .from('transactions')
      .select('*')
      .eq('itemid', itemId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (transactionError) {
      console.error('Error fetching transactions:', transactionError)
      // Continue without transactions rather than failing
    }

    return handleSuccess({ 
      item, 
      transactions: transactions || [] 
    })
  } catch (error) {
    return handleError(error, 'getItemDetails')
  }
}

export async function bulkDeleteItems(itemIds: unknown) {
  try {
    // Validate input data
    const { itemIds: validatedIds } = BulkItemIdsSchema.parse({ itemIds })
    
    if (validatedIds.length === 0) {
      return handleSuccess({ deletedCount: 0 })
    }

    const { error } = await supabase
      .from('items')
      .delete()
      .in('itemid', validatedIds)

    if (error) {
      return handleError(error, 'bulkDeleteItems')
    }

    return handleSuccess({ deletedCount: validatedIds.length })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return validationError('Invalid item IDs provided')
    }
    return handleError(error, 'bulkDeleteItems')
  }
}

export async function bulkArchiveItems(itemIds: unknown) {
  try {
    // Validate input data
    const { itemIds: validatedIds } = BulkItemIdsSchema.parse({ itemIds })
    
    if (validatedIds.length === 0) {
      return handleSuccess({ archivedCount: 0 })
    }

    const { error } = await supabase
      .from('items')
      .update({ isarchived: true })
      .in('itemid', validatedIds)

    if (error) {
      return handleError(error, 'bulkArchiveItems')
    }

    return handleSuccess({ archivedCount: validatedIds.length })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return validationError('Invalid item IDs provided')
    }
    return handleError(error, 'bulkArchiveItems')
  }
} 