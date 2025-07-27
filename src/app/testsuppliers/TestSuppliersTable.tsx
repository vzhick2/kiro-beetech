// TESTSUPPLIERS Table Component (Client Component) - Notion-inspired design
'use client';
import { useMemo, useState, useCallback } from 'react';
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
import { 
  Settings, 
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


interface TestSuppliersTableProps {
  showInactive: boolean;
  onToggleInactive: (show: boolean) => void;
}

// Column visibility configuration
interface ColumnVisibility {
  name: boolean;
  website: boolean;
  contactphone: boolean;
  contactemail: boolean;
  address: boolean;
  notes: boolean;
  isarchived: boolean;
  created_at: boolean;
}

export function TestSuppliersTable({ showInactive, onToggleInactive }: TestSuppliersTableProps) {
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
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    website: true,
    contactphone: true,
    contactemail: false,
    address: false,
    notes: true,
    isarchived: true,
    created_at: false,
  });
  const [showViewOptions, setShowViewOptions] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [editingRow, setEditingRow] = useState<string | null>(null);

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
    console.log('Unarchiving suppliers:', selectedIds);
    // TODO: Implement unarchive API call
    // await updateSuppliers(selectedIds, { isarchived: false });
    setSelectedRows(new Set());
    refetch();
  }, [selectedRows, refetch]);

  const handleArchiveSelected = useCallback(async () => {
    const selectedIds = Array.from(selectedRows);
    console.log('Archiving suppliers:', selectedIds);
    // TODO: Implement archive API call
    // await updateSuppliers(selectedIds, { isarchived: true });
    setSelectedRows(new Set());
    refetch();
  }, [selectedRows, refetch]);

  const handleDeleteSelected = useCallback(async () => {
    const selectedIds = Array.from(selectedRows);
    if (confirm(`Are you sure you want to delete ${selectedIds.length} supplier${selectedIds.length !== 1 ? 's' : ''}? This action cannot be undone.`)) {
      console.log('Deleting suppliers:', selectedIds);
      // TODO: Implement delete API call
      // await deleteSuppliers(selectedIds);
      setSelectedRows(new Set());
      refetch();
    }
  }, [selectedRows, refetch]);

  const handleExportSelected = useCallback(() => {
    const selectedIds = Array.from(selectedRows);
    const selectedSuppliers = suppliers.filter(s => selectedIds.includes(s.supplierid));
    console.log('Exporting suppliers:', selectedSuppliers);
    // TODO: Implement CSV export
    // exportToCsv(selectedSuppliers, 'selected-suppliers.csv');
  }, [selectedRows, suppliers]);

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
          <div className="flex items-center justify-center py-3 px-3">
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
          <div className="flex items-center justify-center py-3 px-3">
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
          <div className="flex items-center cursor-pointer select-none hover:bg-gray-100 -mx-3 px-3 py-1 rounded" onClick={() => handleSort('name')}>
            <span className="font-medium text-gray-900">Supplier Name</span>
            {renderSortIcon('name')}
          </div>
        ),
        cell: info => (
          <div className="py-3 px-3">
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
          <div className="flex items-center cursor-pointer select-none hover:bg-gray-100 -mx-3 px-3 py-1 rounded" onClick={() => handleSort('website')}>
            <span className="font-medium text-gray-900">Website</span>
            {renderSortIcon('website')}
          </div>
        ),
        cell: info => (
          <div className="py-3 px-3">
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
          <div className="flex items-center cursor-pointer select-none hover:bg-gray-100 -mx-3 px-3 py-1 rounded" onClick={() => handleSort('contactphone')}>
            <span className="font-medium text-gray-900">Phone</span>
            {renderSortIcon('contactphone')}
          </div>
        ),
        cell: info => (
          <div className="py-3 px-3">
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
      columnHelper.accessor('contactemail' as any, {
        header: () => (
          <div className="flex items-center cursor-pointer select-none hover:bg-gray-100 -mx-3 px-3 py-1 rounded" onClick={() => handleSort('contactemail')}>
            <span className="font-medium text-gray-900">Email</span>
            {renderSortIcon('contactemail')}
          </div>
        ),
        cell: info => (
          <div className="py-3 px-3">
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
          <div className="flex items-center cursor-pointer select-none hover:bg-gray-100 -mx-3 px-3 py-1 rounded" onClick={() => handleSort('address')}>
            <span className="font-medium text-gray-900">Address</span>
            {renderSortIcon('address')}
          </div>
        ),
        cell: info => (
          <div className="py-3 px-3">
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
          <div className="flex items-center cursor-pointer select-none hover:bg-gray-100 -mx-3 px-3 py-1 rounded" onClick={() => handleSort('notes')}>
            <span className="font-medium text-gray-900">Notes</span>
            {renderSortIcon('notes')}
          </div>
        ),
        cell: info => (
          <div className="py-3 px-3">
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
          <div className="flex items-center cursor-pointer select-none hover:bg-gray-100 -mx-3 px-3 py-1 rounded" onClick={() => handleSort('isarchived')}>
            <span className="font-medium text-gray-900">Status</span>
            {renderSortIcon('isarchived')}
          </div>
        ),
        cell: info => (
          <div className="py-3 px-3">
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
          <div className="flex items-center cursor-pointer select-none hover:bg-gray-100 -mx-3 px-3 py-1 rounded" onClick={() => handleSort('created_at')}>
            <span className="font-medium text-gray-900">Created Date</span>
            {renderSortIcon('created_at')}
          </div>
        ),
        cell: info => (
          <div className="py-3 px-3">
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
    data: suppliers,
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

  // Pagination info
  const totalItems = suppliers.length;
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
    <div className="space-y-4">
      {/* Top bar with pagination info and view options */}
      <div className="flex items-center justify-between">
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
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Page {pagination.pageIndex + 1} of {totalPages}</span>
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
          
          <div className="relative">
            <button
              onClick={() => setShowViewOptions(!showViewOptions)}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Settings className="h-4 w-4" />
              View Options
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {showViewOptions && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Columns</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={columnVisibility.name}
                          onChange={() => toggleColumnVisibility('name')}
                          className="rounded border-gray-300"
                          disabled
                        />
                        <span className="text-gray-600">Supplier Name (required)</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={columnVisibility.website}
                          onChange={() => toggleColumnVisibility('website')}
                          className="rounded border-gray-300"
                        />
                        <span className="text-gray-900">Website</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={columnVisibility.contactphone}
                          onChange={() => toggleColumnVisibility('contactphone')}
                          className="rounded border-gray-300"
                        />
                        <span className="text-gray-900">Phone</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={columnVisibility.contactemail}
                          onChange={() => toggleColumnVisibility('contactemail')}
                          className="rounded border-gray-300"
                        />
                        <span className="text-gray-900">Email</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={columnVisibility.address}
                          onChange={() => toggleColumnVisibility('address')}
                          className="rounded border-gray-300"
                        />
                        <span className="text-gray-900">Address</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={columnVisibility.notes}
                          onChange={() => toggleColumnVisibility('notes')}
                          className="rounded border-gray-300"
                        />
                        <span className="text-gray-900">Notes</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={columnVisibility.isarchived}
                          onChange={() => toggleColumnVisibility('isarchived')}
                          className="rounded border-gray-300"
                        />
                        <span className="text-gray-900">Status</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={columnVisibility.created_at}
                          onChange={() => toggleColumnVisibility('created_at')}
                          className="rounded border-gray-300"
                        />
                        <span className="text-gray-900">Created Date</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Options</h3>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={showInactive}
                        onChange={(e) => onToggleInactive(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-gray-900">Include inactive suppliers</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>



      {/* Table */}
      <div className="bg-white border-t border-b border-gray-200 overflow-hidden">
        <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
          <table className="w-full divide-y divide-gray-200" style={{ minWidth: '100%', width: 'max-content' }}>
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className="px-0 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
                    hover:bg-gray-100/50 
                    ${selectedRows.has(row.original.supplierid) ? 'bg-blue-50' : ''} 
                    ${editingRow === row.original.supplierid ? 'bg-yellow-50' : ''}
                    transition-colors duration-150
                  `}
                >
                  {row.getVisibleCells().map(cell => (
                    <td 
                      key={cell.id} 
                      style={{ width: cell.column.getSize() }}
                      className="text-sm text-gray-900 align-top"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {suppliers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No suppliers found</div>
          </div>
        )}
      </div>

      {/* Floating Action Bar - Bottom Right */}
      {selectedRows.size > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Selection count */}
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-xl text-sm font-medium">
                <span>{selectedRows.size}</span>
                <span className="text-gray-300">items selected</span>
              </div>
              
              {/* Export button */}
              <button 
                onClick={handleExportSelected}
                className="group flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-150 hover:scale-105 active:scale-95"
                title="Export selected"
              >
                <Download className="h-5 w-5 text-gray-700 transition-transform duration-150 group-hover:scale-110" />
              </button>
              
              {/* Unarchive button (blue) */}
              <button 
                onClick={handleUnarchiveSelected}
                className="group flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-xl transition-all duration-150 hover:scale-105 active:scale-95"
                title="Unarchive selected"
              >
                <RotateCcw className="h-5 w-5 text-white transition-transform duration-150 group-hover:scale-110" />
              </button>
              
              {/* Archive button */}
              <button 
                onClick={handleArchiveSelected}
                className="group flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-150 hover:scale-105 active:scale-95"
                title="Archive selected"
              >
                <Archive className="h-5 w-5 text-gray-700 transition-transform duration-150 group-hover:scale-110" />
              </button>
              
              {/* Delete button */}
              <button 
                onClick={handleDeleteSelected}
                className="group flex items-center justify-center w-12 h-12 bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-150 hover:scale-105 active:scale-95"
                title="Delete selected"
              >
                <Trash2 className="h-5 w-5 text-white transition-transform duration-150 group-hover:scale-110" />
              </button>
              
              {/* Close button */}
              <button 
                onClick={() => setSelectedRows(new Set())}
                className="group flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-150 hover:scale-105 active:scale-95 ml-2"
                title="Clear selection"
              >
                <X className="h-5 w-5 text-gray-700 transition-transform duration-150 group-hover:scale-110" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
