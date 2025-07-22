'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { getItemDetails } from '@/app/actions/items';
import { Item, Transaction, TrackingMode } from '@/types';

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string | null;
}

interface ItemDetails {
  item: Item;
  transactions: Transaction[];
}

export function ItemDetailModal({
  isOpen,
  onClose,
  itemId,
}: ItemDetailModalProps) {
  const [details, setDetails] = useState<ItemDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadItemDetails = async (id: string) => {
    setIsLoading(true);
    try {
      const result = await getItemDetails(id);

      if (result.success && result.data) {
        // Transform database response to match TypeScript interfaces
        const transformedData: ItemDetails = {
          item: {
            itemId: result.data.item.itemid,
            name: result.data.item.name,
            SKU: result.data.item.sku,
            type: result.data.item.type,
            inventoryUnit: result.data.item.inventoryunit,
            currentQuantity: result.data.item.currentquantity || 0,
            weightedAverageCost: result.data.item.weightedaveragecost || 0,
            reorderPoint: result.data.item.reorderpoint || 0,
            lastCountedDate: result.data.item.lastcounteddate
              ? new Date(result.data.item.lastcounteddate)
              : new Date(),
            primarySupplierId: result.data.item.primarysupplierid || '',
            leadTimeDays: result.data.item.leadtimedays || 7,
            trackingMode: (result.data.item.tracking_mode || 'fully_tracked') as TrackingMode,
            isArchived: result.data.item.isarchived || false,
            created_at: new Date(result.data.item.created_at || Date.now()),
            updated_at: new Date(result.data.item.updated_at || Date.now()),
          },
          transactions: result.data.transactions.map(tx => ({
            transactionId: tx.transactionid,
            itemId: tx.itemid,
            transactionType: tx.transactiontype,
            quantity: tx.quantity,
            unitCost: tx.unitcost || 0,
            referenceId: tx.referenceid || '',
            referenceType: tx.referencetype || '',
            effectiveDate: new Date(tx.effectivedate),
            notes: tx.notes || '',
            created_at: new Date(tx.created_at || Date.now()),
          })),
        };
        setDetails(transformedData);
      }
    } catch (error) {
      console.error('Failed to load item details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && itemId) {
      loadItemDetails(itemId);
    }
  }, [isOpen, itemId]);

  if (!details) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Item Details</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            {isLoading ? (
              <div className="text-muted-foreground">Loading...</div>
            ) : (
              <div className="text-muted-foreground">No item selected</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{details.item.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Item Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                SKU
              </label>
              <p className="text-sm">{details.item.SKU}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Type
              </label>
              <Badge variant="secondary" className="mt-1">
                {details.item.type}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Current Quantity
              </label>
              <p className="text-sm">
                {details.item.currentQuantity} {details.item.inventoryUnit}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Reorder Point
              </label>
              <p className="text-sm">
                {details.item.reorderPoint || 'Not set'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Lead Time
              </label>
              <p className="text-sm">{details.item.leadTimeDays} days</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Primary Supplier
              </label>
              <p className="text-sm">
                {details.item.primarySupplierId || 'Not set'}
              </p>
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Recent Transactions</h3>
            {details.transactions.length > 0 ? (
              <div className="space-y-2">
                {details.transactions.slice(0, 10).map(transaction => (
                  <div
                    key={transaction.transactionId}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {transaction.transactionType}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-medium ${
                          transaction.transactionType === 'purchase'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.transactionType === 'purchase' ? '+' : '-'}
                        {transaction.quantity} {details.item.inventoryUnit}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.referenceId || 'No reference'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No transactions found</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
