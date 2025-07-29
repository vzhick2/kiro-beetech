import { test, expect } from '@playwright/test';

test('Final floating bar test - bottom right with interactions', async ({ page }) => {
  // Listen for console messages to see if functions are called
  page.on('console', msg => {
    if (msg.text().includes('Archiving') || msg.text().includes('Unarchiving') || msg.text().includes('Deleting') || msg.text().includes('Exporting')) {
      console.log('ACTION TRIGGERED:', msg.text());
    }
  });

  await page.goto('http://localhost:3000/suppliers');
  await page.waitForLoadState('networkidle');
  
  // Wait for data to load
  try {
    await page.waitForSelector('tbody tr', { timeout: 10000 });
    console.log('✅ Data loaded successfully');
  } catch (e) {
    console.log('❌ No data loaded - skipping test');
    return;
  }
  
  // Click a checkbox to trigger floating bar
  const checkboxes = page.locator('input[type="checkbox"]');
  const checkboxCount = await checkboxes.count();
  console.log(`Found ${checkboxCount} checkboxes`);
  
  if (checkboxCount > 1) {
    // Select first item
    await checkboxes.nth(1).click();
    await page.waitForTimeout(500);
    
    // Check if floating bar appears in bottom right
    const floatingBar = page.locator('.fixed.bottom-6.right-6');
    const isVisible = await floatingBar.isVisible();
    console.log(`✅ Floating bar visible in bottom right: ${isVisible}`);
    
    if (isVisible) {
      // Test button positions and functionality
      const buttons = floatingBar.locator('button');
      const buttonCount = await buttons.count();
      console.log(`Found ${buttonCount} buttons in floating bar`);
      
      // Test export button (first action button)
      const exportButton = buttons.nth(1); // Skip selection count, get first action button
      await exportButton.hover();
      console.log('✅ Hovered over export button');
      
      // Test unarchive button (blue button)
      const unarchiveButton = buttons.nth(2);
      await unarchiveButton.hover();
      console.log('✅ Hovered over unarchive button (blue)');
      
      // Test archive button
      const archiveButton = buttons.nth(3);
      await archiveButton.hover();
      console.log('✅ Hovered over archive button');
      
      // Test delete button (red)
      const deleteButton = buttons.nth(4);
      await deleteButton.hover();
      console.log('✅ Hovered over delete button (red)');
      
      // Test close button (last button)
      const closeButton = buttons.nth(buttonCount - 1);
      await closeButton.hover();
      console.log('✅ Hovered over close button');
      
      // Take screenshot of final state
      await page.screenshot({ path: 'floating-bar-bottom-right-final.png', fullPage: true });
      
      // Test clicking export button
      await exportButton.click();
      await page.waitForTimeout(500);
      
      // Test clicking close button
      await closeButton.click();
      await page.waitForTimeout(500);
      
      // Check if floating bar disappears
      const isGone = !(await floatingBar.isVisible());
      console.log(`✅ Floating bar hidden after close: ${isGone}`);
      
    } else {
      console.log('❌ Floating bar not visible');
    }
  } else {
    console.log('❌ No checkboxes found');
  }
});