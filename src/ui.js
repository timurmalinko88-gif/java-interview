import { setDifficultyChipInactive, playSound } from './utils.js';
import { state } from './state.js';
import { isFlagged } from './collections.js';
import { isDueForReview } from './spacedRepetition.js';
import { ROADMAPS } from './roadmaps.js';
import { semanticSearch } from './semanticSearch.js';
import { filterAndRankQuestions, processQueryTokens, scoreQuestion } from './searchEngine.js';

let activeSearchQuery = '';

// Update status badge when semantic search is initialized
semanticSearch.onStatusChange((status, message) => {
  const badge = document.getElementById('semantic-search-badge');
  const statusEl = document.getElementById('semantic-search-status');
  if (badge && statusEl) {
    if (status === 'ready') {
      badge.classList.remove('opacity-0');
      badge.classList.add('opacity-100');
      statusEl.textContent = 'Active ✨';
    } else if (status === 'loading') {
      statusEl.textContent = 'Loading...';
    } else if (status === 'error') {
      statusEl.textContent = 'Keyword only';
    }
  }
});

// Build the left sidebar navigation items
export function buildSidebarList() {
  const container = document.getElementById('questions-container');
  const countLabel = document.getElementById('question-list-count');
  container.innerHTML = '';
  countLabel.textContent = state.filteredQuestions.length;
  if (state.filteredQuestions.length === 0) {
    renderNoQuestionsFoundState();
    return;
  }
  
  // Calculate micro progress
  const totalFiltered = state.filteredQuestions.length;
  let masteredFiltered = 0;
  state.filteredQuestions.forEach(q => {
      if (state.masteredIds.includes(q.id)) {
          masteredFiltered++;
      }
  });
  
  const microPercent = totalFiltered > 0 ? Math.round((masteredFiltered / totalFiltered) * 100) : 0;
  const topicMicroProgEl = document.getElementById('topic-micro-progress');
  const topicFilter = document.getElementById('topic-filter');
  const selectedTopicName = topicFilter ? topicFilter.options[topicFilter.selectedIndex].text : "All Topics";
  
  if (topicMicroProgEl) {
      topicMicroProgEl.classList.remove('hidden');
      topicMicroProgEl.classList.add('flex');
      
      const titleEl = document.getElementById('topic-micro-title');
      if (titleEl) titleEl.textContent = `${selectedTopicName} Mastery`;
      
      const percentEl = document.getElementById('topic-micro-percent');
      if (percentEl) percentEl.textContent = `${microPercent}%`;
      
      const barEl = document.getElementById('topic-micro-bar');
      if (barEl) barEl.style.width = `${microPercent}%`;
  }
  
  const fragment = document.createDocumentFragment();
  state.filteredQuestions.forEach((q, idx) => {
    const isMastered = state.masteredIds.includes(q.id);
    const flagged = isFlagged(q.id);
    const isActive = idx === state.currentIndex;

    // Attio difficulty badge styling
    let diffStyle = 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40';
    if (q.difficulty === 'Middle') diffStyle = 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40';
    if (q.difficulty === 'Senior') diffStyle = 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/40';
    const button = document.createElement('button');
    button.className = `w-full text-left p-3.5 transition-all duration-200 border-l-[3px] flex flex-col space-y-1.5 rounded-r-[7px] ${isActive ? 'bg-white dark:bg-panel-900 border-l-roast-500 shadow-attio-subtle font-medium' : 'border-transparent hover:bg-paper-50/80 dark:hover:bg-panel-700/40'}`;

    // Extract short question label
    const shortQuestionText = q.title || q.question || q.id;
    button.innerHTML = `
            <div class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-1.5">
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded-[7px] uppercase tracking-wider ${diffStyle}">
                        ${q.difficulty}
                    </span>
                    <span class="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-paper-50 dark:bg-panel-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-[7px]">
                        ${q.topic}
                    </span>
                </div>
                <div class="flex items-center space-x-1.5">
                    ${isMastered ? '<i class="fa-solid fa-circle-check text-pine-500 text-xs"></i>' : ''}
                    ${flagged ? '<i class="fa-solid fa-bookmark text-roast-500 text-xs"></i>' : ''}
                    ${state.srData[q.id] && new Date(state.srData[q.id].nextReviewDate) <= new Date() ? '<span class="px-1.5 py-0.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-[7px] text-[9px] font-medium uppercase tracking-wider animate-pulse">Due</span>' : ''}
                </div>
            </div>
            <h4 class="text-xs font-medium leading-snug line-clamp-2 ${isActive ? 'text-roast-500' : 'text-slate-900 dark:text-slate-200'}">
                ${shortQuestionText}
            </h4>
    `;
    button.addEventListener("click", async () => {
      state.currentIndex = idx;
      state.isAnswerVisible = false;
      await loadQuestion(idx);
      buildSidebarList();
      if (window.innerWidth < 1024) {
        const card = document.getElementById('main-content-card');
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    fragment.appendChild(button);
  });
  container.appendChild(fragment);
}

// Filter actions triggered on inputs change
// Filter actions triggered on inputs change
export function triggerFilterAction() {
  const searchInput = document.getElementById('search-input');
  const searchValue = searchInput ? searchInput.value.trim() : '';
  activeSearchQuery = searchValue;

  const topicFilter = document.getElementById('topic-filter');
  const topicValue = topicFilter ? topicFilter.value : 'all';
  const roadmapFilter = document.getElementById('roadmap-filter');
  const roadmapValue = roadmapFilter ? roadmapFilter.value : 'none';

  // Checkboxes for format
  const checkedFormats = Array.from(document.querySelectorAll('.format-checkbox:checked')).map(el => el.value);
  
  let baseQuestions = state.questionsList;

  if (roadmapValue !== 'none' && ROADMAPS[roadmapValue]) {
    const rm = ROADMAPS[roadmapValue];
    baseQuestions = baseQuestions.filter(q => {
      const matchDiff = rm.filters.difficulties.includes(q.difficulty);
      const matchTag = rm.filters.tags.some(tag => (q.tags || []).includes(tag)) || rm.filters.tags.some(tag => (q.topic || '').toLowerCase().includes(tag));
      return matchDiff && matchTag;
    });
    if (rm.limit && baseQuestions.length > rm.limit) {
      baseQuestions = baseQuestions.slice(0, rm.limit);
    }
  }

  // 1. Filter by Topic, Difficulty, Format, and Status
  const pool = baseQuestions.filter(q => {
    const topicMatches = topicValue === 'all' || q.topic === topicValue;
    const diffMatches = state.selectedDiffFilters.length === 0 || state.selectedDiffFilters.includes(q.difficulty);
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
  if (state.currentIndex >= state.filteredQuestions.length) {
    state.currentIndex = 0;
  }

  // Toggle "Clear" filters indicator link
  const hasActiveFilters = searchValue !== '' || topicValue !== 'all' || state.selectedDiffFilters.length > 0 || checkedFormats.length > 0 || state.statusFilter !== 'all' || roadmapValue !== 'none';
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
    semanticSearch.search(queryToSearch).then((semanticResults) => {
      if (activeSearchQuery !== queryToSearch || !semanticResults || semanticResults.length === 0) return;

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
          const totalScore = kwScore + (semScore * 80);
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
    }).catch(() => {});
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
  document.querySelectorAll('.status-chip').forEach(btn => {
    if (btn.getAttribute('data-status') === 'all') {
      btn.className = 'status-chip active px-2.5 py-1 rounded-[7px] font-medium bg-roast-500 text-white transition-all shrink-0';
    } else {
      btn.className = 'status-chip px-2.5 py-1 rounded-[7px] font-medium text-slate-600 dark:text-slate-400 bg-paper-50 dark:bg-panel-900 border border-slate-200 dark:border-slate-800 hover:text-roast-500 hover:border-roast-500/50 transition-all flex items-center gap-1 shrink-0';
    }
  });
  document.querySelectorAll('.diff-chip').forEach(el => {
    const diff = el.getAttribute('data-diff');
    setDifficultyChipInactive(el, diff);
  });
  document.querySelectorAll('.format-checkbox').forEach(el => el.checked = false);
  triggerFilterAction();
}

// Sync UI global stats metrics
export // Sync UI global stats metrics
function updateStatsUI() {
  const total = state.questionsList.length;
  if (total === 0) return;
  const masteredCount = state.masteredIds.length;

  // Gamification Logic
  const xp = masteredCount * 10;
  
  const ranks = [
    { name: "Intern", minXp: 0, icon: "fa-shield-halved", color: "text-roast-500" },
    { name: "Junior", minXp: 500, icon: "fa-medal", color: "text-pine-500" },
    { name: "Middle", minXp: 1500, icon: "fa-fire", color: "text-roast-500" },
    { name: "Senior", minXp: 3000, icon: "fa-star", color: "text-plum-500" },
    { name: "Staff Engineer", minXp: 5000, icon: "fa-crown", color: "text-rose-500" }
  ];
  
  let currentRank = ranks[0];
  let nextRank = ranks[1];
  
  for (let i = 0; i < ranks.length; i++) {
    if (xp >= ranks[i].minXp) {
      currentRank = ranks[i];
      nextRank = ranks[i+1] || ranks[i];
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
      // Max rank reached
      if (rankXpTextEl) rankXpTextEl.textContent = `${xp} XP (Max)`;
      if (rankProgressBarEl) rankProgressBarEl.style.width = '100%';
  } else {
      const xpIntoLevel = xp - currentRank.minXp;
      const xpNeeded = nextRank.minXp - currentRank.minXp;
      const progressPercent = Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100));
      
      if (rankXpTextEl) rankXpTextEl.textContent = `${xpIntoLevel} / ${xpNeeded} XP`;
      if (rankProgressBarEl) rankProgressBarEl.style.width = `${progressPercent}%`;
  }

  // Calculate percentage progress for globally tracked completion progress bar
  const percent = Math.min(100, Math.round(masteredCount / total * 100));
  const statsProgEl = document.getElementById('stats-progress');
  if (statsProgEl) statsProgEl.textContent = `${percent}% (${masteredCount}/${total})`;
  const globalProgEl = document.getElementById('global-progress');
  if (globalProgEl) globalProgEl.style.width = `${percent}%`;
}

// Parse the canonical Markdown format
export // Parse the canonical Markdown format
function parseMarkdown(text) {
  const result = {
    question: '',
    answer: '',
    code: '',
    analogy: '',
    keyPoints: ''
  };
  const cleanText = text.replace(/^---[\s\S]*?---\s*/m, '').trim();
  const parts = cleanText.split('---ANSWER---');
  result.question = parts[0] ? parts[0].trim() : '';
  let rawAnswer = parts[1] ? parts[1].trim() : '';
  const codeMatch = rawAnswer.match(/```java\s*\n([\s\S]*?)\n```/i) || result.question.match(/```java\s*\n([\s\S]*?)\n```/i);
  if (codeMatch) result.code = codeMatch[1];

  // Extract Analogy
  const analogyMatch = rawAnswer.match(/###?\s*(?:Life\s+|Real-World\s+|Intuitive\s+)?[^\n]*Analogy[^\n]*\n([\s\S]*?)(?=###?|$)/i);
  if (analogyMatch) {
    result.analogy = analogyMatch[1].trim();
    rawAnswer = rawAnswer.replace(analogyMatch[0], '');
  }

  // Extract Key Points
  const keyPointsMatch = rawAnswer.match(/###\s*Key Points\s*\n([\s\S]*?)(?=###|$)/i);
  if (keyPointsMatch) {
    result.keyPoints = keyPointsMatch[1].trim();
    rawAnswer = rawAnswer.replace(keyPointsMatch[0], '');
  }
  result.answer = rawAnswer.trim();
  return result;
}

// Handle dynamically loading file content or pulling from fallbacks
export // Handle dynamically loading file content or pulling from fallbacks
async function loadQuestion(indexOrQuestion) {
  let q;
  let index = 0;
  if (typeof indexOrQuestion === 'object') {
    q = indexOrQuestion;
  } else {
    index = indexOrQuestion;
    if (state.filteredQuestions.length === 0) {
      renderNoQuestionsFoundState();
      return;
    }
    q = state.filteredQuestions[index];
  }

  const emptyState = document.getElementById('empty-questions-state');
  const renderers = document.getElementById('main-content-renderers');
  if (emptyState) emptyState.classList.add('hidden');
  if (renderers) renderers.classList.remove('hidden');

  // Update Header Meta Immediately for maximum responsiveness
  const diffEl = document.getElementById('active-difficulty');
  diffEl.textContent = q.difficulty;
  diffEl.className = 'px-2.5 py-1 rounded-[7px] text-[11px] font-semibold uppercase tracking-wider border ';
  if (q.difficulty === 'Junior') {
    diffEl.classList.add('bg-emerald-50', 'text-emerald-700', 'border-emerald-200', 'dark:bg-emerald-950/40', 'dark:text-emerald-300', 'dark:border-emerald-800/40');
  } else if (q.difficulty === 'Middle') {
    diffEl.classList.add('bg-blue-50', 'text-blue-700', 'border-blue-200', 'dark:bg-blue-950/40', 'dark:text-blue-300', 'dark:border-blue-800/40');
  } else {
    diffEl.classList.add('bg-purple-50', 'text-purple-700', 'border-purple-200', 'dark:bg-purple-950/40', 'dark:text-purple-300', 'dark:border-purple-800/40');
  }
  document.getElementById('active-topic').textContent = q.topic;
  document.getElementById('active-id').textContent = '#' + q.id;
  document.getElementById('active-format').textContent = q.format;
  document.getElementById('counter').textContent = `${index + 1} / ${state.filteredQuestions.length}`;

  // Render Extra Metadata
  const extraMetaContainer = document.getElementById('extra-metadata');
  extraMetaContainer.innerHTML = '';
  if (q.time) {
    extraMetaContainer.innerHTML += `<span class="bg-paper-50 dark:bg-panel-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs px-2.5 py-1 rounded-[7px] flex items-center gap-1.5 font-medium"><i class="fa-regular fa-clock text-slate-400"></i> ${q.time}</span>`;
  }
  if (q.frequency) {
    extraMetaContainer.innerHTML += `<span class="bg-paper-50 dark:bg-panel-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs px-2.5 py-1 rounded-[7px] flex items-center gap-1.5 font-medium"><i class="fa-solid fa-circle text-roast-500 text-[8px]"></i> Frequency: ${q.frequency}</span>`;
  }
  if (q.related && q.related.length > 0) {
    extraMetaContainer.innerHTML += `<span class="bg-paper-50 dark:bg-panel-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs px-2.5 py-1 rounded-[7px] flex items-center gap-1.5 font-medium"><i class="fa-solid fa-link text-slate-400"></i> ${Array.isArray(q.related) ? q.related.join(', ') : q.related}</span>`;
  }

  // Reset action bookmark/completed status indicators
  syncActionButtons(q.id);

  // Set YouTube Video Link dynamically
  const youtubeBtn = document.getElementById('btn-youtube');
  if (youtubeBtn) {
    const cleanTitle = (q.title || q.id || '').replace(/[#*`]/g, '').trim();
    const query = encodeURIComponent(`Java Interview ${cleanTitle} explanation`);
    youtubeBtn.href = `https://www.youtube.com/results?search_query=${query}`;
  }

  // Hide the answer, Feynman, and AI sections
  const answerSection = document.getElementById('answer-section');
  if (answerSection) answerSection.classList.add('hidden');
  const feynmanSection = document.getElementById('feynman-section');
  if (feynmanSection) feynmanSection.classList.add('hidden');
  const aiInterviewerPanel = document.getElementById('ai-interviewer-panel');
  if (aiInterviewerPanel) aiInterviewerPanel.classList.add('hidden');

  const ansBtnText = document.getElementById('btn-answer-text');
  const ansBtnIcon = document.getElementById('btn-answer-icon');
  if (ansBtnText) ansBtnText.textContent = "Show Answer";
  if (ansBtnIcon) ansBtnIcon.className = "fa-solid fa-eye";
  const btnAnswer = document.getElementById('btn-answer');
  if (btnAnswer) btnAnswer.classList.remove('hidden');
  
  const srEvalBar = document.getElementById('sr-eval-bar');
  if (srEvalBar) srEvalBar.classList.add('hidden');
  state.isAnswerVisible = false;

  // Display loading indicators
  const questionTextEl = document.getElementById('question-text');
  questionTextEl.innerHTML = `
        <div class="flex items-center space-x-2 text-slate-400 py-4 animate-pulse">
            <i class="fa-solid fa-spinner fa-spin text-roast-500"></i>
            <span>Loading question content...</span>
        </div>
    `;
  document.getElementById('code-section').classList.add('hidden');

  // If question has not been loaded before, fetch it dynamically
  if (!q.loadedQuestion) {
    let parsedContent = null;
    if (q.path) {
      try {
        const response = await fetch(q.path);
        if (!response.ok) throw new Error("File fetch failed");
        const markdownText = await response.text();
        parsedContent = parseMarkdown(markdownText);
      } catch (err) {
        console.warn(`Dynamic fetch failed for ${q.path}, loading fallback item.`, err);
      }
    }

    // Match with embedded static database
    if (!parsedContent) {
      const fallbackObj = state.fallbackDatabase.find(f => f.id === q.id) || state.fallbackDatabase.find(f => f.id === "jvm-001");
      parsedContent = {
        question: fallbackObj.question,
        answer: fallbackObj.answer,
        code: fallbackObj.code,
        analogy: fallbackObj.analogy
      };
    }

    // Cache the loaded fields onto the active question object to optimize toggles and navigation
    q.loadedQuestion = parsedContent.question;
    q.loadedAnswer = parsedContent.answer;
    q.loadedCode = parsedContent.code;
    q.loadedAnalogy = parsedContent.analogy;

    // If question title in original list was empty, enrich it dynamically
    if (!q.question) {
      q.question = parsedContent.question.split('\n')[0].replace(/[#*`]/g, '').trim();
      buildSidebarList();
    }
  }

  // Render Markdown Question Content
  questionTextEl.innerHTML = marked.parse(q.loadedQuestion || "No question content.");
  if (typeof hljs !== 'undefined') {
    questionTextEl.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }

  // Display code section if Java source is present
  const codeSec = document.getElementById('code-section');
  if (q.loadedCode && q.loadedCode.trim() !== '') {
    codeSec.classList.remove('hidden');
    const codeContent = document.getElementById('code-content');
    codeContent.textContent = q.loadedCode;
    codeContent.removeAttribute('data-highlighted');
    hljs.highlightElement(codeContent);
  } else {
    codeSec.classList.add('hidden');
  }

  // Sync URL hash for deep linking (without causing scroll jumps)
  if (q && q.id && !state.isMockMode) {
    history.replaceState(null, '', '#q=' + q.id);
  }

  // Manage navigation boundaries
  if (state.isMockMode) {
    document.getElementById('btn-prev').disabled = true; // disable prev in mock
    document.getElementById('btn-next').disabled = true; // disable next in mock (controlled by evaluation)
  } else {
    document.getElementById('btn-prev').disabled = index === 0;
    document.getElementById('btn-next').disabled = index === state.filteredQuestions.length - 1;
  }
}

// Synch flag/mastered active buttons styling state
export // Synch flag/mastered active buttons styling state
function syncActionButtons(activeId) {
  const flagged = isFlagged(activeId);
  const flagBtn = document.getElementById('flag-btn');
  if (flagged) {
    flagBtn.classList.add('bg-roast-500/10', 'text-roast-500', 'border-roast-500/30');
    flagBtn.classList.remove('text-slate-400');
  } else {
    flagBtn.classList.remove('bg-roast-500/10', 'text-roast-500', 'border-roast-500/30');
    flagBtn.classList.add('text-slate-400');
  }
  const isMastered = state.masteredIds.includes(activeId);
  const masteredBtn = document.getElementById('mastered-btn');
  if (isMastered) {
    masteredBtn.classList.add('bg-pine-500/10', 'text-pine-500', 'border-pine-500/30');
    masteredBtn.classList.remove('text-slate-400');
  } else {
    masteredBtn.classList.remove('bg-pine-500/10', 'text-pine-500', 'border-pine-500/30');
    masteredBtn.classList.add('text-slate-400');
  }
}

// Render empty layout inside questions wrapper
export function renderNoQuestionsFoundState() {
  const emptyState = document.getElementById('empty-questions-state');
  const renderers = document.getElementById('main-content-renderers');
  const counter = document.getElementById('counter');
  if (emptyState) emptyState.classList.remove('hidden');
  if (renderers) renderers.classList.add('hidden');
  if (counter) counter.textContent = '0 / 0';

  const resetBtn = document.getElementById('btn-empty-reset');
  if (resetBtn) {
    resetBtn.onclick = clearAllFilters;
  }
}

// Trigger non-intrusive beautiful toast notification message
export // Trigger non-intrusive beautiful toast notification message
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const icon = document.getElementById('toast-icon');
  const msgSpan = document.getElementById('toast-message');
  msgSpan.textContent = message;
  if (type === 'success') {
    icon.className = "fa-solid fa-circle-check text-pine-500";
  } else if (type === 'bookmark') {
    icon.className = "fa-solid fa-bookmark text-roast-500";
  } else {
    icon.className = "fa-solid fa-info-circle text-roast-500";
  }
  toast.classList.remove('opacity-0', 'translate-y-8');
  toast.classList.add('opacity-100', 'translate-y-0');
  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-8');
  }, 3000);
}

// Mock Interview Engine State
export function renderAnswerContent() {
  let q;
  if (state.isMockMode) {
    q = state.mockQuestions[state.mockCurrentIdx];
  } else {
    if (state.filteredQuestions.length === 0) return;
    q = state.filteredQuestions[state.currentIndex];
  }
  state.isAnswerVisible = true;
  playSound('flip');
  const answerSection = document.getElementById('answer-section');
  const ansBtnText = document.getElementById('btn-answer-text');
  const ansBtnIcon = document.getElementById('btn-answer-icon');
  answerSection.classList.remove('hidden');
  const answerContentEl = document.getElementById('answer-content');
  answerContentEl.innerHTML = marked.parse(q.loadedAnswer || "No answer content.");
  if (typeof hljs !== 'undefined') {
    answerContentEl.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }
  
  if (!state.isMockMode) {
    const srEvalBar = document.getElementById('sr-eval-bar');
    if (srEvalBar) srEvalBar.classList.remove('hidden');
    // Hide the actual toggle button since the user should grade themselves now
    document.getElementById('btn-answer').classList.add('hidden');
  }

  // Populate intuitive analogy if defined
  const analogySec = document.getElementById('analogy-subsection');
  if (q.loadedAnalogy && q.loadedAnalogy.trim() !== '') {
    analogySec.classList.remove('hidden');
    document.getElementById('analogy-content').textContent = q.loadedAnalogy;
  } else {
    analogySec.classList.add('hidden');
  }
  if (ansBtnText) ansBtnText.textContent = "Hide Answer";
  if (ansBtnIcon) ansBtnIcon.className = "fa-solid fa-eye-slash";
}
export function hideAnswerSection() {
  state.isAnswerVisible = false;
  const answerSection = document.getElementById('answer-section');
  const ansBtnText = document.getElementById('btn-answer-text');
  const ansBtnIcon = document.getElementById('btn-answer-icon');
  answerSection.classList.add('hidden');
  if (ansBtnText) ansBtnText.textContent = "Show Answer";
  if (ansBtnIcon) ansBtnIcon.className = "fa-solid fa-eye";
  
  const srEvalBar = document.getElementById('sr-eval-bar');
  if (srEvalBar) srEvalBar.classList.add('hidden');
  document.getElementById('btn-answer').classList.remove('hidden');
}

// Gamification: Level Up Animation
function showLevelUpAnimation(rankInfo) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-500 opacity-0';
    
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
    
    // Trigger animations
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
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(overlay)) {
            closeBtn.click();
        }
    }, 5000);
}
