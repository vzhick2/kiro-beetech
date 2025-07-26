'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUpdateSupplier, useBulkDeleteSuppliers, useBulkArchiveSuppliers, useBulkUnarchiveSuppliers } from '@/hooks/use-suppliers';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { FilterBar } from './filter-bar';
import { InfiniteSupplierList } from './infinite-supplier-list';
import { BulkActions } from './bulk-actions';
import { AddSupplierModal } from './add-supplier-modal';
import { 
  useSupplierFilters, 
  useSupplierSelection
} from './hooks';

export const CleanSupplierTable = () => {
  // State management with custom hooks
  const { filters, updateFilter, clearFilters } = useSupplierFilters();
  const { selection, clearSelection } = useSupplierSelection();
  
  // Add supplier modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Mutations for bulk operations
  const updateMutation = useUpdateSupplier();
  const bulkDeleteMutation = useBulkDeleteSuppliers();
  const bulkArchiveMutation = useBulkArchiveSuppliers();
  const bulkUnarchiveMutation = useBulkUnarchiveSuppliers();

  // Update supplier handler
  const handleUpdateSupplier = async (supplierId: string, data: any) => {
    try {
      await updateMutation.mutateAsync({ id: supplierId, ...data });
    } catch (error) {
      console.error('Failed to update supplier:', error);
    }
  };

  // Selection helpers
  const selectedIds = Array.from(selection.selectedIds);

  // Bulk operation handlers
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
    // Simple CSV export - would need selected suppliers data
    console.log('Bulk export not implemented for infinite scroll yet');
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onNewSupplier: () => setIsAddModalOpen(true),
    onBulkDelete: handleBulkDelete,
    selectedCount: selectedIds.length
  });

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="min-w-[120px] h-10" // Fixed width and height
          title="Add new supplier (Ctrl+N)"
        >
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
