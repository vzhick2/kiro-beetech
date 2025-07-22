"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Package,
  Users,
  DollarSign,
  BarChart3,
  Search,
  ShoppingCart,
  Upload,
  ChefHat,
  Menu,
  X,
  Plus,
  FileText,
  Archive,
  TrendingUp,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Items', href: '/items', icon: Package },
  { name: 'Suppliers', href: '/suppliers', icon: Users },
  { name: 'Purchases', href: '/purchases', icon: ShoppingCart },
  { name: 'Sales', href: '/sales', icon: DollarSign },
  { name: 'Recipes', href: '/recipes', icon: ChefHat },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Batches', href: '/batches', icon: Archive },
  { name: 'Import/Export', href: '/import-export', icon: Upload },
  { name: 'Search', href: '/search', icon: Search },
];

interface ResponsiveSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function ResponsiveSidebar({ isOpen, onToggle }: ResponsiveSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Android-specific touch handling
  const handleTouchStart = (e: React.TouchEvent, href: string) => {
    e.preventDefault();
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    const startTime = Date.now();

    const handleTouchEnd = (endEvent: TouchEvent) => {
      const endTouch = endEvent.changedTouches[0];
      const endX = endTouch.clientX;
      const endY = endTouch.clientY;
      const endTime = Date.now();
      
      const deltaX = Math.abs(endX - startX);
      const deltaY = Math.abs(endY - startY);
      const deltaTime = endTime - startTime;
      
      // Detect tap vs scroll (less than 10px movement and under 300ms)
      if (deltaX < 10 && deltaY < 10 && deltaTime < 300) {
        router.push(href);
        if (isMobile) {
          onToggle(); // Close sidebar on mobile after navigation
        }
      }
      
      // Cleanup
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchend', handleTouchEnd, { once: true });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-slate-900 text-white z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        w-64 md:w-72
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h1 className="text-xl font-bold">KIRO Inventory</h1>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map((navItem) => {
              const IconComponent = navItem.icon;
              const isActive = pathname === navItem.href;
              
              return (
                <button
                  key={navItem.name}
                  onTouchStart={(e) => handleTouchStart(e, navItem.href)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800 active:bg-slate-700'
                  }`}
                  style={{
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                    userSelect: 'none',
                    minHeight: '56px',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    lineHeight: 'inherit',
                    cursor: 'pointer',
                    // Android-specific improvements
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                    WebkitTouchCallout: 'none',
                    KhtmlUserSelect: 'none',
                  } as React.CSSProperties}
                >
                  <IconComponent className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">{navItem.name}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <TrendingUp className="h-4 w-4" />
            <span>BeeTech Systems</span>
          </div>
        </div>
      </div>
    </>
  );
}