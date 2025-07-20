'use client';

import { useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  GridReadyEvent,
  CellEditingStoppedEvent,
  ModuleRegistry,
  AllCommunityModule,
} from 'ag-grid-community';
// Import Quartz theme CSS
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

import { Supplier } from '@/types';
import { useSuppliers, useUpdateSupplier } from '@/hooks/use-suppliers';

export function SuppliersAgGrid() {
  const gridRef = useRef<AgGridReact>(null);

  // React Query hooks
  const { data: suppliers = [], isLoading, error } = useSuppliers('');
  const updateSupplierMutation = useUpdateSupplier();

  // Simple column definitions
  const columnDefs: ColDef[] = [
    {
      field: 'name',
      headerName: 'Supplier Name',
      editable: true,
      sortable: true,
      filter: true,
    },
    {
      field: 'website',
      headerName: 'Website',
      editable: true,
      sortable: true,
      filter: true,
    },
    {
      field: 'contactPhone',
      headerName: 'Phone',
      editable: true,
      sortable: true,
      filter: true,
    },
    {
      field: 'address',
      headerName: 'Address',
      editable: true,
      sortable: true,
      filter: true,
    },
    {
      field: 'notes',
      headerName: 'Notes',
      editable: true,
      sortable: true,
      filter: true,
    },
    {
      field: 'isArchived',
      headerName: 'Status',
      sortable: true,
      filter: true,
    },
    {
      field: 'created_at',
      headerName: 'Created',
      sortable: true,
      filter: true,
    },
  ];

  // Handle cell editing
  const onCellEditingStopped = useCallback(
    async (event: CellEditingStoppedEvent) => {
      if (!event.newValue || event.newValue === event.oldValue) {
        return;
      }

      const data = event.data as Supplier;
      const field = event.column.getColId();
      const updates: Partial<Supplier> = { [field]: event.newValue };

      try {
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

  // Handle grid ready
  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading suppliers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">
          Error loading suppliers: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="ag-theme-quartz w-full h-full min-h-[400px]">
      <AgGridReact
        ref={gridRef}
        columnDefs={columnDefs}
        rowData={suppliers}
        rowSelection="multiple"
        editType="fullRow"
        stopEditingWhenCellsLoseFocus={true}
        animateRows={true}
        defaultColDef={{
          resizable: true,
          sortable: true,
          filter: true,
        }}
        onGridReady={onGridReady}
        onCellEditingStopped={onCellEditingStopped}
        className="w-full h-full"
      />
    </div>
  );
}
