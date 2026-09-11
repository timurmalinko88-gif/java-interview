import { test, expect } from '@playwright/test';

test.describe('Spaced Repetition (Leitner Box) & Status Filters E2E Suite', () => {
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
        errors.push(msg.text());
      }
    });

    await page.addInitScript(() => {
      window.localStorage.clear();
      window.localStorage.setItem('java_trainer_tour_completed', 'true');
    });

    await page.goto('./', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#active-difficulty')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#question-text')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#questions-container button').first()).toBeVisible({ timeout: 15000 });
  });

  test('1. Spaced Repetition Buttons: Hard and Easy ratings update localStorage interval, easeFactor, and repetitions', async ({ page }) => {
    // 1. Initial check: verify #sr-eval-bar is hidden
    await expect(page.locator('#sr-eval-bar')).toBeHidden();
    const btnAnswer = page.locator('#btn-answer');
    await expect(btnAnswer).toBeVisible();

    const q1Id = (await page.locator('#active-id').textContent()).replace('#', '').trim();
    expect(q1Id).toBeTruthy();

    // 2. Reveal answer by clicking #btn-answer, verify #sr-eval-bar becomes visible
    await btnAnswer.click();
    await expect(page.locator('#sr-eval-bar')).toBeVisible();

    // 3. Click #sr-hard-btn (Hard, rating 1)
    const srHardBtn = page.locator('#sr-hard-btn');
    await expect(srHardBtn).toBeVisible();
    await srHardBtn.click();

    // 4. Verify localStorage stores question entry with updated interval: 1 and reduced easeFactor (< 2.5)
    await expect.poll(async () => {
      const raw = await page.evaluate(() => localStorage.getItem('java_trainer_sr'));
      if (!raw) return null;
      const sr = JSON.parse(raw);
      return sr[q1Id];
    }).toBeTruthy();

    const srData1 = JSON.parse(await page.evaluate(() => localStorage.getItem('java_trainer_sr')));
    const q1Entry = srData1[q1Id];
    expect(q1Entry.interval).toBe(1);
    const efactor1 = q1Entry.easeFactor ?? q1Entry.efactor;
    expect(efactor1).toBeLessThan(2.5);

    // 5. Auto-advance to next question
    await expect.poll(async () => {
      const currentId = (await page.locator('#active-id').textContent()).replace('#', '').trim();
      return currentId;
    }, { timeout: 5000 }).not.toBe(q1Id);

    const q2Id = (await page.locator('#active-id').textContent()).replace('#', '').trim();
    expect(q2Id).toBeTruthy();

    // 6. Reveal answer on next question
    await expect(page.locator('#btn-answer')).toBeVisible();
    await page.locator('#btn-answer').click();
    await expect(page.locator('#sr-eval-bar')).toBeVisible();

    // 7. Click #sr-easy-btn (Easy, rating 3)
    const srEasyBtn = page.locator('#sr-easy-btn');
    await expect(srEasyBtn).toBeVisible();
    await srEasyBtn.click();

    // 8. Verify localStorage entry has increased easeFactor (> 2.5) and repetitions (> 0)
    await expect.poll(async () => {
      const raw = await page.evaluate(() => localStorage.getItem('java_trainer_sr'));
      if (!raw) return null;
      const sr = JSON.parse(raw);
      return sr[q2Id];
    }).toBeTruthy();

    const srData2 = JSON.parse(await page.evaluate(() => localStorage.getItem('java_trainer_sr')));
    const q2Entry = srData2[q2Id];
    expect(q2Entry.interval).toBe(1);
    const efactor2 = q2Entry.easeFactor ?? q2Entry.efactor;
    const repetitions2 = q2Entry.repetitions ?? q2Entry.repetition;
    expect(efactor2).toBeGreaterThan(2.5);
    expect(repetitions2).toBeGreaterThan(0);

    expect(errors.length).toBe(0);
  });

  test('2. Status Filter Chips: Mastered, Flagged, Due review with badge, and All filters', async ({ page }) => {
    // Wait for questions list to be populated
    await expect(page.locator('#question-list-count')).not.toHaveText('0');
    const totalCountText = await page.locator('#question-list-count').textContent();
    const totalCount = parseInt(totalCountText, 10);
    expect(totalCount).toBeGreaterThan(1);

    const activeQId = (await page.locator('#active-id').textContent()).replace('#', '').trim();
    expect(activeQId).toBeTruthy();

    // 1. Mark current question as Mastered via #mastered-btn
    const masteredBtn = page.locator('#mastered-btn');
    await masteredBtn.click();
    await expect(masteredBtn).toHaveClass(/text-pine-500/);

    // 2. Click [data-status="mastered"] status chip, verify question count equals 1 and the mastered question is displayed
    const masteredChip = page.locator('.status-chip[data-status="mastered"]');
    await masteredChip.click();
    await expect(page.locator('#question-list-count')).toHaveText('1');
    await expect(page.locator('#active-id')).toContainText(activeQId);
    await expect(page.locator('#questions-container button')).toHaveCount(1);

    // 3. Bookmark current question via #flag-btn
    const flagBtn = page.locator('#flag-btn');
    await flagBtn.click();
    await expect(flagBtn).toHaveClass(/text-roast-500/);

    // 4. Click [data-status="flagged"] status chip, verify only flagged questions appear
    const flaggedChip = page.locator('.status-chip[data-status="flagged"]');
    await flaggedChip.click();
    await expect(page.locator('#question-list-count')).toHaveText('1');
    await expect(page.locator('#active-id')).toContainText(activeQId);
    await expect(page.locator('#questions-container button')).toHaveCount(1);

    // 5. Set an item\'s nextReviewDate in java_trainer_sr to past timestamp (yesterday)
    const pastTimestamp = new Date(Date.now() - 86400000).toISOString();
    await page.evaluate(({ id, pastDate }) => {
      let sr = {};
      try {
        sr = JSON.parse(localStorage.getItem('java_trainer_sr') || '{}');
      } catch (e) {}
      sr[id] = {
        interval: 1,
        repetition: 1,
        repetitions: 1,
        efactor: 2.5,
        easeFactor: 2.5,
        nextReviewDate: pastDate
      };
      localStorage.setItem('java_trainer_sr', JSON.stringify(sr));
      if (window.state) {
        window.state.srData = sr;
      }
    }, { id: activeQId, pastDate: pastTimestamp });

    // 6. Click [data-status="due"] status chip, verify the due question appears in the list with Due badge
    const dueChip = page.locator('.status-chip[data-status="due"]');
    await dueChip.click();
    await expect(page.locator('#question-list-count')).toHaveText('1');
    await expect(page.locator('#active-id')).toContainText(activeQId);

    // Check that Due badge is displayed on question card in sidebar
    const dueBadge = page.locator('#questions-container span:has-text("Due")');
    await expect(dueBadge.first()).toBeVisible();

    // 7. Click [data-status="all"] status chip, verify all questions are displayed again
    const allChip = page.locator('.status-chip[data-status="all"]');
    await allChip.click();
    await expect(page.locator('#question-list-count')).toHaveText(String(totalCount));

    expect(errors.length).toBe(0);
  });

  test('3. Keyboard Shortcuts: When answer is visible, "1", "2", "3" activate SR buttons', async ({ page }) => {
    // When answer is NOT visible, pressing '1', '2', or '3' should NOT trigger SR
    await page.keyboard.press('1');
    await page.keyboard.press('2');
    await page.keyboard.press('3');
    const srUntriggered = await page.evaluate(() => localStorage.getItem('java_trainer_sr'));
    expect(srUntriggered === null || srUntriggered === '{}').toBe(true);

    // 1. Test key '1' (Hard):
    const q1Id = (await page.locator('#active-id').textContent()).replace('#', '').trim();
    await page.locator('#btn-answer').click();
    await expect(page.locator('#sr-eval-bar')).toBeVisible();

    await page.keyboard.press('1');
    await expect.poll(async () => {
      const raw = await page.evaluate(() => localStorage.getItem('java_trainer_sr'));
      if (!raw) return null;
      return JSON.parse(raw)[q1Id];
    }).toBeTruthy();

    const srData1 = JSON.parse(await page.evaluate(() => localStorage.getItem('java_trainer_sr')));
    const efactor1 = srData1[q1Id].easeFactor ?? srData1[q1Id].efactor;
    expect(efactor1).toBeLessThan(2.5);

    // Wait for auto-advance to next question
    await expect.poll(async () => {
      const cur = (await page.locator('#active-id').textContent()).replace('#', '').trim();
      return cur;
    }, { timeout: 5000 }).not.toBe(q1Id);

    // 2. Test key '2' (Medium / Good):
    const q2Id = (await page.locator('#active-id').textContent()).replace('#', '').trim();
    await expect(page.locator('#btn-answer')).toBeVisible();
    await page.locator('#btn-answer').click();
    await expect(page.locator('#sr-eval-bar')).toBeVisible();

    await page.keyboard.press('2');
    await expect.poll(async () => {
      const raw = await page.evaluate(() => localStorage.getItem('java_trainer_sr'));
      if (!raw) return null;
      return JSON.parse(raw)[q2Id];
    }).toBeTruthy();

    const srData2 = JSON.parse(await page.evaluate(() => localStorage.getItem('java_trainer_sr')));
    expect(srData2[q2Id].interval).toBe(1);

    // Wait for auto-advance to next question
    await expect.poll(async () => {
      const cur = (await page.locator('#active-id').textContent()).replace('#', '').trim();
      return cur;
    }, { timeout: 5000 }).not.toBe(q2Id);

    // 3. Test key '3' (Easy):
    const q3Id = (await page.locator('#active-id').textContent()).replace('#', '').trim();
    await expect(page.locator('#btn-answer')).toBeVisible();
    await page.locator('#btn-answer').click();
    await expect(page.locator('#sr-eval-bar')).toBeVisible();

    await page.keyboard.press('3');
    await expect.poll(async () => {
      const raw = await page.evaluate(() => localStorage.getItem('java_trainer_sr'));
      if (!raw) return null;
      return JSON.parse(raw)[q3Id];
    }).toBeTruthy();

    const srData3 = JSON.parse(await page.evaluate(() => localStorage.getItem('java_trainer_sr')));
    const efactor3 = srData3[q3Id].easeFactor ?? srData3[q3Id].efactor;
    expect(efactor3).toBeGreaterThan(2.5);

    expect(errors.length).toBe(0);
  });

  test('4. Keyboard Shortcuts: "m" / "M" toggles mastered status, "f" / "F" toggles bookmark status', async ({ page }) => {
    const masteredBtn = page.locator('#mastered-btn');
    const flagBtn = page.locator('#flag-btn');

    // Initially neither is active
    await expect(masteredBtn).not.toHaveClass(/bg-pine-500\/10/);
    await expect(flagBtn).not.toHaveClass(/bg-roast-500\/10/);

    // 1. Press 'm' -> marks as mastered
    await page.keyboard.press('m');
    await expect(masteredBtn).toHaveClass(/bg-pine-500\/10/);

    // 2. Press 'm' again -> unmarks mastered
    await page.keyboard.press('m');
    await expect(masteredBtn).not.toHaveClass(/bg-pine-500\/10/);

    // 3. Press 'M' (uppercase) -> marks as mastered
    await page.keyboard.press('M');
    await expect(masteredBtn).toHaveClass(/bg-pine-500\/10/);

    // 4. Press 'M' (uppercase) again -> unmarks mastered
    await page.keyboard.press('M');
    await expect(masteredBtn).not.toHaveClass(/bg-pine-500\/10/);

    // 5. Press 'f' -> bookmarks question
    await page.keyboard.press('f');
    await expect(flagBtn).toHaveClass(/bg-roast-500\/10/);

    // 6. Press 'f' again -> removes bookmark
    await page.keyboard.press('f');
    await expect(flagBtn).not.toHaveClass(/bg-roast-500\/10/);

    // 7. Press 'F' (uppercase) -> bookmarks question
    await page.keyboard.press('F');
    await expect(flagBtn).toHaveClass(/bg-roast-500\/10/);

    // 8. Press 'F' (uppercase) again -> removes bookmark
    await page.keyboard.press('F');
    await expect(flagBtn).not.toHaveClass(/bg-roast-500\/10/);

    expect(errors.length).toBe(0);
  });
});
