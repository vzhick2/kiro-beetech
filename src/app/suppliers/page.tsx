'use client';

import { ModernDataTable } from "@/components/suppliers/modern-data-table"
import { ErrorBoundary } from "@/components/error-boundary"
import { useToast } from "@/providers/toast-provider"
import { Button } from "@/components/ui/button"
import { Download, Archive, Check } from "lucide-react"

export default function SuppliersPage() {
  const { showToast } = useToast();

  const testToasts = () => {
    // Show different types of toasts to test the system
    showToast({
      title: 'Changes saved successfully',
      message: 'All supplier modifications have been applied',
      type: 'success',
      icon: <Check className="h-5 w-5" />
    });

    setTimeout(() => {
      showToast({
        title: '3 suppliers exported',
        message: 'Download started to your device',
        type: 'info',
        icon: <Download className="h-5 w-5" />,
        action: {
          label: 'Open File',
          onClick: () => console.log('Open file clicked')
        }
      });
    }, 1000);

    setTimeout(() => {
      showToast({
        title: 'Archive operation failed',
        message: 'Cannot archive suppliers with pending orders',
        type: 'error',
        icon: <Archive className="h-5 w-5" />
      });
    }, 2000);
  };

  return (
    <div className="w-full pb-24">
      <div className="bg-gray-50 border-b">
        <div className="px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
          <Button onClick={testToasts} variant="outline" size="sm">
            Test Toasts
          </Button>
        </div>
      </div>

      <ErrorBoundary>
        <ModernDataTable />
      </ErrorBoundary>
    </div>
  )
}
