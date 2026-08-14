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
        let diffClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40';
        if (s.difficulty === 'Senior') diffClass = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40';
        if (s.difficulty === 'Architect') diffClass = 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/40';

        const tagBadges = s.tags.slice(0, 3).map(t => `
            <span class="px-2 py-0.5 rounded-[7px] text-[11px] font-mono bg-paper-50 dark:bg-panel-700 text-slate-600 dark:text-slate-300 font-medium border border-mist-50 dark:border-slate-800">
                ${t}
            </span>
        `).join('');

        return `
            <div class="bg-white dark:bg-panel-900 border border-mist-50 dark:border-slate-800 rounded-[12px] p-6 shadow-soft hover:shadow-attio transition-all flex flex-col justify-between group">
                <div>
                    <!-- Badges -->
                    <div class="flex items-center justify-between gap-2 mb-3">
                        <span class="px-2.5 py-0.5 rounded-[7px] border text-[11px] font-semibold ${diffClass}">
                            ${s.difficulty}
                        </span>
                        <span class="px-2.5 py-0.5 rounded-[7px] border border-roast-500/20 bg-roast-500/10 text-roast-500 text-[11px] font-semibold">
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
                <div class="pt-4 border-t border-mist-50 dark:border-slate-800/80 flex items-center justify-between">
                    <span class="text-[11px] text-slate-500 dark:text-slate-400 font-mono font-medium flex items-center space-x-1.5">
                        <i class="fa-solid fa-diagram-project text-roast-500 text-xs"></i>
                        <span>${s.steps.length} Simulation Steps</span>
                    </span>
                    <button class="open-sysdesign-btn bg-ink-800 dark:bg-panel-700 text-white hover:bg-roast-500 dark:hover:bg-roast-500 px-4 py-2 rounded-[7px] text-xs font-semibold transition-all flex items-center space-x-2 shadow-sm" data-id="${s.id}">
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
                <td class="py-2.5 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap font-mono text-[11px]">${c.name}</td>
                <td class="py-2.5 px-3 text-slate-600 dark:text-slate-300 leading-relaxed">${c.role}</td>
            </tr>
        `).join('');

        const pitfallsHtml = currentScenario.interviewPitfalls.map(p => `
            <li class="flex items-start space-x-2 text-xs text-amber-700 dark:text-amber-300">
                <i class="fa-solid fa-triangle-exclamation mt-0.5 flex-shrink-0 text-amber-500"></i>
                <span class="leading-relaxed">${p}</span>
            </li>
        `).join('');

        const codeHtml = typeof hljs !== 'undefined' ? 
            hljs.highlight(currentScenario.javaCode, { language: 'java' }).value : 
            currentScenario.javaCode;

        detailsContainer.innerHTML = `
            <div class="space-y-4">
                <!-- Components Table -->
                <div class="bg-white dark:bg-panel-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-attio-subtle">
                    <h5 class="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2.5 flex items-center space-x-1.5">
                        <i class="fa-solid fa-cubes text-roast-500"></i>
                        <span>Component Roles</span>
                    </h5>
                    <table class="w-full text-left border-collapse">
                        <tbody>${componentsHtml}</tbody>
                    </table>
                </div>

                <!-- Interview Pitfalls -->
                <div class="bg-amber-500/5 dark:bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 shadow-attio-subtle">
                    <h5 class="font-bold text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2.5 flex items-center space-x-1.5">
                        <i class="fa-solid fa-shield-cat text-amber-500"></i>
                        <span>Interview Trade-offs & Pitfalls</span>
                    </h5>
                    <ul class="space-y-2">${pitfallsHtml}</ul>
                </div>

                <!-- Java Code -->
                <div class="bg-white dark:bg-panel-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 overflow-x-auto text-xs shadow-attio-subtle">
                    <div class="flex items-center justify-between mb-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        <span class="flex items-center space-x-1.5">
                            <i class="fa-brands fa-java text-roast-500"></i>
                            <span class="font-bold text-slate-800 dark:text-slate-200">Production Java Implementation</span>
                        </span>
                    </div>
                    <pre class="font-mono text-slate-800 dark:text-slate-200 leading-relaxed font-normal"><code>${codeHtml}</code></pre>
                </div>
            </div>
        `;
    }
}

