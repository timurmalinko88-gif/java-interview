import './style.css';
import { onStateChange, state, loadPersistence } from './state.js';
import { updateStatsUI } from './ui.js';
import { updateStatsDashboard } from './stats.js';
import { fetchQuestions } from './api.js';
import { initAlgoView, renderAlgoList, switchView } from './algorithms.js';
import { initSysDesignView } from './sysdesign.js';
import { initOnboarding } from './onboarding.js';
import { initLlmTrackView } from './llmTrack.js';
import { initModals } from './modals.js';
import { initAIExaminerView } from './aiExaminerView.js';
import { initQuestionNavigation } from './questionNavigation.js';
import { initHotkeys } from './hotkeys.js';
import { registerSW } from 'virtual:pwa-register';

// Auto-sync UI when state changes
onStateChange(() => {
  updateStatsUI();
  updateStatsDashboard();
});

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  if (typeof marked !== 'undefined') {
    marked.use({ breaks: true });
  }

  // Initialize Algorithm Breakdown & System Architecture Views
  initAlgoView({ state });
  initSysDesignView();
  window.renderAlgoListGlobal = () => renderAlgoList({ state });
  window.switchViewGlobal = switchView;
  window.state = state;
  window.loadPersistence = loadPersistence;

  // View Tab Listeners
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
  const llmTabBtn = document.getElementById('llm-tab-btn');
  if (llmTabBtn) {
    llmTabBtn.addEventListener('click', () => switchView('llm'));
  }

  // Initialize modular feature views & listeners
  initLlmTrackView();
  initModals();
  initAIExaminerView();
  initQuestionNavigation();
  initHotkeys();

  // Load and initialize question catalog
  fetchQuestions();

  // Interactive onboarding & platform guide
  initOnboarding();
});

// Register PWA service worker with autoUpdate
registerSW({ immediate: true });
