import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getItems,
  updateItem,
  deleteItem,
  bulkDeleteItems,
  bulkArchiveItems,
  getItemDetails,
} from '@/app/actions/items';
import { Item } from '@/types';
import type { Tables } from '@/types/database';

// Type for the database response from getItems
type ItemFromDB = Tables<'items'> & {
  lastUsedSupplier: string | null;
  primary_supplier: { name: string } | null;
};

// Query keys for consistent caching
export const itemsKeys = {
  all: ['items'] as const,
  lists: () => [...itemsKeys.all, 'list'] as const,
  list: (filters: { searchQuery?: string; typeFilter?: string }) =>
    [...itemsKeys.lists(), filters] as const,
  details: () => [...itemsKeys.all, 'detail'] as const,
  detail: (id: string) => [...itemsKeys.details(), id] as const,
};

// Hook for fetching items with caching
export function useItems(searchQuery = '', typeFilter = 'all') {
  return useQuery({
    queryKey: itemsKeys.list({ searchQuery, typeFilter }),
    queryFn: async () => {
      try {
        const result = await getItems();
        if (!result.success) {
          throw new Error(result.error);
        }

        // Transform database fields to match TypeScript interface
        const transformedItems: Item[] = (result.data || []).map(
          (dbItem: any) => ({
            itemId: dbItem.itemid,
            name: dbItem.name,
            SKU: dbItem.sku,
            type: dbItem.type,
            inventoryUnit: dbItem.inventoryunit,
            currentQuantity: dbItem.currentquantity || 0,
            weightedAverageCost: dbItem.weightedaveragecost || 0,
            reorderPoint: dbItem.reorderpoint || 0,
            lastCountedDate: dbItem.lastcounteddate
              ? new Date(dbItem.lastcounteddate)
              : new Date(),
            primarySupplierId: dbItem.primarysupplierid || undefined,
            leadTimeDays: dbItem.leadtimedays || 7,
            isArchived: dbItem.isarchived || false,
            created_at: new Date(dbItem.created_at || new Date()),
            updated_at: dbItem.updated_at
              ? new Date(dbItem.updated_at)
              : new Date(),
            lastUsedSupplier: dbItem.lastUsedSupplier || undefined,
            primarySupplierName: dbItem.primary_supplier?.name || undefined,
          })
        );

        return transformedItems;
      } catch (error) {
        console.error('Error in useItems hook:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime),
    retry: 1,
    retryDelay: 1000,
  });
}

// Hook for fetching item details
export function useItemDetails(itemId: string) {
  return useQuery({
    queryKey: itemsKeys.detail(itemId),
    queryFn: async () => {
      const result = await getItemDetails(itemId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!itemId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook for updating an item
export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      updates,
    }: {
      itemId: string;
      updates: Record<string, unknown>;
    }) => {
      const result = await updateItem(itemId, updates);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (updatedItem, { itemId }) => {
      // Update the items list cache
      queryClient.setQueriesData(
        { queryKey: itemsKeys.lists() },
        (oldData: Item[] | undefined) => {
          if (!oldData) {
            return oldData;
          }
          return oldData.map(item =>
            item.itemId === itemId ? { ...item, ...updatedItem } : item
          );
        }
      );

      // Update the specific item detail cache
      queryClient.setQueryData(
        itemsKeys.detail(itemId),
        (oldData: { item: Item; transactions: unknown[] } | undefined) => {
          if (!oldData) {
            return oldData;
          }
          return { ...oldData, item: { ...oldData.item, ...updatedItem } };
        }
      );

      // Invalidate related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: itemsKeys.lists() });
    },
  });
}

// Hook for deleting an item
export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      const result = await deleteItem(itemId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: (_, itemId) => {
      // Remove from items list cache
      queryClient.setQueriesData(
        { queryKey: itemsKeys.lists() },
        (oldData: Item[] | undefined) => {
          if (!oldData) {
            return oldData;
          }
          return oldData.filter(item => item.itemId !== itemId);
        }
      );

      // Remove item detail cache
      queryClient.removeQueries({ queryKey: itemsKeys.detail(itemId) });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: itemsKeys.lists() });
    },
  });
}

// Hook for bulk deleting items
export function useBulkDeleteItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemIds: string[]) => {
      const result = await bulkDeleteItems(itemIds);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: (_, itemIds) => {
      // Remove from items list cache
      queryClient.setQueriesData(
        { queryKey: itemsKeys.lists() },
        (oldData: Item[] | undefined) => {
          if (!oldData) {
            return oldData;
          }
          return oldData.filter(item => !itemIds.includes(item.itemId));
        }
      );

      // Remove item detail caches
      itemIds.forEach(itemId => {
        queryClient.removeQueries({ queryKey: itemsKeys.detail(itemId) });
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: itemsKeys.lists() });
    },
  });
}

// Hook for bulk archiving items
export function useBulkArchiveItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemIds: string[]) => {
      const result = await bulkArchiveItems(itemIds);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: (_, itemIds) => {
      // Update items list cache
      queryClient.setQueriesData(
        { queryKey: itemsKeys.lists() },
        (oldData: Item[] | undefined) => {
          if (!oldData) {
            return oldData;
          }
          return oldData.map(item =>
            itemIds.includes(item.itemId) ? { ...item, isArchived: true } : item
          );
        }
      );

      // Update item detail caches
      itemIds.forEach(itemId => {
        queryClient.setQueryData(
          itemsKeys.detail(itemId),
          (oldData: { item: Item; transactions: unknown[] } | undefined) => {
            if (!oldData) {
              return oldData;
            }
            return {
              ...oldData,
              item: { ...oldData.item, isarchived: true },
            };
          }
        );
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: itemsKeys.lists() });
    },
  });
}
