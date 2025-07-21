/**
 * Test component to compare table solutions:
 * 1. AG Grid (existing)
 * 2. TanStack React Table
 * 3. TanStack Virtual (for large datasets)
 */

import { useState } from 'react';

// Sample data for testing
const sampleData = [
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics' },
  { id: 2, name: 'Product B', price: 49.99, category: 'Books' },
  { id: 3, name: 'Product C', price: 19.99, category: 'Clothing' },
  { id: 4, name: 'Product D', price: 99.99, category: 'Electronics' },
  { id: 5, name: 'Product E', price: 15.99, category: 'Books' },
];

export function TableComparisonTest() {
  const [activeTab, setActiveTab] = useState<
    'ag-grid' | 'tanstack-table' | 'tanstack-virtual'
  >('ag-grid');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Table Solutions Comparison</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('ag-grid')}
          className={`px-4 py-2 rounded ${
            activeTab === 'ag-grid'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          AG Grid
        </button>
        <button
          onClick={() => setActiveTab('tanstack-table')}
          className={`px-4 py-2 rounded ${
            activeTab === 'tanstack-table'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          TanStack Table
        </button>
        <button
          onClick={() => setActiveTab('tanstack-virtual')}
          className={`px-4 py-2 rounded ${
            activeTab === 'tanstack-virtual'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          TanStack Virtual
        </button>
      </div>

      {/* Content Area */}
      <div className="border rounded-lg p-4">
        {activeTab === 'ag-grid' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              AG Grid Implementation
            </h3>
            <p className="text-gray-600 mb-4">
              Enterprise-grade table with built-in features. Used for data-heavy
              interfaces.
            </p>
            {/* Your existing AG Grid component can be imported here */}
          </div>
        )}

        {activeTab === 'tanstack-table' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">TanStack React Table</h3>
            <p className="text-gray-600 mb-4">
              Headless table library for building custom tables. You have this
              dependency already installed.
            </p>
            {/* TanStack Table implementation would go here */}
            <div className="border rounded p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Price</th>
                    <th className="text-left p-2">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleData.map(item => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{item.id}</td>
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">${item.price}</td>
                      <td className="p-2">{item.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'tanstack-virtual' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              TanStack Virtual Implementation
            </h3>
            <p className="text-gray-600 mb-4">
              Virtual scrolling for large datasets. Great for 10k+ rows.
            </p>
            {/* TanStack Virtual implementation would go here */}
            <div className="border rounded p-4 h-64 overflow-auto">
              <p className="text-gray-500">
                Virtual scrolling table would render here for large datasets.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Summary */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Solution Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded border">
            <h4 className="font-semibold text-blue-600 mb-2">AG Grid</h4>
            <ul className="text-sm space-y-1">
              <li>✅ Feature-rich out of the box</li>
              <li>✅ Built-in filtering, sorting, pagination</li>
              <li>✅ Excel-like experience</li>
              <li>❌ Larger bundle size</li>
              <li>❌ Less customization</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded border">
            <h4 className="font-semibold text-green-600 mb-2">
              TanStack Table
            </h4>
            <ul className="text-sm space-y-1">
              <li>✅ Lightweight and flexible</li>
              <li>✅ Full customization control</li>
              <li>✅ TypeScript-first</li>
              <li>❌ More setup required</li>
              <li>❌ Build features from scratch</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded border">
            <h4 className="font-semibold text-purple-600 mb-2">
              TanStack Virtual
            </h4>
            <ul className="text-sm space-y-1">
              <li>✅ Handles massive datasets</li>
              <li>✅ Excellent performance</li>
              <li>✅ Memory efficient</li>
              <li>❌ Complex implementation</li>
              <li>❌ Overkill for small data</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
