'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// Helper function to generate display ID
function generateDisplayId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 999) + 1;
  const randomStr = String(random).padStart(3, '0');
  return `PO-${year}${month}${day}-${randomStr}`;
}

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

export async function getAllPurchases() {
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
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to fetch purchases:', error);
    return { success: false, error: 'Failed to fetch purchases' };
  }
}

export async function createDraftPurchase(purchaseData: {
  supplierId: string;
  purchaseDate: string;
  effectiveDate: string;
  grandTotal: number;
  shipping?: number;
  taxes?: number;
  otherCosts?: number;
  notes?: string;
}) {
  try {
    const displayId = generateDisplayId();

    const { data, error } = await supabase
      .from('purchases')
      .insert({
        displayid: displayId,
        supplierid: purchaseData.supplierId,
        purchasedate: purchaseData.purchaseDate,
        effectivedate: purchaseData.effectiveDate,
        total: purchaseData.grandTotal,
        shipping: purchaseData.shipping || 0,
        taxes: purchaseData.taxes || 0,
        othercosts: purchaseData.otherCosts || 0,
        notes: purchaseData.notes || null,
        isdraft: true,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    revalidatePath('/purchases');

    return { success: true, data };
  } catch (error) {
    console.error('Failed to create draft purchase:', error);
    return { success: false, error: 'Failed to create draft purchase' };
  }
}

export async function updateDraftPurchase(
  purchaseId: string,
  purchaseData: {
    supplierId?: string;
    purchaseDate?: string;
    effectiveDate?: string;
    grandTotal?: number;
    shipping?: number;
    taxes?: number;
    otherCosts?: number;
    notes?: string;
  }
) {
  try {
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (purchaseData.supplierId) {
      updateData.supplierid = purchaseData.supplierId;
    }
    if (purchaseData.purchaseDate) {
      updateData.purchasedate = purchaseData.purchaseDate;
    }
    if (purchaseData.effectiveDate) {
      updateData.effectivedate = purchaseData.effectiveDate;
    }
    if (purchaseData.grandTotal !== undefined) {
      updateData.total = purchaseData.grandTotal;
    }
    if (purchaseData.shipping !== undefined) {
      updateData.shipping = purchaseData.shipping;
    }
    if (purchaseData.taxes !== undefined) {
      updateData.taxes = purchaseData.taxes;
    }
    if (purchaseData.otherCosts !== undefined) {
      updateData.othercosts = purchaseData.otherCosts;
    }
    if (purchaseData.notes !== undefined) {
      updateData.notes = purchaseData.notes || null;
    }

    const { data, error } = await supabase
      .from('purchases')
      .update(updateData)
      .eq('purchaseid', purchaseId)
      .eq('isdraft', true) // Safety check - only update drafts
      .select()
      .single();

    if (error) {
      throw error;
    }

    revalidatePath('/purchases');

    return { success: true, data };
  } catch (error) {
    console.error('Failed to update draft purchase:', error);
    return { success: false, error: 'Failed to update draft purchase' };
  }
}

export async function addLineItem(
  purchaseId: string,
  lineItemData: {
    itemId: string;
    quantity: number;
    unitCost: number;
    notes?: string;
  }
) {
  try {
    const totalCost = lineItemData.quantity * lineItemData.unitCost;

    const { data, error } = await supabase
      .from('purchase_line_items')
      .insert({
        purchaseid: purchaseId,
        itemid: lineItemData.itemId,
        quantity: lineItemData.quantity,
        unitcost: lineItemData.unitCost,
        totalcost: totalCost,
        notes: lineItemData.notes || null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    revalidatePath('/purchases');

    return { success: true, data };
  } catch (error) {
    console.error('Failed to add line item:', error);
    return { success: false, error: 'Failed to add line item' };
  }
}

export async function updateLineItem(
  lineItemId: string,
  lineItemData: {
    itemId?: string;
    quantity?: number;
    unitCost?: number;
    notes?: string;
  }
) {
  try {
    // First get current line item to calculate total cost
    const { data: currentLineItem, error: fetchError } = await supabase
      .from('purchase_line_items')
      .select('quantity, unitcost')
      .eq('lineitemid', lineItemId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    const updateData: Record<string, any> = {};

    if (lineItemData.itemId) {
      updateData.itemid = lineItemData.itemId;
    }
    if (lineItemData.quantity !== undefined) {
      updateData.quantity = lineItemData.quantity;
    }
    if (lineItemData.unitCost !== undefined) {
      updateData.unitcost = lineItemData.unitCost;
    }
    if (lineItemData.notes !== undefined) {
      updateData.notes = lineItemData.notes || null;
    }

    // Calculate new total cost
    const finalQuantity = lineItemData.quantity ?? currentLineItem.quantity;
    const finalUnitCost = lineItemData.unitCost ?? currentLineItem.unitcost;
    updateData.totalcost = finalQuantity * finalUnitCost;

    const { data, error } = await supabase
      .from('purchase_line_items')
      .update(updateData)
      .eq('lineitemid', lineItemId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    revalidatePath('/purchases');

    return { success: true, data };
  } catch (error) {
    console.error('Failed to update line item:', error);
    return { success: false, error: 'Failed to update line item' };
  }
}

export async function deleteLineItem(lineItemId: string) {
  try {
    const { error } = await supabase
      .from('purchase_line_items')
      .delete()
      .eq('lineitemid', lineItemId);

    if (error) {
      throw error;
    }

    revalidatePath('/purchases');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete line item:', error);
    return { success: false, error: 'Failed to delete line item' };
  }
}

export async function finalizeDraftPurchase(purchaseId: string) {
  try {
    // Use the deployed finalize_draft_purchase RPC function for atomic operation
    const { data, error } = await supabase.rpc('finalize_draft_purchase', {
      purchase_id: purchaseId,
    });

    if (error) {
      throw error;
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
