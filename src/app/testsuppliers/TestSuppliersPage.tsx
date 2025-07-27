// TESTSUPPLIERS main page component (Client Component for interactivity)
'use client';
import { useState } from 'react';
import { TestSuppliersTable } from './TestSuppliersTable';

export default function TestSuppliersPage() {
  // ViewOptions state: showInactive controls archived suppliers
  const [showInactive, setShowInactive] = useState(false);

  return (
    <main className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Test Suppliers</h1>
      </div>
      <TestSuppliersTable 
        showInactive={showInactive} 
        onToggleInactive={setShowInactive}
      />
    </main>
  );
}
