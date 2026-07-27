import { state } from './state.js';
export // --- stats.js ---
// Helper function to map topics to icons and gradients
function getTopicStyles(topic) {
  const t = topic.toLowerCase();
  
  // New Categories
  if (t.includes('ai') || t.includes('llm') || t.includes('rag')) return {
    icon: 'fa-brain',
    gradient: 'from-purple-600 to-brand-600',
    shadow: 'shadow-purple-500/20'
  };
  if (t.includes('kafka') || t.includes('messaging')) return {
    icon: 'fa-comments',
    gradient: 'from-amber-500 to-orange-500',
    shadow: 'shadow-orange-500/20'
  };
  if (t.includes('modern java') || t.includes('java 21')) return {
    icon: 'fa-atom',
    gradient: 'from-cyan-500 to-brand-500',
    shadow: 'shadow-cyan-500/20'
  };
  if (t.includes('live coding') || t.includes('refactoring')) return {
    icon: 'fa-laptop-code',
    gradient: 'from-emerald-500 to-teal-500',
    shadow: 'shadow-emerald-500/20'
  };
  if (t.includes('behavioral') || t.includes('hr') || t.includes('star')) return {
    icon: 'fa-user-tie',
    gradient: 'from-rose-500 to-pink-500',
    shadow: 'shadow-rose-500/20'
  };

  // Existing Categories
  if (t.includes('jvm') || t.includes('memory')) return {
    icon: 'fa-server',
    gradient: 'from-brand-500 to-brand-500',
    shadow: ''
  };
  if (t.includes('spring') || t.includes('boot')) return {
    icon: 'fa-leaf',
    gradient: 'from-emerald-400 to-green-500',
    shadow: 'shadow-emerald-500/20'
  };
  if (t.includes('multithreading') || t.includes('concurrency')) return {
    icon: 'fa-network-wired',
    gradient: 'from-amber-400 to-orange-500',
    shadow: 'shadow-orange-500/20'
  };
  if (t.includes('oop') || t.includes('object')) return {
    icon: 'fa-cubes',
    gradient: 'from-purple-500 to-fuchsia-500',
    shadow: 'shadow-purple-500/20'
  };
  if (t.includes('pattern') || t.includes('design')) return {
    icon: 'fa-puzzle-piece',
    gradient: 'from-pink-500 to-rose-500',
    shadow: 'shadow-pink-500/20'
  };
  if (t.includes('stream') || t.includes('api')) return {
    icon: 'fa-water',
    gradient: 'from-cyan-400 to-brand-500',
    shadow: 'shadow-cyan-500/20'
  };
  if (t.includes('collection')) return {
    icon: 'fa-layer-group',
    gradient: 'from-teal-400 to-emerald-500',
    shadow: 'shadow-teal-500/20'
  };
  if (t.includes('testing') || t.includes('junit')) return {
    icon: 'fa-vial',
    gradient: 'from-red-400 to-rose-500',
    shadow: 'shadow-red-500/20'
  };
  if (t.includes('database') || t.includes('sql')) return {
    icon: 'fa-database',
    gradient: 'from-brand-400 to-purple-500',
    shadow: ''
  };
  if (t.includes('system') || t.includes('design')) return {
    icon: 'fa-sitemap',
    gradient: 'from-violet-500 to-fuchsia-600',
    shadow: 'shadow-violet-500/20'
  };

  // Default
  return {
    icon: 'fa-code',
    gradient: 'from-slate-400 to-slate-500',
    shadow: 'shadow-slate-500/20'
  };
}
export function updateStatsDashboard() {
  const container = document.getElementById('stats-topics-container');
  if (!container) return;
  if (state.questionsList.length === 0) {
    container.innerHTML = '<div class="text-slate-400 text-center py-8 col-span-full">Нет данных для статистики.</div>';
    return;
  }

  // Group questions by topic
  const topicStats = {};
  state.questionsList.forEach(q => {
    const topic = q.topic || "Остальное";
    if (!topicStats[topic]) {
      topicStats[topic] = {
        total: 0,
        mastered: 0
      };
    }
    topicStats[topic].total++;
    if (state.masteredIds.includes(q.id)) {
      topicStats[topic].mastered++;
    }
  });

  // Sort topics by total questions descending
  const sortedTopics = Object.keys(topicStats).sort((a, b) => topicStats[b].total - topicStats[a].total);
  container.innerHTML = '';
  let totalMastered = 0;
  sortedTopics.forEach(topic => {
    const stats = topicStats[topic];
    totalMastered += stats.mastered;
    const percent = Math.round(stats.mastered / stats.total * 100);
    const styles = getTopicStyles(topic);

    // Define card structure (Neutral styling without random colorful gradients)
    const card = document.createElement('div');
    card.className = "bg-white dark:bg-panel-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 flex flex-col justify-between";
    card.innerHTML = `
            <div class="flex items-start space-x-4 mb-4">
                <div class="w-10 h-10 shrink-0 rounded-lg bg-slate-100 dark:bg-panel-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-lg">
                    <i class="fa-solid ${styles.icon}"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-slate-800 dark:text-slate-200 truncate" title="${topic}">${topic}</h4>
                    <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                        <span class="text-slate-700 dark:text-slate-300 font-semibold">${stats.mastered}</span> / ${stats.total} Mastered
                    </p>
                </div>
                <div class="font-bold text-sm text-slate-500 dark:text-slate-400">
                    ${percent}%
                </div>
            </div>
            
            <div class="w-full bg-slate-100 dark:bg-panel-700 rounded-full h-2 overflow-hidden">
                <div class="bg-roast-500 h-full rounded-full transition-all duration-700 ease-out" style="width: 0%"></div>
            </div>
        `;
    container.appendChild(card);

    // Animate the bar width after appending
    setTimeout(() => {
      const bar = card.querySelector('div.bg-roast-500');
      if (bar) bar.style.width = `${percent}%`;
    }, 50);
  });

  // Overall summary header (Flat panel, no gradient or glow)
  const overallPercent = Math.round(totalMastered / state.questionsList.length * 100);
  const summary = document.getElementById('stats-summary-cards');
  if (summary) {
    summary.innerHTML = `
            <div class="bg-roast-500/10 border border-roast-500/30 rounded-lg p-5 text-roast-700 dark:text-roast-300 col-span-full flex flex-col md:flex-row items-center justify-between gap-4">
                <div class="flex items-center space-x-5">
                    <div class="w-16 h-16 shrink-0 relative flex items-center justify-center">
                        <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path class="text-slate-300 dark:text-slate-700" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <path class="text-roast-500" stroke-width="3.5" stroke-dasharray="${overallPercent}, 100" stroke="currentColor" fill="none" stroke-linecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                        </svg>
                        <div class="absolute inset-0 flex items-center justify-center font-bold text-sm text-slate-800 dark:text-slate-200">${overallPercent}%</div>
                    </div>
                    <div>
                        <h3 class="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wide mb-1">Overall Progress</h3>
                        <div class="text-2xl font-extrabold text-slate-900 dark:text-white">${totalMastered} <span class="text-sm font-medium text-slate-500">/ ${state.questionsList.length}</span></div>
                    </div>
                </div>
                
                <div class="text-right">
                    <p class="text-slate-600 dark:text-slate-400 max-w-xs text-xs leading-relaxed">You are making great progress! Focus on your weakest topics to level up faster.</p>
                </div>
            </div>
        `;
  }
}

// --- adaptive.js ---
