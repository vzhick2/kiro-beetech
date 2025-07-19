'use client'

import { Suspense, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Filter, X } from 'lucide-react'
import { AddItemModal } from '@/components/items/add-item-modal'
import { SpreadsheetTable } from '@/components/items/spreadsheet-table'
import { SeedDataButton } from '@/components/items/seed-data-button'

export default function ItemsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleTypeFilter = useCallback((type: string) => {
    setSelectedType(type)
  }, [])

  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedType('all')
  }, [])

  const hasActiveFilters = searchQuery || selectedType !== 'all'

  return (
    <div className="space-y-6 page-container">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
          <h1 className="text-2xl font-semibold text-gray-800">Inventory Items</h1>
          <div className="flex items-center space-x-3">
            <SeedDataButton />
            <AddItemModal />
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
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search ingredients, packaging, or products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Type
                  </label>
                  <select 
                    value={selectedType}
                    onChange={(e) => handleTypeFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="all">All Types</option>
                    <option value="ingredient">Ingredient</option>
                    <option value="packaging">Packaging</option>
                    <option value="product">Product</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-500">Active filters:</span>
              {searchQuery && (
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                  Search: &quot;{searchQuery}&quot;
                </span>
              )}
              {selectedType !== 'all' && (
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                  Type: {selectedType}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Spreadsheet Table */}
      <Suspense fallback={<SpreadsheetTableSkeleton />}>
        <SpreadsheetTable 
          searchQuery={searchQuery}
          typeFilter={selectedType}
        />
      </Suspense>
    </div>
  )
}

function SpreadsheetTableSkeleton() {
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
  )
}