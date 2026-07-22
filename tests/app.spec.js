import { test, expect } from '@playwright/test';

test('Mock Interview flow without JS errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (err) => {
    errors.push(err.message);
  });
  
  await page.goto('/');

  // wait for a bit so the app can load questions from quiz.json / index.json
  // we can wait for a known element that signifies loading is done. 
  // There is a #active-difficulty badge or wait for network idle.
  await page.waitForLoadState('networkidle');
  
  // click mock interview setup button
  await page.locator('#mock-interview-btn').click();
  
  // wait for modal to appear
  await expect(page.locator('#mock-setup-modal')).toBeVisible();
  
  // click start simulation button
  await page.locator('#start-mock-btn').click();
  
  // check if mock status bar is visible to verify UI reacts
  await expect(page.locator('#mock-status-bar')).toBeVisible();

  // If any exceptions were thrown, fail the test
  expect(errors.length).toBe(0);
});
