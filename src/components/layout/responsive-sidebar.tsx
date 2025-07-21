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
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Items', href: '/items', icon: Package },
  { name: 'Batches', href: '/batches', icon: Factory },
  { name: 'Recipes', href: '/recipes', icon: ChefHat },
  { separator: true },
  { name: 'Purchases', href: '/purchases', icon: ShoppingCart },
  { name: 'Sales', href: '/sales', icon: TrendingUp },
  { name: 'Suppliers', href: '/suppliers', icon: Users },
  { separator: true },
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
}: ResponsiveSidebarProps): React.ReactElement | null {
  const pathname = usePathname();

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
    if (!isDesktop) {
      onCloseAction();
    }
  };

  const NavigationContent = () => (
    <div className="p-3 space-y-1">
      {navigation.map((item, index) => {
        if ('separator' in item && item.separator) {
          return (
            <div
              key={`separator-${index}`}
              className="my-3 border-t border-slate-700/30"
            />
          );
        }
        const navItem = item as NavigationItem;
        const isActive = pathname === navItem.href;
        const IconComponent = navItem.icon;
        return (
          <Link
            key={navItem.name}
            href={navItem.href}
            onClick={handleMobileNavClick}
            className={`flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-all duration-200 group ${
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
    if (!isOpen) {
      return null;
    }
    return (
      <div className="w-48 flex-shrink-0 bg-slate-900 border-r border-slate-700/50 transition-all duration-200 ease-out">
        <NavigationContent />
      </div>
    );
  }

  // Mobile: Fixed positioned sidebar with explicit viewport measurements
  return (
    <div
      className={`fixed top-16 left-0 bottom-0 bg-slate-900 border-r border-slate-700/50 transition-all duration-200 ease-out ${
        isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}
      style={{
        position: 'fixed',
        width: '8rem',
        height: 'calc(100vh - 4rem)',
        top: '4rem',
        left: '0',
        zIndex: 50,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        touchAction: 'manipulation',
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      <NavigationContent />
    </div>
  );
}
