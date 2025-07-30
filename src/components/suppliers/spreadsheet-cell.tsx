'use client';

import type React from 'react';

import { useRef, useState, useEffect, useCallback } from 'react';
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
  onChangeAction: (rowId: string, field: keyof Supplier, value: any) => void;
  onLocalChangeAction: (field: keyof Supplier, value: any, rowId: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
};

export const SpreadsheetCell = ({
  value,
  field,
  rowId,
  rowIndex,
  colIndex,
  isSpreadsheetMode,
  hasChanges,
  originalValue,
  onChangeAction,
  onLocalChangeAction,
  onKeyDown,
}: SpreadsheetCellProps) => {
  // Local state for input to prevent focus loss during typing
  const [localValue, setLocalValue] = useState(value);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const selectRef = useRef<HTMLButtonElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track if the component is currently being edited to prevent focus loss
  const isFocusedRef = useRef(false);
  
  // Sync local value when centralized value changes (from external updates)
  useEffect(() => {
    // Only update local value if we're not currently editing (to avoid overriding user input)
    if (!isFocusedRef.current) {
      setLocalValue(value);
    }
  }, [value]);
  
  // Debounced update to centralized state
  const debouncedUpdateCentralizedState = useCallback((newValue: any) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      let safeValue = newValue;
      
      // Handle different field types appropriately
      if (field === 'created_at') {
        if (newValue instanceof Date) {
          safeValue = newValue.toISOString();
        } else if (typeof newValue === 'string' || newValue == null) {
          safeValue = newValue;
        } else {
          safeValue = String(newValue);
        }
      } else if (field === 'isarchived') {
        safeValue = Boolean(newValue);
      } else {
        // For text fields, ensure we handle null/undefined properly
        safeValue = newValue == null ? '' : String(newValue);
      }
      
      // Update centralized state after debounce delay
      onChangeAction(rowId, field, safeValue);
      
      // Call onLocalChangeAction for any additional visual feedback
      onLocalChangeAction(field, safeValue, rowId);
    }, 300); // 300ms debounce delay
  }, [field, rowId, onChangeAction, onLocalChangeAction]);
  
  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleChange = (newValue: any) => {
    // Update local state immediately (no re-render of parent)
    setLocalValue(newValue);
    
    // Debounce update to centralized state to prevent focus loss
    debouncedUpdateCentralizedState(newValue);
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
    e.stopPropagation();
    // Let the browser naturally handle click positioning
  };

  // Allow natural text selection behavior
  const handleInputMouseDown = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    // Don't prevent default - this allows normal text selection behavior
    e.stopPropagation();
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    // Mark that this input is now focused to prevent external value updates
    isFocusedRef.current = true;
  };
  
  const handleInputBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    // Mark that this input is no longer focused
    isFocusedRef.current = false;
    
    // Force immediate update to centralized state on blur to ensure data is saved
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      // Trigger immediate update
      debouncedUpdateCentralizedState(localValue);
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
  
  // Enhanced visual feedback for editing states - use local state for immediate feedback
  const hasLocalChanges = localValue !== originalValue;
  const isPendingSave = hasLocalChanges && hasChanges;
  
  // Match exact table cell styling: py-2 px-3 from table cells
  // Keep same height as display mode - no min-h constraints that change row height
  const cellClass = `w-full ${textColor} leading-tight resize-none border-0 bg-transparent outline-none focus:ring-0 focus:border-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent ${hasChanges ? 'bg-blue-50' : ''} ${hasLocalChanges ? 'ring-1 ring-blue-300' : ''}`;
  const containerClass = `w-full py-2 px-3 relative ${hasChanges ? 'bg-blue-50' : 'bg-white'} ${hasLocalChanges ? 'bg-blue-100' : ''} ${isPendingSave ? 'border-l-2 border-orange-400' : ''}`;

  if (field === 'isarchived') {
    return (
      <div data-cell={`${rowIndex}-${colIndex}`} className={containerClass}>
        {hasLocalChanges && (
          <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full opacity-70 pointer-events-none z-10" 
               title="Unsaved changes" />
        )}
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
      {hasLocalChanges && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full opacity-70 pointer-events-none z-10" 
             title="Unsaved changes" />
      )}
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
    </div>
  );
};
