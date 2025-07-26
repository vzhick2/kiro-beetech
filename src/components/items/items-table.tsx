'use client';

import { useState, useEffect } from 'react';
import { InlineQuantityEditor } from './inline-quantity-editor';
import { ItemActionsDropdown } from './item-actions-dropdown';
import { ItemDetailModal } from './item-detail-modal';
import { getItems } from '@/app/actions/items';
import { Item, TrackingMode } from '@/types';

interface ItemsTableProps {
  onItemAdded?: () => void;
}

export function ItemsTable({ onItemAdded }: ItemsTableProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const result = await getItems();

      if (result.success && result.data) {
        // Transform database response to match TypeScript interfaces
        const transformedItems: Item[] = result.data.map((item: any) => ({
          itemId: item.itemid,
          name: item.name,
          SKU: item.sku,
          type: item.type,
          inventoryUnit: item.inventoryunit,
          currentQuantity: item.currentquantity || 0,
          weightedAverageCost: item.weightedaveragecost || 0,
          reorderPoint: item.reorderpoint || undefined,
          lastCountedDate: item.lastcounteddate
            ? new Date(item.lastcounteddate)
            : new Date(),
          primarysupplierid: item.primarysupplierid || undefined,
          leadTimeDays: item.leadtimedays || 7,
          trackingMode: (item.tracking_mode || 'fully_tracked') as TrackingMode,
          isarchived: item.isarchived || false,
          created_at: new Date(item.created_at || Date.now()),
          updated_at: new Date(item.updated_at || Date.now()),
          lastUsedSupplier: item.lastUsedSupplier,
        }));
        setItems(transformedItems);
      }
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleItemAdded = () => {
    loadItems();
    onItemAdded?.();
  };

  const handleQuantityUpdate = (itemId: string, newQuantity: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.itemId === itemId
          ? { ...item, currentQuantity: newQuantity }
          : item
      )
    );
  };

  const createQuantityUpdateHandler = (itemId: string) => {
    return (newQuantity: number) => {
      handleQuantityUpdate(itemId, newQuantity);
    };
  };

  const handleEditItem = (itemId: string) => {
    // TODO: Implement edit modal
    console.log('Edit item:', itemId);
  };

  const handleQuickReorder = (itemId: string) => {
    // TODO: Implement quick reorder
    console.log('Quick reorder:', itemId);
  };

  const handleManualCount = (itemId: string) => {
    // TODO: Implement manual count
    console.log('Manual count:', itemId);
  };

  const handleViewDetails = (itemId: string) => {
    setSelectedItemId(itemId);
    setIsDetailModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No items found</p>
        <p className="text-sm text-gray-400 mt-2">
          Add your first item to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left p-3 font-medium text-gray-700">Name</th>
              <th className="text-left p-3 font-medium text-gray-700">SKU</th>
              <th className="text-left p-3 font-medium text-gray-700">Type</th>
              <th className="text-left p-3 font-medium text-gray-700">
                Quantity
              </th>
              <th className="text-left p-3 font-medium text-gray-700">
                Unit Cost
              </th>
              <th className="text-left p-3 font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.itemId} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <button
                      onClick={() => handleViewDetails(item.itemId)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View details
                    </button>
                  </div>
                </td>
                <td className="p-3 text-gray-600">{item.SKU}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === 'ingredient'
                        ? 'bg-green-100 text-green-800'
                        : item.type === 'packaging'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {item.type}
                  </span>
                </td>
                <td className="p-3">
                  <InlineQuantityEditor
                    itemId={item.itemId}
                    currentQuantity={item.currentQuantity}
                    unit={item.inventoryUnit}
                    onQuantityUpdated={createQuantityUpdateHandler(item.itemId)}
                  />
                </td>
                <td className="p-3 text-gray-600">
                  ${item.weightedAverageCost.toFixed(2)}
                </td>
                <td className="p-3">
                  <ItemActionsDropdown
                    item={item}
                    onEdit={() => handleEditItem(item.itemId)}
                    onQuickReorder={() => handleQuickReorder(item.itemId)}
                    onManualCount={() => handleManualCount(item.itemId)}
                    onItemArchived={handleItemAdded}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ItemDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        itemId={selectedItemId}
      />
    </>
  );
}
