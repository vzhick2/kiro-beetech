'use client';

import {
  usePurchases,
  useDeleteDraftPurchase,
  useFinalizeDraftPurchase,
} from '@/hooks/use-purchases';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Trash2, Check, DollarSign, Calendar } from 'lucide-react';
import { useState } from 'react';
import { Purchase } from '@/types';

// Extended Purchase type for UI with relationships
interface PurchaseWithRelations extends Purchase {
  supplier?: { name: string };
  lineItems: Array<{
    lineItemId: string;
    purchaseId: string;
    itemId: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
    notes?: string;
    item?: { name: string; sku: string };
  }>;
}

interface PurchasesListProps {
  selectedPurchaseId: string | null;
  onSelectPurchase: (purchaseId: string) => void;
}

export function PurchasesList({
  selectedPurchaseId,
  onSelectPurchase,
}: PurchasesListProps) {
  const { data: purchases, isLoading, error } = usePurchases(true); // drafts only
  const deleteQuery = useDeleteDraftPurchase();
  const finalizeQuery = useFinalizeDraftPurchase();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (purchaseId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent selection

    if (confirm('Are you sure you want to delete this draft purchase?')) {
      setDeletingId(purchaseId);
      try {
        await deleteQuery.mutateAsync(purchaseId);
      } catch (error) {
        console.error('Failed to delete purchase:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleFinalize = async (
    purchaseId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation(); // Prevent selection

    if (
      confirm(
        'Are you sure you want to finalize this purchase? This action cannot be undone.'
      )
    ) {
      try {
        await finalizeQuery.mutateAsync(purchaseId);
      } catch (error) {
        console.error('Failed to finalize purchase:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 text-sm">Failed to load draft purchases</p>
      </div>
    );
  }

  if (!purchases || purchases.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <div className="text-gray-500">
          <DollarSign className="w-8 h-8 mx-auto mb-3 text-gray-300" />
          <h3 className="font-medium text-gray-700 mb-1">No Draft Purchases</h3>
          <p className="text-sm text-gray-500">
            Create your first purchase to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {purchases.map((purchase: PurchaseWithRelations) => {
        const isSelected = selectedPurchaseId === purchase.purchaseId;
        const lineItemCount = purchase.lineItems?.length || 0;

        return (
          <div
            key={purchase.purchaseId}
            onClick={() => onSelectPurchase(purchase.purchaseId)}
            className={`bg-white rounded-lg border p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
              isSelected
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium text-gray-900 truncate">
                    {purchase.displayId}
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Draft
                  </span>
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Supplier:</span>
                    <span className="truncate">
                      {purchase.supplier?.name || 'No supplier'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span>${purchase.total.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(purchase.purchaseDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    {lineItemCount} line item{lineItemCount !== 1 ? 's' : ''} •
                    Created{' '}
                    {formatDistanceToNow(new Date(purchase.created_at), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 ml-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={e => handleFinalize(purchase.purchaseId, e)}
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                  title="Finalize Purchase"
                >
                  <Check className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={e => handleDelete(purchase.purchaseId, e)}
                  disabled={deletingId === purchase.purchaseId}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Delete Draft"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
