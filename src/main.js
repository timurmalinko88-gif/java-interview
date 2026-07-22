import "./style.css";
import { debounce, setDifficultyChipInactive, setDifficultyChipActive } from './utils.js';
import { state, savePersistence } from './state.js';
import { buildSidebarList, triggerFilterAction, clearAllFilters, loadQuestion, syncActionButtons, showToast, renderAnswerContent, hideAnswerSection } from './ui.js';
import { openMockSetup, closeMockSetup, startMockInterview, exitMockInterview, evaluateMockQuestion, revealMockAnswer } from './mock.js';
import { updateStatsDashboard } from './stats.js';
import { checkAdaptiveProgression } from './adaptive.js';
import { evaluateSR } from './spacedRepetition.js';
import { toggleFlag } from './collections.js';

import "./style.css";


import { fetchQuestions } from './api.js';

// --- app.js ---
// Initialize and load dynamic questions indexes
document.addEventListener('DOMContentLoaded', () => {
  if (typeof marked !== 'undefined') {
    marked.use({ breaks: true });
  }

  // Load and initialize core engine
  fetchQuestions();

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
        b.classList.remove('bg-brand-500/10', 'border-brand-500', 'text-brand-600', 'dark:text-brand-400');
        b.classList.add('border-slate-200', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-400');
      });
      btn.classList.remove('border-slate-200', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-400');
      btn.classList.add('bg-brand-500/10', 'border-brand-500', 'text-brand-600', 'dark:text-brand-400');
      state.mockSelectedGrade = btn.getAttribute('data-mock-grade');
    });
  });

  // Company selection buttons inside setup modal
  document.querySelectorAll('.mock-company-btn').forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll('.mock-company-btn').forEach(b => {
        b.classList.remove('bg-brand-500/10', 'border-brand-500', 'text-brand-600', 'dark:text-brand-400');
        b.classList.add('border-slate-200', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-400');
      });
      btn.classList.remove('border-slate-200', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-400');
      btn.classList.add('bg-brand-500/10', 'border-brand-500', 'text-brand-600', 'dark:text-brand-400');
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
      const activeId = state.filteredQuestions[state.currentIndex].id;
      evaluateSR(activeId, 1);
  });
  const srMediumBtn = document.getElementById('sr-medium-btn');
  if (srMediumBtn) srMediumBtn.addEventListener("click", () => {
      const activeId = state.filteredQuestions[state.currentIndex].id;
      evaluateSR(activeId, 2);
  });
  const srEasyBtn = document.getElementById('sr-easy-btn');
  if (srEasyBtn) srEasyBtn.addEventListener("click", () => {
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
      }
    });
  }

  // Flag / Bookmark toggling
  const flagBtn = document.getElementById('flag-btn');
  if (flagBtn) {
    flagBtn.addEventListener("click", () => {
      if (state.filteredQuestions.length === 0) return;
      const activeId = state.filteredQuestions[state.currentIndex].id;
      
      // Basic toggle (always adds to Favorites for now; could be expanded to a UI selector)
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
        showToast("Question возвращен к изучению", "info");
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
  if (topicFilter) topicFilter.addEventListener("change", triggerFilterAction);
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
        setDifficultyChipActive(el);
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
      showToast("Режим блиц: Выбран случайный вопрос!", "info");
    });
  }

  // Copy source code to clipboards
  const copyCodeBtn = document.getElementById('copy-code-btn');
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener("click", () => {
      const codeText = document.getElementById('code-content').textContent;
      // Workaround context boundary copy restriction fallback
      const textarea = document.createElement('textarea');
      textarea.value = codeText;
      document.body.appendChild(textarea);
      textarea.select();
      navigator.clipboard.writeText(codeText).then(() => {
        showToast("Код успешно скопирован!", "success");
      }).catch(err => {
        showToast("Не удалось скопировать код", "info");
      });
      document.body.removeChild(textarea);
    });
  }

  // Theme toggle triggers
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle('dark');

      // Toggle Highlight styles
      document.getElementById('hljs-dark-theme').disabled = !isDark;
      document.getElementById('hljs-light-theme').disabled = isDark;
      showToast(isDark ? "Темная тема включена" : "Светлая тема включена", "info");
    });
  }

  // Setup Stats Modal
  const statsBtn = document.getElementById('my-stats-btn');
  const statsModal = document.getElementById('stats-dashboard-modal');
  const closeStatsBtn = document.getElementById('close-stats-modal');
  if (statsBtn && statsModal) {
    statsBtn.addEventListener("click", () => {
      if (typeof updateStatsDashboard === 'function') {
        updateStatsDashboard();
      }
      statsModal.showModal();
      statsModal.style.display = 'flex';
      setTimeout(() => statsModal.classList.remove('opacity-0'), 10);
    });
  }
  if (closeStatsBtn && statsModal) {
    closeStatsBtn.addEventListener("click", () => {
      statsModal.classList.add('opacity-0');
      setTimeout(() => {
        statsModal.close();
        statsModal.style.display = '';
      }, 300);
    });
  }
  
  // Reset Progress logic
  const resetProgBtn = document.getElementById('reset-progress-btn');
  if (resetProgBtn) {
    resetProgBtn.addEventListener("click", () => {
        if (confirm("Вы уверены, что хотите сбросить весь прогресс (XP, ранги, оценки вопросов и закладки)? Это действие необратимо.")) {
            // Clear local storage keys
            localStorage.removeItem('java_trainer_mastered');
            localStorage.removeItem('java_trainer_flagged');
            localStorage.removeItem('java_trainer_sr');
            
            // Reload page to start fresh
            window.location.reload();
        }
    });
  }

  // Hotkeys Feature
  document.addEventListener('keydown', async e => {
    // Do not trigger hotkeys if user is typing in the search input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    // Skip hotkeys if any modal is open
    if (!document.getElementById('adaptive-modal').classList.contains('hidden') || !document.getElementById('adaptive-roadmap-modal').classList.contains('hidden') || statsModal && !statsModal.classList.contains('hidden') || !document.getElementById('mock-setup-modal').classList.contains('hidden') || !document.getElementById('mock-results-modal').classList.contains('hidden')) {
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
    }
  });
});

import { registerSW } from 'virtual:pwa-register';
registerSW({ immediate: true });
