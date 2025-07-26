'use client';

import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SupplierFilters } from './types';

interface FilterBarProps {
  filters: SupplierFilters;
  onFilterChange: (key: keyof SupplierFilters, value: string) => void;
  onClearFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

export const FilterBar = ({
  filters,
  onFilterChange,
  onClearFilters,
  totalCount,
  filteredCount
}: FilterBarProps) => {
  const hasActiveFilters = filters.search || filters.status !== 'all';

  return (
    <div className="bg-white rounded-lg border border-gray-200/60 p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search suppliers..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="pl-10 pr-10"
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => onFilterChange('search', '')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange('status', value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count and clear filters */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            {filteredCount === totalCount 
              ? `${totalCount} suppliers`
              : `${filteredCount} of ${totalCount} suppliers`
            }
          </span>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
