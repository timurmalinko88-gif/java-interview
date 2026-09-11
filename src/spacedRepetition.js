import { state, savePersistence } from './state.js';
import { syncActionButtons, buildSidebarList, showToast, updateStatsUI, loadQuestion } from './ui.js';

// SuperMemo-2 inspired SR algorithm
export function evaluateSR(questionId, grade) {
  // grade: 3 = Easy, 2 = Medium, 1 = Hard, 0 = Again
  let data = state.srData[questionId];
  
  if (!data) {
    data = {
      interval: 0,
      repetition: 0,
      repetitions: 0,
      efactor: 2.5,
      easeFactor: 2.5,
      nextReviewDate: new Date().toISOString()
    };
  }

  if (grade >= 2) {
    if (data.repetition === 0) {
      data.interval = 1;
    } else if (data.repetition === 1) {
      data.interval = 6;
    } else {
      data.interval = Math.round(data.interval * data.efactor);
    }
    data.repetition += 1;
  } else {
    data.repetition = 0;
    data.interval = 1;
  }

  data.repetitions = data.repetition;
  data.efactor = data.efactor + (0.1 - (3 - grade) * (0.08 + (3 - grade) * 0.02));
  if (data.efactor < 1.3) data.efactor = 1.3;
  data.easeFactor = data.efactor;

  const now = new Date();
  now.setDate(now.getDate() + data.interval);
  data.nextReviewDate = now.toISOString();

  state.srData[questionId] = data;
  
  // XP Logic: Add to masteredIds if grade is Good (2) or Easy (3)
  if (grade >= 2 && !state.masteredIds.includes(questionId)) {
      state.masteredIds.push(questionId);
  }
  
  savePersistence();
  syncActionButtons(questionId);
  updateStatsUI();
  
  showToast(`Next review in ${data.interval} day(s)`, "success");

  // Auto-advance to next question if possible
  if (state.currentIndex < state.filteredQuestions.length - 1) {
      state.currentIndex++;
      // Wait for toast, then load next
      setTimeout(() => {
          loadQuestion(state.currentIndex);
          buildSidebarList();
      }, 500);
  } else {
      buildSidebarList();
  }
}

export function isDueForReview(questionId) {
  try {
    const stored = localStorage.getItem('java_trainer_sr');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object') {
        state.srData = parsed;
      }
    }
  } catch (e) {}
  const data = state.srData[questionId];
  if (!data) return false;
  return new Date(data.nextReviewDate) <= new Date();
}

export function getSRStatus(questionId) {
    return state.srData[questionId] || null;
}

