function updateStatsDashboard() {
    const container = document.getElementById('stats-dashboard-content');
    if (!container) return;
    
    if (questionsList.length === 0) {
        container.innerHTML = '<div class="text-slate-400 text-center py-8">Нет данных для статистики.</div>';
        return;
    }

    // Group questions by topic
    const topicStats = {};
    
    questionsList.forEach(q => {
        const topic = q.topic || "Остальное";
        if (!topicStats[topic]) {
            topicStats[topic] = { total: 0, mastered: 0 };
        }
        topicStats[topic].total++;
        if (masteredIds.includes(q.id)) {
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
        const percent = Math.round((stats.mastered / stats.total) * 100);
        
        let barColor = 'bg-brand-500';
        if (percent >= 80) barColor = 'bg-emerald-500';
        else if (percent <= 20) barColor = 'bg-amber-500';

        const row = document.createElement('div');
        row.className = "mb-4";
        row.innerHTML = `
            <div class="flex justify-between items-end mb-1 text-sm">
                <span class="font-bold text-slate-700 dark:text-slate-200">${topic}</span>
                <span class="font-semibold text-slate-500 dark:text-slate-400">${stats.mastered} / ${stats.total} (${percent}%)</span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div class="${barColor} h-2.5 rounded-full transition-all duration-1000" style="width: 0%"></div>
            </div>
        `;
        
        container.appendChild(row);

        // Animate the bar width after appending
        setTimeout(() => {
            const bar = row.querySelector('div > div');
            bar.style.width = `${percent}%`;
        }, 50);
    });

    // Overall summary header
    const overallPercent = Math.round((totalMastered / questionsList.length) * 100);
    const summary = document.getElementById('stats-dashboard-summary');
    if (summary) {
        summary.innerHTML = `
            <div class="text-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl mb-6">
                <h3 class="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-1">Global Progress</h3>
                <div class="text-3xl font-bold text-brand-500">${overallPercent}%</div>
                <div class="text-xs text-slate-400 mt-1">${totalMastered} / ${questionsList.length} questions mastered</div>
            </div>
        `;
    }
}
