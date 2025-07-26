'use client';

import { useState, useMemo, useEffect } from 'react';
import { CleanSupplier, SupplierFilters, SupplierSelection, ViewMode } from './types';

// Session storage key for filters
const FILTERS_STORAGE_KEY = 'suppliers_filters';

// Default filters
const DEFAULT_FILTERS: SupplierFilters = {
  search: '',
  status: 'active', // Default to active suppliers
  sortBy: 'name',
  sortOrder: 'asc'
};

export const useSupplierFilters = () => {
  // Initialize filters from session storage or defaults
  const [filters, setFilters] = useState<SupplierFilters>(() => {
    if (typeof window === 'undefined') return DEFAULT_FILTERS;
    
    try {
      const stored = sessionStorage.getItem(FILTERS_STORAGE_KEY);
      return stored ? { ...DEFAULT_FILTERS, ...JSON.parse(stored) } : DEFAULT_FILTERS;
    } catch {
      return DEFAULT_FILTERS;
    }
  });

  // Persist filters to session storage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
    } catch {
      // Ignore storage errors
    }
  }, [filters]);

  const updateFilter = (key: keyof SupplierFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return {
    filters,
    updateFilter,
    clearFilters
  };
};

export const useSupplierSelection = () => {
  const [selection, setSelection] = useState<SupplierSelection>({
    selectedIds: new Set(),
    lastSelectedIndex: -1
  });

  const toggleSelection = (id: string, index: number, isShiftClick = false) => {
    setSelection(prev => {
      const newSelectedIds = new Set(prev.selectedIds);
      
      if (isShiftClick && prev.lastSelectedIndex >= 0) {
        // Handle range selection
        const start = Math.min(prev.lastSelectedIndex, index);
        const end = Math.max(prev.lastSelectedIndex, index);
        // This would need supplier data to implement properly
        // For now, just toggle the single item
        if (newSelectedIds.has(id)) {
          newSelectedIds.delete(id);
        } else {
          newSelectedIds.add(id);
        }
      } else {
        // Single selection
        if (newSelectedIds.has(id)) {
          newSelectedIds.delete(id);
        } else {
          newSelectedIds.add(id);
        }
      }

      return {
        selectedIds: newSelectedIds,
        lastSelectedIndex: index
      };
    });
  };

  const clearSelection = () => {
    setSelection({
      selectedIds: new Set(),
      lastSelectedIndex: -1
    });
  };

  const selectAll = (ids: string[]) => {
    setSelection({
      selectedIds: new Set(ids),
      lastSelectedIndex: -1
    });
  };

  return {
    selection,
    toggleSelection,
    clearSelection,
    selectAll
  };
};

export const useSupplierViewMode = () => {
  const [mode, setMode] = useState<ViewMode>(ViewMode.VIEW);
  const [editingId, setEditingId] = useState<string | null>(null);

  const enterEditMode = (id: string) => {
    setMode(ViewMode.EDIT);
    setEditingId(id);
  };

  const enterBulkMode = () => {
    setMode(ViewMode.BULK);
    setEditingId(null);
  };

  const enterViewMode = () => {
    setMode(ViewMode.VIEW);
    setEditingId(null);
  };

  return {
    mode,
    editingId,
    enterEditMode,
    enterBulkMode,
    enterViewMode
  };
};

export const useFilteredSuppliers = (suppliers: CleanSupplier[], filters: SupplierFilters) => {
  return useMemo(() => {
    let filtered = suppliers;

    // Status filter
    if (filters.status === 'active') {
      filtered = filtered.filter(s => !s.isArchived);
    } else if (filters.status === 'archived') {
      filtered = filtered.filter(s => s.isArchived);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchLower) ||
        s.website?.toLowerCase().includes(searchLower) ||
        s.phone?.toLowerCase().includes(searchLower) ||
        s.email?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [suppliers, filters]);
};
