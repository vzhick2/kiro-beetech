import { test, expect } from '@playwright/test';

test('Test Suppliers floating bar functionality', async ({ page }) => {
  // Listen for console messages
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  
  // Listen for network errors
  page.on('requestfailed', request => {
    console.log('NETWORK ERROR:', request.url(), request.failure()?.errorText);
  });
  
  // Navigate to the test suppliers page
  await page.goto('http://localhost:3000/suppliers');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  console.log('Waiting for data to load or error to appear...');
  
  // Wait for either data to load or error to appear (max 10 seconds)
  try {
    await page.waitForSelector('table, text="Failed to load suppliers", text="No suppliers found"', { timeout: 10000 });
  } catch (e) {
    console.log('Timeout waiting for data or error state');
  }
  
  // Take a screenshot of the current state
  await page.screenshot({ path: 'suppliers-current-state.png', fullPage: true });
  
  // Check what state we're in
  const hasTable = await page.locator('table').count() > 0;
  const hasError = await page.locator('text=Failed to load suppliers').isVisible();
  const hasNoData = await page.locator('text=No suppliers found').isVisible();
  const isLoading = await page.locator('text=Loading suppliers').isVisible();
  
  console.log(`Has table: ${hasTable}`);
  console.log(`Has error: ${hasError}`);
  console.log(`Has no data message: ${hasNoData}`);
  console.log(`Still loading: ${isLoading}`);
  
  if (hasTable) {
    console.log('Table found! Checking for checkboxes...');
    
    const checkboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    console.log(`Found ${checkboxCount} checkboxes`);
    
    const tableRows = page.locator('tbody tr');
    const rowCount = await tableRows.count();
    console.log(`Table rows found: ${rowCount}`);
    
    if (checkboxCount > 1 && rowCount > 0) {
      console.log('Clicking first data row checkbox...');
      
      // Click the first data row checkbox (skip header checkbox)
      await checkboxes.nth(1).click();
      
      // Wait for floating bar to appear
      await page.waitForTimeout(500);
      
      // Look for floating bar
      const floatingBar = page.locator('.fixed.bottom-6');
      const floatingBarVisible = await floatingBar.isVisible();
      console.log(`Floating bar visible: ${floatingBarVisible}`);
      
      // Look for "items selected" text
      const selectedText = page.locator('text=items selected');
      const selectedTextVisible = await selectedText.isVisible();
      console.log(`"items selected" text visible: ${selectedTextVisible}`);
      
      // Take screenshot with selection
      await page.screenshot({ path: 'suppliers-with-selection.png', fullPage: true });
      
      if (!floatingBarVisible && !selectedTextVisible) {
        console.log('Floating bar not found! Checking for any fixed elements...');
        const fixedElements = page.locator('[class*="fixed"]');
        const fixedCount = await fixedElements.count();
        console.log(`Fixed elements found: ${fixedCount}`);
        
        for (let i = 0; i < Math.min(fixedCount, 5); i++) {
          const element = fixedElements.nth(i);
          const classes = await element.getAttribute('class');
          const isVisible = await element.isVisible();
          console.log(`Fixed element ${i}: ${classes}, visible: ${isVisible}`);
        }
      }
    }
  } else if (hasError) {
    console.log('Error loading suppliers - check database connection');
  } else if (hasNoData) {
    console.log('No suppliers in database - need to add test data');
  } else {
    console.log('Still in loading state - possible database connection issue');
  }
});