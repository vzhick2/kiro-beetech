'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Settings, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export interface ColumnVisibility {
  name: boolean;
  website: boolean;
  phone: boolean;
  email: boolean;
  address: boolean;
  notes: boolean;
  status: boolean;
  createdAt: boolean;
}

export interface DensityMode {
  mode: 'compact' | 'normal' | 'comfortable';
  label: string;
}

interface ViewOptionsPanelProps {
  columnVisibility: ColumnVisibility;
  onColumnVisibilityChange: (column: keyof ColumnVisibility, visible: boolean) => void;
  includeInactive: boolean;
  onIncludeInactiveChange: (include: boolean) => void;
  densityMode: DensityMode['mode'];
  onDensityModeChange: (mode: DensityMode['mode']) => void;
}

export const ViewOptionsPanel = React.memo(({
  columnVisibility,
  onColumnVisibilityChange,
  includeInactive,
  onIncludeInactiveChange,
  densityMode,
  onDensityModeChange,
}: ViewOptionsPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const columns = [
    { key: 'name' as const, label: 'Supplier Name', required: true },
    { key: 'website' as const, label: 'Website', required: false },
    { key: 'phone' as const, label: 'Phone', required: false },
    { key: 'email' as const, label: 'Email', required: false },
    { key: 'address' as const, label: 'Address', required: false },
    { key: 'notes' as const, label: 'Notes', required: false },
    { key: 'status' as const, label: 'Status', required: false },
    { key: 'createdAt' as const, label: 'Created Date', required: false },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {}; // Ensure all code paths return
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="outline"
        size="sm"
        className="h-9 px-3 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all duration-150"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <Settings className="h-4 w-4 mr-2" />
        View Options
        <ChevronDown className="h-3 w-3 ml-1" />
      </Button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full mt-2 w-80 p-4 bg-white border border-gray-200 shadow-lg rounded-lg z-50"
          style={{ position: 'absolute' }}
        >
          <div className="px-0 pb-3 text-sm font-semibold text-gray-900">
            Columns
          </div>
          
          <div className="space-y-3 mb-4">
            {columns.map(({ key, label, required }) => (
              <div key={key} className="flex items-center space-x-3">
                <Checkbox
                  id={`column-${key}`}
                  checked={columnVisibility[key]}
                  onCheckedChange={(checked) => {
                    onColumnVisibilityChange(key, !!checked);
                  }}
                  disabled={required}
                  className="h-4 w-4"
                />
                <Label 
                  htmlFor={`column-${key}`} 
                  className={`text-sm cursor-pointer select-none ${
                    required ? 'font-medium text-gray-600' : 'text-gray-700'
                  }`}
                >
                  {label}
                  {required && ' (required)'}
                </Label>
              </div>
            ))}
          </div>

          <div className="my-4 h-px bg-gray-200" />

          <div className="px-0 pb-3 text-sm font-semibold text-gray-900">
            Display Options
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="include-inactive"
                checked={includeInactive}
                onCheckedChange={(checked) => {
                  onIncludeInactiveChange(!!checked);
                }}
                className="h-4 w-4"
              />
              <Label htmlFor="include-inactive" className="text-sm cursor-pointer select-none text-gray-700">
                Include inactive suppliers
              </Label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

ViewOptionsPanel.displayName = 'ViewOptionsPanel';
