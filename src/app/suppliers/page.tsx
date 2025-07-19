'use client';

import { Suspense, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { AddSupplierModal } from '@/components/suppliers/add-supplier-modal';
import { SuppliersTable } from '@/components/suppliers/suppliers-table';

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const hasActiveFilters = searchQuery;

  return (
    <div className="space-y-6 page-container">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
          <h1 className="text-2xl font-semibold text-gray-800">Suppliers</h1>
          <div className="flex items-center space-x-3">
            <AddSupplierModal />
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search suppliers by name, email, or phone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              className="flex items-center border-blue-200 hover:bg-blue-50"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-500">Active filters:</span>
              {searchQuery && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Search: &quot;{searchQuery}&quot;
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Suppliers Table */}
      <Suspense fallback={<SuppliersTableSkeleton />}>
        <SuppliersTable searchQuery={searchQuery} />
      </Suspense>
    </div>
  );
}

function SuppliersTableSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
