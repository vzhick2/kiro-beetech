'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseEditableValueOptions {
  serverValue: any;
  onSave?: (value: any) => Promise<boolean>;
  editMode: 'viewing' | 'quickEdit' | 'bulkEdit';
  fieldType?: 'text' | 'select' | 'boolean';
  debounceMs?: number;
}

/**
 * Hook to manage editable cell value with server sync
 * Handles the complex state synchronization between local and server values
 */
export function useEditableValue({
  serverValue,
  onSave,
  editMode,
  fieldType = 'text',
  debounceMs = 500,
}: UseEditableValueOptions) {
  const [localValue, setLocalValue] = useState(serverValue);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Track if we're currently focused to prevent external updates
  const isFocusedRef = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedValueRef = useRef(serverValue);

  // Initialize or sync with server value
  useEffect(() => {
    if (!isInitialized || editMode === 'viewing') {
      setLocalValue(serverValue);
      lastSavedValueRef.current = serverValue;
      setIsInitialized(true);
    } else if (editMode === 'quickEdit') {
      // During quickEdit, only update if:
      // 1. Not currently focused AND
      // 2. Server value actually changed from a different source
      // 3. We're not in the middle of saving
      if (!isFocusedRef.current && 
          serverValue !== localValue && 
          serverValue !== lastSavedValueRef.current &&
          saveStatus !== 'saving') {
        setLocalValue(serverValue);
        lastSavedValueRef.current = serverValue;
      }
    }
    // In bulkEdit mode, keep local changes until save/cancel
  }, [serverValue, editMode, isInitialized, saveStatus]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Auto-save handler for quickEdit mode
  const handleAutoSave = useCallback(async (value: any) => {
    if (!onSave || editMode !== 'quickEdit') return;

    setSaveStatus('saving');
    try {
      const success = await onSave(value);
      if (success) {
        // Update our reference to prevent flashing when server syncs
        lastSavedValueRef.current = value;
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 1000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  }, [onSave, editMode]);

  // Debounced auto-save
  const debouncedSave = useCallback((value: any) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      handleAutoSave(value);
    }, debounceMs);
  }, [handleAutoSave, debounceMs]);

  // Handle value changes
  const updateValue = useCallback((newValue: any, skipAutoSave = false) => {
    setLocalValue(newValue);
    
    // Reset save status when typing
    if (saveStatus !== 'idle') {
      setSaveStatus('idle');
    }

    // Auto-save in quickEdit mode (unless explicitly skipped for revert operations)
    if (editMode === 'quickEdit' && !skipAutoSave) {
      debouncedSave(newValue);
    }
    // In bulkEdit mode, changes are held locally until manual save
  }, [editMode, debouncedSave, saveStatus]);

  // Handle value revert (without triggering autosave)
  const revertValue = useCallback(() => {
    setLocalValue(serverValue);
    setSaveStatus('idle');
    // Clear any pending autosave
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
  }, [serverValue]);

  // Handle focus state
  const setFocused = useCallback((focused: boolean) => {
    isFocusedRef.current = focused;
    
    // Save on blur in quickEdit mode
    if (!focused && editMode === 'quickEdit' && localValue !== serverValue) {
      // Clear any pending saves
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      // Save immediately
      handleAutoSave(localValue);
    }
  }, [editMode, localValue, serverValue, handleAutoSave]);

  // Check if value has changed
  const hasChanges = localValue !== serverValue;

  // Get formatted value for display
  const getDisplayValue = useCallback(() => {
    if (fieldType === 'boolean') {
      return localValue ? 'Active' : 'Inactive';
    }
    return localValue || '';
  }, [localValue, fieldType]);

  return {
    value: localValue,
    displayValue: getDisplayValue(),
    updateValue,
    revertValue,
    saveStatus,
    hasChanges,
    setFocused,
  };
}