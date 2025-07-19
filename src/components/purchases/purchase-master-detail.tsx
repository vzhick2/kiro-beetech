'use client';

import { useState } from 'react';
import { usePurchases } from '@/hooks/use-purchases';
import { PurchasesList } from './purchases-list';
import { PurchaseForm } from './purchase-form-simple';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function PurchaseMasterDetail() {
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Get purchases data to find the selected purchase
  const { data: purchases = [] } = usePurchases(true); // drafts only
  const selectedPurchase = selectedPurchaseId 
    ? purchases.find(p => p.purchaseId === selectedPurchaseId) 
    : null;

  const handleSelectPurchase = (purchaseId: string) => {
    setSelectedPurchaseId(purchaseId);
    setIsCreatingNew(false);
  };

  const handleCreateNew = () => {
    setSelectedPurchaseId(null);
    setIsCreatingNew(true);
  };

  const handleFormClose = () => {
    setSelectedPurchaseId(null);
    setIsCreatingNew(false);
  };

  const handleFormSave = () => {
    // Form will trigger refresh of purchases list
    setIsCreatingNew(false);
    // Keep the form open for the newly created purchase if needed
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      {/* Left Panel - Purchases List (Mobile: full width, Desktop: 40%) */}
      <div className="lg:w-2/5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Draft Purchases</h2>
          <Button
            onClick={handleCreateNew}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Purchase
          </Button>
        </div>
        
        <PurchasesList
          selectedPurchaseId={selectedPurchaseId}
          onSelectPurchase={handleSelectPurchase}
        />
      </div>

      {/* Right Panel - Purchase Form (Mobile: full width, Desktop: 60%) */}
      <div className="lg:w-3/5">
        {(selectedPurchase || isCreatingNew) ? (
          <PurchaseForm
            selectedPurchase={isCreatingNew ? null : (selectedPurchase || null)}
          />
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="text-gray-500">
              <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No Purchase Selected
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Select a draft purchase from the list or create a new one to get started
              </p>
              <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create New Purchase
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
