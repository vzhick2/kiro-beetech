'use client'

import { useState, useEffect, useRef } from 'react'
import { Sidebar } from './sidebar'
import { CommandPalette } from './command-palette'
import { usePageTitle } from '@/hooks/use-page-title'
import { Button } from '@/components/ui/button'
import { Menu, X, Search, Bell, User } from 'lucide-react'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ 
  children
}: AppLayoutProps) {
  const pageTitle = usePageTitle()
  const [sidebarOpen, setSidebarOpen] = useState(true) // Start with sidebar open
  const [isMobile, setIsMobile] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Handle sidebar toggle for all screen sizes
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close sidebar when clicking outside (mobile only)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isMobile
      ) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [sidebarOpen, isMobile])

  // Close sidebar when navigating on mobile
  useEffect(() => {
    const handleRouteChange = () => {
      if (isMobile) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [isMobile])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Fixed Header - Dark Blue */}
      <header className="fixed top-0 left-0 right-0 h-16 flex items-center bg-slate-800 z-50 border-b border-gray-700">
        {/* Static Hamburger/X Button - Always at top-left */}
        <button
          onClick={toggleSidebar}
          className="h-16 w-16 flex items-center justify-center text-white hover:bg-slate-700 transition-colors border-r border-gray-600"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle sidebar</span>
        </button>

        <div className="flex items-center space-x-4 flex-1 px-4 md:px-6">
          {/* Page Title */}
          <h1 className="text-lg font-semibold text-white">{pageTitle}</h1>
        </div>
        
        {/* Search Bar with Next.js 15 Form Component */}
        <div className="flex-1 max-w-md mx-4">
          <form action="/search" method="GET" className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="q"
              placeholder="Search products, orders, customers"
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </form>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 text-white hover:text-white hover:bg-slate-700 rounded-md transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 text-white hover:text-white hover:bg-slate-700 rounded-md transition-colors"
          >
            <User className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex w-full pt-16">
        {/* Unified Sidebar - Works for both desktop and mobile */}
        <div 
          ref={sidebarRef}
          className={`
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            ${isMobile ? 'fixed top-16 left-0 bottom-0 z-40' : 'relative'}
          `}
        >
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen && !isMobile ? 'ml-0' : 'ml-0'}`}>
          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette />
    </div>
  )
}