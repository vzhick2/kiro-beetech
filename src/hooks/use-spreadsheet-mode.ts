'use client';

import { useState, useCallback } from 'react';
import type { DisplaySupplier, Supplier } from '@/types/data-table';

export const useSpreadsheetMode = () => {
  const [isSpreadsheetMode, setIsSpreadsheetMode] = useState(false);
  const [editedRows, setEditedRows] = useState<Map<string, Partial<DisplaySupplier>>>(
    new Map()
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const enterSpreadsheetMode = useCallback(() => {
    setIsSpreadsheetMode(true);
    setEditedRows(new Map());
    setHasUnsavedChanges(false);
  }, []);

  const exitSpreadsheetMode = useCallback(() => {
    setIsSpreadsheetMode(false);
    setEditedRows(new Map());
    setHasUnsavedChanges(false);
  }, []);

  const updateRowData = useCallback(
    (rowId: string, field: keyof DisplaySupplier, value: any) => {
      setEditedRows(prev => {
        const newMap = new Map(prev);
        const existingData = newMap.get(rowId) || {};
        newMap.set(rowId, { ...existingData, [field]: value });
        return newMap;
      });
      setHasUnsavedChanges(true);
    },
    []
  );

  const undoRowChanges = useCallback(
    (rowId: string) => {
      setEditedRows(prev => {
        const newMap = new Map(prev);
        newMap.delete(rowId);
        return newMap;
      });
      // Update hasUnsavedChanges based on current map state
      setHasUnsavedChanges(prev => {
        // Get the current size after deletion
        return editedRows.size > 1; // Will be 1 less after delete
      });
    },
    [editedRows.size] // Use size instead of whole map to prevent circular deps
  );

  const getRowData = useCallback(
    (rowId: string, originalData: DisplaySupplier): DisplaySupplier => {
      const editedData = editedRows.get(rowId);
      return editedData ? { ...originalData, ...editedData } : originalData;
    },
    [editedRows]
  );

  const hasRowChanges = useCallback(
    (rowId: string) => editedRows.has(rowId),
    [editedRows]
  );

  const getChangedRowsCount = useCallback(() => editedRows.size, [editedRows]);

  const getAllChanges = useCallback(() => {
    return Array.from(editedRows.entries()).map(([rowId, changes]) => ({
      rowId,
      changes,
    }));
  }, [editedRows]);

  return {
    isSpreadsheetMode,
    hasUnsavedChanges,
    enterSpreadsheetMode,
    exitSpreadsheetMode,
    updateRowData,
    undoRowChanges,
    getRowData,
    hasRowChanges,
    getChangedRowsCount,
    getAllChanges,
  };
};