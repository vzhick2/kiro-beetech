import { AppLayout } from '@/components/layout/app-layout'

export default function Home() {
  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome to your inventory management system
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Items</h3>
            <p className="text-2xl font-bold text-gray-900">847</p>
            <p className="text-sm text-green-600 mt-1">+12% from last month</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Low Stock</h3>
            <p className="text-2xl font-bold text-gray-900">23</p>
            <p className="text-sm text-red-600 mt-1">Needs attention</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Purchases</h3>
            <p className="text-2xl font-bold text-gray-900">156</p>
            <p className="text-sm text-blue-600 mt-1">This month</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Batches Produced</h3>
            <p className="text-2xl font-bold text-gray-900">89</p>
            <p className="text-sm text-blue-600 mt-1">This month</p>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <select className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white">
                <option>Recent</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            <div className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-900">New Purchase</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">PO-20250718-001 - Acme Supplies</p>
                  <p className="text-xs text-gray-500 mt-1">Jul 18, 2025, 12:34 PM</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">$1,245.00</p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-900">Batch Completed</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">BATCH-20250718-001 - Chocolate Chip Cookies</p>
                  <p className="text-xs text-gray-500 mt-1">Jul 18, 2025, 10:15 AM</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">48 units</p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-900">Low Stock Alert</span>
                  </div>
                  <p className="text-sm text-orange-600 mt-1">SKU-001 - Organic Flour</p>
                  <p className="text-xs text-gray-500 mt-1">Jul 17, 2025, 6:30 PM</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">5 lbs remaining</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}