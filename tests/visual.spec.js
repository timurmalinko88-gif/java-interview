import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = 'C:/Users/timur/.gemini/antigravity/brain/183e06a2-6402-4145-b257-e5ec20fc4ad6/scratch/screenshots';
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

test.describe('Visual and UI/UX Inspection Suite', () => {
  let errors = [];

  test.beforeEach(async ({ page }) => {
    errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
  });

  test('Desktop (1440x900) - Questions View, Answer Reveal, Modals and Dark Mode', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Screenshot: Main Questions Light Mode
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop_light_main.png') });

    // Check no horizontal scrollbar on root
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);

    // Reveal Answer
    await page.locator('#btn-answer').click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop_light_answer.png') });

    // Open Shortcuts Modal
    await page.locator('#shortcuts-btn').click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop_light_shortcuts.png') });
    await page.locator('#close-shortcuts-modal').click();
    await page.waitForTimeout(300);

    // Open Stats Dashboard Modal
    await page.locator('#my-stats-btn').click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop_light_stats.png') });
    await page.locator('#close-stats-modal').click();
    await page.waitForTimeout(300);

    // Toggle Dark Theme
    await page.locator('#theme-toggle').click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop_dark_main.png') });

    // Switch to Algorithms
    await page.locator('#algo-tab-btn').click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop_dark_algorithms.png') });

    // Switch to System Design
    await page.locator('#sysdesign-tab-btn').click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop_dark_sysdesign.png') });

    // Switch back to Questions
    await page.locator('#questions-tab-btn').click();
    await page.waitForTimeout(300);

    // Mock Interview Setup Modal
    await page.locator('#mock-interview-btn').click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop_dark_mock_setup.png') });
    await page.locator('#close-mock-setup-btn').click();

    expect(errors.length).toBe(0);
  });

  test('Mobile (390x844) - Responsiveness, touch targets, and drawer/sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Screenshot: Mobile Main
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_light_main.png') });

    // Check no horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);

    // Check mobile algorithms
    await page.locator('#algo-tab-btn').click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_light_algorithms.png') });

    // Check mobile system design
    await page.locator('#sysdesign-tab-btn').click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_light_sysdesign.png') });

    expect(errors.length).toBe(0);
  });

  test('Tablet / Laptop (1024x768 & 1180x820) - Question ai-020 with long code lines does not clip right edge', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/#q=ai-020');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Verify card is within viewport width
    const cardBounds = await page.locator('#main-content-card').boundingBox();
    expect(cardBounds.x + cardBounds.width).toBeLessThanOrEqual(1024);

    // Verify Mastered button is fully visible
    const masteredBounds = await page.locator('#mastered-btn').boundingBox();
    expect(masteredBounds.x + masteredBounds.width).toBeLessThanOrEqual(cardBounds.x + cardBounds.width);

    // Verify YouTube button is fully visible
    const youtubeBounds = await page.locator('#btn-youtube').boundingBox();
    expect(youtubeBounds.x + youtubeBounds.width).toBeLessThanOrEqual(cardBounds.x + cardBounds.width);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'laptop_ai020_fixed.png') });
    expect(errors.length).toBe(0);
  });
});
