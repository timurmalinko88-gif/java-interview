import { state } from './state.js';
import { ROADMAPS } from './roadmaps.js';
import { isFlagged } from './collections.js';
import { isDueForReview } from './spacedRepetition.js';
import { setDifficultyChipInactive } from './utils.js';
import { semanticSearch } from './semanticSearch.js';
import { filterAndRankQuestions, processQueryTokens, scoreQuestion } from './searchEngine.js';
import { buildSidebarList, loadQuestion, renderNoQuestionsFoundState } from './ui.js';

let activeSearchQuery = '';
let currentFilterActionId = 0;

/**
 * Filter actions triggered on inputs change.
 * Handles search query ranking, topic/roadmap/difficulty/format/status filtering,
 * and parallel semantic search ranking.
 */
export function triggerFilterAction() {
  const thisActionId = ++currentFilterActionId;
  const searchInput = document.getElementById('search-input');
  const searchValue = searchInput ? searchInput.value.trim() : '';
  activeSearchQuery = searchValue;

  const topicFilter = document.getElementById('topic-filter');
  const topicValue = topicFilter ? topicFilter.value : 'all';
  const roadmapFilter = document.getElementById('roadmap-filter');
  const roadmapValue = roadmapFilter ? roadmapFilter.value : 'none';

  // Checkboxes for format
  const checkedFormats = Array.from(document.querySelectorAll('.format-checkbox:checked')).map(
    (el) => el.value
  );

  let baseQuestions = state.questionsList;

  if (roadmapValue !== 'none' && ROADMAPS[roadmapValue]) {
    const rm = ROADMAPS[roadmapValue];
    if (rm.filter) {
      baseQuestions = baseQuestions.filter(rm.filter);
    } else if (rm.filters) {
      baseQuestions = baseQuestions.filter((q) => {
        const matchDiff = rm.filters.difficulties.includes(q.difficulty);
        const matchTag =
          rm.filters.tags.some((tag) => (q.tags || []).includes(tag)) ||
          rm.filters.tags.some((tag) => (q.topic || '').toLowerCase().includes(tag));
        return matchDiff && matchTag;
      });
    }

    if (rm.isOrdered && rm.stages) {
      baseQuestions = [...baseQuestions];
      const stageTopicOrder = {};
      rm.stages.forEach((stage, sIdx) => {
        if (stage.topics) {
          stage.topics.forEach(t => {
            stageTopicOrder[t] = sIdx;
          });
        }
      });
      baseQuestions.sort((a, b) => {
        const getStageIdx = (item) => {
          const idx = rm.stages.findIndex((s) =>
            s.tag ? (item.tags || []).includes(s.tag) : s.topics && s.topics.includes(item.topic)
          );
          if (idx !== -1) return idx;
          return stageTopicOrder[item.topic] ?? 999;
        };
        const orderA = getStageIdx(a);
        const orderB = getStageIdx(b);
        if (orderA !== orderB) return orderA - orderB;
        const aVerdict = (a.tags || []).includes('verdict-review') ? -1 : 0;
        const bVerdict = (b.tags || []).includes('verdict-review') ? -1 : 0;
        if (aVerdict !== bVerdict) return aVerdict - bVerdict;
        return (a.id || '').localeCompare(b.id || '');
      });
    }

    if (rm.limit && baseQuestions.length > rm.limit) {
      baseQuestions = baseQuestions.slice(0, rm.limit);
    }
  }

  // 1. Filter by Topic, Difficulty, Format, and Status
  const pool = baseQuestions.filter((q) => {
    const topicMatches =
      topicValue === 'all' ||
      q.topic === topicValue ||
      (topicValue === 'Live Coding' && q.topic.startsWith('Live Coding')) ||
      (topicValue === 'Behavioral' && q.topic.startsWith('Behavioral'));
    const diffMatches =
      state.selectedDiffFilters.length === 0 || state.selectedDiffFilters.includes(q.difficulty);
    const formatMatches = checkedFormats.length === 0 || checkedFormats.includes(q.format);
    const statusFilter = state.statusFilter || 'all';
    let statusMatches = true;
    if (statusFilter === 'flagged') {
      statusMatches = isFlagged(q.id);
    } else if (statusFilter === 'mastered') {
      statusMatches = state.masteredIds.includes(q.id);
    } else if (statusFilter === 'due') {
      statusMatches = isDueForReview(q.id);
    }
    return topicMatches && diffMatches && formatMatches && statusMatches;
  });

  // 2. High-Performance Multi-Token & Russian-English Synonym Smart Search
  if (searchValue) {
    state.filteredQuestions = filterAndRankQuestions(pool, searchValue);
  } else {
    state.filteredQuestions = pool;
  }

  // Reset cursor if out of bounds
  if (state.currentIndex >= state.filteredQuestions.length || state.currentIndex < 0) {
    state.currentIndex = 0;
  }

  // Toggle "Clear" filters indicator link
  const hasActiveFilters =
    searchValue !== '' ||
    topicValue !== 'all' ||
    state.selectedDiffFilters.length > 0 ||
    checkedFormats.length > 0 ||
    state.statusFilter !== 'all' ||
    roadmapValue !== 'none';
  const clearFiltersBtn = document.getElementById('clear-filters');
  if (clearFiltersBtn) {
    clearFiltersBtn.style.display = hasActiveFilters ? 'inline' : 'none';
  }

  buildSidebarList();
  if (state.filteredQuestions.length > 0) {
    loadQuestion(state.currentIndex);
  } else {
    renderNoQuestionsFoundState();
  }

  // Parallel Semantic Ranking (if query >= 3 chars and semantic search is ready)
  if (searchValue.length >= 3 && semanticSearch.isReady) {
    const queryToSearch = searchValue;
    semanticSearch
      .search(queryToSearch)
      .then((semanticResults) => {
        if (
          thisActionId !== currentFilterActionId ||
          !semanticResults ||
          semanticResults.length === 0
        )
          return;

        const scoreMap = new Map();
        semanticResults.forEach((r) => {
          if (r.score >= 0.36) {
            scoreMap.set(r.id, r.score);
          }
        });

        if (scoreMap.size === 0) return;

        const queryData = processQueryTokens(queryToSearch);
        const scored = [];

        for (let i = 0; i < pool.length; i++) {
          const q = pool[i];
          const kwScore = scoreQuestion(q, queryData);
          const semScore = scoreMap.get(q.id) || 0;

          // High confidence threshold (>= 0.48) if pure semantic without keyword match
          if (kwScore > 0 || semScore >= 0.48) {
            const totalScore = kwScore + semScore * 80;
            scored.push({ question: q, score: totalScore });
          }
        }

        if (scored.length > 0) {
          scored.sort((a, b) => b.score - a.score);
          state.filteredQuestions = scored.map((item) => item.question);
          state.currentIndex = 0;
          buildSidebarList();
          loadQuestion(0);
        }
      })
      .catch(() => {});
  }
}

