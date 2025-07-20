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
  const [activeTab, setActiveTab] = useState<'ag-grid' | 'tanstack-table' | 'tanstack-virtual'>('ag-grid');

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
            <h3 className="text-lg font-semibold mb-4">AG Grid Implementation</h3>
            <p className="text-gray-600 mb-4">
              Enterprise-grade table with built-in features. Your existing implementation in suppliers-ag-grid.tsx.
            </p>
            {/* Your existing AG Grid component can be imported here */}
          </div>
        )}

        {activeTab === 'tanstack-table' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">TanStack React Table</h3>
            <p className="text-gray-600 mb-4">
              Headless table library for building custom tables. You have this installed!
            </p>
            <div className="bg-yellow-50 p-4 rounded border">
              <p className="text-sm">
                🚧 To implement: Create a component using useReactTable() hook from @tanstack/react-table
              </p>
            </div>
          </div>
        )}

        {activeTab === 'tanstack-virtual' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">TanStack Virtual</h3>
            <p className="text-gray-600 mb-4">
              For virtualizing large datasets. Requires installation of @tanstack/react-virtual.
            </p>
            <div className="bg-blue-50 p-4 rounded border">
              <p className="text-sm">
                💡 To add: pnpm add @tanstack/react-virtual
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Notes */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded border">
          <h4 className="font-semibold text-green-800">AG Grid</h4>
          <ul className="text-sm text-green-700 mt-2 space-y-1">
            <li>✅ Feature-complete</li>
            <li>✅ Built-in sorting, filtering</li>
            <li>✅ Enterprise features</li>
            <li>❌ Large bundle size</li>
            <li>❌ Less customizable styling</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded border">
          <h4 className="font-semibold text-blue-800">TanStack Table</h4>
          <ul className="text-sm text-blue-700 mt-2 space-y-1">
            <li>✅ Fully customizable</li>
            <li>✅ Headless (bring your own UI)</li>
            <li>✅ TypeScript-first</li>
            <li>✅ Smaller bundle</li>
            <li>❌ More setup required</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-4 rounded border">
          <h4 className="font-semibold text-purple-800">TanStack Virtual</h4>
          <ul className="text-sm text-purple-700 mt-2 space-y-1">
            <li>✅ Handles 100k+ rows</li>
            <li>✅ Excellent performance</li>
            <li>✅ Small bundle size</li>
            <li>❌ Only for large datasets</li>
            <li>❌ More complex setup</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
