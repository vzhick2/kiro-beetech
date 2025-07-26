'use client';

import { CleanSupplierTable } from '@/components/suppliers3/clean-supplier-table';
import { ErrorBoundary } from '@/components/error-boundary';

export default function Suppliers3Page() {
  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Clean, minimal header */}
      <div className="bg-white border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Suppliers
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your supplier relationships
              </p>
            </div>
            <div className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
              Clean Design
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto p-6">
        <ErrorBoundary>
          <CleanSupplierTable />
        </ErrorBoundary>
      </div>
    </div>
  );
}
