'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { DisplaySupplier } from '@/types/data-table';

interface SpreadsheetCellProps {
  value: any;
  field: keyof DisplaySupplier;
  rowId: string;
  rowIndex: number;
  colIndex: number;
  isSpreadsheetMode: boolean;
  hasChanges: boolean;
  onChange: (field: keyof DisplaySupplier, value: any) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export const SpreadsheetCell = ({
  value,
  field,
  rowId,
  rowIndex,
  colIndex,
  isSpreadsheetMode,
  hasChanges,
  onChange,
  onKeyDown,
}: SpreadsheetCellProps) => {
  const [localValue, setLocalValue] = useState(value);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    if (localValue !== value) {
      onChange(field, localValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (field === 'status') {
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
        handleBlur();
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

  // Simplified cursor positioning - just position at end on click
  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const input = e.currentTarget;

    // Simple approach: position cursor at end of text
    setTimeout(() => {
      const length = input.value.length;
      input.setSelectionRange(length, length);
    }, 0);
  };

  if (!isSpreadsheetMode) {
    // Regular display mode
    if (field === 'status') {
      return (
        <span className="px-2 py-1 rounded text-xs bg-gray-100">{value}</span>
      );
    }
    return (
      <span className="text-xs">
        {value || <span className="text-gray-400 italic">—</span>}
      </span>
    );
  }

  // Spreadsheet edit mode
  const isWebsiteField = field === 'website';
  const websiteClass = isWebsiteField ? 'text-blue-600' : '';
  const cellClass = `h-10 text-xs font-medium ${websiteClass} ${hasChanges ? 'border-blue-300 bg-blue-50' : ''}`;
  const focusClass = 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  if (field === 'status') {
    return (
      <div data-cell={`${rowIndex}-${colIndex}`}>
        <Select
          value={localValue}
          onValueChange={newValue => onChange(field, newValue)}
          open={isSelectOpen}
          onOpenChange={setIsSelectOpen}
        >
          <SelectTrigger
            ref={selectRef}
            className={`${cellClass} ${focusClass} [&]:text-xs [&]:font-medium`}
            onKeyDown={handleSelectKeyDown}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div data-cell={`${rowIndex}-${colIndex}`}>
      <Input
        ref={inputRef}
        value={localValue || ''}
        onChange={e => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onClick={handleInputClick}
        className={`${cellClass} ${focusClass} [&]:text-xs [&]:font-medium ${isWebsiteField ? '[&]:text-blue-600' : ''}`}
        placeholder={
          field === 'name'
            ? 'Supplier name'
            : field === 'website'
              ? 'Website'
              : `${field}`
        }
      />
    </div>
  );
};
