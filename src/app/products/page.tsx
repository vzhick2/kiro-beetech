import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Plus, Package, Search, Filter } from 'lucide-react'
import { createProduct, updateInventoryAction, deleteProductAction } from '@/app/actions/products'

export default function ProductsPage() {
  // Mock products data
  const products = [
    { id: '1', name: 'Chocolate Chip Cookies', price: 12.99, category: 'Cookies', stock: 150 },
    { id: '2', name: 'Vanilla Cupcakes', price: 8.99, category: 'Cupcakes', stock: 75 },
    { id: '3', name: 'Artisan Sourdough', price: 6.50, category: 'Bread', stock: 25 },
    { id: '4', name: 'Blueberry Muffins', price: 4.99, category: 'Muffins', stock: 90 },
  ]

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your inventory and product catalog</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.stock > 0).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.stock < 50).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.stock === 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
                <span className="text-lg font-bold text-blue-600">${product.price}</span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">Stock Level</p>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      product.stock > 50 ? 'bg-green-500' : 
                      product.stock > 10 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="font-medium">{product.stock} units</span>
                  </div>
                </div>
              </div>

              {/* Server Actions Demo */}
              <div className="flex gap-2">
                <form action={updateInventoryAction}>
                  <input type="hidden" name="productId" value={product.id} />
                  <input type="hidden" name="quantity" value={product.stock + 10} />
                  <Button type="submit" size="sm" variant="outline">
                    +10 Stock
                  </Button>
                </form>
                <form action={deleteProductAction}>
                  <input type="hidden" name="productId" value={product.id} />
                  <Button type="submit" size="sm" variant="outline" className="text-red-600">
                    Delete
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>

        {/* Add Product Form */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          <form action={createProduct} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="Cookies">Cookies</option>
                <option value="Cupcakes">Cupcakes</option>
                <option value="Bread">Bread</option>
                <option value="Muffins">Muffins</option>
                <option value="Pastries">Pastries</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}
