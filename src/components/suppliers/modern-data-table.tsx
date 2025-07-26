'use client';

import { TableHeader } from '@/components/ui/table';

import React from 'react';

import { TableCell } from '@/components/ui/table';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type RowSelectionState,
} from '@tanstack/react-table';
import {
  Search,
  X,
  ChevronUp,
  ChevronDown,
  Loader2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableHead, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';

import type { Supplier, DisplaySupplier } from '@/types/data-table';
import { useSuppliers, useCreateSupplier, useUpdateSupplier, useDeleteSupplier, useBulkDeleteSuppliers, useBulkArchiveSuppliers, useBulkUnarchiveSuppliers } from '@/hooks/use-suppliers';
import { usePagination } from '@/hooks/use-pagination';
import { useShiftSelection } from '@/hooks/use-selection';
import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation';
import { useMobileDetection } from '@/hooks/use-mobile-detection';
import { useDebouncedSearch } from '@/hooks/use-debounce';
import { AddSupplierRow } from './add-supplier-row';
import { EditableSupplierRow } from './editable-supplier-row';
import { ExpandableRowDetails } from './expandable-row-details';
import { PaginationControls } from './pagination-controls';
import { StatusFilters } from './status-filters';
import { ConfirmationDialog } from './confirmation-dialog';
import { StatusBadge } from './status-badge';
import { useSpreadsheetMode } from '@/hooks/use-spreadsheet-mode';
import { useSpreadsheetNavigation } from '@/hooks/use-spreadsheet-navigation';
import { FloatingControls } from './floating-controls';
import { PurchaseHistoryModal } from './purchase-history-modal';

const columnHelper = createColumnHelper<DisplaySupplier>();

export const ModernDataTable = () => {
  const { isMobile } = useMobileDetection();
  
  // SSR-safe client detection
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side after hydration
    setIsClient(true);
  }, []);

  const { searchValue, debouncedSearchValue, updateSearch, clearSearch } =
    useDebouncedSearch('', 100);
  // Use real Supabase data
  const { data: rawSuppliers, isLoading: loading, error, refetch } = useSuppliers();
  const createSupplierMutation = useCreateSupplier();
  const updateSupplierMutation = useUpdateSupplier();
  const deleteSupplierMutation = useDeleteSupplier();
  const bulkDeleteMutation = useBulkDeleteSuppliers();
  const bulkArchiveMutation = useBulkArchiveSuppliers();
  const bulkUnarchiveMutation = useBulkUnarchiveSuppliers();

  // Transform database suppliers to display format
  const allData = useMemo((): DisplaySupplier[] => {
    if (!rawSuppliers) return [];
    return rawSuppliers.map(supplier => ({
      ...supplier,
      id: supplier.supplierid,
      phone: supplier.contactphone || '',
      status: supplier.isarchived ? 'archived' : 'active',
      createdAt: new Date(supplier.created_at),
    }));
  }, [rawSuppliers]);

  // Local state for table functionality
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [editingRow, setEditingRow] = useState<any>(null);
  const [savingRows, setSavingRows] = useState<Set<string>>(new Set());
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [duplicateWarning, setDuplicateWarning] = useState<any>(null);

  // Calculate status counts
  const statusCounts = useMemo(() => {
    const counts = { total: 0, all: 0, active: 0, archived: 0 };
    allData.forEach(supplier => {
      counts.total++;
      counts.all++;
      if (supplier.status === 'active') {
        counts.active++;
      } else if (supplier.status === 'archived') {
        counts.archived++;
      }
    });
    return counts;
  }, [allData]);

  // Filter data based on status and search
  const data = useMemo(() => {
    let filtered = allData;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(supplier => supplier.status === statusFilter);
    }
    
    if (globalFilter) {
      const searchLower = globalFilter.toLowerCase();
      filtered = filtered.filter(supplier => 
        supplier.name.toLowerCase().includes(searchLower) ||
        supplier.email?.toLowerCase().includes(searchLower) ||
        supplier.phone?.toLowerCase().includes(searchLower) ||
        supplier.website?.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [allData, statusFilter, globalFilter]);

  // Helper functions
  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  const updateSupplier = async (id: string, data: Partial<Supplier>) => {
     setSavingRows(prev => new Set(prev).add(id));
     try {
       await updateSupplierMutation.mutateAsync({ supplierId: id, updates: data });
     } finally {
       setSavingRows(prev => {
         const newSet = new Set(prev);
         newSet.delete(id);
         return newSet;
       });
     }
   };

  const updateMultipleSuppliers = async (updates: { id: string; data: Partial<Supplier> }[]) => {
    for (const update of updates) {
      await updateSupplier(update.id, update.data);
    }
  };

  const addSupplier = async (data: any) => {
     await createSupplierMutation.mutateAsync(data);
   };

  const deleteSuppliers = async (ids: string[]) => {
    await bulkDeleteMutation.mutateAsync(ids);
  };

  const archiveSuppliers = async (ids: string[]) => {
     await bulkArchiveMutation.mutateAsync(ids);
   };

   const unarchiveSuppliers = async (ids: string[]) => {
     await bulkUnarchiveMutation.mutateAsync(ids);
   };

  const exportSuppliers = async (ids: string[], format: string) => {
    // TODO: Implement export functionality
    console.log('Export suppliers:', ids, format);
  };

  const getPurchaseHistory = (supplierId: string) => {
    // TODO: Implement purchase history
    return [];
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean;
    ids: string[];
    count: number;
  } | null>(null);
  const [purchaseHistoryModal, setPurchaseHistoryModal] = useState<{
    show: boolean;
    supplier: DisplaySupplier | null;
  }>({ show: false, supplier: null });

  const addSupplierRowRef = useRef<{ startAdding: () => void }>(null);
  const { handleRowSelection, resetSelection } = useShiftSelection();

  const {
    pagination,
    setPagination,
    pageCount,
    canPreviousPage,
    canNextPage,
    goToPage,
    nextPage,
    previousPage,
    setPageSize,
  } = usePagination(data.length);

  // TEMPORARILY DISABLED TO DEBUG INFINITE LOOP
  const {
    isSpreadsheetMode,
    hasUnsavedChanges,
    enterSpreadsheetMode,
    exitSpreadsheetMode,
    updateRowData,
    undoRowChanges,
    getRowData,
    hasRowChanges,
    getChangedRowsCount,
    getAllChanges,
  } = useSpreadsheetMode();

  // SSR-safe responsive column widths
  const columnWidths = useMemo(() => {
    // Use conservative defaults for SSR, then responsive widths for client
    if (!isClient) {
      // SSR defaults - conservative fixed widths
      return {
        actions: 140,
        name: 200,
        website: 220,
        phone: 140,
        status: 80,
      };
    }

    // Client-side responsive calculation based on viewport
    if (isMobile) {
      // Mobile: compact layout with fixed proportions
      return {
        actions: 90,
        name: 180,
        website: 200, 
        phone: 140,
        status: 90,
      };
    } else {
      // Desktop: wider layout
      return {
        actions: 140,
        name: 250,
        website: 280,
        phone: 160,
        status: 100,
      };
    }
  }, [isMobile, isClient]);

  const [isSavingSpreadsheet, setIsSavingSpreadsheet] = useState(false);

  // Helper function to convert DisplaySupplier back to Supplier type
  const displayToSupplier = (display: DisplaySupplier): Supplier => {
    const supplier: Supplier = {
      supplierid: display.id,
      name: display.name,
      isarchived: display.status === 'archived',
      created_at: display.createdAt,
    };
    
    // Only add optional fields if they exist
    if (display.website) supplier.website = display.website;
    if (display.email) supplier.email = display.email;
    if (display.phone) supplier.contactphone = display.phone;
    if (display.address) supplier.address = display.address;
    if (display.notes) supplier.notes = display.notes;
    
    return supplier;
  };

  // Collapse all rows when entering spreadsheet mode
  useEffect(() => {
    if (isSpreadsheetMode) {
      const allRowIds = data.map(row => row.id);
      allRowIds.forEach(id => {
        if (expandedRows.has(id)) {
          toggleRowExpansion(id);
        }
      });
    }
  }, [isSpreadsheetMode]);

  // Clear selection when filter or search changes
  useEffect(() => {
    setRowSelection({});
    resetSelection();
  }, [statusFilter, debouncedSearchValue, resetSelection]);

  const columns = useMemo(
    () => [
      // Single actions column containing all buttons
      columnHelper.display({
        id: 'actions',
        header: ({ table }) =>
          !isSpreadsheetMode ? (
            <div className="flex items-center justify-center h-8 w-full">
              <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={value => {
                  table.toggleAllPageRowsSelected(!!value);
                  resetSelection();
                }}
                aria-label="Select all"
                className="h-4 w-4"
              />
            </div>
          ) : null,
        cell: () => null, // Handled in EditableSupplierRow
        enableSorting: false,
        enableHiding: false,
        size: columnWidths.actions,
      }),
      columnHelper.accessor('name', {
        header: 'Supplier Name',
        cell: () => null,
        size: columnWidths.name,
      }),
      columnHelper.accessor('website', {
        header: 'Website',
        cell: ({ getValue }) => {
          const website = getValue();
          return website ? (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-600 hover:underline flex items-center gap-1 text-sm transition-colors"
            >
              {website.replace(/^https?:\/\//, '')}
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <span className="text-gray-400 italic text-sm">No website</span>
          );
        },
        size: columnWidths.website,
      }),
      columnHelper.accessor('phone', {
        header: 'Phone',
        cell: () => null,
        size: columnWidths.phone,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ getValue }) => <StatusBadge status={getValue()} />,
        size: columnWidths.status,
      }),
    ],
    [resetSelection, isSpreadsheetMode]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      globalFilter,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    pageCount,
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedIds = selectedRows.map(row => row.original.id);
  const hasArchivedSelected = selectedRows.some(
    row => row.original.status === 'archived'
  );

  // Sync debounced search value with global filter
  useEffect(() => {
    setGlobalFilter(debouncedSearchValue);
  }, [debouncedSearchValue, setGlobalFilter]);

  const handleSaveSpreadsheetChanges = async () => {
    setIsSavingSpreadsheet(true);
    try {
      const changes = getAllChanges();
      const updates = changes.map(({ rowId, changes: rowChanges }) => ({
        id: rowId,
        data: rowChanges,
      }));

      // Use optimized bulk update
      await updateMultipleSuppliers(updates);
      exitSpreadsheetMode();
    } catch (error) {
      console.error('Failed to save changes:', error);
    } finally {
      setIsSavingSpreadsheet(false);
    }
  };

  const handleCollapseAll = () => {
    const allRowIds = data.map(row => row.id);
    allRowIds.forEach(id => {
      if (expandedRows.has(id)) {
        toggleRowExpansion(id);
      }
    });
  };

  // TEMPORARILY DISABLED TO DEBUG INFINITE LOOP
  // const { focusedRowIndex } = useKeyboardNavigation({
  //   totalRows: table.getRowModel().rows.length,
  //   rowSelection,
  //   setRowSelection,
  //   onNewSupplier: () => addSupplierRowRef.current?.startAdding(),
  //   onBulkDelete: () => handleBulkDelete(),
  //   selectedCount: selectedIds.length,
  //   getRowId: index => table.getRowModel().rows[index]?.id || '',
  // });

  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      setDeleteConfirmation({
        show: true,
        ids: selectedIds,
        count: selectedIds.length,
      });
    }
  };

  // Initialize navigation hooks after all handlers are defined
  const { currentCell, setCurrentCell, handleCellClick } = useSpreadsheetNavigation({
    totalRows: table.getRowModel().rows.length,
    isSpreadsheetMode,
    onExitSpreadsheetMode: exitSpreadsheetMode,
    expandedRows,
    getRowId: useCallback((index: number) => table.getRowModel().rows[index]?.original.id || '', [table]),
  });

  const { focusedRowIndex, setFocusedRowIndex } = useKeyboardNavigation({
    totalRows: table.getRowModel().rows.length,
    rowSelection,
    setRowSelection,
    onNewSupplier: () => {},
    onBulkDelete: handleBulkDelete,
    selectedCount: selectedIds.length,
    getRowId: useCallback((index: number) => table.getRowModel().rows[index]?.original.id || '', [table]),
  });

  const confirmDelete = async () => {
    if (deleteConfirmation) {
      await deleteSuppliers(deleteConfirmation.ids);
      setRowSelection({});
      setDeleteConfirmation(null);
      resetSelection();
    }
  };

  const handleBulkArchive = async () => {
    if (selectedIds.length > 0) {
      await archiveSuppliers(selectedIds);
      setRowSelection({});
      resetSelection();
    }
  };

  const handleBulkUnarchive = async () => {
    if (selectedIds.length > 0) {
      await unarchiveSuppliers(selectedIds);
      setRowSelection({});
      resetSelection();
    }
  };

  const handleBulkExport = async () => {
    if (selectedIds.length > 0) {
      await exportSuppliers(selectedIds, 'csv');
    }
  };

  const handleEditRow = (rowId: string, data: Partial<Supplier>) => {
    if (!expandedRows.has(rowId)) {
      toggleRowExpansion(rowId);
    }
    setEditingRow({ rowId, data });
  };

  const handleSaveRow = async (data: Partial<DisplaySupplier>) => {
    if (editingRow) {
      try {
        // Transform DisplaySupplier data to Supplier format for database
        const supplierData: Partial<Supplier> = {};
        
        if (data.name !== undefined) supplierData.name = data.name;
        if (data.website !== undefined) supplierData.website = data.website;
        if (data.email !== undefined) supplierData.email = data.email;
        if (data.phone !== undefined) supplierData.contactphone = data.phone; // Transform phone to contactphone
        if (data.address !== undefined) supplierData.address = data.address;
        if (data.notes !== undefined) supplierData.notes = data.notes;
        if (data.status !== undefined) supplierData.isarchived = data.status === 'archived';
        
        await updateSupplier(editingRow.rowId, supplierData);
        
        // Clear editing state after successful save
        setEditingRow(null);
      } catch (error) {
        console.error('Failed to save supplier:', error);
        // Keep editing mode active on error so user can retry
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
  };

  const handleRowSelect = (
    rowIndex: number,
    isSelected: boolean,
    event?: React.MouseEvent
  ) => {
    handleRowSelection(
      rowIndex,
      isSelected,
      event,
      (startIndex, endIndex, selected) => {
        const newSelection = { ...rowSelection };
        for (let i = startIndex; i <= endIndex; i++) {
          const row = table.getRowModel().rows[i];
          if (row) {
            newSelection[row.id] = selected;
          }
        }
        setRowSelection(newSelection);
      },
      (index, selected) => {
        const row = table.getRowModel().rows[index];
        if (row) {
          setRowSelection(prev => ({ ...prev, [row.id]: selected }));
        }
      }
    );
  };

  const handleShowPurchaseHistory = (supplier: DisplaySupplier) => {
    setPurchaseHistoryModal({ show: true, supplier });
  };

  if (error) {
    return (
      <div className="w-full">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-xs">{error?.message || String(error)}</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              <span className="text-xs">Retry</span>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div
        data-table-container
        className="responsive-table w-full full-width-table bg-white"
      >
        {/* Search and Filters - Notion-inspired layout */}
        <div className="px-6 py-5 border-b border-gray-100/80 bg-gray-50/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search suppliers..."
                value={searchValue}
                onChange={e => updateSearch(e.target.value)}
                className="pl-10 pr-10 h-9 text-sm border-gray-200/60 bg-white/80 backdrop-blur-sm"
              />
              {searchValue && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 p-0 hover:bg-gray-100 rounded-full transition-all duration-150 hover:scale-110 active:scale-95"
                  onClick={clearSearch}
                >
                  <X className="h-3 w-3 transition-all duration-200 group-hover:scale-110 group-active:scale-95" />
                </Button>
              )}
            </div>

            {/* Status Filters */}
            <div className="flex-shrink-0">
              <StatusFilters
                activeFilter={statusFilter}
                onFilterChange={setStatusFilter}
                counts={statusCounts}
              />
            </div>
          </div>
        </div>

        {/* Table - Full width responsive */}
        <div className="w-full overflow-x-auto">
          <Table
            className="border-0 w-full min-w-full"
            style={{ 
              tableLayout: isClient ? 'auto' : 'fixed', 
              width: '100%' 
            }}
          >
            <colgroup>
              <col style={{ width: `${columnWidths.actions}px`, minWidth: `${columnWidths.actions}px` }} />
              <col style={{ width: `${columnWidths.name}px`, minWidth: '150px' }} />
              <col style={{ width: `${columnWidths.website}px`, minWidth: '180px' }} />
              <col style={{ width: `${columnWidths.phone}px`, minWidth: '120px' }} />
              <col style={{ width: `${columnWidths.status}px`, minWidth: '80px' }} />
            </colgroup>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-gray-100/80 h-10 bg-gray-50/20"
                >
                  {headerGroup.headers.map((header, index) => {
                    const isActionsColumn = header.id === 'actions';

                    return (
                      <TableHead
                        key={header.id}
                        className="relative border-0 text-sm font-semibold text-gray-600 p-0 h-10"
                        style={{ width: header.getSize() }}
                      >
                        <div
                          className={`flex items-center gap-2 pr-4 py-2 px-2 h-8 transition-colors ${
                            header.column.getCanSort()
                              ? 'cursor-pointer select-none hover:bg-gray-50'
                              : header.id !== 'actions'
                                ? 'hover:bg-gray-50'
                                : ''
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {header.column.getCanSort() && (
                            <div className="flex flex-col">
                              <ChevronUp
                                className={`h-2 w-2 ${
                                  header.column.getIsSorted() === 'asc'
                                    ? 'text-blue-600'
                                    : 'text-gray-400'
                                }`}
                              />
                              <ChevronDown
                                className={`h-2 w-2 -mt-0.5 ${
                                  header.column.getIsSorted() === 'desc'
                                    ? 'text-blue-600'
                                    : 'text-gray-400'
                                }`}
                              />
                            </div>
                          )}
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              <AddSupplierRow
                ref={addSupplierRowRef}
                onAdd={addSupplier}
                loading={loading}
                validationErrors={validationErrors}
                onValidationChange={setValidationErrors}
                isSpreadsheetMode={isSpreadsheetMode}
                columnWidths={columnWidths}
              />

              {loading && !table.getRowModel().rows?.length ? (
                <TableRow className="h-12">
                  <TableCell
                    colSpan={columns.length}
                    className="h-12 text-center border-0"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span className="text-xs">Loading suppliers...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <React.Fragment key={row.id}>
                    <EditableSupplierRow
                      supplier={getRowData(row.original.id, row.original)}
                      isSelected={row.getIsSelected()}
                      isFocused={focusedRowIndex === index}
                      onSelect={(selected, event) =>
                        handleRowSelect(index, row.getIsSelected(), event)
                      }
                      editingRow={editingRow}
                      isSaving={savingRows.has(row.original.id)}
                      onEdit={handleEditRow}
                      onSave={handleSaveRow}
                      onCancel={handleCancelEdit}
                      onToggleExpand={() => toggleRowExpansion(row.original.id)}
                      isExpanded={expandedRows.has(row.original.id)}
                      isSpreadsheetMode={isSpreadsheetMode}
                      hasRowChanges={hasRowChanges(row.original.id)}
                      onSpreadsheetChange={updateRowData}
                      onUndoRowChanges={() => undoRowChanges(row.original.id)}
                      onShowPurchaseHistory={() =>
                        handleShowPurchaseHistory(row.original)
                      }
                      onCellClick={handleCellClick}
                      rowIndex={index}
                      columnWidths={columnWidths}
                    />
                    {expandedRows.has(row.original.id) &&
                      !isSpreadsheetMode && (
                        <ExpandableRowDetails
                          supplier={displayToSupplier(getRowData(row.original.id, row.original))}
                          isExpanded={true}
                          onToggle={() => toggleRowExpansion(row.original.id)}
                          onUpdate={updateSupplier}
                          isEditing={editingRow?.rowId === row.original.id}
                          columnWidths={columnWidths}
                        />
                      )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow className="h-12">
                  <TableCell
                    colSpan={columns.length}
                    className="h-12 text-center border-0"
                  >
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <AlertCircle className="h-6 w-6" />
                      <p className="text-xs">No suppliers found</p>
                      {(searchValue || statusFilter !== 'all') && (
                        <div className="flex gap-2">
                          {searchValue && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={clearSearch}
                            >
                              <span className="text-xs">Clear search</span>
                            </Button>
                          )}
                          {statusFilter !== 'all' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setStatusFilter('all')}
                            >
                              <span className="text-xs">Show all statuses</span>
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div>
          <div className="mx-4">
            <PaginationControls
              pageIndex={pagination.pageIndex}
              pageSize={pagination.pageSize}
              pageCount={pageCount}
              totalItems={data.length}
              canPreviousPage={canPreviousPage}
              canNextPage={canNextPage}
              goToPage={goToPage}
              nextPage={nextPage}
              previousPage={previousPage}
              setPageSize={setPageSize}
            />
          </div>
        </div>
      </div>

      {/* Floating Controls */}
      <FloatingControls
        isSpreadsheetMode={isSpreadsheetMode}
        hasUnsavedChanges={hasUnsavedChanges}
        changedRowsCount={getChangedRowsCount()}
        selectedCount={selectedIds.length}
        hasInactiveSelected={hasArchivedSelected}
        onEnterSpreadsheetMode={enterSpreadsheetMode}
        onSaveChanges={handleSaveSpreadsheetChanges}
        onCancelChanges={exitSpreadsheetMode}
        onCollapseAll={handleCollapseAll}
        onBulkExport={handleBulkExport}
        onBulkArchive={handleBulkArchive}
        onBulkUnarchive={handleBulkUnarchive}
        onBulkDelete={handleBulkDelete}
        onClearSelection={() => setRowSelection({})}
        isSaving={isSavingSpreadsheet}
        loading={loading}
      />

      {/* Purchase History Modal */}
      <PurchaseHistoryModal
        isOpen={purchaseHistoryModal.show}
        onClose={() => setPurchaseHistoryModal({ show: false, supplier: null })}
        supplier={purchaseHistoryModal.supplier ? displayToSupplier(purchaseHistoryModal.supplier) : null}
        purchaseHistory={
          purchaseHistoryModal.supplier
            ? getPurchaseHistory(purchaseHistoryModal.supplier.id)
            : []
        }
      />

      <ConfirmationDialog
        open={deleteConfirmation?.show || false}
        onOpenChange={open => !open && setDeleteConfirmation(null)}
        title="Delete Suppliers"
        description={`Are you sure you want to delete ${deleteConfirmation?.count} supplier${deleteConfirmation?.count === 1 ? '' : 's'}? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        variant="destructive"
      />

      <ConfirmationDialog
        open={duplicateWarning?.show || false}
        onOpenChange={open => !open && setDuplicateWarning(null)}
        title="Similar Supplier Detected"
        description={`A supplier with similar ${duplicateWarning?.matches.map((m: any) => m.type).join(' and ')} already exists. Do you want to add this supplier anyway?`}
        confirmText="Add Anyway"
        onConfirm={() => duplicateWarning?.onProceed()}
      />

      <style jsx>{`
        .responsive-table {
          /* Fixed row height for consistent alignment - accommodates 2 lines */
          --row-height: 56px;
        }

        @media (max-width: 768px) {
          .responsive-table {
            --row-height: 60px;
          }
        }

        .responsive-table :global(tr) {
          height: var(--row-height);
          min-height: var(--row-height);
        }

        .responsive-table :global(td) {
          height: var(--row-height);
          padding: 0;
          border: 0;
          vertical-align: middle;
          overflow: visible;
        }

        .responsive-table :global(th) {
          height: 32px;
          padding: 0;
          border: 0;
          vertical-align: middle;
        }

        /* Multi-line text support - limit to 2 lines for better readability */
        .responsive-table :global(.cell-content) {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.4;
          max-height: 2.8em;
          word-break: break-word;
          text-overflow: ellipsis;
        }

        /* Allow input focus outlines to be visible */
        .responsive-table :global(input),
        .responsive-table :global(textarea) {
          overflow: visible;
        }

        /* Ensure table layout is truly fixed */
        .responsive-table :global(table) {
          table-layout: fixed !important;
          width: 100% !important;
        }

        .responsive-table :global(colgroup) {
          display: table-column-group !important;
        }

        .responsive-table :global(col) {
          display: table-column !important;
        }
      `}</style>
    </>
  );
};
