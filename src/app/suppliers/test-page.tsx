'use client';

import { useState } from 'react';
import { seedSuppliersOnly } from '@/app/actions/seed-data';
import { SuppliersAgGrid } from '@/components/suppliers/suppliers-ag-grid';

export default function SuppliersTestPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string>('');

  const handleSeedSuppliers = async () => {
    setIsSeeding(true);
    try {
      const result = await seedSuppliersOnly();
      setSeedResult(
        result.success
          ? result.message || 'Success'
          : result.error || 'Unknown error'
      );
    } catch (error) {
      setSeedResult(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">
          Suppliers Test Page
        </h2>
        <p className="text-blue-700 mb-4">
          This page helps debug the suppliers AG Grid. Use the button below to
          add test suppliers.
        </p>

        <button
          onClick={handleSeedSuppliers}
          disabled={isSeeding}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-md"
        >
          {isSeeding ? 'Adding Suppliers...' : 'Add Test Suppliers'}
        </button>

        {seedResult && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <p className="text-sm">{seedResult}</p>
          </div>
        )}
      </div>

      <div className="border rounded-lg">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="text-lg font-medium">Suppliers Grid</h3>
          <p className="text-sm text-gray-600">
            Check the console for debug information
          </p>
        </div>
        <div className="h-[600px]">
          <SuppliersAgGrid />
        </div>
      </div>
    </div>
  );
}
