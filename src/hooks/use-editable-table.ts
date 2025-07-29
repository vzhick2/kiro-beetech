'use client';

import { useReducer, useMemo, useCallback } from 'react';
import type { Supplier } from '@/lib/supabase/suppliers';

export type EditMode = 'none' | 'single' | 'all';

interface EditState {
  editMode: EditMode;
  activeRowId: string | null;
  pendingChanges: Map<string, Partial<Supplier>>;
}

type EditAction =
  | { type: 'START_SINGLE_EDIT'; payload: { rowId: string } }
  | { type: 'START_BULK_EDIT' }
  | { type: 'EXIT_EDIT' }
  | { type: 'UPDATE_CELL'; payload: { rowId: string; columnId: keyof Supplier; value: any } }
  | { type: 'UNDO_ROW_CHANGES'; payload: { rowId: string } }
  | { type: 'CANCEL_ALL_CHANGES' }
  | { type: 'SAVE_CHANGES_SUCCESS' };

const initialState: EditState = {
  editMode: 'none',
  activeRowId: null,
  pendingChanges: new Map(),
};

function editReducer(state: EditState, action: EditAction): EditState {
  switch (action.type) {
    case 'START_SINGLE_EDIT':
      return {
        ...state,
        editMode: 'single',
        activeRowId: action.payload.rowId,
      };

    case 'START_BULK_EDIT':
      return {
        ...state,
        editMode: 'all',
        activeRowId: null,
      };

    case 'EXIT_EDIT':
      return {
        ...state,
        editMode: 'none',
        activeRowId: null,
      };

    case 'UPDATE_CELL': {
      const { rowId, columnId, value } = action.payload;
      const newPendingChanges = new Map(state.pendingChanges);
      const existingRowChanges = newPendingChanges.get(rowId) || {};
      newPendingChanges.set(rowId, { ...existingRowChanges, [columnId]: value });
      
      return {
        ...state,
        pendingChanges: newPendingChanges,
      };
    }

    case 'UNDO_ROW_CHANGES': {
      const newPendingChanges = new Map(state.pendingChanges);
      newPendingChanges.delete(action.payload.rowId);
      
      return {
        ...state,
        pendingChanges: newPendingChanges,
      };
    }

    case 'CANCEL_ALL_CHANGES':
      return {
        ...state,
        editMode: 'none',
        activeRowId: null,
        pendingChanges: new Map(),
      };

    case 'SAVE_CHANGES_SUCCESS':
      return {
        ...state,
        pendingChanges: new Map(),
      };

    default:
      return state;
  }
}

export function useEditableTable(originalData: Supplier[]) {
  const [state, dispatch] = useReducer(editReducer, initialState);

  // Create display data by merging original data with pending changes
  const displayData = useMemo(() => {
    if (state.pendingChanges.size === 0) {
      return originalData;
    }

    return originalData.map(row => {
      const changes = state.pendingChanges.get(row.supplierid);
      return changes ? { ...row, ...changes } : row;
    });
  }, [originalData, state.pendingChanges]);

  // Helper functions
  const startSingleEdit = useCallback((rowId: string) => {
    dispatch({ type: 'START_SINGLE_EDIT', payload: { rowId } });
  }, []);

  const startBulkEdit = useCallback(() => {
    dispatch({ type: 'START_BULK_EDIT' });
  }, []);

  const exitEdit = useCallback(() => {
    dispatch({ type: 'EXIT_EDIT' });
  }, []);

  const updateCell = useCallback((rowId: string, columnId: keyof Supplier, value: any) => {
    dispatch({ type: 'UPDATE_CELL', payload: { rowId, columnId, value } });
  }, []);

  const undoRowChanges = useCallback((rowId: string) => {
    dispatch({ type: 'UNDO_ROW_CHANGES', payload: { rowId } });
  }, []);

  const cancelAllChanges = useCallback(() => {
    dispatch({ type: 'CANCEL_ALL_CHANGES' });
  }, []);

  const saveChangesSuccess = useCallback(() => {
    dispatch({ type: 'SAVE_CHANGES_SUCCESS' });
  }, []);

  // Helper queries
  const isRowEditable = useCallback((rowId: string) => {
    if (state.editMode === 'none') return false;
    if (state.editMode === 'single') return state.activeRowId === rowId;
    if (state.editMode === 'all') return true;
    return false;
  }, [state.editMode, state.activeRowId]);

  const hasRowChanges = useCallback((rowId: string) => {
    return state.pendingChanges.has(rowId);
  }, [state.pendingChanges]);

  const getRowData = useCallback((rowId: string, originalRow: Supplier): Supplier => {
    const changes = state.pendingChanges.get(rowId);
    return changes ? { ...originalRow, ...changes } : originalRow;
  }, [state.pendingChanges]);

  const getChangedRowsCount = useCallback(() => {
    return state.pendingChanges.size;
  }, [state.pendingChanges]);

  const getAllChanges = useCallback(() => {
    return Array.from(state.pendingChanges.entries()).map(([rowId, changes]) => ({
      rowId,
      changes,
    }));
  }, [state.pendingChanges]);

  const hasUnsavedChanges = state.pendingChanges.size > 0;

  return {
    // State
    editMode: state.editMode,
    activeRowId: state.activeRowId,
    hasUnsavedChanges,
    displayData,
    
    // Actions
    startSingleEdit,
    startBulkEdit,
    exitEdit,
    updateCell,
    undoRowChanges,
    cancelAllChanges,
    saveChangesSuccess,
    
    // Queries
    isRowEditable,
    hasRowChanges,
    getRowData,
    getChangedRowsCount,
    getAllChanges,
    
    // For backward compatibility during migration
    dispatch,
  };
}