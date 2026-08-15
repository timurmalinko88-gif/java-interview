/**
 * Interactive Onboarding & Feature Walkthrough Tour Engine
 * Linear / Stripe Docs aesthetic with dynamic spotlight highlighting.
 */

const TOUR_STORAGE_KEY = 'java_trainer_tour_completed';

export const TOUR_STEPS = [
  {
    target: '#questions-tab-btn',
    title: '🧭 Навигация и Режимы подготовки',
    desc: 'Переключайтесь между базой из 706 вопросов, пошаговыми разборами алгоритмов (LeetCode) и интерактивным холстом System Design.',
    placement: 'bottom',
  },
  {
    target: '#search-input',
    title: '🧠 Векторный семантический поиск (RAG)',
    desc: 'Ищите вопросы не только по точным словам, но и по смыслу на русском или английском (например: «как ускорить тяжелые SQL запросы»).',
    placement: 'bottom',
  },
  {
    target: '#diff-filter-container',
    title: '🎯 Фильтры по грейдам и 18 темам',
    desc: 'Фильтруйте вопросы для Junior, Middle или Senior / Architect, а также выбирайте один из 4 треков развития.',
    placement: 'bottom',
  },
  {
    target: '#btn-feynman',
    title: '👶 Метод Фейнмана (Просто о сложном)',
    desc: 'Нажмите, чтобы получить наглядную жизненную аналогию для сложной концепции Java/JVM и запомнить её навсегда.',
    placement: 'top',
  },
  {
    target: '#btn-ai-interview',
    title: '🤖 AI Examiner (Локальный AI-интервьюер)',
    desc: 'Надиктуйте или напишите ответ своими словами — мгновенный AI-анализатор оценит точность, выделит упущенные концепты и начислит XP!',
    placement: 'top',
  },
  {
    target: '#sr-evaluation-bar',
    title: '📦 Интервальное повторение (Leitner Box)',
    desc: 'Оценивайте сложность вопроса (1, 3 или 7 дней). Умный алгоритм сам составит персональный график повторения забываемого материала.',
    placement: 'top',
  },
];

let currentStepIndex = 0;
let isTourActive = false;

/**
 * Initializes the onboarding system
 */
export function initOnboarding() {
  const guideBtn = document.getElementById('btn-platform-guide');
  const restartTourBtn = document.getElementById('btn-restart-tour');
  const guideModal = document.getElementById('platform-guide-modal');
  const closeGuideBtn = document.getElementById('close-guide-modal-btn');

  if (guideBtn && guideModal) {
    guideBtn.addEventListener('click', () => {
      guideModal.showModal();
    });
  }

  if (closeGuideBtn && guideModal) {
    closeGuideBtn.addEventListener('click', () => {
      guideModal.close();
    });
  }

  if (restartTourBtn) {
    restartTourBtn.addEventListener('click', () => {
      if (guideModal && guideModal.open) guideModal.close();
      startTour();
    });
  }

  // Auto-start for first-time visitors
  const hasCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
  if (!hasCompleted) {
    // Delay start slightly to let DOM render cleanly
    setTimeout(() => {
      startTour();
    }, 800);
  }
}

/**
 * Start the interactive spotlight tour
 */
export function startTour() {
  currentStepIndex = 0;
  isTourActive = true;
  renderTourContainer();
  showStep(0);
}

/**
 * Close and finish the tour
 */
export function finishTour() {
  isTourActive = false;
  localStorage.setItem(TOUR_STORAGE_KEY, 'true');
  const container = document.getElementById('onboarding-tour-container');
  if (container) container.remove();
}

/**
 * Renders the spotlight backdrop and floating card container
 */
