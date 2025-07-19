'use client'

import { useEffect } from 'react'

/**
 * ViewportEnforcer - Ensures consistent viewport behavior across all pages
 * Prevents zoom issues on mobile devices by enforcing viewport settings
 */
export default function ViewportEnforcer() {
  useEffect(() => {
    // Function to enforce viewport settings
    const enforceViewport = () => {
      // Set viewport meta tag with strict settings
      let viewportMeta = document.querySelector('meta[name="viewport"]')
      
      if (!viewportMeta) {
        viewportMeta = document.createElement('meta')
        viewportMeta.setAttribute('name', 'viewport')
        document.head.appendChild(viewportMeta)
      }
      
      // Enforce strict viewport settings
      viewportMeta.setAttribute('content', 
        'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
      )
      
      // Prevent zoom on double-tap
      let lastTouchEnd = 0
      document.addEventListener('touchend', (event) => {
        const now = (new Date()).getTime()
        if (now - lastTouchEnd <= 300) {
          event.preventDefault()
        }
        lastTouchEnd = now
      }, false)
      
      // Prevent zoom on pinch gestures
      document.addEventListener('gesturestart', (event) => {
        event.preventDefault()
      }, { passive: false })
      
      document.addEventListener('gesturechange', (event) => {
        event.preventDefault()
      }, { passive: false })
      
      document.addEventListener('gestureend', (event) => {
        event.preventDefault()
      }, { passive: false })
      
      // Prevent zoom on input focus (iOS)
      const inputs = document.querySelectorAll('input, textarea, select')
      inputs.forEach(input => {
        input.addEventListener('focus', () => {
          // Ensure viewport stays at 1.0 scale
          const viewport = document.querySelector('meta[name="viewport"]')
          if (viewport) {
            viewport.setAttribute('content', 
              'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
            )
          }
        })
      })
    }
    
    // Run on mount
    enforceViewport()
    
    // Run on route changes (for SPA navigation)
    const handleRouteChange = () => {
      setTimeout(enforceViewport, 100) // Small delay to ensure DOM is ready
    }
    
    // Listen for navigation events
    window.addEventListener('popstate', handleRouteChange)
    
    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])
  
  return null // This component doesn't render anything
} 