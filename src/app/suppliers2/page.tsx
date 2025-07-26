'use client';

import { ErrorBoundary } from '@/components/suppliers/error-boundary';
import { ModernDataTable } from '@/components/suppliers/working-data-table';

export default function Suppliers2Page() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Suppliers (Alternative View)</h1>
        <p className="text-gray-600 mt-1">
          Alternative suppliers table implementation with different features and layout.
        </p>
      </div>
      
      <ErrorBoundary>
        <ModernDataTable />
      </ErrorBoundary>
    </div>
  );
}