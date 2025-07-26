'use client';

import { useState, useMemo } from 'react';
import { CleanSupplier, SupplierFilters, SupplierSelection, ViewMode } from './types';

export const useSupplierFilters = () => {
  const [filters, setFilters] = useState<SupplierFilters>({
    search: '',
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const updateFilter = (key: keyof SupplierFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', status: 'all', sortBy: 'name', sortOrder: 'asc' });
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
