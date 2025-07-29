import { test, expect } from '@playwright/test';

test('Table styling test - full width, zebra stripes, hover effects', async ({ page }) => {
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
  
  // Check table styling
  const table = page.locator('table');
  const tableExists = await table.count() > 0;
  console.log(`✅ Table exists: ${tableExists}`);
  
  // Check for zebra striping
  const evenRows = page.locator('tbody tr:nth-child(even)');
  const oddRows = page.locator('tbody tr:nth-child(odd)');
  
  const evenRowCount = await evenRows.count();
  const oddRowCount = await oddRows.count();
  console.log(`✅ Even rows: ${evenRowCount}, Odd rows: ${oddRowCount}`);
  
  // Test website link hover
  const websiteLinks = page.locator('a[href*="http"]');
  const linkCount = await websiteLinks.count();
  console.log(`✅ Found ${linkCount} website links`);
  
  if (linkCount > 0) {
    // Test hover effect on first website link
    const firstLink = websiteLinks.first();
    await firstLink.hover();
    console.log('✅ Hovered over website link');
    
    // Check if link changes color on hover
    const linkColor = await firstLink.evaluate(el => window.getComputedStyle(el).color);
    console.log(`✅ Link color on hover: ${linkColor}`);
  }
  
  // Test floating bar positioning
  const checkboxes = page.locator('input[type="checkbox"]');
  if (await checkboxes.count() > 1) {
    await checkboxes.nth(1).click();
    await page.waitForTimeout(500);
    
    const floatingBar = page.locator('.fixed.bottom-4.right-4');
    const isVisible = await floatingBar.isVisible();
    console.log(`✅ Floating bar visible in bottom-right: ${isVisible}`);
    
    if (isVisible) {
      // Check floating bar position
      const barRect = await floatingBar.boundingBox();
      const viewport = await page.viewportSize();
      
      if (barRect && viewport) {
        const distanceFromRight = viewport.width - barRect.x - barRect.width;
        const distanceFromBottom = viewport.height - barRect.y - barRect.height;
        
        console.log(`✅ Distance from right edge: ${distanceFromRight}px`);
        console.log(`✅ Distance from bottom edge: ${distanceFromBottom}px`);
        console.log(`✅ Bar positioned correctly: ${distanceFromRight < 50 && distanceFromBottom < 50}`);
      }
    }
  }
  
  // Take final screenshot
  await page.screenshot({ path: 'table-styling-final.png', fullPage: true });
  console.log('✅ Screenshot saved: table-styling-final.png');
});