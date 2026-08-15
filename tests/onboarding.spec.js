import { test, expect } from '@playwright/test';

test.describe('Onboarding & Feature Walkthrough Tour Suite', () => {
  test('Scenario 1: First-time visitor automatically sees the interactive spotlight tour', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto('./', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#active-difficulty')).toBeVisible({ timeout: 15000 });

    const tourContainer = page.locator('#onboarding-tour-container');
    await expect(tourContainer).toBeVisible({ timeout: 5000 });

    const card = page.locator('#tour-card');
    await expect(card).toBeVisible();

    const title = page.locator('#tour-title');
    await expect(title).toContainText('Навигация');
  });

  test('Scenario 2: User can step through tour and finish with state persistence', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto('./', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#active-difficulty')).toBeVisible({ timeout: 15000 });

    const tourContainer = page.locator('#onboarding-tour-container');
    await expect(tourContainer).toBeVisible({ timeout: 5000 });

    // Step through
    const nextBtn = page.locator('#tour-next-btn');
    await nextBtn.click();
    await page.waitForTimeout(300);

    const title2 = page.locator('#tour-title');
    await expect(title2).toContainText('Векторный');

    // Click Skip
    const skipBtn = page.locator('#tour-skip-btn');
    await skipBtn.click();

    await expect(tourContainer).toBeHidden();

    // Verify localStorage key is saved
    const isCompleted = await page.evaluate(() => localStorage.getItem('java_trainer_tour_completed'));
    expect(isCompleted).toBe('true');
  });

  test('Scenario 3: Guide button opens Platform Architecture & 7-Day Plan modal', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('java_trainer_tour_completed', 'true');
    });
    await page.goto('./', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#active-difficulty')).toBeVisible({ timeout: 15000 });

    const guideBtn = page.locator('#btn-platform-guide');
    await expect(guideBtn).toBeVisible();
    await guideBtn.click();

    const guideModal = page.locator('#platform-guide-modal');
    await expect(guideModal).toBeVisible();

    const heading = guideModal.locator('h3');
    await expect(heading).toContainText('Гид по платформе');

    // Close modal
    const closeBtn = page.locator('#close-guide-modal-btn');
    await closeBtn.click();
    await expect(guideModal).toBeHidden();
  });
});
