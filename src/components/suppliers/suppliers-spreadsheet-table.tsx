'use client';

import { useState, useCallback, useRef } from 'react';
import { Plus, MoreHorizontal, Trash2, Edit3, Check } from 'lucide-react';
import { Supplier, CreateSupplierRequest } from '@/types';
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
  useCreateSupplier,
  useBulkDeleteSuppliers,
  useBulkArchiveSuppliers,
} from '@/hooks/use-suppliers';

interface SuppliersSpreadsheetTableProps {
  searchQuery?: string;
}

interface EditableRow {
  supplierId: string;
  fields: {
    name: string;
    website: string;
    contactPhone: string;
  };
  isEditing: boolean;
}

interface NewRowData {
  name: string;
  website: string;
  contactPhone: string;
  isEditing: boolean;
}

export function SuppliersSpreadsheetTable({
  searchQuery = '',
}: SuppliersSpreadsheetTableProps) {
  const [editingRow, setEditingRow] = useState<EditableRow | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [newRow, setNewRow] = useState<NewRowData | null>(null);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // React Query hooks
  const { data: suppliers = [], isLoading } = useSuppliers(searchQuery);
  const updateSupplierMutation = useUpdateSupplier();
  const createSupplierMutation = useCreateSupplier();
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

  const handleRowEdit = useCallback((supplier: Supplier) => {
    setEditingRow({
      supplierId: supplier.supplierId,
      fields: {
        name: supplier.name,
        website: supplier.website || '',
        contactPhone: supplier.contactPhone || '',
      },
      isEditing: true,
    });
    
    // Focus the first input after state update
    setTimeout(() => {
      const firstInput = inputRefs.current[`${supplier.supplierId}-name`];
      if (firstInput) {
        firstInput.focus();
        firstInput.select();
      }
    }, 0);
  }, []);

  const handleRowSave = useCallback(async () => {
    if (!editingRow) {
      return;
    }

    try {
      // Only send changed fields
      const updates: any = {};
      const supplier = suppliers.find(s => s.supplierId === editingRow.supplierId);
      
      if (supplier) {
        if (editingRow.fields.name !== supplier.name) {
          updates.name = editingRow.fields.name;
        }
        if (editingRow.fields.website !== (supplier.website || '')) {
          updates.website = editingRow.fields.website || null;
        }
        if (editingRow.fields.contactPhone !== (supplier.contactPhone || '')) {
          updates.contactphone = editingRow.fields.contactPhone || null;
        }
      }

      if (Object.keys(updates).length > 0) {
        await updateSupplierMutation.mutateAsync({
          supplierId: editingRow.supplierId,
          updates,
        });
      }
      
      setEditingRow(null);
    } catch (error) {
      console.error('Failed to save row:', error);
    }
  }, [editingRow, suppliers, updateSupplierMutation]);

  const handleRowCancel = useCallback(() => {
    setEditingRow(null);
  }, []);

  const handleFieldChange = useCallback((field: keyof EditableRow['fields'], value: string) => {
    setEditingRow(prev => 
      prev ? {
        ...prev,
        fields: { ...prev.fields, [field]: value }
      } : null
    );
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, field: keyof EditableRow['fields']) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRowSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleRowCancel();
    } else if (e.key === 'Tab') {
      const fieldOrder: (keyof EditableRow['fields'])[] = ['name', 'website', 'contactPhone'];
      const currentIndex = fieldOrder.indexOf(field);
      
      if (!e.shiftKey && currentIndex < fieldOrder.length - 1) {
        // Move to next field
        e.preventDefault();
        const nextField = fieldOrder[currentIndex + 1];
        const nextInput = inputRefs.current[`${editingRow?.supplierId}-${nextField}`];
        if (nextInput) {
          nextInput.focus();
          nextInput.select();
        }
      } else if (e.shiftKey && currentIndex > 0) {
        // Move to previous field
        e.preventDefault();
        const prevField = fieldOrder[currentIndex - 1];
        const prevInput = inputRefs.current[`${editingRow?.supplierId}-${prevField}`];
        if (prevInput) {
          prevInput.focus();
          prevInput.select();
        }
      } else if (!e.shiftKey && currentIndex === fieldOrder.length - 1) {
        // Save when tabbing out of last field
        e.preventDefault();
        handleRowSave();
      }
    }
  }, [editingRow, handleRowSave, handleRowCancel]);

  const handleAddNewRow = useCallback(() => {
    setNewRow({
      name: '',
      website: '',
      contactPhone: '',
      isEditing: true,
    });
  }, []);

  const handleSaveNewRow = useCallback(async () => {
    if (!newRow || !newRow.name.trim()) {
      return;
    }

    try {
      const supplierData: CreateSupplierRequest = {
        name: newRow.name.trim(),
      };

      if (newRow.website.trim()) {
        supplierData.website = newRow.website.trim();
      }

      if (newRow.contactPhone.trim()) {
        supplierData.contactPhone = newRow.contactPhone.trim();
      }

      await createSupplierMutation.mutateAsync(supplierData);
      setNewRow(null);
    } catch (error) {
      console.error('Failed to create supplier:', error);
    }
  }, [newRow, createSupplierMutation]);

  const handleCancelNewRow = useCallback(() => {
    setNewRow(null);
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

  const renderCell = useCallback(
    (supplier: Supplier, field: keyof EditableRow['fields']) => {
      const isCurrentRowEditing = editingRow?.supplierId === supplier.supplierId;
      
      if (isCurrentRowEditing) {
        const inputKey = `${supplier.supplierId}-${field}`;
        return (
          <input
            ref={el => { inputRefs.current[inputKey] = el; }}
            type="text"
            value={editingRow.fields[field]}
            onChange={e => handleFieldChange(field, e.target.value)}
            onKeyDown={e => handleKeyDown(e, field)}
            onBlur={handleRowSave}
            className="w-full px-2 py-1 text-sm border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white rounded"
            placeholder={field === 'name' ? 'Supplier name' : field === 'website' ? 'Website URL' : 'Phone number'}
          />
        );
      }

      const value = supplier[field] || '';
      
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
            onClick={e => e.stopPropagation()} // Prevent row editing when clicking link
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
            onClick={e => e.stopPropagation()} // Prevent row editing when clicking link
          >
            {String(value)}
          </a>
        );
      }

      return <span className="block w-full">{String(value)}</span>;
    },
    [editingRow, handleFieldChange, handleKeyDown, handleRowSave]
  );

  const renderNewRowCell = useCallback(
    (field: keyof NewRowData, isLastField = false) => {
      if (field === 'isEditing') {
        return null;
      }

      return (
        <input
          type="text"
          value={newRow?.[field] || ''}
          onChange={e =>
            setNewRow(prev =>
              prev ? { ...prev, [field]: e.target.value } : null
            )
          }
          placeholder={
            field === 'name'
              ? 'Supplier name'
              : field === 'website'
                ? 'Website URL'
                : 'Phone number'
          }
          className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              if (isLastField) {
                handleSaveNewRow();
              } else {
                const nextInput = e.currentTarget.closest('td')?.nextElementSibling?.querySelector('input');
                if (nextInput) {
                  (nextInput as HTMLInputElement).focus();
                }
              }
            } else if (e.key === 'Escape') {
              handleCancelNewRow();
            } else if (e.key === 'Tab' && isLastField && !e.shiftKey) {
              e.preventDefault();
              handleSaveNewRow();
            }
          }}
        />
      );
    },
    [newRow, handleSaveNewRow, handleCancelNewRow]
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
      {/* Bulk Actions - Fixed height to prevent layout shift */}
      <div className="min-h-[60px]">
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
      </div>

      {/* Suppliers Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
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
                <th className="text-left p-3 font-semibold text-gray-700 w-1/3">
                  Supplier Name
                </th>
                <th className="text-left p-3 font-semibold text-gray-700 w-1/3">
                  Website
                </th>
                <th className="text-left p-3 font-semibold text-gray-700 w-1/6">
                  Phone
                </th>
                <th className="text-left p-3 font-semibold text-gray-700 w-20">
                  Status
                </th>
                <th className="w-12 p-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* New Row */}
              {newRow && (
                <tr className="border-b border-gray-100 bg-blue-50">
                  <td className="p-3">
                    <div className="flex space-x-1">
                      <button
                        onClick={handleSaveNewRow}
                        disabled={!newRow.name.trim()}
                        className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Save"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancelNewRow}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        title="Cancel"
                      >
                        ×
                      </button>
                    </div>
                  </td>
                  <td className="p-3">{renderNewRowCell('name')}</td>
                  <td className="p-3">{renderNewRowCell('website')}</td>
                  <td className="p-3">{renderNewRowCell('contactPhone', true)}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      New
                    </span>
                  </td>
                  <td className="p-3"></td>
                </tr>
              )}

              {/* Add New Row Button */}
              {!newRow && (
                <tr
                  className="border-b border-gray-100 bg-gray-50 hover:bg-gray-100 cursor-pointer group"
                  onClick={handleAddNewRow}
                >
                  <td className="p-3">
                    <Plus className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  </td>
                  <td className="p-3 text-gray-500 group-hover:text-gray-700 italic">
                    Click to add new supplier...
                  </td>
                  <td className="p-3"></td>
                  <td className="p-3"></td>
                  <td className="p-3"></td>
                  <td className="p-3"></td>
                </tr>
              )}

              {/* Existing Suppliers */}
              {filteredSuppliers.map(supplier => {
                const isEditing = editingRow?.supplierId === supplier.supplierId;
                
                return (
                  <tr
                    key={supplier.supplierId}
                    className={`border-b border-gray-100 transition-colors ${
                      isEditing 
                        ? 'bg-blue-50 ring-2 ring-blue-200' 
                        : 'hover:bg-gray-50 cursor-pointer'
                    }`}
                    onClick={e => {
                      // Don't trigger row edit if clicking on links or the dropdown
                      const target = e.target as HTMLElement;
                      if (target.tagName === 'A' || target.closest('[role="button"]') || target.closest('button')) {
                        return;
                      }
                      if (!isEditing) {
                        handleRowEdit(supplier);
                      }
                    }}
                  >
                    <td className="p-3" onClick={e => e.stopPropagation()}>
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
                    <td className="p-3" onClick={e => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="min-w-[32px] min-h-[32px] p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors flex items-center justify-center">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem
                            onClick={() => handleRowEdit(supplier)}
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Supplier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateSupplierMutation.mutate({
                                supplierId: supplier.supplierId,
                                updates: { isarchived: true },
                              })
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-sm text-blue-700">
          <p className="font-medium mb-1">💡 How to edit suppliers:</p>
          <ul className="space-y-1 text-blue-600">
            <li>• <strong>Click anywhere on a row</strong> (except links) to start editing</li>
            <li>• <strong>Tab/Shift+Tab</strong> to move between fields</li>
            <li>• <strong>Enter</strong> to save changes</li>
            <li>• <strong>Escape</strong> to cancel editing</li>
            <li>• <strong>Click website/phone links</strong> to open them (won't trigger editing)</li>
          </ul>
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
