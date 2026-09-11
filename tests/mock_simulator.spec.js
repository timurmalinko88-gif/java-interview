import { test, expect } from '@playwright/test';

test.describe('Mock Interview Simulator - Comprehensive E2E Suite', () => {
  let errors = [];

  test.beforeEach(async ({ page }) => {
    errors = [];
    page.on('pageerror', (err) => {
      console.error('[Browser PageError]', err.message);
      errors.push(err.message);
    });
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.localStorage.setItem('java_trainer_tour_completed', 'true');
    });
    await page.goto('./', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#active-difficulty')).toBeVisible({ timeout: 15000 });
  });

  test('1. Setup Modal: open, select grade, select company, and modal close', async ({ page }) => {
    // Open Setup Modal
    const mockBtn = page.locator('#mock-interview-btn');
    await expect(mockBtn).toBeVisible();
    await mockBtn.click();

    const setupModal = page.locator('#mock-setup-modal');
    await expect(setupModal).toBeVisible();

    // Grade selection verification: Default is Junior
    const juniorGradeBtn = page.locator('.mock-grade-btn[data-mock-grade="Junior"]');
    const middleGradeBtn = page.locator('.mock-grade-btn[data-mock-grade="Middle"]');
    const seniorGradeBtn = page.locator('.mock-grade-btn[data-mock-grade="Senior"]');

    await expect(juniorGradeBtn).toHaveClass(/(?:^|\s)border-roast-500(?:\s|$)/);
    await expect(juniorGradeBtn).toHaveClass(/bg-roast-500\/10/);

    // Switch to Middle grade
    await middleGradeBtn.click();
    await expect(middleGradeBtn).toHaveClass(/(?:^|\s)border-roast-500(?:\s|$)/);
    await expect(middleGradeBtn).toHaveClass(/bg-roast-500\/10/);
    await expect(middleGradeBtn).toHaveClass(/text-roast-500/);
    await expect(juniorGradeBtn).not.toHaveClass(/(?:^|\s)border-roast-500(?:\s|$)/);
    await expect(juniorGradeBtn).not.toHaveClass(/bg-roast-500\/10/);

    // Switch to Senior grade
    await seniorGradeBtn.click();
    await expect(seniorGradeBtn).toHaveClass(/(?:^|\s)border-roast-500(?:\s|$)/);
    await expect(seniorGradeBtn).toHaveClass(/bg-roast-500\/10/);
    await expect(middleGradeBtn).not.toHaveClass(/(?:^|\s)border-roast-500(?:\s|$)/);
    await expect(middleGradeBtn).not.toHaveClass(/bg-roast-500\/10/);

    // Company selection verification: Default is Any
    const anyCompanyBtn = page.locator('.mock-company-btn[data-mock-company="Any"]');
    const bankCompanyBtn = page.locator('.mock-company-btn[data-mock-company="Bank"], .mock-company-btn[data-mock-company="sber"]');
    const bigtechCompanyBtn = page.locator('.mock-company-btn[data-mock-company="BigTech"]');

    await expect(anyCompanyBtn).toHaveClass(/(?:^|\s)border-roast-500(?:\s|$)/);
    await expect(anyCompanyBtn).toHaveClass(/bg-roast-500\/10/);

    // Select Bank / FinTech company
    await bankCompanyBtn.click();
    await expect(bankCompanyBtn).toHaveClass(/(?:^|\s)border-roast-500(?:\s|$)/);
    await expect(bankCompanyBtn).toHaveClass(/bg-roast-500\/10/);
    await expect(bankCompanyBtn).toHaveClass(/text-roast-500/);
    await expect(anyCompanyBtn).not.toHaveClass(/(?:^|\s)border-roast-500(?:\s|$)/);
    await expect(anyCompanyBtn).not.toHaveClass(/bg-roast-500\/10/);

    // Select BigTech company
    await bigtechCompanyBtn.click();
    await expect(bigtechCompanyBtn).toHaveClass(/(?:^|\s)border-roast-500(?:\s|$)/);
    await expect(bigtechCompanyBtn).toHaveClass(/bg-roast-500\/10/);
    await expect(bankCompanyBtn).not.toHaveClass(/(?:^|\s)border-roast-500(?:\s|$)/);
    await expect(bankCompanyBtn).not.toHaveClass(/bg-roast-500\/10/);

    // Verify time limit dropdown exists and has standard options
    const timeSelect = page.locator('#mock-time-select');
    await expect(timeSelect).toBeVisible();
    await timeSelect.selectOption('15');
    expect(await timeSelect.inputValue()).toBe('15');

    // Close setup modal via close button
    const closeBtn = page.locator('#close-mock-setup-btn');
    await closeBtn.click();
    await expect(setupModal).toBeHidden();

    expect(errors.length).toBe(0);
  });

  test('2. Starting Mock Interview: banner displayed, timer starts countdown, answer button ready', async ({ page }) => {
    // Open Setup Modal
    await page.locator('#mock-interview-btn').click();
    await expect(page.locator('#mock-setup-modal')).toBeVisible();

    // Select Middle grade & Bank company
    await page.locator('.mock-grade-btn[data-mock-grade="Middle"]').click();
    await page.locator('.mock-company-btn[data-mock-company="Bank"], .mock-company-btn[data-mock-company="sber"]').click();
    await page.locator('#mock-time-select').selectOption('30');

    // Start simulation
    await page.locator('#start-mock-btn').click();

    // Modal closes and active banner is displayed
    await expect(page.locator('#mock-setup-modal')).toBeHidden();
    await expect(page.locator('#mock-status-bar')).toBeVisible();
    await expect(page.locator('#mock-active-banner')).toBeVisible();

    // Timer is visible and shows initial format
    const mockTimer = page.locator('#mock-timer');
    const mockTimerDisplay = page.locator('#mock-timer-display');
    await expect(mockTimer).toBeVisible();
    await expect(mockTimerDisplay).toBeVisible();
    await expect(mockTimerDisplay).toHaveText('30:00');

    // Verify countdown starts and timer decrements
    await expect(mockTimerDisplay).not.toHaveText('30:00', { timeout: 6000 });
    await expect(mockTimerDisplay).toHaveText(/^(?:29:5\d|29:4\d)$/);

    // Counter shows Middle question count (Mock: 1 / 12)
    const counter = page.locator('#counter');
    await expect(counter).toContainText('Mock: 1 / 12');

    // Prev/Next buttons are disabled during mock mode
    await expect(page.locator('#btn-prev')).toBeDisabled();
    await expect(page.locator('#btn-next')).toBeDisabled();

    // Answer button is visible and ready
    const btnAnswer = page.locator('#btn-answer');
    await expect(btnAnswer).toBeVisible();
    await expect(btnAnswer).toContainText(/Answer/i);

    expect(errors.length).toBe(0);
  });

  test('3. Answering and Evaluation: reveal answer and score progression', async ({ page }) => {
    await page.locator('#mock-interview-btn').click();
    await expect(page.locator('#mock-setup-modal')).toBeVisible();
    await page.locator('#start-mock-btn').click();
    await expect(page.locator('#mock-status-bar')).toBeVisible();

    // Question 1: Click Reveal Answer
    const btnAnswer = page.locator('#btn-answer');
    await expect(btnAnswer).toBeVisible();
    await btnAnswer.click();

    // Verify answer button is hidden and evaluation bar is shown
    await expect(btnAnswer).toBeHidden();
    const evalBar = page.locator('#mock-eval-bar');
    await expect(evalBar).toBeVisible();

    // Verify evaluation buttons: Missed (0 XP), Partial (+5 XP), Nailed It (+10 XP)
    const evalMissed = page.locator('#eval-missed-btn');
    const evalPartial = page.locator('#eval-partial-btn');
    const evalNailed = page.locator('#eval-nailed-btn');
    await expect(evalMissed).toBeVisible();
    await expect(evalPartial).toBeVisible();
    await expect(evalNailed).toBeVisible();

    // Rate question 1 as Nailed (+10 XP)
    await evalNailed.click();

    // Verify auto-advances to Question 2
    await expect(page.locator('#counter')).toContainText('Mock: 2 / 10');
    await expect(evalBar).toBeHidden();
    await expect(btnAnswer).toBeVisible();

    // Question 2: Partial rating (+5 XP)
    await btnAnswer.click();
    await expect(evalBar).toBeVisible();
    await evalPartial.click();

    // Verify advances to Question 3
    await expect(page.locator('#counter')).toContainText('Mock: 3 / 10');
    await expect(evalBar).toBeHidden();
    await expect(btnAnswer).toBeVisible();

    // Question 3: Missed rating (0 XP)
    await btnAnswer.click();
    await expect(evalBar).toBeVisible();
    await evalMissed.click();

    // Verify advances to Question 4
    await expect(page.locator('#counter')).toContainText('Mock: 4 / 10');

    expect(errors.length).toBe(0);
  });

  test('4. Completing Full Mock Session: scorecard calculation, verdict, topic breakdown, and finish', async ({ page }) => {
    await page.locator('#mock-interview-btn').click();
    await expect(page.locator('#mock-setup-modal')).toBeVisible();

    // Junior = 10 questions
    await page.locator('.mock-grade-btn[data-mock-grade="Junior"]').click();
    await page.locator('.mock-company-btn[data-mock-company="Bank"], .mock-company-btn[data-mock-company="sber"]').click();
    await page.locator('#start-mock-btn').click();
    await expect(page.locator('#mock-status-bar')).toBeVisible();

    // Answer all 10 questions with "Nailed It" (10 * 10 = 100 XP, 100% score)
    for (let i = 1; i <= 10; i++) {
      await expect(page.locator('#counter')).toContainText(`Mock: ${i} / 10`);
      const btnAnswer = page.locator('#btn-answer');
      await expect(btnAnswer).toBeVisible();
      await btnAnswer.click();

      const nailedBtn = page.locator('#eval-nailed-btn');
      await expect(nailedBtn).toBeVisible();
      await nailedBtn.click();
    }

    // After last question: status bar hides, results modal opens
    await expect(page.locator('#mock-status-bar')).toBeHidden();
    const resultsModal = page.locator('#mock-results-modal');
    await expect(resultsModal).toBeVisible();

    // Scorecard verification
    await expect(page.locator('#mock-result-score')).toHaveText('100%');
    await expect(page.locator('#mock-result-xp')).toHaveText('+100 XP');
    await expect(page.locator('#mock-result-verdict')).toHaveText('PASSED');

    // Topic breakdown list is populated
    const topicBreakdown = page.locator('#mock-result-topics > div');
    const topicCount = await topicBreakdown.count();
    expect(topicCount).toBeGreaterThan(0);

    // Finish session and close modal
    const finishBtn = page.locator('#finish-mock-btn');
    await expect(finishBtn).toBeVisible();
    await finishBtn.click();
    await expect(resultsModal).toBeHidden();

    // Normal questions view is active
    await expect(page.locator('#btn-answer')).toBeVisible();
    expect(errors.length).toBe(0);
  });

  test('5. Full Mock Session with Mixed Scores: Partial Pass verdict', async ({ page }) => {
    await page.locator('#mock-interview-btn').click();
    await expect(page.locator('#mock-setup-modal')).toBeVisible();
    await page.locator('#start-mock-btn').click();
    await expect(page.locator('#mock-status-bar')).toBeVisible();

    // 6 Nailed (60 XP) + 4 Missed (0 XP) = 60% total -> PARTIAL PASS
    for (let i = 1; i <= 10; i++) {
      await expect(page.locator('#counter')).toContainText(`Mock: ${i} / 10`);
      await page.locator('#btn-answer').click();
      if (i <= 6) {
        await page.locator('#eval-nailed-btn').click();
      } else {
        await page.locator('#eval-missed-btn').click();
      }
    }

    // Results modal must show 60% and PARTIAL PASS
    const resultsModal = page.locator('#mock-results-modal');
    await expect(resultsModal).toBeVisible();
    await expect(page.locator('#mock-result-score')).toHaveText('60%');
    await expect(page.locator('#mock-result-xp')).toHaveText('+60 XP');
    await expect(page.locator('#mock-result-verdict')).toHaveText('PARTIAL PASS');

    await page.locator('#finish-mock-btn').click();
    await expect(resultsModal).toBeHidden();

    expect(errors.length).toBe(0);
  });

  test('6. Exit Active Mock Interview via Exit button with cancellation and confirmation', async ({ page }) => {
    await page.locator('#mock-interview-btn').click();
    await expect(page.locator('#mock-setup-modal')).toBeVisible();
    await page.locator('#start-mock-btn').click();
    await expect(page.locator('#mock-status-bar')).toBeVisible();

    const exitBtn = page.locator('#exit-mock-btn');
    await expect(exitBtn).toBeVisible();

    // Step 6a: Dismiss confirmation dialog -> mock session continues
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Are you sure you want to exit');
      await dialog.dismiss();
    });
    await exitBtn.click();
    await expect(page.locator('#mock-status-bar')).toBeVisible();

    // Step 6b: Accept confirmation dialog -> mock session exits
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Are you sure you want to exit');
      await dialog.accept();
    });
    await exitBtn.click();

    // Mock status bar hides, toast appears
    await expect(page.locator('#mock-status-bar')).toBeHidden();
    await expect(page.locator('#toast')).toBeVisible();
    await expect(page.locator('#toast')).toContainText(/cancelled/i);

    expect(errors.length).toBe(0);
  });

  test('7. Untimed Mock Session: selects no timer option and displays Untimed', async ({ page }) => {
    await page.locator('#mock-interview-btn').click();
    await expect(page.locator('#mock-setup-modal')).toBeVisible();

    // Select 0 (No Timer)
    await page.locator('#mock-time-select').selectOption('0');
    await page.locator('#start-mock-btn').click();

    await expect(page.locator('#mock-status-bar')).toBeVisible();
    const mockTimerDisplay = page.locator('#mock-timer-display');
    await expect(mockTimerDisplay).toBeVisible();
    await expect(mockTimerDisplay).toHaveText('Untimed');

    // Prev/Next still disabled in mock
    await expect(page.locator('#btn-prev')).toBeDisabled();
    await expect(page.locator('#btn-next')).toBeDisabled();

    // Exit cleanly
    page.once('dialog', async (dialog) => dialog.accept());
    await page.locator('#exit-mock-btn').click();
    await expect(page.locator('#mock-status-bar')).toBeHidden();

    expect(errors.length).toBe(0);
  });

  test('8. Full Mock Session with Low Score: NEEDS WORK verdict (<50%)', async ({ page }) => {
    await page.locator('#mock-interview-btn').click();
    await expect(page.locator('#mock-setup-modal')).toBeVisible();
    await page.locator('#start-mock-btn').click();
    await expect(page.locator('#mock-status-bar')).toBeVisible();

    // Junior = 10 questions: 2 Nailed (20 XP) + 8 Missed (0 XP) = 20% score -> NEEDS WORK
    for (let i = 1; i <= 10; i++) {
      await expect(page.locator('#counter')).toContainText(`Mock: ${i} / 10`);
      await page.locator('#btn-answer').click();
      if (i <= 2) {
        await page.locator('#eval-nailed-btn').click();
      } else {
        await page.locator('#eval-missed-btn').click();
      }
    }

    // Results modal must show 20% and NEEDS WORK
    const resultsModal = page.locator('#mock-results-modal');
    await expect(resultsModal).toBeVisible();
    await expect(page.locator('#mock-result-score')).toHaveText('20%');
    await expect(page.locator('#mock-result-xp')).toHaveText('+20 XP');
    await expect(page.locator('#mock-result-verdict')).toHaveText('NEEDS WORK');

    await page.locator('#finish-mock-btn').click();
    await expect(resultsModal).toBeHidden();

    expect(errors.length).toBe(0);
  });

  test('9. Timer Expiration: automatically finishes interview when time runs out', async ({ page }) => {
    await page.clock.install();
    await page.locator('#mock-interview-btn').click();
    await expect(page.locator('#mock-setup-modal')).toBeVisible();

    // Select 15 minutes
    await page.locator('#mock-time-select').selectOption('15');
    await page.locator('#start-mock-btn').click();
    await expect(page.locator('#mock-status-bar')).toBeVisible();
    await expect(page.locator('#mock-timer-display')).toHaveText('15:00');

    // Advance clock through all interval ticks to expiration
    await page.clock.runFor(15 * 60 * 1000 + 1000);

    // Results modal must automatically open and status bar hide
    const resultsModal = page.locator('#mock-results-modal');
    await expect(resultsModal).toBeVisible();
    await expect(page.locator('#mock-status-bar')).toBeHidden();

    // Close results modal
    await page.locator('#finish-mock-btn').click();
    await expect(resultsModal).toBeHidden();

    expect(errors.length).toBe(0);
  });
});
