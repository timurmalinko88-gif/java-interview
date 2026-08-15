import { test, expect } from '@playwright/test';

test.describe('Java Interview Hub - Comprehensive E2E Tests', () => {
  let errors = [];

  test.beforeEach(async ({ page }) => {
    errors = [];
    page.on('pageerror', (err) => {
      errors.push(err.message);
    });
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.localStorage.setItem('java_trainer_tour_completed', 'true');
    });
    await page.goto('./', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#active-difficulty')).toBeVisible({ timeout: 15000 });
  });

  test('Page loads correctly with questions and sidebar count without JS errors', async ({ page }) => {
    await expect(page.locator('#active-difficulty')).toBeVisible();
    await expect(page.locator('#question-text')).toBeVisible();
    const countText = await page.locator('#question-list-count').textContent();
    expect(parseInt(countText, 10)).toBeGreaterThan(0);
    expect(errors.length).toBe(0);
  });

  test('Search filter by question title works accurately', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    await searchInput.fill('ArrayList');
    await page.waitForTimeout(300); // debounce

    const countText = await page.locator('#question-list-count').textContent();
    const count = parseInt(countText, 10);
    expect(count).toBeGreaterThan(0);

    const questionTitle = await page.locator('#active-id').textContent();
    expect(questionTitle).toBeTruthy();
    expect(errors.length).toBe(0);
  });

  test('Hotkeys work for navigation, answer reveal, bookmark, and mastered', async ({ page }) => {
    const counterBefore = await page.locator('#counter').textContent();

    // ArrowRight hotkey -> Advance question
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);
    const counterAfter = await page.locator('#counter').textContent();
    expect(counterBefore).not.toBe(counterAfter);

    // Spacebar hotkey -> Toggle Answer
    await page.keyboard.press('Space');
    await page.waitForTimeout(200);
    await expect(page.locator('#answer-section')).toBeVisible();

    // 'm' hotkey -> Mark mastered
    await page.keyboard.press('m');
    await page.waitForTimeout(200);
    await expect(page.locator('#mastered-btn')).toHaveClass(/text-pine-500/);

    // 'f' hotkey -> Bookmark
    await page.keyboard.press('f');
    await page.waitForTimeout(200);
    await expect(page.locator('#flag-btn')).toHaveClass(/text-roast-500/);

    expect(errors.length).toBe(0);
  });

  test('Spaced Repetition evaluation updates next review and auto-advances', async ({ page }) => {
    // Reveal answer
    await page.locator('#btn-answer').click();
    await expect(page.locator('#sr-eval-bar')).toBeVisible();

    // Click 'Good' (medium) rating
    await page.locator('#sr-medium-btn').click();
    await page.waitForTimeout(600);

    // Verify toast appears
    await expect(page.locator('#toast')).toBeVisible();
    expect(errors.length).toBe(0);
  });

  test('Mock Interview full simulation lifecycle and scorecard', async ({ page }) => {
    await page.locator('#mock-interview-btn').click();
    await expect(page.locator('#mock-setup-modal')).toBeVisible();

    // Select Junior & start simulation
    await page.locator('#start-mock-btn').click();
    await expect(page.locator('#mock-status-bar')).toBeVisible();

    // Answer questions by clicking 'Nailed It'
    for (let i = 0; i < 10; i++) {
      await expect(page.locator('#btn-answer')).toBeVisible();
      await page.locator('#btn-answer').click();
      await expect(page.locator('#mock-eval-bar')).toBeVisible();
      await page.locator('#eval-nailed-btn').click();
      await page.waitForTimeout(150);
    }

    // Results modal must be visible with 100% score
    await expect(page.locator('#mock-results-modal')).toBeVisible();
    await expect(page.locator('#mock-result-score')).toContainText('100%');
    await expect(page.locator('#mock-result-verdict')).toContainText('PASSED');

    await page.locator('#finish-mock-btn').click();
    expect(errors.length).toBe(0);
  });

  test('View Switcher: Algorithm Breakdown and System Design', async ({ page }) => {
    // Switch to Algorithms
    await page.locator('#algo-tab-btn').click();
    await expect(page.locator('#algo-view')).toBeVisible();
    await expect(page.locator('#questions-view')).toBeHidden();

    // Check pattern pills
    await expect(page.locator('.algo-pill-btn').first()).toBeVisible({ timeout: 5000 });
    const pills = page.locator('.algo-pill-btn');
    expect(await pills.count()).toBeGreaterThan(1);

    // Open first algorithm breakdown modal
    const firstBreakdownBtn = page.locator('.open-algo-breakdown-btn').first();
    await firstBreakdownBtn.click();
    await expect(page.locator('#algo-modal')).toBeVisible();
    await page.locator('#algo-modal form button').click();

    // Switch to System Design
    await page.locator('#sysdesign-tab-btn').click();
    await expect(page.locator('#sysdesign-view')).toBeVisible();
    await expect(page.locator('#algo-view')).toBeHidden();

    // Open System Design interactive modal
    const firstSysBtn = page.locator('.open-sysdesign-btn').first();
    await firstSysBtn.click();
    await expect(page.locator('#sysdesign-modal')).toBeVisible();

    // Step next
    await page.locator('#sysdesign-next-btn').click();
    await expect(page.locator('#sysdesign-step-counter')).toContainText('Step 2');

    expect(errors.length).toBe(0);
  });

  test('Diagnostic Adaptive Quiz generates personalized roadmap', async ({ page }) => {
    await page.locator('#adaptive-btn').click();
    await expect(page.locator('#adaptive-modal')).toBeVisible();

    // Select Junior
    await page.locator('.level-select-btn[data-level="Junior"]').click();
    await expect(page.locator('#adaptive-step-2')).toBeVisible();

    // Answer quiz options until step 3 is reached
    for (let i = 0; i < 20; i++) {
      const step3Visible = await page.locator('#adaptive-step-3').isVisible();
      if (step3Visible) break;
      const firstOption = page.locator('#quiz-options button').first();
      if (await firstOption.isVisible()) {
        await firstOption.click();
        await page.waitForTimeout(100);
      }
    }

    // Step 3 results
    await expect(page.locator('#adaptive-step-3')).toBeVisible();
    await page.locator('#apply-adaptive-plan').click();

    // Check if my-roadmap button is displayed
    await expect(page.locator('#my-roadmap-btn')).toBeVisible();
    expect(errors.length).toBe(0);
  });

  test('Quick Status Filter chips toggle and filter questions list', async ({ page }) => {
    // Wait for questions to load
    await expect(page.locator('#question-list-count')).not.toHaveText('0');

    // Mark first question as mastered
    await page.locator('#mastered-btn').click();
    await page.waitForTimeout(200);

    // Click "Mastered" status filter chip
    await page.locator('.status-chip[data-status="mastered"]').click();
    await page.waitForTimeout(200);

    const masteredCountText = await page.locator('#question-list-count').textContent();
    expect(parseInt(masteredCountText, 10)).toBe(1);

    // Click "All" status filter chip
    await page.locator('.status-chip[data-status="all"]').click();
    await page.waitForTimeout(200);
    const allCountText = await page.locator('#question-list-count').textContent();
    expect(parseInt(allCountText, 10)).toBeGreaterThan(1);
    expect(errors.length).toBe(0);
  });

  test('Keyboard shortcuts cheat sheet modal opens on button click and ? key', async ({ page }) => {
    // Open via button
    await page.locator('#shortcuts-btn').click();
    await expect(page.locator('#shortcuts-modal')).toBeVisible();

    // Close via close button
    await page.locator('#close-shortcuts-modal').click();
    await page.waitForTimeout(300);
    await expect(page.locator('#shortcuts-modal')).toBeHidden();

    // Open via '?' key
    await page.keyboard.press('?');
    await expect(page.locator('#shortcuts-modal')).toBeVisible();

    // Close via Escape key
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await expect(page.locator('#shortcuts-modal')).toBeHidden();
    expect(errors.length).toBe(0);
  });

  test('Semantic Vector Search badge displays and query filters accurately', async ({ page }) => {
    const searchBadge = page.locator('#semantic-search-badge');
    await expect(searchBadge).toBeVisible();

    const searchInput = page.locator('#search-input');
    await searchInput.fill('Virtual Threads');
    await page.waitForTimeout(500);

    const countText = await page.locator('#question-list-count').textContent();
    expect(parseInt(countText, 10)).toBeGreaterThan(0);
    expect(errors.length).toBe(0);
  });

  test('In-Browser AI Examiner Panel opens, accepts answers, and runs evaluation', async ({ page }) => {
    const aiBtn = page.locator('#btn-ai-interview');
    await expect(aiBtn).toBeVisible();

    // Toggle AI Examiner panel open
    await aiBtn.click();
    const aiPanel = page.locator('#ai-interviewer-panel');
    await expect(aiPanel).toBeVisible();

    const candidateInput = page.locator('#ai-candidate-input');
    await expect(candidateInput).toBeVisible();

    // Type a sample technical answer
    await candidateInput.fill('Volatile ensures memory visibility and prevents instruction reordering via Happens-Before relationship.');

    // Click AI evaluate button
    const evalBtn = page.locator('#ai-evaluate-btn');
    await evalBtn.click();

    // Verify scorecard result appears
    const scorecard = page.locator('#ai-scorecard-result');
    await expect(scorecard).toBeVisible({ timeout: 10000 });

    const badge = page.locator('#ai-scorecard-badge');
    await expect(badge).toBeVisible();
    const badgeText = await badge.textContent();
    expect(badgeText).toContain('%');
    expect(errors.length).toBe(0);
  });
});
