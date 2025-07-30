'use client';

import React from 'react';
import { EditableTextCell } from './cells/EditableTextCell';
import { EditableSelectCell } from './cells/EditableSelectCell';
import type { Supplier } from '@/lib/supabase/suppliers';
import type { EditMode } from '@/hooks/use-unified-edit';

interface SpreadsheetCellProps {
  value: any;
  field: keyof Supplier;
  rowId: string;
  rowIndex: number;
  colIndex: number;
  isSpreadsheetMode: boolean;
  hasChanges: boolean;
  originalValue: any;
  editMode: EditMode | 'none' | 'single' | 'all'; // Support both old and new
  onChangeAction: (rowId: string, field: keyof Supplier, value: any) => void;
  onLocalChangeAction: (field: keyof Supplier, value: any, rowId: string) => void;
  onAutoSave?: ((rowId: string, field: keyof Supplier, value: any) => Promise<boolean>) | undefined;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

// Map legacy edit modes to new ones
function mapEditMode(mode: string): 'viewing' | 'quickEdit' | 'bulkEdit' {
  switch (mode) {
    case 'none':
    case 'viewing':
      return 'viewing';
    case 'single':
    case 'quickEdit':
      return 'quickEdit';
    case 'all':
    case 'bulkEdit':
      return 'bulkEdit';
    default:
      return 'viewing';
  }
}

export const SpreadsheetCell = React.memo(({
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
  const mappedEditMode = mapEditMode(editMode);
  const isEditable = isSpreadsheetMode;

  // For boolean fields (isarchived), use SelectCell
  if (field === 'isarchived') {
    return (
      <EditableSelectCell
        value={value as boolean}
        field={field}
        rowId={rowId}
        rowIndex={rowIndex}
        colIndex={colIndex}
        editMode={mappedEditMode}
        isEditable={isEditable}
        hasChanges={hasChanges}
        onChangeAction={onChangeAction}
        onAutoSave={onAutoSave}
        onKeyDown={onKeyDown}
      />
    );
  }

  // For all other fields, use TextCell
  return (
    <EditableTextCell
      value={value}
      field={field}
      rowId={rowId}
      rowIndex={rowIndex}
      colIndex={colIndex}
      editMode={mappedEditMode}
      isEditable={isEditable}
      hasChanges={hasChanges}
      onChangeAction={onChangeAction}
      onAutoSave={onAutoSave}
      onKeyDown={onKeyDown}
    />
  );
}, (prevProps, nextProps) => {
  // Simple memoization - only re-render if key props change
  return (
    prevProps.value === nextProps.value &&
    prevProps.editMode === nextProps.editMode &&
    prevProps.isSpreadsheetMode === nextProps.isSpreadsheetMode &&
    prevProps.hasChanges === nextProps.hasChanges &&
    prevProps.originalValue === nextProps.originalValue
  );
});

SpreadsheetCell.displayName = 'SpreadsheetCell';