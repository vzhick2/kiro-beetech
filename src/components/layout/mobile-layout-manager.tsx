'use client';

import { useState, useEffect } from 'react';
import { InteractiveHeader } from './interactive-header';
import { ResponsiveSidebar } from './responsive-sidebar';

interface MobileLayoutManagerProps {
  children: React.ReactNode;
}

export function MobileLayoutManager({ children }: MobileLayoutManagerProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Restore c32a068 initialization pattern - simplified and working
  useEffect(() => {
    const checkScreenSize = () => {
      // Simplified detection based on c32a068 working pattern
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      const isVeryNarrow = window.innerWidth < 480; // Extremely narrow
      
      // Desktop behavior: desktop browser on reasonable width
      // Mobile behavior: actual mobile device OR extremely narrow desktop
      const isDesktopSize = !isMobileDevice && !isVeryNarrow;
      setIsDesktop(isDesktopSize);

      if (!isInitialized) {
        setIsInitialized(true);

        // Get saved sidebar state for desktop (c32a068 pattern)
        if (isDesktopSize) {
          const savedState = localStorage.getItem('sidebar-open');
          const shouldBeOpen =
            savedState === null ? true : savedState === 'true';
          setIsSidebarOpen(shouldBeOpen);
        } else {
          // Mobile: always closed by default
          setIsSidebarOpen(false);
        }
      }
    };

    // Initial check
    checkScreenSize();

    // Listen for screen size changes
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [isInitialized]);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);

    // Save state for desktop only (c32a068 pattern)
    if (isDesktop) {
      localStorage.setItem('sidebar-open', newState.toString());
    }
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);

    // Save state for desktop only (c32a068 pattern)
    if (isDesktop) {
      localStorage.setItem('sidebar-open', 'false');
    }
  };

  // Prevent hydration mismatch - c32a068 pattern
  if (!isInitialized) {
    return (
      <div className="app-container">
        <InteractiveHeader
          onMobileMenuToggle={toggleSidebar}
          isMobileMenuOpen={false}
        />
        <div className="main-layout pt-16 flex">
          {/* Responsive Sidebar - Always rendered but controlled by visibility */}
          <ResponsiveSidebar
            isOpen={false}
            onClose={closeSidebar}
            isDesktop={false}
          />
          <div className="content-area flex-1 transition-all duration-200 ease-out">
            <main className="p-6">{children}</main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header - Fixed positioning handled by InteractiveHeader itself */}
      <InteractiveHeader
        onMobileMenuToggle={toggleSidebar}
        isMobileMenuOpen={isSidebarOpen}
      />

      {/* Main Layout - Below header with proper spacing - c32a068 pattern */}
      <div className="main-layout pt-16 flex">
        {/* Responsive Sidebar */}
        <ResponsiveSidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          isDesktop={isDesktop}
        />

        {/* Content Area - c32a068 pattern: Always starts from left, gets pushed when sidebar opens */}
        <div className="content-area flex-1 transition-all duration-200 ease-out">
          <main className="p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
