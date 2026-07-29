/**
 * Algorithms & LeetCode Breakdown View Module
 * Handles algorithmic pattern filtering, grid rendering, and interactive step-by-step modal.
 */

import { fetchQuestionContent } from './api.js';
import { isFlagged, toggleFlag } from './collections.js';

let currentPatternFilter = 'all';
let currentDifficultyFilter = 'all';
let currentSearchQuery = '';

/**
 * Initializes the Algorithms & LeetCode Breakdown section
 */
export function initAlgoView(store, renderCardCallback) {
    const algoBtn = document.getElementById('algo-tab-btn');
    const algoView = document.getElementById('algo-view');
    const questionsView = document.getElementById('questions-view');
    
    if (!algoBtn || !algoView) return;

    // Tab Navigation
    algoBtn.addEventListener('click', () => {
        switchView('algo');
    });

    // Pattern & Search Event Listeners
    const searchInput = document.getElementById('algo-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value.toLowerCase().trim();
            renderAlgoList(store);
        });
    }

    const diffFilter = document.getElementById('algo-diff-filter');
    if (diffFilter) {
        diffFilter.addEventListener('change', (e) => {
            currentDifficultyFilter = e.target.value;
            renderAlgoList(store);
        });
    }
}

/**
 * Switches between standard Questions View and Algo Breakdown View
 */
export function switchView(viewName) {
    const algoView = document.getElementById('algo-view');
    const questionsView = document.getElementById('questions-view');
    const algoTabBtn = document.getElementById('algo-tab-btn');
    const questionsTabBtn = document.getElementById('questions-tab-btn');
    const sidebar = document.querySelector('aside');

    if (viewName === 'algo') {
        algoView.classList.remove('hidden');
        questionsView.classList.add('hidden');
        if (sidebar) sidebar.classList.add('hidden', 'lg:hidden');
        
        algoTabBtn.classList.add('border-roast-500', 'text-roast-500', 'bg-roast-500/10');
        algoTabBtn.classList.remove('border-transparent', 'text-slate-400');
        
        if (questionsTabBtn) {
            questionsTabBtn.classList.remove('border-roast-500', 'text-roast-500', 'bg-roast-500/10');
            questionsTabBtn.classList.add('border-transparent', 'text-slate-400');
        }

        window.renderAlgoListGlobal && window.renderAlgoListGlobal();
    } else {
        algoView.classList.add('hidden');
        questionsView.classList.remove('hidden');
        if (sidebar) sidebar.classList.remove('hidden', 'lg:hidden');

        if (questionsTabBtn) {
            questionsTabBtn.classList.add('border-roast-500', 'text-roast-500', 'bg-roast-500/10');
            questionsTabBtn.classList.remove('border-transparent', 'text-slate-400');
        }
        algoTabBtn.classList.remove('border-roast-500', 'text-roast-500', 'bg-roast-500/10');
        algoTabBtn.classList.add('border-transparent', 'text-slate-400');
    }
}

/**
 * Renders the Algorithmic Questions Grid and Pattern Filters
 */
