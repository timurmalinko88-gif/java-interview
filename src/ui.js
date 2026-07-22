import { setDifficultyChipInactive } from './utils.js';
import { state } from './state.js';
import { isFlagged } from './collections.js';

export // --- ui.js ---
// Build the left sidebar navigation items
function buildSidebarList() {
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

    // Color configuration for difficulties
    let diffStyle = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
    if (q.difficulty === 'Middle') diffStyle = 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
    if (q.difficulty === 'Senior') diffStyle = 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
    const button = document.createElement('button');
    button.className = `w-full text-left p-4 transition-all duration-200 border-l-4 flex flex-col space-y-2 ${isActive ? 'bg-slate-100 dark:bg-slate-800/80 border-brand-500' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/30'}`;

    // Extract short question label
    const shortQuestionText = q.title || q.question || q.id;
    button.innerHTML = `
            <div class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-1.5">
                    <span class="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${diffStyle}">
                        ${q.difficulty}
                    </span>
                    <span class="text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        ${q.topic}
                    </span>
                </div>
                <div class="flex items-center space-x-1">
                    ${isMastered ? '<i class="fa-solid fa-circle-check text-emerald-500 text-xs"></i>' : ''}
                    ${flagged ? '<i class="fa-solid fa-bookmark text-amber-500 text-xs"></i>' : ''}
                    ${state.srData[q.id] && new Date(state.srData[q.id].nextReviewDate) <= new Date() ? '<span class="px-1 py-0.5 bg-rose-500/10 text-rose-500 rounded text-[9px] font-bold uppercase tracking-wider animate-pulse">Due</span>' : ''}
                </div>
            </div>
            <h4 class="text-xs font-bold leading-snug line-clamp-2 ${isActive ? 'text-brand-500' : 'text-slate-700 dark:text-slate-300'}">
                ${shortQuestionText}
            </h4>
        `;
    button.addEventListener("click", async () => {
      state.currentIndex = idx;
      state.isAnswerVisible = false;
      await loadQuestion(idx);
      buildSidebarList();
    });
    fragment.appendChild(button);
  });
  container.appendChild(fragment);
}

// Filter actions triggered on inputs change
export // Filter actions triggered on inputs change
function triggerFilterAction() {
  const searchValue = document.getElementById('search-input').value.toLowerCase().trim();
  const topicValue = document.getElementById('topic-filter').value;

  // Checkboxes for format
  const checkedFormats = Array.from(document.querySelectorAll('.format-checkbox:checked')).map(el => el.value);
  state.filteredQuestions = state.questionsList.filter(q => {
    // Search Matches
    const searchMatches = q.question && q.question.toLowerCase().includes(searchValue) || q.id && q.id.toLowerCase().includes(searchValue) || q.loadedQuestion && q.loadedQuestion.toLowerCase().includes(searchValue) || q.loadedAnswer && q.loadedAnswer.toLowerCase().includes(searchValue);

    // Topic Matches
    const topicMatches = topicValue === 'all' || q.topic === topicValue;

    // Difficulty Matches
    const diffMatches = state.selectedDiffFilters.length === 0 || state.selectedDiffFilters.includes(q.difficulty);

    // Format Matches
    const formatMatches = checkedFormats.length === 0 || checkedFormats.includes(q.format);
    return searchMatches && topicMatches && diffMatches && formatMatches;
  });

  // Reset cursor if out of bounds
  if (state.currentIndex >= state.filteredQuestions.length) {
    state.currentIndex = 0;
  }

  // Toggle "Clear" filters indicator link
  const hasActiveFilters = searchValue !== '' || topicValue !== 'all' || state.selectedDiffFilters.length > 0 || checkedFormats.length > 0;
  document.getElementById('clear-filters').style.display = hasActiveFilters ? 'inline' : 'none';
  buildSidebarList();
  if (state.filteredQuestions.length > 0) {
    loadQuestion(state.currentIndex);
  }
}

