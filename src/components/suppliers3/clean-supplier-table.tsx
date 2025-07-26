'use client';

import { useState, useMemo } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useSuppliers, useUpdateSupplier, useBulkDeleteSuppliers, useBulkArchiveSuppliers } from '@/hooks/use-suppliers';
import { FilterBar } from './filter-bar';
import { SupplierRow } from './supplier-row';
import { EditableRow } from './editable-row';
import { BulkActions } from './bulk-actions';
import { AddSupplierModal } from './add-supplier-modal';
import { 
  useSupplierFilters,
  useSupplierSelection,
  useSupplierViewMode,
  useFilteredSuppliers
} from './hooks';
import { CleanSupplier, ViewMode } from './types';
import { Supplier } from '@/types';

// Transform Supabase supplier to clean format
const transformSupplier = (supplier: Supplier): CleanSupplier => {
  const clean: CleanSupplier = {
    id: supplier.supplierid,
    name: supplier.name,
    isArchived: supplier.isarchived,
    createdAt: new Date(supplier.created_at)
  };
  
  if (supplier.website) clean.website = supplier.website;
  if (supplier.contactphone) clean.phone = supplier.contactphone;
  if (supplier.email) clean.email = supplier.email;
  
  return clean;
};

export const CleanSupplierTable = () => {
  // Data fetching
  const { data: rawSuppliers, isLoading, error } = useSuppliers();
  const updateMutation = useUpdateSupplier();
  const bulkDeleteMutation = useBulkDeleteSuppliers();
  const bulkArchiveMutation = useBulkArchiveSuppliers();

  // State management with custom hooks
  const { filters, updateFilter, clearFilters } = useSupplierFilters();
  const { selection, toggleSelection, clearSelection, selectAll } = useSupplierSelection();
  const { mode, editingId, enterEditMode, enterViewMode } = useSupplierViewMode();
  
  // Add supplier modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Transform and filter data
  const suppliers = useMemo(() => 
    rawSuppliers ? rawSuppliers.map(transformSupplier) : []
  , [rawSuppliers]);

  const filteredSuppliers = useFilteredSuppliers(suppliers, filters);

  // Selection helpers
  const selectedIds = Array.from(selection.selectedIds);
  const selectedSuppliers = suppliers.filter(s => selection.selectedIds.has(s.id));
  const hasArchivedSelected = selectedSuppliers.some(s => s.isArchived);

  // Handlers
  const handleUpdateSupplier = async (id: string, updates: Partial<CleanSupplier>) => {
    try {
      // Transform back to Supabase format
      const supplierUpdates: Record<string, unknown> = {};
      if (updates.name !== undefined) supplierUpdates.name = updates.name;
      if (updates.website !== undefined) supplierUpdates.website = updates.website;
      if (updates.phone !== undefined) supplierUpdates.contactphone = updates.phone;
      if (updates.email !== undefined) supplierUpdates.email = updates.email;
      if (updates.isArchived !== undefined) supplierUpdates.isarchived = updates.isArchived;

      await updateMutation.mutateAsync({ supplierId: id, updates: supplierUpdates });
      enterViewMode();
    } catch (error) {
      console.error('Failed to update supplier:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await bulkDeleteMutation.mutateAsync(selectedIds);
      clearSelection();
    } catch (error) {
      console.error('Failed to delete suppliers:', error);
    }
  };

  const handleBulkArchive = async () => {
    if (selectedIds.length === 0) return;
    try {
      await bulkArchiveMutation.mutateAsync(selectedIds);
      clearSelection();
    } catch (error) {
      console.error('Failed to archive suppliers:', error);
    }
  };

  const handleBulkUnarchive = async () => {
    // Implementation would need a bulk unarchive mutation
    console.log('Bulk unarchive not implemented yet');
  };

  const handleBulkExport = async () => {
    // Simple CSV export
    const csvContent = selectedSuppliers.map(s => 
      `"${s.name}","${s.website || ''}","${s.phone || ''}","${s.email || ''}","${s.isArchived ? 'Archived' : 'Active'}"`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'suppliers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSelectAll = () => {
    if (selection.selectedIds.size === filteredSuppliers.length) {
      clearSelection();
    } else {
      selectAll(filteredSuppliers.map(s => s.id));
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <div className="text-red-600">
          Error loading suppliers: {error.message || String(error)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          Add Supplier
        </Button>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
        totalCount={suppliers.length}
        filteredCount={filteredSuppliers.length}
      />

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedIds.length}
        onDelete={handleBulkDelete}
        onArchive={handleBulkArchive}
        onUnarchive={handleBulkUnarchive}
        onExport={handleBulkExport}
        onClear={clearSelection}
        hasArchivedSelected={hasArchivedSelected}
      />

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-4 py-3 text-left">
                  <Checkbox
                    checked={selection.selectedIds.size === filteredSuppliers.length && filteredSuppliers.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all suppliers"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Supplier
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Website
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-gray-500">Loading suppliers...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    {suppliers.length === 0 ? 'No suppliers found' : 'No suppliers match your filters'}
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((supplier, index) => 
                  editingId === supplier.id ? (
                    <EditableRow
                      key={supplier.id}
                      supplier={supplier}
                      onSave={handleUpdateSupplier}
                      onCancel={enterViewMode}
                    />
                  ) : (
                    <SupplierRow
                      key={supplier.id}
                      supplier={supplier}
                      isSelected={selection.selectedIds.has(supplier.id)}
                      onToggleSelect={toggleSelection}
                      onEdit={enterEditMode}
                      mode={mode}
                      index={index}
                    />
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Supplier Modal */}
      <AddSupplierModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
