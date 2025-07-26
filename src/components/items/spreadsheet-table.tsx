'use client';

import { useState, useCallback } from 'react';
import {
  Check,
  X,
  Edit3,
  Trash2,
  Plus,
  MoreHorizontal,
  Minus,
} from 'lucide-react';
import { Item, InventoryUnit } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useItems,
  useUpdateItem,
  useBulkDeleteItems,
  useBulkArchiveItems,
} from '@/hooks/use-items';

interface SpreadsheetTableProps {
  onItemAdded?: () => void;
  searchQuery?: string;
  typeFilter?: string;
}

interface EditableCell {
  itemId: string;
  field: keyof Item;
  value: string | number | boolean | Date;
  isEditing: boolean;
}

const INVENTORY_UNITS: { value: InventoryUnit; label: string }[] = [
  { value: 'each', label: 'Each' },
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'gal', label: 'Gallons (gal)' },
  { value: 'qt', label: 'Quarts (qt)' },
  { value: 'pt', label: 'Pints (pt)' },
  { value: 'cup', label: 'Cups' },
  { value: 'fl_oz', label: 'Fluid Ounces (fl oz)' },
  { value: 'ml', label: 'Milliliters (ml)' },
  { value: 'l', label: 'Liters (l)' },
];

export function SpreadsheetTable({
  searchQuery = '',
  typeFilter = 'all',
}: SpreadsheetTableProps) {
  const [editingCell, setEditingCell] = useState<EditableCell | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // React Query hooks
  const { data: items = [], isLoading } = useItems(searchQuery, typeFilter);
  const updateItemMutation = useUpdateItem();
  const bulkDeleteMutation = useBulkDeleteItems();
  const bulkArchiveMutation = useBulkArchiveItems();

  // Filter items based on search query and type filter
  const filteredItems = items.filter(item => {
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.SKU.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || item.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleCellEdit = useCallback(
    (
      itemId: string,
      field: keyof Item,
      value: string | number | boolean | Date
    ) => {
      setEditingCell({ itemId, field, value, isEditing: true });
    },
    []
  );

  const handleCellSave = useCallback(
    async (
      itemId: string,
      field: keyof Item,
      value: string | number | boolean | Date
    ) => {
      try {
        // Map frontend field names to database column names
        const dbFieldMap: Record<keyof Item, string> = {
          itemId: 'itemid',
          name: 'name',
          SKU: 'sku',
          type: 'type',
          inventoryUnit: 'inventoryunit',
          currentQuantity: 'currentquantity',
          weightedAverageCost: 'weightedaveragecost',
          reorderPoint: 'reorderpoint',
          lastCountedDate: 'lastcounteddate',
          primarysupplierid: 'primarysupplierid',
          leadTimeDays: 'leadtimedays',
          trackingMode: 'tracking_mode',
          isarchived: 'isarchived',
          created_at: 'created_at',
          updated_at: 'updated_at',
          lastUsedSupplier: 'lastUsedSupplier',
          primarySupplierName: 'primarySupplierName',
        };
        const dbField = dbFieldMap[field];
        const dbValue =
          field === 'lastCountedDate' && value && typeof value !== 'boolean'
            ? new Date(value).toISOString()
            : value;

        // Use React Query mutation
        await updateItemMutation.mutateAsync({
          itemId,
          updates: { [dbField]: dbValue },
        });
        setEditingCell(null);
      } catch (error) {
        console.error('Failed to save cell:', error);
      }
    },
    [updateItemMutation]
  );

  const handleCellCancel = useCallback(() => {
    setEditingCell(null);
  }, []);

  const handleRowSelect = useCallback((itemId: string, checked: boolean) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedRows(new Set(items.map(item => item.itemId)));
      } else {
        setSelectedRows(new Set());
      }
    },
    [items]
  );

  const handleBulkDelete = useCallback(async () => {
    if (selectedRows.size === 0) {
      return;
    }

    try {
      const itemIds = Array.from(selectedRows);
      await bulkDeleteMutation.mutateAsync(itemIds);
      setSelectedRows(new Set());
    } catch (error) {
      console.error('Failed to delete items:', error);
    }
  }, [selectedRows, bulkDeleteMutation]);

  const handleBulkArchive = useCallback(async () => {
    if (selectedRows.size === 0) {
      return;
    }

    try {
      const itemIds = Array.from(selectedRows);
      await bulkArchiveMutation.mutateAsync(itemIds);
      setSelectedRows(new Set());
    } catch (error) {
      console.error('Failed to archive items:', error);
    }
  }, [selectedRows, bulkArchiveMutation]);

  const handleQuickReorder = useCallback(async (itemId: string) => {
    // TODO: Implement quick reorder functionality
    // This will be fully implemented in Task 7.2
    console.log('Quick reorder for item:', itemId);
  }, []);

  const handleManualCount = useCallback(async (itemId: string) => {
    // TODO: Implement manual count functionality
    // This will be fully implemented in Task 6.2
    console.log('Manual count for item:', itemId);
  }, []);

  const renderCell = useCallback(
    (item: Item, field: keyof Item) => {
      const value = item[field];
      const isEditing =
        editingCell?.itemId === item.itemId && editingCell?.field === field;

      // Handle undefined values
      if (value === undefined) {
        return <span className="text-gray-400 italic">-</span>;
      }

      // Special handling for quantity field with +/- buttons
      if (field === 'currentQuantity') {
        // Hide quantity for cost-only items
        if (item.trackingMode === 'cost_added') {
          return (
            <div className="flex items-center space-x-1">
              <span className="text-gray-400 italic text-sm">Cost only</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                No tracking
              </span>
            </div>
          );
        }

        if (isEditing) {
          return (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => {
                  const newValue = Math.max(0, Number(value) - 1);
                  handleCellSave(item.itemId, field, newValue);
                }}
                className="min-w-[44px] min-h-[44px] md:min-w-[32px] md:min-h-[32px] p-2 md:p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors flex items-center justify-center"
                title="Decrease by 1"
              >
                <Minus className="w-4 h-4 md:w-3 md:h-3" />
              </button>
              <input
                type="number"
                defaultValue={String(value)}
                className="w-16 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleCellSave(
                      item.itemId,
                      field,
                      Number(e.currentTarget.value)
                    );
                  } else if (e.key === 'Escape') {
                    handleCellCancel();
                  }
                }}
                onBlur={e =>
                  handleCellSave(item.itemId, field, Number(e.target.value))
                }
                autoFocus
              />
              <button
                onClick={() => {
                  const newValue = Number(value) + 1;
                  handleCellSave(item.itemId, field, newValue);
                }}
                className="min-w-[44px] min-h-[44px] md:min-w-[32px] md:min-h-[32px] p-2 md:p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors flex items-center justify-center"
                title="Increase by 1"
              >
                <Plus className="w-4 h-4 md:w-3 md:h-3" />
              </button>
              <div className="flex space-x-1 ml-1">
                <button
                  onClick={() => handleCellSave(item.itemId, field, value)}
                  className="min-w-[44px] min-h-[44px] md:min-w-[32px] md:min-h-[32px] p-2 md:p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors flex items-center justify-center"
                  title="Save"
                >
                  <Check className="w-4 h-4 md:w-3 md:h-3" />
                </button>
                <button
                  onClick={handleCellCancel}
                  className="min-w-[44px] min-h-[44px] md:min-w-[32px] md:min-h-[32px] p-2 md:p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors flex items-center justify-center"
                  title="Cancel"
                >
                  <X className="w-4 h-4 md:w-3 md:h-3" />
                </button>
              </div>
            </div>
          );
        } else {
          const quantity = Number(value);
          const reorderPoint = item.reorderPoint || 0;
          const isLowStock = quantity <= reorderPoint;
          const isNegative = quantity < 0;

          return (
            <div className="flex items-center space-x-1">
              <span
                className={`font-medium ${
                  isNegative
                    ? 'text-red-600'
                    : isLowStock
                      ? 'text-orange-600'
                      : 'text-gray-900'
                }`}
              >
                {String(value)}
              </span>
              {isNegative && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  Negative
                </span>
              )}
              {isLowStock && !isNegative && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                  Low
                </span>
              )}
              <button
                onClick={() => handleCellEdit(item.itemId, field, value)}
                className="min-w-[44px] min-h-[44px] md:min-w-[32px] md:min-h-[32px] p-2 md:p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center"
                title="Edit quantity"
              >
                <Edit3 className="w-4 h-4 md:w-3 md:h-3" />
              </button>
            </div>
          );
        }
      }

      // Standard inline editing for other fields
      if (isEditing) {
        // Special dropdown for tracking mode
        if (field === 'trackingMode') {
          return (
            <div className="flex items-center space-x-1">
              <select
                defaultValue={String(value || 'fully_tracked')}
                className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleCellSave(item.itemId, field, e.currentTarget.value);
                  } else if (e.key === 'Escape') {
                    handleCellCancel();
                  }
                }}
                onChange={e =>
                  handleCellSave(item.itemId, field, e.target.value)
                }
                autoFocus
              >
                <option value="fully_tracked">Full Tracking</option>
                <option value="cost_added">Cost Only</option>
              </select>
            </div>
          );
        }

        return (
          <div className="flex items-center space-x-1">
            <input
              type={typeof value === 'number' ? 'number' : 'text'}
              defaultValue={String(value || '')}
              className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleCellSave(item.itemId, field, e.currentTarget.value);
                } else if (e.key === 'Escape') {
                  handleCellCancel();
                }
              }}
              onBlur={e => handleCellSave(item.itemId, field, e.target.value)}
              autoFocus
            />
            <div className="flex space-x-1">
              <button
                onClick={() => handleCellSave(item.itemId, field, value || '')}
                className="min-w-[44px] min-h-[44px] md:min-w-[32px] md:min-h-[32px] p-2 md:p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors flex items-center justify-center"
                title="Save"
              >
                <Check className="w-4 h-4 md:w-3 md:h-3" />
              </button>
              <button
                onClick={handleCellCancel}
                className="min-w-[44px] min-h-[44px] md:min-w-[32px] md:min-h-[32px] p-2 md:p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors flex items-center justify-center"
                title="Cancel"
              >
                <X className="w-4 h-4 md:w-3 md:h-3" />
              </button>
            </div>
          </div>
        );
      }

      // Display value based on field type
      if (
        field === 'lastCountedDate' &&
        value &&
        typeof value === 'object' &&
        'toLocaleDateString' in value
      ) {
        return <span>{(value as Date).toLocaleDateString()}</span>;
      }

      if (field === 'weightedAverageCost') {
        return <span>${Number(value || 0).toFixed(2)}</span>;
      }

      if (field === 'reorderPoint') {
        return <span>{value ? String(value) : '-'}</span>;
      }

      if (
        (field === 'created_at' || field === 'updated_at') &&
        value &&
        typeof value === 'object' &&
        'toLocaleDateString' in value
      ) {
        return <span>{(value as Date).toLocaleDateString()}</span>;
      }

      // Handle Date objects
      if (value instanceof Date) {
        return (
          <div className="group flex items-center space-x-1">
            <span>{value.toLocaleDateString()}</span>
            <button
              onClick={() => handleCellEdit(item.itemId, field, value)}
              className="min-w-[44px] min-h-[44px] md:min-w-[32px] md:min-h-[32px] p-2 md:p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center"
              title={`Edit ${field}`}
            >
              <Edit3 className="w-4 h-4 md:w-3 md:h-3" />
            </button>
          </div>
        );
      }

      // Make key fields clickable for editing
      const editableFields = [
        'name',
        'SKU',
        'reorderPoint',
        'type',
        'trackingMode',
      ];
      if (editableFields.includes(field)) {
        return (
          <div className="group flex items-center space-x-1">
            {field === 'type' ? (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  value === 'ingredient'
                    ? 'bg-blue-100 text-blue-800'
                    : value === 'packaging'
                      ? 'bg-purple-100 text-purple-800'
                      : value === 'product'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                }`}
              >
                {String(value || '')}
              </span>
            ) : field === 'trackingMode' ? (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  value === 'fully_tracked'
                    ? 'bg-green-100 text-green-800'
                    : value === 'cost_added'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                }`}
              >
                {value === 'fully_tracked' ? 'Full Tracking' : 'Cost Only'}
              </span>
            ) : (
              <span>{String(value || '')}</span>
            )}
            <button
              onClick={() => handleCellEdit(item.itemId, field, value)}
              className="min-w-[44px] min-h-[44px] md:min-w-[32px] md:min-h-[32px] p-2 md:p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center"
              title={`Edit ${field}`}
            >
              <Edit3 className="w-4 h-4 md:w-3 md:h-3" />
            </button>
          </div>
        );
      }

      return <span>{String(value || '')}</span>;
    },
    [editingCell, handleCellEdit, handleCellSave, handleCellCancel]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedRows.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedRows.size} {selectedRows.size === 1 ? 'item' : 'items'}{' '}
                selected
              </span>
              <div className="flex space-x-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkArchive}
                  className="text-blue-700 border-blue-300 hover:bg-blue-100 transition-colors"
                >
                  Archive Selected
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkDelete}
                  className="text-red-700 border-red-300 hover:bg-red-100 transition-colors"
                >
                  Delete Selected
                </Button>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedRows(new Set())}
              className="text-gray-600 hover:text-gray-800"
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {/* Spreadsheet Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="w-12 p-3">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.size === items.length && items.length > 0
                      }
                      onChange={e => handleSelectAll(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </th>
                {/* Essential columns - always visible */}
                <th className="text-left p-3 font-semibold text-gray-700 min-w-[120px]">
                  Name
                </th>
                <th className="text-left p-3 font-semibold text-gray-700 min-w-[80px] sm:table-cell hidden">
                  SKU
                </th>
                <th className="text-left p-3 font-semibold text-gray-700 min-w-[100px]">
                  Quantity
                </th>
                <th className="text-left p-3 font-semibold text-gray-700 min-w-[80px]">
                  Unit Cost
                </th>
                <th className="text-left p-3 font-semibold text-gray-700 min-w-[100px] sm:table-cell hidden">
                  Tracking Mode
                </th>
                {/* Desktop-priority columns */}
                <th className="text-left p-3 font-semibold text-gray-700 min-w-[80px] md:table-cell hidden">
                  Type
                </th>
                <th className="text-left p-3 font-semibold text-gray-700 min-w-[80px] lg:table-cell hidden">
                  Reorder Point
                </th>
                <th className="text-left p-3 font-semibold text-gray-700 min-w-[120px] xl:table-cell hidden">
                  Last Used Supplier
                </th>
                <th className="text-left p-3 font-semibold text-gray-700 min-w-[90px] xl:table-cell hidden">
                  Last Counted
                </th>
                <th className="text-left p-3 font-semibold text-gray-700 min-w-[70px] lg:table-cell hidden">
                  Status
                </th>
                <th className="w-12 p-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* New Item Row - Hidden on mobile for better UX */}
              <tr className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 hidden md:table-row">
                <td className="p-3">
                  <button className="min-w-[44px] min-h-[44px] p-2 text-green-600 hover:text-green-800 transition-colors rounded-full hover:bg-green-100 flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </button>
                </td>
                <td className="p-3">
                  <input
                    type="text"
                    placeholder="Item name"
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="text"
                    placeholder="SKU"
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-3">
                  <select className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Select type</option>
                    <option value="ingredient">Ingredient</option>
                    <option value="packaging">Packaging</option>
                    <option value="product">Product</option>
                  </select>
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-3">
                  <select className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {INVENTORY_UNITS.map(unit => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <span className="text-gray-400">$0.00</span>
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-3">
                  <span className="text-gray-400">-</span>
                </td>
                <td className="p-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="p-3">
                  <button className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors shadow-sm">
                    Save
                  </button>
                </td>
              </tr>

              {/* Data Rows */}
              {filteredItems.map(item => (
                <tr
                  key={item.itemId}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${
                    selectedRows.has(item.itemId)
                      ? 'bg-blue-50 ring-1 ring-blue-200'
                      : ''
                  }`}
                >
                  <td className="p-3">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(item.itemId)}
                        onChange={e =>
                          handleRowSelect(item.itemId, e.target.checked)
                        }
                        className="w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </td>
                  {/* Essential columns - always visible */}
                  <td className="p-3">{renderCell(item, 'name')}</td>
                  <td className="p-3 sm:table-cell hidden">
                    {renderCell(item, 'SKU')}
                  </td>
                  <td className="p-3">{renderCell(item, 'currentQuantity')}</td>
                  <td className="p-3">
                    {renderCell(item, 'weightedAverageCost')}
                  </td>
                  <td className="p-3 sm:table-cell hidden">
                    {renderCell(item, 'trackingMode')}
                  </td>
                  {/* Desktop-priority columns */}
                  <td className="p-3 md:table-cell hidden">
                    {renderCell(item, 'type')}
                  </td>
                  <td className="p-3 lg:table-cell hidden">
                    {renderCell(item, 'reorderPoint')}
                  </td>
                  <td className="p-3 xl:table-cell hidden">
                    <div className="text-sm">
                      {item.lastUsedSupplier ? (
                        <span className="text-gray-900">
                          {item.lastUsedSupplier}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">
                          No purchases yet
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 xl:table-cell hidden">
                    {renderCell(item, 'lastCountedDate')}
                  </td>
                  <td className="p-3 lg:table-cell hidden">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.isArchived
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {item.isArchived ? 'Archived' : 'Active'}
                    </span>
                  </td>
                  <td className="p-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="min-w-[44px] min-h-[44px] p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors flex items-center justify-center">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem
                          onClick={() => handleQuickReorder(item.itemId)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Quick Reorder
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleManualCount(item.itemId)}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Manual Count
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            console.log(
                              'View purchase history for:',
                              item.itemId
                            )
                          }
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          View Purchase History
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            console.log('Duplicate item:', item.itemId)
                          }
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Duplicate Item
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            updateItemMutation.mutate({
                              itemId: item.itemId,
                              updates: { isarchived: true },
                            })
                          }
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile UX Enhancement - Desktop-First Approach */}
        <div className="lg:hidden p-2 bg-blue-50 border-t border-blue-200 text-center">
          <span className="text-xs text-blue-700">
            💡 More details available on desktop view • Scroll horizontally for
            additional columns
          </span>
        </div>

        {/* Legend for visual indicators */}
        <div className="hidden md:block p-2 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                Negative
              </span>
              <span>= Below zero</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                Low
              </span>
              <span>= Below reorder point</span>
            </span>
            <span>💡 Click any field to edit inline</span>
          </div>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between text-sm text-gray-700 flex-wrap gap-4">
          <div className="flex items-center space-x-6">
            <span className="font-semibold">
              {filteredItems.length} of {items.length} items
              {searchQuery || typeFilter !== 'all' ? ' (filtered)' : ''}
            </span>
            <span className="text-orange-600 font-semibold">
              {
                filteredItems.filter(
                  i =>
                    i.trackingMode === 'fully_tracked' &&
                    i.currentQuantity <= (i.reorderPoint || 0)
                ).length
              }{' '}
              tracked items below reorder point
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Total value:</span>
            <span className="text-green-600 font-bold text-lg">
              $
              {filteredItems
                .reduce(
                  (sum, item) =>
                    sum + item.currentQuantity * item.weightedAverageCost,
                  0
                )
                .toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
