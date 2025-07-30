'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Supplier } from '@/lib/supabase/suppliers';

export type EditMode = 'viewing' | 'quickEdit' | 'bulkEdit';

// Legacy mappings for backward compatibility
export type LegacyEditMode = 'none' | 'single' | 'all';

export const useUnifiedEdit = () => {
  const [editMode, setEditMode] = useState<EditMode>('viewing');
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<Map<string, Partial<Supplier>>>(new Map());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Use ref to access current state without dependencies
  const editedDataRef = useRef(editedData);
  
  // Keep ref in sync with state
  useEffect(() => {
    editedDataRef.current = editedData;
  }, [editedData]);

  // Enter quick edit mode (single row)
  const enterSingleEdit = useCallback((rowId: string) => {
    setEditMode('quickEdit');
    setEditingRowId(rowId);
    // Don't clear existing edited data - preserve any unsaved changes
    // setEditedData(new Map()); // REMOVED - was causing edits to disappear
    // Only update unsaved changes flag if we actually have data
    setHasUnsavedChanges(editedData.size > 0);
  }, [editedData]);

  // Enter bulk edit mode (all rows)
  const enterAllEdit = useCallback(() => {
    setEditMode('bulkEdit');
    setEditingRowId(null);
    // Don't clear existing edited data - preserve any unsaved changes
    // setEditedData(new Map()); // REMOVED - was causing edits to disappear
    // Only update unsaved changes flag if we actually have data
    setHasUnsavedChanges(editedData.size > 0);
  }, [editedData]);

  // Exit edit mode
  const exitEdit = useCallback(() => {
    setEditMode('viewing');
    setEditingRowId(null);
    setEditedData(new Map());
    setHasUnsavedChanges(false);
  }, []);

  // Update data for a specific row
  const updateRowData = useCallback((rowId: string, field: keyof Supplier, value: any) => {
    setEditedData(prev => {
      const newMap = new Map(prev);
      const existingData = newMap.get(rowId) || {};
      newMap.set(rowId, { ...existingData, [field]: value });
      return newMap;
    });
    setHasUnsavedChanges(true);
  }, []);

  // Undo changes for a specific row
  const undoRowChanges = useCallback((rowId: string) => {
    setEditedData(prev => {
      const newMap = new Map(prev);
      newMap.delete(rowId);
      return newMap;
    });
    // Update unsaved changes flag after state update
    setTimeout(() => {
      setHasUnsavedChanges(editedDataRef.current.size > 0);
    }, 0);
  }, []);

  // Get data for a specific row (original + changes)
  const getRowData = useCallback((rowId: string, originalData: Supplier): Supplier => {
    const editedRowData = editedData.get(rowId);
    return editedRowData ? { ...originalData, ...editedRowData } : originalData;
  }, [editedData]);

  // Check if a row has changes
  const hasRowChanges = useCallback((rowId: string) => {
    return editedData.has(rowId);
  }, [editedData]);

  // Check if a row is editable in current mode
  const isRowEditable = useCallback((rowId: string) => {
    if (editMode === 'viewing') return false;
    if (editMode === 'quickEdit') return rowId === editingRowId;
    if (editMode === 'bulkEdit') return true;
    return false;
  }, [editMode, editingRowId]);

  // Get count of changed rows
  const getChangedRowsCount = useCallback(() => {
    return editedData.size;
  }, [editedData]);

  // Get all changes
  const getAllChanges = useCallback(() => {
    return Array.from(editedData.entries()).map(([rowId, changes]) => ({
      rowId,
      changes,
    }));
  }, [editedData]);

  // Toggle single row edit
  const toggleSingleEdit = useCallback((rowId: string) => {
    if (editMode === 'quickEdit' && editingRowId === rowId) {
      exitEdit();
    } else {
      enterSingleEdit(rowId);
    }
  }, [editMode, editingRowId, exitEdit, enterSingleEdit]);

  return {
    editMode,
    editingRowId,
    hasUnsavedChanges,
    enterSingleEdit,
    enterAllEdit,
    exitEdit,
    toggleSingleEdit,
    updateRowData,
    undoRowChanges,
    getRowData,
    hasRowChanges,
    isRowEditable,
    getChangedRowsCount,
    getAllChanges,
  };
};
