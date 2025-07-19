'use server'

import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type CreateItemRequest = Database['public']['Tables']['items']['Insert']

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
      console.error('Error fetching items:', error)
      return { success: false, error: error.message }
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
    const itemsWithLastSupplier = data.map((item) => {
      return {
        ...item,
        lastUsedSupplier: lastUsedSupplierMap.get(item.itemid) || null
      }
    })

    return { success: true, data: itemsWithLastSupplier }
  } catch (error) {
    console.error('Failed to fetch items:', error)
    return { success: false, error: 'Failed to fetch items' }
  }
}

export async function createItem(itemData: CreateItemRequest) {
  try {
    const { data, error } = await supabase
      .from('items')
      .insert([itemData])
      .select()
      .single()

    if (error) {
      console.error('Error creating item:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Failed to create item:', error)
    return { success: false, error: 'Failed to create item' }
  }
}

export async function updateItem(itemId: string, updates: Partial<CreateItemRequest>) {
  try {
    const { data, error } = await supabase
      .from('items')
      .update(updates)
      .eq('itemid', itemId)
      .select()
      .single()

    if (error) {
      console.error('Error updating item:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Failed to update item:', error)
    return { success: false, error: 'Failed to update item' }
  }
}

export async function deleteItem(itemId: string) {
  try {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('itemid', itemId)

    if (error) {
      console.error('Error deleting item:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to delete item:', error)
    return { success: false, error: 'Failed to delete item' }
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
      console.error('Error fetching item:', itemError)
      return { success: false, error: itemError.message }
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

    return { 
      success: true, 
      data: { 
        item, 
        transactions: transactions || [] 
      } 
    }
  } catch (error) {
    console.error('Failed to fetch item details:', error)
    return { success: false, error: 'Failed to fetch item details' }
  }
}

export async function bulkDeleteItems(itemIds: string[]) {
  try {
    if (itemIds.length === 0) {
      return { success: true, deletedCount: 0 }
    }

    const { error } = await supabase
      .from('items')
      .delete()
      .in('itemid', itemIds)

    if (error) {
      console.error('Error bulk deleting items:', error)
      return { success: false, error: error.message }
    }

    return { success: true, deletedCount: itemIds.length }
  } catch (error) {
    console.error('Failed to bulk delete items:', error)
    return { success: false, error: 'Failed to bulk delete items' }
  }
}

export async function bulkArchiveItems(itemIds: string[]) {
  try {
    if (itemIds.length === 0) {
      return { success: true, archivedCount: 0 }
    }

    const { error } = await supabase
      .from('items')
      .update({ isarchived: true })
      .in('itemid', itemIds)

    if (error) {
      console.error('Error bulk archiving items:', error)
      return { success: false, error: error.message }
    }

    return { success: true, archivedCount: itemIds.length }
  } catch (error) {
    console.error('Failed to bulk archive items:', error)
    return { success: false, error: 'Failed to bulk archive items' }
  }
} 