/**
 * Algorithms & LeetCode Breakdown View Module
 * Handles algorithmic pattern filtering, grid rendering, and interactive step-by-step modal.
 */

import { fetchQuestionContent } from './api.js';
import { isFlagged, toggleFlag } from './collections.js';
import { state } from './state.js';

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
    const sysdesignView = document.getElementById('sysdesign-view');

    const algoTabBtn = document.getElementById('algo-tab-btn');
    const questionsTabBtn = document.getElementById('questions-tab-btn');
    const sysdesignTabBtn = document.getElementById('sysdesign-tab-btn');

    if (!algoView || !questionsView || !sysdesignView) return;

    // Reset all views
    questionsView.classList.add('hidden');
    questionsView.style.display = 'none';
    algoView.classList.add('hidden');
    algoView.style.display = 'none';
    sysdesignView.classList.add('hidden');
    sysdesignView.style.display = 'none';

    // Reset all tab buttons
    [questionsTabBtn, algoTabBtn, sysdesignTabBtn].forEach(btn => {
        if (btn) {
            btn.classList.remove('border-roast-500', 'text-roast-500', 'bg-roast-500/10');
            btn.classList.add('border-transparent', 'text-slate-400');
        }
    });

    if (viewName === 'algo') {
        algoView.classList.remove('hidden');
        algoView.style.display = 'block';
        if (algoTabBtn) {
            algoTabBtn.classList.add('border-roast-500', 'text-roast-500', 'bg-roast-500/10');
            algoTabBtn.classList.remove('border-transparent', 'text-slate-400');
        }
        renderAlgoList();
    } else if (viewName === 'sysdesign') {
        sysdesignView.classList.remove('hidden');
        sysdesignView.style.display = 'block';
        if (sysdesignTabBtn) {
            sysdesignTabBtn.classList.add('border-roast-500', 'text-roast-500', 'bg-roast-500/10');
            sysdesignTabBtn.classList.remove('border-transparent', 'text-slate-400');
        }
    } else {
        questionsView.classList.remove('hidden');
        questionsView.style.display = '';
        if (questionsTabBtn) {
            questionsTabBtn.classList.add('border-roast-500', 'text-roast-500', 'bg-roast-500/10');
            questionsTabBtn.classList.remove('border-transparent', 'text-slate-400');
        }
    }
}

/**
 * Renders the Algorithmic Questions Grid and Pattern Filters
 */
