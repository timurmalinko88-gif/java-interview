import { test, expect } from '@playwright/test';

test.describe('In-Browser LLM Engine & Examiner Diagnostic Suite', () => {
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

    await page.goto('./', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#active-difficulty')).toBeVisible({ timeout: 15000 });
  });

  test('Scenario 1: Mode Switcher toggles Instant (0ms) and WebGPU LLM models', async ({ page }) => {
    const aiBtn = page.locator('#btn-ai-interview');
    await aiBtn.click();
    await expect(page.locator('#ai-interviewer-panel')).toBeVisible();

    // Verify instant mode default
    const instantBtn = page.locator('#ai-mode-instant-btn');
    const webgpuBtn = page.locator('#ai-mode-webgpu-btn');
    await expect(instantBtn).toBeVisible();
    await expect(webgpuBtn).toBeVisible();

    // Toggle to WebGPU mode
    await webgpuBtn.click();
    const modelSelect = page.locator('#ai-model-select');
    await expect(modelSelect).toBeVisible();

    const options = await modelSelect.locator('option').allTextContents();
    expect(options.length).toBe(4);
    expect(options[0]).toContain('Ultra-Fast Coder 0.5B');
    expect(options[1]).toContain('Ultra-Light 360M');
    expect(options[2]).toContain('Balanced Llama 1B');
    expect(options[3]).toContain('Deep Coder 1.5B');
  });

  test('Scenario 2: AI Examiner processes candidate answer and renders scorecard', async ({ page }) => {
    const aiBtn = page.locator('#btn-ai-interview');
    await aiBtn.click();

    const textarea = page.locator('#ai-candidate-input');
    await textarea.fill('ArrayList uses dynamic array with fast O(1) random access, while LinkedList uses doubly linked nodes with O(1) insertions.');

    const evaluateBtn = page.locator('#ai-evaluate-btn');
    await evaluateBtn.click();

    // Verify scorecard renders
    const scorecard = page.locator('#ai-scorecard-result');
    await expect(scorecard).toBeVisible({ timeout: 20000 });

    const badge = page.locator('#ai-scorecard-badge');
    await expect(badge).toBeVisible();
    const badgeText = await badge.textContent();
    const scoreVal = parseInt(badgeText, 10);
    expect(scoreVal).toBeGreaterThanOrEqual(40);
  });

  test('Scenario 3: Non-technical / gibberish answer ("парам ап мпам") handled safely with REVISE verdict', async ({ page }) => {
    const aiBtn = page.locator('#btn-ai-interview');
    await aiBtn.click();

    const textarea = page.locator('#ai-candidate-input');
    await textarea.fill('парам ап мпам');

    const evaluateBtn = page.locator('#ai-evaluate-btn');
    await evaluateBtn.click();

    // Verify scorecard is produced without crash
    const scorecard = page.locator('#ai-scorecard-result');
    await expect(scorecard).toBeVisible({ timeout: 20000 });

    const badge = page.locator('#ai-scorecard-badge');
    await expect(badge).toBeVisible();
    const badgeText = await badge.textContent();
    expect(badgeText).toMatch(/REVISE|PARTIAL/);
    expect(errors.length).toBe(0);
  });

  test('Scenario 4: Feynman Mode and AI Examiner concurrent activation works cleanly without mutex locks', async ({ page }) => {
    // Trigger Feynman Mode
    const feynmanBtn = page.locator('#btn-feynman');
    await feynmanBtn.click();
    await expect(page.locator('#feynman-section')).toBeVisible();

    // Open AI Examiner concurrently
    const aiBtn = page.locator('#btn-ai-interview');
    await aiBtn.click();
    await expect(page.locator('#ai-interviewer-panel')).toBeVisible();

    // Evaluate answer while Feynman is open
    const textarea = page.locator('#ai-candidate-input');
    await textarea.fill('Testing concurrent execution of Feynman and Examiner.');
    await page.locator('#ai-evaluate-btn').click();

    await expect(page.locator('#ai-scorecard-result')).toBeVisible({ timeout: 20000 });
    expect(errors.length).toBe(0);
  });

  test('Scenario 5: Voice dictation button toggles recognition state', async ({ page }) => {
    const aiBtn = page.locator('#btn-ai-interview');
    await aiBtn.click();

    const voiceBtn = page.locator('#ai-voice-dictate-btn');
    await expect(voiceBtn).toBeVisible();
    await voiceBtn.click();

    expect(errors.length).toBe(0);
  });
});
