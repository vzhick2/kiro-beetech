import { AppLayout } from '@/components/layout/app-layout'

export default function ReportsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <p className="text-muted-foreground">
            View analytics and export data
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <p className="text-muted-foreground">Reporting features will be implemented here.</p>
        </div>
      </div>
    </AppLayout>
  )
}