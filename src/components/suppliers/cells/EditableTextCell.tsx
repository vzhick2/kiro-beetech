'use client';

import { useRef, useCallback, useEffect } from 'react';
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

  // Manage value and save state
  const {
    value: localValue,
    updateValue,
    saveStatus,
    hasChanges,
    setFocused,
  } = useEditableValue({
    serverValue,
    ...(onAutoSave && { onSave: (value) => onAutoSave(rowId, field, value) }),
    editMode,
  });

  // Preserve focus during re-renders and track cursor position
  const cursorPositionRef = useRef<{ start: number; end: number } | null>(null);
  const { handleFocus, handleBlur } = useFocusPreservation(
    inputRef,
    cellKey,
    isEditable && editMode === 'quickEdit'
  );

  // Track cursor position continuously while editing
  useEffect(() => {
    if (!inputRef.current || editMode !== 'quickEdit') return;

    const trackCursor = () => {
      if (inputRef.current && document.activeElement === inputRef.current) {
        cursorPositionRef.current = {
          start: inputRef.current.selectionStart || 0,
          end: inputRef.current.selectionEnd || 0,
        };
      }
    };

    // Track cursor position more frequently during quick edit
    const intervalId = setInterval(trackCursor, 50);
    return () => clearInterval(intervalId);
  }, [editMode]);

  // Restore cursor position after value updates
  useEffect(() => {
    if (
      inputRef.current && 
      document.activeElement === inputRef.current && 
      cursorPositionRef.current &&
      editMode === 'quickEdit'
    ) {
      const { start, end } = cursorPositionRef.current;
      // Use RAF to ensure DOM is updated
      requestAnimationFrame(() => {
        if (inputRef.current && document.activeElement === inputRef.current) {
          inputRef.current.setSelectionRange(start, end);
        }
      });
    }
  }, [localValue, editMode]);

  // Handle value changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
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
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
    } else if (e.key === 'Escape' && editMode === 'quickEdit') {
      e.preventDefault();
      // Let parent handle exit
      onKeyDown?.(e);
      return;
    }
    onKeyDown?.(e);
  }, [editMode, onKeyDown]);

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