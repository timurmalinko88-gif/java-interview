import { state } from './state.js';
export // --- stats.js ---
// Helper function to map topics to icons and gradients
function getTopicStyles(topic) {
  const t = topic.toLowerCase();
  if (t.includes('jvm') || t.includes('memory')) return {
    icon: 'fa-server',
    gradient: 'from-blue-500 to-indigo-500',
    shadow: 'shadow-blue-500/20'
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
    gradient: 'from-cyan-400 to-blue-500',
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
    gradient: 'from-indigo-400 to-purple-500',
    shadow: 'shadow-indigo-500/20'
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

    // Define card structure
    const card = document.createElement('div');
    // Glassmorphism styling with subtle border and hover glow
    card.className = "group relative bg-white/50 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden";
    card.innerHTML = `
            <!-- Background Glow Effect on Hover -->
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${styles.gradient} rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            
            <div class="relative z-10 flex items-start space-x-4 mb-4">
                <div class="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${styles.gradient} shadow-lg ${styles.shadow} flex items-center justify-center text-white text-xl">
                    <i class="fa-solid ${styles.icon}"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-slate-800 dark:text-white truncate" title="${topic}">${topic}</h4>
                    <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        <span class="text-slate-700 dark:text-slate-300">${stats.mastered}</span> / ${stats.total} Mastered
                    </p>
                </div>
                <div class="font-black text-lg text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-400 transition-colors">
                    ${percent}%
                </div>
            </div>
            
            <div class="relative z-10 w-full bg-slate-100 dark:bg-slate-900/80 rounded-full h-2.5 overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/5">
                <div class="bg-gradient-to-r ${styles.gradient} h-full rounded-full transition-all duration-1000 ease-out shadow-sm" style="width: 0%"></div>
            </div>
        `;
    container.appendChild(card);

    // Animate the bar width after appending
    setTimeout(() => {
      const bar = card.querySelector('div.bg-gradient-to-r');
      if (bar) bar.style.width = `${percent}%`;
    }, 50);
  });

  // Overall summary header
  const overallPercent = Math.round(totalMastered / state.questionsList.length * 100);
  const summary = document.getElementById('stats-summary-cards');
  if (summary) {
    summary.innerHTML = `
            <div class="relative overflow-hidden bg-gradient-to-br from-brand-600 to-indigo-700 text-white p-6 rounded-2xl shadow-xl shadow-brand-500/20 col-span-full flex flex-col md:flex-row items-center justify-between">
                <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 blur-2xl rounded-full"></div>
                <div class="absolute -left-10 -top-10 w-32 h-32 bg-brand-400/20 blur-xl rounded-full"></div>
                
                <div class="relative z-10 flex items-center space-x-6">
                    <div class="w-20 h-20 shrink-0 relative flex items-center justify-center">
                        <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path class="text-white/20" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <path class="text-white drop-shadow-md" stroke-width="3" stroke-dasharray="${overallPercent}, 100" stroke="currentColor" fill="none" stroke-linecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                        </svg>
                        <div class="absolute inset-0 flex items-center justify-center font-bold text-xl">${overallPercent}%</div>
                    </div>
                    <div>
                        <h3 class="text-brand-100 font-semibold tracking-wide uppercase text-sm mb-1">Overall Progress</h3>
                        <div class="text-3xl font-extrabold">${totalMastered} <span class="text-lg font-medium text-brand-200">/ ${state.questionsList.length}</span></div>
                    </div>
                </div>
                
                <div class="relative z-10 mt-6 md:mt-0 text-right">
                    <p class="text-brand-100 max-w-xs text-sm">You are making great progress! Focus on your weakest topics to level up faster.</p>
                </div>
            </div>
        `;
  }
}

// --- adaptive.js ---
