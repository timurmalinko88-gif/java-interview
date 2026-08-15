import { test, expect } from '@playwright/test';

test.describe('Feynman Mode - In-Browser AI Metaphor Coach', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#active-difficulty')).toBeVisible({ timeout: 15000 });
  });

  test('Feynman button is visible and toggles Feynman explanation panel', async ({ page }) => {
    const feynmanBtn = page.locator('#btn-feynman');
    await expect(feynmanBtn).toBeVisible();

    const feynmanSection = page.locator('#feynman-section');
    await expect(feynmanSection).toBeHidden();

    // Click Feynman button
    await feynmanBtn.click();
    await expect(feynmanSection).toBeVisible();

    // Verify content container exists and contains explanation or analogy
    const contentEl = page.locator('#feynman-content');
    await expect(contentEl).toBeVisible();

    // Verify close button works
    const closeBtn = page.locator('#feynman-close-btn');
    await closeBtn.click();
    await expect(feynmanSection).toBeHidden();
  });

  test('Feynman panel opens and displays intuitive life metaphor for current question', async ({ page }) => {
    const feynmanBtn = page.locator('#btn-feynman');
    await feynmanBtn.click();

    const feynmanSection = page.locator('#feynman-section');
    await expect(feynmanSection).toBeVisible();

    const contentText = await page.locator('#feynman-content').textContent();
    expect(contentText.trim().length).toBeGreaterThan(10);
  });
});
