'use client';

import { useState } from 'react';
import { getSuppliers } from '@/app/actions/suppliers';

export default function SuppliersDebugPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testConnection = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await getSuppliers();
      setResult(response);

      if (!response.success) {
        setError(response.error || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-yellow-900 mb-2">
          Suppliers Database Debug
        </h2>
        <p className="text-yellow-700 mb-4">
          This page tests the direct database connection to see what&apos;s in
          the suppliers table.
        </p>

        <button
          onClick={testConnection}
          disabled={isLoading}
          className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-300 text-white px-4 py-2 rounded-md"
        >
          {isLoading ? 'Testing Connection...' : 'Test Database Connection'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            Database Response
          </h3>

          <div className="mb-4">
            <h4 className="font-medium text-green-800">Success:</h4>
            <p className="text-green-700">{result.success ? 'Yes' : 'No'}</p>
          </div>

          {result.success && result.data && (
            <div className="mb-4">
              <h4 className="font-medium text-green-800">Suppliers Count:</h4>
              <p className="text-green-700">
                {Array.isArray(result.data)
                  ? result.data.length
                  : 'Not an array'}
              </p>
            </div>
          )}

          {result.data &&
            Array.isArray(result.data) &&
            result.data.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-green-800">First Supplier:</h4>
                <pre className="bg-white p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(result.data[0], null, 2)}
                </pre>
              </div>
            )}

          <div className="mb-4">
            <h4 className="font-medium text-green-800">Full Response:</h4>
            <pre className="bg-white p-2 rounded text-sm overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Environment Check
        </h3>
        <div className="space-y-2 text-sm">
          <p>
            <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>{' '}
            {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing'}
          </p>
          <p>
            <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>{' '}
            {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}
          </p>
          <p>
            <strong>SUPABASE_SERVICE_ROLE_KEY:</strong>{' '}
            {process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing'}
          </p>
        </div>
      </div>
    </div>
  );
}
