import { state } from './state.js';
import { ROADMAPS } from './roadmaps.js';

export const RANKS = [
  { name: 'Intern', minXp: 0, icon: 'fa-shield-halved', color: 'text-roast-500' },
  { name: 'Junior', minXp: 500, icon: 'fa-medal', color: 'text-pine-500' },
  { name: 'Middle', minXp: 1500, icon: 'fa-fire', color: 'text-roast-500' },
  { name: 'Senior', minXp: 3000, icon: 'fa-star', color: 'text-plum-500' },
  { name: 'Staff Engineer', minXp: 5000, icon: 'fa-crown', color: 'text-rose-500' }
];

export function showLevelUpAnimation(rankInfo) {
  const overlay = document.createElement('div');
  overlay.className =
    'fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-500 opacity-0';

  overlay.innerHTML = `
    <div class="bg-white/95 dark:bg-panel-900/95 glass-panel rounded-[10px] p-8 sm:p-10 flex flex-col items-center text-center shadow-attio-elevated transform scale-90 transition-transform duration-500 border border-slate-200 dark:border-slate-800">
      <div class="w-24 h-24 mb-6 rounded-full bg-roast-500 flex items-center justify-center text-5xl text-white shadow-lg animate-bounce">
        <i class="fa-solid ${rankInfo.icon}"></i>
      </div>
      <h2 class="text-3xl font-black text-roast-500 mb-2">LEVEL UP!</h2>
      <p class="text-slate-600 dark:text-slate-400 text-lg font-medium">You are now a <span class="font-bold ${rankInfo.color}">${rankInfo.name}</span></p>
      <p class="text-sm text-slate-500 mt-4 max-w-xs font-normal">Keep up the great work! Consistent studying leads to interview success.</p>
      <button class="mt-8 bg-roast-500 hover:bg-roast-600 text-white px-8 py-3 rounded-[10px] font-medium shadow-sm transition-colors">Continue</button>
    </div>
  `;

  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.classList.remove('opacity-0');
    overlay.querySelector('div').classList.remove('scale-90');
  });

  const closeBtn = overlay.querySelector('button');
  closeBtn.addEventListener('click', () => {
    overlay.classList.add('opacity-0');
    overlay.querySelector('div').classList.add('scale-90');
    setTimeout(() => overlay.remove(), 500);
  });

  setTimeout(() => {
    if (document.body.contains(overlay)) {
      closeBtn.click();
    }
  }, 5000);
}

// Sync UI global stats metrics (XP, Rank, Global Progress Bar)
export function updateStatsUI() {
  const total = state.questionsList.length;
  if (total === 0) return;
  const masteredCount = state.masteredIds.length;

  const xp = masteredCount * 10;

  let currentRank = RANKS[0];
  let nextRank = RANKS[1];

  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].minXp) {
      currentRank = RANKS[i];
      nextRank = RANKS[i + 1] || RANKS[i];
    }
  }

  // Handle level up animation
  if (state.previousRank && state.previousRank !== currentRank.name && xp > 0) {
    showLevelUpAnimation(currentRank);
  }
  state.previousRank = currentRank.name;

  const statsXpEl = document.getElementById('stats-xp');
  if (statsXpEl) statsXpEl.textContent = xp + ' XP';

  const statsRankEl = document.getElementById('stats-rank');
  if (statsRankEl) statsRankEl.textContent = currentRank.name;

  const rankIconEl = document.getElementById('rank-icon');
  if (rankIconEl) {
    rankIconEl.className = `fa-solid ${currentRank.icon} ${currentRank.color} relative z-10`;
  }

  const rankXpTextEl = document.getElementById('rank-xp-text');
  const rankProgressBarEl = document.getElementById('rank-progress-bar');

  if (currentRank.name === nextRank.name) {
    if (rankXpTextEl) rankXpTextEl.textContent = `${xp} XP (Max)`;
    if (rankProgressBarEl) rankProgressBarEl.style.width = '100%';
  } else {
    const xpIntoLevel = xp - currentRank.minXp;
    const xpNeeded = nextRank.minXp - currentRank.minXp;
    const progressPercent = Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100));

    if (rankXpTextEl) rankXpTextEl.textContent = `${xpIntoLevel} / ${xpNeeded} XP`;
    if (rankProgressBarEl) rankProgressBarEl.style.width = `${progressPercent}%`;
  }

  // Calculate percentage progress (scoped to active roadmap if selected)
  const roadmapFilter = document.getElementById('roadmap-filter');
  const roadmapValue = roadmapFilter ? roadmapFilter.value : 'none';
  const rm = roadmapValue !== 'none' ? ROADMAPS[roadmapValue] : null;

  let displayTotal = total;
  let displayMastered = masteredCount;

  if (rm) {
    const trackQuestions = state.filteredQuestions;
    displayTotal = trackQuestions.length;
    displayMastered = trackQuestions.filter((q) => state.masteredIds.includes(q.id)).length;
  }

  const percent = displayTotal > 0 ? Math.min(100, Math.round((displayMastered / displayTotal) * 100)) : 0;
  const statsProgEl = document.getElementById('stats-progress');
  if (statsProgEl) {
    if (rm && rm.targetPassRate) {
      statsProgEl.textContent = `${percent}% (${displayMastered}/${displayTotal}) [Цель: ${rm.targetPassRate}%]`;
    } else {
      statsProgEl.textContent = `${percent}% (${displayMastered}/${displayTotal})`;
    }
  }
  const globalProgEl = document.getElementById('global-progress');
  if (globalProgEl) globalProgEl.style.width = `${percent}%`;
}

