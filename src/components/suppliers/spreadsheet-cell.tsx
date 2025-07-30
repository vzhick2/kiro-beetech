'use client';

import type React from 'react';

import { useRef, useState, useEffect, useCallback, memo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { Supplier } from '@/lib/supabase/suppliers';

type SpreadsheetCellProps = {
  value: any;
  field: keyof Supplier;
  rowId: string;
  rowIndex: number;
  colIndex: number;
  isSpreadsheetMode: boolean;
  hasChanges: boolean;
  originalValue: any; // Add originalValue prop for comparison
  editMode: 'none' | 'single' | 'all'; // Add edit mode to determine workflow
  onChangeAction: (rowId: string, field: keyof Supplier, value: any) => void;
  onLocalChangeAction: (field: keyof Supplier, value: any, rowId: string) => void;
  onAutoSave?: (rowId: string, field: keyof Supplier, value: any) => Promise<boolean>; // Auto-save callback for single mode
  onKeyDown?: (e: React.KeyboardEvent) => void;
};

const SpreadsheetCellComponent = ({
  value,
  field,
  rowId,
  rowIndex,
  colIndex,
  isSpreadsheetMode,
  hasChanges,
  originalValue,
  editMode,
  onChangeAction,
  onLocalChangeAction,
  onAutoSave,
  onKeyDown,
}: SpreadsheetCellProps) => {
  console.log(`🔄 [${rowId}:${field}] SpreadsheetCell render: editMode=${editMode}, value="${value}", isSpreadsheetMode=${isSpreadsheetMode}`);
  // Local state for input to prevent focus loss during typing
  // Don't initialize with value prop to prevent resets on re-render
  const [localValue, setLocalValue] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const selectRef = useRef<HTMLButtonElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track if the component is currently being edited to prevent focus loss
  const isFocusedRef = useRef(false);
  
  // Initialize local value only once, then protect it during editing
  useEffect(() => {
    console.log(`🔄 [${rowId}:${field}] useEffect: editMode=${editMode}, localValue="${localValue}", incomingValue="${value}", isInitialized=${isInitialized}`);
    
    // Initialize local value on first render or when switching to display mode
    if (!isInitialized || editMode === 'none') {
      console.log(`🆕 [${rowId}:${field}] Initializing/syncing local value with: "${value}"`);
      setLocalValue(value);
      setIsInitialized(true);
    } else {
      // During editing, protect local state from external changes
      console.log(`🔒 [${rowId}:${field}] Edit mode: protecting local state "${localValue}" from server data "${value}"`);
    }
  }, [value, editMode, field, rowId, isInitialized]); // Only sync when absolutely necessary
  
  // Reset local value when exiting any edit mode
  useEffect(() => {
    console.log(`🔄 Edit mode changed to: ${editMode}, field=${field}`);
    // When switching from any edit mode to display mode, sync with current server value
    if (editMode === 'none') {
      console.log(`🚪 Exiting edit mode: resetting local value to server data "${value}"`);
      setLocalValue(value);
    }
  }, [editMode, value, field]);
  
  // Helper function to handle value type conversion
  const getSafeValue = useCallback((newValue: any) => {
    // Handle different field types appropriately
    if (field === 'created_at') {
      if (newValue instanceof Date) {
        return newValue.toISOString();
      } else if (typeof newValue === 'string' || newValue == null) {
        return newValue;
      } else {
        return String(newValue);
      }
    } else if (field === 'isarchived') {
      return Boolean(newValue);
    } else {
      // For text fields, ensure we handle null/undefined properly
      return newValue == null ? '' : String(newValue);
    }
  }, [field]);

  // Auto-save for single row mode (separate from input debounce)
  const handleAutoSave = useCallback(async (newValue: any) => {
    console.log(`💾 handleAutoSave called with value: "${newValue}"`);
    
    if (!onAutoSave) {
      console.log(`❌ No onAutoSave prop provided!`);
      return;
    }
    
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(async () => {
      const safeValue = getSafeValue(newValue);
      console.log(`📡 Starting database save: field=${field}, rowId=${rowId}, value="${safeValue}"`);
      setSaveStatus('saving');
      
      try {
        const success = await onAutoSave(rowId, field, safeValue);
        console.log(`📡 Database save result: ${success ? 'SUCCESS' : 'FAILED'}`);
        
        if (success) {
          setSaveStatus('saved');
          console.log(`✅ Auto-save successful for ${field}: "${safeValue}"`);
          // Keep local value stable during save - don't let external updates override
          // Fade out saved indicator after 1 second
          setTimeout(() => setSaveStatus('idle'), 1000);
        } else {
          setSaveStatus('error');
          console.log(`❌ Auto-save returned false for ${field}: "${safeValue}"`);
          setTimeout(() => setSaveStatus('idle'), 2000);
        }
      } catch (error) {
        console.error('Auto-save failed:', error);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    }, 100); // Very fast save execution
  }, [onAutoSave, rowId, field, getSafeValue]);

  // Input debounce for responsive auto-save (500ms after typing stops)
  const inputDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Central state update debounce for spreadsheet mode (prevents re-render on every keystroke)
  const centralStateDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Debounced state update for spreadsheet mode to prevent re-renders
  const updateCentralizedState = useCallback((newValue: any) => {
    const safeValue = getSafeValue(newValue);
    
    // Clear existing timeout
    if (centralStateDebounceTimeoutRef.current) {
      clearTimeout(centralStateDebounceTimeoutRef.current);
    }
    
    // Debounce central state updates to prevent re-renders during typing
    centralStateDebounceTimeoutRef.current = setTimeout(() => {
      // Update centralized state after brief delay
      onChangeAction(rowId, field, safeValue);
      
      // Call onLocalChangeAction for any additional visual feedback
      onLocalChangeAction(field, safeValue, rowId);
    }, 50); // Very short delay, just enough to prevent re-render race conditions
  }, [field, rowId, onChangeAction, onLocalChangeAction, getSafeValue]);

  // Input debounce system for single row mode (separate from auto-save)
  const debouncedAutoSave = useCallback((newValue: any) => {
    console.log(`⏰ debouncedAutoSave called with value: "${newValue}"`);
    
    if (inputDebounceTimeoutRef.current) {
      clearTimeout(inputDebounceTimeoutRef.current);
      console.log(`🔄 Cleared previous auto-save timeout`);
    }
    
    inputDebounceTimeoutRef.current = setTimeout(() => {
      console.log(`🚀 Auto-save timeout triggered, calling handleAutoSave with: "${newValue}"`);
      handleAutoSave(newValue);
    }, 500); // 500ms input debounce - save quickly after stopping typing
  }, [handleAutoSave]);
  
  // Cleanup debounce timeouts on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      if (inputDebounceTimeoutRef.current) {
        clearTimeout(inputDebounceTimeoutRef.current);
      }
      if (centralStateDebounceTimeoutRef.current) {
        clearTimeout(centralStateDebounceTimeoutRef.current);
      }
    };
  }, []);

  const handleChange = (newValue: any) => {
    console.log(`🔄 [${rowId}:${field}] handleChange: newValue="${newValue}", editMode=${editMode}`);
    
    // Update local state immediately (no re-render of parent)
    setLocalValue(newValue);
    console.log(`📝 Local state updated to: "${newValue}"`);
    
    // Reset save status when user starts typing again
    if (saveStatus !== 'idle') {
      setSaveStatus('idle');
    }
    
    // Choose workflow based on edit mode
    if (editMode === 'single') {
      console.log(`⏰ Single row mode: scheduling auto-save in 500ms`);
      // Single row mode: use separate input debounce before auto-save
      debouncedAutoSave(newValue);
    } else if (editMode === 'all') {
      console.log(`📊 Spreadsheet mode: updating draft state immediately`);
      // Spreadsheet mode: update draft state immediately (no auto-save)
      updateCentralizedState(newValue);
    }
    // Note: editMode === 'none' (display mode) doesn't allow changes
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (field === 'isarchived') {
      // Handle arrow keys for status dropdown
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsSelectOpen(true);
        return;
      }
      // Handle Enter to open dropdown
      if (e.key === 'Enter') {
        e.preventDefault();
        setIsSelectOpen(true);
        return;
      }
    } else {
      // For regular inputs
      if (e.key === 'Enter') {
        e.preventDefault();
        // Move focus to next cell or blur current one
        if (inputRef.current) {
          inputRef.current.blur();
        }
      }
      
      // Handle ESC to exit single row edit mode
      if (e.key === 'Escape' && editMode === 'single') {
        e.preventDefault();
        // Let parent component handle exiting single row edit mode
        onKeyDown?.(e);
        return;
      }
    }
    onKeyDown?.(e);
  };

  const handleSelectKeyDown = (e: React.KeyboardEvent) => {
    // Let the select handle its own navigation when open
    if (isSelectOpen) {
      return;
    }
    handleKeyDown(e);
  };

  // Enhanced cursor positioning - allow natural text selection and editing
  const handleInputClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    // Don't stop propagation - allow parent to handle cell navigation
    // Let the browser naturally handle click positioning within the text
  };

  // Allow natural text selection behavior
  const handleInputMouseDown = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    // Don't prevent default - this allows normal text selection behavior
    // Don't stop propagation - allow parent to handle cell navigation
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    // Mark that this input is now focused to prevent external value updates
    isFocusedRef.current = true;
    
    // Allow event propagation for spreadsheet navigation
  };
  
  const handleInputBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    // Mark that this input is no longer focused
    isFocusedRef.current = false;
    
    // Force immediate save/update on blur to ensure data is captured
    if (editMode === 'single') {
      // Single row mode: clear both debounce timers and trigger immediate auto-save
      if (inputDebounceTimeoutRef.current) {
        clearTimeout(inputDebounceTimeoutRef.current);
      }
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      // Trigger immediate auto-save
      handleAutoSave(localValue);
    } else if (editMode === 'all') {
      // Spreadsheet mode: clear debounce and trigger immediate state update on blur
      if (centralStateDebounceTimeoutRef.current) {
        clearTimeout(centralStateDebounceTimeoutRef.current);
      }
      // Trigger immediate central state update
      const safeValue = getSafeValue(localValue);
      onChangeAction(rowId, field, safeValue);
      onLocalChangeAction(field, safeValue, rowId);
    }
  };

  if (!isSpreadsheetMode) {
    // Regular display mode - value is already from the centralized state
    const isWebsiteField = field === 'website';
    const isEmailField = field === 'email';
    
    // Simplified - let global table styling handle font sizes
    const textColor = (isWebsiteField || isEmailField) ? 'text-blue-600' : 'text-gray-700';
    
    if (field === 'isarchived') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-green-100 text-green-800">
          {value ? 'Inactive' : 'Active'}
        </span>
      );
    }
    return (
      <div className={`${textColor} leading-tight max-h-[4.5rem] overflow-hidden block`} style={{ 
        display: '-webkit-box', 
        WebkitLineClamp: 3, 
        WebkitBoxOrient: 'vertical' 
      }}>
        {value || <span className="text-gray-400 italic">—</span>}
      </div>
    );
  }

  // Spreadsheet edit mode - simplified with global table font sizing
  const isWebsiteField = field === 'website';
  const isEmailField = field === 'email';
  
  const textColor = (isWebsiteField || isEmailField) ? 'text-blue-600' : 'text-gray-700';
  
  // Clean visual feedback for editing states
  const hasLocalChanges = localValue !== originalValue;
  
  // Visual feedback based on save status and edit mode
  const getSaveStatusStyles = () => {
    if (editMode === 'single') {
      switch (saveStatus) {
        case 'saving':
          return 'border-l-2 border-orange-400 bg-orange-50/30';
        case 'saved':
          return 'border-l-2 border-green-400 bg-green-50/30';
        case 'error':
          return 'border-l-2 border-red-400 bg-red-50/30';
        default:
          return hasLocalChanges ? 'border-l-2 border-blue-400 bg-blue-50/30' : 'bg-white';
      }
    } else {
      // Spreadsheet mode: show draft state
      return hasLocalChanges ? 'border-l-2 border-blue-400 bg-blue-50/30' : 'bg-white';
    }
  };
  
  // Subtle styling - just a gentle left border when editing
  const cellClass = `w-full ${textColor} leading-tight resize-none border-0 bg-transparent outline-none focus:ring-0 focus:border-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent`;
  const containerClass = `w-full py-2 px-3 relative transition-all duration-200 ${getSaveStatusStyles()}`;

  if (field === 'isarchived') {
    return (
      <div data-cell={`${rowIndex}-${colIndex}`} className={containerClass}>
        <Select
          value={localValue ? 'archived' : 'active'}
          onValueChange={newValue => {
            handleChange(newValue === 'archived');
          }}
          open={isSelectOpen}
          onOpenChange={setIsSelectOpen}
        >
          <SelectTrigger
            ref={selectRef}
            className="w-full border-0 bg-transparent shadow-none outline-none focus:ring-0 py-0"
            onKeyDown={handleSelectKeyDown}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div data-cell={`${rowIndex}-${colIndex}`} className={containerClass}>
      <Textarea
        ref={inputRef}
        value={localValue || ''}
        onChange={e => {
          handleChange(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        onClick={handleInputClick}
        onMouseDown={handleInputMouseDown}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className={cellClass}
        placeholder={
          field === 'name'
            ? 'Supplier name'
            : field === 'website'
              ? 'Website'
              : `${field}`
        }
        rows={3}
        style={{
          lineHeight: '1.25',
          resize: 'none',
          height: '4.5rem', // Fixed height to match display mode exactly
          padding: 0,
          margin: 0,
        }}
      />
      
      {/* Save status indicator for single row mode */}
      {editMode === 'single' && saveStatus !== 'idle' && (
        <div className="absolute top-1 right-1 flex items-center">
          {saveStatus === 'saving' && (
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" title="Saving..." />
          )}
          {saveStatus === 'saved' && (
            <div className="w-2 h-2 bg-green-400 rounded-full" title="Saved" />
          )}
          {saveStatus === 'error' && (
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" title="Save failed" />
          )}
        </div>
      )}
    </div>
  );
};

// Memoized component to prevent re-renders when props haven't changed
export const SpreadsheetCell = memo(SpreadsheetCellComponent, (prevProps, nextProps) => {
  console.log(`🔍 [${nextProps.rowId}:${nextProps.field}] Memo comparison:
    value: ${prevProps.value} → ${nextProps.value} ${prevProps.value === nextProps.value ? '✓' : '✗'}
    editMode: ${prevProps.editMode} → ${nextProps.editMode} ${prevProps.editMode === nextProps.editMode ? '✓' : '✗'}
    isSpreadsheetMode: ${prevProps.isSpreadsheetMode} → ${nextProps.isSpreadsheetMode} ${prevProps.isSpreadsheetMode === nextProps.isSpreadsheetMode ? '✓' : '✗'}
    hasChanges: ${prevProps.hasChanges} → ${nextProps.hasChanges} ${prevProps.hasChanges === nextProps.hasChanges ? '✓' : '✗'}
    originalValue: ${prevProps.originalValue} → ${nextProps.originalValue} ${prevProps.originalValue === nextProps.originalValue ? '✓' : '✗'}
    callbacks equal: ${prevProps.onChangeAction === nextProps.onChangeAction && prevProps.onLocalChangeAction === nextProps.onLocalChangeAction && prevProps.onAutoSave === nextProps.onAutoSave ? '✓' : '✗'}`
  );
  
  // Only re-render if these key props have actually changed
  const propsEqual = (
    prevProps.value === nextProps.value &&
    prevProps.editMode === nextProps.editMode &&
    prevProps.isSpreadsheetMode === nextProps.isSpreadsheetMode &&
    prevProps.hasChanges === nextProps.hasChanges &&
    prevProps.originalValue === nextProps.originalValue &&
    prevProps.onChangeAction === nextProps.onChangeAction &&
    prevProps.onLocalChangeAction === nextProps.onLocalChangeAction &&
    prevProps.onAutoSave === nextProps.onAutoSave
  );
  
  console.log(`🔍 [${nextProps.rowId}:${nextProps.field}] Memo result: ${propsEqual ? 'SKIP RE-RENDER' : 'RE-RENDER'}`);
  
  return propsEqual;
});
