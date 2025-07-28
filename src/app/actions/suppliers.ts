'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { CreateSupplierRequest } from '@/types';

import { SupplierSchema } from '@/lib/validations';

const SupplierUpdateSchema = SupplierSchema.partial();

export async function getSuppliers() {
  try {
    const { data, error } = await supabaseAdmin
      .from('suppliers')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching suppliers:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in getSuppliers:', error);
    return { success: false, error: 'Failed to fetch suppliers' };
  }
}

export async function createSupplier(supplierData: CreateSupplierRequest) {
  const parseResult = SupplierSchema.safeParse(supplierData);
  if (!parseResult.success) {
    return {
      success: false,
      error: 'Invalid supplier data',
      details: parseResult.error.flatten(),
    };
  }
  try {
    const insertData: any = {
      name: supplierData.name,
      isarchived: false,
    };

    // Add optional fields directly - no mapping needed with unified types
    if (supplierData.website) {
      insertData.website = supplierData.website;
    }

    if (supplierData.email) {
      insertData.email = supplierData.email;
    }

    if (supplierData.contactphone) {
      insertData.contactphone = supplierData.contactphone;
    }

    if (supplierData.address) {
      insertData.address = supplierData.address;
    }

    if (supplierData.notes) {
      insertData.notes = supplierData.notes;
    }

    const { data, error } = await supabaseAdmin
      .from('suppliers')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('Error creating supplier:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in createSupplier:', error);
    return { success: false, error: 'Failed to create supplier' };
  }
}

