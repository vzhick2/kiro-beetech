import { AppLayout } from '@/components/layout/app-layout'

export default function SalesPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <p className="text-muted-foreground">
            Track sales and inventory deductions
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <p className="text-muted-foreground">Sales tracking will be implemented here.</p>
        </div>
      </div>
    </AppLayout>
  )
}