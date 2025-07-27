import { test, expect } from '@playwright/test';

test('Test Suppliers floating bar functionality', async ({ page }) => {
  // Navigate to the test suppliers page
  await page.goto('http://localhost:3000/testsuppliers');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot of the initial state
  await page.screenshot({ path: 'testsuppliers-initial.png', fullPage: true });
  
  // Look for checkboxes in the table
  const checkboxes = page.locator('input[type="checkbox"]');
  const checkboxCount = await checkboxes.count();
  console.log(`Found ${checkboxCount} checkboxes`);
  
  if (checkboxCount > 1) {
    // Click the first data row checkbox (skip header checkbox)
    await checkboxes.nth(1).click();
    
    // Wait a moment for any animations
    await page.waitForTimeout(500);
    
    // Check if floating bar appears
    const floatingBar = page.locator('.fixed.bottom-6');
    const isVisible = await floatingBar.isVisible();
    console.log(`Floating bar visible: ${isVisible}`);
    
    // Take screenshot with selection
    await page.screenshot({ path: 'testsuppliers-selected.png', fullPage: true });
    
    // Try to find any element with "selected" text
    const selectedText = page.locator('text=selected');
    const selectedExists = await selectedText.count();
    console.log(`Elements with "selected" text: ${selectedExists}`);
    
    // Check for any fixed positioned elements
    const fixedElements = page.locator('[class*="fixed"]');
    const fixedCount = await fixedElements.count();
    console.log(`Fixed positioned elements: ${fixedCount}`);
    
    if (fixedCount > 0) {
      for (let i = 0; i < fixedCount; i++) {
        const element = fixedElements.nth(i);
        const classes = await element.getAttribute('class');
        console.log(`Fixed element ${i}: ${classes}`);
      }
    }
  } else {
    console.log('No data checkboxes found');
  }
});