export function renderAlgoList(store) {
    const gridContainer = document.getElementById('algo-grid');
    const patternFilterContainer = document.getElementById('algo-pattern-filters');
    const totalCountEl = document.getElementById('algo-total-count');

    if (!gridContainer) return;

    const questionsList = (store && store.state && store.state.questionsList) || state.questionsList || [];
    const masteredIds = (store && store.state && store.state.masteredIds) || state.masteredIds || [];

    // Filter questions that are algorithm breakdowns
    const algoQuestions = questionsList.filter(q => 
        q.format === 'Algo Breakdown' || q.topic === 'Algorithm Breakdown' || (q.path && q.path.includes('algorithms/'))
    );

    // Populate Pattern Pills if not already populated
    if (patternFilterContainer && patternFilterContainer.children.length <= 1) {
        const patternsSet = new Set();
        algoQuestions.forEach(q => { if (q.pattern) patternsSet.add(q.pattern); });
        
        const patterns = Array.from(patternsSet).sort();
        let pillsHtml = `
            <button class="algo-pill-btn active px-3.5 py-1.5 rounded-[7px] text-xs font-semibold whitespace-nowrap border transition-all shadow-sm bg-roast-500 text-white border-roast-500 hover:opacity-95 flex items-center" data-pattern="all">
                <span>All Patterns</span>
                <span class="ml-1.5 px-1.5 py-0.5 rounded-[5px] bg-white/20 text-white text-[10px] font-mono font-bold">${algoQuestions.length}</span>
            </button>
        `;

        patterns.forEach(p => {
            const count = algoQuestions.filter(q => q.pattern === p).length;
            pillsHtml += `
                <button class="algo-pill-btn px-3.5 py-1.5 rounded-[7px] text-xs font-semibold whitespace-nowrap border transition-all shadow-sm border-mist-50 dark:border-slate-800 text-slate-600 dark:text-slate-300 bg-white dark:bg-panel-900 hover:border-roast-500 hover:text-roast-500 flex items-center" data-pattern="${p}">
                    <span>${p}</span>
                    <span class="pill-badge ml-1.5 px-1.5 py-0.5 rounded-[5px] bg-paper-50 dark:bg-panel-700 text-slate-500 dark:text-slate-400 text-[10px] font-mono font-bold">${count}</span>
                </button>
            `;
        });

        patternFilterContainer.innerHTML = pillsHtml;

        // Attach click listeners to pattern pills
        patternFilterContainer.querySelectorAll('.algo-pill-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                patternFilterContainer.querySelectorAll('.algo-pill-btn').forEach(b => {
                    b.classList.remove('bg-roast-500', 'text-white', 'border-roast-500');
                    b.classList.add('border-mist-50', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-300', 'bg-white', 'dark:bg-panel-900');
                    const badge = b.querySelector('.pill-badge');
                    if (badge) {
                        badge.className = 'pill-badge ml-1.5 px-1.5 py-0.5 rounded-[5px] bg-paper-50 dark:bg-panel-700 text-slate-500 dark:text-slate-400 text-[10px] font-mono font-bold';
                    }
                });
                
                const target = e.currentTarget;
                target.classList.remove('border-mist-50', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-300', 'bg-white', 'dark:bg-panel-900');
                target.classList.add('bg-roast-500', 'text-white', 'border-roast-500');
                const activeBadge = target.querySelector('.pill-badge');
                if (activeBadge) {
                    activeBadge.className = 'pill-badge ml-1.5 px-1.5 py-0.5 rounded-[5px] bg-white/20 text-white text-[10px] font-mono font-bold';
                }

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
        const isMastered = masteredIds.includes(q.id);
        const flagged = isFlagged(q.id);

        let diffClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40';
        if (q.difficulty === 'Middle') diffClass = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40';
        if (q.difficulty === 'Senior') diffClass = 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/40';

        return `
            <div class="bg-white dark:bg-panel-900 border ${isMastered ? 'border-emerald-500/50 dark:border-emerald-500/30' : 'border-mist-50 dark:border-slate-800'} rounded-[12px] p-5 shadow-soft hover:shadow-attio transition-all flex flex-col justify-between relative group">
                <div>
                    <!-- Header Badges -->
                    <div class="flex items-center justify-between gap-2 mb-3">
                        <div class="flex items-center space-x-2">
                            <span class="px-2.5 py-0.5 rounded-[7px] border text-[11px] font-semibold ${diffClass}">
                                ${q.difficulty}
                            </span>
                            <span class="px-2.5 py-0.5 rounded-[7px] border border-roast-500/20 bg-roast-500/10 text-roast-500 text-[11px] font-semibold">
                                ${q.pattern || 'Algorithmic'}
                            </span>
                        </div>
                        <div class="flex items-center space-x-1.5 text-xs text-slate-400">
                            ${q.leetcode_id ? `<span class="font-mono text-[11px] bg-paper-50 dark:bg-panel-700 border border-mist-50 dark:border-slate-800 px-2 py-0.5 rounded-[7px] font-semibold text-slate-600 dark:text-slate-300">LC #${q.leetcode_id}</span>` : ''}
                            <button class="flag-algo-btn ${flagged ? 'text-roast-500' : 'text-slate-300 hover:text-roast-500'} transition-colors p-1" data-id="${q.id}" title="Bookmark">
                                <i class="fa-solid fa-bookmark"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Title -->
                    <h3 class="font-bold text-slate-900 dark:text-white text-base leading-snug mb-3 group-hover:text-roast-500 transition-colors">
                        ${q.title}
                    </h3>

                    <!-- Complexity Badges -->
                    <div class="flex flex-wrap items-center gap-2 mb-4">
                        <span class="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-[7px] border border-mist-50 dark:border-slate-800 bg-paper-50 dark:bg-panel-700/50 text-[11px] font-mono text-slate-600 dark:text-slate-300" title="Time Complexity">
                            <i class="fa-regular fa-clock text-roast-500 text-[10px]"></i>
                            <span>Time: <strong class="text-slate-900 dark:text-white font-semibold">${q.time_complexity || 'O(N)'}</strong></span>
                        </span>
                        <span class="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-[7px] border border-mist-50 dark:border-slate-800 bg-paper-50 dark:bg-panel-700/50 text-[11px] font-mono text-slate-600 dark:text-slate-300" title="Space Complexity">
                            <i class="fa-solid fa-microchip text-slate-400 text-[10px]"></i>
                            <span>Space: <strong class="text-slate-900 dark:text-white font-semibold">${q.space_complexity || 'O(1)'}</strong></span>
                        </span>
                    </div>
                </div>

                <!-- Footer Action -->
                <div class="pt-3 border-t border-mist-50 dark:border-slate-800/80 flex items-center justify-between">
                    <span class="text-[11px] text-slate-500 dark:text-slate-400 font-mono font-medium flex items-center space-x-1">
                        <i class="fa-solid fa-fire text-amber-500 text-[10px]"></i>
                        <span>Freq: ${q.frequency || 'High'}</span>
                    </span>
                    <button class="open-algo-breakdown-btn bg-ink-800 dark:bg-panel-700 text-white hover:bg-roast-500 dark:hover:bg-roast-500 px-3.5 py-1.5 rounded-[7px] text-xs font-semibold transition-colors flex items-center space-x-1.5 shadow-sm" data-id="${q.id}" data-path="${q.path}">
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
            const questionObj = questionsList.find(q => q.id === questionId);
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
 * Cleans LaTeX formatting and markdown hr dividers from section text
 */
function cleanMarkdownText(text) {
    if (!text) return '';
    return text
        .replace(/\$\\rightarrow\$/g, '→')
        .replace(/\\rightarrow/g, '→')
        .replace(/\$\\implies\$/g, '⇒')
        .replace(/\\implies/g, '⇒')
        .replace(/\$\\le\$/g, '≤')
        .replace(/\$\\ge\$/g, '≥')
        .replace(/\$O\(([^)]+)\)\$/g, 'O($1)')
        .replace(/^[ \t]*---[ \t]*$/gm, '');
}

/**
 * Parses markdown answer body into structured step-by-step sections
 */
function parseAnswerSections(answerBody) {
    if (!answerBody) return [];
    
    const cleanedBody = cleanMarkdownText(answerBody);
    const rawSections = cleanedBody.split(/(?=^###\s+)/m);
    const sections = [];

    rawSections.forEach(sec => {
        const trimmed = sec.trim();
        if (!trimmed) return;

        const match = trimmed.match(/^###\s+(.*)/);
        if (match) {
            const title = match[1].trim();
            const content = trimmed.replace(/^###\s+.*(\r?\n)?/, '').trim();
            sections.push({ title, content });
        } else {
            sections.push({ title: 'Overview & Solution', content: trimmed });
        }
    });

    return sections;
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

        // Render Markdown for Prompt
        const cleanedPrompt = cleanMarkdownText(questionPrompt);
        const promptHtml = typeof marked !== 'undefined' ? marked.parse(cleanedPrompt) : cleanedPrompt;

        // Parse Answer into Steps
        const sections = parseAnswerSections(answerBody);

        let sectionsHtml = '';
        if (sections.length > 0) {
            sectionsHtml = sections.map((sec, idx) => {
                const secHtml = typeof marked !== 'undefined' ? marked.parse(sec.content) : sec.content;
                // All steps closed by default for self-evaluation
                const isOpen = '';

                return `
                    <details class="algo-step-details group bg-white dark:bg-panel-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-attio-subtle transition-all" ${isOpen}>
                        <summary class="flex items-center justify-between p-4 cursor-pointer font-bold text-slate-900 dark:text-white hover:bg-slate-50/80 dark:hover:bg-ink-950/80 transition-colors select-none">
                            <span class="flex items-center space-x-2.5 text-sm sm:text-base">
                                <span class="w-6 h-6 rounded-[7px] bg-roast-500/10 text-roast-500 border border-roast-500/20 text-xs flex items-center justify-center font-mono font-bold">${idx + 1}</span>
                                <span class="font-bold text-slate-900 dark:text-white">${sec.title}</span>
                            </span>
                            <div class="flex items-center space-x-2">
                                <span class="text-[11px] font-semibold text-slate-400 group-open:hidden">Click to reveal</span>
                                <i class="fa-solid fa-chevron-down text-slate-400 text-xs group-open:rotate-180 transition-transform duration-300"></i>
                            </div>
                        </summary>
                        <div class="p-5 border-t border-slate-100 dark:border-slate-800 text-sm leading-relaxed text-slate-700 dark:text-slate-300 markdown-body bg-white dark:bg-panel-900">
                            ${secHtml}
                        </div>
                    </details>
                `;
            }).join('');
        } else {
            const answerHtml = typeof marked !== 'undefined' ? marked.parse(answerBody) : answerBody;
            sectionsHtml = `<div class="bg-white dark:bg-panel-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 markdown-body shadow-attio-subtle">${answerHtml}</div>`;
        }

        modalBody.innerHTML = `
            <div class="space-y-6">
                <!-- Problem Statement Card (Always Visible) -->
                <div class="bg-white dark:bg-panel-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm leading-relaxed text-slate-700 dark:text-slate-300 markdown-body shadow-attio-subtle">
                    <h4 class="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center space-x-2">
                        <i class="fa-solid fa-file-lines text-roast-500"></i>
                        <span>Problem Statement & Constraints</span>
                    </h4>
                    <div>${promptHtml}</div>
                </div>

                <!-- Interactive Step Breakdown Header & Toggle -->
                <div class="space-y-4">
                    <div class="flex items-center justify-between px-1">
                        <div class="flex items-center space-x-2 text-xs font-semibold text-slate-500">
                            <i class="fa-solid fa-lightbulb text-amber-500 animate-pulse"></i>
                            <span>Step-by-step solution: Click sections to reveal hints & code</span>
                        </div>
                        <button id="toggle-all-algo-steps" class="text-xs font-bold text-roast-500 hover:underline flex items-center space-x-1">
                            <i class="fa-solid fa-layer-group"></i>
                            <span id="toggle-all-text">Expand All Steps</span>
                        </button>
                    </div>

                    <!-- Accordion Details List -->
                    <div class="space-y-3" id="algo-sections-container">
                        ${sectionsHtml}
                    </div>
                </div>
            </div>
        `;

        // Highlight Java Code Blocks
        if (typeof hljs !== 'undefined') {
            modalBody.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }

        // Toggle All Steps Button
        const toggleBtn = document.getElementById('toggle-all-algo-steps');
        const toggleText = document.getElementById('toggle-all-text');
        if (toggleBtn) {
            let allExpanded = false;
            toggleBtn.addEventListener('click', () => {
                allExpanded = !allExpanded;
                modalBody.querySelectorAll('.algo-step-details').forEach(details => {
                    if (allExpanded) {
                        details.setAttribute('open', '');
                    } else {
                        details.removeAttribute('open');
                    }
                });
                if (toggleText) {
                    toggleText.textContent = allExpanded ? 'Collapse All Steps' : 'Expand All Steps';
                }
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
