import { AppLayout } from '@/components/layout/app-layout'

export default function BatchesPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <p className="text-muted-foreground">
            Log and track production batches
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <p className="text-muted-foreground">Batch logging will be implemented here.</p>
        </div>
      </div>
    </AppLayout>
  )
}