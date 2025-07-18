import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Search } from 'lucide-react'
import Link from 'next/link'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

// This now works with Next.js 15's enhanced search functionality
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query = '' } = await searchParams
  
  // Mock search results
  const searchResults = query ? [
    { id: 1, type: 'product', name: 'Chocolate Chip Cookies', sku: 'CC-001', stock: 150 },
    { id: 2, type: 'order', name: 'Order #2025-001', customer: 'Sweet Treats Bakery', date: '2025-07-18' },
    { id: 3, type: 'customer', name: 'Sweet Treats Bakery', email: 'orders@sweettreatsbakery.com', orders: 12 },
  ].filter(item => item.name.toLowerCase().includes(query.toLowerCase())) : []

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
            {query && (
              <p className="text-gray-600">
                {searchResults.length} results for &ldquo;{query}&rdquo;
              </p>
            )}
          </div>
        </div>

        {/* Search Form */}
        <div className="mb-8">
          <form action="/search" method="GET" className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search products, orders, customers"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </form>
        </div>

        {/* Results */}
        {query ? (
          <div className="space-y-4">
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <div key={result.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {result.type}
                        </span>
                        <h3 className="font-semibold text-gray-900">{result.name}</h3>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        {result.type === 'product' && (
                          <div>
                            <p>SKU: {result.sku}</p>
                            <p>Stock: {result.stock} units</p>
                          </div>
                        )}
                        {result.type === 'order' && (
                          <div>
                            <p>Customer: {result.customer}</p>
                            <p>Date: {result.date}</p>
                          </div>
                        )}
                        {result.type === 'customer' && (
                          <div>
                            <p>Email: {result.email}</p>
                            <p>Orders: {result.orders}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No results found for &ldquo;{query}&rdquo;</p>
                <p className="text-sm">Try searching for products, orders, or customers</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Start typing to search for products, orders, or customers</p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
