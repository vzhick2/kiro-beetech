'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { DisplaySupplier, Supplier } from '@/types/data-table';

export const useSpreadsheetMode = () => {
  const [isSpreadsheetMode, setIsSpreadsheetMode] = useState(false);
  const [editedRows, setEditedRows] = useState<Map<string, Partial<DisplaySupplier>>>(
    new Map()
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Use ref to access current state without dependencies
  const editedRowsRef = useRef(editedRows);
  
  // Keep ref in sync with state
  useEffect(() => {
    editedRowsRef.current = editedRows;
  }, [editedRows]);

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

  const undoRowChanges = useCallback((rowId: string) => {
    setEditedRows(prev => {
      const newMap = new Map(prev);
      newMap.delete(rowId);
      setHasUnsavedChanges(newMap.size > 0);
      return newMap;
    });
  }, []);

  const getRowData = useCallback((rowId: string, originalData: DisplaySupplier): DisplaySupplier => {
    const editedData = editedRowsRef.current.get(rowId);
    return editedData ? { ...originalData, ...editedData } : originalData;
  }, []);

  const hasRowChanges = useCallback((rowId: string) => {
    return editedRowsRef.current.has(rowId);
  }, []);

  const getChangedRowsCount = useCallback(() => {
    return editedRowsRef.current.size;
  }, []);

  const getAllChanges = useCallback(() => {
    return Array.from(editedRowsRef.current.entries()).map(([rowId, changes]) => ({
      rowId,
      changes,
    }));
  }, []);

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