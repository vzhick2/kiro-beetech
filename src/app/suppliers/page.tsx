'use client';

import { Suspense } from 'react';
import { SuppliersAgGrid } from '@/components/suppliers/suppliers-ag-grid';

export default function SuppliersPage() {
  return (
    <div className="space-y-6 page-container">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Suppliers</h1>
      </div>

      {/* Suppliers Table */}
      <Suspense fallback={<SuppliersTableSkeleton />}>
        <SuppliersAgGrid />
      </Suspense>
    </div>
  );
}

function SuppliersTableSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
