'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  CellEditingStoppedEvent,
  SelectionChangedEvent,
  ModuleRegistry,
  AllCommunityModule,
  ContextMenuModule,
  MenuModule,
  GridOptions,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '@/styles/ag-grid-custom.css';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule, ContextMenuModule, MenuModule]);

import { Button } from '@/components/ui/button';
import { Plus, Trash2, Archive } from 'lucide-react';
import { Supplier, CreateSupplierRequest } from '@/types';
import {
  useSuppliers,
  useCreateSupplier,
  useUpdateSupplier,
  useBulkDeleteSuppliers,
  useBulkArchiveSuppliers,
} from '@/hooks/use-suppliers';

interface SuppliersAgGridProps {
  // No search prop needed - AG-Grid has built-in filtering
}

export function SuppliersAgGrid({}: SuppliersAgGridProps) {
  const gridRef = useRef<AgGridReact>(null);
  const [selectedRows, setSelectedRows] = useState<Supplier[]>([]);

  // React Query hooks
  const { data: suppliers = [], isLoading } = useSuppliers(''); // Empty string since AG-Grid handles filtering
  const createSupplierMutation = useCreateSupplier();
  const updateSupplierMutation = useUpdateSupplier();
  const bulkDeleteMutation = useBulkDeleteSuppliers();
  const bulkArchiveMutation = useBulkArchiveSuppliers();

  // Status renderer component
  const StatusRenderer = useCallback((params: any) => {
    const isArchived = params.value;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          isArchived
            ? 'bg-gray-100 text-gray-700 border border-gray-200'
            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
        }`}
      >
        {isArchived ? 'Archived' : 'Active'}
      </span>
    );
  }, []);

  // Website renderer with clickable links
  const WebsiteRenderer = useCallback((params: any) => {
    if (!params.value) {
      return '';
    }

    const url = params.value.startsWith('http')
      ? params.value
      : `https://${params.value}`;
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        onClick={e => e.stopPropagation()}
      >
        {params.value}
      </a>
    );
  }, []);

  // Phone renderer with clickable links
  const PhoneRenderer = useCallback((params: any) => {
    if (!params.value) {
      return '';
    }

    return (
      <a
        href={`tel:${params.value}`}
        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        onClick={e => e.stopPropagation()}
      >
        {params.value}
      </a>
    );
  }, []);

  // Column definitions
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: 'Supplier Name',
        field: 'name',
        flex: 2,
        editable: true,
        cellClass: 'font-medium text-gray-900',
        headerClass: 'font-semibold text-gray-700',
        checkboxSelection: true,
        headerCheckboxSelection: true,
      },
      {
        headerName: 'Website',
        field: 'website',
        flex: 2,
        editable: true,
        cellRenderer: WebsiteRenderer,
        cellClass: 'text-blue-600',
      },
      {
        headerName: 'Phone',
        field: 'contactPhone',
        flex: 1,
        editable: true,
        cellRenderer: PhoneRenderer,
        cellClass: 'text-blue-600',
      },
      {
        headerName: 'Status',
        field: 'isArchived',
        width: 120,
        cellRenderer: StatusRenderer,
        editable: false,
        headerClass: 'font-semibold text-gray-700',
      },
    ],
    [WebsiteRenderer, PhoneRenderer, StatusRenderer]
  );

  // Default column definitions
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      editable: false,
      floatingFilter: true,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
      },
      cellClass: 'text-gray-700',
      headerClass: 'font-semibold text-gray-700 bg-gray-50',
    }),
    []
  );

  // Grid options with modern v34 syntax
  const gridOptions = useMemo<GridOptions>(
    () => ({
      // Modern row selection configuration
      rowSelection: {
        type: 'multiple',
        enableClickSelection: true,
        checkboxes: true,
        headerCheckbox: true,
      },
      // Editing configuration
      editType: 'fullRow',
      stopEditingWhenCellsLoseFocus: true,
      // Context menu
      getContextMenuItems: (params: any) => [
        'copy',
        'copyWithHeaders',
        'paste',
        'separator',
        {
          name: 'Add New Supplier',
          action: () => handleAddSupplierAtIndex(0),
          icon: '<span class="text-green-600">+</span>',
        },
        'separator',
        'export',
      ],
      // Styling and behavior
      animateRows: true,
      enableCellTextSelection: true,
      ensureDomOrder: true,
      // Theme customization
      domLayout: 'normal',
      suppressRowHoverHighlight: false,
      suppressCellFocus: false,
      suppressRowClickSelection: false,
    }),
    []
  );

  // Handle grid ready
  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  // Handle cell editing stopped
  const onCellEditingStopped = useCallback(
    async (event: CellEditingStoppedEvent) => {
      if (!event.valueChanged) {
        return;
      }

      const { data, colDef } = event;
      const field = colDef.field;

      if (!field || !data) {
        return;
      }

      try {
        const updates: any = {};

        // Map the field names to the API expected format
        if (field === 'name') {
          updates.name = data.name;
        } else if (field === 'website') {
          updates.website = data.website || null;
        } else if (field === 'contactPhone') {
          updates.contactphone = data.contactPhone || null;
        }

        await updateSupplierMutation.mutateAsync({
          supplierId: data.supplierId,
          updates,
        });
      } catch (error) {
        console.error('Failed to update supplier:', error);
        // Optionally revert the change in the grid
        event.api.refreshCells({ rowNodes: [event.node!], force: true });
      }
    },
    [updateSupplierMutation]
  );

  // Handle selection changes
  const onSelectionChanged = useCallback((event: SelectionChangedEvent) => {
    const selectedData = event.api.getSelectedRows();
    setSelectedRows(selectedData);
  }, []);

  // Add new supplier using AG-Grid transactions
  const handleAddSupplier = useCallback(async () => {
    // Create a temporary supplier object for immediate grid display
    const tempSupplier: Supplier = {
      supplierId: `temp-${Date.now()}`, // Temporary ID
      name: 'New Supplier',
      website: '',
      contactPhone: '',
      address: '',
      notes: '',
      isArchived: false,
      created_at: new Date(),
    };

    // Add to grid immediately using transaction (adds at top by default)
    gridRef.current?.api.applyTransaction({
      add: [tempSupplier],
      addIndex: 0, // Add at top
    });

    // Start editing the new row immediately
    setTimeout(() => {
      const rowNode = gridRef.current?.api.getRowNode(tempSupplier.supplierId);
      if (rowNode) {
        gridRef.current?.api.startEditingCell({
          rowIndex: rowNode.rowIndex!,
          colKey: 'name',
        });
      }
    }, 100);

    try {
      // Create in database with actual data
      const supplierData: CreateSupplierRequest = {
        name: tempSupplier.name,
      };

      if (tempSupplier.website) {
        supplierData.website = tempSupplier.website;
      }

      if (tempSupplier.contactPhone) {
        supplierData.contactPhone = tempSupplier.contactPhone;
      }

      const actualSupplier =
        await createSupplierMutation.mutateAsync(supplierData);

      // Replace temporary row with actual data from database
      gridRef.current?.api.applyTransaction({
        remove: [tempSupplier],
        add: [actualSupplier],
        addIndex: 0,
      });
    } catch (error) {
      console.error('Failed to create supplier:', error);
      // Remove the temporary row on error
      gridRef.current?.api.applyTransaction({
        remove: [tempSupplier],
      });
    }
  }, [createSupplierMutation]);

  // Add supplier at specific index
  const handleAddSupplierAtIndex = useCallback(
    (index: number) => {
      handleAddSupplier(); // For now, just add at top
    },
    [handleAddSupplier]
  );

  // Bulk delete selected suppliers
  const handleBulkDelete = useCallback(async () => {
    if (selectedRows.length === 0) {
      return;
    }

    try {
      const supplierIds = selectedRows.map(supplier => supplier.supplierId);
      await bulkDeleteMutation.mutateAsync(supplierIds);
      setSelectedRows([]);
      gridRef.current?.api.deselectAll();
    } catch (error) {
      console.error('Failed to delete suppliers:', error);
    }
  }, [selectedRows, bulkDeleteMutation]);

  // Bulk archive selected suppliers
  const handleBulkArchive = useCallback(async () => {
    if (selectedRows.length === 0) {
      return;
    }

    try {
      const supplierIds = selectedRows.map(supplier => supplier.supplierId);
      await bulkArchiveMutation.mutateAsync(supplierIds);
      setSelectedRows([]);
      gridRef.current?.api.deselectAll();
    } catch (error) {
      console.error('Failed to archive suppliers:', error);
    }
  }, [selectedRows, bulkArchiveMutation]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleAddSupplier}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
          {selectedRows.length > 0 && (
            <>
              <Button
                onClick={handleBulkArchive}
                variant="outline"
                className="border-amber-200 hover:bg-amber-50"
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive ({selectedRows.length})
              </Button>
              <Button
                onClick={handleBulkDelete}
                variant="outline"
                className="border-red-200 hover:bg-red-50 text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedRows.length})
              </Button>
            </>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {suppliers.length} supplier{suppliers.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* AG Grid with enhanced styling */}
      <div className="ag-theme-alpine border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div style={{ height: '600px' }}>
          <AgGridReact
            ref={gridRef}
            rowData={suppliers}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            gridOptions={gridOptions}
            onGridReady={onGridReady}
            onCellEditingStopped={onCellEditingStopped}
            onSelectionChanged={onSelectionChanged}
            getRowId={(params: any) => params.data.supplierId}
            animateRows={true}
            enableCellTextSelection={true}
            ensureDomOrder={true}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
}
