import { test, expect } from '@playwright/test';

test.describe('LLM Integration Track & Simulator', () => {
  let errors = [];

  test.beforeEach(async ({ page }) => {
    errors = [];
    page.on('pageerror', err => {
      console.error('[Browser PageError]', err.message);
      errors.push(err.message);
    });
    await page.addInitScript(() => {
      window.localStorage.setItem('java_trainer_tour_completed', 'true');
    });
    await page.goto('./', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#active-difficulty')).toBeVisible({ timeout: 15000 });
  });

  test('LLM Tab navigation and curriculum modules view', async ({ page }) => {
    const llmTabBtn = page.locator('#llm-tab-btn');
    await expect(llmTabBtn).toBeVisible();
    await llmTabBtn.click();

    // Verify LLM view is visible
    const llmView = page.locator('#llm-view');
    await expect(llmView).toBeVisible();

    // Verify curriculum modules are rendered (8 jump buttons)
    const jumpButtons = page.locator('.btn-jump-module');
    await expect(jumpButtons).toHaveCount(8);

    // Verify Antigravity module is present in llm-view
    const agyModule = page.locator('#llm-view h4:has-text("Google Antigravity")');
    await expect(agyModule).toBeVisible();

    // Verify no console errors
    expect(errors.length).toBe(0);
  });

  test('Interactive Tool Calling Simulator step progression', async ({ page }) => {
    await page.locator('#llm-tab-btn').click();

    const simulatorCounter = page.locator('#sim-step-counter');
    await expect(simulatorCounter).toBeVisible();
    await expect(simulatorCounter).toContainText('Шаг 1 из 6');

    const nextBtn = page.locator('#sim-next-btn');
    await expect(nextBtn).toBeVisible();

    // Step 1 -> Step 2
    await nextBtn.click();
    await expect(simulatorCounter).toContainText('Шаг 2 из 6');

    // Step 2 -> Step 3
    await nextBtn.click();
    await expect(simulatorCounter).toContainText('Шаг 3 из 6');

    // Step 3 -> Step 4
    await nextBtn.click();
    await expect(simulatorCounter).toContainText('Шаг 4 из 6');

    // Step 4 -> Step 5
    await nextBtn.click();
    await expect(simulatorCounter).toContainText('Шаг 5 из 6');

    // Step 5 -> Step 6
    await nextBtn.click();
    await expect(simulatorCounter).toContainText('Шаг 6 из 6');

    expect(errors.length).toBe(0);
  });

  test('Roadmap filter selects LLM Integration track with 32 questions', async ({ page }) => {
    const roadmapFilter = page.locator('#roadmap-filter');
    await expect(roadmapFilter).toBeVisible();

    await roadmapFilter.selectOption('llmTrack');
    await page.waitForTimeout(400);

    const count = parseInt(await page.locator('#question-list-count').textContent(), 10);
    expect(count).toBe(32);

    // Verify question items in container
    const firstQuestion = page.locator('#questions-container button').first();
    await expect(firstQuestion).toBeVisible();

    expect(errors.length).toBe(0);
  });

  test('Checklist toggle updates namespaced localStorage', async ({ page }) => {
    await page.locator('#llm-tab-btn').click();

    const firstCheckbox = page.locator('.llm-practice-checkbox').first();
    await expect(firstCheckbox).toBeVisible();
    await firstCheckbox.check();

    const storageVal = await page.evaluate(() => localStorage.getItem('java_trainer_llm_practice'));
    expect(storageVal).toBeTruthy();
    expect(storageVal).toContain('mod1');

    expect(errors.length).toBe(0);
  });
});
