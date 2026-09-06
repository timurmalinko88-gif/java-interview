import { test } from '@playwright/test';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/timur/.gemini/antigravity/brain/319b3849-32fa-4927-8ac4-66e91493eda6';

test('capture screenshots of transition track and verdict question', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('java_trainer_tour_completed', 'true');
    localStorage.setItem('java_trainer_tour_done', 'true');
    localStorage.setItem('java_trainer_welcomed', 'true');
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/java-interview/');
  await page.waitForLoadState('networkidle');

  // Ensure tour modal is closed if it somehow opened
  const tourModal = page.locator('#tour-modal');
  if (await tourModal.isVisible()) {
    const skipBtn = tourModal.locator('button:has-text("Пропустить")');
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
      await page.waitForTimeout(300);
    }
  }

  // 1. Select Transition Track
  const roadmapFilter = page.locator('#roadmap-filter');
  await roadmapFilter.selectOption('transition');
  await page.waitForTimeout(600);

  // Take screenshot of track view (with first question general-050)
  const trackPath = path.join(ARTIFACT_DIR, 'screenshot_track.png');
  await page.screenshot({ path: trackPath, fullPage: false });
  console.log(`Saved ${trackPath}`);

  // 2. Select verdict question: spring-059 (JWT Lifecycle & Refresh Token Rotation)
  await page.evaluate(() => {
    window.location.hash = '#q=spring-059';
  });
  await page.waitForTimeout(600);

  // Reveal answer
  const revealBtn = page.locator('#reveal-btn');
  if (await revealBtn.isVisible()) {
    await revealBtn.click();
    await page.waitForTimeout(400);
  }

  const verdictPath = path.join(ARTIFACT_DIR, 'screenshot_verdict_question.png');
  await page.screenshot({ path: verdictPath, fullPage: false });
  console.log(`Saved ${verdictPath}`);
});
