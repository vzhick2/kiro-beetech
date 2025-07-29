'use client';

import React from 'react';
import { useRecentActivity } from '@/hooks/use-dashboard';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { paginationSettings } from '@/config/app-config';

interface RecentActivityProps {
  limit?: number;
}

export function RecentActivity({ limit = paginationSettings.pageSizes.dashboard.recentActivity }: RecentActivityProps) {
  const { data: activities, isLoading, error } = useRecentActivity(limit);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
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
            Recent Activity
          </h2>
        </div>
        <div className="p-6">
          <div className="text-center text-gray-500">
            <p>Unable to load recent activity</p>
            <p className="text-sm text-gray-400 mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
        </div>
        <div className="p-6">
          <div className="text-center text-gray-500">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-xl">📊</span>
            </div>
            <p className="font-medium">No recent activity</p>
            <p className="text-sm text-gray-400 mt-1">
              Activity will appear here as you use the system
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getIconBgColor = (iconColor: string) => {
    switch (iconColor) {
      case 'red':
        return 'bg-red-100 text-red-600';
      case 'green':
        return 'bg-green-100 text-green-600';
      case 'blue':
        return 'bg-blue-100 text-blue-600';
      case 'amber':
        return 'bg-amber-100 text-amber-600';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-600';
      case 'purple':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getActivityLink = (activity: any) => {
    switch (activity.type) {
      case 'purchase':
        return '/purchases';
      case 'transaction':
        return '/items';
      case 'batch':
        return '/batches';
      case 'sale':
        return '/sales';
      default:
        return '/';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
          <select className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white text-gray-600">
            <option>Recent</option>
            <option>Today</option>
            <option>This Week</option>
          </select>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities.map(activity => (
            <div key={activity.id} className="flex items-start space-x-3 group">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getIconBgColor(activity.iconColor)}`}
              >
                <span className="font-semibold text-sm">{activity.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(activity.timestamp, {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <Link
                    href={getActivityLink(activity)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-blue-600 hover:text-blue-700 font-medium ml-2"
                  >
                    View →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {activities.length >= limit && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Link
              href="/reports"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all activity →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
