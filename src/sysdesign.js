import { SYS_DESIGN_SCENARIOS } from './sysdesignData.js';
import { switchView } from './algorithms.js';

let currentScenario = null;
let currentStepIndex = 0;
let simulationInterval = null;
let isPlaying = false;
let currentCategoryFilter = 'all';

/**
 * Initializes System Design Architecture View
 */
export function initSysDesignView() {
    const sysBtn = document.getElementById('sysdesign-tab-btn');
    const searchInput = document.getElementById('sysdesign-search-input');
    const catFilter = document.getElementById('sysdesign-cat-filter');

    if (sysBtn) {
        sysBtn.addEventListener('click', () => {
            if (typeof window.switchViewGlobal === 'function') {
                window.switchViewGlobal('sysdesign');
            } else {
                switchView('sysdesign');
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderSysDesignList(e.target.value.toLowerCase().trim());
        });
    }

    if (catFilter) {
        catFilter.addEventListener('change', (e) => {
            currentCategoryFilter = e.target.value;
            renderSysDesignList();
        });
    }

    renderSysDesignList();
    setupModalListeners();
}

/**
 * Renders System Design Scenario Grid Cards
 */
export function renderSysDesignList(searchQuery = '') {
    const gridContainer = document.getElementById('sysdesign-grid');
    const totalCountEl = document.getElementById('sysdesign-total-count');

    if (!gridContainer) return;

    let filtered = SYS_DESIGN_SCENARIOS.filter(s => {
        if (currentCategoryFilter !== 'all' && s.category !== currentCategoryFilter) return false;
        if (searchQuery) {
            const matchTitle = s.title.toLowerCase().includes(searchQuery);
            const matchOverview = s.overview.toLowerCase().includes(searchQuery);
            const matchTag = s.tags.some(t => t.toLowerCase().includes(searchQuery));
            if (!matchTitle && !matchOverview && !matchTag) return false;
        }
        return true;
    });

    if (totalCountEl) {
        totalCountEl.textContent = `${filtered.length} Architectures`;
    }

    if (filtered.length === 0) {
        gridContainer.innerHTML = `
            <div class="col-span-full py-12 text-center text-slate-400">
                <i class="fa-solid fa-network-wired text-4xl mb-3 opacity-40"></i>
                <p class="font-medium text-base">No system architecture diagrams match your filter criteria.</p>
            </div>
        `;
        return;
    }

    gridContainer.innerHTML = filtered.map(s => {
        let diffClass = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        if (s.difficulty === 'Senior') diffClass = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        if (s.difficulty === 'Architect') diffClass = 'bg-rose-500/10 text-rose-500 border-rose-500/20';

        const tagBadges = s.tags.slice(0, 3).map(t => `
            <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border border-slate-200 dark:border-slate-700/60">
                ${t}
            </span>
        `).join('');

        return `
            <div class="bg-white dark:bg-panel-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                    <!-- Badges -->
                    <div class="flex items-center justify-between gap-2 mb-3">
                        <span class="px-2.5 py-0.5 rounded-md border text-[11px] font-bold ${diffClass}">
                            ${s.difficulty}
                        </span>
                        <span class="px-2.5 py-0.5 rounded-md border border-roast-500/20 bg-roast-500/10 text-roast-500 text-[11px] font-bold">
                            ${s.category}
                        </span>
                    </div>

                    <!-- Title -->
                    <h3 class="font-bold text-slate-900 dark:text-white text-lg leading-snug mb-2 group-hover:text-roast-500 transition-colors">
                        ${s.title}
                    </h3>

                    <!-- Description -->
                    <p class="text-xs leading-relaxed text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                        ${s.overview}
                    </p>

                    <!-- Tags -->
                    <div class="flex flex-wrap gap-1.5 mb-5">
                        ${tagBadges}
                    </div>
                </div>

                <!-- Action Button -->
                <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span class="text-xs text-slate-400 font-mono flex items-center space-x-1">
                        <i class="fa-solid fa-diagram-project text-roast-500 text-xs"></i>
                        <span>${s.steps.length} Simulation Steps</span>
                    </span>
                    <button class="open-sysdesign-btn bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-roast-500 dark:hover:bg-roast-500 dark:hover:text-[#2B1904] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shadow-sm" data-id="${s.id}">
                        <i class="fa-solid fa-play text-[10px]"></i>
                        <span>Explore & Simulate</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    gridContainer.querySelectorAll('.open-sysdesign-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            openSysDesignModal(id);
        });
    });
}

/**
 * Opens Interactive Architecture Simulation Modal
 */
export function openSysDesignModal(scenarioId) {
    const modal = document.getElementById('sysdesign-modal');
    currentScenario = SYS_DESIGN_SCENARIOS.find(s => s.id === scenarioId);

    if (!modal || !currentScenario) return;

    currentStepIndex = 0;
    stopSimulation();

    // Populate Headers
    document.getElementById('sysdesign-modal-title').textContent = currentScenario.title;
    document.getElementById('sysdesign-modal-category').textContent = currentScenario.category;
    document.getElementById('sysdesign-modal-diff').textContent = currentScenario.difficulty;

    if (typeof modal.showModal === 'function') {
        modal.showModal();
    } else {
        modal.classList.remove('hidden');
    }

    renderSimulationStep();
}

/**
 * Renders current simulation step diagram, active node, log, and breakdown
 */
function renderSimulationStep() {
    if (!currentScenario) return;

    const step = currentScenario.steps[currentStepIndex];
    const totalSteps = currentScenario.steps.length;

    // Update Counter
    const counterEl = document.getElementById('sysdesign-step-counter');
    if (counterEl) counterEl.textContent = `Step ${currentStepIndex + 1} of ${totalSteps}`;

    // Render SVG Architecture Canvas
    renderSvgCanvas(currentScenario, step);

    // Update Step Description & Log
    const stepTitleEl = document.getElementById('sysdesign-step-title');
    const stepDescEl = document.getElementById('sysdesign-step-desc');
    const logTextEl = document.getElementById('sysdesign-log-text');

    if (stepTitleEl) stepTitleEl.textContent = `${step.step}. ${step.title}`;
    if (stepDescEl) stepDescEl.textContent = step.description;
    if (logTextEl) logTextEl.textContent = step.log;

    // Render Components Table & Pitfalls
    const detailsContainer = document.getElementById('sysdesign-details-container');
    if (detailsContainer) {
        const componentsHtml = currentScenario.components.map(c => `
            <tr class="border-b border-slate-100 dark:border-slate-800 text-xs">
                <td class="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">${c.name}</td>
                <td class="py-2.5 px-3 text-slate-600 dark:text-slate-400">${c.role}</td>
            </tr>
        `).join('');

        const pitfallsHtml = currentScenario.interviewPitfalls.map(p => `
            <li class="flex items-start space-x-2 text-xs text-amber-700 dark:text-amber-400">
                <i class="fa-solid fa-triangle-exclamation mt-0.5 flex-shrink-0 text-amber-500"></i>
                <span>${p}</span>
            </li>
        `).join('');

        const codeHtml = typeof hljs !== 'undefined' ? 
            hljs.highlight(currentScenario.javaCode, { language: 'java' }).value : 
            currentScenario.javaCode;

        detailsContainer.innerHTML = `
            <div class="space-y-4">
                <!-- Components Table -->
                <div class="bg-slate-50 dark:bg-ink-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <h5 class="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2 flex items-center space-x-1.5">
                        <i class="fa-solid fa-cubes text-roast-500"></i>
                        <span>Component Roles</span>
                    </h5>
                    <table class="w-full text-left border-collapse">
                        <tbody>${componentsHtml}</tbody>
                    </table>
                </div>

                <!-- Interview Pitfalls -->
                <div class="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20">
                    <h5 class="font-bold text-xs uppercase tracking-wider text-amber-500 mb-2 flex items-center space-x-1.5">
                        <i class="fa-solid fa-shield-cat text-amber-500"></i>
                        <span>Interview Trade-offs & Pitfalls</span>
                    </h5>
                    <ul class="space-y-2">${pitfallsHtml}</ul>
                </div>

                <!-- Java Code -->
                <div class="bg-slate-900 rounded-xl border border-slate-800 p-4 overflow-x-auto text-xs">
                    <div class="flex items-center justify-between mb-2 pb-2 border-b border-slate-800 text-slate-400 font-mono">
                        <span class="flex items-center space-x-1.5">
                            <i class="fa-brands fa-java text-roast-500"></i>
                            <span>Production Java Implementation</span>
                        </span>
                    </div>
                    <pre class="font-mono text-slate-200 leading-relaxed"><code>${codeHtml}</code></pre>
                </div>
            </div>
        `;
    }
}

/**
 * Renders State-of-the-Art SVG Canvas Diagram with Orthogonal Curved Connection Pipes & Particle Streams
 */
function renderSvgCanvas(scenario, activeStep) {
    const canvasContainer = document.getElementById('sysdesign-canvas');
    if (!canvasContainer) return;

    const viewBoxWidth = 740;
    const viewBoxHeight = 340;
    const nodeW = 120;
    const nodeH = 80;

    const nodeMap = new Map();
    scenario.nodes.forEach(n => nodeMap.set(n.id, n));

    // Render Connections as Orthogonal Curved Paths
    let pathsSvg = '';
    let activePathD = '';

    (scenario.connections || []).forEach(conn => {
        const from = nodeMap.get(conn.from);
        const to = nodeMap.get(conn.to);
        if (!from || !to) return;

        // Calculate anchor points (center of node edges)
        const fromCx = from.x + nodeW / 2;
        const fromCy = from.y + nodeH / 2;
        const toCx = to.x + nodeW / 2;
        const toCy = to.y + nodeH / 2;

        // Determine exit/entry sides based on relative position
        let x1, y1, x2, y2;
        const dx = toCx - fromCx;
        const dy = toCy - fromCy;

        if (Math.abs(dx) >= Math.abs(dy)) {
            // Horizontal-dominant: exit right, enter left
            if (dx >= 0) {
                x1 = from.x + nodeW; y1 = fromCy;
                x2 = to.x;           y2 = toCy;
            } else {
                x1 = from.x;         y1 = fromCy;
                x2 = to.x + nodeW;   y2 = toCy;
            }
        } else {
            // Vertical-dominant: exit bottom, enter top (or vice versa)
            if (dy >= 0) {
                x1 = fromCx; y1 = from.y + nodeH;
                x2 = toCx;   y2 = to.y;
            } else {
                x1 = fromCx; y1 = from.y;
                x2 = toCx;   y2 = to.y + nodeH;
            }
        }

        let pathD = '';
        if (Math.abs(y1 - y2) < 5) {
            pathD = `M ${x1} ${y1} L ${x2} ${y2}`;
        } else if (Math.abs(x1 - x2) < 5) {
            pathD = `M ${x1} ${y1} L ${x2} ${y2}`;
        } else {
            // Orthogonal L-shaped elbow
            const midX = x1 + (x2 - x1) / 2;
            pathD = `M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`;
        }

        // Check if this connection matches active step path
        const isActiveConn = activeStep.activePath && 
            activeStep.activePath.includes(conn.from) && 
            activeStep.activePath.includes(conn.to);

        if (isActiveConn) {
            activePathD = pathD;
            pathsSvg += `
                <path d="${pathD}" fill="none" stroke="#f97316" stroke-width="3" stroke-linecap="round" marker-end="url(#arrow-active)" />
            `;
        } else {
            pathsSvg += `
                <path d="${pathD}" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.45" marker-end="url(#arrow-default)" />
            `;
        }
    });

    // Particle Motion Animation along Active Path
    let particleSvg = '';
    if (activePathD) {
        particleSvg = `
            <path id="active-flow-path" d="${activePathD}" fill="none" stroke="none" />
            <circle r="5" fill="#f97316">
                <animateMotion dur="1.2s" repeatCount="indefinite" rotate="auto">
                    <mpath href="#active-flow-path" />
                </animateMotion>
            </circle>
            <circle r="10" fill="#f97316" opacity="0.2">
                <animateMotion dur="1.2s" repeatCount="indefinite" rotate="auto">
                    <mpath href="#active-flow-path" />
                </animateMotion>
            </circle>
        `;
    }

    // Render Node Elements (Vertical Layout: Icon top, Label bottom, centered)
    const nodesHtml = scenario.nodes.map(n => {
        const isActive = n.id === activeStep.activeNode;
        const activeClass = isActive ? 
            'border-roast-500 bg-roast-500/10 shadow-xl ring-2 ring-roast-500/50 scale-[1.03] z-20' : 
            'border-slate-200 dark:border-slate-700/60 bg-white dark:bg-panel-900 opacity-90 hover:opacity-100 z-10';

        const badgeHtml = (isActive && activeStep.badge) ? `
            <div class="absolute -top-4 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-roast-500 text-[#2B1904] text-[9px] font-extrabold shadow-lg whitespace-nowrap z-30" style="animation: bounce 0.6s ease-in-out infinite alternate;">
                ${activeStep.badge}
            </div>
        ` : '';

        return `
            <div class="absolute rounded-2xl border ${activeClass} transition-all duration-300 flex flex-col items-center justify-center text-center w-[120px] h-[80px] shadow-sm select-none" style="left: ${n.x}px; top: ${n.y}px;">
                ${badgeHtml}
                <div class="w-9 h-9 rounded-xl ${isActive ? 'bg-roast-500 text-[#2B1904]' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'} flex items-center justify-center text-sm mb-1">
                    <i class="fa-solid ${n.icon}"></i>
                </div>
                <span class="text-[10px] font-bold text-slate-900 dark:text-white leading-tight px-1.5 max-w-full" title="${n.label}">${n.label}</span>
            </div>
        `;
    }).join('');

    canvasContainer.innerHTML = `
        <div class="relative w-full h-[340px] bg-slate-50/70 dark:bg-ink-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner">
            <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 ${viewBoxWidth} ${viewBoxHeight}">
                <defs>
                    <marker id="arrow-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                    </marker>
                    <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#f97316" />
                    </marker>
                </defs>
                ${pathsSvg}
                ${particleSvg}
            </svg>
            <div class="absolute inset-0 pointer-events-auto">
                ${nodesHtml}
            </div>
        </div>
    `;
}

/**
 * Setup Simulation Control Listeners
 */
function setupModalListeners() {
    const playBtn = document.getElementById('sysdesign-play-btn');
    const prevBtn = document.getElementById('sysdesign-prev-btn');
    const nextBtn = document.getElementById('sysdesign-next-btn');
    const resetBtn = document.getElementById('sysdesign-reset-btn');

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (isPlaying) {
                stopSimulation();
            } else {
                startSimulation();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopSimulation();
            if (currentStepIndex > 0) {
                currentStepIndex--;
                renderSimulationStep();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopSimulation();
            if (currentScenario && currentStepIndex < currentScenario.steps.length - 1) {
                currentStepIndex++;
                renderSimulationStep();
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            stopSimulation();
            currentStepIndex = 0;
            renderSimulationStep();
        });
    }
}

function startSimulation() {
    isPlaying = true;
    const playIcon = document.getElementById('sysdesign-play-icon');
    const playText = document.getElementById('sysdesign-play-text');
    if (playIcon) playIcon.className = 'fa-solid fa-pause';
    if (playText) playText.textContent = 'Pause';

    simulationInterval = setInterval(() => {
        if (!currentScenario) return;
        if (currentStepIndex < currentScenario.steps.length - 1) {
            currentStepIndex++;
            renderSimulationStep();
        } else {
            currentStepIndex = 0;
            renderSimulationStep();
        }
    }, 2500);
}

function stopSimulation() {
    isPlaying = false;
    if (simulationInterval) clearInterval(simulationInterval);
    const playIcon = document.getElementById('sysdesign-play-icon');
    const playText = document.getElementById('sysdesign-play-text');
    if (playIcon) playIcon.className = 'fa-solid fa-play';
    if (playText) playText.textContent = 'Play Flow';
}
