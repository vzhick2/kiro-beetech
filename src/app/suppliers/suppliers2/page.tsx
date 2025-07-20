'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Filter, X, Plus } from 'lucide-react';
import { SuppliersTableV2 } from '@/components/suppliers/suppliers-table-v2';
import { AddSupplierModal } from '@/components/suppliers/add-supplier-modal';

export default function Suppliers2Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchQuery('');
  };

  const hasActiveFilters = searchQuery;

  return (
    <div className="space-y-6 page-container">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Suppliers (Modern)
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              TanStack Table v8 implementation with inline editing
            </p>
          </div>
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
                placeholder="Search suppliers by name, phone, or address..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="flex items-center border-amber-200 hover:bg-amber-50"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-amber-600 hover:text-amber-700"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Advanced filtering options coming soon...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modern Suppliers Table */}
      <SuppliersTableV2 searchQuery={searchQuery} />
    </div>
  );
} 