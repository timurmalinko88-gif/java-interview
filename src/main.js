import "./style.css";
import { debounce, setDifficultyChipInactive, setDifficultyChipActive, playSound } from './utils.js';
import { state, savePersistence, onStateChange } from './state.js';
import { buildSidebarList, triggerFilterAction, clearAllFilters, loadQuestion, syncActionButtons, showToast, renderAnswerContent, hideAnswerSection, updateStatsUI } from './ui.js';
import { openMockSetup, closeMockSetup, startMockInterview, exitMockInterview, evaluateMockQuestion, revealMockAnswer } from './mock.js';
import { updateStatsDashboard, exportProgress, importProgress } from './stats.js';
import { checkAdaptiveProgression } from './adaptive.js';
import { evaluateSR } from './spacedRepetition.js';
import { toggleFlag } from './collections.js';
import { fetchQuestions } from './api.js';
import { initAlgoView, renderAlgoList, switchView } from './algorithms.js';
import { initSysDesignView } from './sysdesign.js';
import { initAIEngine, evaluateCandidateAnswer, evaluateCandidateAnswerInstant, explainWithFeynmanMethod, isWebGPUSupported } from './aiInterviewer.js';
import { SpeechRecognizer } from './speechRecognition.js';
import { initOnboarding, startTour } from './onboarding.js';

// Auto-sync UI when state changes
onStateChange(() => {
  updateStatsUI();
  updateStatsDashboard();
});

