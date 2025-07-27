'use client';

import React, { useState, useEffect } from 'react';
import { Mail, MapPin, FileText, Check, Clock, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { Supplier } from '@/types/data-table';

interface ExpandableRowDetailsProps {
  supplier: Supplier;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (field: keyof Supplier, value: any) => void;
  isEditing: boolean;
  columnWidths: any;
}

export const ExpandableRowDetails = ({
  supplier,
  isExpanded,
  onToggle,
  onUpdate,
  isEditing,
  columnWidths,
}: ExpandableRowDetailsProps) => {
  const [localData, setLocalData] = useState({
    email: supplier.email || '',
    address: supplier.address || '',
    notes: supplier.notes || '',
  });

  const [hasChanges, setHasChanges] = useState({
    email: false,
    address: false,
    notes: false,
  });

  const [saveStates, setSaveStates] = useState({
    email: 'idle' as 'idle' | 'saving' | 'saved',
    address: 'idle' as 'idle' | 'saving' | 'saved',
    notes: 'idle' as 'idle' | 'saving' | 'saved',
  });

  const handleChange = (field: keyof typeof localData, value: string) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
    setHasChanges(prev => ({ ...prev, [field]: true }));
  };

  const handleSave = (field: keyof typeof localData) => {
    if (!hasChanges[field]) return;

    setSaveStates(prev => ({ ...prev, [field]: 'saving' }));
    
    onUpdate(field as keyof Supplier, localData[field]);
    
    setHasChanges(prev => ({ ...prev, [field]: false }));
    
    // Show saved state briefly
    setTimeout(() => {
      setSaveStates(prev => ({ ...prev, [field]: 'saved' }));
      setTimeout(() => {
        setSaveStates(prev => ({ ...prev, [field]: 'idle' }));
      }, 2000);
    }, 300);
  };

  // Update local data when supplier prop changes
  useEffect(() => {
    setLocalData({
      email: supplier.email || '',
      address: supplier.address || '',
      notes: supplier.notes || '',
    });
    setHasChanges({ email: false, address: false, notes: false });
  }, [supplier]);

  if (!isExpanded) return null;

  return (
    <TableRow className="bg-gray-25 border-b border-gray-200">
      <TableCell colSpan={5} className="py-6 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl ml-2 mt-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Mail className="h-4 w-4" />
              Email Address
              {hasChanges.email && isEditing && (
                <div className="flex items-center gap-1 ml-auto">
                  {saveStates.email === 'saving' && (
                    <Clock className="h-3 w-3 animate-spin text-gray-500" />
                  )}
                  {saveStates.email === 'saved' && (
                    <Check className="h-3 w-3 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {isEditing ? (
              <div onClick={e => e.stopPropagation()}>
                <Input
                  type="email"
                  value={localData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  onBlur={() => handleSave('email')}
                  placeholder="supplier@company.com"
                  className="h-8"
                />
              </div>
            ) : (
              <div className="text-sm pl-1">
                {supplier.email ? (
                  <a
                    href={`mailto:${supplier.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {supplier.email}
                  </a>
                ) : (
                  <span className="text-gray-400 italic">No email address</span>
                )}
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <MapPin className="h-4 w-4" />
              Address
              {hasChanges.address && isEditing && (
                <div className="flex items-center gap-1 ml-auto">
                  {saveStates.address === 'saving' && (
                    <Clock className="h-3 w-3 animate-spin text-gray-500" />
                  )}
                  {saveStates.address === 'saved' && (
                    <Check className="h-3 w-3 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {isEditing ? (
              <div onClick={e => e.stopPropagation()}>
                <Input
                  value={localData.address}
                  onChange={e => handleChange('address', e.target.value)}
                  onBlur={() => handleSave('address')}
                  placeholder="123 Main St, City, State 12345"
                  className="h-8"
                />
              </div>
            ) : (
              <div className="text-sm pl-1">
                {supplier.address || (
                  <span className="text-gray-400 italic">No address</span>
                )}
              </div>
            )}
          </div>
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <FileText className="h-4 w-4" />
              Notes
              {hasChanges.notes && (
                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    size="sm"
                    onClick={() => handleSave('notes')}
                    disabled={saveStates.notes === 'saving'}
                    className="h-6 px-2 text-xs bg-green-500 hover:bg-green-600 text-white"
                  >
                    {saveStates.notes === 'saving' ? (
                      <>
                        <Clock className="h-3 w-3 mr-1 animate-spin" />
                        Saving...
                      </>
                    ) : saveStates.notes === 'saved' ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
            <div onClick={e => e.stopPropagation()}>
              <Textarea
                value={localData.notes}
                onChange={e => handleChange('notes', e.target.value)}
                onBlur={() => handleSave('notes')}
                placeholder="Click to add notes about this supplier..."
                className="min-h-[80px] resize-none"
              />
              {hasChanges.notes && (
                <div className="text-xs text-gray-500 mt-1">
                  💡 Changes will auto-save when you click away, or click the Save button above
                </div>
              )}
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};