export function renderAlgoList(store) {
    const gridContainer = document.getElementById('algo-grid');
    const patternFilterContainer = document.getElementById('algo-pattern-filters');
    const totalCountEl = document.getElementById('algo-total-count');

    if (!gridContainer || !store.state.questionsList) return;

    // Filter questions that are algorithm breakdowns
    const algoQuestions = store.state.questionsList.filter(q => 
        q.format === 'Algo Breakdown' || q.topic === 'Algorithm Breakdown' || (q.path && q.path.includes('algorithms/'))
    );

    // Populate Pattern Pills if not already populated
    if (patternFilterContainer && patternFilterContainer.children.length <= 1) {
        const patternsSet = new Set();
        algoQuestions.forEach(q => { if (q.pattern) patternsSet.add(q.pattern); });
        
        const patterns = Array.from(patternsSet).sort();
        let pillsHtml = `
            <button class="algo-pill-btn active px-3 py-1.5 rounded-full text-xs font-semibold border transition-all bg-roast-500 text-[#2B1904] border-roast-500" data-pattern="all">
                All Patterns (${algoQuestions.length})
            </button>
        `;

        patterns.forEach(p => {
            const count = algoQuestions.filter(q => q.pattern === p).length;
            pillsHtml += `
                <button class="algo-pill-btn px-3 py-1.5 rounded-full text-xs font-semibold border transition-all border-slate-300 dark:border-slate-700 hover:border-roast-500 text-slate-600 dark:text-slate-300 bg-white dark:bg-panel-900" data-pattern="${p}">
                    ${p} (${count})
                </button>
            `;
        });

        patternFilterContainer.innerHTML = pillsHtml;

        // Attach click listeners to pattern pills
        patternFilterContainer.querySelectorAll('.algo-pill-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                patternFilterContainer.querySelectorAll('.algo-pill-btn').forEach(b => {
                    b.classList.remove('bg-roast-500', 'text-[#2B1904]', 'border-roast-500');
                    b.classList.add('border-slate-300', 'dark:border-slate-700', 'text-slate-600', 'dark:text-slate-300', 'bg-white', 'dark:bg-panel-900');
                });
                
                const target = e.currentTarget;
                target.classList.remove('border-slate-300', 'dark:border-slate-700', 'text-slate-600', 'dark:text-slate-300', 'bg-white', 'dark:bg-panel-900');
                target.classList.add('bg-roast-500', 'text-[#2B1904]', 'border-roast-500');

                currentPatternFilter = target.dataset.pattern;
                renderAlgoList(store);
            });
        });
    }

    // Apply filtering
    let filtered = algoQuestions.filter(q => {
        // Pattern filter
        if (currentPatternFilter !== 'all' && q.pattern !== currentPatternFilter) return false;
        
        // Difficulty filter
        if (currentDifficultyFilter !== 'all' && q.difficulty !== currentDifficultyFilter) return false;

        // Search query
        if (currentSearchQuery) {
            const matchTitle = q.title.toLowerCase().includes(currentSearchQuery);
            const matchPattern = (q.pattern || '').toLowerCase().includes(currentSearchQuery);
            const matchTag = (q.tags || []).some(t => t.toLowerCase().includes(currentSearchQuery));
            if (!matchTitle && !matchPattern && !matchTag) return false;
        }

        return true;
    });

    if (totalCountEl) {
        totalCountEl.textContent = `${filtered.length} Algorithms`;
    }

    if (filtered.length === 0) {
        gridContainer.innerHTML = `
            <div class="col-span-full py-12 text-center text-slate-400">
                <i class="fa-solid fa-code text-4xl mb-3 opacity-40"></i>
                <p class="font-medium text-base">No algorithmic breakdowns match your criteria.</p>
                <button id="reset-algo-filters" class="mt-3 text-sm text-roast-500 font-semibold hover:underline">Reset Filters</button>
            </div>
        `;
        const resetBtn = document.getElementById('reset-algo-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                currentPatternFilter = 'all';
                currentDifficultyFilter = 'all';
                currentSearchQuery = '';
                const searchInput = document.getElementById('algo-search-input');
                if (searchInput) searchInput.value = '';
                const diffFilter = document.getElementById('algo-diff-filter');
                if (diffFilter) diffFilter.value = 'all';
                renderAlgoList(store);
            });
        }
        return;
    }

    // Render Cards
    gridContainer.innerHTML = filtered.map(q => {
        const isMastered = (store.state.masteredIds || []).includes(q.id);
        const flagged = isFlagged(q.id);

        let diffClass = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        if (q.difficulty === 'Middle') diffClass = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        if (q.difficulty === 'Senior') diffClass = 'bg-rose-500/10 text-rose-500 border-rose-500/20';

        return `
            <div class="bg-white dark:bg-panel-900 border ${isMastered ? 'border-emerald-500/50 dark:border-emerald-500/30' : 'border-slate-200 dark:border-slate-800'} rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group">
                <div>
                    <!-- Header Badges -->
                    <div class="flex items-center justify-between gap-2 mb-3">
                        <div class="flex items-center space-x-2">
                            <span class="px-2.5 py-0.5 rounded-md border text-[11px] font-bold ${diffClass}">
                                ${q.difficulty}
                            </span>
                            <span class="px-2.5 py-0.5 rounded-md border border-roast-500/20 bg-roast-500/10 text-roast-500 text-[11px] font-bold">
                                ${q.pattern || 'Algorithmic'}
                            </span>
                        </div>
                        <div class="flex items-center space-x-1.5 text-xs text-slate-400">
                            ${q.leetcode_id ? `<span class="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-semibold text-slate-500">LC #${q.leetcode_id}</span>` : ''}
                            <button class="flag-algo-btn ${flagged ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'} transition-colors p-1" data-id="${q.id}" title="Bookmark">
                                <i class="fa-solid fa-bookmark"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Title -->
                    <h3 class="font-bold text-slate-900 dark:text-white text-base leading-snug mb-3 group-hover:text-roast-500 transition-colors">
                        ${q.title}
                    </h3>

                    <!-- Complexity Badges -->
                    <div class="flex items-center space-x-3 mb-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                        <span class="flex items-center space-x-1" title="Time Complexity">
                            <i class="fa-regular fa-clock text-roast-500"></i>
                            <span>Time: <strong class="text-slate-700 dark:text-slate-200">${q.time_complexity || 'O(N)'}</strong></span>
                        </span>
                        <span class="flex items-center space-x-1" title="Space Complexity">
                            <i class="fa-solid fa-microchip text-slate-400"></i>
                            <span>Space: <strong class="text-slate-700 dark:text-slate-200">${q.space_complexity || 'O(1)'}</strong></span>
                        </span>
                    </div>
                </div>

                <!-- Footer Action -->
                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span class="text-xs text-slate-400 font-semibold flex items-center space-x-1">
                        <i class="fa-solid fa-fire text-amber-500 text-[10px]"></i>
                        <span>Freq: ${q.frequency || 'High'}</span>
                    </span>
                    <button class="open-algo-breakdown-btn bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-roast-500 dark:hover:bg-roast-500 dark:hover:text-[#2B1904] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5" data-id="${q.id}" data-path="${q.path}">
                        <span>Breakdown</span>
                        <i class="fa-solid fa-arrow-right text-[10px]"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // Attach Event Listeners to Breakdown Buttons
    gridContainer.querySelectorAll('.open-algo-breakdown-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const questionId = btn.dataset.id;
            const path = btn.dataset.path;
            const questionObj = store.state.questionsList.find(q => q.id === questionId);
            openAlgoModal(questionObj, path, store);
        });
    });

    // Attach Bookmark Buttons
    gridContainer.querySelectorAll('.flag-algo-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.dataset.id;
            toggleFlag(id);
            renderAlgoList(store);
        });
    });
}

