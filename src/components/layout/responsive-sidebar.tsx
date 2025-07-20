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
  LucideIcon,
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface NavigationSeparator {
  separator: true;
}

type NavigationElement = NavigationItem | NavigationSeparator;

const navigation: NavigationElement[] = [
  // Daily Operations Group
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Items', href: '/items', icon: Package },
  { name: 'Batches', href: '/batches', icon: Factory },
  { name: 'Recipes', href: '/recipes', icon: ChefHat },
  // Separator after operations
  { separator: true },
  // Business Management Group
  { name: 'Purchases', href: '/purchases', icon: ShoppingCart },
  { name: 'Sales', href: '/sales', icon: TrendingUp },
  { name: 'Suppliers', href: '/suppliers', icon: Users },
  { name: 'Suppliers (Modern)', href: '/suppliers/suppliers2', icon: Users },
  // Separator after business
  { separator: true },
  // Analysis & Reporting Group
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Data', href: '/data', icon: Database },
];

interface ResponsiveSidebarProps {
  isOpen: boolean;
  onCloseAction: () => void;
  isDesktop: boolean;
}

export function ResponsiveSidebar({
  isOpen,
  onCloseAction,
  isDesktop,
}: ResponsiveSidebarProps) {
  const pathname = usePathname();

  // Close sidebar when clicking outside (mobile only)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseAction();
      }
    };

    if (isOpen && !isDesktop) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onCloseAction, isDesktop]);

  const handleMobileNavClick = () => {
    // Only close on mobile, not desktop
    if (!isDesktop) {
      onCloseAction();
    }
  };

  const NavigationContent = () => (
    <div className="p-4 space-y-1">
      {navigation.map((item, index) => {
        // Render separator
        if ('separator' in item && item.separator) {
          return (
            <div
              key={`separator-${index}`}
              className="my-3 border-t border-slate-700/30"
            />
          );
        }

        // Type guard to ensure we have a NavigationItem
        const navItem = item as NavigationItem;
        const isActive = pathname === navItem.href;
        const IconComponent = navItem.icon;

        return (
          <Link
            key={navItem.name}
            href={navItem.href}
            onClick={handleMobileNavClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <IconComponent className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">{navItem.name}</span>
          </Link>
        );
      })}
    </div>
  );

  if (isDesktop) {
    // Desktop: Conditionally render sidebar - no space taken when closed
    if (!isOpen) {
      return null;
    }

    return (
      <div className="w-48 flex-shrink-0 bg-slate-900 border-r border-slate-700/50 transition-all duration-200 ease-out">
        <NavigationContent />
      </div>
    );
  }

  // Mobile: Overlay sidebar with smooth animations
  return (
    <>
      {/* Backdrop with fade animation */}
      <div
        className={`fixed inset-0 z-30 transition-all duration-200 ease-out ${
          isOpen ? 'bg-black/50' : 'bg-transparent pointer-events-none'
        }`}
        onClick={onCloseAction}
        aria-hidden="true"
      />

      {/* Sidebar overlay with slide + fade animation */}
      <div
        className={`fixed top-16 left-0 bottom-0 w-48 z-40 bg-slate-900 border-r border-slate-700/50 transition-all duration-200 ease-out ${
          isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
        style={{
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
