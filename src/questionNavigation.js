import { state, savePersistence, loadPersistence } from './state.js';
import { debounce, setDifficultyChipInactive, setDifficultyChipActive, playSound } from './utils.js';
import {
  buildSidebarList,
  triggerFilterAction,
  clearAllFilters,
  loadQuestion,
  syncActionButtons,
  showToast,
  renderAnswerContent,
  hideAnswerSection,
  updateStatsUI
} from './ui.js';
import {
  openMockSetup,
  closeMockSetup,
  startMockInterview,
  exitMockInterview,
  evaluateMockQuestion,
  revealMockAnswer
} from './mock.js';
import { checkAdaptiveProgression } from './adaptive.js';
import { evaluateSR } from './spacedRepetition.js';
import { toggleFlag } from './collections.js';
import { updateStatsDashboard, exportProgress, importProgress } from './stats.js';

export function initQuestionNavigation() {
  // Mock Interview listeners
  const mockInterviewBtn = document.getElementById('mock-interview-btn');
  if (mockInterviewBtn) mockInterviewBtn.addEventListener('click', openMockSetup);
  const closeMockSetupBtn = document.getElementById('close-mock-setup-btn');
  if (closeMockSetupBtn) closeMockSetupBtn.addEventListener('click', closeMockSetup);
  const startMockBtn = document.getElementById('start-mock-btn');
  if (startMockBtn) startMockBtn.addEventListener('click', startMockInterview);
  const exitMockBtn = document.getElementById('exit-mock-btn');
  if (exitMockBtn) exitMockBtn.addEventListener('click', exitMockInterview);
  const finishMockBtn = document.getElementById('finish-mock-btn');
  if (finishMockBtn)
    finishMockBtn.addEventListener('click', () => {
      document.getElementById('mock-results-modal').close();
    });

  // Grade selection buttons inside setup modal
  document.querySelectorAll('.mock-grade-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mock-grade-btn').forEach((b) => {
        b.classList.remove('bg-roast-500/10', 'border-roast-500', 'text-roast-500', 'dark:text-roast-500');
        b.classList.add('border-slate-200', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-400');
      });
      btn.classList.remove('border-slate-200', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-400');
      btn.classList.add('bg-roast-500/10', 'border-roast-500', 'text-roast-500', 'dark:text-roast-500');
      state.mockSelectedGrade = btn.getAttribute('data-mock-grade');
    });
  });

  // Company selection buttons inside setup modal
  document.querySelectorAll('.mock-company-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mock-company-btn').forEach((b) => {
        b.classList.remove('bg-roast-500/10', 'border-roast-500', 'text-roast-500', 'dark:text-roast-500');
        b.classList.add('border-slate-200', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-400');
      });
      btn.classList.remove('border-slate-200', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-400');
      btn.classList.add('bg-roast-500/10', 'border-roast-500', 'text-roast-500', 'dark:text-roast-500');
      state.mockSelectedCompany = btn.getAttribute('data-mock-company');
    });
  });

  // Mock evaluation buttons
  const evalMissedBtn = document.getElementById('eval-missed-btn');
  if (evalMissedBtn) evalMissedBtn.addEventListener('click', () => evaluateMockQuestion(0));
  const evalPartialBtn = document.getElementById('eval-partial-btn');
  if (evalPartialBtn) evalPartialBtn.addEventListener('click', () => evaluateMockQuestion(5));
  const evalNailedBtn = document.getElementById('eval-nailed-btn');
  if (evalNailedBtn) evalNailedBtn.addEventListener('click', () => evaluateMockQuestion(10));

  // Spaced Repetition Evaluation buttons
  const srHardBtn = document.getElementById('sr-hard-btn');
  if (srHardBtn)
    srHardBtn.addEventListener('click', () => {
      if (state.filteredQuestions.length === 0) return;
      const activeId = state.filteredQuestions[state.currentIndex].id;
      evaluateSR(activeId, 1);
    });
  const srMediumBtn = document.getElementById('sr-medium-btn');
  if (srMediumBtn)
    srMediumBtn.addEventListener('click', () => {
      if (state.filteredQuestions.length === 0) return;
      const activeId = state.filteredQuestions[state.currentIndex].id;
      evaluateSR(activeId, 2);
    });
  const srEasyBtn = document.getElementById('sr-easy-btn');
  if (srEasyBtn)
    srEasyBtn.addEventListener('click', () => {
      if (state.filteredQuestions.length === 0) return;
      const activeId = state.filteredQuestions[state.currentIndex].id;
      evaluateSR(activeId, 3);
    });

  // Toggle Answer actions event triggers
  const btnAnswer = document.getElementById('btn-answer');
  if (btnAnswer) {
    btnAnswer.addEventListener('click', () => {
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
    btnPrev.addEventListener('click', async () => {
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
    btnNext.addEventListener('click', async () => {
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
    flagBtn.addEventListener('click', () => {
      if (state.filteredQuestions.length === 0) return;
      const activeId = state.filteredQuestions[state.currentIndex].id;
      toggleFlag(activeId, 'Favorites');
    });
  }

  // Mastered toggle trigger
  const masteredBtn = document.getElementById('mastered-btn');
  if (masteredBtn) {
    masteredBtn.addEventListener('click', () => {
      if (state.filteredQuestions.length === 0) return;
      const activeId = state.filteredQuestions[state.currentIndex].id;
      const idx = state.masteredIds.indexOf(activeId);
      if (idx > -1) {
        state.masteredIds.splice(idx, 1);
        showToast('Question returned to review list', 'info');
      } else {
        state.masteredIds.push(activeId);
        showToast('Congratulations! Marked as mastered 👍', 'success');
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
  if (searchInput) searchInput.addEventListener('input', debounce(triggerFilterAction, 200));
  const topicFilter = document.getElementById('topic-filter');
  const roadmapFilter = document.getElementById('roadmap-filter');

  if (topicFilter) {
    topicFilter.addEventListener('change', (e) => {
      // If user selects a specific topic, reset roadmap to avoid empty results
      if (e.target.value !== 'all' && roadmapFilter) {
        roadmapFilter.value = 'none';
      }
      triggerFilterAction();
    });
  }
  if (roadmapFilter) {
    roadmapFilter.addEventListener('change', (e) => {
      // If a user selects a roadmap, reset Topic and Search to avoid empty results
      if (e.target.value !== 'none') {
        if (topicFilter) topicFilter.value = 'all';
        if (searchInput) searchInput.value = '';
      }
      triggerFilterAction();
    });
  }
  document.querySelectorAll('.format-checkbox').forEach((el) => {
    el.addEventListener('change', triggerFilterAction);
  });

  // Difficulty chips actions handlers
  document.querySelectorAll('.diff-chip').forEach((el) => {
    el.addEventListener('click', () => {
      const difficulty = el.getAttribute('data-diff');
      const idx = state.selectedDiffFilters.indexOf(difficulty);
      if (idx > -1) {
        state.selectedDiffFilters.splice(idx, 1);
        setDifficultyChipInactive(el, difficulty);
      } else {
        state.selectedDiffFilters.push(difficulty);
        setDifficultyChipActive(el, difficulty);
      }
      triggerFilterAction();
    });
  });

  // Clear filter actions Link
  const clearFiltersBtn = document.getElementById('clear-filters');
  if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', clearAllFilters);

  // Blitz random questions selection
  const blitzBtn = document.getElementById('blitz-btn');
  if (blitzBtn) {
    blitzBtn.addEventListener('click', async () => {
      if (state.questionsList.length === 0) return;
      const randomIdx = Math.floor(Math.random() * state.questionsList.length);

      // Clear any filters that would hide our random blitz choice
      clearAllFilters();

      // Find matching active cursor index
      state.currentIndex = state.filteredQuestions.findIndex(
        (q) => q.id === state.questionsList[randomIdx].id
      );
      state.isAnswerVisible = false;
      await loadQuestion(state.currentIndex);
      buildSidebarList();
      showToast('Blitz Mode: Random question selected!', 'info');
    });
  }

  // Quick Status Filter Chips
  document.querySelectorAll('.status-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      const status = btn.getAttribute('data-status');
      state.statusFilter = status;
      loadPersistence();
      document.querySelectorAll('.status-chip').forEach((b) => {
        if (b === btn) {
          b.className =
            'status-chip active px-2.5 py-1 rounded-[7px] font-medium bg-roast-500 text-white transition-all shrink-0';
        } else {
          b.className =
            'status-chip px-2.5 py-1 rounded-[7px] font-medium text-slate-600 dark:text-slate-400 bg-paper-50 dark:bg-panel-900 border border-slate-200 dark:border-slate-800 hover:text-roast-500 hover:border-roast-500/50 transition-all flex items-center gap-1 shrink-0';
        }
      });
      playSound('click');
      triggerFilterAction();
    });
  });

  // Export Progress Backup
  const exportProgBtn = document.getElementById('export-progress-btn');
  if (exportProgBtn) {
    exportProgBtn.addEventListener('click', () => {
      exportProgress();
      showToast('Progress exported successfully!', 'success');
    });
  }

  // Import Progress Backup
  const importProgInput = document.getElementById('import-progress-input');
  if (importProgInput) {
    importProgInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = importProgress(event.target.result);
        if (result.success) {
          showToast(`Restored ${result.count} mastered questions!`, 'success');
          updateStatsUI();
          updateStatsDashboard();
          buildSidebarList();
        } else {
          showToast(`Import failed: ${result.error}`, 'info');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    });
  }

  // Deep Link URL Hash handler
  function handleUrlHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#q=')) {
      const targetId = hash.replace('#q=', '').trim();
      if (targetId) {
        let idx = state.filteredQuestions.findIndex((q) => q.id === targetId);
        if (idx !== -1) {
          state.currentIndex = idx;
          loadQuestion(idx);
        } else {
          const allIdx = state.questionsList.findIndex((q) => q.id === targetId);
          if (allIdx !== -1) {
            clearAllFilters();
            idx = state.filteredQuestions.findIndex((q) => q.id === targetId);
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
}
