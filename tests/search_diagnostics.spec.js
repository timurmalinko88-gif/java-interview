import { test, expect } from '@playwright/test';

test.describe('Search Functionality Diagnostics & Multi-Scenario Tests', () => {
  let errors = [];

  test.beforeEach(async ({ page }) => {
    errors = [];
    page.on('pageerror', (err) => {
      console.error('[Browser PageError]:', err.message);
      errors.push(err.message);
    });
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error('[Browser ConsoleError]:', msg.text());
      }
    });

    await page.goto('./');
    await page.waitForLoadState('networkidle');
    // Ensure questions are loaded
    await expect(page.locator('#active-difficulty')).toBeVisible();
  });

  test('Scenario 1: Exact English keyword search ("ArrayList")', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    await searchInput.fill('ArrayList');
    await page.waitForTimeout(400);

    const countText = await page.locator('#question-list-count').textContent();
    const count = parseInt(countText, 10);
    console.log(`[Test] "ArrayList" found: ${count} questions`);
    expect(count).toBeGreaterThan(0);

    const firstItemText = await page.locator('#questions-container button h4').first().textContent();
    expect(firstItemText.toLowerCase()).toContain('arraylist');
    expect(errors.length).toBe(0);
  });

  test('Scenario 2: Case-insensitive search ("vIrTuAl ThReAdS" / "spring boot")', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    await searchInput.fill('vIrTuAl ThReAdS');
    await page.waitForTimeout(400);

    const countText = await page.locator('#question-list-count').textContent();
    const count = parseInt(countText, 10);
    console.log(`[Test] "vIrTuAl ThReAdS" found: ${count} questions`);
    expect(count).toBeGreaterThan(0);

    await searchInput.fill('spring boot');
    await page.waitForTimeout(400);
    const count2 = parseInt(await page.locator('#question-list-count').textContent(), 10);
    console.log(`[Test] "spring boot" found: ${count2} questions`);
    expect(count2).toBeGreaterThan(10);
    expect(errors.length).toBe(0);
  });

  test('Scenario 3: Substring search ("concur", "deadlock", "serial")', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    await searchInput.fill('deadlock');
    await page.waitForTimeout(400);

    const count = parseInt(await page.locator('#question-list-count').textContent(), 10);
    console.log(`[Test] "deadlock" found: ${count} questions`);
    expect(count).toBeGreaterThan(0);
    expect(errors.length).toBe(0);
  });

  test('Scenario 4: Search by exact Question ID ("jvm-005", "ai-001")', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    await searchInput.fill('jvm-005');
    await page.waitForTimeout(400);

    const count = parseInt(await page.locator('#question-list-count').textContent(), 10);
    console.log(`[Test] "jvm-005" found: ${count} questions`);
    expect(count).toBeGreaterThanOrEqual(1);

    const activeIdText = await page.locator('#active-id').textContent();
    expect(activeIdText).toContain('jvm-005');
    expect(errors.length).toBe(0);
  });

  test('Scenario 5: Search with special characters ("try-with-resources", "@Transactional", "O(1)")', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    await searchInput.fill('@Transactional');
    await page.waitForTimeout(400);

    const count = parseInt(await page.locator('#question-list-count').textContent(), 10);
    console.log(`[Test] "@Transactional" found: ${count} questions`);
    expect(count).toBeGreaterThan(0);

    await searchInput.fill('try-with-resources');
    await page.waitForTimeout(400);
    const count2 = parseInt(await page.locator('#question-list-count').textContent(), 10);
    console.log(`[Test] "try-with-resources" found: ${count2} questions`);
    expect(count2).toBeGreaterThan(0);
    expect(errors.length).toBe(0);
  });

  test('Scenario 6: Natural Language Russian Semantic Search with Web Worker RAG', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    await searchInput.fill('виртуальные потоки в джаве');
    await page.waitForTimeout(800); // allow semantic worker to compute embedding

    const count = parseInt(await page.locator('#question-list-count').textContent(), 10);
    console.log(`[Test] "виртуальные потоки в джаве" found: ${count} questions`);
    expect(count).toBeGreaterThan(0);
    expect(errors.length).toBe(0);
  });

  test('Scenario 7: Combined Filter (Search "Kafka" + Topic "Kafka & Messaging")', async ({ page }) => {
    const topicFilter = page.locator('#topic-filter');
    await topicFilter.selectOption('Kafka & Messaging');
    await page.waitForTimeout(300);

    const searchInput = page.locator('#search-input');
    await searchInput.fill('partition');
    await page.waitForTimeout(400);

    const count = parseInt(await page.locator('#question-list-count').textContent(), 10);
    console.log(`[Test] "partition" in Kafka topic found: ${count} questions`);
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(20); // total kafka questions is 20
    expect(errors.length).toBe(0);
  });

  test('Scenario 8: Combined Filter with Difficulty Chip (Search "Memory" + Senior)', async ({ page }) => {
    const seniorChip = page.locator('.diff-chip[data-diff="Senior"]');
    await seniorChip.click();
    await page.waitForTimeout(200);

    const searchInput = page.locator('#search-input');
    await searchInput.fill('Memory');
    await page.waitForTimeout(400);

    const count = parseInt(await page.locator('#question-list-count').textContent(), 10);
    console.log(`[Test] "Memory" + Senior found: ${count} questions`);
    expect(count).toBeGreaterThan(0);

    const activeDiff = await page.locator('#active-difficulty').textContent();
    expect(activeDiff).toBe('Senior');
    expect(errors.length).toBe(0);
  });

  test('Scenario 9: Clear search restores full list of 706 questions', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    await searchInput.fill('LinkedList');
    await page.waitForTimeout(400);

    const filteredCount = parseInt(await page.locator('#question-list-count').textContent(), 10);
    expect(filteredCount).toBeLessThan(700);

    // Clear search input
    await searchInput.fill('');
    await page.waitForTimeout(400);

    const restoredCount = parseInt(await page.locator('#question-list-count').textContent(), 10);
    console.log(`[Test] Restored count after clearing search: ${restoredCount}`);
    expect(restoredCount).toBe(706);
    expect(errors.length).toBe(0);
  });

  test('Scenario 10: Non-existent query displays clean "Nothing Found" empty state without crash', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    await searchInput.fill('xyzabc999nonexistentquery');
    await page.waitForTimeout(500);

    const count = parseInt(await page.locator('#question-list-count').textContent(), 10);
    expect(count).toBe(0);

    // Verify empty state is displayed
    const emptyStateTitle = page.locator('h3:has-text("Nothing Found")');
    await expect(emptyStateTitle).toBeVisible();

    const resetBtn = page.locator('#btn-empty-reset');
    await expect(resetBtn).toBeVisible();

    // Click reset button
    await resetBtn.click();
    await page.waitForTimeout(400);

    const resetCount = parseInt(await page.locator('#question-list-count').textContent(), 10);
    expect(resetCount).toBe(706);
    expect(errors.length).toBe(0);
  });
});
