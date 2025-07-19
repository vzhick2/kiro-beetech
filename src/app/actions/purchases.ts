'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function getDraftPurchases() {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select(
        `
        *,
        supplier:suppliers(name),
        line_items:purchase_line_items(
          *,
          item:items(name, sku)
        )
      `
      )
      .eq('isdraft', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to fetch draft purchases:', error);
    return { success: false, error: 'Failed to fetch draft purchases' };
  }
}

export async function finalizeDraftPurchase(purchaseId: string) {
  try {
    // TODO: Deploy finalize_draft_purchase RPC function to database
    // For now, manually update purchase and line items
    const { error: updateError } = await supabase
      .from('purchases')
      .update({ isdraft: false, updated_at: new Date().toISOString() })
      .eq('purchaseid', purchaseId)
      .eq('isdraft', true);

    if (updateError) {
      throw updateError;
    }

    // Get line items to update inventory
    const { data: lineItems, error: lineItemsError } = await supabase
      .from('purchase_line_items')
      .select('itemid, quantity, unitcost')
      .eq('purchaseid', purchaseId);

    if (lineItemsError) {
      throw lineItemsError;
    }

    // Update inventory for each line item
    for (const lineItem of lineItems || []) {
      const { error: inventoryError } = await supabase.rpc(
        'update_item_quantity_atomic',
        {
          item_id: lineItem.itemid,
          quantity_change: lineItem.quantity,
        }
      );

      if (inventoryError) {
        throw inventoryError;
      }

      // Log transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          itemid: lineItem.itemid,
          transactiontype: 'purchase',
          quantity: lineItem.quantity,
          referenceid: purchaseId,
          referencetype: 'purchase',
          unitcost: lineItem.unitcost,
          effectivedate: new Date().toISOString().split('T')[0] || '',
        });

      if (transactionError) {
        throw transactionError;
      }
    }

    revalidatePath('/purchases');
    revalidatePath('/items');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Failed to finalize draft purchase:', error);
    return { success: false, error: 'Failed to finalize purchase' };
  }
}

export async function deleteDraftPurchase(purchaseId: string) {
  try {
    // Delete line items first (cascade should handle this, but being explicit)
    const { error: lineItemsError } = await supabase
      .from('purchase_line_items')
      .delete()
      .eq('purchaseid', purchaseId);

    if (lineItemsError) {
      throw lineItemsError;
    }

    // Delete purchase
    const { error: purchaseError } = await supabase
      .from('purchases')
      .delete()
      .eq('purchaseid', purchaseId)
      .eq('isdraft', true); // Safety check - only delete drafts

    if (purchaseError) {
      throw purchaseError;
    }

    revalidatePath('/purchases');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete draft purchase:', error);
    return { success: false, error: 'Failed to delete draft purchase' };
  }
}
