import { playSound } from './utils.js';
import { state } from './state.js';
import { isFlagged } from './collections.js';
import { ROADMAPS } from './roadmaps.js';
import { semanticSearch } from './semanticSearch.js';
import { parseMarkdown } from './markdownParser.js';
import { updateStatsUI, updateMicroProgressUI, showLevelUpAnimation, RANKS } from './progress.js';
import { triggerFilterAction, clearAllFilters } from './filterEngine.js';

// Re-export decomposed modules for 100% backward compatibility
export {
  parseMarkdown,
  updateStatsUI,
  updateMicroProgressUI,
  showLevelUpAnimation,
  RANKS,
  triggerFilterAction,
  clearAllFilters
};

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

  updateMicroProgressUI();

  const roadmapFilter = document.getElementById('roadmap-filter');
  const roadmapValue = roadmapFilter ? roadmapFilter.value : 'none';
  const rm = roadmapValue !== 'none' ? ROADMAPS[roadmapValue] : null;

  if (state.filteredQuestions.length === 0) {
    renderNoQuestionsFoundState();
    return;
  }
  
  const fragment = document.createDocumentFragment();

  // Stage mapping for ordered roadmaps
  let currentStageId = null;
  const stageByTopic = {};
  if (rm && rm.isOrdered && rm.stages) {
    rm.stages.forEach(s => {
      if (s.topics) {
        s.topics.forEach(t => {
          stageByTopic[t] = s;
        });
      }
    });
  }

  state.filteredQuestions.forEach((q, idx) => {
    // Insert stage header if stage transitions in an ordered roadmap
    if (rm && rm.isOrdered && rm.stages) {
      const qStage = rm.stages.find(s => s.tag ? (q.tags || []).includes(s.tag) : (s.topics && s.topics.includes(q.topic))) || stageByTopic[q.topic];
      if (qStage && qStage.id !== currentStageId) {
        currentStageId = qStage.id;
        const divider = document.createElement('div');
        divider.className = 'px-3.5 py-2.5 bg-slate-100 dark:bg-panel-800 text-[11px] font-bold text-slate-800 dark:text-slate-200 border-y border-slate-200 dark:border-slate-700 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm shadow-xs';
        divider.innerHTML = `
          <span class="flex items-center gap-1.5"><i class="fa-solid fa-layer-group text-roast-500 text-xs"></i> ${qStage.title}</span>
        `;
        fragment.appendChild(divider);
      }
    }

    const isMastered = state.masteredIds.includes(q.id);
    const flagged = isFlagged(q.id);
    const isActive = idx === state.currentIndex;
    const isVerdict = (q.tags || []).includes('verdict-review');

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
                <div class="flex items-center space-x-1.5 flex-wrap gap-y-1">
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded-[7px] uppercase tracking-wider ${diffStyle}">
                        ${q.difficulty}
                    </span>
                    <span class="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-paper-50 dark:bg-panel-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-[7px]">
                        ${q.topic}
                    </span>
                    ${isVerdict ? '<span class="text-[9px] font-bold px-1.5 py-0.5 rounded-[5px] bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">Verdict Review</span>' : ''}
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

// Handle dynamically loading file content or pulling from fallbacks
export async function loadQuestion(indexOrQuestion) {
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
    const relItems = Array.isArray(q.related) ? q.related : [q.related];
    const relContainer = document.createElement('div');
    relContainer.className = 'flex flex-wrap items-center gap-1.5';
    relItems.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'related-question-chip bg-paper-50 dark:bg-panel-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs px-2.5 py-1 rounded-[7px] flex items-center gap-1.5 font-medium hover:border-roast-500 hover:text-roast-500 transition-all cursor-pointer';
      btn.innerHTML = `<i class="fa-solid fa-link text-slate-400"></i> ${item}`;
      btn.title = `Go to question: ${item}`;
      btn.addEventListener('click', () => {
        const query = item.toLowerCase().trim();
        let targetIdx = state.filteredQuestions.findIndex(x => x.id.toLowerCase() === query || (x.title && x.title.toLowerCase().includes(query)));
        if (targetIdx === -1) {
          clearAllFilters();
          targetIdx = state.filteredQuestions.findIndex(x => x.id.toLowerCase() === query || (x.title && x.title.toLowerCase().includes(query)));
        }
        if (targetIdx !== -1) {
          state.currentIndex = targetIdx;
          state.isAnswerVisible = false;
          loadQuestion(targetIdx);
          buildSidebarList();
          showToast(`Navigated to ${item}`, 'info');
        } else {
          clearAllFilters();
          const searchInput = document.getElementById('search-input');
          if (searchInput) {
            searchInput.value = item;
            triggerFilterAction();
            showToast(`Searched for "${item}"`, 'info');
          }
        }
      });
      relContainer.appendChild(btn);
    });
    extraMetaContainer.appendChild(relContainer);
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
        const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL)
          ? import.meta.env.BASE_URL
          : './';
        const normalizedBase = base.endsWith('/') ? base : `${base}/`;
        const cleanPath = q.path.startsWith('/') ? q.path.slice(1) : q.path;
        let response;
        try {
          response = await fetch(`${normalizedBase}${cleanPath}`);
        } catch (e) {
          response = await fetch(q.path);
        }
        if (!response || !response.ok) {
          response = await fetch(q.path);
        }
        if (!response.ok) throw new Error("File fetch failed");
        const markdownText = await response.text();
        parsedContent = parseMarkdown(markdownText);
      } catch (err) {
        console.warn(`Dynamic fetch failed for ${q.path}, loading fallback item.`, err);
      }
    }

    if (!parsedContent && (q.question || q.loadedQuestion)) {
      parsedContent = {
        question: q.loadedQuestion || q.question || '',
        answer: q.loadedAnswer || q.answer || '',
        code: q.code || '',
        analogy: q.analogy || '',
        keyPoints: q.keyPoints || ''
      };
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
export function syncActionButtons(activeId) {
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
export function showToast(message, type = 'success') {
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

