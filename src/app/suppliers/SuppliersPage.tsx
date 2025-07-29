// SUPPLIERS main page component (Client Component for interactivity)
'use client';
import { useState } from 'react';
import { SuppliersTable } from './SuppliersTable';

export default function SuppliersPage() {
  // ViewOptions state: showInactive controls archived suppliers
  const [showInactive, setShowInactive] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">Suppliers</h1>
      </div>
      <SuppliersTable 
        showInactive={showInactive} 
        onToggleInactiveAction={setShowInactive}
      />
    </main>
  );
}
