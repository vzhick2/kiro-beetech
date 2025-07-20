'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  flexRender,
  createColumnHelper,
  type ColumnDef,
  type Row,
  type Column,
} from '@tanstack/react-table';
import { Check, X, Edit3, Trash2, MoreHorizontal, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Supplier } from '@/types';
import {
  useSuppliers,
  useUpdateSupplier,
  useBulkDeleteSuppliers,
  useBulkArchiveSuppliers,
} from '@/hooks/use-suppliers';

interface SuppliersTableV2Props {
  searchQuery?: string;
}

interface EditableCell {
  supplierId: string;
  field: keyof Supplier;
  value: string | boolean | Date;
  isEditing: boolean;
}

const columnHelper = createColumnHelper<Supplier>();

export function SuppliersTableV2({ searchQuery = '' }: SuppliersTableV2Props) {
  const [editingCell, setEditingCell] = useState<EditableCell | null>(null);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState(searchQuery);
  const [sorting, setSorting] = useState<any[]>([]);

  // React Query hooks
  const { data: suppliers = [], isLoading } = useSuppliers(searchQuery);
  const updateSupplierMutation = useUpdateSupplier();
  const bulkDeleteMutation = useBulkDeleteSuppliers();
  const bulkArchiveMutation = useBulkArchiveSuppliers();

  // Update global filter when search query changes
  useMemo(() => {
    setGlobalFilter(searchQuery);
  }, [searchQuery]);

  // Inline editing cell component
  const EditableCell = useCallback(
    ({ row, column, getValue }: { row: Row<Supplier>; column: Column<Supplier>; getValue: () => any }) => {
      const initialValue = getValue();
      const [value, setValue] = useState(initialValue);
      const [isEditing, setIsEditing] = useState(false);
      const [loading, setLoading] = useState(false);

      const handleSave = async () => {
        if (value === initialValue) {
          setIsEditing(false);
          return;
        }

        setLoading(true);
        try {
          const field = column.id as keyof Supplier;
          const dbFieldMap: Record<keyof Supplier, string> = {
            supplierId: 'supplierid',
            name: 'name',
            website: 'website',
            contactPhone: 'phone',
            address: 'address',
            notes: 'notes',
            isArchived: 'isarchived',
            created_at: 'created_at',
          };

          const dbField = dbFieldMap[field];
          await updateSupplierMutation.mutateAsync({
            supplierId: row.original.supplierId,
            updates: { [dbField]: value },
          });
          setIsEditing(false);
        } catch (error) {
          console.error('Failed to save cell:', error);
          setValue(initialValue);
        } finally {
          setLoading(false);
        }
      };

      const handleCancel = () => {
        setValue(initialValue);
        setIsEditing(false);
      };

      if (isEditing) {
        return (
          <div className="flex items-center space-x-1">
            <input
              type="text"
              value={value || ''}
              onChange={e => setValue(e.target.value)}
              className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSave();
                } else if (e.key === 'Escape') {
                  handleCancel();
                }
              }}
              onBlur={handleSave}
              autoFocus
              disabled={loading}
            />
            <div className="flex space-x-1">
              <button
                onClick={handleSave}
                disabled={loading}
                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                title="Save"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                title="Cancel"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        );
      }

      return (
        <div
          className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
          onClick={() => setIsEditing(true)}
        >
          {column.id === 'contactPhone' && value ? (
            <a
              href={`tel:${value}`}
              className="text-blue-600 hover:text-blue-800 hover:underline"
              onClick={e => e.stopPropagation()}
            >
              {String(value)}
            </a>
          ) : column.id === 'website' && value ? (
            <a
              href={value.startsWith('http') ? value : `https://${value}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
              onClick={e => e.stopPropagation()}
            >
              {String(value)}
            </a>
          ) : (
            String(value || '')
          )}
        </div>
      );
    },
    [updateSupplierMutation]
  );

  // Column definitions
  const columns = useMemo(
    () => [
      // Selection column
      {
        id: 'select',
        header: ({ table }: any) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        ),
        cell: ({ row }: any) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      },
      
      // Name column
      {
        accessorKey: 'name',
        header: 'Name',
        cell: EditableCell,
        enableSorting: true,
        enableColumnFilter: true,
        size: 200,
      },
      
      // Website column
      {
        accessorKey: 'website',
        header: 'Website',
        cell: EditableCell,
        enableSorting: true,
        enableColumnFilter: true,
        size: 150,
      },
      
      // Phone column
      {
        accessorKey: 'contactPhone',
        header: 'Phone',
        cell: EditableCell,
        enableSorting: true,
        enableColumnFilter: true,
        size: 120,
      },
      
      // Address column
      {
        accessorKey: 'address',
        header: 'Address',
        cell: EditableCell,
        enableSorting: true,
        enableColumnFilter: true,
        size: 200,
      },
      
      // Status column
      {
        accessorKey: 'isArchived',
        header: 'Status',
        cell: ({ getValue }: any) => {
          const isArchived = getValue();
          return (
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isArchived
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {isArchived ? 'Archived' : 'Active'}
            </span>
          );
        },
        enableSorting: true,
        enableColumnFilter: true,
        size: 100,
      },
      
      // Created date column
      {
        accessorKey: 'created_at',
        header: 'Created',
        cell: ({ getValue }: any) => {
          const date = getValue();
          if (!date) return '-';
          return (
            <div className="cursor-help" title={`Created: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}>
              {date.toLocaleDateString()}
            </div>
          );
        },
        enableSorting: true,
        enableColumnFilter: true,
        size: 100,
      },
      
      // Actions column
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }: any) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => {
                  // Trigger edit mode for name field
                  const nameCell = row.getAllCells().find((cell: any) => cell.column.id === 'name');
                  if (nameCell) {
                    // This would need to be handled by the EditableCell component
                    console.log('Edit supplier:', row.original.supplierId);
                  }
                }}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    await updateSupplierMutation.mutateAsync({
                      supplierId: row.original.supplierId,
                      updates: { isarchived: true },
                    });
                  } catch (error) {
                    console.error('Failed to archive supplier:', error);
                  }
                }}
                className="text-red-600 focus:text-red-600"
              >
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
      },
    ],
    [EditableCell, updateSupplierMutation]
  );

  // Table instance
  const table = useReactTable({
    data: suppliers,
    columns,
    state: {
      rowSelection,
      globalFilter,
      sorting,
    },
    enableRowSelection: true,
    enableGlobalFilter: true,
    enableColumnFilters: true,
    enableSorting: true,
    enableColumnResizing: true,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Bulk operations
  const handleBulkDelete = useCallback(async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    try {
      const supplierIds = selectedRows.map(row => row.original.supplierId);
      await bulkDeleteMutation.mutateAsync(supplierIds);
      setRowSelection({});
    } catch (error) {
      console.error('Failed to delete suppliers:', error);
    }
  }, [table, bulkDeleteMutation]);

  const handleBulkArchive = useCallback(async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    try {
      const supplierIds = selectedRows.map(row => row.original.supplierId);
      await bulkArchiveMutation.mutateAsync(supplierIds);
      setRowSelection({});
    } catch (error) {
      console.error('Failed to archive suppliers:', error);
    }
  }, [table, bulkArchiveMutation]);

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
      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {table.getFilteredSelectedRowModel().rows.length}{' '}
                {table.getFilteredSelectedRowModel().rows.length === 1 ? 'supplier' : 'suppliers'} selected
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
                onClick={() => setRowSelection({})}
                className="text-gray-600 hover:text-gray-800"
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="bg-gray-50 border-b border-gray-200">
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="text-left p-3 font-semibold text-gray-700"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center ${
                            header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="p-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
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
              {table.getFilteredRowModel().rows.length} of {suppliers.length} suppliers
              {globalFilter && ' (filtered)'}
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