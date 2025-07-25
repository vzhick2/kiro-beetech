'use client';

import React from 'react';
import { useState, useMemo, useEffect } from 'react';
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
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { Supplier } from '@/types';
import { useSuppliers } from '@/hooks/use-suppliers';
import { usePagination } from '@/hooks/use-pagination';
import { useMobileDetection } from '@/hooks/use-mobile-detection';
import { useDebouncedSearch } from '@/hooks/use-debounce';
import { StatusBadge } from '@/components/status-badge';

// Map database supplier to display format
interface DisplaySupplier extends Supplier {
  id: string;
  status: 'active' | 'inactive' | 'pending' | 'archived';
}

const columnHelper = createColumnHelper<DisplaySupplier>();

export const ModernDataTable = () => {
  const { isMobile } = useMobileDetection();
  const { searchValue, debouncedSearchValue, updateSearch, clearSearch } =
    useDebouncedSearch('', 300);

  // Use your existing suppliers hook
  const queryResult = useSuppliers();
  const { data: rawSuppliers, isLoading, error, refetch } = queryResult;

  // Transform database suppliers to display format
  const data = useMemo((): DisplaySupplier[] => {
    if (!rawSuppliers) return [];
    return rawSuppliers.map(supplier => ({
      ...supplier,
      id: supplier.supplierId,
      status: supplier.isArchived ? 'archived' : 'active',
    }));
  }, [rawSuppliers]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');

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

  // Sync debounced search value with global filter
  useEffect(() => {
    setGlobalFilter(debouncedSearchValue);
  }, [debouncedSearchValue]);

  const columns = useMemo(
    () => [
      // Selection checkbox column
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <div className="flex items-center justify-center h-8 w-full">
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={value => {
                table.toggleAllPageRowsSelected(!!value);
              }}
              aria-label="Select all"
              className="h-4 w-4"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={value => row.toggleSelected(!!value)}
              aria-label="Select row"
              className="h-4 w-4"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
      }),

      columnHelper.accessor('name', {
        header: 'Supplier Name',
        cell: ({ getValue }) => <div className="font-medium">{getValue()}</div>,
        size: 200,
      }),

      columnHelper.accessor('website', {
        header: 'Website',
        cell: ({ getValue }) => {
          const website = getValue();
          return website ? (
            <a
              href={website.startsWith('http') ? website : `https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 text-sm"
            >
              {website.replace(/^https?:\/\//, '')}
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <span className="text-gray-400 italic text-sm">No website</span>
          );
        },
        size: 180,
      }),

      columnHelper.accessor('contactPhone', {
        header: 'Phone',
        cell: ({ getValue }) => {
          const phone = getValue();
          return phone ? (
            <span className="text-sm">{phone}</span>
          ) : (
            <span className="text-gray-400 italic text-sm">No phone</span>
          );
        },
        size: 140,
      }),

      columnHelper.display({
        id: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
        size: 100,
      }),

      columnHelper.accessor('created_at', {
        header: 'Created',
        cell: ({ getValue }) => {
          const date = getValue();
          return date ? (
            <span
              className="text-sm text-gray-600"
              title={new Date(date).toLocaleString()}
            >
              {new Date(date).toLocaleDateString()}
            </span>
          ) : null;
        },
        size: 100,
      }),
    ],
    []
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
    globalFilterFn: 'includesString',
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  if (error) {
    return (
      <div className="w-full">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-sm">
              {error?.message || 'An error occurred'}
            </span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              <span className="text-sm">Retry</span>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search suppliers..."
            value={searchValue}
            onChange={e => updateSearch(e.target.value)}
            className="pl-10 pr-10 micro-pulse transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 micro-scale touch-feedback"
              onClick={clearSearch}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {selectedRows.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 micro-fade">
              {selectedRows.length} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              className="micro-bounce touch-feedback transition-all duration-200 hover:bg-blue-50"
            >
              Actions
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className="text-left"
                    style={{ width: header.getSize() }}
                  >
                    <div
                      className={`flex items-center gap-2 ${
                        header.column.getCanSort()
                          ? 'cursor-pointer select-none hover:bg-gray-50 rounded p-1'
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
                            className={`h-3 w-3 ${
                              header.column.getIsSorted() === 'asc'
                                ? 'text-blue-600'
                                : 'text-gray-400'
                            }`}
                          />
                          <ChevronDown
                            className={`h-3 w-3 -mt-1 ${
                              header.column.getIsSorted() === 'desc'
                                ? 'text-blue-600'
                                : 'text-gray-400'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading && !table.getRowModel().rows?.length ? (
              // Enhanced skeleton loading state
              [...Array(6)].map((_, index) => (
                <TableRow key={index} className="animate-pulse">
                  <TableCell className="py-4">
                    <div className="flex items-center justify-center">
                      <div className="h-4 w-4 bg-gray-200 rounded loading-shimmer"></div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded-md w-3/4 loading-shimmer"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/2 loading-shimmer"></div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-4 bg-gray-200 rounded w-24 loading-shimmer"></div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-4 bg-gray-200 rounded w-20 loading-shimmer"></div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-6 bg-gray-200 rounded-full w-16 loading-shimmer"></div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex gap-1">
                      <div className="h-6 w-6 bg-gray-200 rounded loading-shimmer"></div>
                      <div className="h-6 w-6 bg-gray-200 rounded loading-shimmer"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  className={
                    row.getIsSelected() ? 'bg-muted/50' : 'hover:bg-muted/30'
                  }
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <AlertCircle className="h-6 w-6" />
                    <p className="text-sm">No suppliers found</p>
                    {globalFilter && (
                      <Button variant="outline" size="sm" onClick={clearSearch}>
                        <span className="text-sm">Clear search</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {selectedRows.length > 0 && (
            <span>
              {selectedRows.length} of {table.getFilteredRowModel().rows.length}{' '}
              row(s) selected.
            </span>
          )}
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <select
              value={pagination.pageSize}
              onChange={e => setPageSize(Number(e.target.value))}
              className="h-8 w-16 rounded border border-input bg-background px-2 text-sm"
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-24 items-center justify-center text-sm font-medium">
            Page {pagination.pageIndex + 1} of {Math.max(1, pageCount)}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => goToPage(0)}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">Go to first page</span>
              {'<<'}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={previousPage}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">Go to previous page</span>
              {'<'}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={nextPage}
              disabled={!canNextPage}
            >
              <span className="sr-only">Go to next page</span>
              {'>'}
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => goToPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              <span className="sr-only">Go to last page</span>
              {'>>'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
