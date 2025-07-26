'use client';

import { Edit2, ExternalLink, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CleanSupplier, ViewMode } from './types';

interface SupplierRowProps {
  supplier: CleanSupplier;
  isSelected: boolean;
  onToggleSelect: (id: string, index: number, isShiftClick?: boolean) => void;
  onEdit: (id: string) => void;
  mode: ViewMode;
  index: number;
}

export const SupplierRow = ({
  supplier,
  isSelected,
  onToggleSelect,
  onEdit,
  mode,
  index
}: SupplierRowProps) => {
  const handleSelectChange = (checked: boolean, event?: React.MouseEvent) => {
    const isShiftClick = event?.shiftKey || false;
    onToggleSelect(supplier.id, index, isShiftClick);
  };

  const handleEdit = () => {
    onEdit(supplier.id);
  };

  const formatWebsite = (website?: string) => {
    if (!website) return null;
    return website.replace(/^https?:\/\//, '');
  };

  return (
    <tr className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${
      isSelected ? 'bg-blue-50/50' : ''
    }`}>
      {/* Selection checkbox */}
      <td className="w-12 px-4 py-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleSelectChange}
          aria-label={`Select ${supplier.name}`}
        />
      </td>

      {/* Name */}
      <td className="px-4 py-3">
        <div className="font-medium text-gray-900">{supplier.name}</div>
      </td>

      {/* Website */}
      <td className="px-4 py-3">
        {supplier.website ? (
          <a
            href={supplier.website.startsWith('http') ? supplier.website : `https://${supplier.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            {formatWebsite(supplier.website)}
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-gray-400 text-sm">No website</span>
        )}
      </td>

      {/* Contact */}
      <td className="px-4 py-3">
        <div className="space-y-1">
          {supplier.phone && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Phone className="h-3 w-3" />
              {supplier.phone}
            </div>
          )}
          {supplier.email && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Mail className="h-3 w-3" />
              {supplier.email}
            </div>
          )}
          {!supplier.phone && !supplier.email && (
            <span className="text-gray-400 text-sm">No contact info</span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          supplier.isArchived 
            ? 'bg-gray-100 text-gray-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {supplier.isArchived ? 'Archived' : 'Active'}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="h-8 w-8 p-0"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};
