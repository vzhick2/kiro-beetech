'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInfiniteSuppliersData } from '@/hooks/use-infinite-suppliers';
import { transformSupplier } from './utils';
import { EditableRow } from './editable-row';
import { 
  useSupplierFilters, 
  useSupplierSelection, 
  useSupplierViewMode 
} from './hooks';
import type { CleanSupplier } from './types';
import { Database } from '@/types/database.generated';

type SupplierRow = Database['public']['Tables']['suppliers']['Row'];

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
    pageSize: 20
  });

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Sorting handler
  const handleSort = (column: 'name' | 'website' | 'createdAt') => {
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

  const transformedSuppliers = (suppliers as SupplierRow[]).map(transformSupplier);

  return (
    <div className="space-y-4">
      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {loadedCount} of {totalCount} suppliers
        {filters.search && (
          <span className="ml-2 text-blue-600">
            • Filtered by &ldquo;{filters.search}&rdquo;
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
            <button 
              onClick={() => handleSort('website')}
              className="col-span-2 text-left hover:text-gray-900 flex items-center gap-1"
            >
              Website
              {filters.sortBy === 'website' && (
                <span className="text-xs">
                  {filters.sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Actions</div>
          </div>
        </div>

        {/* Supplier Rows */}
        <div className="divide-y divide-gray-200">
          {transformedSuppliers.map((supplier: CleanSupplier, index) => (
            <div key={supplier.id}>
              {/* Main Row */}
              <div className="relative">
                {editingId === supplier.id ? (
                  <EditableRow
                    supplier={supplier}
                    onSave={onSupplierUpdateAction}
                    onCancel={enterViewMode}
                  />
                ) : (
                  <div className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors">
                    {/* Expand/Collapse Button */}
                    <div className="col-span-1 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selection.selectedIds.has(supplier.id)}
                        onChange={() => toggleSelection(supplier.id, index)}
                        className="rounded"
                      />
                      <button
                        onClick={() => toggleRowExpansion(supplier.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {expandedRows.has(supplier.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    
                    {/* Name */}
                    <div className="col-span-3 font-medium">
                      {supplier.name}
                    </div>
                    
                    {/* Phone */}
                    <div className="col-span-2 text-gray-600">
                      {supplier.phone || '-'}
                    </div>
                    
                    {/* Website */}
                    <div className="col-span-2">
                      {supplier.website ? (
                        <a 
                          href={supplier.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {supplier.website}
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                    
                    {/* Status */}
                    <div className="col-span-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        supplier.isArchived 
                          ? 'bg-gray-100 text-gray-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {supplier.isArchived ? 'Archived' : 'Active'}
                      </span>
                    </div>
                    
                    {/* Actions */}
                    <div className="col-span-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => enterEditMode(supplier.id)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Expanded Content */}
              {expandedRows.has(supplier.id) && (
                <div className="bg-gray-50 px-4 py-3 border-t">
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                      <div className="space-y-1">
                        <div><span className="text-gray-500">Email:</span> {supplier.email || 'Not provided'}</div>
                        <div><span className="text-gray-500">Phone:</span> {supplier.phone || 'Not provided'}</div>
                        <div><span className="text-gray-500">Website:</span> {supplier.website || 'Not provided'}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                      <div className="bg-white p-3 rounded border">
                        {supplier.notes ? (
                          <p className="text-gray-700 whitespace-pre-wrap">{supplier.notes}</p>
                        ) : (
                          <p className="text-gray-400 italic">No notes available</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Loading More Indicator */}
        {hasMore && (
          <div 
            ref={loadMoreRef}
            className="flex items-center justify-center py-8 border-t"
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
          <div className="text-center py-6 text-gray-500 border-t">
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
                `No suppliers found matching &ldquo;${filters.search}&rdquo;` : 
                'No suppliers found'
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
