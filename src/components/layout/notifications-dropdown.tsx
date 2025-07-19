'use client'

import { Bell, AlertTriangle, Package, CheckCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface NotificationItem {
  id: string
  type: 'NEGATIVE_INVENTORY' | 'LOW_STOCK' | 'CYCLE_COUNT' | 'BATCH_COMPLETE'
  title: string
  message: string
  priority: 'high' | 'medium' | 'low'
  timestamp: Date
  link?: string
  data?: Record<string, unknown>
}

interface NotificationsDropdownProps {
  isOpen: boolean
  onClose: () => void
  notifications?: NotificationItem[]
}

export function NotificationsDropdown({ isOpen, onClose, notifications = [] }: NotificationsDropdownProps) {
  // Sample data based on specifications - in real implementation, this would come from:
  // - get_cycle_count_alerts() function for top 5 priority items
  // - Real-time Supabase subscriptions for live updates
  // - Negative inventory and low stock alert system
  const sampleNotifications: NotificationItem[] = [
    {
      id: '1',
      type: 'NEGATIVE_INVENTORY',
      title: 'Negative Inventory Alert',
      message: 'Raw Honey is -15 units. Immediate attention needed.',
      priority: 'high',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      link: '/items?filter=alerts',
      data: { itemSKU: 'HON-001', shortage: 15 }
    },
    {
      id: '2', 
      type: 'LOW_STOCK',
      title: 'Low Stock Warning',
      message: 'Beeswax (BWX-002) below reorder point. 5 units remaining.',
      priority: 'medium',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      link: '/items?item=BWX-002'
    },
    {
      id: '3',
      type: 'CYCLE_COUNT',
      title: 'Cycle Count Due', 
      message: 'Lavender Essential Oil needs counting (60 days overdue)',
      priority: 'medium',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      link: '/items?count=LAV-001'
    },
    {
      id: '4',
      type: 'BATCH_COMPLETE',
      title: 'Batch Completed',
      message: 'BATCH-20250120-003 (Face Cream) finished with 98% yield',
      priority: 'low',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      link: '/batches/BATCH-20250120-003'
    }
  ]

  const activeNotifications = notifications.length > 0 ? notifications : sampleNotifications

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'NEGATIVE_INVENTORY':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'LOW_STOCK':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'CYCLE_COUNT':
        return <Package className="w-4 h-4 text-blue-500" />
      case 'BATCH_COMPLETE':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Bell className="w-4 h-4 text-slate-400" />
    }
  }

  const getPriorityColor = (priority: NotificationItem['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50/5'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50/5'
      case 'low': return 'border-l-green-500 bg-green-50/5'
      default: return 'border-l-slate-500 bg-slate-50/5'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)
    
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`
    return `${Math.floor(diffMinutes / 1440)}d ago`
  }

  if (!isOpen) return null

  return (
    <div className="absolute top-12 right-0 w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-lg shadow-xl z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <h3 className="text-sm font-semibold text-white">Notifications</h3>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded-full">
            {activeNotifications.filter(n => n.priority === 'high').length}
          </span>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {activeNotifications.length === 0 ? (
          <div className="p-4 text-center text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {activeNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border-l-2 rounded-r-lg transition-colors hover:bg-slate-800/50 ${getPriorityColor(notification.priority)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-medium text-white truncate">
                        {notification.title}
                      </h4>
                      <span className="text-xs text-slate-400 flex-shrink-0">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    {notification.link && (
                      <Link 
                        href={notification.link}
                        onClick={onClose}
                        className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2 transition-colors"
                      >
                        View details
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer - Quick Actions */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
        <div className="flex items-center justify-between text-xs">
          <Link 
            href="/"
            onClick={onClose}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            View Dashboard
          </Link>
          <Link 
            href="/settings#notifications"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            Notification Settings
          </Link>
        </div>
      </div>
    </div>
  )
} 