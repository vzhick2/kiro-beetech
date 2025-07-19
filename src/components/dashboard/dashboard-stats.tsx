import React from 'react';
import { useDashboardStats } from '@/hooks/use-dashboard';
import Link from 'next/link';

export function DashboardStats() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-6 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-3"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm col-span-full">
          <p className="text-red-700 text-center">Unable to load dashboard statistics</p>
          <p className="text-red-600 text-sm text-center mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Items',
      value: stats?.totalItems || 0,
      description: 'Active inventory items',
      color: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      valueColor: 'text-blue-900',
      subtextColor: 'text-blue-600',
      href: '/items',
    },
    {
      title: 'Low Stock Alerts',
      value: stats?.lowStockItems || 0,
      description: 'Items needing attention',
      color: 'from-red-50 to-pink-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      valueColor: 'text-red-900',
      subtextColor: 'text-red-600',
      href: '/items?filter=alerts',
    },
    {
      title: 'Draft Purchases',
      value: stats?.draftPurchases || 0,
      description: 'Pending completion',
      color: 'from-amber-50 to-yellow-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      valueColor: 'text-amber-900',
      subtextColor: 'text-amber-600',
      href: '/purchases?filter=draft',
    },
    {
      title: 'Recent Activity',
      value: stats?.recentTransactions || 0,
      description: 'Transactions this week',
      color: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      valueColor: 'text-green-900',
      subtextColor: 'text-green-600',
      href: '/reports',
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {statCards.map((card) => (
        <Link key={card.title} href={card.href}>
          <div className={`bg-gradient-to-br ${card.color} rounded-lg border ${card.borderColor} p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}>
            <h3 className={`text-sm font-medium ${card.textColor} mb-2`}>
              {card.title}
            </h3>
            <p className={`text-2xl font-bold ${card.valueColor}`}>
              {card.value.toLocaleString()}
            </p>
            <p className={`text-sm ${card.subtextColor} mt-1`}>
              {card.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
