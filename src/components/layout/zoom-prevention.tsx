'use client';

import { useEffect } from 'react';

/**
 * ZoomPrevention component - Actively prevents zoom on mobile devices
 *
 * This component uses multiple strategies to prevent zoom:
 * 1. Prevents double-tap zoom
 * 2. Prevents pinch-to-zoom gestures
 * 3. Prevents zoom on input focus
 * 4. Dynamically adjusts viewport meta tag
 */
export function ZoomPrevention() {
  useEffect(() => {
    let lastTouchEnd = 0;

    // Prevent double-tap zoom
    const preventDoubleTapZoom = (e: TouchEvent) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    // Prevent pinch-to-zoom
    const preventPinchZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Prevent wheel zoom (Ctrl+scroll)
    const preventWheelZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // Prevent keyboard zoom shortcuts
    const preventKeyboardZoom = (e: KeyboardEvent) => {
      if (
        e.ctrlKey &&
        (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')
      ) {
        e.preventDefault();
      }
    };

    // Force viewport settings dynamically
    const forceViewportSettings = () => {
      let viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.setAttribute('name', 'viewport');
        document.head.appendChild(viewport);
      }
      viewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, shrink-to-fit=no, viewport-fit=cover'
      );
    };

    // Apply zoom prevention
    forceViewportSettings();

    // Add event listeners
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

    // Force viewport settings periodically (some browsers reset it)
    const intervalId = setInterval(forceViewportSettings, 1000);

    // Cleanup
    return () => {
      document.removeEventListener('touchend', preventDoubleTapZoom);
      document.removeEventListener('touchstart', preventPinchZoom);
      document.removeEventListener('touchmove', preventPinchZoom);
      document.removeEventListener('wheel', preventWheelZoom);
      document.removeEventListener('keydown', preventKeyboardZoom);
      clearInterval(intervalId);
    };
  }, []);

  return null; // This component doesn't render anything
}
