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
    modal.showModal();
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.remove('opacity-0'), 10);
  }

  function closeDialogModal(modal) {
    if (!modal) return;
    modal.classList.add('opacity-0');
    setTimeout(() => {
      modal.close();
      modal.style.display = '';
    }, 300);
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
          b.className = 'status-chip active px-2.5 py-1 rounded-md font-bold bg-roast-500 text-white transition-all shrink-0';
        } else {
          b.className = 'status-chip px-2.5 py-1 rounded-md font-bold text-slate-500 bg-slate-100 dark:bg-panel-900 hover:text-roast-500 transition-all flex items-center gap-1 shrink-0';
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