export async function updateSupplier(
  supplierId: string,
  updates: Record<string, unknown>
) {
  const parseResult = SupplierUpdateSchema.safeParse(updates);
  if (!parseResult.success) {
    return {
      success: false,
      error: 'Invalid update data',
      details: parseResult.error.flatten(),
    };
  }
  try {
    const { data, error } = await supabaseAdmin
      .from('suppliers')
      .update(updates)
      .eq('supplierid', supplierId)
      .select()
      .single();

    if (error) {
      console.error('Error updating supplier:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in updateSupplier:', error);
    return { success: false, error: 'Failed to update supplier' };
  }
}

/**
 * Check if a supplier can be safely deleted (no business activity)
 */
export async function canDeleteSupplier(supplierId: string) {
  try {
    // Check for any purchases from this supplier
    const { data: purchases, error: purchaseError } = await supabaseAdmin
      .from('purchases')
      .select('purchaseid')
      .eq('supplierid', supplierId)
      .limit(1);

    if (purchaseError) {
      console.error('Error checking purchases:', purchaseError);
      return { canDelete: false, reason: 'Error checking purchase history' };
    }

    if (purchases && purchases.length > 0) {
      return { canDelete: false, reason: 'Supplier has purchase history' };
    }

    // Check for items using this as primary supplier
    const { data: items, error: itemError } = await supabaseAdmin
      .from('items')
      .select('itemid')
      .eq('primarysupplierid', supplierId)
      .limit(1);

    if (itemError) {
      console.error('Error checking items:', itemError);
      return { canDelete: false, reason: 'Error checking item relationships' };
    }

    if (items && items.length > 0) {
      return { canDelete: false, reason: 'Supplier is set as primary supplier for items' };
    }

    return { canDelete: true };
  } catch (error) {
    console.error('Error in canDeleteSupplier:', error);
    return { canDelete: false, reason: 'Failed to validate supplier deletion' };
  }
}

export async function deleteSupplier(supplierId: string) {
  try {
    // Check if supplier can be deleted
    const deleteCheck = await canDeleteSupplier(supplierId);
    if (!deleteCheck.canDelete) {
      return { 
        success: false, 
        error: deleteCheck.reason,
        suggestArchive: true 
      };
    }

    const { error } = await supabaseAdmin
      .from('suppliers')
      .delete()
      .eq('supplierid', supplierId);

    if (error) {
      console.error('Error deleting supplier:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteSupplier:', error);
    return { success: false, error: 'Failed to delete supplier' };
  }
}

export async function bulkDeleteSuppliers(supplierIds: string[]) {
  if (
    !Array.isArray(supplierIds) ||
    supplierIds.some(id => typeof id !== 'string')
  ) {
    return { success: false, error: 'Invalid supplier IDs' };
  }
  try {
    if (supplierIds.length === 0) {
      return { success: true, deletedCount: 0, blockedCount: 0, blockedReasons: [] };
    }

    // Check which suppliers can be deleted
    const deleteChecks = await Promise.all(
      supplierIds.map(async (id) => ({
        id,
        ...(await canDeleteSupplier(id))
      }))
    );

    const canDeleteIds = deleteChecks
      .filter(check => check.canDelete)
      .map(check => check.id);
    
    const blockedIds = deleteChecks
      .filter(check => !check.canDelete)
      .map(check => ({ id: check.id, reason: check.reason }));

    let deletedCount = 0;
    if (canDeleteIds.length > 0) {
      const { error } = await supabaseAdmin
        .from('suppliers')
        .delete()
        .in('supplierid', canDeleteIds);

      if (error) {
        console.error('Error bulk deleting suppliers:', error);
        return { success: false, error: error.message };
      }
      deletedCount = canDeleteIds.length;
    }

    return { 
      success: true, 
      deletedCount,
      blockedCount: blockedIds.length,
      blockedReasons: blockedIds,
      suggestArchive: blockedIds.length > 0
    };
  } catch (error) {
    console.error('Failed to bulk delete suppliers:', error);
    return { success: false, error: 'Failed to bulk delete suppliers' };
  }
}

export async function bulkArchiveSuppliers(supplierIds: string[]) {
  if (
    !Array.isArray(supplierIds) ||
    supplierIds.some(id => typeof id !== 'string')
  ) {
    return { success: false, error: 'Invalid supplier IDs' };
  }
  try {
    if (supplierIds.length === 0) {
      return { success: true, archivedCount: 0 };
    }

    const { error } = await supabaseAdmin
      .from('suppliers')
      .update({ isarchived: true })
      .in('supplierid', supplierIds);

    if (error) {
      console.error('Error bulk archiving suppliers:', error);
      return { success: false, error: error.message };
    }

    return { success: true, archivedCount: supplierIds.length };
  } catch (error) {
    console.error('Failed to bulk archive suppliers:', error);
    return { success: false, error: 'Failed to bulk archive suppliers' };
  }
}

export async function bulkUnarchiveSuppliers(supplierIds: string[]) {
  try {
    if (!supplierIds || supplierIds.length === 0) {
      return { success: true, unarchivedCount: 0 };
    }

    const { error } = await supabaseAdmin
      .from('suppliers')
      .update({ isarchived: false })
      .in('supplierid', supplierIds);

    if (error) {
      console.error('Error bulk unarchiving suppliers:', error);
      return { success: false, error: error.message };
    }

    return { success: true, unarchivedCount: supplierIds.length };
  } catch (error) {
    console.error('Failed to bulk unarchive suppliers:', error);
    return { success: false, error: 'Failed to bulk unarchive suppliers' };
  }
}

export async function bulkUpdateSuppliers(updates: Array<{ supplierId: string; changes: Record<string, unknown> }>) {
  try {
    if (!updates || updates.length === 0) {
      return { success: true, updatedCount: 0 };
    }

    // Validate all updates first
    for (const update of updates) {
      const parseResult = SupplierUpdateSchema.safeParse(update.changes);
      if (!parseResult.success) {
        return {
          success: false,
          error: `Invalid update data for supplier ${update.supplierId}`,
          details: parseResult.error.flatten(),
        };
      }
    }

    // Perform updates sequentially to avoid conflicts
    const results = [];
    for (const update of updates) {
      const { data, error } = await supabaseAdmin
        .from('suppliers')
        .update(update.changes)
        .eq('supplierid', update.supplierId)
        .select()
        .single();

      if (error) {
        console.error(`Error updating supplier ${update.supplierId}:`, error);
        return { 
          success: false, 
          error: `Failed to update supplier ${update.supplierId}: ${error.message}`,
          partialUpdates: results.length
        };
      }

      results.push(data);
    }

    return { success: true, updatedCount: results.length, data: results };
  } catch (error) {
    console.error('Error in bulkUpdateSuppliers:', error);
    return { success: false, error: 'Failed to bulk update suppliers' };
  }
}
