'use client';

import React from 'react';
import { useDashboardStats } from '@/hooks/use-dashboard';
import Link from 'next/link';

export function DashboardStats() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-xl p-6 shadow-sm animate-pulse"
          >
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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm col-span-full">
          <p className="text-red-700 text-center font-medium">
            Unable to load dashboard statistics
          </p>
          <p className="text-red-600 text-sm text-center mt-1">
            {error.message}
          </p>
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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map(card => (
        <Link key={card.title} href={card.href}>
          <div
            className={`bg-gradient-to-br ${card.color} rounded-xl border ${card.borderColor} p-6 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group`}
          >
            <h3 className={`text-sm font-semibold ${card.textColor} mb-3 group-hover:text-opacity-80 transition-all`}>
              {card.title}
            </h3>
            <p className={`text-3xl font-bold ${card.valueColor} mb-2 group-hover:scale-105 transition-transform`}>
              {card.value.toLocaleString()}
            </p>
            <p className={`text-sm ${card.subtextColor} group-hover:text-opacity-80 transition-all`}>
              {card.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
