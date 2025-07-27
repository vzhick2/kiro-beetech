import { test, expect } from '@playwright/test';

test('CSS DEBUG: Why floating bar is invisible', async ({ page }) => {
  await page.goto('http://localhost:3005/testsuppliers');
  await page.waitForLoadState('networkidle');
  
  // Wait for data to load
  try {
    await page.waitForSelector('tbody tr', { timeout: 10000 });
  } catch (e) {
    console.log('No data loaded');
    return;
  }
  
  // Click a checkbox to trigger floating bar
  const checkboxes = page.locator('input[type="checkbox"]');
  if (await checkboxes.count() > 1) {
    await checkboxes.nth(1).click();
    await page.waitForTimeout(500);
    
    // Get detailed CSS information about the floating bar
    const floatingBarCSS = await page.evaluate(() => {
      const floatingBar = document.querySelector('.fixed.bottom-6');
      if (!floatingBar) return { error: 'Floating bar not found in DOM' };
      
      const computedStyle = window.getComputedStyle(floatingBar);
      const rect = floatingBar.getBoundingClientRect();
      
      return {
        // Position and size
        position: computedStyle.position,
        bottom: computedStyle.bottom,
        left: computedStyle.left,
        transform: computedStyle.transform,
        zIndex: computedStyle.zIndex,
        
        // Visibility
        display: computedStyle.display,
        visibility: computedStyle.visibility,
        opacity: computedStyle.opacity,
        
        // Dimensions
        width: computedStyle.width,
        height: computedStyle.height,
        
        // Bounding rect
        rect: {
          top: rect.top,
          left: rect.left,
          bottom: rect.bottom,
          right: rect.right,
          width: rect.width,
          height: rect.height
        },
        
        // Parent info
  offsetParent: (floatingBar as HTMLElement).offsetParent?.tagName || 'null',
  parentOverflow: floatingBar.parentElement ? window.getComputedStyle(floatingBar.parentElement).overflow : 'unknown',
        
  // Check if it's actually visible
  isVisible: (floatingBar as HTMLElement).offsetWidth > 0 && (floatingBar as HTMLElement).offsetHeight > 0,
        
        // Get all classes
        className: floatingBar.className,
        
        // Check for overlapping elements
        elementAtCenter: document.elementFromPoint(rect.left + rect.width/2, rect.top + rect.height/2)?.tagName || 'none'
      };
    });
    
    console.log('=== FLOATING BAR CSS DEBUG ===');
    console.log(JSON.stringify(floatingBarCSS, null, 2));
    
    // Check viewport dimensions
    const viewport = await page.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight,
      scrollY: window.scrollY
    }));
    
    console.log('=== VIEWPORT INFO ===');
    console.log(JSON.stringify(viewport, null, 2));
    
    // Check if there are any overlapping elements
    const overlappingElements = await page.evaluate(() => {
      const floatingBar = document.querySelector('.fixed.bottom-6');
      if (!floatingBar) return [];
      
      const rect = floatingBar.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const elementsAtPoint = [];
      let element = document.elementFromPoint(centerX, centerY);
      let depth = 0;
      
      while (element && depth < 10) {
        elementsAtPoint.push({
          tagName: element.tagName,
          className: element.className,
          zIndex: window.getComputedStyle(element).zIndex
        });
        element = element.parentElement;
        depth++;
      }
      
      return elementsAtPoint;
    });
    
    console.log('=== ELEMENTS AT FLOATING BAR POSITION ===');
    overlappingElements.forEach((el, i) => {
      console.log(`${i}: ${el.tagName}.${el.className} (z-index: ${el.zIndex})`);
    });
    
    // Take a screenshot highlighting the floating bar area
    await page.evaluate(() => {
      const floatingBar = document.querySelector('.fixed.bottom-6');
      if (floatingBar) {
        (floatingBar as HTMLElement).style.border = '5px solid red';
        (floatingBar as HTMLElement).style.backgroundColor = 'yellow';
      }
    });
    
    await page.screenshot({ path: 'floating-bar-highlighted.png', fullPage: true });
  }
});