'use client';

import { useRef, useEffect, useCallback } from 'react';

interface FocusState {
  cursorStart: number;
  cursorEnd: number;
}

// Global store for focus states to persist across re-renders
const focusStates = new Map<string, FocusState>();

/**
 * Hook to preserve focus and cursor position during re-renders
 * Solves the problem of losing focus when parent components re-render
 */
export function useFocusPreservation(
  elementRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>,
  uniqueKey: string,
  isActive: boolean
) {
  const focusStateRef = useRef<FocusState | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Track cursor position while element is focused
  const trackCursor = useCallback(() => {
    if (!elementRef.current || !isActive) return;

    const element = elementRef.current;
    if (document.activeElement === element) {
      const state: FocusState = {
        cursorStart: element.selectionStart || 0,
        cursorEnd: element.selectionEnd || 0,
      };
      focusStateRef.current = state;
      focusStates.set(uniqueKey, state);
    }
  }, [elementRef, uniqueKey, isActive]);

  // Set up cursor tracking interval
  useEffect(() => {
    if (!isActive) return;

    const intervalId = setInterval(trackCursor, 100);
    return () => clearInterval(intervalId);
  }, [trackCursor, isActive]);

  // Restore focus after re-renders
  useEffect(() => {
    if (!isActive || !elementRef.current) return;

    const element = elementRef.current;
    const savedState = focusStates.get(uniqueKey);

    // If we have a saved state and element isn't focused, restore it
    if (savedState && document.activeElement !== element) {
      // Use RAF to ensure DOM is ready
      rafIdRef.current = requestAnimationFrame(() => {
        if (!element || document.activeElement === element) return;

        console.log(`🎯 Restoring focus for ${uniqueKey}`);
        element.focus();
        
        // Restore cursor position
        if ('setSelectionRange' in element) {
          element.setSelectionRange(savedState.cursorStart, savedState.cursorEnd);
        }
      });
    }
  }, [elementRef, uniqueKey, isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      // Don't remove from global store - might remount quickly
    };
  }, []);

  // Manual focus handler that saves state
  const handleFocus = useCallback(() => {
    focusStates.set(uniqueKey, {
      cursorStart: 0,
      cursorEnd: 0,
    });
    trackCursor();
  }, [uniqueKey, trackCursor]);

  // Manual blur handler that cleans up
  const handleBlur = useCallback(() => {
    // Keep the state for a bit in case of quick re-render
    setTimeout(() => {
      focusStates.delete(uniqueKey);
    }, 500);
  }, [uniqueKey]);

  return {
    handleFocus,
    handleBlur,
    trackCursor,
  };
}