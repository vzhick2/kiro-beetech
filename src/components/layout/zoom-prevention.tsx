'use client';

import { useEffect, useState } from 'react';

/**
 * Smart ZoomPrevention component - Prevents zoom on mobile, allows zoom in desktop mode
 *
 * This component intelligently detects desktop mode vs mobile mode:
 * - Mobile mode: Prevents all zoom (double-tap, pinch, etc.)
 * - Desktop mode: Allows zoom but prevents accidental zoom
 * - Adapts when users switch between modes
 */
export function ZoomPrevention() {
  const [isDesktopMode, setIsDesktopMode] = useState(false);

  useEffect(() => {
    // Detect if user is in desktop mode on a mobile device
    const detectDesktopMode = (): boolean => {
      // Check if it's a touch device
      const isTouchDevice =
        'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // If not a touch device, it's probably actual desktop
      if (!isTouchDevice) return true;

      // Check viewport vs screen dimensions (desktop mode usually shows smaller viewport)
      const viewportWidth = window.innerWidth;
      const screenWidth = window.screen.width;
      const viewportHeight = window.innerHeight;
      const screenHeight = window.screen.height;

      // Desktop mode indicators:
      // 1. Viewport is much smaller than screen (browser chrome visible)
      // 2. High pixel density with large viewport
      // 3. User agent contains desktop indicators
      const viewportRatio =
        (viewportWidth * viewportHeight) / (screenWidth * screenHeight);
      const isLargeViewport = viewportWidth >= 1024; // Desktop-like width
      const userAgent = navigator.userAgent.toLowerCase();
      const hasDesktopUA =
        userAgent.includes('desktop') ||
        userAgent.includes('x11') ||
        (userAgent.includes('chrome') && !userAgent.includes('mobile'));

      // Consider it desktop mode if:
      // - Large viewport width (>= 1024px) OR
      // - User agent suggests desktop mode OR
      // - Viewport ratio < 0.8 (significant browser chrome)
      return isLargeViewport || hasDesktopUA || viewportRatio < 0.8;
    };

    const updateDesktopMode = () => {
      setIsDesktopMode(detectDesktopMode());
    };

    // Initial detection
    updateDesktopMode();

    // Re-detect on orientation change or resize
    const handleResize = () => {
      // Debounce to avoid excessive calls
      setTimeout(updateDesktopMode, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  useEffect(() => {
    let lastTouchEnd = 0;

    // Prevent double-tap zoom (only in mobile mode)
    const preventDoubleTapZoom = (e: TouchEvent) => {
      if (isDesktopMode) return; // Allow in desktop mode

      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    // Prevent pinch-to-zoom (only in mobile mode)
    const preventPinchZoom = (e: TouchEvent) => {
      if (isDesktopMode) return; // Allow in desktop mode

      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Smart wheel zoom prevention
    const preventWheelZoom = (e: WheelEvent) => {
      if (isDesktopMode) {
        // In desktop mode, only prevent accidental zoom (very fast scrolling)
        if (e.ctrlKey && Math.abs(e.deltaY) > 50) {
          // Allow slow/deliberate zoom, prevent fast accidental zoom
          return;
        }
      } else {
        // In mobile mode, prevent all ctrl+scroll zoom
        if (e.ctrlKey) {
          e.preventDefault();
        }
      }
    };

    // Smart keyboard zoom prevention
    const preventKeyboardZoom = (e: KeyboardEvent) => {
      if (isDesktopMode) {
        // In desktop mode, allow zoom shortcuts
        return;
      }

      // In mobile mode, prevent zoom shortcuts
      if (
        e.ctrlKey &&
        (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')
      ) {
        e.preventDefault();
      }
    };

    // Dynamic viewport settings based on mode
    const updateViewportSettings = () => {
      let viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.setAttribute('name', 'viewport');
        document.head.appendChild(viewport);
      }

      if (isDesktopMode) {
        // Desktop mode: Allow zoom but set sensible limits
        viewport.setAttribute(
          'content',
          'width=device-width, initial-scale=1.0, maximum-scale=3.0, minimum-scale=0.5, user-scalable=yes, viewport-fit=cover'
        );
      } else {
        // Mobile mode: Prevent zoom
        viewport.setAttribute(
          'content',
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, shrink-to-fit=no, viewport-fit=cover'
        );
      }
    };

    // Apply current settings
    updateViewportSettings();

    // Add event listeners with appropriate behavior
    document.addEventListener('touchend', preventDoubleTapZoom, {
      passive: false,
    });
    document.addEventListener('touchstart', preventPinchZoom, {
      passive: false,
    });
    document.addEventListener('touchmove', preventPinchZoom, {
      passive: false,
    });
    document.addEventListener('wheel', preventWheelZoom, { passive: false });
    document.addEventListener('keydown', preventKeyboardZoom, {
      passive: false,
    });

    // Update viewport periodically, but less aggressively
    const intervalId = setInterval(updateViewportSettings, 5000);

    // Cleanup
    return () => {
      document.removeEventListener('touchend', preventDoubleTapZoom);
      document.removeEventListener('touchstart', preventPinchZoom);
      document.removeEventListener('touchmove', preventPinchZoom);
      document.removeEventListener('wheel', preventWheelZoom);
      document.removeEventListener('keydown', preventKeyboardZoom);
      clearInterval(intervalId);
    };
  }, [isDesktopMode]); // Re-run when desktop mode changes

  return null; // This component doesn't render anything
}
