'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Package, AlertCircle } from 'lucide-react';

export function PurchasesPlaceholder() {
  const [isArchived] = useState(true);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Package className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Purchases</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Purchase order management and supplier invoice tracking
        </p>
      </div>

      {/* Status Card */}
      <Card className="p-6 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-yellow-800">
              Purchases Feature - Under Development
            </h3>
            <div className="text-yellow-700 space-y-2">
              <p>
                The purchases module has been temporarily archived while we rebuild it with a cleaner architecture.
              </p>
              <p className="text-sm">
                <strong>What's working:</strong> Database schema is ready with purchases, suppliers, and line items tables.
              </p>
              <p className="text-sm">
                <strong>Coming soon:</strong> Simplified purchase order creation, draft management, and supplier integration.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Access */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Data</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• 4 purchase records in database</p>
            <p>• 1 draft purchase (PO-2025-004)</p>
            <p>• 3 finalized purchases</p>
            <p>• Purchase line items table ready</p>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 w-full" 
            disabled
          >
            <Package className="w-4 h-4 mr-2" />
            View Purchases (Coming Soon)
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Alternative Access</h3>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <p>• Use Supabase dashboard for direct data access</p>
            <p>• Check suppliers page for supplier management</p>
            <p>• Items page for inventory tracking</p>
          </div>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
            >
              Open Supabase Dashboard
            </Button>
            <Button 
              variant="default" 
              className="w-full"
              onClick={() => window.location.href = '/suppliers'}
            >
              Manage Suppliers
            </Button>
          </div>
        </Card>
      </div>

      {/* Development Notes */}
      <Card className="p-6 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Development Notes</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Archived components:</strong> Stored in <code>src/components/purchases/archived/</code></p>
          <p><strong>Database ready:</strong> Schema includes purchases, purchase_line_items, suppliers tables</p>
          <p><strong>Next steps:</strong> Build simplified purchase creation form with proper error handling</p>
          <p><strong>Focus areas:</strong> Form validation, server actions, and proper TypeScript integration</p>
        </div>
      </Card>
    </div>
  );
}