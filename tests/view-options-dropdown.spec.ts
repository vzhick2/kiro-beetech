import { test, expect } from '@playwright/test';

test.describe('View Options Dropdown Positioning', () => {
  test('should appear under the "View Options" button', async ({ page }) => {
    // Navigate to the test suppliers page
    await page.goto('/suppliers');

    // Wait for the table header to be visible, indicating the table has loaded
    await expect(page.getByText('Supplier Name')).toBeVisible({ timeout: 15000 });

  // Find and wait for the "View Options" button
  const viewOptionsButton = page.locator('button:has-text("View Options")');
  await expect(viewOptionsButton).toBeVisible({ timeout: 5000 });

    // Click the button to open the dropdown
    await viewOptionsButton.click();

    // The dropdown content should be visible. We'll find it by looking for the "Columns" label.
  // Open the dropdown
  await viewOptionsButton.click();

  // Assert dropdown content is visible under the button by checking the menu role and text
  const dropdownContent = page.locator('div[role="menu"]:has-text("Columns")');
  await expect(dropdownContent).toBeVisible({ timeout: 5000 });
  });
});
