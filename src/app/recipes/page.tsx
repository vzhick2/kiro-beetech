import { AppLayout } from '@/components/layout/app-layout'

export default function RecipesPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <p className="text-muted-foreground">
            Manage your production recipes
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <p className="text-muted-foreground">Recipe management will be implemented here.</p>
        </div>
      </div>
    </AppLayout>
  )
}