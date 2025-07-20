'use client';

import { useEffect, useState } from 'react';
import { useSuppliers } from '@/hooks/use-suppliers';
import { useItems } from '@/hooks/use-items';
import { useDashboardStats } from '@/hooks/use-dashboard';
import { getSuppliers } from '@/app/actions/suppliers';
import { getItems } from '@/app/actions/items';
import { supabase } from '@/lib/supabase';

export default function TestDataPage() {
  const [manualTest, setManualTest] = useState<any>(null);
  const [supabaseTest, setSuppabaseTest] = useState<any>(null);
  const [actionsTest, setActionsTest] = useState<any>(null);
  const [connectionTest, setConnectionTest] = useState<any>(null);

  // Test React Query hooks
  const suppliersQuery = useSuppliers();
  const itemsQuery = useItems();
  const statsQuery = useDashboardStats();

  useEffect(() => {
    // Test direct Supabase connection
    async function testSupabaseConnection() {
      try {
        const { data, error } = await supabase
          .from('suppliers')
          .select('*')
          .limit(3);
        
        setSuppabaseTest({ 
          success: !error, 
          data: data?.length, 
          error: error?.message,
          sample: data?.[0]
        });
      } catch (err) {
        setSuppabaseTest({ 
          success: false, 
          error: err instanceof Error ? err.message : 'Unknown error' 
        });
      }
    }

    // Test server actions
    async function testServerActions() {
      try {
        const [suppliersResult, itemsResult] = await Promise.all([
          getSuppliers(),
          getItems()
        ]);
        
        setActionsTest({
          suppliers: {
            success: suppliersResult.success,
            count: suppliersResult.data?.length || 0,
            error: suppliersResult.error,
            sample: suppliersResult.data?.[0]
          },
          items: {
            success: itemsResult.success,
            count: itemsResult.data?.length || 0,
            error: itemsResult.error,
            sample: itemsResult.data?.[0]
          }
        });
      } catch (err) {
        setActionsTest({ 
          error: err instanceof Error ? err.message : 'Unknown error' 
        });
      }
    }

    // Test environment variables
    setConnectionTest({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      anonKeyPrefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...'
    });

    // Test manual SQL query
    async function testManualQuery() {
      try {
        const { data, error } = await supabase.rpc('get_cycle_count_alerts', { limit_count: 5 });
        setManualTest({
          success: !error,
          alerts: data?.length || 0,
          error: error?.message
        });
      } catch (err) {
        setManualTest({
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    }

    testSupabaseConnection();
    testServerActions();
    testManualQuery();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">🔍 Data Connectivity Test</h1>
      
      {/* Environment Variables */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🔧 Environment Configuration</h2>
        <div className="space-y-2 text-sm">
          <div><strong>Supabase URL:</strong> {connectionTest?.supabaseUrl}</div>
          <div><strong>Anon Key Available:</strong> {connectionTest?.hasAnonKey ? '✅ Yes' : '❌ No'}</div>
          <div><strong>Anon Key Preview:</strong> {connectionTest?.anonKeyPrefix}</div>
        </div>
      </div>

      {/* Direct Supabase Test */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🔗 Direct Supabase Connection</h2>
        {supabaseTest ? (
          <div className="space-y-2">
            <div><strong>Status:</strong> {supabaseTest.success ? '✅ Connected' : '❌ Failed'}</div>
            <div><strong>Suppliers Found:</strong> {supabaseTest.data || 0}</div>
            {supabaseTest.error && <div className="text-red-600"><strong>Error:</strong> {supabaseTest.error}</div>}
            {supabaseTest.sample && (
              <details className="mt-4">
                <summary className="cursor-pointer font-medium">Sample Supplier Data</summary>
                <pre className="bg-gray-100 p-2 mt-2 rounded text-xs overflow-auto">
                  {JSON.stringify(supabaseTest.sample, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ) : (
          <div>Testing...</div>
        )}
      </div>

      {/* Server Actions Test */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">⚡ Server Actions Test</h2>
        {actionsTest ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Suppliers Action:</h3>
              <div><strong>Status:</strong> {actionsTest.suppliers?.success ? '✅ Success' : '❌ Failed'}</div>
              <div><strong>Count:</strong> {actionsTest.suppliers?.count || 0}</div>
              {actionsTest.suppliers?.error && (
                <div className="text-red-600"><strong>Error:</strong> {actionsTest.suppliers.error}</div>
              )}
            </div>
            <div>
              <h3 className="font-medium">Items Action:</h3>
              <div><strong>Status:</strong> {actionsTest.items?.success ? '✅ Success' : '❌ Failed'}</div>
              <div><strong>Count:</strong> {actionsTest.items?.count || 0}</div>
              {actionsTest.items?.error && (
                <div className="text-red-600"><strong>Error:</strong> {actionsTest.items.error}</div>
              )}
            </div>
          </div>
        ) : (
          <div>Testing...</div>
        )}
      </div>

      {/* React Query Hooks Test */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🪝 React Query Hooks</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Suppliers Hook:</h3>
            <div><strong>Loading:</strong> {suppliersQuery.isLoading ? '⏳ Yes' : '✅ No'}</div>
            <div><strong>Error:</strong> {suppliersQuery.error ? '❌ ' + suppliersQuery.error.message : '✅ None'}</div>
            <div><strong>Data Count:</strong> {suppliersQuery.data?.length || 0}</div>
          </div>
          <div>
            <h3 className="font-medium">Items Hook:</h3>
            <div><strong>Loading:</strong> {itemsQuery.isLoading ? '⏳ Yes' : '✅ No'}</div>
            <div><strong>Error:</strong> {itemsQuery.error ? '❌ ' + itemsQuery.error.message : '✅ None'}</div>
            <div><strong>Data Count:</strong> {itemsQuery.data?.length || 0}</div>
          </div>
          <div>
            <h3 className="font-medium">Dashboard Stats Hook:</h3>
            <div><strong>Loading:</strong> {statsQuery.isLoading ? '⏳ Yes' : '✅ No'}</div>
            <div><strong>Error:</strong> {statsQuery.error ? '❌ ' + statsQuery.error.message : '✅ None'}</div>
            {statsQuery.data && (
              <div className="mt-2">
                <div><strong>Total Items:</strong> {statsQuery.data.totalItems}</div>
                <div><strong>Low Stock:</strong> {statsQuery.data.lowStockItems}</div>
                <div><strong>Draft Purchases:</strong> {statsQuery.data.draftPurchases}</div>
                <div><strong>Recent Transactions:</strong> {statsQuery.data.recentTransactions}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manual RPC Test */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">📊 RPC Function Test</h2>
        {manualTest ? (
          <div>
            <div><strong>Status:</strong> {manualTest.success ? '✅ Working' : '❌ Failed'}</div>
            <div><strong>Cycle Count Alerts:</strong> {manualTest.alerts || 0}</div>
            {manualTest.error && <div className="text-red-600"><strong>Error:</strong> {manualTest.error}</div>}
          </div>
        ) : (
          <div>Testing RPC functions...</div>
        )}
      </div>
    </div>
  );
}