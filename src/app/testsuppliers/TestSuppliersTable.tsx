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
import { bulkArchiveSuppliers, bulkUnarchiveSuppliers, bulkDeleteSuppliers, bulkUpdateSuppliers } from '@/app/actions/suppliers';
import { useColumnPreferences } from '@/hooks/use-local-storage';
import { useDebouncedSearch } from '@/hooks/use-debounce';
import { useSpreadsheetMode } from '@/hooks/use-spreadsheet-mode';
import { useSpreadsheetNavigation } from '@/hooks/use-spreadsheet-navigation';
import { useUpdateSupplier } from '@/hooks/use-suppliers';
import { ViewOptionsPanel } from '@/components/suppliers/view-options-panel';
import { SpreadsheetCell } from '@/components/suppliers/spreadsheet-cell';

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
  Trash2,
  Save,
  FileSpreadsheet
} from 'lucide-react';

interface TestSuppliersTableProps {
  showInactive: boolean;
  onToggleInactiveAction: (show: boolean) => void;
}

// Column visibility configuration
interface ColumnVisibility {
  name: boolean;
  website: boolean;
  phone: boolean;
  email: boolean;
  address: boolean;
  notes: boolean;
  status: boolean;
  createdAt: boolean;
}

export function TestSuppliersTable({ showInactive, onToggleInactiveAction }: TestSuppliersTableProps) {
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
    phone: true,
    email: true,
    address: false,
    notes: true,
    status: true,
    createdAt: false,
  });
  
  // Density mode state - fixed to compact (density selector removed)
  const densityMode = 'compact';
  
  // Remove custom view options dropdown state
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [editingRow, setEditingRow] = useState<string | null>(null);
  
  // Spreadsheet mode state
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

  // Single row edit updates  
  const updateSupplierMutation = useUpdateSupplier();
  
  // Debounced search with 350ms delay for better UX
  const { searchValue, debouncedSearchValue, updateSearch, clearSearch } = useDebouncedSearch('', 350);

  // Get density mode classes - fixed to compact
  const getDensityClasses = () => {
    return {
      header: 'px-0 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      cell: 'text-xs text-gray-900 align-middle py-2'
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
  }, [setColumnVisibility]);

  // Map ViewOptionsPanel column keys to actual database field names
  const getColumnVisibility = useCallback((dbField: string): boolean => {
    const columnMap: Record<string, keyof ColumnVisibility> = {
      'name': 'name',
      'website': 'website', 
      'contactphone': 'phone',
      'email': 'email',
      'address': 'address',
      'notes': 'notes',
      'isarchived': 'status',
      'created_at': 'createdAt'
    };
    
    const mappedKey = columnMap[dbField];
    return mappedKey ? columnVisibility[mappedKey] : true;
  }, [columnVisibility]);

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

  // Helper function to save changes for a specific row
  const saveRowChanges = useCallback(async (rowId: string) => {
    if (hasRowChanges(rowId)) {
      try {
        const changes = getAllChanges().find(change => change.rowId === rowId);
        if (changes) {
          await updateSupplierMutation.mutateAsync({
            supplierId: rowId,
            updates: changes.changes,
          });
          // Clear the saved changes for this row since they're now persisted
          undoRowChanges(rowId);
          return true;
        }
      } catch (error) {
        console.error('Failed to save changes for row:', rowId, error);
        alert('Failed to save changes. Please try again.');
        return false;
      }
    }
    return true;
  }, [hasRowChanges, getAllChanges, updateSupplierMutation, undoRowChanges]);

  const handleEditRow = useCallback(async (rowId: string) => {
    // If we're currently editing a different row and it has changes, confirm before switching
    if (editingRow && editingRow !== rowId && hasRowChanges(editingRow)) {
      if (!confirm('You have unsaved changes. Are you sure you want to switch to editing another row? Your changes will be lost.')) {
        return;
      }
      // Clear the unsaved changes
      undoRowChanges(editingRow);
    }
    
    // Toggle edit mode for the clicked row
    setEditingRow(editingRow === rowId ? null : rowId);
  }, [editingRow, hasRowChanges, undoRowChanges]);

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
    
    // Filter by search term (using debounced value)
    if (debouncedSearchValue.trim()) {
      const searchLower = debouncedSearchValue.toLowerCase();
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
  }, [suppliers, debouncedSearchValue]);

  // Spreadsheet navigation - initialized after filteredSuppliers
  const { currentCell, handleCellClick } = useSpreadsheetNavigation({
    totalRows: filteredSuppliers.length,
    isSpreadsheetMode,
    onExitSpreadsheetMode: () => {
      if (hasUnsavedChanges) {
        if (confirm('You have unsaved changes. Are you sure you want to exit edit mode?')) {
          exitSpreadsheetMode();
        }
      } else {
        exitSpreadsheetMode();
      }
    },
    expandedRows: new Set(filteredSuppliers.map(s => s.supplierid)),
    getRowId: (index: number) => filteredSuppliers[index]?.supplierid || '',
  });

  // Helper function to convert Supplier to DisplaySupplier
  const toDisplaySupplier = useCallback((supplier: Supplier): import('@/types/data-table').DisplaySupplier => {
    const displaySupplier: import('@/types/data-table').DisplaySupplier = {
      id: supplier.supplierid,
      name: supplier.name,
      status: supplier.isarchived ? 'archived' : 'active',
      createdAt: supplier.created_at ? new Date(supplier.created_at) : new Date(),
    };
    
    if (supplier.website) displaySupplier.website = supplier.website;
    if (supplier.email) displaySupplier.email = supplier.email;
    if (supplier.contactphone) displaySupplier.phone = supplier.contactphone;
    if (supplier.address) displaySupplier.address = supplier.address;
    if (supplier.notes) displaySupplier.notes = supplier.notes;
    
    return displaySupplier;
  }, []);

  // Track all local changes across all cells
  const [localChanges, setLocalChanges] = useState<Map<string, Partial<import('@/types/data-table').DisplaySupplier>>>(new Map());

  // Handle local changes from cells (for visual feedback only)
  const handleLocalChange = useCallback((field: keyof import('@/types/data-table').DisplaySupplier, value: any, rowId: string) => {
    setLocalChanges(prev => {
      const newMap = new Map(prev);
      const existingData = newMap.get(rowId) || {};
      newMap.set(rowId, { ...existingData, [field]: value });
      return newMap;
    });
  }, []);

  // Get current value (either local change or original)
  const getCurrentValue = useCallback((supplier: Supplier, field: keyof import('@/types/data-table').DisplaySupplier) => {
    const localChange = localChanges.get(supplier.supplierid);
    if (localChange && field in localChange) {
      return localChange[field];
    }
    return toDisplaySupplier(supplier)[field];
  }, [localChanges, toDisplaySupplier]);

  // Helper function to get field value for a supplier in either mode
  const getFieldValue = useCallback((supplier: Supplier, field: keyof import('@/types/data-table').DisplaySupplier) => {
    if (isSpreadsheetMode) {
      return getCurrentValue(supplier, field);
    }
    return toDisplaySupplier(supplier)[field];
  }, [isSpreadsheetMode, getCurrentValue, toDisplaySupplier]);

  // Save spreadsheet changes
  const handleSaveSpreadsheetChanges = useCallback(async () => {
    if (localChanges.size === 0) {
      alert('No changes to save');
      return;
    }

    try {
      // Convert localChanges to the format expected by bulkUpdateSuppliers
      const updates = Array.from(localChanges.entries()).map(([id, changes]) => {
        // Map DisplaySupplier fields back to database Supplier fields
        const dbChanges: any = {};
        
        if (changes.name !== undefined) dbChanges.name = changes.name;
        if (changes.website !== undefined) dbChanges.website = changes.website;
        if (changes.email !== undefined) dbChanges.email = changes.email;
        if (changes.phone !== undefined) dbChanges.contactphone = changes.phone; // phone → contactphone
        if (changes.address !== undefined) dbChanges.address = changes.address;
        if (changes.notes !== undefined) dbChanges.notes = changes.notes;
        if (changes.status !== undefined) {
          dbChanges.isarchived = changes.status === 'archived'; // status → isarchived
        }

        return {
          supplierId: id, // Note: supplierId not supplierid
          changes: dbChanges
        };
      });

      console.log('Saving supplier updates:', updates);
      
      // Call the bulk update server action
      const result = await bulkUpdateSuppliers(updates);
      
      if (result.success) {
        alert(`Successfully updated ${result.updatedCount} supplier(s)`);
        setLocalChanges(new Map());
        exitSpreadsheetMode();
        refetch(); // Refresh the data
      } else {
        alert(result.error || 'Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes. Please try again.');
    }
  }, [localChanges, exitSpreadsheetMode, refetch]);
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
            <div className="flex items-center justify-center px-1">
              <input
                type="checkbox"
                checked={allCurrentSelected}
                onChange={() => toggleAllRows(currentPageRows)}
                className="rounded border-gray-300 w-4 h-4"
                disabled={isSpreadsheetMode}
              />
            </div>
          );
        },
        cell: ({ row }) => (
          <div className="flex items-center justify-center h-full py-1 px-1">
            <input
              type="checkbox"
              checked={selectedRows.has(row.original.supplierid)}
              onChange={() => toggleRowSelection(row.original.supplierid)}
              className="rounded border-gray-300 w-4 h-4"
              disabled={isSpreadsheetMode}
            />
          </div>
        ),
        size: 36,
        minSize: 36,
        maxSize: 36,
        enableSorting: false,
      }),
      // Edit column
      columnHelper.display({
        id: 'edit',
        header: () => <div className="flex items-center justify-center px-1"></div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-center h-full py-1 px-1">
            <button
              onClick={() => handleEditRow(row.original.supplierid)}
              className={`p-1 rounded hover:bg-gray-100 ${editingRow === row.original.supplierid ? 'bg-blue-100 text-blue-600' : 'text-gray-400'} ${isSpreadsheetMode ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Edit row"
              disabled={isSpreadsheetMode}
            >
              <Edit3 className="h-4 w-4" />
            </button>
          </div>
        ),
        size: 36,
        minSize: 36,
        maxSize: 36,
        enableSorting: false,
      }),
    ];

    const dataColumns = [
      columnHelper.accessor('name', {
        header: () => (
          <div className="flex items-center cursor-pointer select-none hover:bg-gray-100 px-3 py-1 rounded" onClick={() => handleSort('name')}>
            <span className="text-gray-900">Supplier Name</span>
            {renderSortIcon('name')}
          </div>
        ),
        cell: info => {
          const supplier = info.row.original;
          const rowIndex = info.row.index;
          const value = getFieldValue(supplier, 'name');
          const isEditing = isSpreadsheetMode || editingRow === supplier.supplierid;
          
          if (isEditing) {
            return (
              <div 
                className="flex items-center h-full py-1 px-1 w-full"
                onClick={() => handleCellClick(rowIndex, 0)}
              >
                <SpreadsheetCell
                  key={`${supplier.supplierid}-name`}
                  value={value}
                  field="name"
                  rowId={supplier.supplierid}
                  rowIndex={rowIndex}
                  colIndex={0}
                  isSpreadsheetMode={isEditing}
                  hasChanges={hasRowChanges(supplier.supplierid)}
                  onChange={(field, newValue) => updateRowData(supplier.supplierid, field, newValue)}
                  onLocalChange={handleLocalChange}
                />
              </div>
            );
          }
          
          return (
            <div className="flex items-center h-full py-2 px-3">
              <div className="text-gray-700 text-xs leading-tight max-h-[4.5rem] overflow-hidden" style={{ 
                display: '-webkit-box', 
                WebkitLineClamp: 3, 
                WebkitBoxOrient: 'vertical' 
              }}>
                {String(value || '')}
              </div>
            </div>
          );
        },
        size: 200,
        minSize: 150,
        enableSorting: true,
      }),
      columnHelper.accessor('website', {
        header: () => (
          <div className="flex items-center cursor-pointer select-none hover:bg-gray-100 px-3 py-1 rounded" onClick={() => handleSort('website')}>
            <span className="text-gray-900">Website</span>
            {renderSortIcon('website')}
          </div>
        ),
        cell: info => {
          const supplier = info.row.original;
          const rowIndex = info.row.index;
          const value = getFieldValue(supplier, 'website');
          const isEditing = isSpreadsheetMode || editingRow === supplier.supplierid;
          
          if (isEditing) {
            return (
              <div 
                className="flex items-center h-full py-1 px-1 w-full"
                onClick={() => handleCellClick(rowIndex, 1)}
              >
                <SpreadsheetCell
                  value={value}
                  field="website"
                  rowId={supplier.supplierid}
                  rowIndex={rowIndex}
                  colIndex={1}
                  isSpreadsheetMode={isEditing}
                  hasChanges={hasRowChanges(supplier.supplierid)}
                  onChange={(field, newValue) => updateRowData(supplier.supplierid, field, newValue)}
                  onLocalChange={handleLocalChange}
                />
              </div>
            );
          }
          
          return (
            <div className="flex items-center h-full py-2 px-3">
              {value ? (
                <a 
                  href={String(value) || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 text-xs hover:text-blue-800 hover:underline leading-tight max-h-[4.5rem] overflow-hidden block transition-colors duration-150"
                  style={{ 
                    display: '-webkit-box', 
                    WebkitLineClamp: 3, 
                    WebkitBoxOrient: 'vertical' 
                  }}
                >
                  {String(value)}
                </a>
              ) : (
                <span className="text-gray-400 text-xs">-</span>
              )}
            </div>
          );
        },
        size: 180,
        minSize: 120,
        enableSorting: true,
      }),
      columnHelper.accessor('contactphone', {
        header: () => (
          <div className="flex items-center cursor-pointer select-none hover:bg-gray-100 px-3 py-1 rounded" onClick={() => handleSort('contactphone')}>
            <span className="text-gray-900">Phone</span>
            {renderSortIcon('contactphone')}
          </div>
        ),
        cell: info => {
          const supplier = info.row.original;
          const rowIndex = info.row.index;
          const value = getFieldValue(supplier, 'phone'); // Note: maps to 'phone' in DisplaySupplier
          const isEditing = isSpreadsheetMode || editingRow === supplier.supplierid;
          
          if (isEditing) {
            return (
              <div 
                className="flex items-center h-full py-1 px-1 w-full"
                onClick={() => handleCellClick(rowIndex, 2)}
              >
                <SpreadsheetCell
                  value={value}
                  field="phone"
                  rowId={supplier.supplierid}
                  rowIndex={rowIndex}
                  colIndex={2}
                  isSpreadsheetMode={isEditing}
                  hasChanges={hasRowChanges(supplier.supplierid)}
                  onChange={(field, newValue) => updateRowData(supplier.supplierid, field, newValue)}
                  onLocalChange={handleLocalChange}
                />
              </div>
            );
          }
          
          return (
            <div className="flex items-center h-full py-2 px-3">
              <span className="text-gray-700 text-xs leading-tight max-h-[4.5rem] overflow-hidden block" style={{ 
                display: '-webkit-box', 
                WebkitLineClamp: 3, 
                WebkitBoxOrient: 'vertical' 
              }}>
                {String(value || '-')}
              </span>
            </div>
          );
        },
        size: 140,
        minSize: 100,
        enableSorting: true,
      }),
      columnHelper.accessor('email', {
        header: () => (
          <div className="flex items-center cursor-pointer select-none hover:bg-gray-100 px-3 py-1 rounded" onClick={() => handleSort('email')}>
            <span className="text-gray-900">Email</span>
            {renderSortIcon('email')}
          </div>
        ),
        cell: info => {
          const supplier = info.row.original;
          const rowIndex = info.row.index;
          const value = getFieldValue(supplier, 'email');
          const isEditing = isSpreadsheetMode || editingRow === supplier.supplierid;
          
          if (isEditing) {
            return (
              <div 
                className="flex items-center h-full py-1 px-1 w-full"
                onClick={() => handleCellClick(rowIndex, 3)}
              >
                <SpreadsheetCell
                  value={value}
                  field="email"
                  rowId={supplier.supplierid}
                  rowIndex={rowIndex}
                  colIndex={3}
                  isSpreadsheetMode={isEditing}
                  hasChanges={hasRowChanges(supplier.supplierid)}
                  onChange={(field, newValue) => updateRowData(supplier.supplierid, field, newValue)}
                  onLocalChange={handleLocalChange}
                />
              </div>
            );
          }
          
          return (
            <div className="flex items-center h-full py-2 px-3">
              {value ? (
                <a 
                  href={`mailto:${value}`} 
                  className="text-blue-600 text-xs hover:text-blue-800 hover:underline leading-tight max-h-[4.5rem] overflow-hidden block transition-colors duration-150"
                  style={{ 
                    display: '-webkit-box', 
                    WebkitLineClamp: 3, 
                    WebkitBoxOrient: 'vertical' 
                  }}
                >
                  {String(value || '')}
                </a>
              ) : (
                <span className="text-gray-400 text-xs">-</span>
              )}
            </div>
          );
        },
        size: 180,
        minSize: 120,
        enableSorting: true,
      }),
      columnHelper.accessor('address', {
        header: () => (
          <div className="flex items-center cursor-pointer select-none hover:bg-gray-100 px-3 py-1 rounded" onClick={() => handleSort('address')}>
            <span className="text-gray-900">Address</span>
            {renderSortIcon('address')}
          </div>
        ),
        cell: info => {
          const supplier = info.row.original;
          const rowIndex = info.row.index;
          const value = getFieldValue(supplier, 'address');
          const isEditing = isSpreadsheetMode || editingRow === supplier.supplierid;
          
          if (isEditing) {
            return (
              <div 
                className="flex items-center h-full py-1 px-1 w-full"
                onClick={() => handleCellClick(rowIndex, 4)}
              >
                <SpreadsheetCell
                  value={value}
                  field="address"
                  rowId={supplier.supplierid}
                  rowIndex={rowIndex}
                  colIndex={4}
                  isSpreadsheetMode={isEditing}
                  hasChanges={hasRowChanges(supplier.supplierid)}
                  onChange={(field, newValue) => updateRowData(supplier.supplierid, field, newValue)}
                  onLocalChange={handleLocalChange}
                />
              </div>
            );
          }
          
          return (
            <div className="flex items-center h-full py-2 px-3">
              <span className="text-gray-700 text-xs leading-tight max-h-[4.5rem] overflow-hidden block" style={{ 
                display: '-webkit-box', 
                WebkitLineClamp: 3, 
                WebkitBoxOrient: 'vertical' 
              }}>
                {info.getValue() || '-'}
              </span>
            </div>
          );
        },
        size: 200,
        minSize: 150,
        enableSorting: true,
      }),
      columnHelper.accessor('notes', {
        header: () => (
          <div className="flex items-center cursor-pointer select-none hover:bg-gray-100 px-3 py-1 rounded" onClick={() => handleSort('notes')}>
            <span className="text-gray-900">Notes</span>
            {renderSortIcon('notes')}
          </div>
        ),
        cell: info => {
          const supplier = info.row.original;
          const rowIndex = info.row.index;
          const value = getFieldValue(supplier, 'notes');
          const isEditing = isSpreadsheetMode || editingRow === supplier.supplierid;
          
          if (isEditing) {
            return (
              <div 
                className="flex items-center h-full py-1 px-1 w-full"
                onClick={() => handleCellClick(rowIndex, 5)}
              >
                <SpreadsheetCell
                  value={value}
                  field="notes"
                  rowId={supplier.supplierid}
                  rowIndex={rowIndex}
                  colIndex={5}
                  isSpreadsheetMode={isEditing}
                  hasChanges={hasRowChanges(supplier.supplierid)}
                  onChange={(field, newValue) => updateRowData(supplier.supplierid, field, newValue)}
                  onLocalChange={handleLocalChange}
                />
              </div>
            );
          }
          
          return (
            <div className="flex items-center h-full py-2 px-3">
              <span className="text-gray-600 text-xs leading-tight max-h-[4.5rem] overflow-hidden block" style={{ 
                display: '-webkit-box', 
                WebkitLineClamp: 3, 
                WebkitBoxOrient: 'vertical' 
              }}>
                {info.getValue() || ''}
              </span>
            </div>
          );
        },
        size: 250,
        minSize: 150,
        enableSorting: true,
      }),
      columnHelper.accessor('isarchived', {
        header: () => (
          <div className="flex items-center cursor-pointer select-none hover:bg-gray-100 px-3 py-1 rounded" onClick={() => handleSort('isarchived')}>
            <span className="text-gray-900">Status</span>
            {renderSortIcon('isarchived')}
          </div>
        ),
        cell: info => {
          const supplier = info.row.original;
          const rowIndex = info.row.index;
          const value = getFieldValue(supplier, 'status'); // Maps to 'status' in DisplaySupplier
          const isEditing = isSpreadsheetMode || editingRow === supplier.supplierid;
          
          if (isEditing) {
            return (
              <div 
                className="flex items-center h-full py-1 px-1 w-full"
                onClick={() => handleCellClick(rowIndex, 6)}
              >
                <SpreadsheetCell
                  value={value}
                  field="status"
                  rowId={supplier.supplierid}
                  rowIndex={rowIndex}
                  colIndex={6}
                  isSpreadsheetMode={isEditing}
                  hasChanges={hasRowChanges(supplier.supplierid)}
                  onChange={(field, newValue) => updateRowData(supplier.supplierid, field, newValue)}
                  onLocalChange={handleLocalChange}
                />
              </div>
            );
          }
          
          return (
            <div className="flex items-center h-full py-2 px-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                info.getValue() ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {info.getValue() ? 'Inactive' : 'Active'}
              </span>
            </div>
          );
        },
        size: 100,
        minSize: 80,
        enableSorting: true,
      }),
      columnHelper.accessor('created_at', {
        header: () => (
          <div className="flex items-center cursor-pointer select-none hover:bg-gray-100 px-3 py-1 rounded" onClick={() => handleSort('created_at')}>
            <span className="text-gray-900">Created Date</span>
            {renderSortIcon('created_at')}
          </div>
        ),
        cell: info => (
          <div className="flex items-center h-full py-2 px-3">
            <span className="text-gray-600 text-xs">{info.getValue() ? formatDate(String(info.getValue())) : '-'}</span>
          </div>
        ),
        size: 120,
        minSize: 100,
        enableSorting: true,
      }),
    ];

    // Filter data columns based on visibility
    const visibleDataColumns = dataColumns.filter((column) => {
      const accessor = (column as any).accessorKey as string;
      return getColumnVisibility(accessor);
    });

    // Return action columns + visible data columns
    return [...actionColumns, ...visibleDataColumns];
  }, [columnHelper, handleSort, renderSortIcon, formatDate, getColumnVisibility, selectedRows, toggleAllRows, toggleRowSelection, handleEditRow, editingRow]);
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

      // Escape key - Clear selection and exit edit mode (with confirmation if changes exist)
      if (e.key === 'Escape') {
        e.preventDefault();
        setSelectedRows(new Set());
        
        // If we're editing a row with changes, confirm before exiting
        if (editingRow && hasRowChanges(editingRow)) {
          if (confirm('You have unsaved changes. Are you sure you want to exit editing? Your changes will be lost.')) {
            undoRowChanges(editingRow);
            setEditingRow(null);
          }
        } else {
          setEditingRow(null);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedRows, handleDeleteSelected, table, editingRow, hasRowChanges, undoRowChanges]);

  // Sync sticky horizontal scrollbar with main table
  useEffect(() => {
    const mainContainer = document.getElementById('main-table-container');
    const stickyScrollbar = document.getElementById('sticky-scrollbar');
    
    if (!mainContainer || !stickyScrollbar) return;

    const updateScrollbarWidth = () => {
      const table = mainContainer.querySelector('table');
      const stickyContent = document.getElementById('sticky-scrollbar-content');
      if (table && stickyContent) {
        // Get actual table dimensions
        const tableScrollWidth = table.scrollWidth;
        const containerClientWidth = mainContainer.clientWidth;
        const containerOffsetLeft = mainContainer.getBoundingClientRect().left;
        
        // Set the sticky scrollbar width and position to match table container
        stickyScrollbar.style.left = `${containerOffsetLeft}px`;
        stickyScrollbar.style.width = `${containerClientWidth}px`;
        stickyScrollbar.style.right = 'auto';
        stickyContent.style.width = `${tableScrollWidth}px`;
        
        // Show/hide sticky scrollbar based on whether scrolling is needed
        const needsScrollbar = tableScrollWidth > containerClientWidth;
        stickyScrollbar.style.display = needsScrollbar ? 'block' : 'none';
      }
    };

    // Multiple timing checks to ensure proper calculation
    const timeouts = [0, 100, 300, 1000]; // Progressive delays
    timeouts.forEach(delay => {
      setTimeout(updateScrollbarWidth, delay);
    });

    let isMainScrolling = false;
    let isStickyScrolling = false;

    const handleMainScroll = () => {
      if (isStickyScrolling) return;
      isMainScrolling = true;
      stickyScrollbar.scrollLeft = mainContainer.scrollLeft;
      requestAnimationFrame(() => {
        isMainScrolling = false;
      });
    };

    const handleStickyScroll = () => {
      if (isMainScrolling) return;
      isStickyScrolling = true;
      mainContainer.scrollLeft = stickyScrollbar.scrollLeft;
      requestAnimationFrame(() => {
        isStickyScrolling = false;
      });
    };

    const handleResize = () => {
      // Delay to ensure layout has settled after resize
      setTimeout(updateScrollbarWidth, 100);
    };

    mainContainer.addEventListener('scroll', handleMainScroll);
    stickyScrollbar.addEventListener('scroll', handleStickyScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      mainContainer.removeEventListener('scroll', handleMainScroll);
      stickyScrollbar.removeEventListener('scroll', handleStickyScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [filteredSuppliers, table.getVisibleLeafColumns().length]); // Re-run when data or visible columns change

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
              onChange={(e) => updateSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchValue && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* View Options Panel */}
          <div className="flex items-center gap-2 relative">
            <ViewOptionsPanel
              columnVisibility={columnVisibility}
              onColumnVisibilityChange={toggleColumnVisibility}
              includeInactive={showInactive}
              onIncludeInactiveChange={onToggleInactiveAction}
              densityMode="compact"
              onDensityModeChange={() => {}} // No-op since we're fixed to compact
            />
          </div>
        </div>
      </div>



      {/* Table with Sticky Horizontal Scrollbar */}
      <div className="relative">
        {/* Main table container */}
        <div 
          className="w-full bg-white overflow-x-scroll" 
          id="main-table-container"
          style={{
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* IE/Edge */
          }}
        >
          <style dangerouslySetInnerHTML={{
            __html: `
              #main-table-container::-webkit-scrollbar {
                display: none; /* WebKit browsers */
              }
            `
          }} />
          <table className="w-full divide-y divide-gray-200 [&_*]:!text-xs" style={{ tableLayout: 'fixed' }}>
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
                  onClick={clearSearch}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Sticky Horizontal Scrollbar - Fixed to viewport bottom */}
        <div 
          className="fixed bottom-0 z-50"
          style={{ 
            overflowX: 'scroll', 
            overflowY: 'hidden',
            height: '17px', /* Match native scrollbar height */
            backgroundColor: 'transparent',
            left: '0px', /* Will be dynamically positioned */
            width: '100%' /* Will be dynamically sized */
          }}
          id="sticky-scrollbar"
        >
          <div 
            id="sticky-scrollbar-content"
            style={{ 
              height: '17px', 
              width: '100%'
            }} 
          />
        </div>
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
      {(selectedRows.size > 0 || isSpreadsheetMode || (!isSpreadsheetMode && selectedRows.size === 0)) && (
        <div 
          className="fixed bottom-4 right-4 z-[9999]"
          style={{ 
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            left: 'unset',
            width: 'auto',
            zIndex: 9999,
            pointerEvents: 'auto',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            willChange: 'transform'
          }}
        >
          <div className="bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-xl w-fit">
            <div className="flex items-center gap-3 p-4">
              
              {/* SPREADSHEET MODE - Save/Cancel Controls */}
              {isSpreadsheetMode && (
                <>
                  {/* Changes count */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium whitespace-nowrap">
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Edit Mode</span>
                    {localChanges.size > 0 && (
                      <>
                        <span className="text-blue-200">•</span>
                        <span>{localChanges.size}</span>
                        <span className="text-blue-200">changed</span>
                      </>
                    )}
                  </div>
                  
                  {/* Save button */}
                  <button 
                    onClick={handleSaveSpreadsheetChanges}
                    className="group flex items-center justify-center w-11 h-11 bg-green-500 hover:bg-green-600 rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 touch-manipulation"
                    title="Save changes"
                    style={{ minWidth: '44px', minHeight: '44px' }}
                  >
                    <Save className="h-5 w-5 text-white transition-transform duration-150 group-hover:scale-110" />
                  </button>
                  
                  {/* Cancel button */}
                  <button 
                    onClick={() => {
                      if (localChanges.size > 0) {
                        if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
                          setLocalChanges(new Map());
                          exitSpreadsheetMode();
                        }
                      } else {
                        exitSpreadsheetMode();
                      }
                    }}
                    className="group flex items-center justify-center w-11 h-11 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 touch-manipulation"
                    title="Cancel editing"
                    style={{ minWidth: '44px', minHeight: '44px' }}
                  >
                    <X className="h-5 w-5 text-gray-700 transition-transform duration-150 group-hover:scale-110" />
                  </button>
                </>
              )}

              {/* BULK ACTIONS - When rows are selected */}
              {selectedRows.size > 0 && !isSpreadsheetMode && (
                <>
                  {/* Selection count */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium whitespace-nowrap">
                    <span>{selectedRows.size}</span>
                    <span className="text-gray-300">selected</span>
                  </div>
                  
                  {/* Export button */}
                  <button 
                    onClick={handleExportSelected}
                    className="group flex items-center justify-center w-11 h-11 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 touch-manipulation"
                    title="Export selected"
                    style={{ minWidth: '44px', minHeight: '44px' }}
                  >
                    <Download className="h-5 w-5 text-gray-700 transition-transform duration-150 group-hover:scale-110" />
                  </button>
                  
                  {/* Unarchive button (gray to match archive) */}
                  <button 
                    onClick={handleUnarchiveSelected}
                    className="group flex items-center justify-center w-11 h-11 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 touch-manipulation"
                    title="Unarchive selected"
                    style={{ minWidth: '44px', minHeight: '44px' }}
                  >
                    <RotateCcw className="h-5 w-5 text-gray-700 transition-transform duration-150 group-hover:scale-110" />
                  </button>
                  
                  {/* Archive button */}
                  <button 
                    onClick={handleArchiveSelected}
                    className="group flex items-center justify-center w-11 h-11 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 touch-manipulation"
                    title="Archive selected"
                    style={{ minWidth: '44px', minHeight: '44px' }}
                  >
                    <Archive className="h-5 w-5 text-gray-700 transition-transform duration-150 group-hover:scale-110" />
                  </button>
                  
                  {/* Delete button */}
                  <button 
                    onClick={handleDeleteSelected}
                    className="group flex items-center justify-center w-11 h-11 bg-red-500 hover:bg-red-600 rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 touch-manipulation"
                    title="Delete selected"
                    style={{ minWidth: '44px', minHeight: '44px' }}
                  >
                    <Trash2 className="h-5 w-5 text-white transition-transform duration-150 group-hover:scale-110" />
                  </button>
                  
                  {/* Close button */}
                  <button 
                    onClick={() => setSelectedRows(new Set())}
                    className="group flex items-center justify-center w-11 h-11 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 touch-manipulation"
                    title="Clear selection"
                    style={{ minWidth: '44px', minHeight: '44px' }}
                  >
                    <X className="h-5 w-5 text-gray-700 transition-transform duration-150 group-hover:scale-110" />
                  </button>
                </>
              )}

              {/* SINGLE ROW EDIT MODE - When editing a single row */}
              {editingRow && !isSpreadsheetMode && (
                <>
                  {/* Editing row indicator */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium whitespace-nowrap">
                    <Edit3 className="h-4 w-4" />
                    <span>Editing Row</span>
                    {hasRowChanges(editingRow) && (
                      <>
                        <span className="text-yellow-200">•</span>
                        <span className="text-yellow-200">unsaved</span>
                      </>
                    )}
                  </div>
                  
                  {/* Save button */}
                  <button 
                    onClick={() => saveRowChanges(editingRow).then(() => setEditingRow(null))}
                    className="group flex items-center justify-center w-11 h-11 bg-green-500 hover:bg-green-600 rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 touch-manipulation"
                    title="Save changes"
                    style={{ minWidth: '44px', minHeight: '44px' }}
                  >
                    <Save className="h-5 w-5 text-white transition-transform duration-150 group-hover:scale-110" />
                  </button>
                  
                  {/* Cancel button */}
                  <button 
                    onClick={() => {
                      if (hasRowChanges(editingRow)) {
                        if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
                          undoRowChanges(editingRow);
                          setEditingRow(null);
                        }
                      } else {
                        setEditingRow(null);
                      }
                    }}
                    className="group flex items-center justify-center w-11 h-11 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 touch-manipulation"
                    title="Cancel editing"
                    style={{ minWidth: '44px', minHeight: '44px' }}
                  >
                    <X className="h-5 w-5 text-gray-700 transition-transform duration-150 group-hover:scale-110" />
                  </button>
                </>
              )}

              {/* ENTER EDIT MODE - When no rows selected and not in spreadsheet mode */}
              {selectedRows.size === 0 && !isSpreadsheetMode && !editingRow && (
                <>
                  {/* Enter Edit Mode button */}
                  <button 
                    onClick={enterSpreadsheetMode}
                    className="group flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 touch-manipulation text-sm font-medium"
                    title="Enter spreadsheet edit mode"
                  >
                    <FileSpreadsheet className="h-4 w-4 transition-transform duration-150 group-hover:scale-110" />
                    <span>Enter Edit Mode</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
