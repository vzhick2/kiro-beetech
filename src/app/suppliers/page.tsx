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

      {/* Main content with subtle background */}
      <div className="bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <ErrorBoundary>
            <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm shadow-gray-900/[0.04] overflow-hidden">
              <ModernDataTable />
            </div>
          </ErrorBoundary>
        </div>
      </div>
      
      {/* Bottom padding for floating controls */}
      <div className="h-24" />
    </div>
  );
}
