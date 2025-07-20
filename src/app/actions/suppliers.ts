'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { CreateSupplierRequest } from '@/types';

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
  try {
    const insertData: any = {
      name: supplierData.name,
      isarchived: false,
    };

    // Map fields to correct database column names
    if (supplierData.website) {
      insertData.website = supplierData.website; // Fixed: website -> website (not storeurl)
    }

    if (supplierData.contactPhone) {
      insertData.contactphone = supplierData.contactPhone; // Fixed: contactPhone -> contactphone (not phone)
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

export async function deleteSupplier(supplierId: string) {
  try {
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
  try {
    if (supplierIds.length === 0) {
      return { success: true, deletedCount: 0 };
    }

    const { error } = await supabaseAdmin
      .from('suppliers')
      .delete()
      .in('supplierid', supplierIds);

    if (error) {
      console.error('Error bulk deleting suppliers:', error);
      return { success: false, error: error.message };
    }

    return { success: true, deletedCount: supplierIds.length };
  } catch (error) {
    console.error('Failed to bulk delete suppliers:', error);
    return { success: false, error: 'Failed to bulk delete suppliers' };
  }
}

export async function bulkArchiveSuppliers(supplierIds: string[]) {
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
