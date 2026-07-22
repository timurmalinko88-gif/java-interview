import { loadQuestion, showToast, buildSidebarList, renderAnswerContent } from './ui.js';
import { state } from './state.js';
export function openMockSetup() {
  document.getElementById('mock-setup-modal').showModal();
}
export function closeMockSetup() {
  document.getElementById('mock-setup-modal').close();
}
export function startMockInterview() {
  const timeLimit = parseInt(document.getElementById('mock-time-select').value, 10);

  // Pool filtering based on target grade
  let candidatePool = state.questionsList.filter(q => {
    if (state.mockSelectedGrade === 'Junior') return q.difficulty === 'Junior' || q.difficulty === 'Middle';
    if (state.mockSelectedGrade === 'Middle') return q.difficulty === 'Middle' || q.difficulty === 'Senior' || q.difficulty === 'Junior';
    return q.difficulty === 'Senior' || q.difficulty === 'Middle';
  });

  // Pool filtering based on target company
  if (state.mockSelectedCompany !== 'Any') {
    const companyProfiles = {
      'Bank': ['multithreading', 'memory', 'databases', 'jvm', 'spring-core'],
      'Outsource': ['oop', 'patterns', 'stream-api', 'collections', 'solid', 'exceptions', 'spring-mvc'],
      'BigTech': ['system-design', 'jvm', 'memory', 'multithreading', 'collections', 'high-load'],
      'Startup': ['spring-boot', 'stream-api', 'databases', 'collections', 'patterns', 'rest']
    };
    const preferredTags = companyProfiles[state.mockSelectedCompany] || [];
    let filteredByCompany = candidatePool.filter(q => {
      if (!q.tags) return false;
      return q.tags.some(tag => preferredTags.includes(tag.toLowerCase()));
    });
    let targetCount = state.mockSelectedGrade === 'Senior' ? 15 : state.mockSelectedGrade === 'Middle' ? 12 : 10;
    // Fallback: If strict company filter produces too few questions, pad with general pool
    if (filteredByCompany.length < targetCount) {
      const needed = targetCount - filteredByCompany.length;
      const remaining = candidatePool.filter(q => !filteredByCompany.includes(q));
      // Simple shuffle for remaining
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }
      filteredByCompany = [...filteredByCompany, ...remaining.slice(0, needed)];
    }
    candidatePool = filteredByCompany;
  }
  if (candidatePool.length === 0) candidatePool = [...state.questionsList];

  // Shuffle pool (Fisher-Yates)
  for (let i = candidatePool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidatePool[i], candidatePool[j]] = [candidatePool[j], candidatePool[i]];
  }

  // Target question count: Junior: 10, Middle: 12, Senior: 15
  let targetCount = 10;
  if (state.mockSelectedGrade === 'Middle') targetCount = 12;
  if (state.mockSelectedGrade === 'Senior') targetCount = 15;
  state.mockQuestions = candidatePool.slice(0, Math.min(targetCount, candidatePool.length));
  state.mockCurrentIdx = 0;
  state.mockScores = [];
  state.isMockMode = true;

  // Timer setup
  if (state.mockTimerInterval) clearInterval(state.mockTimerInterval);
  if (timeLimit > 0) {
    state.mockTimeRemaining = timeLimit * 60;
    updateMockTimerDisplay();
    state.mockTimerInterval = setInterval(() => {
      state.mockTimeRemaining--;
      updateMockTimerDisplay();
      if (state.mockTimeRemaining <= 0) {
        clearInterval(state.mockTimerInterval);
        showToast("Time's up! Submitting interview...", "info");
        finishMockInterview();
      }
    }, 1000);
  } else {
    document.getElementById('mock-timer-display').textContent = "Untimed";
  }
  closeMockSetup();
  document.getElementById('mock-status-bar').classList.remove('hidden');
  loadMockQuestion(0);
  showToast(`Mock Interview Started (${state.mockQuestions.length} Questions)`, "success");
}
export function updateMockTimerDisplay() {
  const mins = Math.floor(state.mockTimeRemaining / 60);
  const secs = state.mockTimeRemaining % 60;
  document.getElementById('mock-timer-display').textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
export async function loadMockQuestion(idx) {
  if (idx < 0 || idx >= state.mockQuestions.length) return;
  state.mockCurrentIdx = idx;
  const q = state.mockQuestions[idx];
  await loadQuestion(q);

  // Adjust UI for mock
  document.getElementById('counter').textContent = `Mock: ${idx + 1} / ${state.mockQuestions.length}`;
  document.getElementById('mock-eval-bar').classList.add('hidden');
  document.getElementById('mock-eval-bar').classList.remove('flex');
  document.getElementById('btn-answer').classList.remove('hidden');
}
export function revealMockAnswer() {
  renderAnswerContent();
  document.getElementById('btn-answer').classList.add('hidden');
  document.getElementById('mock-eval-bar').classList.remove('hidden');
  document.getElementById('mock-eval-bar').classList.add('flex');
}
export function evaluateMockQuestion(points) {
  const currentQ = state.mockQuestions[state.mockCurrentIdx];
  state.mockScores.push({
    id: currentQ.id,
    topic: currentQ.topic,
    points: points
  });
  if (points === 10 && !state.masteredIds.includes(currentQ.id)) {
    state.masteredIds.push(currentQ.id);
    savePersistence();
  }
  if (state.mockCurrentIdx + 1 < state.mockQuestions.length) {
    loadMockQuestion(state.mockCurrentIdx + 1);
  } else {
    finishMockInterview();
  }
}
export function finishMockInterview() {
  if (state.mockTimerInterval) clearInterval(state.mockTimerInterval);
  state.isMockMode = false;
  document.getElementById('mock-status-bar').classList.add('hidden');
  document.getElementById('mock-eval-bar').classList.add('hidden');
  document.getElementById('btn-answer').classList.remove('hidden');

  // Calculate results
  const totalQuestions = state.mockQuestions.length;
  const maxPossibleXP = totalQuestions * 10;
  const totalEarnedXP = state.mockScores.reduce((acc, curr) => acc + curr.points, 0);
  const scorePercent = maxPossibleXP > 0 ? Math.round(totalEarnedXP / maxPossibleXP * 100) : 0;
  document.getElementById('mock-result-score').textContent = `${scorePercent}%`;
  document.getElementById('mock-result-xp').textContent = `+${totalEarnedXP} XP`;
  let verdict = "PASSED";
  let verdictColor = "text-emerald-500";
  let badgeIcon = '<i class="fa-solid fa-trophy"></i>';
  let badgeBg = "bg-emerald-500/10 text-emerald-500";
  if (scorePercent < 50) {
    verdict = "NEEDS WORK";
    verdictColor = "text-red-500";
    badgeIcon = '<i class="fa-solid fa-book-open"></i>';
    badgeBg = "bg-red-500/10 text-red-500";
  } else if (scorePercent < 75) {
    verdict = "PARTIAL PASS";
    verdictColor = "text-amber-500";
    badgeIcon = '<i class="fa-solid fa-award"></i>';
    badgeBg = "bg-amber-500/10 text-amber-500";
  }
  document.getElementById('mock-result-verdict').textContent = verdict;
  document.getElementById('mock-result-verdict').className = `text-xs font-bold ${verdictColor} block mt-1`;
  const badgeEl = document.getElementById('mock-result-badge-icon');
  badgeEl.className = `w-16 h-16 rounded-2xl ${badgeBg} flex items-center justify-center text-3xl mx-auto`;
  badgeEl.innerHTML = badgeIcon;

  // Topic Breakdown
  const topicStats = {};
  state.mockScores.forEach(s => {
    const topic = s.topic || "General";
    if (!topicStats[topic]) topicStats[topic] = {
      earned: 0,
      total: 0
    };
    topicStats[topic].earned += s.points;
    topicStats[topic].total += 10;
  });
  const topicsContainer = document.getElementById('mock-result-topics');
  topicsContainer.innerHTML = '';
  Object.keys(topicStats).forEach(topic => {
    const stat = topicStats[topic];
    const pct = Math.round(stat.earned / stat.total * 100);
    const row = document.createElement('div');
    row.className = "flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs";
    row.innerHTML = `
            <span class="font-semibold text-slate-700 dark:text-slate-300">${topic}</span>
            <span class="font-bold ${pct >= 70 ? 'text-emerald-500' : 'text-amber-500'}">${pct}% (${stat.earned}/${stat.total} XP)</span>
        `;
    topicsContainer.appendChild(row);
  });
  document.getElementById('mock-results-modal').showModal();
  triggerFilterAction();
}
export function exitMockInterview() {
  if (confirm("Are you sure you want to exit the active Mock Interview? Progress will be lost.")) {
    if (state.mockTimerInterval) clearInterval(state.mockTimerInterval);
    state.isMockMode = false;
    document.getElementById('mock-status-bar').classList.add('hidden');
    document.getElementById('mock-eval-bar').classList.add('hidden');
    document.getElementById('btn-answer').classList.remove('hidden');
    triggerFilterAction();
    showToast("Mock Interview cancelled", "info");
  }
}

// --- stats.js ---
// Helper function to map topics to icons and gradients
