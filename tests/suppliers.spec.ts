import { test, expect } from '@playwright/test';

// General UI/feature checks for the SUPPLIERS page

test.describe('SUPPLIERS Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/suppliers');
  });

  test('should render the page title and description', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /suppliers/i })).toBeVisible();
    await expect(page.getByText(/manage your supplier relationships/i)).toBeVisible();
  });

  test('should show the View Options gear icon and open the menu', async ({ page }) => {
    const gearButton = page.getByRole('button', { name: /view options/i });
    await expect(gearButton).toBeVisible();
    await gearButton.click();
    await expect(page.getByText(/columns/i)).toBeVisible();
    await expect(page.getByText(/display options/i)).toBeVisible();
  });

  test('should show pagination controls', async ({ page }) => {
    await expect(page.getByText(/rows per page/i)).toBeVisible();
    await expect(page.getByText(/page/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /next/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /previous/i })).toBeVisible();
  });

  test('should allow searching suppliers', async ({ page }) => {
    const searchBox = page.getByPlaceholder('Search suppliers...');
    await expect(searchBox).toBeVisible();
    await searchBox.fill('test');
    // Optionally check for filtered results
  });

  test('should show spreadsheet mode floating action bar when activated', async ({ page }) => {
    // Simulate entering spreadsheet mode (assume shortcut or button)
    // This may need to be updated based on actual UI
    // Example: click a button or press a key
    // await page.keyboard.press('F2');
    // For now, just check if the bar exists (if spreadsheet mode is default or easy to trigger)
    await expect(page.getByRole('button', { name: /apply changes/i })).toBeVisible();
    await expect(page.getByText(/tab: next field/i)).toBeVisible();
    await expect(page.getByText(/navigate/i)).toBeVisible();
    await expect(page.getByText(/esc: exit/i)).toBeVisible();
  });
});
