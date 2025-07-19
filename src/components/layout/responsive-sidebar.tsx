'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ChefHat,
  Factory,
  TrendingUp,
  BarChart3,
  Database,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Items', href: '/items', icon: Package },
  { name: 'Purchases', href: '/purchases', icon: ShoppingCart },
  { name: 'Recipes', href: '/recipes', icon: ChefHat },
  { name: 'Batches', href: '/batches', icon: Factory },
  { name: 'Sales', href: '/sales', icon: TrendingUp },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Data', href: '/data', icon: Database },
]

interface ResponsiveSidebarProps {
  isOpen: boolean
  onClose: () => void
  isDesktop: boolean
}

export function ResponsiveSidebar({ isOpen, onClose, isDesktop }: ResponsiveSidebarProps) {
  const pathname = usePathname()

  // Close sidebar when clicking outside (mobile only)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen && !isDesktop) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, isDesktop])

  const handleMobileNavClick = () => {
    // Only close on mobile, not desktop
    if (!isDesktop) {
      onClose()
    }
  }

  const NavigationContent = () => (
    <div className="p-4 space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={handleMobileNavClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span>{item.name}</span>
          </Link>
        )
      })}
    </div>
  )

  if (isDesktop) {
    // Desktop: Conditionally render sidebar - no space taken when closed
    if (!isOpen) {
      return null
    }
    
    return (
      <div className="w-48 flex-shrink-0 bg-slate-900/95 backdrop-blur-sm border-r border-slate-700/50 transition-all duration-200 ease-out">
        <NavigationContent />
      </div>
    )
  }

  // Mobile: Overlay sidebar with smooth animations
  return (
    <>
      {/* Backdrop with fade animation */}
      <div 
        className={`fixed inset-0 z-30 transition-all duration-200 ease-out ${
          isOpen 
            ? 'bg-black/50 backdrop-blur-sm' 
            : 'bg-transparent pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Sidebar overlay with slide + fade animation */}
      <div 
        className={`fixed top-16 left-0 bottom-0 w-48 z-40 bg-slate-900/95 backdrop-blur-md border-r border-slate-700/50 transition-all duration-200 ease-out ${
          isOpen 
            ? 'translate-x-0 opacity-100' 
            : '-translate-x-full opacity-0'
        }`}
      >
        <NavigationContent />
      </div>
    </>
  )
} 