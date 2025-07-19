export default function Home() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">🍯 Honeybee Cosmetics Dashboard</h1>
        <p className="text-gray-600">
          Welcome to your artisan cosmetics inventory management system
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg border border-amber-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-amber-700 mb-2">Active Ingredients</h3>
          <p className="text-2xl font-bold text-amber-900">247</p>
          <p className="text-sm text-amber-600 mt-1">+8% from last month</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg border border-red-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-red-700 mb-2">Low Stock Items</h3>
          <p className="text-2xl font-bold text-red-900">12</p>
          <p className="text-sm text-red-600 mt-1">Needs reordering</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-blue-700 mb-2">Products Crafted</h3>
          <p className="text-2xl font-bold text-blue-900">89</p>
          <p className="text-sm text-blue-600 mt-1">This month</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-green-700 mb-2">Packaging Ready</h3>
          <p className="text-2xl font-bold text-green-900">156</p>
          <p className="text-sm text-green-600 mt-1">Units available</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <select className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white text-gray-600">
              <option>Recent</option>
              <option>Today</option>
              <option>This Week</option>
            </select>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-amber-600 font-semibold text-sm">H</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">New honey shipment received</span>
                </p>
                <p className="text-sm text-gray-500">
                  Manuka Honey UMF 15+: 50 lbs from New Zealand Naturals
                </p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">B</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Batch production completed</span>
                </p>
                <p className="text-sm text-gray-500">
                  Lavender Honey Face Cream: 48 units (2oz jars)
                </p>
                <p className="text-xs text-gray-400 mt-1">4 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-semibold text-sm">!</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Low stock alert</span>
                </p>
                <p className="text-sm text-gray-500">
                  Royal Jelly (Fresh): Only 12 oz remaining
                </p>
                <p className="text-xs text-gray-400 mt-1">6 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">P</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">New packaging order placed</span>
                </p>
                <p className="text-sm text-gray-500">
                  Amber Glass Jars (2oz): 1,000 units from Artisan Containers
                </p>
                <p className="text-xs text-gray-400 mt-1">1 day ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold text-sm">O</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Essential oil delivery</span>
                </p>
                <p className="text-sm text-gray-500">
                  Lavender Essential Oil: 32 fl oz from Mountain Essentials
                </p>
                <p className="text-xs text-gray-400 mt-1">2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}