// Reset global filter selections
export // Reset global filter selections
function clearAllFilters() {
  document.getElementById('search-input').value = '';
  document.getElementById('topic-filter').value = 'all';
  state.selectedDiffFilters = [];
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
    { name: "Intern", minXp: 0, icon: "fa-shield-halved", color: "text-brand-500" },
    { name: "Junior", minXp: 500, icon: "fa-medal", color: "text-emerald-500" },
    { name: "Middle", minXp: 1500, icon: "fa-fire", color: "text-amber-500" },
    { name: "Senior", minXp: 3000, icon: "fa-star", color: "text-purple-500" },
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
  const analogyMatch = rawAnswer.match(/###\s*Life Analogy\s*\n([\s\S]*?)(?=###|$)/i);
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

  // Update Header Meta Immediately for maximum responsiveness
  const diffEl = document.getElementById('active-difficulty');
  diffEl.textContent = q.difficulty;
  diffEl.className = 'px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ';
  if (q.difficulty === 'Junior') {
    diffEl.classList.add('bg-emerald-500/10', 'text-emerald-600', 'dark:text-emerald-400');
  } else if (q.difficulty === 'Middle') {
    diffEl.classList.add('bg-blue-500/10', 'text-blue-600', 'dark:text-blue-400');
  } else {
    diffEl.classList.add('bg-purple-500/10', 'text-purple-600', 'dark:text-purple-400');
  }
  document.getElementById('active-topic').textContent = q.topic;
  document.getElementById('active-id').textContent = '#' + q.id;
  document.getElementById('active-format').textContent = q.format;
  document.getElementById('counter').textContent = `${index + 1} / ${state.filteredQuestions.length}`;

  // Render Extra Metadata
  const extraMetaContainer = document.getElementById('extra-metadata');
  extraMetaContainer.innerHTML = '';
  if (q.time) {
    extraMetaContainer.innerHTML += `<span class="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded"><i class="fa-regular fa-clock text-amber-500"></i> ${q.time}</span>`;
  }
  if (q.frequency) {
    extraMetaContainer.innerHTML += `<span class="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded"><i class="fa-solid fa-fire-flame-curved text-brand-500"></i> Frequency: ${q.frequency}</span>`;
  }
  if (q.related && q.related.length > 0) {
    extraMetaContainer.innerHTML += `<span class="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded"><i class="fa-solid fa-link text-blue-500"></i> ${Array.isArray(q.related) ? q.related.join(', ') : q.related}</span>`;
  }

  // Reset action bookmark/completed status indicators
  syncActionButtons(q.id);

  // Hide the answer sections
  const answerSection = document.getElementById('answer-section');
  answerSection.classList.add('hidden');
  const ansBtnText = document.getElementById('btn-answer-text');
  const ansBtnIcon = document.getElementById('btn-answer-icon');
  ansBtnText.textContent = "Show Answer";
  ansBtnIcon.className = "fa-solid fa-eye";
  document.getElementById('btn-answer').classList.remove('hidden');
  
  const srEvalBar = document.getElementById('sr-eval-bar');
  if (srEvalBar) srEvalBar.classList.add('hidden');
  state.isAnswerVisible = false;

  // Display loading indicators
  const questionTextEl = document.getElementById('question-text');
  questionTextEl.innerHTML = `
        <div class="flex items-center space-x-2 text-slate-400 py-4 animate-pulse">
            <i class="fa-solid fa-spinner fa-spin text-brand-500"></i>
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
    flagBtn.classList.add('bg-amber-500/10', 'text-amber-500', 'border-amber-500/30');
    flagBtn.classList.remove('text-slate-400');
  } else {
    flagBtn.classList.remove('bg-amber-500/10', 'text-amber-500', 'border-amber-500/30');
    flagBtn.classList.add('text-slate-400');
  }
  const isMastered = state.masteredIds.includes(activeId);
  const masteredBtn = document.getElementById('mastered-btn');
  if (isMastered) {
    masteredBtn.classList.add('bg-emerald-500/10', 'text-emerald-500', 'border-emerald-500/30');
    masteredBtn.classList.remove('text-slate-400');
  } else {
    masteredBtn.classList.remove('bg-emerald-500/10', 'text-emerald-500', 'border-emerald-500/30');
    masteredBtn.classList.add('text-slate-400');
  }
}

// Render empty layout inside questions wrapper
export // Render empty layout inside questions wrapper
function renderNoQuestionsFoundState() {
  const card = document.getElementById('main-content-card');
  card.innerHTML = `
        <div class="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4 text-2xl">
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Nothing Found</h3>
            <p class="text-sm text-slate-400 max-w-sm">Reset filters to see the full list of preparation questions.</p>
            <button id="btn-empty-reset"  class="mt-4 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all">
                Reset фильтры
            </button>
        </div>
    `;
  setTimeout(() => {
    const resetBtn = document.getElementById('btn-empty-reset');
    if (resetBtn) resetBtn.addEventListener('click', clearAllFilters);
  }, 0);
}

// Trigger non-intrusive beautiful toast notification message
export // Trigger non-intrusive beautiful toast notification message
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const icon = document.getElementById('toast-icon');
  const msgSpan = document.getElementById('toast-message');
  msgSpan.textContent = message;
  if (type === 'success') {
    icon.className = "fa-solid fa-circle-check text-emerald-500";
  } else if (type === 'bookmark') {
    icon.className = "fa-solid fa-bookmark text-amber-500";
  } else {
    icon.className = "fa-solid fa-info-circle text-blue-500";
  }
  toast.classList.remove('opacity-0', 'translate-y-2');
  toast.classList.add('opacity-100', 'translate-y-0');
  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-2');
  }, 2500);
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
  const answerSection = document.getElementById('answer-section');
  const ansBtnText = document.getElementById('btn-answer-text');
  const ansBtnIcon = document.getElementById('btn-answer-icon');
  answerSection.classList.remove('hidden');
  document.getElementById('answer-content').innerHTML = marked.parse(q.loadedAnswer || "No answer content.");
  
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
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl transform scale-90 transition-transform duration-500 border border-slate-200 dark:border-slate-800">
            <div class="w-24 h-24 mb-6 rounded-full bg-gradient-to-tr from-brand-400 to-amber-400 flex items-center justify-center text-5xl text-white shadow-lg shadow-brand-500/40 animate-bounce">
                <i class="fa-solid ${rankInfo.icon}"></i>
            </div>
            <h2 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-amber-500 mb-2">LEVEL UP!</h2>
            <p class="text-slate-600 dark:text-slate-400 text-lg">You are now a <span class="font-bold ${rankInfo.color}">${rankInfo.name}</span></p>
            <p class="text-sm text-slate-500 mt-4 max-w-xs">Keep up the great work! Consistent studying leads to interview success.</p>
            <button class="mt-8 bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-brand-500/20 transition-colors">Continue</button>
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
