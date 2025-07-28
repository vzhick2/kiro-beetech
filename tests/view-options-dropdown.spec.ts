import { test, expect } from '@playwright/test';

test.describe('View Options Dropdown Positioning', () => {
  test('should appear under the "View Options" button', async ({ page }) => {
    // Navigate to the test suppliers page
    await page.goto('/testsuppliers');

    // Wait for the table header to be visible, indicating the table has loaded
    await expect(page.getByText('Supplier Name')).toBeVisible({ timeout: 15000 });

    // Find the "View Options" button
    const viewOptionsButton = page.getByRole('button', { name: 'View Options' });
    await expect(viewOptionsButton).toBeVisible();

    // Click the button to open the dropdown
    await viewOptionsButton.click();

    // The dropdown content should be visible. We'll find it by looking for the "Columns" label.
    const dropdownContent = page.getByText('Columns').locator('ancestor::div[role="menu"]');
    await expect(dropdownContent).toBeVisible();

    // Take a screenshot to visually verify the position
    await expect(page).toHaveScreenshot('view-options-dropdown-positioned-correctly.png');
  });
});
