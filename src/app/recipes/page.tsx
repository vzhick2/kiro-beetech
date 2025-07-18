import { AppLayout } from '@/components/layout/app-layout'

export default function RecipesPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Recipes</h1>
          <p className="text-gray-600">
            Manage your production recipes
          </p>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-gray-600">Recipe management will be implemented here.</p>
        </div>
      </div>
    </AppLayout>
  )
}