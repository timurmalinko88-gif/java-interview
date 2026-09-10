/**
 * LLM Integration & Google Antigravity Track Module
 * Manages the interactive curriculum dashboard, practice completion checklist,
 * and the zero-server interactive Tool Calling simulator.
 */

import { state } from './state.js';
import { triggerFilterAction, loadQuestion, buildSidebarList } from './ui.js';
import { switchView } from './algorithms.js';

// Namespaced LocalStorage key for practice checklist progress
const LLM_PRACTICE_STORAGE_KEY = 'java_trainer_llm_practice';

let practiceState = {};

export function loadPracticeState() {
  try {
    const raw = localStorage.getItem(LLM_PRACTICE_STORAGE_KEY);
    practiceState = raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.warn('Failed to load LLM practice state', e);
    practiceState = {};
  }
}

export function savePracticeState() {
  try {
    localStorage.setItem(LLM_PRACTICE_STORAGE_KEY, JSON.stringify(practiceState));
    updatePracticeProgressUI();
  } catch (e) {
    console.warn('Failed to save LLM practice state', e);
  }
}

export function togglePracticeTask(taskId) {
  practiceState[taskId] = !practiceState[taskId];
  savePracticeState();
}

export function initLlmTrackView() {
  loadPracticeState();
  initToolCallingSimulator();
  renderPracticeTasks();
  updatePracticeProgressUI();

  // Jump to module questions handler
  document.querySelectorAll('.btn-jump-module').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const moduleTag = e.currentTarget.getAttribute('data-module-tag');
      jumpToModuleQuestions(moduleTag);
    });
  });
}

export function jumpToModuleQuestions(moduleTag) {
  // Set roadmap to llmTrack
  const roadmapFilter = document.getElementById('roadmap-filter');
  if (roadmapFilter) {
    roadmapFilter.value = 'llmTrack';
  }
  // Switch to questions view
  if (typeof switchView === 'function') {
    switchView('questions');
  }
  // Trigger filter action
  triggerFilterAction();

  // If specific module tag, select first question with that tag
  setTimeout(() => {
    const firstMatchIdx = state.filteredQuestions.findIndex(q => (q.tags || []).includes(moduleTag));
    if (firstMatchIdx !== -1) {
      state.currentIndex = firstMatchIdx;
      loadQuestion(firstMatchIdx);
      buildSidebarList();
    }
  }, 50);
}

function updatePracticeProgressUI() {
  const checkboxes = document.querySelectorAll('.llm-practice-checkbox');
  const total = checkboxes.length || 8;
  const completed = Object.values(practiceState).filter(Boolean).length;
  const percent = Math.round((completed / total) * 100);

  const pctLabel = document.getElementById('llm-practice-percent');
  const bar = document.getElementById('llm-practice-bar');
  const countLabel = document.getElementById('llm-practice-count');

  if (pctLabel) pctLabel.textContent = `${percent}%`;
  if (bar) bar.style.width = `${percent}%`;
  if (countLabel) countLabel.textContent = `${completed}/${total} этапов выполнено`;
}

function renderPracticeTasks() {
  document.querySelectorAll('.llm-practice-checkbox').forEach(cb => {
    const taskId = cb.getAttribute('data-task-id');
    cb.checked = !!practiceState[taskId];
    cb.addEventListener('change', () => {
      togglePracticeTask(taskId);
    });
  });
}

