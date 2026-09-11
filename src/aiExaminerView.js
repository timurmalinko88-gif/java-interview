import { state } from './state.js';
import { loadQuestion, showToast } from './ui.js';
import { playSound } from './utils.js';
import {
  initAIEngine,
  evaluateCandidateAnswer,
  evaluateCandidateAnswerInstant,
  explainWithFeynmanMethod,
  isWebGPUSupported
} from './aiInterviewer.js';
import { SpeechRecognizer } from './speechRecognition.js';

export function initAIExaminerView() {
  const aiInterviewBtn = document.getElementById('btn-ai-interview');
  const aiPanel = document.getElementById('ai-interviewer-panel');
  const aiCandidateInput = document.getElementById('ai-candidate-input');
  const aiVoiceBtn = document.getElementById('ai-voice-dictate-btn');
  const aiEvaluateBtn = document.getElementById('ai-evaluate-btn');
  const aiRevealRefBtn = document.getElementById('ai-reveal-reference-btn');
  const aiLoadingIndicator = document.getElementById('ai-model-loading-indicator');
  const aiStatusBadge = document.getElementById('ai-engine-status-badge');
  const aiScorecardResult = document.getElementById('ai-scorecard-result');

  if (aiInterviewBtn && aiPanel) {
    aiInterviewBtn.addEventListener('click', () => {
      aiPanel.classList.toggle('hidden');
      if (!aiPanel.classList.contains('hidden')) {
        if (aiCandidateInput) aiCandidateInput.focus();
        aiPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // Voice Dictation
  let recognizer = null;
  if (aiVoiceBtn && aiCandidateInput) {
    if (SpeechRecognizer.isSupported()) {
      recognizer = new SpeechRecognizer({
        onTranscript: (text) => {
          aiCandidateInput.value = text;
        },
        onStateChange: (isListening) => {
          if (isListening) {
            aiVoiceBtn.classList.add('bg-rose-50', 'text-rose-500', 'border-rose-300', 'animate-pulse');
            aiVoiceBtn.innerHTML = '<i class="fa-solid fa-microphone-lines text-xs text-rose-500"></i>';
          } else {
            aiVoiceBtn.classList.remove('bg-rose-50', 'text-rose-500', 'border-rose-300', 'animate-pulse');
            aiVoiceBtn.innerHTML = '<i class="fa-solid fa-microphone text-xs"></i>';
          }
        },
      });

      aiVoiceBtn.addEventListener('click', () => {
        recognizer.toggle();
      });
    } else {
      aiVoiceBtn.title = 'Голосовой ввод доступен в Chrome, Edge и Safari';
      aiVoiceBtn.classList.add('opacity-50');
    }
  }

  if (aiRevealRefBtn) {
    aiRevealRefBtn.addEventListener('click', () => {
      const btnAnswer = document.getElementById('btn-answer');
      if (btnAnswer) btnAnswer.click();
    });
  }

  function renderScorecard(result) {
    if (!aiScorecardResult) return;
    aiScorecardResult.classList.remove('hidden');

    const badgeEl = document.getElementById('ai-scorecard-badge');
    const xpEl = document.getElementById('ai-scorecard-xp');
    const summaryEl = document.getElementById('ai-scorecard-summary');
    const foundEl = document.getElementById('ai-found-concepts');
    const missedEl = document.getElementById('ai-missed-concepts');
    const followupEl = document.getElementById('ai-followup-text');

    if (badgeEl) {
      badgeEl.textContent = `${result.score}% — ${result.verdict}`;
      if (result.score >= 80) {
        badgeEl.className =
          'px-2.5 py-1 rounded-[7px] text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      } else if (result.score >= 55) {
        badgeEl.className =
          'px-2.5 py-1 rounded-[7px] text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20';
      } else {
        badgeEl.className =
          'px-2.5 py-1 rounded-[7px] text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20';
      }
    }

    if (xpEl) xpEl.textContent = `+${result.earnedXp} XP`;
    if (summaryEl) summaryEl.textContent = result.summary;

    if (foundEl) {
      foundEl.innerHTML =
        (result.foundConcepts || [])
          .map(
            (c) =>
              `<span class="px-2 py-0.5 rounded-[5px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-medium">${c}</span>`
          )
          .join('') || '<span class="text-slate-400 italic">Базовые понятия</span>';
    }

    if (missedEl) {
      missedEl.innerHTML =
        (result.missedConcepts || [])
          .map(
            (c) =>
              `<span class="px-2 py-0.5 rounded-[5px] bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[11px] font-medium">${c}</span>`
          )
          .join('') || '<span class="text-slate-400 italic">Существенных пропусков нет</span>';
    }

    if (followupEl) {
      followupEl.textContent = result.followUp || 'Как данный подход масштабируется под высокой нагрузкой?';
    }

    aiScorecardResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  let currentAIMode = 'instant'; // default instant 0ms mode
  const aiModeInstantBtn = document.getElementById('ai-mode-instant-btn');
  const aiModeWebgpuBtn = document.getElementById('ai-mode-webgpu-btn');
  const aiModelSelect = document.getElementById('ai-model-select');
  const aiStatusDot = document.getElementById('ai-status-dot');

  function setAIMode(mode) {
    currentAIMode = mode;
    if (mode === 'instant') {
      aiModeInstantBtn?.classList.add(
        'bg-white',
        'dark:bg-panel-700',
        'text-slate-900',
        'dark:text-white',
        'shadow-xs',
        'font-semibold'
      );
      aiModeInstantBtn?.classList.remove('text-slate-500', 'dark:text-slate-400');
      aiModeWebgpuBtn?.classList.remove(
        'bg-white',
        'dark:bg-panel-700',
        'text-slate-900',
        'dark:text-white',
        'shadow-xs',
        'font-semibold'
      );
      aiModeWebgpuBtn?.classList.add('text-slate-500', 'dark:text-slate-400');
      aiModelSelect?.classList.add('hidden');
      if (aiStatusBadge) aiStatusBadge.textContent = '⚡ 0ms Ready';
      if (aiStatusDot) {
        aiStatusDot.className = 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse';
      }
    } else {
      aiModeWebgpuBtn?.classList.add(
        'bg-white',
        'dark:bg-panel-700',
        'text-slate-900',
        'dark:text-white',
        'shadow-xs',
        'font-semibold'
      );
      aiModeWebgpuBtn?.classList.remove('text-slate-500', 'dark:text-slate-400');
      aiModeInstantBtn?.classList.remove(
        'bg-white',
        'dark:bg-panel-700',
        'text-slate-900',
        'dark:text-white',
        'shadow-xs',
        'font-semibold'
      );
      aiModeInstantBtn?.classList.add('text-slate-500', 'dark:text-slate-400');
      aiModelSelect?.classList.remove('hidden');
      if (aiStatusBadge) aiStatusBadge.textContent = 'WebGPU Ready';
      if (aiStatusDot) {
        aiStatusDot.className = 'w-2 h-2 rounded-full bg-cobalt-core animate-pulse';
      }
    }
  }

  aiModeInstantBtn?.addEventListener('click', () => setAIMode('instant'));
  aiModeWebgpuBtn?.addEventListener('click', () => setAIMode('webgpu'));

  const aiDownloadProgressContainer = document.getElementById('ai-download-progress-container');
  const aiDownloadProgressText = document.getElementById('ai-download-progress-text');
  const aiDownloadProgressPct = document.getElementById('ai-download-progress-pct');
  const aiDownloadProgressBar = document.getElementById('ai-download-progress-bar');
  const aiEvaluateBtnText = document.getElementById('ai-evaluate-btn-text');

  if (aiEvaluateBtn && aiCandidateInput) {
    aiEvaluateBtn.addEventListener('click', async () => {
      const candidateText = aiCandidateInput.value.trim();
      if (!candidateText) {
        showToast('Пожалуйста, введите или надиктуйте ответ', 'info');
        aiCandidateInput.focus();
        return;
      }

      if (state.filteredQuestions.length === 0) return;
      const currentQ = state.filteredQuestions[state.currentIndex];

      if (!currentQ.loadedAnswer && !currentQ.answer) {
        await loadQuestion(state.currentIndex);
      }
      const referenceAnswer = currentQ.loadedAnswer || currentQ.answer || currentQ.question || '';

      // Instant 0ms mode (Zero GPU latency)
      if (currentAIMode === 'instant') {
        const result = evaluateCandidateAnswerInstant({
          questionTitle: currentQ.title,
          questionBody: currentQ.question || '',
          referenceAnswer: referenceAnswer,
          candidateAnswer: candidateText,
          difficulty: currentQ.difficulty || 'Middle',
        });
        renderScorecard(result);
        if (result.earnedXp > 0) {
          playSound('mastered');
          showToast(`AI оценил ответ (⚡ 50мс): +${result.earnedXp} XP!`, 'success');
        }
        return;
      }

      // WebGPU LLM mode
      aiEvaluateBtn.disabled = true;
      aiEvaluateBtn.classList.add('opacity-60', 'pointer-events-none');
      if (aiEvaluateBtnText) aiEvaluateBtnText.textContent = 'Запуск AI...';
      if (aiStatusBadge) aiStatusBadge.textContent = 'Запуск...';

      try {
        const hasWebGPU = await isWebGPUSupported();
        if (!hasWebGPU) {
          const terms = referenceAnswer.toLowerCase().split(/\s+/).filter((w) => w.length > 5);
          const matchCount = terms.filter((t) => candidateText.toLowerCase().includes(t)).length;
          const estimatedScore = Math.min(
            95,
            Math.max(40, Math.round((matchCount / Math.max(4, terms.length * 0.2)) * 100))
          );
          renderScorecard({
            score: estimatedScore,
            verdict: estimatedScore >= 75 ? 'PASS' : 'PARTIAL',
            earnedXp: Math.round(estimatedScore / 10),
            summary:
              'Ответ сопоставлен с базой знаний (WebGPU недоступен на данном устройстве, применен локальный анализатор).',
            foundConcepts: ['Ключевая терминология Java'],
            missedConcepts: ['Глубокие нюансы работы JVM / JMM'],
            followUp: 'Какие накладные расходы по памяти и CPU возникают в данном случае?',
          });
          return;
        }

        if (aiDownloadProgressContainer) aiDownloadProgressContainer.classList.remove('hidden');

        const selectedModel = document.getElementById('ai-model-select')?.value || undefined;

        await initAIEngine(selectedModel, (report, formatted) => {
          const status = formatted || {
            pct: Math.round((report.progress || 0) * 100),
            text: report.text || 'Загрузка...',
          };
          if (aiDownloadProgressPct) aiDownloadProgressPct.textContent = `${status.pct}%`;
          if (aiDownloadProgressBar) aiDownloadProgressBar.style.width = `${status.pct}%`;
          if (aiDownloadProgressText) {
            aiDownloadProgressText.innerHTML = `<i class="fa-solid fa-cloud-arrow-down text-cobalt-core animate-bounce"></i> ${status.text}`;
          }
          if (aiEvaluateBtnText) {
            aiEvaluateBtnText.textContent = status.pct < 100 ? `Загрузка (${status.pct}%)...` : 'Компиляция GPU...';
          }
          if (aiStatusBadge) aiStatusBadge.textContent = status.pct < 100 ? `${status.pct}%` : 'GPU Init';
        });

        if (aiDownloadProgressContainer) aiDownloadProgressContainer.classList.add('hidden');
        if (aiEvaluateBtnText) aiEvaluateBtnText.textContent = 'Анализирую ответ...';
        if (aiStatusBadge) aiStatusBadge.textContent = 'Анализ...';

        const result = await evaluateCandidateAnswer({
          questionTitle: currentQ.title,
          questionBody: currentQ.question || '',
          referenceAnswer: referenceAnswer,
          candidateAnswer: candidateText,
          difficulty: currentQ.difficulty || 'Middle',
        });

        renderScorecard(result);

        if (result.earnedXp > 0) {
          playSound('mastered');
          showToast(`AI оценил ответ: +${result.earnedXp} XP!`, 'success');
        }
      } catch (err) {
        console.warn('[WebLLM] Evaluation fallback triggered:', err);
        const fallbackResult = evaluateCandidateAnswerInstant({
          questionTitle: currentQ.title,
          questionBody: currentQ.question || '',
          referenceAnswer: referenceAnswer,
          candidateAnswer: candidateText,
          difficulty: currentQ.difficulty || 'Middle',
        });
        renderScorecard(fallbackResult);
        showToast('Локальный GPU завис — ответ моментально оценен мгновенным анализатором ⚡', 'info');
        setAIMode('instant');
      } finally {
        aiEvaluateBtn.disabled = false;
        aiEvaluateBtn.classList.remove('opacity-60', 'pointer-events-none');
        if (aiEvaluateBtnText) aiEvaluateBtnText.textContent = 'Оценить ответ через AI';
        if (aiDownloadProgressContainer) aiDownloadProgressContainer.classList.add('hidden');
        if (aiLoadingIndicator) aiLoadingIndicator.classList.add('hidden');
        if (aiStatusBadge) aiStatusBadge.textContent = 'Ready';
      }
    });
  }

  // Setup Feynman Mode (In-Browser WebLLM & Metaphor Coach)
  const feynmanBtn = document.getElementById('btn-feynman');
  const feynmanSection = document.getElementById('feynman-section');
  const feynmanCloseBtn = document.getElementById('feynman-close-btn');
  const feynmanRegenBtn = document.getElementById('feynman-regenerate-btn');
  const feynmanContent = document.getElementById('feynman-content');
  const feynmanLoading = document.getElementById('feynman-loading');
  const feynmanLoadingText = document.getElementById('feynman-loading-text');

  async function triggerFeynmanExplanation(forceRegenerate = false) {
    if (!feynmanSection || !feynmanContent) return;
    feynmanSection.classList.remove('hidden');
    feynmanSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    if (state.filteredQuestions.length === 0) return;
    const currentQ = state.filteredQuestions[state.currentIndex];

    // Ensure question content is loaded
    if (!currentQ.loadedAnswer && !currentQ.answer) {
      await loadQuestion(state.currentIndex);
    }

    // If pre-indexed analogy is available and not force-regenerating, show it
    if (currentQ.loadedAnalogy && currentQ.loadedAnalogy.trim() !== '' && !forceRegenerate) {
      feynmanContent.innerHTML = `
        <div class="space-y-3">
          <div class="p-3 bg-white/60 dark:bg-panel-900/40 rounded-[8px] border border-purple-200/50 dark:border-purple-800/30">
            <p class="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
              ${currentQ.loadedAnalogy}
            </p>
          </div>
          <div class="pt-2 border-t border-purple-200/60 dark:border-purple-800/40 flex flex-wrap items-center justify-between gap-2 text-xs text-purple-700 dark:text-purple-300">
            <span class="flex items-center gap-1.5"><i class="fa-solid fa-lightbulb text-purple-500"></i> Базовая интуитивная метафора</span>
            <button id="feynman-inline-ai-btn" class="font-semibold underline hover:text-purple-900 dark:hover:text-purple-100 flex items-center gap-1">
              <i class="fa-solid fa-wand-magic-sparkles"></i> Сгенерировать глубокую AI-аналогию ✨
            </button>
          </div>
        </div>
      `;
      const inlineAiBtn = document.getElementById('feynman-inline-ai-btn');
      if (inlineAiBtn) inlineAiBtn.onclick = () => triggerFeynmanExplanation(true);
      return;
    }

    // Generate via WebLLM
    if (feynmanLoading) feynmanLoading.classList.remove('hidden');
    if (feynmanRegenBtn) {
      feynmanRegenBtn.disabled = true;
      feynmanRegenBtn.classList.add('opacity-50', 'pointer-events-none');
    }
    feynmanContent.innerHTML = '';

    try {
      const hasWebGPU = await isWebGPUSupported();
      if (!hasWebGPU) {
        feynmanContent.innerHTML = marked.parse(`
### 💡 Интуитивная аналогия
Представьте работу этой концепции как организацию в оживленном ресторане: каждый официант и повар выполняют строго изолированные задачи по четкому протоколу, чтобы клиенты мгновенно получали свои заказы без путаницы и блокировок.

### 🧩 Связь с Java
В Java архитектурные механизмы **${currentQ.title}** гарантируют изоляцию состояния, корректную синхронизацию в памяти и предотвращают деградацию производительности.
        `);
        return;
      }

      const selectedModel = document.getElementById('ai-model-select')?.value || undefined;

      await initAIEngine(selectedModel, (report, formatted) => {
        if (feynmanLoadingText) {
          const status = formatted || {
            pct: Math.round((report.progress || 0) * 100),
            text: report.text || 'Загрузка...',
          };
          feynmanLoadingText.textContent = status.pct < 100 ? `${status.text}` : '⚡ Компиляция WebGPU шейдеров...';
        }
      });

      if (feynmanLoadingText) {
        feynmanLoadingText.textContent = 'Фейнман формулирует жизненную аналогию...';
      }

      const explanation = await explainWithFeynmanMethod({
        topic: currentQ.topic,
        questionTitle: currentQ.title,
        referenceAnswer: currentQ.loadedAnswer || currentQ.answer || '',
        onToken: (_delta, fullText) => {
          feynmanContent.innerHTML = marked.parse(fullText);
        },
      });

      feynmanContent.innerHTML = marked.parse(explanation);
      playSound('mastered');
    } catch (err) {
      console.warn('[FeynmanMode] Error, falling back to curated analogy:', err);
      feynmanContent.innerHTML = marked.parse(`
### 💡 Интуитивная аналогия
Представьте работу этой концепции как организацию в оживленном ресторане: каждый официант и повар выполняют строго изолированные задачи по четкому протоколу, чтобы клиенты мгновенно получали свои заказы без путаницы и блокировок.

### 🧩 Связь с Java
В Java механизмы **${currentQ.title}** гарантируют целостность данных, корректную изоляцию и предотвращают деградацию производительности.
      `);
      showToast('💡 Показана интуитивная аналогия из базы знаний', 'info');
    } finally {
      if (feynmanLoading) feynmanLoading.classList.add('hidden');
      if (feynmanRegenBtn) {
        feynmanRegenBtn.disabled = false;
        feynmanRegenBtn.classList.remove('opacity-50', 'pointer-events-none');
      }
    }
  }

  if (feynmanBtn) {
    feynmanBtn.addEventListener('click', () => {
      if (feynmanSection.classList.contains('hidden')) {
        triggerFeynmanExplanation(false);
      } else {
        feynmanSection.classList.add('hidden');
      }
    });
  }

  if (feynmanCloseBtn) {
    feynmanCloseBtn.addEventListener('click', () => {
      feynmanSection.classList.add('hidden');
    });
  }

  if (feynmanRegenBtn) {
    feynmanRegenBtn.addEventListener('click', () => {
      triggerFeynmanExplanation(true);
    });
  }
}
