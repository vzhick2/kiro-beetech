'use client';

import { useEffect, useState } from 'react';
import { getSuppliers } from '@/app/actions/suppliers';
import { getItems } from '@/app/actions/items';

export default function DebugPage() {
  const [suppliersData, setSuppliersData] = useState<any>(null);
  const [itemsData, setItemsData] = useState<any>(null);
  const [suppliersError, setSuppliersError] = useState<string | null>(null);
  const [itemsError, setItemsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testActions() {
      try {
        console.log('Testing suppliers action...');
        const suppliersResult = await getSuppliers();
        console.log('Suppliers result:', suppliersResult);
        
        if (suppliersResult.success) {
          setSuppliersData(suppliersResult.data);
        } else {
          setSuppliersError(suppliersResult.error);
        }

        console.log('Testing items action...');
        const itemsResult = await getItems();
        console.log('Items result:', itemsResult);
        
        if (itemsResult.success) {
          setItemsData(itemsResult.data);
        } else {
          setItemsError(itemsResult.error);
        }
      } catch (err) {
        console.error('Debug test error:', err);
        setSuppliersError(err instanceof Error ? err.message : 'Unknown error');
        setItemsError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    testActions();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Debug Data Fetching</h1>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Data Fetching</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Suppliers</h2>
          {suppliersError ? (
            <div className="text-red-600">
              <strong>Error:</strong> {suppliersError}
            </div>
          ) : (
            <div>
              <div className="mb-2">
                <strong>Count:</strong> {suppliersData?.length || 0}
              </div>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(suppliersData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Items</h2>
          {itemsError ? (
            <div className="text-red-600">
              <strong>Error:</strong> {itemsError}
            </div>
          ) : (
            <div>
              <div className="mb-2">
                <strong>Count:</strong> {itemsData?.length || 0}
              </div>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(itemsData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}