// Update micro-progress bar in the sidebar for current topic or roadmap
export function updateMicroProgressUI() {
  const totalFiltered = state.filteredQuestions.length;
  let masteredFiltered = 0;
  state.filteredQuestions.forEach((q) => {
    if (state.masteredIds.includes(q.id)) {
      masteredFiltered++;
    }
  });

  const microPercent = totalFiltered > 0 ? Math.round((masteredFiltered / totalFiltered) * 100) : 0;
  const topicMicroProgEl = document.getElementById('topic-micro-progress');
  const topicFilter = document.getElementById('topic-filter');
  const selectedTopicName = topicFilter ? topicFilter.options[topicFilter.selectedIndex].text : 'All Topics';
  const roadmapFilter = document.getElementById('roadmap-filter');
  const roadmapValue = roadmapFilter ? roadmapFilter.value : 'none';
  const rm = roadmapValue !== 'none' ? ROADMAPS[roadmapValue] : null;

  if (!topicMicroProgEl) return;

  topicMicroProgEl.classList.remove('hidden');
  topicMicroProgEl.classList.add('flex');

  const titleEl = document.getElementById('topic-micro-title');
  const percentEl = document.getElementById('topic-micro-percent');
  const barEl = document.getElementById('topic-micro-bar');

  if (rm) {
    const passRate = rm.targetPassRate || 80;
    const isPassed = microPercent >= passRate;
    if (titleEl) {
      titleEl.innerHTML = `<span class="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200"><i class="fa-solid fa-bullseye text-roast-500"></i> ${rm.name}</span>`;
    }
    if (percentEl) {
      percentEl.innerHTML = `<span class="${isPassed ? 'text-pine-500 font-bold' : 'text-slate-600 dark:text-slate-400'}">${masteredFiltered} / ${totalFiltered} (${microPercent}%) • Допуск: ${passRate}%</span>`;
    }
    if (barEl) {
      barEl.style.width = `${microPercent}%`;
      barEl.className = isPassed
        ? 'bg-pine-500 h-full transition-all duration-500'
        : 'bg-roast-500 h-full transition-all duration-500';
    }
  } else {
    if (titleEl) titleEl.textContent = `${selectedTopicName} Mastery`;
    if (percentEl) percentEl.textContent = `${microPercent}% (${masteredFiltered}/${totalFiltered})`;
    if (barEl) {
      barEl.style.width = `${microPercent}%`;
      barEl.className = 'bg-roast-500 h-full transition-all duration-500';
    }
  }
}