// --- app.js ---
// Initialize and load dynamic questions indexes
document.addEventListener('DOMContentLoaded', () => {
  if (typeof marked !== 'undefined') {
    marked.use({ breaks: true });
  }

  // Initialize Algorithm Breakdown & System Architecture Views
  initAlgoView({ state });
  initSysDesignView();
  window.renderAlgoListGlobal = () => renderAlgoList({ state });
  window.switchViewGlobal = switchView;

  const questionsTabBtn = document.getElementById('questions-tab-btn');
  if (questionsTabBtn) {
    questionsTabBtn.addEventListener('click', () => switchView('questions'));
  }
  const algoTabBtn = document.getElementById('algo-tab-btn');
  if (algoTabBtn) {
    algoTabBtn.addEventListener('click', () => switchView('algo'));
  }
  const sysdesignTabBtn = document.getElementById('sysdesign-tab-btn');
  if (sysdesignTabBtn) {
    sysdesignTabBtn.addEventListener('click', () => switchView('sysdesign'));
  }

  // Load and initialize core engine
  fetchQuestions();

  // Initialize interactive onboarding & platform guide
  initOnboarding();

  // Mock Interview listeners
  const mockInterviewBtn = document.getElementById('mock-interview-btn');
  if (mockInterviewBtn) mockInterviewBtn.addEventListener("click", openMockSetup);
  const closeMockSetupBtn = document.getElementById('close-mock-setup-btn');
  if (closeMockSetupBtn) closeMockSetupBtn.addEventListener("click", closeMockSetup);
  const startMockBtn = document.getElementById('start-mock-btn');
  if (startMockBtn) startMockBtn.addEventListener("click", startMockInterview);
  const exitMockBtn = document.getElementById('exit-mock-btn');
  if (exitMockBtn) exitMockBtn.addEventListener("click", exitMockInterview);
  const finishMockBtn = document.getElementById('finish-mock-btn');
  if (finishMockBtn) finishMockBtn.addEventListener("click", () => {
    document.getElementById('mock-results-modal').close();
  });

  // Grade selection buttons inside setup modal
  document.querySelectorAll('.mock-grade-btn').forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll('.mock-grade-btn').forEach(b => {
        b.classList.remove('bg-roast-500/10', 'border-roast-500', 'text-roast-500', 'dark:text-roast-500');
        b.classList.add('border-slate-200', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-400');
      });
      btn.classList.remove('border-slate-200', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-400');
      btn.classList.add('bg-roast-500/10', 'border-roast-500', 'text-roast-500', 'dark:text-roast-500');
      state.mockSelectedGrade = btn.getAttribute('data-mock-grade');
    });
  });

  // Company selection buttons inside setup modal
  document.querySelectorAll('.mock-company-btn').forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll('.mock-company-btn').forEach(b => {
        b.classList.remove('bg-roast-500/10', 'border-roast-500', 'text-roast-500', 'dark:text-roast-500');
        b.classList.add('border-slate-200', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-400');
      });
      btn.classList.remove('border-slate-200', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-400');
      btn.classList.add('bg-roast-500/10', 'border-roast-500', 'text-roast-500', 'dark:text-roast-500');
      state.mockSelectedCompany = btn.getAttribute('data-mock-company');
    });
  });

  // Evaluation buttons
  const evalMissedBtn = document.getElementById('eval-missed-btn');
  if (evalMissedBtn) evalMissedBtn.addEventListener("click", () => evaluateMockQuestion(0));
  const evalPartialBtn = document.getElementById('eval-partial-btn');
  if (evalPartialBtn) evalPartialBtn.addEventListener("click", () => evaluateMockQuestion(5));
  const evalNailedBtn = document.getElementById('eval-nailed-btn');
  if (evalNailedBtn) evalNailedBtn.addEventListener("click", () => evaluateMockQuestion(10));

  // Spaced Repetition Evaluation buttons
  const srHardBtn = document.getElementById('sr-hard-btn');
  if (srHardBtn) srHardBtn.addEventListener("click", () => {
      if (state.filteredQuestions.length === 0) return;
      const activeId = state.filteredQuestions[state.currentIndex].id;
      evaluateSR(activeId, 1);
  });
  const srMediumBtn = document.getElementById('sr-medium-btn');
  if (srMediumBtn) srMediumBtn.addEventListener("click", () => {
      if (state.filteredQuestions.length === 0) return;
      const activeId = state.filteredQuestions[state.currentIndex].id;
      evaluateSR(activeId, 2);
  });
  const srEasyBtn = document.getElementById('sr-easy-btn');
  if (srEasyBtn) srEasyBtn.addEventListener("click", () => {
      if (state.filteredQuestions.length === 0) return;
      const activeId = state.filteredQuestions[state.currentIndex].id;
      evaluateSR(activeId, 3);
  });

  // Toggle Answer actions event triggers
  const btnAnswer = document.getElementById('btn-answer');
  if (btnAnswer) {
    btnAnswer.addEventListener("click", () => {
      if (state.isMockMode) {
        revealMockAnswer();
        return;
      }
      if (state.isAnswerVisible) {
        hideAnswerSection();
      } else {
        renderAnswerContent();
      }
    });
  }

  // Previous and Next button actions
  const btnPrev = document.getElementById('btn-prev');
  if (btnPrev) {
    btnPrev.addEventListener("click", async () => {
      if (state.currentIndex > 0) {
        state.currentIndex--;
        state.isAnswerVisible = false;
        await loadQuestion(state.currentIndex);
        buildSidebarList();
        if (window.innerWidth < 1024) {
          const card = document.getElementById('main-content-card');
          if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }
  const btnNext = document.getElementById('btn-next');
  if (btnNext) {
    btnNext.addEventListener("click", async () => {
      if (state.currentIndex < state.filteredQuestions.length - 1) {
        state.currentIndex++;
        state.isAnswerVisible = false;
        await loadQuestion(state.currentIndex);
        buildSidebarList();
        if (window.innerWidth < 1024) {
          const card = document.getElementById('main-content-card');
          if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  // Flag / Bookmark toggling
  const flagBtn = document.getElementById('flag-btn');
  if (flagBtn) {
    flagBtn.addEventListener("click", () => {
      if (state.filteredQuestions.length === 0) return;
      const activeId = state.filteredQuestions[state.currentIndex].id;
      toggleFlag(activeId, "Favorites");
    });
  }

  // Mastered toggle trigger
  const masteredBtn = document.getElementById('mastered-btn');
  if (masteredBtn) {
    masteredBtn.addEventListener("click", () => {
      if (state.filteredQuestions.length === 0) return;
      const activeId = state.filteredQuestions[state.currentIndex].id;
      const idx = state.masteredIds.indexOf(activeId);
      if (idx > -1) {
        state.masteredIds.splice(idx, 1);
        showToast("Question returned to review list", "info");
      } else {
        state.masteredIds.push(activeId);
        showToast("Congratulations! Marked as mastered 👍", "success");
      }
      savePersistence();
      syncActionButtons(activeId);
      buildSidebarList();

      // Adaptive Plan hook
      if (typeof checkAdaptiveProgression === 'function') {
        checkAdaptiveProgression();
      }
    });
  }

  // Filters updates triggers
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.addEventListener("input", debounce(triggerFilterAction, 200));
  const topicFilter = document.getElementById('topic-filter');
  if (topicFilter) {
    topicFilter.addEventListener("change", (e) => {
      // If user selects a specific topic, reset roadmap to avoid empty results
      if (e.target.value !== 'all' && roadmapFilter) {
        roadmapFilter.value = 'none';
      }
      triggerFilterAction();
    });
  }
  const roadmapFilter = document.getElementById('roadmap-filter');
  if (roadmapFilter) {
    roadmapFilter.addEventListener("change", (e) => {
      // If a user selects a roadmap, reset the Topic and Search to avoid empty results
      if (e.target.value !== 'none') {
        if (topicFilter) topicFilter.value = 'all';
        if (searchInput) searchInput.value = '';
      }
      triggerFilterAction();
    });
  }
  document.querySelectorAll('.format-checkbox').forEach(el => {
    el.addEventListener("change", triggerFilterAction);
  });

  // Difficulty chips actions handlers
  document.querySelectorAll('.diff-chip').forEach(el => {
    el.addEventListener("click", () => {
      const difficulty = el.getAttribute('data-diff');
      const idx = state.selectedDiffFilters.indexOf(difficulty);
      if (idx > -1) {
        state.selectedDiffFilters.splice(idx, 1);
        // Restore visual inactive style
        setDifficultyChipInactive(el, difficulty);
      } else {
        state.selectedDiffFilters.push(difficulty);
        // Render active highlight styles depending on selection
        setDifficultyChipActive(el, difficulty);
      }
      triggerFilterAction();
    });
  });

  // Clear filter actions Link
  const clearFiltersBtn = document.getElementById('clear-filters');
  if (clearFiltersBtn) clearFiltersBtn.addEventListener("click", clearAllFilters);

  // Blitz random questions selection
  const blitzBtn = document.getElementById('blitz-btn');
  if (blitzBtn) {
    blitzBtn.addEventListener("click", async () => {
      if (state.questionsList.length === 0) return;
      const randomIdx = Math.floor(Math.random() * state.questionsList.length);

      // Clear any filters that would hide our random blitz choice
      clearAllFilters();

      // Find matching active cursor index
      state.currentIndex = state.filteredQuestions.findIndex(q => q.id === state.questionsList[randomIdx].id);
      state.isAnswerVisible = false;
      await loadQuestion(state.currentIndex);
      buildSidebarList();
      showToast("Blitz Mode: Random question selected!", "info");
    });
  }

  // Setup AI Examiner (In-Browser WebLLM + Web Speech)
  const aiInterviewBtn = document.getElementById('btn-ai-interview');
  const aiPanel = document.getElementById('ai-interviewer-panel');
  const aiCandidateInput = document.getElementById('ai-candidate-input');
  const aiVoiceBtn = document.getElementById('ai-voice-dictate-btn');
  const aiEvaluateBtn = document.getElementById('ai-evaluate-btn');
  const aiRevealRefBtn = document.getElementById('ai-reveal-reference-btn');
  const aiLoadingIndicator = document.getElementById('ai-model-loading-indicator');
  const aiStatusBadge = document.getElementById('ai-engine-status-badge');
  const aiScorecardResult = document.getElementById('ai-scorecard-result');

  if (aiInterviewBtn && aiPanel) {
    aiInterviewBtn.addEventListener('click', () => {
      aiPanel.classList.toggle('hidden');
      if (!aiPanel.classList.contains('hidden')) {
        if (aiCandidateInput) aiCandidateInput.focus();
        aiPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // Voice Dictation
  let recognizer = null;
  if (aiVoiceBtn && aiCandidateInput) {
    if (SpeechRecognizer.isSupported()) {
      recognizer = new SpeechRecognizer({
        onTranscript: (text) => {
          aiCandidateInput.value = text;
        },
        onStateChange: (isListening) => {
          if (isListening) {
            aiVoiceBtn.classList.add('bg-rose-50', 'text-rose-500', 'border-rose-300', 'animate-pulse');
            aiVoiceBtn.innerHTML = '<i class="fa-solid fa-microphone-lines text-xs text-rose-500"></i>';
          } else {
            aiVoiceBtn.classList.remove('bg-rose-50', 'text-rose-500', 'border-rose-300', 'animate-pulse');
            aiVoiceBtn.innerHTML = '<i class="fa-solid fa-microphone text-xs"></i>';
          }
        },
      });

      aiVoiceBtn.addEventListener('click', () => {
        recognizer.toggle();
      });
    } else {
      aiVoiceBtn.title = 'Голосовой ввод доступен в Chrome, Edge и Safari';
      aiVoiceBtn.classList.add('opacity-50');
    }
  }

  if (aiRevealRefBtn) {
    aiRevealRefBtn.addEventListener('click', () => {
      const btnAnswer = document.getElementById('btn-answer');
      if (btnAnswer) btnAnswer.click();
    });
  }

  function renderScorecard(result) {
    if (!aiScorecardResult) return;
    aiScorecardResult.classList.remove('hidden');

    const badgeEl = document.getElementById('ai-scorecard-badge');
    const xpEl = document.getElementById('ai-scorecard-xp');
    const summaryEl = document.getElementById('ai-scorecard-summary');
    const foundEl = document.getElementById('ai-found-concepts');
    const missedEl = document.getElementById('ai-missed-concepts');
    const followupEl = document.getElementById('ai-followup-text');

    if (badgeEl) {
      badgeEl.textContent = `${result.score}% — ${result.verdict}`;
      if (result.score >= 80) {
        badgeEl.className = 'px-2.5 py-1 rounded-[7px] text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      } else if (result.score >= 55) {
        badgeEl.className = 'px-2.5 py-1 rounded-[7px] text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20';
      } else {
        badgeEl.className = 'px-2.5 py-1 rounded-[7px] text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20';
      }
    }

    if (xpEl) xpEl.textContent = `+${result.earnedXp} XP`;
    if (summaryEl) summaryEl.textContent = result.summary;

    if (foundEl) {
      foundEl.innerHTML = (result.foundConcepts || []).map((c) =>
        `<span class="px-2 py-0.5 rounded-[5px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-medium">${c}</span>`
      ).join('') || '<span class="text-slate-400 italic">Базовые понятия</span>';
    }

    if (missedEl) {
      missedEl.innerHTML = (result.missedConcepts || []).map((c) =>
        `<span class="px-2 py-0.5 rounded-[5px] bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[11px] font-medium">${c}</span>`
      ).join('') || '<span class="text-slate-400 italic">Существенных пропусков нет</span>';
    }

    if (followupEl) {
      followupEl.textContent = result.followUp || 'Как данный подход масштабируется под высокой нагрузкой?';
    }

    aiScorecardResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  let currentAIMode = 'instant'; // default instant 0ms mode
  const aiModeInstantBtn = document.getElementById('ai-mode-instant-btn');
  const aiModeWebgpuBtn = document.getElementById('ai-mode-webgpu-btn');
  const aiModelSelect = document.getElementById('ai-model-select');
  const aiStatusDot = document.getElementById('ai-status-dot');

  function setAIMode(mode) {
    currentAIMode = mode;
    if (mode === 'instant') {
      aiModeInstantBtn?.classList.add('bg-white', 'dark:bg-panel-700', 'text-slate-900', 'dark:text-white', 'shadow-xs', 'font-semibold');
      aiModeInstantBtn?.classList.remove('text-slate-500', 'dark:text-slate-400');
      aiModeWebgpuBtn?.classList.remove('bg-white', 'dark:bg-panel-700', 'text-slate-900', 'dark:text-white', 'shadow-xs', 'font-semibold');
      aiModeWebgpuBtn?.classList.add('text-slate-500', 'dark:text-slate-400');
      aiModelSelect?.classList.add('hidden');
      if (aiStatusBadge) aiStatusBadge.textContent = '⚡ 0ms Ready';
      if (aiStatusDot) {
        aiStatusDot.className = 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse';
      }
    } else {
      aiModeWebgpuBtn?.classList.add('bg-white', 'dark:bg-panel-700', 'text-slate-900', 'dark:text-white', 'shadow-xs', 'font-semibold');
      aiModeWebgpuBtn?.classList.remove('text-slate-500', 'dark:text-slate-400');
      aiModeInstantBtn?.classList.remove('bg-white', 'dark:bg-panel-700', 'text-slate-900', 'dark:text-white', 'shadow-xs', 'font-semibold');
      aiModeInstantBtn?.classList.add('text-slate-500', 'dark:text-slate-400');
      aiModelSelect?.classList.remove('hidden');
      if (aiStatusBadge) aiStatusBadge.textContent = 'WebGPU Ready';
      if (aiStatusDot) {
        aiStatusDot.className = 'w-2 h-2 rounded-full bg-cobalt-core animate-pulse';
      }
    }
  }

  aiModeInstantBtn?.addEventListener('click', () => setAIMode('instant'));
  aiModeWebgpuBtn?.addEventListener('click', () => setAIMode('webgpu'));

  const aiDownloadProgressContainer = document.getElementById('ai-download-progress-container');
  const aiDownloadProgressText = document.getElementById('ai-download-progress-text');
  const aiDownloadProgressPct = document.getElementById('ai-download-progress-pct');
  const aiDownloadProgressBar = document.getElementById('ai-download-progress-bar');
  const aiEvaluateBtnText = document.getElementById('ai-evaluate-btn-text');

  if (aiEvaluateBtn && aiCandidateInput) {
    aiEvaluateBtn.addEventListener('click', async () => {
      const candidateText = aiCandidateInput.value.trim();
      if (!candidateText) {
        showToast('Пожалуйста, введите или надиктуйте ответ', 'info');
        aiCandidateInput.focus();
        return;
      }

      if (state.filteredQuestions.length === 0) return;
      const currentQ = state.filteredQuestions[state.currentIndex];

      if (!currentQ.loadedAnswer && !currentQ.answer) {
        await loadQuestion(state.currentIndex);
      }
      const referenceAnswer = currentQ.loadedAnswer || currentQ.answer || currentQ.question || '';

      // Instant 0ms mode (Zero GPU latency)
      if (currentAIMode === 'instant') {
        const result = evaluateCandidateAnswerInstant({
          questionTitle: currentQ.title,
          questionBody: currentQ.question || '',
          referenceAnswer: referenceAnswer,
          candidateAnswer: candidateText,
          difficulty: currentQ.difficulty || 'Middle',
        });
        renderScorecard(result);
        if (result.earnedXp > 0) {
          playSound('mastered');
          showToast(`AI оценил ответ (⚡ 50мс): +${result.earnedXp} XP!`, 'success');
        }
        return;
      }

      // WebGPU LLM mode
      aiEvaluateBtn.disabled = true;
      aiEvaluateBtn.classList.add('opacity-60', 'pointer-events-none');
      if (aiEvaluateBtnText) aiEvaluateBtnText.textContent = 'Запуск AI...';
      if (aiStatusBadge) aiStatusBadge.textContent = 'Запуск...';

      try {
        const hasWebGPU = await isWebGPUSupported();
        if (!hasWebGPU) {
          // Graceful fallback heuristic scoring if WebGPU is not supported
          const terms = referenceAnswer.toLowerCase().split(/\s+/).filter((w) => w.length > 5);
          const matchCount = terms.filter((t) => candidateText.toLowerCase().includes(t)).length;
          const estimatedScore = Math.min(95, Math.max(40, Math.round((matchCount / Math.max(4, terms.length * 0.2)) * 100)));
          renderScorecard({
            score: estimatedScore,
            verdict: estimatedScore >= 75 ? 'PASS' : 'PARTIAL',
            earnedXp: Math.round(estimatedScore / 10),
            summary: 'Ответ сопоставлен с базой знаний (WebGPU недоступен на данном устройстве, применен локальный анализатор).',
            foundConcepts: ['Ключевая терминология Java'],
            missedConcepts: ['Глубокие нюансы работы JVM / JMM'],
            followUp: 'Какие накладные расходы по памяти и CPU возникают в данном случае?',
          });
          return;
        }

        if (aiDownloadProgressContainer) aiDownloadProgressContainer.classList.remove('hidden');

        const selectedModel = document.getElementById('ai-model-select')?.value || undefined;

        await initAIEngine(selectedModel, (report, formatted) => {
          const status = formatted || { pct: Math.round((report.progress || 0) * 100), text: report.text || 'Загрузка...' };
          if (aiDownloadProgressPct) aiDownloadProgressPct.textContent = `${status.pct}%`;
          if (aiDownloadProgressBar) aiDownloadProgressBar.style.width = `${status.pct}%`;
          if (aiDownloadProgressText) {
            aiDownloadProgressText.innerHTML = `<i class="fa-solid fa-cloud-arrow-down text-cobalt-core animate-bounce"></i> ${status.text}`;
          }
          if (aiEvaluateBtnText) {
            aiEvaluateBtnText.textContent = status.pct < 100 ? `Загрузка (${status.pct}%)...` : 'Компиляция GPU...';
          }
          if (aiStatusBadge) aiStatusBadge.textContent = status.pct < 100 ? `${status.pct}%` : 'GPU Init';
        });

        if (aiDownloadProgressContainer) aiDownloadProgressContainer.classList.add('hidden');
        if (aiEvaluateBtnText) aiEvaluateBtnText.textContent = 'Анализирую ответ...';
        if (aiStatusBadge) aiStatusBadge.textContent = 'Анализ...';

        const result = await evaluateCandidateAnswer({
          questionTitle: currentQ.title,
          questionBody: currentQ.question || '',
          referenceAnswer: referenceAnswer,
          candidateAnswer: candidateText,
          difficulty: currentQ.difficulty || 'Middle',
        });

        renderScorecard(result);

        if (result.earnedXp > 0) {
          playSound('mastered');
          showToast(`AI оценил ответ: +${result.earnedXp} XP!`, 'success');
        }
      } catch (err) {
        console.warn('[WebLLM] Evaluation fallback triggered:', err);
        const fallbackResult = evaluateCandidateAnswerInstant({
          questionTitle: currentQ.title,
          questionBody: currentQ.question || '',
          referenceAnswer: referenceAnswer,
          candidateAnswer: candidateText,
          difficulty: currentQ.difficulty || 'Middle',
        });
        renderScorecard(fallbackResult);
        showToast('Локальный GPU завис — ответ моментально оценен мгновенным анализатором ⚡', 'info');
        setAIMode('instant');
      } finally {
        aiEvaluateBtn.disabled = false;
        aiEvaluateBtn.classList.remove('opacity-60', 'pointer-events-none');
        if (aiEvaluateBtnText) aiEvaluateBtnText.textContent = 'Оценить ответ через AI';
        if (aiDownloadProgressContainer) aiDownloadProgressContainer.classList.add('hidden');
        if (aiLoadingIndicator) aiLoadingIndicator.classList.add('hidden');
        if (aiStatusBadge) aiStatusBadge.textContent = 'Ready';
      }
    });
  }

  // Setup Feynman Mode (In-Browser WebLLM & Metaphor Coach)
  const feynmanBtn = document.getElementById('btn-feynman');
  const feynmanSection = document.getElementById('feynman-section');
  const feynmanCloseBtn = document.getElementById('feynman-close-btn');
  const feynmanRegenBtn = document.getElementById('feynman-regenerate-btn');
  const feynmanContent = document.getElementById('feynman-content');
  const feynmanLoading = document.getElementById('feynman-loading');
  const feynmanLoadingText = document.getElementById('feynman-loading-text');

  async function triggerFeynmanExplanation(forceRegenerate = false) {
    if (!feynmanSection || !feynmanContent) return;
    feynmanSection.classList.remove('hidden');
    feynmanSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    if (state.filteredQuestions.length === 0) return;
    const currentQ = state.filteredQuestions[state.currentIndex];

    // Ensure question content is loaded
    if (!currentQ.loadedAnswer && !currentQ.answer) {
      await loadQuestion(state.currentIndex);
    }

    // If pre-indexed analogy is available and not force-regenerating, show it
    if (currentQ.loadedAnalogy && currentQ.loadedAnalogy.trim() !== '' && !forceRegenerate) {
      feynmanContent.innerHTML = `
        <div class="space-y-3">
          <div class="p-3 bg-white/60 dark:bg-panel-900/40 rounded-[8px] border border-purple-200/50 dark:border-purple-800/30">
            <p class="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
              ${currentQ.loadedAnalogy}
            </p>
          </div>
          <div class="pt-2 border-t border-purple-200/60 dark:border-purple-800/40 flex flex-wrap items-center justify-between gap-2 text-xs text-purple-700 dark:text-purple-300">
            <span class="flex items-center gap-1.5"><i class="fa-solid fa-lightbulb text-purple-500"></i> Базовая интуитивная метафора</span>
            <button id="feynman-inline-ai-btn" class="font-semibold underline hover:text-purple-900 dark:hover:text-purple-100 flex items-center gap-1">
              <i class="fa-solid fa-wand-magic-sparkles"></i> Сгенерировать глубокую AI-аналогию ✨
            </button>
          </div>
        </div>
      `;
      const inlineAiBtn = document.getElementById('feynman-inline-ai-btn');
      if (inlineAiBtn) inlineAiBtn.onclick = () => triggerFeynmanExplanation(true);
      return;
    }

    // Generate via WebLLM
    if (feynmanLoading) feynmanLoading.classList.remove('hidden');
    if (feynmanRegenBtn) {
      feynmanRegenBtn.disabled = true;
      feynmanRegenBtn.classList.add('opacity-50', 'pointer-events-none');
    }
    feynmanContent.innerHTML = '';

    try {
      const hasWebGPU = await isWebGPUSupported();
      if (!hasWebGPU) {
        // Fallback intuitive analogy if WebGPU not available
        feynmanContent.innerHTML = marked.parse(`
### 💡 Интуитивная аналогия
Представьте работу этой концепции как организацию в оживленном ресторане: каждый официант и повар выполняют строго изолированные задачи по четкому протоколу, чтобы клиенты мгновенно получали свои заказы без путаницы и блокировок.

### 🧩 Связь с Java
В Java архитектурные механизмы **${currentQ.title}** гарантируют изоляцию состояния, корректную синхронизацию в памяти и предотвращают деградацию производительности.
        `);
        return;
      }

      const selectedModel = document.getElementById('ai-model-select')?.value || undefined;

      await initAIEngine(selectedModel, (report, formatted) => {
        if (feynmanLoadingText) {
          const status = formatted || { pct: Math.round((report.progress || 0) * 100), text: report.text || 'Загрузка...' };
          feynmanLoadingText.textContent = status.pct < 100 ? `${status.text}` : '⚡ Компиляция WebGPU шейдеров...';
        }
      });

      if (feynmanLoadingText) {
        feynmanLoadingText.textContent = 'Фейнман формулирует жизненную аналогию...';
      }

      const explanation = await explainWithFeynmanMethod({
        topic: currentQ.topic,
        questionTitle: currentQ.title,
        referenceAnswer: currentQ.loadedAnswer || currentQ.answer || '',
        onToken: (_delta, fullText) => {
          feynmanContent.innerHTML = marked.parse(fullText);
        },
      });

      feynmanContent.innerHTML = marked.parse(explanation);
      playSound('mastered');
    } catch (err) {
      console.warn('[FeynmanMode] Error, falling back to curated analogy:', err);
      feynmanContent.innerHTML = marked.parse(`
### 💡 Интуитивная аналогия
Представьте работу этой концепции как организацию в оживленном ресторане: каждый официант и повар выполняют строго изолированные задачи по четкому протоколу, чтобы клиенты мгновенно получали свои заказы без путаницы и блокировок.

### 🧩 Связь с Java
В Java механизмы **${currentQ.title}** гарантируют целостность данных, корректную изоляцию и предотвращают деградацию производительности.
      `);
      showToast('💡 Показана интуитивная аналогия из базы знаний', 'info');
    } finally {
      if (feynmanLoading) feynmanLoading.classList.add('hidden');
      if (feynmanRegenBtn) {
        feynmanRegenBtn.disabled = false;
        feynmanRegenBtn.classList.remove('opacity-50', 'pointer-events-none');
      }
    }
  }

  if (feynmanBtn) {
    feynmanBtn.addEventListener('click', () => {
      if (feynmanSection.classList.contains('hidden')) {
        triggerFeynmanExplanation(false);
      } else {
        feynmanSection.classList.add('hidden');
      }
    });
  }

  if (feynmanCloseBtn) {
    feynmanCloseBtn.addEventListener('click', () => {
      feynmanSection.classList.add('hidden');
    });
  }

  if (feynmanRegenBtn) {
    feynmanRegenBtn.addEventListener('click', () => {
      triggerFeynmanExplanation(true);
    });
  }

  // Copy source code to clipboards
  const copyCodeBtn = document.getElementById('copy-code-btn');
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener("click", () => {
      const codeContentEl = document.getElementById('code-content');
      const codeText = codeContentEl ? codeContentEl.textContent : '';
      if (!codeText) return;
      
      const textarea = document.createElement('textarea');
      textarea.value = codeText;
      document.body.appendChild(textarea);
      textarea.select();
      navigator.clipboard.writeText(codeText).then(() => {
        showToast("Code copied to clipboard!", "success");
      }).catch(() => {
        showToast("Failed to copy code", "info");
      });
      document.body.removeChild(textarea);
    });
  }

  // Theme initialization (Light Theme is default)
  const savedTheme = localStorage.getItem('java_trainer_theme');
  const isDarkMode = savedTheme === 'dark';
  
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  const darkHljs = document.getElementById('hljs-dark-theme');
  const lightHljs = document.getElementById('hljs-light-theme');
  if (darkHljs && lightHljs) {
    darkHljs.disabled = !isDarkMode;
    lightHljs.disabled = isDarkMode;
  }

  // Theme toggle triggers
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('java_trainer_theme', isDark ? 'dark' : 'light');

      // Toggle Highlight styles
      const dHljs = document.getElementById('hljs-dark-theme');
      const lHljs = document.getElementById('hljs-light-theme');
      if (dHljs) dHljs.disabled = !isDark;
      if (lHljs) lHljs.disabled = isDark;
      showToast(isDark ? "Dark theme enabled" : "Light theme enabled", "info");
    });
  }

  // Setup Stats Modal
  const statsBtn = document.getElementById('my-stats-btn');
  const statsModal = document.getElementById('stats-dashboard-modal');
  const closeStatsBtn = document.getElementById('close-stats-modal');

  function openDialogModal(modal) {
    if (!modal) return;
    modal.classList.remove('opacity-0');
    modal.style.display = 'flex';
    modal.showModal();
  }

  function closeDialogModal(modal) {
    if (!modal) return;
    modal.classList.add('opacity-0');
    modal.close();
    modal.style.display = '';
  }

  if (statsBtn && statsModal) {
    statsBtn.addEventListener("click", () => {
      if (typeof updateStatsDashboard === 'function') {
        updateStatsDashboard();
      }
      openDialogModal(statsModal);
    });
  }
  if (closeStatsBtn && statsModal) {
    closeStatsBtn.addEventListener("click", () => closeDialogModal(statsModal));
  }

  // Setup Keyboard Shortcuts Modal
  const shortcutsBtn = document.getElementById('shortcuts-btn');
  const shortcutsModal = document.getElementById('shortcuts-modal');
  const closeShortcutsBtn = document.getElementById('close-shortcuts-modal');
  if (shortcutsBtn && shortcutsModal) {
    shortcutsBtn.addEventListener("click", () => openDialogModal(shortcutsModal));
  }
  if (closeShortcutsBtn && shortcutsModal) {
    closeShortcutsBtn.addEventListener("click", () => closeDialogModal(shortcutsModal));
  }

  // Direct Share Link Button
  const shareLinkBtn = document.getElementById('share-link-btn');
  if (shareLinkBtn) {
    shareLinkBtn.addEventListener("click", () => {
      if (state.filteredQuestions.length === 0) return;
      const q = state.filteredQuestions[state.currentIndex];
      if (!q) return;
      const url = `${window.location.origin}${window.location.pathname}#q=${q.id}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          showToast("Direct question link copied!", "bookmark");
        }).catch(() => {
          showToast(`Link: ${url}`, "bookmark");
        });
      } else {
        showToast(`Link: ${url}`, "bookmark");
      }
    });
  }

  // Quick Status Filter Chips
  document.querySelectorAll('.status-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const status = btn.getAttribute('data-status');
      state.statusFilter = status;
      document.querySelectorAll('.status-chip').forEach(b => {
        if (b === btn) {
          b.className = 'status-chip active px-2.5 py-1 rounded-[7px] font-medium bg-roast-500 text-white transition-all shrink-0';
        } else {
          b.className = 'status-chip px-2.5 py-1 rounded-[7px] font-medium text-slate-600 dark:text-slate-400 bg-paper-50 dark:bg-panel-900 border border-slate-200 dark:border-slate-800 hover:text-roast-500 hover:border-roast-500/50 transition-all flex items-center gap-1 shrink-0';
        }
      });
      playSound('click');
      triggerFilterAction();
    });
  });

  // Export Progress Backup
  const exportProgBtn = document.getElementById('export-progress-btn');
  if (exportProgBtn) {
    exportProgBtn.addEventListener("click", () => {
      exportProgress();
      showToast("Progress exported successfully!", "success");
    });
  }

  // Import Progress Backup
  const importProgInput = document.getElementById('import-progress-input');
  if (importProgInput) {
    importProgInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = importProgress(event.target.result);
        if (result.success) {
          showToast(`Restored ${result.count} mastered questions!`, "success");
          updateStatsUI();
          updateStatsDashboard();
          buildSidebarList();
        } else {
          showToast(`Import failed: ${result.error}`, "info");
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    });
  }
  
  // Reset Progress logic
  const resetProgBtn = document.getElementById('reset-progress-btn');
  if (resetProgBtn) {
    resetProgBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to reset all progress (XP, ranks, question ratings, and bookmarks)? This cannot be undone.")) {
            // Clear local storage keys
            localStorage.removeItem('java_trainer_mastered');
            localStorage.removeItem('java_trainer_flagged');
            localStorage.removeItem('java_trainer_sr');
            
            // Reload page to start fresh
            window.location.reload();
        }
    });
  }

  // Deep Link URL Hash handler
  function handleUrlHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#q=')) {
      const targetId = hash.replace('#q=', '').trim();
      if (targetId) {
        let idx = state.filteredQuestions.findIndex(q => q.id === targetId);
        if (idx !== -1) {
          state.currentIndex = idx;
          loadQuestion(idx);
        } else {
          const allIdx = state.questionsList.findIndex(q => q.id === targetId);
          if (allIdx !== -1) {
            clearAllFilters();
            idx = state.filteredQuestions.findIndex(q => q.id === targetId);
            if (idx !== -1) {
              state.currentIndex = idx;
              loadQuestion(idx);
            }
          }
        }
      }
    }
  }
  window.addEventListener('hashchange', handleUrlHash);

  // Hotkeys Feature
  document.addEventListener('keydown', async e => {
    // Escape closes open modals
    if (e.key === 'Escape') {
      const openDialog = Array.from(document.querySelectorAll('dialog')).find(d => d.open);
      if (openDialog) {
        closeDialogModal(openDialog);
        return;
      }
    }

    // Do not trigger hotkeys if user is typing in input or textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    // Skip hotkeys if any dialog modal is currently open
    const isAnyModalOpen = Array.from(document.querySelectorAll('dialog')).some(d => d.open);
    if (isAnyModalOpen) {
      return;
    }

    if (e.key === '?' || (e.shiftKey && e.key === '/')) {
      e.preventDefault();
      if (shortcutsModal) openDialogModal(shortcutsModal);
      return;
    }

    if (e.key === '/') {
      e.preventDefault();
      if (searchInput) searchInput.focus();
      return;
    }

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        if (btnNext && !btnNext.disabled) btnNext.click();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (btnPrev && !btnPrev.disabled) btnPrev.click();
        break;
      case ' ':
        // Spacebar
        e.preventDefault();
        if (btnAnswer) btnAnswer.click();
        break;
      case 'm':
      case 'M':
      case 'ь': // Russian layout 'M'
      case 'Ь':
        e.preventDefault();
        if (masteredBtn) masteredBtn.click();
        break;
      case 'f':
      case 'F':
      case 'а': // Russian layout 'F'
      case 'А':
        e.preventDefault();
        if (flagBtn) flagBtn.click();
        break;
      case '1':
        if (state.isAnswerVisible && !state.isMockMode && srHardBtn) {
          e.preventDefault();
          srHardBtn.click();
        }
        break;
      case '2':
        if (state.isAnswerVisible && !state.isMockMode && srMediumBtn) {
          e.preventDefault();
          srMediumBtn.click();
        }
        break;
      case '3':
        if (state.isAnswerVisible && !state.isMockMode && srEasyBtn) {
          e.preventDefault();
          srEasyBtn.click();
        }
        break;
    }
  });
});

import { registerSW } from 'virtual:pwa-register';
registerSW({ immediate: true });

