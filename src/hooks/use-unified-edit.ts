'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Supplier } from '@/lib/supabase/suppliers';

export type EditMode = 'none' | 'single' | 'all';

export const useUnifiedEdit = () => {
  const [editMode, setEditMode] = useState<EditMode>('none');
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<Map<string, Partial<Supplier>>>(new Map());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Use ref to access current state without dependencies
  const editedDataRef = useRef(editedData);
  
  // Keep ref in sync with state
  useEffect(() => {
    editedDataRef.current = editedData;
  }, [editedData]);

  // Enter single row edit mode
  const enterSingleEdit = useCallback((rowId: string) => {
    setEditMode('single');
    setEditingRowId(rowId);
    // Don't clear existing edited data - preserve any unsaved changes
    // setEditedData(new Map()); // REMOVED - was causing edits to disappear
    // Only update unsaved changes flag if we actually have data
    setHasUnsavedChanges(editedDataRef.current.size > 0);
  }, []);

  // Enter spreadsheet edit mode (all rows)
  const enterAllEdit = useCallback(() => {
    setEditMode('all');
    setEditingRowId(null);
    // Don't clear existing edited data - preserve any unsaved changes
    // setEditedData(new Map()); // REMOVED - was causing edits to disappear
    // Only update unsaved changes flag if we actually have data
    setHasUnsavedChanges(editedDataRef.current.size > 0);
  }, []);

  // Exit edit mode
  const exitEdit = useCallback(() => {
    setEditMode('none');
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
    const editedRowData = editedDataRef.current.get(rowId);
  return editedRowData ? { ...originalData, ...editedRowData } : originalData;
  }, []);

  // Check if a row has changes
  const hasRowChanges = useCallback((rowId: string) => {
    return editedDataRef.current.has(rowId);
  }, []);

  // Check if a row is editable in current mode
  const isRowEditable = useCallback((rowId: string) => {
    if (editMode === 'none') return false;
    if (editMode === 'single') return rowId === editingRowId;
    if (editMode === 'all') return true;
    return false;
  }, [editMode, editingRowId]);

  // Get count of changed rows
  const getChangedRowsCount = useCallback(() => {
    return editedDataRef.current.size;
  }, []);

  // Get all changes
  const getAllChanges = useCallback(() => {
    return Array.from(editedDataRef.current.entries()).map(([rowId, changes]) => ({
      rowId,
      changes,
    }));
  }, []);

  // Toggle single row edit
  const toggleSingleEdit = useCallback((rowId: string) => {
    if (editMode === 'single' && editingRowId === rowId) {
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
