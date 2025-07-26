'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getSuppliers } from '@/app/actions/suppliers';
import { Database } from '@/types/database.generated';

type SupplierRow = Database['public']['Tables']['suppliers']['Row'];

interface InfiniteSuppliersParams {
  searchTerm?: string;
  status?: 'all' | 'active' | 'archived';
  pageSize?: number;
}

interface SupplierPage {
  data: SupplierRow[];
  nextCursor: number | null;
  total: number;
}

// Enhanced action for paginated suppliers
export async function getPaginatedSuppliers(
  offset = 0, 
  limit = 20, 
  searchTerm = '', 
  status: 'all' | 'active' | 'archived' = 'all'
): Promise<SupplierPage> {
  try {
    const result = await getSuppliers();
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch suppliers');
    }

    let filteredSuppliers = result.data;

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filteredSuppliers = filteredSuppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(search) ||
        supplier.contactphone?.toLowerCase().includes(search) ||
        supplier.website?.toLowerCase().includes(search) ||
        supplier.notes?.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (status !== 'all') {
      const isArchived = status === 'archived';
      filteredSuppliers = filteredSuppliers.filter(supplier => 
        Boolean(supplier.isarchived) === isArchived
      );
    }

    // Apply pagination
    const total = filteredSuppliers.length;
    const paginatedData = filteredSuppliers.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return {
      data: paginatedData,
      nextCursor: hasMore ? offset + limit : null,
      total
    };
  } catch (error) {
    console.error('Error fetching paginated suppliers:', error);
    throw error;
  }
}

export function useInfiniteSuppliers({
  searchTerm = '',
  status = 'all',
  pageSize = 50
}: InfiniteSuppliersParams = {}) {
  return useInfiniteQuery({
    queryKey: ['suppliers', 'infinite', searchTerm, status, pageSize],
    queryFn: ({ pageParam = 0 }) => 
      getPaginatedSuppliers(pageParam, pageSize, searchTerm, status),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Hook for getting flattened data and utilities
export function useInfiniteSuppliersData(params: InfiniteSuppliersParams = {}) {
  const query = useInfiniteSuppliers(params);
  
  const allSuppliers = query.data?.pages.flatMap(page => page.data) ?? [];
  const totalCount = query.data?.pages[0]?.total ?? 0;
  const loadedCount = allSuppliers.length;
  
  return {
    ...query,
    suppliers: allSuppliers,
    totalCount,
    loadedCount,
    hasMore: query.hasNextPage,
    loadMore: query.fetchNextPage,
    isLoadingMore: query.isFetchingNextPage,
  };
}
