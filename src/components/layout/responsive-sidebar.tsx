'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

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

  // Android-optimized touch handling
  const handleTouchStart = (e: React.TouchEvent, href: string) => {
    console.log('🔍 Android touch start:', href);
    e.stopPropagation();
    
    const touch = e.touches[0];
    if (touch) {
      setTouchStart({ x: touch.clientX, y: touch.clientY });
    }
    
    // Visual feedback for Android
    const target = e.currentTarget as HTMLElement;
    target.style.backgroundColor = 'rgb(30 41 59 / 0.8)';
  };

  const handleTouchEnd = (e: React.TouchEvent, href: string) => {
    console.log('🔍 Android touch end:', href);
    e.preventDefault();
    e.stopPropagation();
    
    // Reset visual feedback
    const target = e.currentTarget as HTMLElement;
    target.style.backgroundColor = '';
    
    if (!touchStart) return;
    
    const touch = e.changedTouches[0];
    if (!touch) return;
    
    const deltaX = Math.abs(touch.clientX - touchStart.x);
    const deltaY = Math.abs(touch.clientY - touchStart.y);
    
    // Only navigate if it's a tap (not a scroll)
    if (deltaX < 10 && deltaY < 10) {
      console.log('🔍 Valid Android tap detected, navigating to:', href);
      
      // Force navigation and close sidebar
      router.push(href);
      
      if (!isDesktop) {
        setTimeout(() => {
          onCloseAction();
        }, 50);
      }
    }
    
    setTouchStart(null);
  };

  // Fallback click handler for non-touch devices
  const handleClick = (e: React.MouseEvent, href: string) => {
    console.log('🔍 Click handler:', href);
    e.preventDefault();
    e.stopPropagation();
    
    router.push(href);
    
    if (!isDesktop) {
      setTimeout(() => {
        onCloseAction();
      }, 50);
    }
  };

  const NavigationContent = () => (
    <div className="p-3 space-y-1">
      {navigation.map((item, index) => {
        if ('separator' in item && item.separator) {
          return (
            <div
              key={`separator-${index}`}
              className="my-2 border-t border-slate-700/30"
            />
          );
        }
        const navItem = item as NavigationItem;
        const isActive = pathname === navItem.href;
        const IconComponent = navItem.icon;
        
        return (
          <div
            key={navItem.name}
            onTouchStart={(e) => handleTouchStart(e, navItem.href)}
            onTouchEnd={(e) => handleTouchEnd(e, navItem.href)}
            onClick={(e) => handleClick(e, navItem.href)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 group cursor-pointer select-none ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-slate-800 active:bg-slate-700'
            }`}
            style={{
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              userSelect: 'none',
              minHeight: '44px', // Larger touch target for Android
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <IconComponent className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">{navItem.name}</span>
          </div>
        );
      })}
    </div>
  );

  if (isDesktop) {
    if (!isOpen) {
      return null;
    }
    return (
      <div className="w-52 flex-shrink-0 bg-slate-900 border-r border-slate-700/50 transition-all duration-200 ease-out">
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
        width: '12rem',
        height: 'calc(100vh - 4rem)',
        top: '4rem',
        left: '0',
        zIndex: 60,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        touchAction: 'manipulation',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
      <NavigationContent />
    </div>
  );
}
