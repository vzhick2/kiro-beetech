'use server';

import { supabaseAdmin } from '@/lib/supabase';
import {
  handleError,
  handleSuccess,
  validationError,
} from '@/lib/error-handling';
import {
  CreateItemSchema,
  UpdateItemSchema,
  BulkItemIdsSchema,
  TrackingModeChangeSchema,
} from '@/lib/validations/items';
// Removed unused type imports

export async function getItems() {
  try {
    // Optimized single query with last used supplier information
    const { data, error } = await supabaseAdmin
      .from('items')
      .select(
        `
        *,
        primary_supplier:suppliers!items_primarysupplierid_fkey(name)
      `
      )
      .order('name');

    if (error) {
      return handleError(error, 'getItems');
    }

    // Get last used supplier for all items in a single optimized query
    const { data: lastUsedSuppliers, error: supplierError } =
      await supabaseAdmin
        .from('purchase_line_items')
        .select(
          `
        itemid,
        purchase:purchases!inner(
          purchasedate,
          supplier:suppliers!inner(name)
        )
      `
        )
        .order('purchase(purchasedate)', { ascending: false });

    if (supplierError) {
      console.error('Error fetching last used suppliers:', supplierError);
      // Continue without last used supplier data rather than failing
    }

    // Create a map of itemid to last used supplier
    const lastUsedSupplierMap = new Map<string, string>();
    if (lastUsedSuppliers) {
      lastUsedSuppliers.forEach(
        (purchase: {
          itemid: string;
          purchase: { supplier: { name: string } };
        }) => {
          if (!lastUsedSupplierMap.has(purchase.itemid)) {
            lastUsedSupplierMap.set(
              purchase.itemid,
              purchase.purchase.supplier.name
            );
          }
        }
      );
    }

    // Merge the data
    const itemsWithLastSupplier = data.map((item: Record<string, unknown>) => {
      return {
        ...item,
        lastUsedSupplier:
          lastUsedSupplierMap.get(item.itemid as string) || null,
      };
    });

    return handleSuccess(itemsWithLastSupplier);
  } catch (error) {
    return handleError(error, 'getItems');
  }
}

export async function createItem(itemData: unknown) {
  try {
    // Validate input data
    const validatedData = CreateItemSchema.parse(itemData);

    // Convert to database format (snake_case)
    const dbData = {
      name: validatedData.name,
      sku: validatedData.sku,
      type: validatedData.type,
      inventoryunit: validatedData.inventoryunit,
      currentquantity: 0, // Default for new items
      weightedaveragecost: 0,
      reorderpoint: validatedData.reorderpoint ?? null,
      primarysupplierid: validatedData.primarysupplierid ?? null,
      leadtimedays: validatedData.leadtimedays,
      tracking_mode: validatedData.trackingmode || 'fully_tracked',
      isarchived: false,
    };

    const { data, error } = await supabaseAdmin
      .from('items')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      return handleError(error, 'createItem');
    }

    return handleSuccess(data);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return validationError('Invalid item data provided');
    }
    return handleError(error, 'createItem');
  }
}

export async function updateItem(itemId: string, updates: unknown) {
  try {
    // Validate input data
    const validatedUpdates = UpdateItemSchema.parse(updates);

    // Convert to database format (snake_case)
    const dbUpdates: Record<string, unknown> = {};
    if (validatedUpdates.name !== undefined) {
      dbUpdates.name = validatedUpdates.name;
    }
    if (validatedUpdates.sku !== undefined) {
      dbUpdates.sku = validatedUpdates.sku;
    }
    if (validatedUpdates.type !== undefined) {
      dbUpdates.type = validatedUpdates.type;
    }
    if (validatedUpdates.inventoryunit !== undefined) {
      dbUpdates.inventoryunit = validatedUpdates.inventoryunit;
    }
    if (validatedUpdates.currentquantity !== undefined) {
      dbUpdates.currentquantity = validatedUpdates.currentquantity;
    }
    if (validatedUpdates.weightedaveragecost !== undefined) {
      dbUpdates.weightedaveragecost = validatedUpdates.weightedaveragecost;
    }
    if (validatedUpdates.reorderpoint !== undefined) {
      dbUpdates.reorderpoint = validatedUpdates.reorderpoint;
    }
    if (validatedUpdates.primarysupplierid !== undefined) {
      dbUpdates.primarysupplierid = validatedUpdates.primarysupplierid;
    }
    if (validatedUpdates.leadtimedays !== undefined) {
      dbUpdates.leadtimedays = validatedUpdates.leadtimedays;
    }
    if (validatedUpdates.trackingmode !== undefined) {
      dbUpdates.tracking_mode = validatedUpdates.trackingmode;
    }
    if (validatedUpdates.isarchived !== undefined) {
      dbUpdates.isarchived = validatedUpdates.isarchived;
    }

    const { data, error } = await supabaseAdmin
      .from('items')
      .update(dbUpdates)
      .eq('itemid', itemId)
      .select()
      .single();

    if (error) {
      return handleError(error, 'updateItem');
    }

    return handleSuccess(data);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return validationError('Invalid update data provided');
    }
    return handleError(error, 'updateItem');
  }
}

