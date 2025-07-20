import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  bulkDeleteSuppliers,
  bulkArchiveSuppliers,
} from '@/app/actions/suppliers';
import { Supplier, CreateSupplierRequest } from '@/types';

// Query keys for consistent caching
export const suppliersKeys = {
  all: ['suppliers'] as const,
  lists: () => [...suppliersKeys.all, 'list'] as const,
  list: (filters: { searchQuery?: string }) =>
    [...suppliersKeys.lists(), filters] as const,
};

// Hook for fetching suppliers with caching
export function useSuppliers(searchQuery = '') {
  return useQuery({
    queryKey: suppliersKeys.list({ searchQuery }),
    queryFn: async () => {
      const result = await getSuppliers();
      if (!result.success) {
        throw new Error(result.error);
      }

      // Transform database fields to match TypeScript interface
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedSuppliers: Supplier[] = (result.data || []).map(
        (dbSupplier: any) => ({
          supplierId: dbSupplier.supplierid,
          name: dbSupplier.name,
          contactPhone: dbSupplier.contactphone,
          address: dbSupplier.address,
          notes: dbSupplier.notes,
          isArchived: dbSupplier.isarchived || false,
          created_at: new Date(dbSupplier.created_at),
        })
      );

      return transformedSuppliers;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

// Hook for creating a supplier
export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (supplierData: CreateSupplierRequest) => {
      const result = await createSupplier(supplierData);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: newSupplier => {
      // Add to suppliers list cache
      queryClient.setQueriesData(
        { queryKey: suppliersKeys.lists() },
        (oldData: Supplier[] | undefined) => {
          if (!oldData) {
            return [newSupplier];
          }
          return [newSupplier, ...oldData];
        }
      );

      // Invalidate related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: suppliersKeys.lists() });
    },
  });
}

// Hook for updating a supplier
export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      supplierId,
      updates,
    }: {
      supplierId: string;
      updates: Record<string, unknown>;
    }) => {
      const result = await updateSupplier(supplierId, updates);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (updatedSupplier, { supplierId }) => {
      // Update the suppliers list cache
      queryClient.setQueriesData(
        { queryKey: suppliersKeys.lists() },
        (oldData: Supplier[] | undefined) => {
          if (!oldData) {
            return oldData;
          }
          return oldData.map(supplier =>
            supplier.supplierId === supplierId
              ? { ...supplier, ...updatedSupplier }
              : supplier
          );
        }
      );

      // Invalidate related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: suppliersKeys.lists() });
    },
  });
}

// Hook for deleting a supplier
export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (supplierId: string) => {
      const result = await deleteSupplier(supplierId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: (_, supplierId) => {
      // Remove from suppliers list cache
      queryClient.setQueriesData(
        { queryKey: suppliersKeys.lists() },
        (oldData: Supplier[] | undefined) => {
          if (!oldData) {
            return oldData;
          }
          return oldData.filter(supplier => supplier.supplierId !== supplierId);
        }
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: suppliersKeys.lists() });
    },
  });
}

// Hook for bulk deleting suppliers
export function useBulkDeleteSuppliers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (supplierIds: string[]) => {
      const result = await bulkDeleteSuppliers(supplierIds);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: (_, supplierIds) => {
      // Remove from suppliers list cache
      queryClient.setQueriesData(
        { queryKey: suppliersKeys.lists() },
        (oldData: Supplier[] | undefined) => {
          if (!oldData) {
            return oldData;
          }
          return oldData.filter(
            supplier => !supplierIds.includes(supplier.supplierId)
          );
        }
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: suppliersKeys.lists() });
    },
  });
}

// Hook for bulk archiving suppliers
export function useBulkArchiveSuppliers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (supplierIds: string[]) => {
      const result = await bulkArchiveSuppliers(supplierIds);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: (_, supplierIds) => {
      // Update suppliers list cache
      queryClient.setQueriesData(
        { queryKey: suppliersKeys.lists() },
        (oldData: Supplier[] | undefined) => {
          if (!oldData) {
            return oldData;
          }
          return oldData.map(supplier =>
            supplierIds.includes(supplier.supplierId)
              ? { ...supplier, isArchived: true }
              : supplier
          );
        }
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: suppliersKeys.lists() });
    },
  });
}
