'use client'

import { useState } from 'react'
import { Bell, AlertTriangle, AlertCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

// Mock data - will be replaced with real data later
const mockAlerts = [
  {
    id: 1,
    type: 'critical',
    title: 'Flour: -5 lbs (negative inventory)',
    time: '2h ago',
    icon: AlertTriangle,
  },
  {
    id: 2,
    type: 'warning',
    title: 'Sugar: 2 lbs (low stock)',
    time: '4h ago',
    icon: AlertCircle,
  },
  {
    id: 3,
    type: 'warning',
    title: 'Vanilla: 1 bottle (reorder)',
    time: '6h ago',
    icon: AlertCircle,
  },
]

const mockActivity = [
  {
    id: 1,
    title: 'Logged Batch #123',
    time: '2h ago',
  },
  {
    id: 2,
    title: 'Updated Flour quantity',
    time: '4h ago',
  },
  {
    id: 3,
    title: 'Added Purchase PO-001',
    time: '1d ago',
  },
]

export function NotificationsButton() {
  const [isOpen, setIsOpen] = useState(false)
  
  const alertCount = mockAlerts.length
  const criticalCount = mockAlerts.filter(alert => alert.type === 'critical').length

  const getBadgeColor = () => {
    if (criticalCount > 0) return 'bg-red-500'
    if (alertCount > 0) return 'bg-blue-500'
    return 'bg-slate-500'
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-md transition-colors relative"
        >
          <Bell className="h-5 w-5" strokeWidth={2.5} />
          {alertCount > 0 && (
            <span className={cn(
              'absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs font-medium text-white flex items-center justify-center',
              getBadgeColor()
            )}>
              {criticalCount > 0 ? '!' : alertCount > 9 ? '9+' : alertCount}
            </span>
          )}
          <span className="sr-only">
            {alertCount > 0 ? `${alertCount} notifications` : 'No notifications'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-semibold">
          Alerts & Activity
        </DropdownMenuLabel>
        
        {alertCount > 0 ? (
          <>
            <DropdownMenuSeparator />
            {mockAlerts.map((alert) => {
              const IconComponent = alert.icon
              return (
                <DropdownMenuItem 
                  key={alert.id} 
                  className="cursor-pointer p-3 focus:bg-accent"
                >
                  <div className="flex items-start space-x-3 w-full">
                    <IconComponent className={cn(
                      'h-4 w-4 mt-0.5 flex-shrink-0',
                      alert.type === 'critical' ? 'text-red-500' : 'text-yellow-500'
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {alert.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {alert.time}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              )
            })}
          </>
        ) : (
          <>
            <DropdownMenuSeparator />
            <div className="p-4 text-center text-sm text-muted-foreground">
              No alerts at the moment
            </div>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
          Recent Activity
        </DropdownMenuLabel>
        
        {mockActivity.map((activity) => (
          <DropdownMenuItem 
            key={activity.id} 
            className="cursor-pointer p-3 focus:bg-accent"
          >
            <div className="flex items-start space-x-3 w-full">
              <Clock className="h-3 w-3 mt-1 flex-shrink-0 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.time}
                </p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-center justify-center text-sm text-muted-foreground">
          View All Activity
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}