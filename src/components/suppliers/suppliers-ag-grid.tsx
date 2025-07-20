'use client';

import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // React Query hooks
  const { data: suppliers = [], isLoading, error } = useSuppliers('');
  const updateSupplierMutation = useUpdateSupplier();

  // Responsive breakpoint detection
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Column definitions with responsive behavior
  const columnDefs = useMemo((): ColDef[] => {
    const baseColumns: ColDef[] = [
      {
        field: 'name',
        headerName: 'Supplier Name',
        editable: true,
        sortable: true,
        filter: true,
        floatingFilter: true,
        flex: 2,
        minWidth: 150,
        cellStyle: { fontWeight: '500' },
      },
      {
        field: 'website',
        headerName: 'Website',
        editable: true,
        sortable: true,
        filter: true,
        floatingFilter: true,
        flex: 1.5,
        minWidth: 120,
        cellRenderer: (params: any) => {
          if (!params.value) {
            return '-';
          }
          return (
            <a
              href={
                params.value.startsWith('http')
                  ? params.value
                  : `https://${params.value}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {params.value}
            </a>
          );
        },
      },
      {
        field: 'contactPhone',
        headerName: 'Phone',
        editable: true,
        sortable: true,
        filter: true,
        floatingFilter: true,
        flex: 1,
        minWidth: 100,
        hide: isMobile, // Hide on mobile to save space
      },
      {
        field: 'address',
        headerName: 'Address',
        editable: true,
        sortable: true,
        filter: true,
        floatingFilter: true,
        flex: 2,
        minWidth: 150,
        hide: isMobile, // Hide on mobile to save space
        cellRenderer: (params: any) => {
          if (!params.value) {
            return '-';
          }
          return (
            <div className="truncate" title={params.value}>
              {params.value}
            </div>
          );
        },
      },
      {
        field: 'notes',
        headerName: 'Notes',
        editable: true,
        sortable: true,
        filter: true,
        floatingFilter: true,
        flex: 1.5,
        minWidth: 120,
        hide: isMobile || isTablet, // Hide on mobile and tablet
        cellRenderer: (params: any) => {
          if (!params.value) {
            return '-';
          }
          return (
            <div className="truncate" title={params.value}>
              {params.value}
            </div>
          );
        },
      },
      {
        field: 'isArchived',
        headerName: 'Status',
        sortable: true,
        filter: true,
        floatingFilter: true,
        flex: 0.8,
        minWidth: 80,
        cellRenderer: (params: any) => {
          const isArchived = params.value;
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
      },
      {
        field: 'created_at',
        headerName: 'Created',
        sortable: true,
        filter: true,
        floatingFilter: true,
        flex: 1,
        minWidth: 100,
        hide: isMobile || isTablet, // Hide on mobile and tablet
        cellRenderer: (params: any) => {
          if (!params.value) {
            return '-';
          }
          const date = new Date(params.value);
          return (
            <div
              className="cursor-help"
              title={`Created: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}
            >
              {date.toLocaleDateString()}
            </div>
          );
        },
      },
    ];

    return baseColumns;
  }, [isMobile, isTablet]);

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

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (gridRef.current?.api) {
        gridRef.current.api.sizeColumnsToFit();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('Suppliers data:', suppliers);
    console.log('Loading state:', isLoading);
    console.log('Error state:', error);
  }, [suppliers, isLoading, error]);

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
    <div className="ag-theme-alpine w-full h-full min-h-[400px]">
      <AgGridReact
        ref={gridRef}
        columnDefs={columnDefs}
        rowData={suppliers}
        rowSelection="multiple"
        editType="fullRow"
        stopEditingWhenCellsLoseFocus={true}
        animateRows={true}
        rowHeight={isMobile ? 60 : 48}
        suppressCellFocus={true}
        suppressColumnVirtualisation={isMobile}
        suppressRowVirtualisation={false}
        defaultColDef={{
          resizable: true,
          sortable: true,
          filter: true,
          floatingFilter: true,
        }}
        onGridReady={onGridReady}
        onCellEditingStopped={onCellEditingStopped}
        className="w-full h-full"
      />
    </div>
  );
}
