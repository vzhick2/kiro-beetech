'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUpdateSupplier, useBulkDeleteSuppliers, useBulkArchiveSuppliers, useBulkUnarchiveSuppliers } from '@/hooks/use-suppliers';
import { FilterBar } from './filter-bar';
import { InfiniteSupplierList } from './infinite-supplier-list';
import { BulkActions } from './bulk-actions';
import { AddSupplierModal } from './add-supplier-modal';
import { 
  useSupplierFilters, 
  useSupplierSelection
} from './hooks';// Transform Supabase supplier to clean format
export const CleanSupplierTable = () => {
  // State management with custom hooks
  const { filters, updateFilter, clearFilters } = useSupplierFilters();
  const { selection, toggleSelection, clearSelection } = useSupplierSelection();
  
  // Add supplier modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Mutations for bulk operations
  const updateMutation = useUpdateSupplier();
  const bulkDeleteMutation = useBulkDeleteSuppliers();
  const bulkArchiveMutation = useBulkArchiveSuppliers();
  const bulkUnarchiveMutation = useBulkUnarchiveSuppliers();

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
    if (selectedIds.length === 0) return;
    try {
      await bulkUnarchiveMutation.mutateAsync(selectedIds);
      clearSelection();
    } catch (error) {
      console.error('Failed to unarchive suppliers:', error);
    }
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
        totalCount={0}
        filteredCount={0}
      />

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedIds.length}
        onDelete={handleBulkDelete}
        onArchive={handleBulkArchive}
        onUnarchive={handleBulkUnarchive}
        onExport={handleBulkExport}
        onClear={clearSelection}
        hasArchivedSelected={false}
      />

      {/* Infinite Scroll Table */}
      <InfiniteSupplierList 
        onSupplierUpdateAction={handleUpdateSupplier}
      />

      {/* Add Supplier Modal */}
      <AddSupplierModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
