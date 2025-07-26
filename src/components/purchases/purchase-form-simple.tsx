'use client';

import { Button } from '@/components/ui/button';
import {
  useCreateDraftPurchase,
  useUpdateDraftPurchase,
} from '@/hooks/use-purchases';
import { useSuppliers } from '@/hooks/use-suppliers';
import { Purchase } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

// Import the extended type from the hooks file
type PurchaseWithRelations = Purchase & {
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
};

interface PurchaseFormProps {
  selectedPurchase?: PurchaseWithRelations | null;
}

export function PurchaseForm({ selectedPurchase }: PurchaseFormProps) {
  // State management
  const [formData, setFormData] = useState({
    supplierid: selectedPurchase?.supplierid || '',
    purchaseDate: selectedPurchase?.purchaseDate
      ? new Date(selectedPurchase.purchaseDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    expectedDate: selectedPurchase?.effectiveDate
      ? new Date(selectedPurchase.effectiveDate).toISOString().split('T')[0]
      : '',
    shipping: selectedPurchase?.shipping || 0,
    taxes: selectedPurchase?.taxes || 0,
    otherCosts: selectedPurchase?.otherCosts || 0,
    notes: selectedPurchase?.notes || '',
  });

  // Hooks
  const { data: suppliers = [] } = useSuppliers();
  const createDraftPurchase = useCreateDraftPurchase();
  const updateDraftPurchase = useUpdateDraftPurchase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (selectedPurchase) {
        // Update existing purchase
        await updateDraftPurchase.mutateAsync({
          purchaseId: selectedPurchase.purchaseId,
          updates: {
            ...(formData.supplierid && { supplierid: formData.supplierid }),
            ...(formData.purchaseDate && {
              purchaseDate: formData.purchaseDate,
            }),
            ...(formData.expectedDate && {
              effectiveDate: formData.expectedDate,
            }),
            shipping: formData.shipping,
            taxes: formData.taxes,
            otherCosts: formData.otherCosts,
            notes: formData.notes,
          },
        });
      } else {
        // Create new purchase - ensure required fields are present
        if (!formData.supplierid || !formData.expectedDate) {
          throw new Error('Supplier and expected date are required');
        }

        await createDraftPurchase.mutateAsync({
          supplierid: formData.supplierid,
          purchaseDate: formData.purchaseDate as string,
          effectiveDate: formData.expectedDate,
          grandTotal: formData.shipping + formData.taxes + formData.otherCosts,
          shipping: formData.shipping,
          taxes: formData.taxes,
          otherCosts: formData.otherCosts,
          ...(formData.notes && { notes: formData.notes }),
        });

        // Reset form
        setFormData({
          supplierid: '',
          purchaseDate: new Date().toISOString().split('T')[0],
          expectedDate: '',
          shipping: 0,
          taxes: 0,
          otherCosts: 0,
          notes: '',
        });
      }
    } catch (error) {
      console.error('Error saving purchase:', error);
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {selectedPurchase ? 'Edit Purchase' : 'Create New Purchase'}
        </h2>
        {selectedPurchase && (
          <p className="text-gray-600 mt-1">
            Created{' '}
            {formatDistanceToNow(new Date(selectedPurchase.created_at), {
              addSuffix: true,
            })}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Purchase Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Purchase Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="supplier"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Supplier *
              </label>
              <select
                id="supplier"
                required
                value={formData.supplierid}
                onChange={e =>
                  setFormData(prev => ({ ...prev, supplierid: e.target.value }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select a supplier</option>
                {suppliers.map(supplier => (
                  <option key={supplier.supplierid} value={supplier.supplierid}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="purchaseDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Purchase Date
              </label>
              <input
                type="date"
                id="purchaseDate"
                value={formData.purchaseDate}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    purchaseDate: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="expectedDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Expected Delivery Date *
              </label>
              <input
                type="date"
                id="expectedDate"
                required
                value={formData.expectedDate}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    expectedDate: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Additional Costs */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Additional Costs
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="shipping"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Shipping Cost
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                id="shipping"
                value={formData.shipping}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    shipping: Number(e.target.value),
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="taxes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tax Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                id="taxes"
                value={formData.taxes}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    taxes: Number(e.target.value),
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="otherCosts"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Other Costs
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                id="otherCosts"
                value={formData.otherCosts}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    otherCosts: Number(e.target.value),
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Purchase Notes
            </label>
            <textarea
              id="notes"
              rows={4}
              value={formData.notes}
              onChange={e =>
                setFormData(prev => ({ ...prev, notes: e.target.value }))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              placeholder="Add any notes about this purchase..."
            />
          </div>
        </div>

        {/* Line Items Placeholder */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Line Items</h3>
          <div className="text-center py-12 text-gray-500">
            <p>Line items management coming soon...</p>
            <p className="text-sm mt-1">
              You&apos;ll be able to add items to this purchase order here.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="submit"
            disabled={
              createDraftPurchase.isPending || updateDraftPurchase.isPending
            }
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {createDraftPurchase.isPending || updateDraftPurchase.isPending
              ? 'Saving...'
              : selectedPurchase
                ? 'Update Purchase'
                : 'Create Purchase'}
          </Button>
        </div>
      </form>
    </div>
  );
}
