import React from 'react';
import { useCycleCountAlerts, useDashboardStats } from '@/hooks/use-dashboard';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export function ActionCenter() {
  const { data: alerts } = useCycleCountAlerts(10);
  const { data: stats } = useDashboardStats();

  const notifications = [];

  // Critical alerts
  const criticalAlerts = alerts?.filter(alert => alert.alerttype === 'NEGATIVE_INVENTORY') || [];
  if (criticalAlerts.length > 0) {
    notifications.push({
      id: 'negative-inventory',
      type: 'critical',
      title: 'Negative Inventory Alert',
      description: `${criticalAlerts.length} item${criticalAlerts.length > 1 ? 's' : ''} with negative inventory`,
      count: criticalAlerts.length,
      action: '/items?filter=negative',
      actionText: 'Fix Now',
      color: 'red',
    });
  }

  // Low stock alerts
  const lowStockAlerts = alerts?.filter(alert => alert.alerttype === 'LOW_STOCK') || [];
  if (lowStockAlerts.length > 0) {
    notifications.push({
      id: 'low-stock',
      type: 'warning',
      title: 'Low Stock Items',
      description: `${lowStockAlerts.length} item${lowStockAlerts.length > 1 ? 's' : ''} below reorder point`,
      count: lowStockAlerts.length,
      action: '/items?filter=low-stock',
      actionText: 'Review',
      color: 'amber',
    });
  }

  // Draft purchases
  if (stats && stats.draftPurchases > 0) {
    notifications.push({
      id: 'draft-purchases',
      type: 'info',
      title: 'Pending Purchases',
      description: `${stats.draftPurchases} draft purchase${stats.draftPurchases > 1 ? 's' : ''} awaiting completion`,
      count: stats.draftPurchases,
      action: '/purchases?filter=draft',
      actionText: 'Complete',
      color: 'blue',
    });
  }

  // Overdue counts
  const overdueAlerts = alerts?.filter(alert => alert.alerttype === 'OVERDUE_COUNT') || [];
  if (overdueAlerts.length > 0) {
    notifications.push({
      id: 'overdue-counts',
      type: 'info',
      title: 'Overdue Cycle Counts',
      description: `${overdueAlerts.length} item${overdueAlerts.length > 1 ? 's' : ''} need cycle counting`,
      count: overdueAlerts.length,
      action: '/items?filter=overdue',
      actionText: 'Count',
      color: 'purple',
    });
  }

  if (notifications.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Action Center</h2>
        </div>
        <div className="p-6">
          <div className="text-center text-gray-500">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">✓</span>
            </div>
            <p className="font-medium">All caught up!</p>
            <p className="text-sm text-gray-400 mt-1">No action items at this time</p>
          </div>
        </div>
      </div>
    );
  }

  const getNotificationColor = (color: string) => {
    switch (color) {
      case 'red':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          badge: 'bg-red-100 text-red-800',
          button: 'bg-red-600 hover:bg-red-700 text-white',
        };
      case 'amber':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          badge: 'bg-amber-100 text-amber-800',
          button: 'bg-amber-600 hover:bg-amber-700 text-white',
        };
      case 'blue':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          badge: 'bg-blue-100 text-blue-800',
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          badge: 'bg-purple-100 text-purple-800',
          button: 'bg-purple-600 hover:bg-purple-700 text-white',
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          badge: 'bg-gray-100 text-gray-800',
          button: 'bg-gray-600 hover:bg-gray-700 text-white',
        };
    }
  };

  const getPriorityOrder = (type: string) => {
    switch (type) {
      case 'critical': return 1;
      case 'warning': return 2;
      case 'info': return 3;
      default: return 4;
    }
  };

  const sortedNotifications = notifications.sort((a, b) => 
    getPriorityOrder(a.type) - getPriorityOrder(b.type)
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Action Center</h2>
          <Badge variant="secondary" className="text-xs">
            {notifications.length} item{notifications.length > 1 ? 's' : ''}
          </Badge>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {sortedNotifications.map((notification) => {
            const colors = getNotificationColor(notification.color);
            return (
              <div
                key={notification.id}
                className={`rounded-lg border p-4 ${colors.bg} ${colors.border}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-gray-900">
                        {notification.title}
                      </h3>
                      <Badge className={colors.badge}>
                        {notification.count}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      {notification.description}
                    </p>
                    <Link
                      href={notification.action}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${colors.button}`}
                    >
                      {notification.actionText}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
