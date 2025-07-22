'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ChefHat,
  Factory,
  TrendingUp,
  BarChart3,
  Database,
  Users,
} from 'lucide-react';

// Type definitions for navigation items
type NavigationItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
} | {
  type: 'separator';
};

// Navigation with logical groupings for better UX
const navigation: NavigationItem[] = [
  // Core Operations
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Items', href: '/items', icon: Package },
  { name: 'Suppliers', href: '/suppliers', icon: Users },
  { name: 'Purchases', href: '/purchases', icon: ShoppingCart },
  { type: 'separator' }, // Visual break
  // Production & Sales
  { name: 'Recipes', href: '/recipes', icon: ChefHat },
  { name: 'Batches', href: '/batches', icon: Factory },
  { name: 'Sales', href: '/sales', icon: TrendingUp },
  { type: 'separator' }, // Visual break
  // Analytics & Data
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Data', href: '/data', icon: Database },
];

interface ResponsiveSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDesktop: boolean;
}

export function ResponsiveSidebar({
  isOpen,
  onClose,
  isDesktop,
}: ResponsiveSidebarProps) {
  const pathname = usePathname();

  // Close sidebar when clicking outside (mobile only) - c32a068 pattern
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen && !isDesktop) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, isDesktop]);

  const handleMobileNavClick = () => {
    // Only close on mobile, not desktop - c32a068 pattern
    if (!isDesktop) {
      onClose();
    }
  };

  const NavigationContent = () => (
    <div className="p-4 space-y-1">
      {navigation.map((item, index) => {
        // Render separator
        if ('type' in item && item.type === 'separator') {
          return (
            <div
              key={`separator-${index}`}
              className="my-3 border-t border-slate-700/50"
            />
          );
        }

        // Type guard ensures item is a navigation link
        if ('name' in item && 'href' in item && 'icon' in item) {
          const isActive = pathname === item.href;
          const IconComponent = item.icon;
          
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
              style={{
                // Enhanced touch targets for new requirements while keeping c32a068 simplicity
                minHeight: '44px', // Meet 44px touch target requirement
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <IconComponent className="h-4 w-4 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        }

        return null; // Fallback for unknown item types
      })}
    </div>
  );

  if (isDesktop) {
    // Desktop: Conditionally render sidebar - no space taken when closed (c32a068 pattern)
    if (!isOpen) {
      return null;
    }

    return (
      <div className="w-48 flex-shrink-0 bg-slate-900 border-r border-slate-700/50 transition-all duration-200 ease-out">
        <NavigationContent />
      </div>
    );
  }

  // Mobile: Overlay sidebar with smooth animations (c32a068 pattern)
  return (
    <>
      {/* Backdrop with fade animation */}
      <div
        className={`fixed inset-0 z-30 transition-all duration-200 ease-out ${
          isOpen ? 'bg-black/50' : 'bg-transparent pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar overlay with slide + fade animation - explicit width for mobile */}
      <div
        className={`fixed top-16 left-0 bottom-0 z-40 bg-slate-900 border-r border-slate-700/50 transition-all duration-200 ease-out ${
          isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
        style={{
          width: '180px', // Wider for better text spacing and readability
          minWidth: '180px', // Prevent width from shrinking
          maxWidth: '180px', // Prevent width from expanding
          touchAction: 'manipulation',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
      >
        <NavigationContent />
      </div>
    </>
  );
}
