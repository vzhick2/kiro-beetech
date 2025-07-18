import { AppLayout } from '@/components/layout/app-layout'

export default function PurchasesPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <p className="text-muted-foreground">
            Manage your purchase orders and invoices
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <p className="text-muted-foreground">Purchase management will be implemented here.</p>
        </div>
      </div>
    </AppLayout>
  )
}