// --- ZERO-SERVER INTERACTIVE TOOL CALLING SIMULATOR ---
const SIMULATION_STEPS = [
  {
    step: 1,
    title: "1. Отправка запроса с описаниями Tools",
    actor: "Java Backend -> LLM API",
    desc: "Пользователь отправил: 'Проверь статус сервиса payment и найди тикет TCK-101'. Backend формирует JSON payload с сообщениями и схемами разрешенных инструментов.",
    payload: `{\n  "model": "gpt-4o-mini",\n  "messages": [\n    {"role": "system", "content": "You are a support assistant. Use tools."},\n    {"role": "user", "content": "Проверь статус сервиса payment и тикет TCK-101"}\n  ],\n  "tools": [\n    {"type": "function", "function": {"name": "getServiceStatus", "parameters": {...}}},\n    {"type": "function", "function": {"name": "getDemoTicket", "parameters": {...}}}\n  ]\n}`,
    statusBadge: "HTTP POST",
    badgeClass: "bg-blue-500/10 text-blue-500 border-blue-500/20"
  },
  {
    step: 2,
    title: "2. Модель возвращает намерение Tool Call",
    actor: "LLM API -> Java Backend",
    desc: "Модель не генерирует финальный текст, а останавливается с finish_reason: 'tool_calls', возвращая имя функции и JSON-аргументы.",
    payload: `{\n  "choices": [{\n    "finish_reason": "tool_calls",\n    "message": {\n      "role": "assistant",\n      "tool_calls": [{\n        "id": "call_stat_001",\n        "type": "function",\n        "function": {\n          "name": "getServiceStatus",\n          "arguments": "{\\"serviceName\\":\\"payment\\"}"\n        }\n      }]\n    }\n  }]\n}`,
    statusBadge: "Tool Requested",
    badgeClass: "bg-amber-500/10 text-amber-500 border-amber-500/20"
  },
  {
    step: 3,
    title: "3. Серверная валидация & Проверка прав (RBAC)",
    actor: "Java Backend (ToolRegistry)",
    desc: "Backend проверяет: 1) имя в Allowlist? 2) JSON Schema валидна? 3) Есть ли у текущего пользователя (Alice / Bob) право вызывать этот метод?",
    payload: `// Проверка на стороне Java:\nboolean allowed = toolRegistry.isAllowed("getServiceStatus"); // true\nboolean schemaValid = schemaValidator.validate(argsNode);     // true\nboolean authorized = securityService.canAccess(currentUser);  // Alice: GRANTED, Bob: GRANTED\n\nlog.info("Tool validation PASSED for tool=getServiceStatus");`,
    statusBadge: "Server-Side RBAC Checked",
    badgeClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
  },
  {
    step: 4,
    title: "4. Выполнение локального Java-сервиса",
    actor: "Java Backend Service Execution",
    desc: "Модель не исполняет код. Вызов выполняется строго на вашем сервере через внедренный Spring-бин.",
    payload: `// Исполнение в локальной JVM:\nServiceStatus status = serviceStatusService.getStatus("payment");\n// Результат синтетических данных:\n{\n  "service": "payment",\n  "status": "OPERATIONAL",\n  "latencyMs": 14,\n  "lastIncident": "2026-03-01"\n}`,
    statusBadge: "Executed in JVM",
    badgeClass: "bg-purple-500/10 text-purple-500 border-purple-500/20"
  },
  {
    step: 5,
    title: "5. Возврат результата в контекст (tool_call_id)",
    actor: "Java Backend -> LLM API",
    desc: "Backend отправляет результат вызова модели в сообщении с role: 'tool' и обязательным tool_call_id: 'call_stat_001'.",
    payload: `{\n  "role": "tool",\n  "tool_call_id": "call_stat_001",\n  "content": "{\\"service\\":\\"payment\\",\\"status\\":\\"OPERATIONAL\\",\\"latencyMs\\":14}"\n}`,
    statusBadge: "Context Enriched",
    badgeClass: "bg-blue-500/10 text-blue-500 border-blue-500/20"
  },
  {
    step: 6,
    title: "6. Финальный ответ модели пользователю",
    actor: "LLM API -> Java Backend -> User",
    desc: "Модель синтезирует итоговый связный ответ на основе реальных данных из инструмента.",
    payload: `{\n  "choices": [{\n    "finish_reason": "stop",\n    "message": {\n      "role": "assistant",\n      "content": "Сервис платежей (payment) работает в штатном режиме (OPERATIONAL), текущая задержка составляет 14 мс. Открытых инцидентов не зафиксировано."\n    }\n  }]\n}`,
    statusBadge: "Final Response (200 OK)",
    badgeClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
  }
];

let currentSimStep = 0;
let simInterval = null;

function initToolCallingSimulator() {
  const playBtn = document.getElementById('sim-play-btn');
  const nextBtn = document.getElementById('sim-next-btn');
  const prevBtn = document.getElementById('sim-prev-btn');
  const resetBtn = document.getElementById('sim-reset-btn');
  const userSelect = document.getElementById('sim-user-select');

  if (playBtn) {
    playBtn.addEventListener('click', toggleSimPlay);
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentSimStep < SIMULATION_STEPS.length - 1) {
        currentSimStep++;
        updateSimUI();
      }
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentSimStep > 0) {
        currentSimStep--;
        updateSimUI();
      }
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', resetSimulation);
  }
  if (userSelect) {
    userSelect.addEventListener('change', () => {
      resetSimulation();
      updateSimUI();
    });
  }

  updateSimUI();
}

