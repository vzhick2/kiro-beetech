export default function DataPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Data Management</h1>
        <p className="text-gray-600">
          Import, export, and manage your inventory data
        </p>
      </div>

      {/* Import/Export Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Import Data</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Import Items from CSV
              </label>
              <input
                type="file"
                accept=".csv"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Import Purchases from Bank CSV
              </label>
              <input
                type="file"
                accept=".csv"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
              Import Data
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h2>
          <div className="space-y-4">
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
              Export Items to CSV
            </button>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
              Export Purchases to CSV
            </button>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
              Export Sales to CSV
            </button>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
              Export Full Backup
            </button>
          </div>
        </div>
      </div>

      {/* Database Tools */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Database Tools</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <button className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors">
            Backup Database
          </button>
          <button className="bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors">
            Restore Database
          </button>
          <button className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
            Reset Database
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Data Operations</h2>
        <div className="text-gray-500 text-center py-8">
          No recent data operations
        </div>
      </div>
    </div>
  )
} 