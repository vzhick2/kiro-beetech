'use client';

import React from 'react';
import { useCycleCountAlerts } from '@/hooks/use-dashboard';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface CycleCountAlertsProps {
  limit?: number;
}

export function CycleCountAlerts({ limit = 5 }: CycleCountAlertsProps) {
  const { data: alerts, isLoading, error } = useCycleCountAlerts(limit);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Cycle Count Alerts
          </h2>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Cycle Count Alerts
          </h2>
        </div>
        <div className="p-6">
          <div className="text-center text-gray-500">
            <p>Unable to load alerts</p>
            <p className="text-sm text-gray-400 mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Cycle Count Alerts
          </h2>
        </div>
        <div className="p-6">
          <div className="text-center text-gray-500">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">✓</span>
            </div>
            <p className="font-medium">All good!</p>
            <p className="text-sm text-gray-400 mt-1">
              No inventory alerts at this time
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getAlertColor = (alertType: string) => {
    switch (alertType) {
      case 'NEGATIVE_INVENTORY':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'LOW_STOCK':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'OVERDUE_COUNT':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'NEGATIVE_INVENTORY':
        return '⚠️';
      case 'LOW_STOCK':
        return '📦';
      case 'OVERDUE_COUNT':
        return '📅';
      default:
        return '🔔';
    }
  };

  const getAlertTitle = (alertType: string) => {
    switch (alertType) {
      case 'NEGATIVE_INVENTORY':
        return 'Negative Inventory';
      case 'LOW_STOCK':
        return 'Low Stock';
      case 'OVERDUE_COUNT':
        return 'Count Overdue';
      default:
        return 'Alert';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Cycle Count Alerts
          </h2>
          <Link
            href="/items"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all"
          >
            View all items →
          </Link>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {alerts.map(alert => (
            <div
              key={alert.itemid}
              className={`rounded-xl border p-4 ${getAlertColor(alert.alerttype)} transition-all hover:shadow-sm`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 text-lg">
                    {getAlertIcon(alert.alerttype)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium truncate">{alert.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {alert.sku}
                      </Badge>
                    </div>
                    <p className="text-sm">
                      Current: <strong>{alert.currentquantity}</strong>
                      {alert.reorderpoint && (
                        <>
                          {' '}
                          | Reorder at: <strong>{alert.reorderpoint}</strong>
                        </>
                      )}
                      {alert.shortageamount > 0 && (
                        <>
                          {' '}
                          | Short by:{' '}
                          <strong className="text-red-600">
                            {alert.shortageamount}
                          </strong>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <Badge variant="secondary" className="text-xs">
                    {getAlertTitle(alert.alerttype)}
                  </Badge>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-gray-600">
                  Priority: {alert.priorityscore.toFixed(1)}
                </div>
                <Link
                  href={`/items?search=${encodeURIComponent(alert.sku)}`}
                  className="text-xs font-medium hover:underline text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Update →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
