import { ModernDataTable } from "@/components/suppliers/modern-data-table"
import { ErrorBoundary } from "@/components/error-boundary"

export default function SuppliersPage() {
  return (
    <div className="w-full pb-24">
      <div className="px-4 py-6 bg-gray-50 border-b">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Supplier Management</h1>
        <p className="text-gray-600">
          Manage your suppliers with inline editing, keyboard navigation, and bulk operations.
        </p>
      </div>

      <ErrorBoundary>
        <ModernDataTable />
      </ErrorBoundary>
    </div>
  )
}
