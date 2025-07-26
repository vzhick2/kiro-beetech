'use client';

import { useState } from 'react';
import { Check, X, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CleanSupplier } from './types';

interface EditableRowProps {
  supplier: CleanSupplier;
  onSave: (id: string, data: Partial<CleanSupplier>) => void;
  onCancel: () => void;
}

export const EditableRow = ({ supplier, onSave, onCancel }: EditableRowProps) => {
  const [formData, setFormData] = useState({
    name: supplier.name,
    website: supplier.website || '',
    phone: supplier.phone || '',
    email: supplier.email || '',
    isArchived: supplier.isArchived
  });

  const [isValid, setIsValid] = useState(true);

  const handleSave = () => {
    if (!formData.name.trim()) {
      setIsValid(false);
      return;
    }
    
    const updateData: Partial<CleanSupplier> = {
      name: formData.name.trim(),
      isArchived: formData.isArchived
    };
    
    if (formData.website.trim()) updateData.website = formData.website.trim();
    if (formData.phone.trim()) updateData.phone = formData.phone.trim();
    if (formData.email.trim()) updateData.email = formData.email.trim();
    
    onSave(supplier.id, updateData);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <tr className="border-b border-gray-100 bg-blue-50/30">
      <td className="w-12 px-4 py-3"></td>
      
      {/* Name */}
      <td className="px-4 py-3">
        <Input
          value={formData.name}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, name: e.target.value }));
            setIsValid(true);
          }}
          onKeyDown={handleKeyDown}
          className={`h-8 ${!isValid ? 'border-red-300' : ''}`}
          placeholder="Supplier name"
          autoFocus
        />
        {!isValid && (
          <p className="text-red-500 text-xs mt-1">Name is required</p>
        )}
      </td>

      {/* Website */}
      <td className="px-4 py-3">
        <Input
          value={formData.website}
          onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
          onKeyDown={handleKeyDown}
          className="h-8"
          placeholder="Website URL"
        />
      </td>

      {/* Contact */}
      <td className="px-4 py-3">
        <div className="space-y-2">
          <Input
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            onKeyDown={handleKeyDown}
            className="h-8"
            placeholder="Phone number"
          />
          <Input
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            onKeyDown={handleKeyDown}
            className="h-8"
            placeholder="Email address"
            type="email"
          />
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <Select
          value={formData.isArchived ? 'archived' : 'active'}
          onValueChange={(value) => setFormData(prev => ({ 
            ...prev, 
            isArchived: value === 'archived' 
          }))}
        >
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};
