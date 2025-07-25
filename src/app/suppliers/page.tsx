'use client';

import { ModernDataTable } from "@/components/suppliers/modern-data-table"
import { ErrorBoundary } from "@/components/error-boundary"

export default function SuppliersPage() {
  return (
    <div className="w-full pb-24">
      <div className="bg-gray-50 border-b">
        <div className="px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
        </div>
      </div>

      <ErrorBoundary>
        <ModernDataTable />
      </ErrorBoundary>
    </div>
  )
}
