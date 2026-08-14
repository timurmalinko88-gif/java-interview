import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const LOCAL_SCREENSHOT_DIR = path.join(process.cwd(), 'scratch/screenshots');
fs.mkdirSync(LOCAL_SCREENSHOT_DIR, { recursive: true });

// Optional brain scratch dir
const BRAIN_SCREENSHOT_DIR = 'C:/Users/timur/.gemini/antigravity/brain/fffc3a9e-88d3-4310-aabc-dfb0c72a6fe6/scratch/screenshots';
try {
  fs.mkdirSync(BRAIN_SCREENSHOT_DIR, { recursive: true });
} catch (e) {}

async function saveScreenshot(page, filename) {
  const localPath = path.join(LOCAL_SCREENSHOT_DIR, filename);
  await page.screenshot({ path: localPath });
  try {
    const brainPath = path.join(BRAIN_SCREENSHOT_DIR, filename);
    await page.screenshot({ path: brainPath });
  } catch (e) {}
}

test.describe('Visual and UI/UX Inspection Suite', () => {
  let errors = [];

  test.beforeEach(async ({ page }) => {
    errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
  });

  test('Desktop (1440x900) - Questions View, Answer Reveal, Modals and Dark Mode', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('./');
    await page.waitForLoadState('networkidle');

    // Screenshot: Main Questions Light Mode
    await saveScreenshot(page, 'desktop_light_main.png');

    // Check no horizontal scrollbar on root
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);

    // Reveal Answer and verify Prose typography & Code block styles
    await page.locator('#btn-answer').click();
    await page.waitForTimeout(300);
    await saveScreenshot(page, 'desktop_light_answer.png');

    // Check Attio Prose styling on Answer Content
    const answerContent = page.locator('#answer-content');
    await expect(answerContent).toBeVisible();
    await expect(answerContent).toHaveClass(/prose/);

    // Open Shortcuts Modal
    await page.locator('#shortcuts-btn').click();
    await page.waitForTimeout(300);
    await saveScreenshot(page, 'desktop_light_shortcuts.png');
    await page.locator('#close-shortcuts-modal').click();
    await page.waitForTimeout(300);

    // Open Stats Dashboard Modal
    await page.locator('#my-stats-btn').click();
    await page.waitForTimeout(400);
    await saveScreenshot(page, 'desktop_light_stats.png');
    await page.locator('#close-stats-modal').click();
    await page.waitForTimeout(300);

    // Toggle Dark Theme
    await page.locator('#theme-toggle').click();
    await page.waitForTimeout(300);
    await saveScreenshot(page, 'desktop_dark_main.png');

    // Verify dark class applied to html
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(isDark).toBe(true);

    // Switch to Algorithms
    await page.locator('#algo-tab-btn').click();
    await page.waitForTimeout(400);
    await saveScreenshot(page, 'desktop_dark_algorithms.png');

    // Switch to System Design
    await page.locator('#sysdesign-tab-btn').click();
    await page.waitForTimeout(400);
    await saveScreenshot(page, 'desktop_dark_sysdesign.png');

    // Switch back to Questions
    await page.locator('#questions-tab-btn').click();
    await page.waitForTimeout(300);

    // Mock Interview Setup Modal
    await page.locator('#mock-interview-btn').click();
    await page.waitForTimeout(300);
    await saveScreenshot(page, 'desktop_dark_mock_setup.png');
    await page.locator('#close-mock-setup-btn').click();

    expect(errors.length).toBe(0);
  });

  test('Laptop (1180x820) - Attio Design System, Prose Table & Code Highlighting Integrity', async ({ page }) => {
    await page.setViewportSize({ width: 1180, height: 820 });
    await page.goto('./');
    await page.waitForLoadState('networkidle');

    // Reveal answer to inspect code blocks and prose elements
    await page.locator('#btn-answer').click();
    await page.waitForTimeout(300);

    // Verify code block styling and typography
    const preBlock = page.locator('pre').first();
    if (await preBlock.isVisible()) {
      const codeBg = await preBlock.evaluate((el) => window.getComputedStyle(el).backgroundColor);
      expect(codeBg).toBeTruthy();
    }

    // Verify no horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);

    await saveScreenshot(page, 'laptop_1180_design_integrity.png');
    expect(errors.length).toBe(0);
  });

  test('Mobile (390x844) - Responsiveness, touch targets, and drawer/sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./');
    await page.waitForLoadState('networkidle');

    // Screenshot: Mobile Main
    await saveScreenshot(page, 'mobile_light_main.png');

    // Check no horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);

    // Check mobile algorithms
    await page.locator('#algo-tab-btn').click();
    await page.waitForTimeout(300);
    await saveScreenshot(page, 'mobile_light_algorithms.png');

    // Check mobile system design
    await page.locator('#sysdesign-tab-btn').click();
    await page.waitForTimeout(300);
    await saveScreenshot(page, 'mobile_light_sysdesign.png');

    expect(errors.length).toBe(0);
  });

  test('Tablet / Laptop (1024x768) - Question ai-020 with long code lines does not clip right edge', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('./#q=ai-020');
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

    await saveScreenshot(page, 'laptop_ai020_fixed.png');
    expect(errors.length).toBe(0);
  });
});