function toggleSimPlay() {
  const icon = document.getElementById('sim-play-icon');
  const text = document.getElementById('sim-play-text');
  if (simInterval) {
    clearInterval(simInterval);
    simInterval = null;
    if (icon) icon.className = 'fa-solid fa-play text-xs';
    if (text) text.textContent = 'Авто-воспроизведение';
  } else {
    if (icon) icon.className = 'fa-solid fa-pause text-xs';
    if (text) text.textContent = 'Пауза';
    simInterval = setInterval(() => {
      if (currentSimStep < SIMULATION_STEPS.length - 1) {
        currentSimStep++;
        updateSimUI();
      } else {
        clearInterval(simInterval);
        simInterval = null;
        if (icon) icon.className = 'fa-solid fa-play text-xs';
        if (text) text.textContent = 'Авто-воспроизведение';
      }
    }, 2800);
  }
}

function resetSimulation() {
  if (simInterval) {
    clearInterval(simInterval);
    simInterval = null;
    const icon = document.getElementById('sim-play-icon');
    const text = document.getElementById('sim-play-text');
    if (icon) icon.className = 'fa-solid fa-play text-xs';
    if (text) text.textContent = 'Авто-воспроизведение';
  }
  currentSimStep = 0;
  updateSimUI();
}

function updateSimUI() {
  const userSelect = document.getElementById('sim-user-select');
  const isBob = userSelect && userSelect.value === 'bob';

  const s = SIMULATION_STEPS[currentSimStep];
  if (!s) return;

  const counter = document.getElementById('sim-step-counter');
  const title = document.getElementById('sim-step-title');
  const actor = document.getElementById('sim-step-actor');
  const desc = document.getElementById('sim-step-desc');
  const badge = document.getElementById('sim-step-badge');
  const codeEl = document.getElementById('sim-code-preview');

  if (counter) counter.textContent = `Шаг ${s.step} из ${SIMULATION_STEPS.length}`;
  if (title) title.textContent = s.title;
  if (actor) actor.textContent = s.actor;
  if (desc) {
    if (isBob && s.step === 3) {
      desc.textContent = "ВНИМАНИЕ: Пользователь Bob (Trainee) запросил доступ к закрытому тикету. Серверная проверка прав (RBAC) отклоняет вызов! Модель получает отказ в доступе (403 Forbidden).";
    } else {
      desc.textContent = s.desc;
    }
  }

  if (badge) {
    if (isBob && s.step >= 3) {
      badge.textContent = "Access Denied (RBAC Blocked)";
      badge.className = "px-2.5 py-0.5 rounded-[7px] text-[10px] font-bold border uppercase tracking-wider bg-rose-500/10 text-rose-500 border-rose-500/20";
    } else {
      badge.textContent = s.statusBadge;
      badge.className = `px-2.5 py-0.5 rounded-[7px] text-[10px] font-bold border uppercase tracking-wider ${s.badgeClass}`;
    }
  }

  if (codeEl) {
    if (isBob && s.step === 3) {
      codeEl.textContent = `// Серверная проверка прав для пользователя Bob:\nif (!currentUser.hasRole("ROLE_SUPPORT_AGENT")) {\n    log.warn("Access Denied for user={}, action=getDemoTicket", currentUser.getName());\n    return "{\\"error\\": \\"ACCESS_DENIED\\", \\"message\\": \\"Trainees cannot view sensitive tickets\\"}";\n}`;
    } else {
      codeEl.textContent = s.payload;
    }
  }

  // Update step indicator pills
  for (let i = 1; i <= 6; i++) {
    const pill = document.getElementById(`sim-pill-${i}`);
    if (pill) {
      if (i - 1 === currentSimStep) {
        pill.className = 'w-7 h-7 rounded-full bg-roast-500 text-white font-bold text-xs flex items-center justify-center shadow-sm ring-2 ring-roast-500/30';
      } else if (i - 1 < currentSimStep) {
        pill.className = 'w-7 h-7 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center';
      } else {
        pill.className = 'w-7 h-7 rounded-full bg-slate-200 dark:bg-panel-700 text-slate-500 dark:text-slate-400 font-bold text-xs flex items-center justify-center';
      }
    }
  }
}
