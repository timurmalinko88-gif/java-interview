import { test, expect } from '@playwright/test';

test.describe('Interactive Views & Tab Navigation E2E Suite', () => {
  let errors = [];

  test.beforeEach(async ({ page }) => {
    errors = [];
    page.on('pageerror', (err) => {
      console.error('[Browser PageError]', err.message);
      errors.push(err.message);
    });
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (text.includes('Failed to load resource') || text.includes('net::ERR_')) return;
        console.error('[Browser ConsoleError]:', text);
        errors.push(text);
      }
    });
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.localStorage.setItem('java_trainer_tour_completed', 'true');
    });
    await page.goto('./', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#active-difficulty')).toBeVisible({ timeout: 15000 });
  });

  test('1. Tab Navigation & View Toggling: Seamless switching between Questions, Algo, SysDesign, and LLM views', async ({ page }) => {
    // Verify initial state: #questions-view is visible, others are hidden
    await expect(page.locator('#questions-view')).toBeVisible();
    await expect(page.locator('#algo-view')).toBeHidden();
    await expect(page.locator('#sysdesign-view')).toBeHidden();
    await expect(page.locator('#llm-view')).toBeHidden();

    // Click #algo-tab-btn, verify #algo-view is visible and #questions-view is hidden
    await page.locator('#algo-tab-btn').click();
    await expect(page.locator('#algo-view')).toBeVisible();
    await expect(page.locator('#questions-view')).toBeHidden();
    await expect(page.locator('#sysdesign-view')).toBeHidden();
    await expect(page.locator('#llm-view')).toBeHidden();

    // Click #sysdesign-tab-btn, verify #sysdesign-view is visible and #algo-view is hidden
    await page.locator('#sysdesign-tab-btn').click();
    await expect(page.locator('#sysdesign-view')).toBeVisible();
    await expect(page.locator('#algo-view')).toBeHidden();
    await expect(page.locator('#questions-view')).toBeHidden();
    await expect(page.locator('#llm-view')).toBeHidden();

    // Click #llm-tab-btn, verify #llm-view is visible and #sysdesign-view is hidden
    await page.locator('#llm-tab-btn').click();
    await expect(page.locator('#llm-view')).toBeVisible();
    await expect(page.locator('#sysdesign-view')).toBeHidden();
    await expect(page.locator('#algo-view')).toBeHidden();
    await expect(page.locator('#questions-view')).toBeHidden();

    // Click #questions-tab-btn, verify #questions-view is restored
    await page.locator('#questions-tab-btn').click();
    await expect(page.locator('#questions-view')).toBeVisible();
    await expect(page.locator('#llm-view')).toBeHidden();
    await expect(page.locator('#algo-view')).toBeHidden();
    await expect(page.locator('#sysdesign-view')).toBeHidden();

    expect(errors.length).toBe(0);
  });

  test('2. Algorithm Breakdown Module: Grid rendering, search filtering, category filtering, modal details, and dismissal', async ({ page }) => {
    // Navigate to #algo-view
    await page.locator('#algo-tab-btn').click();
    await expect(page.locator('#algo-view')).toBeVisible();

    // Verify algorithm cards are rendered in #algo-grid
    const algoCards = page.locator('#algo-grid .algo-card');
    await expect(algoCards.first()).toBeVisible({ timeout: 10000 });
    const initialCount = await algoCards.count();
    expect(initialCount).toBeGreaterThan(10);

    // Type in #algo-search-input (e.g. 'Binary'), verify card count filters accordingly
    const searchInput = page.locator('#algo-search-input');
    await searchInput.fill('Binary');
    await page.waitForTimeout(300);

    const binaryCount = await algoCards.count();
    expect(binaryCount).toBeGreaterThan(0);
    expect(binaryCount).toBeLessThan(initialCount);

    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(300);
    expect(await algoCards.count()).toBe(initialCount);

    // Change category select #algo-cat-filter to 'Sorting', verify cards match category
    const catFilter = page.locator('#algo-cat-filter');
    await expect(catFilter).toBeVisible();
    await catFilter.selectOption('Sorting');
    await page.waitForTimeout(300);

    const sortingCount = await algoCards.count();
    expect(sortingCount).toBeGreaterThan(0);
    expect(sortingCount).toBeLessThan(initialCount);

    // Verify cards contain sorting related terms or pattern
    const firstSortingCardTitle = await algoCards.first().locator('h3').textContent();
    expect(firstSortingCardTitle).toBeTruthy();

    // Reset category filter back to all
    await catFilter.selectOption('all');
    await page.waitForTimeout(300);
    expect(await algoCards.count()).toBe(initialCount);

    // Click on the first algorithm card in #algo-grid, verify #algo-modal opens
    const firstCard = algoCards.first();
    await firstCard.click();

    const algoModal = page.locator('#algo-modal');
    await expect(algoModal).toBeVisible();

    // Verify complexity badges ($O(...) etc.)
    const timeBadge = page.locator('#algo-modal-time-comp');
    const spaceBadge = page.locator('#algo-modal-space-comp');
    await expect(timeBadge).toBeVisible();
    await expect(spaceBadge).toBeVisible();
    const timeText = await timeBadge.textContent();
    expect(timeText).toMatch(/O\(.*\)/i);

    // Verify code blocks and simulation steps
    const stepDetails = page.locator('#algo-modal .algo-step-details');
    await expect(stepDetails.first()).toBeVisible({ timeout: 10000 });
    expect(await stepDetails.count()).toBeGreaterThan(0);

    // Expand all steps to inspect code blocks
    const expandBtn = page.locator('#toggle-all-algo-steps');
    if (await expandBtn.isVisible()) {
      await expandBtn.click();
    }
    const codeBlock = page.locator('#algo-modal pre code');
    await expect(codeBlock.first()).toBeVisible();

    // Click #algo-modal-close-btn to close the dialog
    const closeBtn1 = page.locator('#algo-modal-close-btn');
    await expect(closeBtn1).toBeVisible();
    await closeBtn1.click();
    await expect(algoModal).toBeHidden();

    // Re-open and verify #algo-modal-close also closes the dialog
    await firstCard.click();
    await expect(algoModal).toBeVisible();
    const closeBtn2 = page.locator('#algo-modal-close');
    await expect(closeBtn2).toBeVisible();
    await closeBtn2.click();
    await expect(algoModal).toBeHidden();

    expect(errors.length).toBe(0);
  });

  test('3. System Design Architecture Canvas Module: Grid, interactive SVG canvas, simulation progression, and dismissal', async ({ page }) => {
    // Navigate to #sysdesign-view
    await page.locator('#sysdesign-tab-btn').click();
    await expect(page.locator('#sysdesign-view')).toBeVisible();

    // Verify scenario cards in #sysdesign-grid
    const sysCards = page.locator('#sysdesign-grid .sysdesign-card');
    await expect(sysCards.first()).toBeVisible({ timeout: 10000 });
    const count = await sysCards.count();
    expect(count).toBeGreaterThan(0);

    // Click on the first scenario card, verify architecture modal/canvas opens
    await sysCards.first().click();

    const sysModal = page.locator('#sysdesign-modal');
    await expect(sysModal).toBeVisible();

    // Verify SVG elements (svg, nodes, connections) are present
    const canvasSvg = page.locator('#sysdesign-canvas svg');
    await expect(canvasSvg).toBeVisible();

    const svgPaths = page.locator('#sysdesign-canvas svg path');
    expect(await svgPaths.count()).toBeGreaterThan(0);

    const svgRects = page.locator('#sysdesign-canvas svg rect');
    expect(await svgRects.count()).toBeGreaterThan(0);

    // Verify initial step counter
    const stepCounter = page.locator('#sysdesign-step-counter');
    await expect(stepCounter).toBeVisible();
    await expect(stepCounter).toContainText('Step 1');

    // Click step simulation button (#sysdesign-next-btn), verify step progression to Step 2
    const nextBtn = page.locator('#sysdesign-next-btn');
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
    await expect(stepCounter).toContainText('Step 2');

    // Click step simulation button via #sysdesign-step-next, verify step progression to Step 3
    const stepNextBtn = page.locator('#sysdesign-step-next');
    await expect(stepNextBtn).toBeVisible();
    await stepNextBtn.click();
    await expect(stepCounter).toContainText('Step 3');

    // Close the modal with #sysdesign-modal-close-btn
    const closeBtn1 = page.locator('#sysdesign-modal-close-btn');
    await expect(closeBtn1).toBeVisible();
    await closeBtn1.click();
    await expect(sysModal).toBeHidden();

    // Re-open and verify #sysdesign-modal-close also closes the dialog
    await sysCards.first().click();
    await expect(sysModal).toBeVisible();
    const closeBtn2 = page.locator('#sysdesign-modal-close');
    await expect(closeBtn2).toBeVisible();
    await closeBtn2.click();
    await expect(sysModal).toBeHidden();

    expect(errors.length).toBe(0);
  });

  test('4. System Design category filter and search controls work seamlessly', async ({ page }) => {
    await page.locator('#sysdesign-tab-btn').click();
    await expect(page.locator('#sysdesign-view')).toBeVisible();

    const sysCards = page.locator('#sysdesign-grid .sysdesign-card');
    const totalCount = await sysCards.count();
    expect(totalCount).toBeGreaterThan(1);

    // Test search filter
    const searchInput = page.locator('#sysdesign-search-input');
    await searchInput.fill('Kafka');
    await page.waitForTimeout(300);
    const filteredCount = await sysCards.count();
    expect(filteredCount).toBeGreaterThan(0);
    expect(filteredCount).toBeLessThanOrEqual(totalCount);

    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(300);
    expect(await sysCards.count()).toBe(totalCount);

    // Test category filter
    const catFilter = page.locator('#sysdesign-cat-filter');
    await catFilter.selectOption('Microservices & Security');
    await page.waitForTimeout(300);
    const catCount = await sysCards.count();
    expect(catCount).toBeGreaterThan(0);
    expect(catCount).toBeLessThanOrEqual(totalCount);

    // Reset category filter
    await catFilter.selectOption('all');
    await page.waitForTimeout(300);
    expect(await sysCards.count()).toBe(totalCount);

    expect(errors.length).toBe(0);
  });

  test('5. Edge Case: Empty search state in Algorithm Breakdown and Reset Filters button', async ({ page }) => {
    await page.locator('#algo-tab-btn').click();
    await expect(page.locator('#algo-view')).toBeVisible();

    const algoCards = page.locator('#algo-grid .algo-card');
    const initialCount = await algoCards.count();
    expect(initialCount).toBeGreaterThan(0);

    // Type query with no matches
    const searchInput = page.locator('#algo-search-input');
    await searchInput.fill('NonExistentAlgorithmQuery12345');
    await page.waitForTimeout(300);

    // Verify 0 cards and empty state message
    expect(await algoCards.count()).toBe(0);
    const emptyState = page.locator('#algo-grid');
    await expect(emptyState).toContainText('No algorithmic breakdowns match your criteria');

    // Click Reset Filters button
    const resetBtn = page.locator('#reset-algo-filters');
    await expect(resetBtn).toBeVisible();
    await resetBtn.click();
    await page.waitForTimeout(300);

    // Verify all cards are restored
    expect(await algoCards.count()).toBe(initialCount);
    expect(await searchInput.inputValue()).toBe('');

    expect(errors.length).toBe(0);
  });

  test('6. Edge Case: System Design simulation boundaries (Prev at Step 1, Next to final step, Reset)', async ({ page }) => {
    await page.locator('#sysdesign-tab-btn').click();
    const firstCard = page.locator('#sysdesign-grid .sysdesign-card').first();
    await firstCard.click();

    const stepCounter = page.locator('#sysdesign-step-counter');
    await expect(stepCounter).toContainText('Step 1');

    // Prev at Step 1 does not underflow
    const prevBtn = page.locator('#sysdesign-prev-btn');
    await prevBtn.click();
    await expect(stepCounter).toContainText('Step 1');

    // Advance to Step 2 then 3
    const nextBtn = page.locator('#sysdesign-next-btn');
    await nextBtn.click();
    await expect(stepCounter).toContainText('Step 2');
    await nextBtn.click();
    await expect(stepCounter).toContainText('Step 3');

    // Advance to final step (Step 5 of 5) and verify no overflow on extra next clicks
    await nextBtn.click();
    await expect(stepCounter).toContainText('Step 4');
    await nextBtn.click();
    await expect(stepCounter).toContainText('Step 5');
    await nextBtn.click();
    await expect(stepCounter).toContainText('Step 5 of 5');

    // Reset button returns to Step 1
    const resetBtn = page.locator('#sysdesign-reset-btn');
    await resetBtn.click();
    await expect(stepCounter).toContainText('Step 1');

    // Close via close button
    await page.locator('#sysdesign-modal-close-btn').click();
    await expect(page.locator('#sysdesign-modal')).toBeHidden();

    expect(errors.length).toBe(0);
  });

  test('7. Edge Case: Rapid consecutive tab switching maintains view integrity', async ({ page }) => {
    // Rapid switching between tabs without waiting
    await page.locator('#algo-tab-btn').click();
    await page.locator('#sysdesign-tab-btn').click();
    await page.locator('#llm-tab-btn').click();
    await page.locator('#questions-tab-btn').click();
    await page.locator('#algo-tab-btn').click();

    // Verify only algo-view is visible and others are hidden
    await expect(page.locator('#algo-view')).toBeVisible();
    await expect(page.locator('#questions-view')).toBeHidden();
    await expect(page.locator('#sysdesign-view')).toBeHidden();
    await expect(page.locator('#llm-view')).toBeHidden();

    // Verify grid rendered cleanly
    const algoCards = page.locator('#algo-grid .algo-card');
    await expect(algoCards.first()).toBeVisible();

    expect(errors.length).toBe(0);
  });
});