export async function deleteItem(itemId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('items')
      .delete()
      .eq('itemid', itemId);

    if (error) {
      return handleError(error, 'deleteItem');
    }

    return handleSuccess({ deleted: true });
  } catch (error) {
    return handleError(error, 'deleteItem');
  }
}

export async function getItemDetails(itemId: string) {
  try {
    // Get item details
    const { data: item, error: itemError } = await supabaseAdmin
      .from('items')
      .select('*')
      .eq('itemid', itemId)
      .single();

    if (itemError) {
      return handleError(itemError, 'getItemDetails');
    }

    // Get recent transactions for this item
    const { data: transactions, error: transactionError } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('itemid', itemId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (transactionError) {
      console.error('Error fetching transactions:', transactionError);
      // Continue without transactions rather than failing
    }

    return handleSuccess({
      item,
      transactions: transactions || [],
    });
  } catch (error) {
    return handleError(error, 'getItemDetails');
  }
}

export async function bulkDeleteItems(itemIds: unknown) {
  try {
    // Validate input data
    const { itemIds: validatedIds } = BulkItemIdsSchema.parse({ itemIds });

    if (validatedIds.length === 0) {
      return handleSuccess({ deletedCount: 0 });
    }

    const { error } = await supabaseAdmin
      .from('items')
      .delete()
      .in('itemid', validatedIds);

    if (error) {
      return handleError(error, 'bulkDeleteItems');
    }

    return handleSuccess({ deletedCount: validatedIds.length });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return validationError('Invalid item IDs provided');
    }
    return handleError(error, 'bulkDeleteItems');
  }
}

export async function bulkArchiveItems(itemIds: unknown) {
  try {
    // Validate input data
    const { itemIds: validatedIds } = BulkItemIdsSchema.parse({ itemIds });

    if (validatedIds.length === 0) {
      return handleSuccess({ archivedCount: 0 });
    }

    const { error } = await supabaseAdmin
      .from('items')
      .update({ isarchived: true })
      .in('itemid', validatedIds);

    if (error) {
      return handleError(error, 'bulkArchiveItems');
    }

    return handleSuccess({ archivedCount: validatedIds.length });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return validationError('Invalid item IDs provided');
    }
    return handleError(error, 'bulkArchiveItems');
  }
}

export async function changeTrackingMode(changeData: unknown) {
  try {
    // Validate input data
    const validatedData = TrackingModeChangeSchema.parse(changeData);

    // Use the database function for safe mode transitions
    const params: {
      p_item_id: string;
      p_new_mode: string;
      p_inventory_snapshot?: number;
      p_reason?: string;
    } = {
      p_item_id: validatedData.itemId,
      p_new_mode: validatedData.newMode,
    };

    if (validatedData.inventorySnapshot !== undefined) {
      params.p_inventory_snapshot = validatedData.inventorySnapshot;
    }
    if (validatedData.reason !== undefined) {
      params.p_reason = validatedData.reason;
    }

    const { data, error } = await supabaseAdmin.rpc(
      'change_item_tracking_mode',
      params
    );

    if (error) {
      return handleError(error, 'changeTrackingMode');
    }

    return handleSuccess(data);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return validationError('Invalid tracking mode change data provided');
    }
    return handleError(error, 'changeTrackingMode');
  }
}

export async function getTwoModeAlerts() {
  try {
    const { data, error } = await supabaseAdmin.rpc('get_two_mode_alerts');

    if (error) {
      return handleError(error, 'getTwoModeAlerts');
    }

    // Map database fields to camelCase for TypeScript
    const mappedData = (data || []).map((alert: any) => ({
      itemId: alert.itemid,
      sku: alert.sku,
      name: alert.name,
      trackingMode: alert.tracking_mode,
      alertType: alert.alert_type,
      alertMessage: alert.alert_message,
      priority: alert.priority,
    }));

    return handleSuccess(mappedData);
  } catch (error) {
    return handleError(error, 'getTwoModeAlerts');
  }
}

export async function getRecipeCostTwoMode(recipeId: string) {
  try {
    const { data, error } = await supabaseAdmin.rpc(
      'calculate_recipe_cost_two_mode',
      {
        p_recipe_id: recipeId,
      }
    );

    if (error) {
      return handleError(error, 'getRecipeCostTwoMode');
    }

    return handleSuccess(data);
  } catch (error) {
    return handleError(error, 'getRecipeCostTwoMode');
  }
}
