// TESTSUPPLIERS Table Component (Client Component) - Notion-inspired design
'use client';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type SortingState,
  type PaginationState,
} from '@tanstack/react-table';
import { getSuppliers, Supplier } from '@/lib/supabase/suppliers';
import { bulkArchiveSuppliers, bulkUnarchiveSuppliers, bulkDeleteSuppliers } from '@/app/actions/suppliers';
import { useColumnPreferences } from '@/hooks/use-local-storage';

import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit3,
  Archive,
  Download,
  X,
  RotateCcw,
  Trash2
} from 'lucide-react';

import { ViewOptionsPanel } from '@/components/suppliers/view-options-panel';


interface TestSuppliersTableProps {
  showInactive: boolean;
  onToggleInactiveAction: (show: boolean) => void;
}

  // Column visibility configuration
interface ColumnVisibility {
  name: boolean;
  website: boolean;
  contactphone: boolean;
  email: boolean;
  address: boolean;
  notes: boolean;
  isarchived: boolean;
  created_at: boolean;
}export function TestSuppliersTable({ showInactive, onToggleInactiveAction }: TestSuppliersTableProps) {
  // Fetch suppliers from Supabase (react-query)
  const { data: suppliers = [], isLoading, error, refetch } = useQuery({
    queryKey: ['testsuppliers', { showInactive }],
    queryFn: () => getSuppliers({ includeArchived: showInactive }),
  });

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  // Use persistent column visibility with localStorage
  const [columnVisibility, setColumnVisibility] = useColumnPreferences<ColumnVisibility>('testsuppliers', {
    name: true,
    website: true,
    contactphone: true,
    email: true,
    address: false,
    notes: true,
    isarchived: true,
    created_at: false,
  });
  
  // Density mode state - fixed to compact (density selector removed)
  const densityMode = 'compact';
  
  // Remove custom view options dropdown state
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');


  // Mapping between ViewOptionsPanel keys and table column keys
  const columnKeyMapping = {
    name: 'name',
    website: 'website', 
    phone: 'contactphone',
    email: 'email',
    address: 'address',
    notes: 'notes',
    status: 'isarchived',
    createdAt: 'created_at'
  } as const;

  // Convert ViewOptionsPanel visibility to table column visibility
  const viewOptionsToTableVisibility = (viewOptions: typeof columnKeyMapping) => {
    const result: Partial<ColumnVisibility> = {};
    Object.entries(viewOptions).forEach(([viewKey, tableKey]) => {
      if (tableKey in columnVisibility) {
        result[tableKey as keyof ColumnVisibility] = columnVisibility[tableKey as keyof ColumnVisibility];
      }
    });
    return result;
  };

  // Convert table column visibility to ViewOptionsPanel format
  const tableToViewOptionsVisibility = () => {
    return {
      name: columnVisibility.name,
      website: columnVisibility.website,
      phone: columnVisibility.contactphone,
      email: columnVisibility.email,
      address: columnVisibility.address,
      notes: columnVisibility.notes,
      status: columnVisibility.isarchived,
      createdAt: columnVisibility.created_at,
    };
  };

  // Handle ViewOptionsPanel column visibility changes
  const handleViewOptionsColumnChange = (viewKey: string, visible: boolean) => {
    const tableKey = columnKeyMapping[viewKey as keyof typeof columnKeyMapping];
    if (tableKey) {
      setColumnVisibility(prev => ({ ...prev, [tableKey]: visible }));
    }
  };

  // Get density mode classes - fixed to compact
  const getDensityClasses = () => {
    return {
      header: 'px-0 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      cell: 'text-sm text-gray-900 align-middle py-2'
    };
  };

  const densityClasses = getDensityClasses();

  // Helper functions
  const handleSort = useCallback((columnId: string) => {
    setSorting((prev) => {
      const existing = prev.find(s => s.id === columnId);
      if (!existing) return [{ id: columnId, desc: false }];
      if (!existing.desc) return [{ id: columnId, desc: true }];
      return [];
    });
  }, []);

  const renderSortIcon = useCallback((columnId: string) => {
    const sort = sorting.find(s => s.id === columnId);
    if (!sort) return null;
    return sort.desc ? <ChevronDown className="inline h-3 w-3 ml-1" /> : <ChevronUp className="inline h-3 w-3 ml-1" />;
  }, [sorting]);

  const toggleColumnVisibility = useCallback((column: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({ ...prev, [column]: !prev[column] }));
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  // Row selection handlers
  const toggleRowSelection = useCallback((rowId: string) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  }, []);

  const toggleAllRows = useCallback((currentPageRows: string[]) => {
    const allSelected = currentPageRows.every(id => selectedRows.has(id));
    
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (allSelected) {
        currentPageRows.forEach(id => newSet.delete(id));
      } else {
        currentPageRows.forEach(id => newSet.add(id));
      }
      return newSet;
    });
  }, [selectedRows]);

  const handleEditRow = useCallback((rowId: string) => {
    setEditingRow(editingRow === rowId ? null : rowId);
  }, [editingRow]);

  // Batch action handlers
  const handleUnarchiveSelected = useCallback(async () => {
    const selectedIds = Array.from(selectedRows);
    try {
      const result = await bulkUnarchiveSuppliers(selectedIds);
      if (result.success) {
        console.log(`Successfully unarchived ${result.unarchivedCount} suppliers`);
        setSelectedRows(new Set());
        refetch();
      } else {
        console.error('Failed to unarchive suppliers:', result.error);
        alert(`Failed to unarchive suppliers: ${result.error}`);
      }
    } catch (error) {
      console.error('Error unarchiving suppliers:', error);
      alert('Failed to unarchive suppliers. Please try again.');
    }
  }, [selectedRows, refetch]);

  const handleArchiveSelected = useCallback(async () => {
    const selectedIds = Array.from(selectedRows);
    try {
      const result = await bulkArchiveSuppliers(selectedIds);
      if (result.success) {
        console.log(`Successfully archived ${result.archivedCount} suppliers`);
        setSelectedRows(new Set());
        refetch();
      } else {
        console.error('Failed to archive suppliers:', result.error);
        alert(`Failed to archive suppliers: ${result.error}`);
      }
    } catch (error) {
      console.error('Error archiving suppliers:', error);
      alert('Failed to archive suppliers. Please try again.');
    }
  }, [selectedRows, refetch]);

  const handleDeleteSelected = useCallback(async () => {
    const selectedIds = Array.from(selectedRows);
    if (confirm(`Are you sure you want to delete ${selectedIds.length} supplier${selectedIds.length !== 1 ? 's' : ''}? This action cannot be undone.`)) {
      try {
        const result = await bulkDeleteSuppliers(selectedIds);
        if (result.success) {
          const { 
            deletedCount = 0, 
            blockedCount = 0, 
            blockedReasons = [], 
            suggestArchive = false 
          } = result;
          
          let message = '';
          if (deletedCount > 0) {
            message += `Successfully deleted ${deletedCount} supplier${deletedCount !== 1 ? 's' : ''}`;
          }
          
          if (blockedCount > 0) {
            if (deletedCount > 0) message += '\n\n';
            message += `${blockedCount} supplier${blockedCount !== 1 ? 's' : ''} could not be deleted:\n`;
            if (blockedReasons && blockedReasons.length > 0) {
              blockedReasons.forEach((blocked: any) => {
                message += `• ${blocked.reason}\n`;
              });
            }
            if (suggestArchive) {
              message += '\nConsider using "Archive" instead to preserve business data.';
            }
          }
          
          console.log(`Delete operation completed: ${deletedCount} deleted, ${blockedCount} blocked`);
          if (message) {
            alert(message);
          }
          
          setSelectedRows(new Set());
          refetch();
        } else {
          console.error('Failed to delete suppliers:', result.error);
          alert(`Failed to delete suppliers: ${result.error}`);
        }
      } catch (error) {
        console.error('Error deleting suppliers:', error);
        alert('Failed to delete suppliers. Please try again.');
      }
    }
  }, [selectedRows, refetch]);

  // CSV export functionality
  const exportToCsv = useCallback((data: Supplier[], filename: string) => {
    // Define CSV headers
    const headers = [
      'Supplier ID',
      'Name', 
      'Website',
      'Phone',
      'Email',
      'Address',
      'Notes',
      'Status',
      'Created Date'
    ];

    // Convert data to CSV rows
    const csvRows = [
      headers.join(','),
      ...data.map(supplier => [
        supplier.supplierid,
        `"${supplier.name.replace(/"/g, '""')}"`,
        supplier.website ? `"${supplier.website.replace(/"/g, '""')}"` : '',
        supplier.contactphone ? `"${supplier.contactphone.replace(/"/g, '""')}"` : '',
        supplier.email ? `"${supplier.email.replace(/"/g, '""')}"` : '',
        supplier.address ? `"${supplier.address.replace(/"/g, '""')}"` : '',
        supplier.notes ? `"${supplier.notes.replace(/"/g, '""')}"` : '',
        supplier.isarchived ? 'Inactive' : 'Active',
        supplier.created_at ? formatDate(String(supplier.created_at)) : ''
      ].join(','))
    ];

    // Create and download CSV file
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [formatDate]);

  const handleExportSelected = useCallback(() => {
    const selectedIds = Array.from(selectedRows);
    const selectedSuppliers = suppliers.filter(s => selectedIds.includes(s.supplierid));
    
    if (selectedSuppliers.length === 0) {
      alert('No suppliers selected for export');
      return;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `suppliers-export-${timestamp}.csv`;
    
    exportToCsv(selectedSuppliers, filename);
    console.log(`Exported ${selectedSuppliers.length} suppliers to ${filename}`);
  }, [selectedRows, suppliers, exportToCsv]);


  // Filter suppliers based on search and showInactive
  const filteredSuppliers = useMemo(() => {
    let filtered = suppliers;
    
    // Filter by search term
    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter(supplier => 
        supplier.name.toLowerCase().includes(searchLower) ||
        supplier.website?.toLowerCase().includes(searchLower) ||
        supplier.contactphone?.toLowerCase().includes(searchLower) ||
        supplier.email?.toLowerCase().includes(searchLower) ||
        supplier.address?.toLowerCase().includes(searchLower) ||
        supplier.notes?.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [suppliers, searchValue]);

  // Table columns with conditional visibility
  const columnHelper = createColumnHelper<Supplier>();
  const columns = useMemo(() => {
    const actionColumns = [
      // Checkbox column
      columnHelper.display({
        id: 'select',
        header: ({ table }) => {
          const currentPageRows = table.getRowModel().rows.map(row => row.original.supplierid);
          const allCurrentSelected = currentPageRows.length > 0 && currentPageRows.every(id => selectedRows.has(id));
          
          return (
            <div className="flex items-center justify-center px-3">
              <input
                type="checkbox"
                checked={allCurrentSelected}
                onChange={() => toggleAllRows(currentPageRows)}
                className="rounded border-gray-300"
              />
            </div>
          );
        },
        cell: ({ row }) => (
          <div className="flex items-center justify-center h-full py-2 px-3">
            <input
              type="checkbox"
              checked={selectedRows.has(row.original.supplierid)}
              onChange={() => toggleRowSelection(row.original.supplierid)}
              className="rounded border-gray-300"
            />
          </div>
        ),
        size: 44,
        minSize: 44,
        maxSize: 44,
        enableSorting: false,
      }),
      // Edit column
      columnHelper.display({
        id: 'edit',
        header: () => <div className="flex items-center justify-center px-3"></div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-center h-full py-2 px-3">
            <button
              onClick={() => handleEditRow(row.original.supplierid)}
              className={`p-1 rounded hover:bg-gray-100 ${editingRow === row.original.supplierid ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              title="Edit row"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          </div>
        ),
        size: 44,
        minSize: 44,
        maxSize: 44,
        enableSorting: false,
      }),
    ];

    const dataColumns = [
      columnHelper.accessor('name', {
        header: () => (
          <div className="flex items-center cursor-pointer select-none hover:bg-gray-100 px-3 py-1 rounded" onClick={() => handleSort('name')}>
            <span className="font-medium text-gray-900">Supplier Name</span>
            {renderSortIcon('name')}
          </div>
        ),
        cell: info => (
          <div className="flex items-center h-full py-2 px-3">
            <div className="font-medium text-gray-900 leading-tight max-h-[4.5rem] overflow-hidden" style={{ 
              display: '-webkit-box', 
              WebkitLineClamp: 3, 
              WebkitBoxOrient: 'vertical' 
            }}>
              {info.getValue()}
            </div>
          </div>
        ),
        size: 200,
        minSize: 150,
        enableSorting: true,
      }),
      columnHelper.accessor('website', {
        header: () => (
          <div className="flex items-center cursor-pointer select-none hover:bg-gray-100 px-3 py-1 rounded" onClick={() => handleSort('website')}>
            <span className="font-medium text-gray-900">Website</span>
            {renderSortIcon('website')}
          </div>
        ),
        cell: info => (
          <div className="flex items-center h-full py-2 px-3">
            {info.getValue() ? (
              <a 
                href={info.getValue() || '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-700 hover:text-blue-600 hover:underline leading-tight max-h-[4.5rem] overflow-hidden block transition-colors duration-150"
                style={{ 
                  display: '-webkit-box', 
                  WebkitLineClamp: 3, 
                  WebkitBoxOrient: 'vertical' 
                }}
              >
                {info.getValue() || ''}
              </a>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        ),
        size: 180,
        minSize: 120,
        enableSorting: true,
      }),
      columnHelper.accessor('contactphone', {
        header: () => (
          <div className="flex items-center cursor-pointer select-none hover:bg-gray-100 px-3 py-1 rounded" onClick={() => handleSort('contactphone')}>
            <span className="font-medium text-gray-900">Phone</span>
            {renderSortIcon('contactphone')}
          </div>
        ),
        cell: info => (
          <div className="flex items-center h-full py-2 px-3">
            <span className="text-gray-700 leading-tight max-h-[4.5rem] overflow-hidden block" style={{ 
              display: '-webkit-box', 
              WebkitLineClamp: 3, 
              WebkitBoxOrient: 'vertical' 
            }}>
              {info.getValue() || '-'}
            </span>
          </div>
        ),
        size: 140,
        minSize: 100,
        enableSorting: true,
      }),
      columnHelper.accessor('email', {
        header: () => (
          <div className="flex items-center cursor-pointer select-none hover:bg-gray-100 px-3 py-1 rounded" onClick={() => handleSort('email')}>
            <span className="font-medium text-gray-900">Email</span>
            {renderSortIcon('email')}
          </div>
        ),
        cell: info => (
          <div className="flex items-center h-full py-2 px-3">
            {info.getValue() ? (
              <a 
                href={`mailto:${info.getValue()}`} 
                className="text-gray-700 hover:text-blue-600 hover:underline leading-tight max-h-[4.5rem] overflow-hidden block transition-colors duration-150"
                style={{ 
                  display: '-webkit-box', 
                  WebkitLineClamp: 3, 
                  WebkitBoxOrient: 'vertical' 
                }}
              >
                {String(info.getValue() || '')}
              </a>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        ),
        size: 180,
        minSize: 120,
        enableSorting: true,
      }),
      columnHelper.accessor('address', {
        header: () => (
          <div className="flex items-center cursor-pointer select-none hover:bg-gray-100 px-3 py-1 rounded" onClick={() => handleSort('address')}>
            <span className="font-medium text-gray-900">Address</span>
            {renderSortIcon('address')}
          </div>
        ),
        cell: info => (
          <div className="flex items-center h-full py-2 px-3">
            <span className="text-gray-700 leading-tight max-h-[4.5rem] overflow-hidden block" style={{ 
              display: '-webkit-box', 
              WebkitLineClamp: 3, 
              WebkitBoxOrient: 'vertical' 
            }}>
              {info.getValue() || '-'}
            </span>
          </div>
        ),
        size: 200,
        minSize: 150,
        enableSorting: true,
      }),
      columnHelper.accessor('notes', {
        header: () => (
          <div className="flex items-center cursor-pointer select-none hover:bg-gray-100 px-3 py-1 rounded" onClick={() => handleSort('notes')}>
            <span className="font-medium text-gray-900">Notes</span>
            {renderSortIcon('notes')}
          </div>
        ),
        cell: info => (
          <div className="flex items-center h-full py-2 px-3">
            <span className="text-gray-600 text-sm leading-tight max-h-[4.5rem] overflow-hidden block" style={{ 
              display: '-webkit-box', 
              WebkitLineClamp: 3, 
              WebkitBoxOrient: 'vertical' 
            }}>
              {info.getValue() || ''}
            </span>
          </div>
        ),
        size: 250,
        minSize: 150,
        enableSorting: true,
      }),
      columnHelper.accessor('isarchived', {
        header: () => (
          <div className="flex items-center cursor-pointer select-none hover:bg-gray-100 px-3 py-1 rounded" onClick={() => handleSort('isarchived')}>
            <span className="font-medium text-gray-900">Status</span>
            {renderSortIcon('isarchived')}
          </div>
        ),
        cell: info => (
          <div className="flex items-center h-full py-2 px-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              info.getValue() ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {info.getValue() ? 'Inactive' : 'Active'}
            </span>
          </div>
        ),
        size: 100,
        minSize: 80,
        enableSorting: true,
      }),
      columnHelper.accessor('created_at', {
        header: () => (
          <div className="flex items-center cursor-pointer select-none hover:bg-gray-100 px-3 py-1 rounded" onClick={() => handleSort('created_at')}>
            <span className="font-medium text-gray-900">Created Date</span>
            {renderSortIcon('created_at')}
          </div>
        ),
        cell: info => (
          <div className="flex items-center h-full py-2 px-3">
            <span className="text-gray-600 text-sm">{info.getValue() ? formatDate(String(info.getValue())) : '-'}</span>
          </div>
        ),
        size: 120,
        minSize: 100,
        enableSorting: true,
      }),
    ];

    // Filter data columns based on visibility
    const visibleDataColumns = dataColumns.filter((column) => {
      const accessor = (column as any).accessorKey as keyof ColumnVisibility;
      return columnVisibility[accessor];
    });

    // Return action columns + visible data columns
    return [...actionColumns, ...visibleDataColumns];
  }, [columnHelper, handleSort, renderSortIcon, formatDate, columnVisibility, selectedRows, toggleAllRows, toggleRowSelection, handleEditRow, editingRow]);
  // Table instance with pagination
  const table = useReactTable({
    data: filteredSuppliers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { 
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualPagination: false,
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ctrl+A - Select all visible rows
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        const visibleRowIds = table.getRowModel().rows.map(row => row.original.supplierid);
        setSelectedRows(new Set(visibleRowIds));
      }

      // Delete key - Delete selected rows
      if (e.key === 'Delete' && selectedRows.size > 0) {
        e.preventDefault();
        handleDeleteSelected();
      }

      // Escape key - Clear selection
      if (e.key === 'Escape') {
        e.preventDefault();
        setSelectedRows(new Set());
        setEditingRow(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedRows, handleDeleteSelected, table]);

  // Pagination info
  const totalItems = filteredSuppliers.length;
  const startItem = pagination.pageIndex * pagination.pageSize + 1;
  const endItem = Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalItems);
  const totalPages = Math.ceil(totalItems / pagination.pageSize);


  if (isLoading) return (
    <div className="flex items-center justify-center py-12">
      <div className="text-gray-500">Loading suppliers...</div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center py-12">
      <div className="text-red-500">Failed to load suppliers.</div>
    </div>
  );

  return (
    <div className="w-full h-full">
      {/* Top bar with search and view options */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full lg:max-w-md">
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchValue && (
              <button
                onClick={() => setSearchValue('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          {/* View Options Panel */}
          <div className="flex-shrink-0">
            <ViewOptionsPanel
              columnVisibility={tableToViewOptionsVisibility()}
              onColumnVisibilityChange={handleViewOptionsColumnChange}
              includeInactive={showInactive}
              onIncludeInactiveChange={onToggleInactiveAction}
              densityMode={densityMode}
              onDensityModeChange={() => {}} // No-op since density is fixed
            />
          </div>
        </div>
      </div>



      {/* Table */}
      <div className="w-full bg-white">
        <table className="w-full divide-y divide-gray-200" style={{ tableLayout: 'fixed', minWidth: 'max-content' }}>
          <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  style={{ width: header.getSize() }}
                  className={densityClasses.header}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row, index) => (
            <tr 
              key={row.id} 
              className={`
                ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}
                hover:bg-gray-100/60 
                ${selectedRows.has(row.original.supplierid) ? 'bg-blue-50' : ''} 
                ${editingRow === row.original.supplierid ? 'bg-yellow-50' : ''}
                transition-colors duration-150
              `}
            >
              {row.getVisibleCells().map(cell => (
                <td 
                  key={cell.id} 
                  style={{ width: cell.column.getSize() }}
                  className={`${densityClasses.cell} align-middle`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            {searchValue ? 'No suppliers found matching your search' : 'No suppliers found'}
          </div>
          {searchValue && (
            <button
              onClick={() => setSearchValue('')}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear search
            </button>
          )}
        </div>
      )}
      </div>

      {/* Bottom pagination */}
      <div className="px-6 py-4 border-t border-gray-200 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              Showing {startItem} to {endItem} of {totalItems} suppliers
            </span>
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={pagination.pageSize}
                onChange={(e) => setPagination(prev => ({ ...prev, pageSize: Number(e.target.value), pageIndex: 0 }))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Page {pagination.pageIndex + 1} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Bar - Bottom Right with Fixed Positioning */}
      {selectedRows.size > 0 && (
        <div 
          className="floating-action-bar fixed bottom-6 right-6 z-[9999]"
          style={{ 
            position: 'fixed',
            zIndex: 9999,
            pointerEvents: 'auto',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            willChange: 'transform',
            contain: 'none',
            isolation: 'isolate'
          }}
        >
          <div className="bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-xl w-fit">
            <div className="flex items-center gap-2 px-3 py-2.5">
              {/* Selection count */}
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium whitespace-nowrap">
                <span>{selectedRows.size}</span>
                <span className="text-gray-300">selected</span>
                <span className="text-xs text-gray-400 ml-1">• Del to delete • Esc to clear</span>
              </div>
              
              {/* Export button */}
              <button 
                onClick={handleExportSelected}
                className="group flex items-center justify-center w-11 h-11 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 touch-manipulation"
                title="Export selected"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <Download className="h-4 w-4 text-gray-700 transition-transform duration-150 group-hover:scale-110" />
              </button>
              
              {/* Unarchive button (blue) */}
              <button 
                onClick={handleUnarchiveSelected}
                className="group flex items-center justify-center w-11 h-11 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 touch-manipulation"
                title="Unarchive selected"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <RotateCcw className="h-4 w-4 text-white transition-transform duration-150 group-hover:scale-110" />
              </button>
              
              {/* Archive button */}
              <button 
                onClick={handleArchiveSelected}
                className="group flex items-center justify-center w-11 h-11 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 touch-manipulation"
                title="Archive selected"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <Archive className="h-4 w-4 text-gray-700 transition-transform duration-150 group-hover:scale-110" />
              </button>
              
              {/* Delete button */}
              <button 
                onClick={handleDeleteSelected}
                className="group flex items-center justify-center w-11 h-11 bg-red-500 hover:bg-red-600 rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 touch-manipulation"
                title="Delete selected"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <Trash2 className="h-4 w-4 text-white transition-transform duration-150 group-hover:scale-110" />
              </button>
              
              {/* Close button */}
              <button 
                onClick={() => setSelectedRows(new Set())}
                className="group flex items-center justify-center w-11 h-11 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 touch-manipulation"
                title="Clear selection"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <X className="h-4 w-4 text-gray-700 transition-transform duration-150 group-hover:scale-110" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