// Reset global filter selections
export function clearAllFilters() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
  const topicFilter = document.getElementById('topic-filter');
  if (topicFilter) topicFilter.value = 'all';
  const roadmapFilter = document.getElementById('roadmap-filter');
  if (roadmapFilter) roadmapFilter.value = 'none';

  state.selectedDiffFilters = [];
  state.statusFilter = 'all';
  document.querySelectorAll('.status-chip').forEach((btn) => {
    if (btn.getAttribute('data-status') === 'all') {
      btn.className =
        'status-chip active px-2.5 py-1 rounded-[7px] font-medium bg-roast-500 text-white transition-all shrink-0';
    } else {
      btn.className =
        'status-chip px-2.5 py-1 rounded-[7px] font-medium text-slate-600 dark:text-slate-400 bg-paper-50 dark:bg-panel-900 border border-slate-200 dark:border-slate-800 hover:text-roast-500 hover:border-roast-500/50 transition-all flex items-center gap-1 shrink-0';
    }
  });
  document.querySelectorAll('.diff-chip').forEach((el) => {
    const diff = el.getAttribute('data-diff');
    setDifficultyChipInactive(el, diff);
  });
  document.querySelectorAll('.format-checkbox').forEach((el) => (el.checked = false));
  triggerFilterAction();
}
