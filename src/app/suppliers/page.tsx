'use client';

import { ModernDataTable } from '@/components/suppliers/modern-data-table';
import { ErrorBoundary } from '@/components/error-boundary';

export default function SuppliersPage() {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Clean, minimal header */}
      <div className="px-6 py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Suppliers
          </h1>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Manage your supplier relationships and contact information
          </p>
        </div>
      </div>

      {/* Main content with full-width table */}
      <div className="bg-gray-50/30">
        <div className="max-w-7xl mx-auto">
          <ErrorBoundary>
            <ModernDataTable />
          </ErrorBoundary>
        </div>
      </div>
      
      {/* Bottom padding for floating controls */}
      <div className="h-24" />
    </div>
  );
}
