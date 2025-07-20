'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  GridReadyEvent,
  CellEditingStoppedEvent,
  SelectionChangedEvent,
  ModuleRegistry,
  AllCommunityModule,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

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

export function SuppliersAgGrid() {
  const gridRef = useRef<AgGridReact>(null);
  const [selectedRows, setSelectedRows] = useState<Supplier[]>([]);

  // React Query hooks
  const { data: suppliers = [], isLoading } = useSuppliers('');
  const createSupplierMutation = useCreateSupplier();
  const updateSupplierMutation = useUpdateSupplier();
  const bulkDeleteMutation = useBulkDeleteSuppliers();
  const bulkArchiveMutation = useBulkArchiveSuppliers();

  // Status renderer
  const StatusRenderer = useCallback(
    (params: any) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          params.value
            ? 'bg-gray-100 text-gray-800'
            : 'bg-green-100 text-green-800'
        }`}
      >
        {params.value ? 'Archived' : 'Active'}
      </span>
    ),
    []
  );

  // Column definitions
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: 'Supplier Name',
        field: 'name',
        flex: 2,
        editable: true,
        checkboxSelection: true,
        headerCheckboxSelection: true,
      },
      {
        headerName: 'Website',
        field: 'website',
        flex: 2,
        editable: true,
      },
      {
        headerName: 'Phone',
        field: 'contactPhone',
        flex: 1,
        editable: true,
      },
      {
        headerName: 'Status',
        field: 'isArchived',
        width: 100,
        cellRenderer: StatusRenderer,
        editable: false,
      },
    ],
    [StatusRenderer]
  );

  // Default column definitions
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      editable: false,
      floatingFilter: true,
    }),
    []
  );

  // Grid options - simple v34 syntax
  const gridOptions = useMemo(
    () => ({
      rowSelection: 'multiple' as const,
      editType: 'fullRow' as const,
      stopEditingWhenCellsLoseFocus: true,
      animateRows: true,
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
        // Silently handle error and refresh cells
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

  // Add new supplier
  const handleAddSupplier = useCallback(async () => {
    const tempSupplier: Supplier = {
      supplierId: `temp-${Date.now()}`,
      name: 'New Supplier',
      website: '',
      contactPhone: '',
      address: '',
      notes: '',
      isArchived: false,
      created_at: new Date(),
    };

    gridRef.current?.api.applyTransaction({ add: [tempSupplier], addIndex: 0 });

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
      const actualSupplier = await createSupplierMutation.mutateAsync({
        name: tempSupplier.name,
      });
      gridRef.current?.api.applyTransaction({
        remove: [tempSupplier],
        add: [actualSupplier],
        addIndex: 0,
      });
    } catch (error) {
      // Silently handle error and remove temp supplier
      gridRef.current?.api.applyTransaction({ remove: [tempSupplier] });
    }
  }, [createSupplierMutation]);

  // Bulk delete
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
      // Silently handle error
    }
  }, [selectedRows, bulkDeleteMutation]);

  // Bulk archive
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
      // Silently handle error
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
              <Button onClick={handleBulkArchive} variant="outline">
                <Archive className="h-4 w-4 mr-2" />
                Archive ({selectedRows.length})
              </Button>
              <Button
                onClick={handleBulkDelete}
                variant="outline"
                className="text-red-600"
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

      {/* AG Grid - Simple and Clean */}
      <div className="ag-theme-alpine border border-gray-200 rounded-lg overflow-hidden">
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
          />
        </div>
      </div>
    </div>
  );
}
