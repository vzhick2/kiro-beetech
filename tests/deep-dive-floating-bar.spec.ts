import { test, expect } from '@playwright/test';

test('DEEP DIVE: Floating action bar investigation', async ({ page }) => {
  // Listen for all console messages
  page.on('console', msg => {
    console.log(`[${msg.type().toUpperCase()}]`, msg.text());
  });
  
  // Listen for network requests
  page.on('request', request => {
    if (request.url().includes('suppliers')) {
      console.log('API REQUEST:', request.url());
    }
  });
  
  page.on('response', async response => {
    if (response.url().includes('suppliers')) {
      console.log('API RESPONSE:', response.url(), response.status());
      if (response.url().includes('supabase.co')) {
        try {
          const responseText = await response.text();
          console.log('SUPABASE RESPONSE BODY:', responseText.substring(0, 500));
        } catch (e) {
          console.log('Could not read response body:', e);
        }
      }
    }
  });

  console.log('=== NAVIGATING TO http://localhost:3005/testsuppliers ===');
  await page.goto('http://localhost:3005/testsuppliers');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  console.log('=== CHECKING PAGE STATE ===');
  const title = await page.title();
  console.log('Page title:', title);
  
  // Wait for either data or error state (longer timeout)
  console.log('=== WAITING FOR DATA TO LOAD ===');
  try {
    await page.waitForSelector('table tbody tr, text="Failed to load suppliers", text="No suppliers found"', { 
      timeout: 15000 
    });
    console.log('✅ Data loaded or error state reached');
  } catch (e) {
    console.log('❌ Timeout waiting for data - still in loading state');
  }
  
  // Take screenshot of current state
  await page.screenshot({ path: 'deep-dive-current-state.png', fullPage: true });
  
  // Check all possible states
  const states = {
    hasTable: await page.locator('table').count() > 0,
    hasTableBody: await page.locator('tbody').count() > 0,
    hasTableRows: await page.locator('tbody tr').count(),
    hasCheckboxes: await page.locator('input[type="checkbox"]').count(),
    isLoading: await page.locator('text=Loading suppliers').isVisible(),
    hasError: await page.locator('text=Failed to load suppliers').isVisible(),
    hasNoData: await page.locator('text=No suppliers found').isVisible(),
  };
  
  console.log('=== PAGE STATE ANALYSIS ===');
  Object.entries(states).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
  
  if (states.hasTableRows > 0) {
    console.log('=== FOUND TABLE WITH DATA - TESTING SELECTION ===');
    
    // Get all checkboxes
    const checkboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    console.log(`Total checkboxes found: ${checkboxCount}`);
    
    if (checkboxCount > 1) {
      // Click the first data row checkbox (skip header)
      console.log('Clicking first data row checkbox...');
      await checkboxes.nth(1).click();
      
      // Wait for any state changes
      await page.waitForTimeout(1000);
      
      // Take screenshot after selection
      await page.screenshot({ path: 'deep-dive-after-selection.png', fullPage: true });
      
      console.log('=== SEARCHING FOR FLOATING BAR ===');
      
      // Check for floating bar with multiple selectors
      const floatingBarSelectors = [
        '.fixed.bottom-6',
        '.fixed',
        '[class*="fixed"]',
        'text=items selected',
        'text=selected',
        '[class*="bottom-6"]',
        '[class*="z-50"]'
      ];
      
      for (const selector of floatingBarSelectors) {
        const elements = page.locator(selector);
        const count = await elements.count();
        console.log(`Selector "${selector}": ${count} elements found`);
        
        if (count > 0) {
          for (let i = 0; i < count; i++) {
            const element = elements.nth(i);
            const isVisible = await element.isVisible();
            const classes = await element.getAttribute('class');
            const text = await element.textContent();
            console.log(`  Element ${i}: visible=${isVisible}, classes="${classes}", text="${text?.substring(0, 50)}..."`);
          }
        }
      }
      
      // Check if selectedRows state is working
      console.log('=== CHECKING COMPONENT STATE ===');
      
      // Look for any elements that might indicate selection state
      const selectedIndicators = await page.locator('[class*="blue-50"], [class*="selected"], [style*="blue"]').count();
      console.log(`Elements with selection styling: ${selectedIndicators}`);
      
      // Check if the row is highlighted
      const highlightedRows = await page.locator('tr[class*="blue"]').count();
      console.log(`Highlighted table rows: ${highlightedRows}`);
      
      // Try to find the floating bar in the DOM even if not visible
      const floatingBarInDOM = await page.evaluate(() => {
        const elements = document.querySelectorAll('[class*="fixed"]');
        const results = [];
        elements.forEach((el, index) => {
          results.push({
            index,
            classes: el.className,
            visible: el.offsetParent !== null,
            text: el.textContent?.substring(0, 100),
            styles: window.getComputedStyle(el).cssText.substring(0, 200)
          });
        });
        return results;
      });
      
      console.log('=== FIXED ELEMENTS IN DOM ===');
      floatingBarInDOM.forEach(el => {
        console.log(`Element ${el.index}:`);
        console.log(`  Classes: ${el.classes}`);
        console.log(`  Visible: ${el.visible}`);
        console.log(`  Text: ${el.text}`);
        console.log(`  Styles: ${el.styles}`);
        console.log('---');
      });
      
      // Check React component state by looking at the DOM
      const reactState = await page.evaluate(() => {
        // Look for any elements that might contain React state info
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const checkedCount = Array.from(checkboxes).filter(cb => (cb as HTMLInputElement).checked).length;
        return {
          totalCheckboxes: checkboxes.length,
          checkedCheckboxes: checkedCount,
          hasFixedElements: document.querySelectorAll('.fixed').length,
          hasBottomElements: document.querySelectorAll('[class*="bottom"]').length,
          hasZIndexElements: document.querySelectorAll('[class*="z-"]').length
        };
      });
      
      console.log('=== REACT STATE ANALYSIS ===');
      Object.entries(reactState).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });
      
    } else {
      console.log('❌ No data checkboxes found');
    }
  } else {
    console.log('❌ No table rows found - cannot test floating bar');
  }
  
  // Final screenshot
  await page.screenshot({ path: 'deep-dive-final-state.png', fullPage: true });
});