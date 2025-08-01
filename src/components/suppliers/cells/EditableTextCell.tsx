'use client';

import { useRef, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useEditableValue } from '@/hooks/use-editable-value';
import { useFocusPreservation } from '@/hooks/use-focus-preservation';
import { SaveIndicator } from './SaveIndicator';
import type { Supplier } from '@/lib/supabase/suppliers';

interface EditableTextCellProps {
  value: any;
  field: keyof Supplier;
  rowId: string;
  rowIndex: number;
  colIndex: number;
  editMode: 'viewing' | 'quickEdit' | 'bulkEdit';
  isEditable: boolean;
  hasChanges: boolean;
  onChangeAction: (rowId: string, field: keyof Supplier, value: any) => void;
  onAutoSave?: ((rowId: string, field: keyof Supplier, value: any) => Promise<boolean>) | undefined;
  onKeyDown?: ((e: React.KeyboardEvent) => void) | undefined;
}

export function EditableTextCell({
  value: serverValue,
  field,
  rowId,
  rowIndex,
  colIndex,
  editMode,
  isEditable,
  hasChanges: externalHasChanges,
  onChangeAction,
  onAutoSave,
  onKeyDown,
}: EditableTextCellProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const cellKey = `${rowId}-${field}`;
  
  // Track cursor position to preserve it during re-renders
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  // Manage value and save state
  const {
    value: localValue,
    updateValue,
    revertValue,
    saveStatus,
    hasChanges,
    setFocused,
  } = useEditableValue({
    serverValue,
    ...(onAutoSave && { onSave: (value) => onAutoSave(rowId, field, value) }),
    editMode,
  });

  // Preserve focus during re-renders
  const { handleFocus, handleBlur } = useFocusPreservation(
    inputRef,
    cellKey,
    isEditable && editMode === 'quickEdit'
  );

  // Preserve cursor position after value updates (fixes cursor jumping to start)
  useLayoutEffect(() => {
    if (inputRef.current && cursorPosition !== null && document.activeElement === inputRef.current) {
      // Only restore cursor position if this input is currently focused
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [localValue, cursorPosition]);

  // Handle value changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const currentCursorPosition = e.target.selectionStart;
    
    // Store cursor position before updating value
    setCursorPosition(currentCursorPosition);
    updateValue(newValue);
    
    // Update parent state for bulkEdit mode
    if (editMode === 'bulkEdit') {
      onChangeAction(rowId, field, newValue);
    }
  }, [updateValue, editMode, onChangeAction, rowId, field]);

  // Handle focus events
  const handleInputFocus = useCallback(() => {
    setFocused(true);
    handleFocus();
  }, [setFocused, handleFocus]);

  const handleInputBlur = useCallback(() => {
    setFocused(false);
    handleBlur();
    
    // Force save in bulkEdit mode too if needed
    if (editMode === 'bulkEdit' && localValue !== serverValue) {
      onChangeAction(rowId, field, localValue);
    }
  }, [setFocused, handleBlur, editMode, localValue, serverValue, onChangeAction, rowId, field]);

  // Handle keyboard events
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Only handle specific navigation keys, let normal typing work
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
      onKeyDown?.(e);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      // Revert to server value and exit edit mode
      if (editMode === 'quickEdit') {
        revertValue();
        setCursorPosition(null); // Reset cursor position
      }
      inputRef.current?.blur();
      onKeyDown?.(e);
    } else if (e.key === 'Tab') {
      // Let tab navigation work
      onKeyDown?.(e);
    } else {
      // For all other keys (normal typing), stop propagation to prevent spreadsheet navigation
      e.stopPropagation();
    }
  }, [onKeyDown, editMode, revertValue]);

  // Determine text color based on field type
  const isWebsiteField = field === 'website';
  const isEmailField = field === 'email';
  const textColor = (isWebsiteField || isEmailField) ? 'text-blue-600' : 'text-gray-700';

  // Visual feedback styles
  const getCellStyles = () => {
    if (editMode === 'quickEdit') {
      if (saveStatus === 'saving') return 'ring-2 ring-orange-400 bg-orange-50';
      if (saveStatus === 'saved') return 'ring-2 ring-green-400 bg-green-50';
      if (saveStatus === 'error') return 'ring-2 ring-red-400 bg-red-50';
      if (hasChanges) return 'ring-2 ring-blue-400 bg-blue-50';
    } else if (editMode === 'bulkEdit' && (hasChanges || externalHasChanges)) {
      return 'ring-2 ring-blue-400 bg-blue-50';
    }
    return '';
  };

  // Display mode
  if (!isEditable) {
    return (
      <div className={`${textColor} leading-tight max-h-[4.5rem] overflow-hidden block`} style={{ 
        display: '-webkit-box', 
        WebkitLineClamp: 3, 
        WebkitBoxOrient: 'vertical' 
      }}>
        {serverValue || <span className="text-gray-400 italic">—</span>}
      </div>
    );
  }

  // Edit mode
  return (
    <div 
      data-cell={`${rowIndex}-${colIndex}`} 
      className={`w-full py-2 px-3 relative ${getCellStyles()}`}
    >
      <Textarea
        ref={inputRef}
        value={localValue || ''}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className={`w-full ${textColor} leading-tight resize-none border-0 bg-transparent outline-none focus:ring-0 focus:border-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent`}
        placeholder={`Enter ${field}`}
        rows={3}
        style={{
          lineHeight: '1.25',
          resize: 'none',
          height: '4.5rem',
          padding: 0,
          margin: 0,
        }}
      />
      <SaveIndicator status={saveStatus} editMode={editMode} />
    </div>
  );
}