/**
 * Opens the interactive Step-by-Step Algo Breakdown Modal
 */
export async function openAlgoModal(question, path, store) {
    const modal = document.getElementById('algo-modal');
    const modalBody = document.getElementById('algo-modal-body');
    const modalTitle = document.getElementById('algo-modal-title');
    const modalPattern = document.getElementById('algo-modal-pattern');
    const modalDiff = document.getElementById('algo-modal-diff');
    const modalTimeComp = document.getElementById('algo-modal-time-comp');
    const modalSpaceComp = document.getElementById('algo-modal-space-comp');

    if (!modal || !modalBody) return;

    modalTitle.textContent = question.title;
    modalPattern.textContent = question.pattern || 'Algorithmic Pattern';
    modalDiff.textContent = question.difficulty;
    modalTimeComp.textContent = question.time_complexity || 'O(N)';
    modalSpaceComp.textContent = question.space_complexity || 'O(1)';

    modalBody.innerHTML = `
        <div class="flex items-center justify-center py-12">
            <i class="fa-solid fa-spinner fa-spin text-roast-500 text-3xl"></i>
        </div>
    `;

    if (typeof modal.showModal === 'function') {
        modal.showModal();
    } else {
        modal.classList.remove('hidden');
    }

    try {
        const rawContent = await fetchQuestionContent(path);
        
        // Separate question prompt and answer
        const parts = rawContent.split('---ANSWER---');
        const questionPrompt = parts[0].replace(/^---[\s\S]*?---\s*/, '').trim();
        const answerBody = parts[1] ? parts[1].trim() : '';

        // Render Markdown
        const promptHtml = typeof marked !== 'undefined' ? marked.parse(questionPrompt) : questionPrompt;
        const answerHtml = typeof marked !== 'undefined' ? marked.parse(answerBody) : answerBody;

        modalBody.innerHTML = `
            <div class="space-y-6">
                <!-- Problem Statement Card -->
                <div class="bg-slate-50 dark:bg-ink-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm leading-relaxed text-slate-700 dark:text-slate-300 markdown-body">
                    <h4 class="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center space-x-2">
                        <i class="fa-solid fa-file-lines text-roast-500"></i>
                        <span>Problem Statement & Constraints</span>
                    </h4>
                    <div>${promptHtml}</div>
                </div>

                <!-- Deep Dive Solution & Breakdown -->
                <div class="bg-white dark:bg-panel-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 markdown-body">
                    <div>${answerHtml}</div>
                </div>
            </div>
        `;

        // Highlight Java Code Blocks
        if (typeof hljs !== 'undefined') {
            modalBody.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }
    } catch (err) {
        modalBody.innerHTML = `
            <div class="p-6 text-center text-rose-500 font-semibold">
                Failed to load breakdown content. Please try again.
            </div>
        `;
    }
}
