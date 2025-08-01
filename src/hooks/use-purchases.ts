import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
  getDraftPurchases,
  getAllPurchases,
  createDraftPurchase,
  updateDraftPurchase,
  finalizeDraftPurchase,
  deleteDraftPurchase,
  addLineItem,
  updateLineItem,
  deleteLineItem,
} from '@/app/actions/purchases';
import { Purchase, PurchaseLineItem } from '@/types';

// Extended Purchase type for UI with relationships
interface PurchaseWithRelations extends Omit<Purchase, 'lineItems'> {
  supplier?: { name: string };
  lineItems: Array<{
    lineItemId: string;
    purchaseId: string;
    itemId: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
    notes?: string;
    item?: { name: string; sku: string };
  }>;
}

// Query keys for consistent caching
export const purchasesKeys = {
  all: ['purchases'] as const,
  lists: () => [...purchasesKeys.all, 'list'] as const,
  list: (filters: { draftsOnly?: boolean }) =>
    [...purchasesKeys.lists(), filters] as const,
  detail: (id: string) => [...purchasesKeys.all, 'detail', id] as const,
};

// Hook for fetching purchases with caching
export function usePurchases(draftsOnly = false) {
  return useQuery({
    queryKey: purchasesKeys.list({ draftsOnly }),
    queryFn: async () => {
      try {
        // Use Supabase client directly for testing
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
          .eq('isdraft', draftsOnly)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          throw new Error(error.message);
        }

        console.log('Direct Supabase result:', data);

        // Handle empty results
        if (!data || data.length === 0) {
          console.log('No purchases found in database');
          return [];
        }

        // Transform database fields to match TypeScript interface
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedPurchases: PurchaseWithRelations[] = data.map(
          (dbPurchase: any) => {
            console.log('Raw database purchase:', dbPurchase);

            return {
              purchaseId: dbPurchase.purchaseid,
              displayId: dbPurchase.displayid,
              supplierid: dbPurchase.supplierid,
              purchaseDate: new Date(dbPurchase.purchasedate),
              effectiveDate: new Date(dbPurchase.effectivedate),
              total: Number(dbPurchase.total) || 0, // Database field
              grandTotal: Number(dbPurchase.total) || 0, // Convert numeric string to number for UI compatibility
              shipping: Number(dbPurchase.shipping) || 0,
              taxes: Number(dbPurchase.othercosts) || 0,
              otherCosts: Number(dbPurchase.othercosts) || 0,
              notes: dbPurchase.notes || '',
              isDraft: Boolean(dbPurchase.isdraft),
              created_at: new Date(dbPurchase.created_at),
              updated_at: dbPurchase.updated_at
                ? new Date(dbPurchase.updated_at)
                : new Date(),
              supplier: dbPurchase.supplier,
              lineItems: (dbPurchase.line_items || []).map(
                (dbLineItem: any) => ({
                  lineItemId: dbLineItem.lineitemid,
                  purchaseId: dbLineItem.purchaseid,
                  itemId: dbLineItem.itemid,
                  quantity: Number(dbLineItem.quantity) || 0,
                  unitCost: Number(dbLineItem.unitcost) || 0,
                  totalCost: Number(dbLineItem.totalcost) || 0,
                  notes: dbLineItem.notes || '',
                  item: dbLineItem.item,
                })
              ),
            };
          }
        );

        console.log('Transformed purchases:', transformedPurchases);
        return transformedPurchases;
      } catch (error) {
        console.error('Error in usePurchases:', error);
        throw error;
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for creating a draft purchase
export function useCreateDraftPurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (purchaseData: {
      supplierid: string;
      purchaseDate: string;
      effectiveDate: string;
      grandTotal: number; // Keep grandTotal for UI interface
      shipping?: number;
      taxes?: number;
      otherCosts?: number;
      notes?: string;
    }) => {
      // Map grandTotal to total for database
      const dbPurchaseData = {
        ...purchaseData,
        total: purchaseData.grandTotal,
      };
      delete (dbPurchaseData as any).grandTotal;

      const result = await createDraftPurchase(dbPurchaseData);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidate purchases lists to refetch data
      queryClient.invalidateQueries({ queryKey: purchasesKeys.lists() });
    },
  });
}

// Hook for updating a draft purchase
export function useUpdateDraftPurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      purchaseId,
      updates,
    }: {
      purchaseId: string;
      updates: {
        supplierid?: string;
        purchaseDate?: string;
        effectiveDate?: string;
        grandTotal?: number; // Keep grandTotal for UI interface
        shipping?: number;
        taxes?: number;
        otherCosts?: number;
        notes?: string;
      };
    }) => {
      // Map grandTotal to total for database if provided
      const dbUpdates = { ...updates };
      if (updates.grandTotal !== undefined) {
        (dbUpdates as any).total = updates.grandTotal;
        delete (dbUpdates as any).grandTotal;
      }

      const result = await updateDraftPurchase(purchaseId, dbUpdates);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchasesKeys.lists() });
    },
  });
}

// Hook for finalizing a draft purchase
export function useFinalizeDraftPurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (purchaseId: string) => {
      const result = await finalizeDraftPurchase(purchaseId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      // Invalidate purchases and items queries since inventory updates
      queryClient.invalidateQueries({ queryKey: purchasesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

// Hook for deleting a draft purchase
export function useDeleteDraftPurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (purchaseId: string) => {
      const result = await deleteDraftPurchase(purchaseId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchasesKeys.lists() });
    },
  });
}

// Hook for adding a line item
export function useAddLineItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      purchaseId,
      lineItemData,
    }: {
      purchaseId: string;
      lineItemData: {
        itemId: string;
        quantity: number;
        unitCost: number;
        notes?: string;
      };
    }) => {
      const result = await addLineItem(purchaseId, lineItemData);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchasesKeys.lists() });
    },
  });
}

// Hook for updating a line item
export function useUpdateLineItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lineItemId,
      updates,
    }: {
      lineItemId: string;
      updates: {
        itemId?: string;
        quantity?: number;
        unitCost?: number;
        notes?: string;
      };
    }) => {
      const result = await updateLineItem(lineItemId, updates);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchasesKeys.lists() });
    },
  });
}

// Hook for deleting a line item
export function useDeleteLineItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lineItemId: string) => {
      const result = await deleteLineItem(lineItemId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchasesKeys.lists() });
    },
  });
}
