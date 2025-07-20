'use client';

import { useCallback, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  GridReadyEvent,
  CellEditingStoppedEvent,
  ModuleRegistry,
  AllCommunityModule,
} from 'ag-grid-community';
// Use legacy CSS approach for Alpine theme
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

import { Supplier } from '@/types';
import { useSuppliers, useUpdateSupplier } from '@/hooks/use-suppliers';

export function SuppliersAgGrid() {
  const gridRef = useRef<AgGridReact>(null);

  // React Query hooks
  const { data: suppliers = [], isLoading } = useSuppliers('');
  const updateSupplierMutation = useUpdateSupplier();

  // Status renderer
  const StatusRenderer = useCallback((params: any) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
      params.value ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
    }`}>
      {params.value ? 'Archived' : 'Active'}
    </span>
  ), []);

  // Column definitions
  const columnDefs = useMemo<ColDef[]>(() => [
    {
      headerName: 'Supplier Name',
      field: 'name',
      flex: 2,
      editable: true,
      minWidth: 150,
    },
    {
      headerName: 'Website',
      field: 'website',
      flex: 2,
      editable: true,
      minWidth: 200,
    },
    {
      headerName: 'Phone',
      field: 'contactPhone',
      flex: 1,
      editable: true,
      minWidth: 120,
    },
    {
      headerName: 'Status',
      field: 'isArchived',
      width: 100,
      cellRenderer: StatusRenderer,
      editable: false,
      minWidth: 100,
    },
  ], [StatusRenderer]);

  // Default column definitions
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    editable: false,
    floatingFilter: true,
  }), []);

  // Grid options - clean and simple
  const gridOptions = useMemo(() => ({
    editType: 'fullRow' as const,
    stopEditingWhenCellsLoseFocus: true,
    animateRows: true,
    // Use legacy theme to avoid conflict with CSS imports
    theme: 'legacy' as const,
    // Enable horizontal scrolling
    suppressColumnVirtualisation: false,
    suppressRowVirtualisation: false,
  }), []);

  // Handle grid ready
  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  // Handle cell editing stopped
  const onCellEditingStopped = useCallback(async (event: CellEditingStoppedEvent) => {
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
  }, [updateSupplierMutation]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="ag-theme-alpine w-full h-full overflow-auto">
      <div style={{ height: '100vh', width: '100%', minWidth: '800px' }}>
        <AgGridReact
          ref={gridRef}
          rowData={suppliers}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          gridOptions={gridOptions}
          onGridReady={onGridReady}
          onCellEditingStopped={onCellEditingStopped}
          getRowId={(params: any) => params.data.supplierId}
        />
      </div>
    </div>
  );
}
