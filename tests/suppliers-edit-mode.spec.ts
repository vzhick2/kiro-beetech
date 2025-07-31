import { test, expect } from '@playwright/test';

test.describe('Suppliers Table Edit Modes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/suppliers');
    await page.waitForLoadState('networkidle');
  });

  test('single row edit mode - cursor position and auto-save', async ({ page }) => {
    // Find the first supplier row
    const firstRow = page.locator('tbody tr').first();
    
    // Click edit button for single row edit
    await firstRow.locator('button[title="Edit"]').click();
    
    // Wait for edit mode to activate
    await page.waitForTimeout(500);
    
    // Find the name field and clear it
    const nameField = firstRow.locator('textarea').first();
    await nameField.click();
    await nameField.clear();
    
    // Type new text and verify cursor position
    await nameField.type('Test Supplier Name');
    
    // Verify the text appears correctly (not backwards)
    await expect(nameField).toHaveValue('Test Supplier Name');
    
    // Wait for auto-save to trigger (debounce time)
    await page.waitForTimeout(600);
    
    // Check for save indicator
    await expect(firstRow.locator('text=Saving...')).toBeVisible();
    await expect(firstRow.locator('text=Saved')).toBeVisible({ timeout: 3000 });
    
    // Add more text to verify cursor stays at the end
    await nameField.click();
    await nameField.press('End'); // Move to end
    await nameField.type(' Updated');
    
    // Verify the full text
    await expect(nameField).toHaveValue('Test Supplier Name Updated');
    
    // Check visual feedback - cell should have colored ring and background
    const cellDiv = nameField.locator('..').first();
    await expect(cellDiv).toHaveClass(/ring-2/);
    await expect(cellDiv).toHaveClass(/bg-blue-50/);
  });

  test('bulk edit mode - typing without losing focus', async ({ page }) => {
    // Click "Edit All" button
    await page.locator('button:has-text("Edit All")').click();
    
    // Wait for bulk edit mode to activate
    await page.waitForTimeout(500);
    
    // Find a cell and click it
    const firstNameCell = page.locator('tbody tr').first().locator('textarea').first();
    await firstNameCell.click();
    
    // Clear and type new text
    await firstNameCell.clear();
    await firstNameCell.type('Bulk Edit Test');
    
    // Verify the cell didn't lose focus
    await expect(firstNameCell).toBeFocused();
    
    // Type more characters to ensure normal typing works
    await firstNameCell.type(' - More Text');
    await expect(firstNameCell).toHaveValue('Bulk Edit Test - More Text');
    
    // Test Tab navigation
    await firstNameCell.press('Tab');
    
    // Should move to next cell (website field)
    const websiteCell = page.locator('tbody tr').first().locator('textarea').nth(1);
    await expect(websiteCell).toBeFocused();
    
    // Type in the new cell
    await websiteCell.type('https://example.com');
    await expect(websiteCell).toHaveValue('https://example.com');
  });

  test('visual feedback for changed cells', async ({ page }) => {
    // Enter single row edit mode
    const firstRow = page.locator('tbody tr').first();
    await firstRow.locator('button[title="Edit"]').click();
    
    // Make a change
    const nameField = firstRow.locator('textarea').first();
    await nameField.click();
    await nameField.clear();
    await nameField.type('Changed Value');
    
    // Check for visual feedback before save
    const cellDiv = nameField.locator('..').first();
    await expect(cellDiv).toHaveClass(/ring-2.*ring-blue-400.*bg-blue-50/);
    
    // Wait for auto-save
    await page.waitForTimeout(600);
    
    // Check saving state
    await expect(cellDiv).toHaveClass(/ring-2.*ring-orange-400.*bg-orange-50/);
    await expect(firstRow.locator('text=Saving...')).toBeVisible();
    
    // Check saved state
    await expect(cellDiv).toHaveClass(/ring-2.*ring-green-400.*bg-green-50/, { timeout: 3000 });
    await expect(firstRow.locator('text=Saved')).toBeVisible();
  });

  test('no row highlighting when typing in cells', async ({ page }) => {
    // Enter bulk edit mode
    await page.locator('button:has-text("Edit All")').click();
    await page.waitForTimeout(500);
    
    // Click on a cell
    const firstRow = page.locator('tbody tr').first();
    const nameCell = firstRow.locator('textarea').first();
    await nameCell.click();
    
    // Type something
    await nameCell.type('Test');
    
    // Verify the row doesn't get highlighted (no blue background)
    await expect(firstRow).not.toHaveClass(/bg-blue-50/);
    
    // The row should only have alternating row colors
    const rowIndex = await firstRow.evaluate(el => {
      const tbody = el.parentElement;
      return Array.from(tbody?.children || []).indexOf(el);
    });
    
    if (rowIndex % 2 === 0) {
      await expect(firstRow).toHaveClass(/bg-white/);
    } else {
      await expect(firstRow).toHaveClass(/bg-gray-50/);
    }
  });
});