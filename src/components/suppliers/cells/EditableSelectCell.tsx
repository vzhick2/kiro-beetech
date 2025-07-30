'use client';

import { useRef, useState, useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEditableValue } from '@/hooks/use-editable-value';
import { SaveIndicator } from './SaveIndicator';
import type { Supplier } from '@/lib/supabase/suppliers';

interface EditableSelectCellProps {
  value: boolean;
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

export function EditableSelectCell({
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
}: EditableSelectCellProps) {
  const selectRef = useRef<HTMLButtonElement>(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

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
    fieldType: 'boolean',
  });

  // Handle value changes
  const handleChange = useCallback((newValue: string) => {
    const boolValue = newValue === 'archived';
    updateValue(boolValue);
    
    // Update parent state for bulkEdit mode
    if (editMode === 'bulkEdit') {
      onChangeAction(rowId, field, boolValue);
    }
  }, [updateValue, editMode, onChangeAction, rowId, field]);

  // Handle keyboard events
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (isSelectOpen) {
      // Let select handle its own navigation
      return;
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      setIsSelectOpen(true);
      return;
    }
    
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsSelectOpen(true);
      return;
    }

    onKeyDown?.(e);
  }, [isSelectOpen, onKeyDown]);

  // Handle open change
  const handleOpenChange = useCallback((open: boolean) => {
    setIsSelectOpen(open);
    setFocused(open);
  }, [setFocused]);

  // Visual feedback styles
  const getCellStyles = () => {
    if (editMode === 'quickEdit') {
      if (saveStatus === 'saving') return 'ring-1 ring-orange-300';
      if (saveStatus === 'saved') return 'ring-1 ring-green-300';
      if (saveStatus === 'error') return 'ring-1 ring-red-300';
      if (hasChanges) return 'ring-1 ring-blue-300';
    } else if (editMode === 'bulkEdit' && (hasChanges || externalHasChanges)) {
      return 'ring-1 ring-blue-300';
    }
    return '';
  };

  // Display mode
  if (!isEditable) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-green-100 text-green-800">
        {serverValue ? 'Inactive' : 'Active'}
      </span>
    );
  }

  // Edit mode
  return (
    <div 
      data-cell={`${rowIndex}-${colIndex}`} 
      className={`w-full py-2 px-3 relative ${getCellStyles()}`}
    >
      <Select
        value={localValue ? 'archived' : 'active'}
        onValueChange={handleChange}
        open={isSelectOpen}
        onOpenChange={handleOpenChange}
      >
        <SelectTrigger
          ref={selectRef}
          className="w-full border-0 bg-transparent shadow-none outline-none focus:ring-0 py-0"
          onKeyDown={handleKeyDown}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>
      <SaveIndicator status={saveStatus} editMode={editMode} />
    </div>
  );
}