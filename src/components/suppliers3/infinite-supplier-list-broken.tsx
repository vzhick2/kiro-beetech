'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Loader2, ArrowUp, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInfiniteSuppliersData } from '@/hooks/use-infinite-suppliers';
import { SupplierRow } from './supplier-row';
import { EditableRow } from './editable-row';
import { transformSupplier } from './utils';
import { 
  useSupplierFilters, 
  useSupplierSelection, 
  useSupplierViewMode 
} from './hooks';

interface InfiniteSupplierListProps {
  onSupplierUpdateAction: (supplierId: string, data: any) => void;
}

export const InfiniteSupplierList = ({ onSupplierUpdateAction }: InfiniteSupplierListProps) => {
  const { filters, updateFilter } = useSupplierFilters();
  const { selection, toggleSelection } = useSupplierSelection();
  const { mode, editingId, enterEditMode, enterViewMode } = useSupplierViewMode();
  
  // Expandable rows state
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  const {
    suppliers,
    totalCount,
    loadedCount,
    hasMore,
    loadMore,
    isLoadingMore,
    isLoading,
    error
  } = useInfiniteSuppliersData({
    searchTerm: filters.search,
    status: filters.status,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    pageSize: 50
  });

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Sorting handler
  const handleSort = (column: 'name' | 'status' | 'website' | 'createdAt') => {
    const newOrder = filters.sortBy === column && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    updateFilter('sortBy', column);
    updateFilter('sortOrder', newOrder);
  };

  // Expandable row handlers
  const toggleRowExpansion = (supplierId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(supplierId)) {
      newExpanded.delete(supplierId);
    } else {
      newExpanded.add(supplierId);
    }
    setExpandedRows(newExpanded);
  };

  // Intersection Observer for auto-loading
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target?.isIntersecting && hasMore && !isLoadingMore) {
      loadMore();
    }
  }, [hasMore, isLoadingMore, loadMore]);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const option = {
      threshold: 0.1,
      rootMargin: '100px' // Load more when 100px from viewport
    };
    
    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [handleObserver]);

  // Back to top functionality
  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading suppliers...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-red-600">
          Error loading suppliers: {error.message || String(error)}
        </div>
      </div>
    );
  }

  const transformedSuppliers = suppliers.map(transformSupplier);

  return (
    <div className="relative">
      {/* Results Summary */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {loadedCount} of {totalCount} suppliers
        {filters.search && (
          <span className="ml-2 text-blue-600">
            • Filtered by "{filters.search}"
          </span>
        )}
      </div>

      {/* Table Container - Full page flow, no internal scrolling */}
      <div className="border rounded-lg bg-white">
        {/* Table Header with Sorting */}
        <div className="bg-gray-50 border-b">
          <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-700">
            <div className="col-span-1">
              {/* Select All Checkbox */}
            </div>
            <button 
              onClick={() => handleSort('name')}
              className="col-span-3 text-left hover:text-gray-900 flex items-center gap-1"
            >
              Name
              {filters.sortBy === 'name' && (
                <span className="text-xs">
                  {filters.sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
            <div className="col-span-2">Phone</div>
            <div className="col-span-2">Website</div>
            <button 
              onClick={() => handleSort('status')}
              className="col-span-2 text-left hover:text-gray-900 flex items-center gap-1"
            >
              Status
              {filters.sortBy === 'status' && (
                <span className="text-xs">
                  {filters.sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
            <div className="col-span-2">Actions</div>
          </div>
        </div>

          {/* Supplier Rows */}
          <div className="divide-y divide-gray-200">
            {transformedSuppliers.map((supplier, index) => (
              editingId === supplier.id ? (
                <EditableRow
                  key={supplier.id}
                  supplier={supplier}
                  onSave={onSupplierUpdateAction}
                  onCancel={enterViewMode}
                />
              ) : (
                <SupplierRow
                  key={supplier.id}
                  supplier={supplier}
                  isSelected={selection.selectedIds.has(supplier.id)}
                  onToggleSelect={toggleSelection}
                  onEdit={enterEditMode}
                  mode={mode}
                  index={index}
                />
              )
            ))}
          </div>

          {/* Loading More Indicator */}
          {hasMore && (
            <div 
              ref={loadMoreRef}
              className="flex items-center justify-center py-8"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span className="text-gray-600">Loading more suppliers...</span>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => loadMore()}
                  className="min-w-32"
                >
                  Load More
                </Button>
              )}
            </div>
          )}

          {/* End of Results */}
          {!hasMore && suppliers.length > 0 && (
            <div className="text-center py-6 text-gray-500">
              <div className="text-sm">
                All {totalCount} suppliers loaded
              </div>
            </div>
          )}

          {/* No Results */}
          {suppliers.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {filters.search ? 
                  `No suppliers found matching "${filters.search}"` : 
                  'No suppliers found'
                }
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Back to Top Button */}
      {loadedCount > 20 && (
        <Button
          variant="outline"
          size="sm"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-20 shadow-lg"
        >
          <ArrowUp className="h-4 w-4 mr-1" />
          Top
        </Button>
      )}
    </div>
  );
};