function renderTourContainer() {
  let container = document.getElementById('onboarding-tour-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'onboarding-tour-container';
    container.className = 'fixed inset-0 z-[9999] pointer-events-none transition-opacity duration-300';
    container.innerHTML = `
      <!-- Dark backdrop with cutout -->
      <div id="tour-backdrop" class="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] pointer-events-auto transition-all duration-300"></div>
      
      <!-- Spotlight highlight box -->
      <div id="tour-spotlight" class="absolute rounded-[12px] border-2 border-cobalt-core shadow-[0_0_0_9999px_rgba(15,23,42,0.65)] transition-all duration-300 pointer-events-none z-[10000]"></div>

      <!-- Floating Tour Card -->
      <div id="tour-card" class="absolute z-[10001] w-[340px] sm:w-[380px] bg-white dark:bg-panel-900 border border-slate-200 dark:border-slate-800 rounded-[14px] p-5 shadow-2xl pointer-events-auto transition-all duration-300">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center space-x-2">
            <span class="px-2 py-0.5 rounded-[5px] bg-cobalt-core/10 text-cobalt-core text-[11px] font-bold font-mono uppercase tracking-wider" id="tour-step-badge">
              Шаг 1 из ${TOUR_STEPS.length}
            </span>
          </div>
          <button id="tour-skip-btn" class="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors font-medium">
            Пропустить
          </button>
        </div>

        <div class="py-3 space-y-1.5">
          <h4 id="tour-title" class="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight"></h4>
          <p id="tour-desc" class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed"></p>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <!-- Dots -->
          <div id="tour-dots" class="flex items-center space-x-1.5"></div>

          <!-- Buttons -->
          <div class="flex items-center space-x-2">
            <button id="tour-prev-btn" class="px-3 py-1.5 rounded-[8px] border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-panel-800 transition-all">
              Назад
            </button>
            <button id="tour-next-btn" class="px-4 py-1.5 rounded-[8px] bg-ink-900 hover:bg-black dark:bg-cobalt-core dark:hover:bg-cobalt-deep text-white text-xs font-medium shadow-sm transition-all flex items-center space-x-1">
              <span id="tour-next-text">Далее</span>
              <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(container);

    // Event listeners
    document.getElementById('tour-backdrop')?.addEventListener('click', finishTour);
    document.getElementById('tour-skip-btn')?.addEventListener('click', finishTour);
    document.getElementById('tour-prev-btn')?.addEventListener('click', () => {
      if (currentStepIndex > 0) showStep(currentStepIndex - 1);
    });
    document.getElementById('tour-next-btn')?.addEventListener('click', () => {
      if (currentStepIndex < TOUR_STEPS.length - 1) {
        showStep(currentStepIndex + 1);
      } else {
        finishTour();
      }
    });
  }
}

/**
 * Display a specific step of the tour
 */
function showStep(index) {
  if (index < 0 || index >= TOUR_STEPS.length) return;
  currentStepIndex = index;
  const step = TOUR_STEPS[index];

  const targetEl = document.querySelector(step.target);
  const spotlight = document.getElementById('tour-spotlight');
  const card = document.getElementById('tour-card');
  const titleEl = document.getElementById('tour-title');
  const descEl = document.getElementById('tour-desc');
  const badgeEl = document.getElementById('tour-step-badge');
  const prevBtn = document.getElementById('tour-prev-btn');
  const nextText = document.getElementById('tour-next-text');
  const dotsContainer = document.getElementById('tour-dots');

  if (!card || !titleEl || !descEl || !badgeEl) return;

  // Update content
  titleEl.textContent = step.title;
  descEl.textContent = step.desc;
  badgeEl.textContent = `Шаг ${index + 1} из ${TOUR_STEPS.length}`;

  if (prevBtn) {
    if (index === 0) {
      prevBtn.classList.add('invisible');
    } else {
      prevBtn.classList.remove('invisible');
    }
  }

  if (nextText) {
    nextText.textContent = index === TOUR_STEPS.length - 1 ? 'Начать подготовку' : 'Далее';
  }

  // Render dots
  if (dotsContainer) {
    dotsContainer.innerHTML = TOUR_STEPS.map((_, i) => `
      <span class="w-2 h-2 rounded-full transition-all ${i === index ? 'bg-cobalt-core w-4' : 'bg-slate-200 dark:bg-slate-700'}"></span>
    `).join('');
  }

  // Position spotlight and card
  if (targetEl && spotlight) {
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      const rect = targetEl.getBoundingClientRect();
      const padding = 8;
      
      spotlight.style.top = `${rect.top - padding + window.scrollY}px`;
      spotlight.style.left = `${rect.left - padding + window.scrollX}px`;
      spotlight.style.width = `${rect.width + padding * 2}px`;
      spotlight.style.height = `${rect.height + padding * 2}px`;

      // Position floating card
      const cardWidth = card.offsetWidth || 360;
      const cardHeight = card.offsetHeight || 200;
      
      let cardTop = rect.bottom + padding + 16 + window.scrollY;
      let cardLeft = rect.left + (rect.width / 2) - (cardWidth / 2) + window.scrollX;

      // Keep inside viewport horizontally
      if (cardLeft < 16) cardLeft = 16;
      if (cardLeft + cardWidth > window.innerWidth - 16) {
        cardLeft = window.innerWidth - cardWidth - 16;
      }

      // If bottom placement overflows viewport, flip to top
      if (rect.bottom + cardHeight + 40 > window.innerHeight && rect.top - cardHeight - 20 > 0) {
        cardTop = rect.top - cardHeight - 16 + window.scrollY;
      }

      card.style.top = `${cardTop}px`;
      card.style.left = `${cardLeft}px`;
    }, 150);
  }
}
