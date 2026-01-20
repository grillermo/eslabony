import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
    test('should display links and filter tabs', async ({ page }) => {
        // Start from home page
        await page.goto('/');

        // Check title
        await expect(page.locator('h1')).toHaveText('Link Saver');

        // Check Tabs
        await expect(page.getByRole('button', { name: 'Unread', exact: true })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Read', exact: true })).toBeVisible();

        // Verification of "No links found" or actual links depends on DB state
        // Since we are running against the persistent dev database, state is unpredictable unless we seed/clean.
        // For this basic test, we just ensure the structure is correct.

        // We can try to add a link via API and see if it appears (Integration test style)
        const newLinkUrl = `https://test-link-${Date.now()}.com`;

        // Create a link via API request attached to the page context
        await page.request.post('/api/links', {
            headers: {
                'Authorization': '44p9Wq6iJRxp4DE2vp4b3Yw6KWhRjcNohjDetwwRNy4K7cyUcxdwuWTUxVZUJkhWVjU'
            },
            data: {
                link: newLinkUrl,
                note: 'Playwright Test Link'
            }
        });

        await page.reload();

        // Should be in "Unread" by default
        await expect(page.getByText(newLinkUrl)).toBeVisible();
        await expect(page.getByText('Playwright Test Link')).toBeVisible();

        // Switch to Read tab
        await page.getByRole('button', { name: 'Read', exact: true }).click();
        await expect(page).toHaveURL(/filter=read/);

        // Should NOT see the new link in Read tab yet
        await expect(page.getByText(newLinkUrl)).not.toBeVisible();

        // Go back to Unread
        await page.getByRole('button', { name: 'Unread', exact: true }).click();
        await expect(page).not.toHaveURL(/filter=read/);

        // Click the item to mark as read
        // Note: The click target is the div/anchor container.
        // We click the element containing the text.
        await page.getByText(newLinkUrl).click();

        // It should disappear from Unread list (or UI updates)
        // Wait for network idle or UI update
        await expect(page.getByText(newLinkUrl)).not.toBeVisible();

        // Go to Read tab
        await page.getByRole('button', { name: 'Read', exact: true }).click();

        // Should be present in Read tab
        await expect(page.getByText(newLinkUrl)).toBeVisible();
    });
});
