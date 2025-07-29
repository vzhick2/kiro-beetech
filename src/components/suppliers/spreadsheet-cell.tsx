'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
// import { Input } from '@/components/ui/input'; // unused
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
  onChangeAction: (field: keyof Supplier, value: any) => void;
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
  onChangeAction,
  onLocalChangeAction,
  onKeyDown,
}: SpreadsheetCellProps) => {
  const [localValue, setLocalValue] = useState(value);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const selectRef = useRef<HTMLButtonElement>(null);
  
  // Keep track of the original value to compare against for saving
  const originalValueRef = useRef(value);

  // Only update localValue if value changed from external source (not from our own onChange)
  const lastValueRef = useRef(value);
  
  useEffect(() => {
    // Only update local value if this is an external change (not from our own editing)
    if (value !== lastValueRef.current) {
      // Check if we have unsaved local changes
      const hasLocalChanges = localValue !== originalValueRef.current;
      
      // Only update if we don't have local changes AND no row changes
      // (e.g., completely fresh/pristine state)
      if (!hasLocalChanges && !hasChanges) {
        setLocalValue(value);
      }
      
      lastValueRef.current = value;
      
      // Update original value only if this is a fresh load (not a local change)
      if (!hasChanges) {
        originalValueRef.current = value;
      }
    }
  }, [value, hasChanges, localValue]);

  const handleBlur = () => {
    // Compare against original value, not current value (which might be updated by onLocalChange)
    if (localValue !== originalValueRef.current) {
      let safeValue = localValue;
      
      // Handle different field types appropriately
      if (field === 'created_at') {
        if (localValue instanceof Date) {
          safeValue = localValue.toISOString();
        } else if (typeof localValue === 'string' || localValue == null) {
          safeValue = localValue;
        } else {
          safeValue = String(localValue);
        }
      } else if (field === 'isarchived') {
        safeValue = Boolean(localValue);
      } else {
        // For text fields, ensure we handle null/undefined properly
        safeValue = localValue == null ? '' : String(localValue);
      }
      
      // Save the change to the unified edit system
      onChangeAction(field, safeValue);
      
      // Update original value to reflect the change has been registered
      originalValueRef.current = safeValue;
      
      // Call onLocalChangeAction for any additional visual feedback
      onLocalChangeAction(field, safeValue, rowId);
    }
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
        handleBlur();
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
    const input = e.currentTarget;

    // Get click position relative to input
    const rect = input.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    
    // Let the browser naturally position the cursor based on click position
    // We don't force any cursor positioning - this allows normal text selection
    
    // Optional: If you want to ensure the input is fully focused for keyboard navigation
    // but preserve click-based cursor positioning, we can just ensure focus without
    // interfering with selection
    setTimeout(() => {
      if (document.activeElement === input) {
        // Input is focused, cursor position was set by the click - don't override
        return;
      }
      // If for some reason focus was lost, refocus and position at click location
      input.focus();
    }, 0);
  };

  // Allow natural text selection behavior
  const handleInputMouseDown = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    // Don't prevent default - this allows normal text selection behavior
    e.stopPropagation();
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    // When input receives focus via keyboard navigation (not click),
    // we can optionally select all text for quick editing
    const input = e.currentTarget;
    
    // Check if this was a click-based focus (preserve cursor) or keyboard focus (select all)
    // We'll use a simple heuristic: if the last interaction was very recent, assume it was a click
    setTimeout(() => {
      // Only select all if no selection exists (meaning it wasn't a click-to-position)
      if (input.selectionStart === input.selectionEnd && input.selectionStart === input.value.length) {
        // Cursor is at end with no selection - this was likely keyboard navigation
        // User can still click to position cursor wherever they want
      }
    }, 0);
  };

  if (!isSpreadsheetMode) {
    // Regular display mode - match table styling exactly
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
  
  // Match exact table cell styling: py-2 px-3 from table cells
  // Keep same height as display mode - no min-h constraints that change row height
  const cellClass = `w-full ${textColor} leading-tight resize-none border-0 bg-transparent outline-none focus:ring-0 focus:border-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent ${hasChanges ? 'bg-blue-50' : ''}`;
  const containerClass = `w-full py-2 px-3 ${hasChanges ? 'bg-blue-50' : 'bg-white'}`;

  if (field === 'isarchived') {
    return (
      <div data-cell={`${rowIndex}-${colIndex}`} className={containerClass}>
        <Select
          value={localValue ? 'archived' : 'active'}
          onValueChange={newValue => {
            setLocalValue(newValue === 'archived');
            onChangeAction(field, newValue === 'archived');
            onLocalChangeAction(field, newValue === 'archived', rowId);
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
          setLocalValue(e.target.value);
          // Don't call onLocalChange on every keystroke - only on blur
        }}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onClick={handleInputClick}
        onMouseDown={handleInputMouseDown}
        onFocus={handleInputFocus}
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
