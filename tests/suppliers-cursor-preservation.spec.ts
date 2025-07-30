import { test, expect } from '@playwright/test';

test.describe('Suppliers Table - Cursor Preservation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to suppliers page
    await page.goto('http://localhost:3001/suppliers');
    
    // Wait for the table to load
    await page.waitForSelector('[data-testid="suppliers-table"]', { timeout: 10000 });
  });

  test('cursor position should be preserved after auto-save in single row edit mode', async ({ page }) => {
    // Find a row with data and click the edit button
    const firstRow = page.locator('tbody tr').first();
    await firstRow.waitFor({ state: 'visible' });
    
    // Click the row edit button
    const editButton = firstRow.locator('button[aria-label="Edit"]');
    await editButton.click();
    
    // Wait for edit mode to activate
    await page.waitForTimeout(500);
    
    // Find the name input field (first editable cell)
    const nameInput = firstRow.locator('textarea').first();
    await nameInput.waitFor({ state: 'visible' });
    
    // Clear and type initial text
    await nameInput.click();
    await nameInput.fill('Test Supplier Name');
    
    // Place cursor at position 5 (after "Test ")
    await nameInput.evaluate((el: HTMLTextAreaElement) => {
      el.focus();
      el.setSelectionRange(5, 5);
    });
    
    // Type additional text
    await page.keyboard.type('ABC');
    
    // Get cursor position before auto-save
    const positionBefore = await nameInput.evaluate((el: HTMLTextAreaElement) => ({
      start: el.selectionStart,
      end: el.selectionEnd,
      isFocused: document.activeElement === el
    }));
    
    console.log('Position before auto-save:', positionBefore);
    expect(positionBefore.start).toBe(8); // After "Test ABC"
    expect(positionBefore.isFocused).toBe(true);
    
    // Wait for auto-save to trigger (500ms debounce + save time)
    await page.waitForTimeout(2000);
    
    // Check if input still has focus and cursor position
    const positionAfter = await nameInput.evaluate((el: HTMLTextAreaElement) => ({
      start: el.selectionStart,
      end: el.selectionEnd,
      value: el.value,
      isFocused: document.activeElement === el
    }));
    
    console.log('Position after auto-save:', positionAfter);
    
    // Verify focus was maintained
    expect(positionAfter.isFocused).toBe(true);
    
    // Verify cursor position was maintained
    expect(positionAfter.start).toBe(8);
    expect(positionAfter.end).toBe(8);
    
    // Verify we can continue typing
    await page.keyboard.type('DEF');
    
    // Wait a bit and check the final value
    await page.waitForTimeout(500);
    const finalValue = await nameInput.inputValue();
    expect(finalValue).toBe('Test ABCDEFSupplier Name');
  });

  test('all row edit mode should not lose focus when typing', async ({ page }) => {
    // Click the "Edit All" button
    const editAllButton = page.locator('button:has-text("Edit All")');
    await editAllButton.click();
    
    // Wait for spreadsheet mode to activate
    await page.waitForTimeout(500);
    
    // Find first editable cell
    const firstCell = page.locator('tbody tr').first().locator('textarea').first();
    await firstCell.waitFor({ state: 'visible' });
    
    // Click into the first cell
    await firstCell.click();
    await firstCell.fill('Updated Supplier');
    
    // Place cursor in middle of text
    await firstCell.evaluate((el: HTMLTextAreaElement) => {
      el.focus();
      el.setSelectionRange(7, 7); // After "Updated"
    });
    
    // Type more text
    await page.keyboard.type(' Test');
    
    // Wait for debounce (300ms for all row mode)
    await page.waitForTimeout(500);
    
    // Verify focus is maintained
    const afterDebounce = await firstCell.evaluate((el: HTMLTextAreaElement) => ({
      isFocused: document.activeElement === el,
      value: el.value,
      start: el.selectionStart,
      end: el.selectionEnd
    }));
    
    expect(afterDebounce.isFocused).toBe(true);
    expect(afterDebounce.value).toBe('Updated Test Supplier');
    expect(afterDebounce.start).toBe(12); // After "Updated Test"
    
    // Press Tab to move to next cell
    await page.keyboard.press('Tab');
    
    // Verify next cell has focus
    const secondCell = page.locator('tbody tr').first().locator('textarea').nth(1);
    const hasSecondCellFocus = await secondCell.evaluate(el => document.activeElement === el);
    expect(hasSecondCellFocus).toBe(true);
  });

  test('cursor position should be preserved with text selection', async ({ page }) => {
    // Enter single row edit mode
    const firstRow = page.locator('tbody tr').first();
    const editButton = firstRow.locator('button[aria-label="Edit"]');
    await editButton.click();
    
    await page.waitForTimeout(500);
    
    // Find a text field
    const notesInput = firstRow.locator('textarea[placeholder*="notes"]');
    await notesInput.waitFor({ state: 'visible' });
    
    // Set some initial text
    await notesInput.fill('This is a test note with some content');
    
    // Select "test" word
    await notesInput.evaluate((el: HTMLTextAreaElement) => {
      el.focus();
      const text = el.value;
      const start = text.indexOf('test');
      el.setSelectionRange(start, start + 4);
    });
    
    // Get selection before typing
    const selectionBefore = await notesInput.evaluate((el: HTMLTextAreaElement) => ({
      start: el.selectionStart,
      end: el.selectionEnd,
      selectedText: el.value.substring(el.selectionStart, el.selectionEnd)
    }));
    
    expect(selectionBefore.selectedText).toBe('test');
    
    // Type to replace selection
    await page.keyboard.type('demo');
    
    // Wait for auto-save
    await page.waitForTimeout(2000);
    
    // Verify input still has focus and cursor is after "demo"
    const afterSave = await notesInput.evaluate((el: HTMLTextAreaElement) => ({
      isFocused: document.activeElement === el,
      value: el.value,
      start: el.selectionStart,
      end: el.selectionEnd
    }));
    
    expect(afterSave.isFocused).toBe(true);
    expect(afterSave.value).toBe('This is a demo note with some content');
    expect(afterSave.start).toBe(14); // After "This is a demo"
  });
});