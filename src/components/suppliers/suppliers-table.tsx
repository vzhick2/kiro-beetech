'use client';

import { useState, useCallback } from 'react';
import { Check, X, Edit3, Trash2, MoreHorizontal } from 'lucide-react';
import { Supplier } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useSuppliers,
  useUpdateSupplier,
  useBulkDeleteSuppliers,
  useBulkArchiveSuppliers,
} from '@/hooks/use-suppliers';

interface SuppliersTableProps {
  searchQuery?: string;
}

interface EditableCell {
  supplierId: string;
  field: keyof Supplier;
  value: string | boolean | Date;
  isEditing: boolean;
}

export function SuppliersTable({ searchQuery = '' }: SuppliersTableProps) {
  const [editingCell, setEditingCell] = useState<EditableCell | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // React Query hooks
  const { data: suppliers = [], isLoading } = useSuppliers(searchQuery);
  const updateSupplierMutation = useUpdateSupplier();
  const bulkDeleteMutation = useBulkDeleteSuppliers();
  const bulkArchiveMutation = useBulkArchiveSuppliers();

  // Filter suppliers based on search query
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch =
      !searchQuery ||
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (supplier.website &&
        supplier.website.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (supplier.contactPhone &&
        supplier.contactPhone
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const handleCellEdit = useCallback(
    (
      supplierId: string,
      field: keyof Supplier,
      value: string | boolean | Date
    ) => {
      setEditingCell({ supplierId, field, value, isEditing: true });
    },
    []
  );

  const handleCellSave = useCallback(
    async (
      supplierId: string,
      field: keyof Supplier,
      value: string | boolean | Date
    ) => {
      try {
        // Map frontend field names to database column names
        const dbFieldMap: Record<keyof Supplier, string> = {
          supplierId: 'supplierid',
          name: 'name',
          website: 'storeurl',
          contactPhone: 'phone',
          address: 'address',
          notes: 'notes',
          isArchived: 'isarchived',
          created_at: 'created_at',
        };

        const dbField = dbFieldMap[field];

        // Use React Query mutation
        await updateSupplierMutation.mutateAsync({
          supplierId,
          updates: { [dbField]: value },
        });
        setEditingCell(null);
      } catch (error) {
        console.error('Failed to save cell:', error);
      }
    },
    [updateSupplierMutation]
  );

  const handleCellCancel = useCallback(() => {
    setEditingCell(null);
  }, []);

  const handleRowSelect = useCallback(
    (supplierId: string, checked: boolean) => {
      setSelectedRows(prev => {
        const newSet = new Set(prev);
        if (checked) {
          newSet.add(supplierId);
        } else {
          newSet.delete(supplierId);
        }
        return newSet;
      });
    },
    []
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedRows(
          new Set(suppliers.map(supplier => supplier.supplierId))
        );
      } else {
        setSelectedRows(new Set());
      }
    },
    [suppliers]
  );

  const handleBulkDelete = useCallback(async () => {
    if (selectedRows.size === 0) {
      return;
    }

    try {
      const supplierIds = Array.from(selectedRows);
      await bulkDeleteMutation.mutateAsync(supplierIds);
      setSelectedRows(new Set());
    } catch (error) {
      console.error('Failed to delete suppliers:', error);
    }
  }, [selectedRows, bulkDeleteMutation]);

  const handleBulkArchive = useCallback(async () => {
    if (selectedRows.size === 0) {
      return;
    }

    try {
      const supplierIds = Array.from(selectedRows);
      await bulkArchiveMutation.mutateAsync(supplierIds);
      setSelectedRows(new Set());
    } catch (error) {
      console.error('Failed to archive suppliers:', error);
    }
  }, [selectedRows, bulkArchiveMutation]);

  const handleArchiveSupplier = useCallback(
    async (supplierId: string) => {
      try {
        await updateSupplierMutation.mutateAsync({
          supplierId,
          updates: { isarchived: true },
        });
      } catch (error) {
        console.error('Failed to archive supplier:', error);
      }
    },
    [updateSupplierMutation]
  );

  const renderCell = useCallback(
    (supplier: Supplier, field: keyof Supplier) => {
      const value = supplier[field];
      const isEditing =
        editingCell?.supplierId === supplier.supplierId &&
        editingCell?.field === field;

      if (isEditing) {
        return (
          <div className="flex items-center space-x-1">
            <input
              type={typeof value === 'boolean' ? 'checkbox' : 'text'}
              defaultValue={String(value || '')}
              className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleCellSave(
                    supplier.supplierId,
                    field,
                    e.currentTarget.value
                  );
                } else if (e.key === 'Escape') {
                  handleCellCancel();
                }
              }}
              onBlur={e =>
                handleCellSave(supplier.supplierId, field, e.target.value)
              }
              autoFocus
            />
            <div className="flex space-x-1">
              <button
                onClick={() =>
                  handleCellSave(supplier.supplierId, field, value || '')
                }
                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                title="Save"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                onClick={handleCellCancel}
                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                title="Cancel"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        );
      }

      // Display value based on field type
      if (
        field === 'created_at' &&
        value &&
        typeof value === 'object' &&
        'toLocaleDateString' in value
      ) {
        return (value as Date).toLocaleDateString();
      }

      if (field === 'website' && value) {
        return (
          <a
            href={
              String(value).startsWith('http')
                ? String(value)
                : `https://${value}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {String(value)}
          </a>
        );
      }

      if (field === 'contactPhone' && value) {
        return (
          <a
            href={`tel:${value}`}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {String(value)}
          </a>
        );
      }

      return String(value || '');
    },
    [editingCell, handleCellSave, handleCellCancel]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedRows.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedRows.size}{' '}
                {selectedRows.size === 1 ? 'supplier' : 'suppliers'} selected
              </span>
            </div>
            <div className="flex space-x-3">
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkArchive}
                className="text-blue-700 border-blue-300 hover:bg-blue-100 transition-colors"
              >
                Archive Selected
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkDelete}
                className="text-red-700 border-red-300 hover:bg-red-100 transition-colors"
              >
                Delete Selected
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedRows(new Set())}
                className="text-gray-600 hover:text-gray-800"
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Suppliers Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="w-12 p-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.size === suppliers.length &&
                      suppliers.length > 0
                    }
                    onChange={e => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </th>
                <th className="text-left p-3 font-semibold text-gray-700 min-w-[120px]">
                  Name
                </th>
                <th className="text-left p-3 font-semibold text-gray-700 min-w-[120px]">
                  Website
                </th>
                <th className="text-left p-3 font-semibold text-gray-700 min-w-[100px]">
                  Phone
                </th>
                <th className="text-left p-3 font-semibold text-gray-700 min-w-[120px]">
                  Address
                </th>
                <th className="text-left p-3 font-semibold text-gray-700 min-w-[80px]">
                  Status
                </th>
                <th className="w-12 p-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map(supplier => (
                <tr
                  key={supplier.supplierId}
                  className="border-b border-gray-100 hover:bg-gray-50 group"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(supplier.supplierId)}
                      onChange={e =>
                        handleRowSelect(supplier.supplierId, e.target.checked)
                      }
                      className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-3 font-medium">
                    {renderCell(supplier, 'name')}
                  </td>
                  <td className="p-3">{renderCell(supplier, 'website')}</td>
                  <td className="p-3">
                    {renderCell(supplier, 'contactPhone')}
                  </td>
                  <td className="p-3">{renderCell(supplier, 'address')}</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        supplier.isArchived
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {supplier.isArchived ? 'Archived' : 'Active'}
                    </span>
                  </td>
                  <td className="p-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() =>
                            handleCellEdit(
                              supplier.supplierId,
                              'name',
                              supplier.name
                            )
                          }
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleArchiveSupplier(supplier.supplierId)
                          }
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between text-sm text-gray-700 flex-wrap gap-4">
          <div className="flex items-center space-x-6">
            <span className="font-semibold">
              {filteredSuppliers.length} of {suppliers.length} suppliers
              {searchQuery && ' (filtered)'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Active:</span>
            <span className="text-green-600 font-bold text-lg">
              {suppliers.filter(s => !s.isArchived).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