/**
 * Pure-SVG Architecture Diagram Renderer
 * All elements (nodes, connections, particles) rendered in a single SVG coordinate system
 * to guarantee pixel-perfect alignment and smooth animation.
 */
function renderSvgCanvas(scenario, activeStep) {
    const canvasContainer = document.getElementById('sysdesign-canvas');
    if (!canvasContainer) return;

    const W = 740;
    const H = 340;
    const NW = 120;
    const NH = 80;

    const nodeMap = new Map();
    scenario.nodes.forEach(n => nodeMap.set(n.id, n));

    // Helper: get center of a node
    const cx = n => n.x + NW / 2;
    const cy = n => n.y + NH / 2;

    // Helper: compute connection anchor points (exit side of 'from', entry side of 'to')
    function getAnchors(from, to) {
        const fcx = cx(from), fcy = cy(from);
        const tcx = cx(to), tcy = cy(to);
        const dx = tcx - fcx;
        const dy = tcy - fcy;

        let x1, y1, x2, y2;
        if (Math.abs(dx) >= Math.abs(dy)) {
            if (dx >= 0) {
                x1 = from.x + NW; y1 = fcy;
                x2 = to.x;        y2 = tcy;
            } else {
                x1 = from.x;      y1 = fcy;
                x2 = to.x + NW;   y2 = tcy;
            }
        } else {
            if (dy >= 0) {
                x1 = fcx;  y1 = from.y + NH;
                x2 = tcx;  y2 = to.y;
            } else {
                x1 = fcx;  y1 = from.y;
                x2 = tcx;  y2 = to.y + NH;
            }
        }
        return { x1, y1, x2, y2 };
    }

    // Helper: build a smooth cubic bezier path between two anchor points
    function buildSmoothPath(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;

        if (Math.abs(dy) < 3) {
            return `M ${x1} ${y1} L ${x2} ${y2}`;
        }
        if (Math.abs(dx) < 3) {
            return `M ${x1} ${y1} L ${x2} ${y2}`;
        }

        // Smooth cubic bezier: horizontal exit, then curve to destination
        const tension = Math.min(Math.abs(dx), Math.abs(dy)) * 0.55;
        const cp1x = x1 + (Math.abs(dx) > Math.abs(dy) ? tension : 0);
        const cp1y = y1 + (Math.abs(dy) > Math.abs(dx) ? (dy > 0 ? tension : -tension) : 0);
        const cp2x = x2 - (Math.abs(dx) > Math.abs(dy) ? tension : 0);
        const cp2y = y2 - (Math.abs(dy) > Math.abs(dx) ? (dy > 0 ? tension : -tension) : 0);

        return `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
    }

    // --- Draw Connections ---
    let connectionsSvg = '';
    let activePathD = '';

    (scenario.connections || []).forEach(conn => {
        const from = nodeMap.get(conn.from);
        const to = nodeMap.get(conn.to);
        if (!from || !to) return;

        const { x1, y1, x2, y2 } = getAnchors(from, to);
        const pathD = buildSmoothPath(x1, y1, x2, y2);

        const isActive = activeStep.activePath &&
            activeStep.activePath.includes(conn.from) &&
            activeStep.activePath.includes(conn.to);

        if (isActive) {
            activePathD = pathD;
            connectionsSvg += `<path d="${pathD}" fill="none" stroke="#266df0" stroke-width="2.5" stroke-linecap="round" marker-end="url(#arr-on)" opacity="1" />`;
        } else {
            connectionsSvg += `<path d="${pathD}" fill="none" stroke="#cad0d9" stroke-width="1.5" stroke-dasharray="6 4" stroke-linecap="round" marker-end="url(#arr-off)" opacity="0.6" />`;
        }
    });

    // --- Animated Particle ---
    let particleSvg = '';
    if (activePathD) {
        particleSvg = `
            <path id="sd-motion-path" d="${activePathD}" fill="none" stroke="none" />
            <circle r="4.5" fill="#266df0" opacity="0.95">
                <animateMotion dur="1.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1">
                    <mpath href="#sd-motion-path" />
                </animateMotion>
            </circle>
            <circle r="10" fill="#266df0" opacity="0.2">
                <animateMotion dur="1.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1">
                    <mpath href="#sd-motion-path" />
                </animateMotion>
            </circle>`;
    }

    // --- Draw Nodes as foreignObject inside SVG ---
    let nodesSvg = '';
    scenario.nodes.forEach(n => {
        const isActive = n.id === activeStep.activeNode;
        const isDark = document.documentElement.classList.contains('dark');

        // Node box styles
        const bg = isActive ? (isDark ? '#14254a' : '#f0f5ff') : (isDark ? '#16191f' : '#ffffff');
        const borderColor = isActive ? '#266df0' : (isDark ? '#2e3238' : '#e4e7ec');
        const borderWidth = isActive ? 2 : 1;
        const iconBg = isActive ? '#266df0' : (isDark ? '#232529' : '#f4f5f6');
        const iconColor = isActive ? '#ffffff' : (isDark ? '#9fa1a7' : '#505967');
        const textColor = isDark ? '#f4f5f6' : '#1c1d1f';
        const shadowFilter = isActive ? 'url(#glow)' : '';

        // Active glow ring
        if (isActive) {
            nodesSvg += `<rect x="${n.x - 3}" y="${n.y - 3}" width="${NW + 6}" height="${NH + 6}" rx="14" fill="none" stroke="#266df0" stroke-width="1.5" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.15;0.4" dur="1.5s" repeatCount="indefinite" />
            </rect>`;
        }

        // Node rectangle
        nodesSvg += `<rect x="${n.x}" y="${n.y}" width="${NW}" height="${NH}" rx="12" fill="${bg}" stroke="${borderColor}" stroke-width="${borderWidth}" filter="${shadowFilter}" />`;

        // Badge (above node)
        if (isActive && activeStep.badge) {
            const badgeText = activeStep.badge;
            const badgeW = Math.min(badgeText.length * 5.5 + 16, 180);
            const badgeX = n.x + NW / 2 - badgeW / 2;
            const badgeY = n.y - 16;
            nodesSvg += `<rect x="${badgeX}" y="${badgeY}" width="${badgeW}" height="16" rx="8" fill="#266df0" />`;
            nodesSvg += `<text x="${n.x + NW / 2}" y="${badgeY + 11.5}" text-anchor="middle" font-size="8" font-weight="800" fill="#ffffff" font-family="JetBrains Mono, ui-monospace, monospace">${badgeText}</text>`;
        }

        // Icon circle
        const iconCx = n.x + NW / 2;
        const iconCy = n.y + 26;
        nodesSvg += `<rect x="${iconCx - 15}" y="${iconCy - 15}" width="30" height="30" rx="7" fill="${iconBg}" />`;

        // Use foreignObject for FA icon
        nodesSvg += `<foreignObject x="${iconCx - 10}" y="${iconCy - 10}" width="20" height="20">
            <div xmlns="http://www.w3.org/1999/xhtml" style="width:20px;height:20px;display:flex;align-items:center;justify-content:center;color:${iconColor};font-size:12px;">
                <i class="fa-solid ${n.icon}"></i>
            </div>
        </foreignObject>`;

        // Label text
        nodesSvg += `<text x="${n.x + NW / 2}" y="${n.y + NH - 12}" text-anchor="middle" font-size="11" font-weight="600" fill="${textColor}" font-family="Inter, system-ui, sans-serif">${n.label}</text>`;
    });

    // --- Assemble Full SVG ---
    canvasContainer.innerHTML = `
        <div class="relative w-full rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner bg-slate-50/70 dark:bg-ink-950/80" style="aspect-ratio: ${W} / ${H};">
            <svg viewBox="0 0 ${W} ${H}" class="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <marker id="arr-off" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                        <path d="M 0 1 L 8 5 L 0 9 z" fill="#cad0d9" />
                    </marker>
                    <marker id="arr-on" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                        <path d="M 0 1 L 8 5 L 0 9 z" fill="#266df0" />
                    </marker>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#266df0" flood-opacity="0.35" />
                    </filter>
                </defs>
                ${connectionsSvg}
                ${particleSvg}
                ${nodesSvg}
            </svg>
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
