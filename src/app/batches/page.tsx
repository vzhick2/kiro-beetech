import { AppLayout } from '@/components/layout/app-layout'

export default function BatchesPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Batches</h1>
          <p className="text-gray-600">
            Log and track production batches
          </p>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-gray-600">Batch logging will be implemented here.</p>
        </div>
      </div>
    </AppLayout>
  )
}