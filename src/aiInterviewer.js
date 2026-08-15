/**
 * In-Browser WebLLM AI Technical Interviewer
 * Powered by @mlc-ai/web-llm & WebGPU
 */
import { CreateWebWorkerMLCEngine } from '@mlc-ai/web-llm';

export const AVAILABLE_MODELS = [
  { id: 'Qwen2.5-Coder-0.5B-Instruct-q4f16_1-MLC', name: '⚡ Ultra-Fast Coder 0.5B (~350MB, мгновенно)' },
  { id: 'SmolLM2-360M-Instruct-q4f16_1-MLC', name: '🚀 Ultra-Light 360M (~190MB)' },
  { id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC', name: '🌟 Balanced Llama 1B (~600MB)' },
  { id: 'Qwen2.5-Coder-1.5B-Instruct-q4f16_1-MLC', name: '🧠 Deep Coder 1.5B (~830MB)' },
];

export const DEFAULT_MODEL = 'Qwen2.5-Coder-0.5B-Instruct-q4f16_1-MLC';
export const FALLBACK_MODEL = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';

let engine = null;
let currentModelId = DEFAULT_MODEL;
let isInitializing = false;
let initPromise = null;
const progressListeners = new Set();
let activeGenerationPromise = Promise.resolve();

/**
 * Sequential task queue to prevent concurrent generation race conditions in Web Worker
 */
export function queueLLMTask(taskFn) {
  const next = activeGenerationPromise.then(taskFn, taskFn);
  activeGenerationPromise = next.catch(() => {});
  return next;
}

/**
 * Format raw WebLLM progress reports into user-friendly Russian status messages
 */
export function formatProgressReport(report) {
  if (!report) return { pct: 0, text: 'Инициализация...' };
  const rawText = report.text || '';
  const pct = Math.min(100, Math.max(0, Math.round((report.progress || 0) * 100)));

  let friendlyText = 'Загрузка AI-модели...';
  if (rawText.toLowerCase().includes('from cache')) {
    friendlyText = `Чтение весов из кэша (${pct}%)...`;
  } else if (rawText.toLowerCase().includes('fetch') || rawText.toLowerCase().includes('download')) {
    friendlyText = `Скачивание весов модели (${pct}%)...`;
  } else if (rawText.toLowerCase().includes('compil') || rawText.toLowerCase().includes('shader')) {
    friendlyText = '⚡ Компиляция WebGPU шейдеров...';
  } else if (pct === 100 || rawText.toLowerCase().includes('finish')) {
    friendlyText = '⚡ Финальная инициализация GPU...';
  } else if (rawText) {
    friendlyText = rawText;
  }

  return { pct, text: friendlyText };
}

/**
 * Register a listener for model download progress
 */
export function onModelDownloadProgress(callback) {
  progressListeners.add(callback);
  return () => progressListeners.delete(callback);
}

/**
 * Check if WebGPU is available and working on the current device
 */
export async function isWebGPUSupported() {
  if (typeof navigator === 'undefined' || !navigator.gpu) {
    return false;
  }
  try {
    const adapter = await navigator.gpu.requestAdapter();
    return !!adapter;
  } catch (err) {
    console.warn('[WebLLM] WebGPU adapter check failed:', err);
    return false;
  }
}

/**
 * Initialize WebLLM engine with weight download progress tracking (0-100%)
 */
export async function initAIEngine(modelId = currentModelId, onProgress = null) {
  if (onProgress) progressListeners.add(onProgress);
  if (engine && currentModelId === modelId) return engine;
  if (initPromise) {
    return initPromise;
  }

  const supported = await isWebGPUSupported();
  if (!supported) {
    throw new Error('WebGPU is not supported in this browser or GPU.');
  }

  currentModelId = modelId;
  isInitializing = true;
  initPromise = (async () => {
    try {
      const worker = new Worker(new URL('./aiInterviewer.worker.js', import.meta.url), {
        type: 'module',
      });

      engine = await CreateWebWorkerMLCEngine(worker, modelId, {
        initProgressCallback: (report) => {
          const formatted = formatProgressReport(report);
          for (const listener of progressListeners) {
            try { listener(report, formatted); } catch (e) { console.error(e); }
          }
        },
      });

      return engine;
    } catch (err) {
      console.warn(`[WebLLM] Failed with model ${modelId}, trying fallback...`, err);
      if (modelId !== FALLBACK_MODEL) {
        return initAIEngine(FALLBACK_MODEL, onProgress);
      }
      throw err;
    } finally {
      isInitializing = false;
      initPromise = null;
    }
  })();

  return initPromise;
}

/**
 * Evaluate candidate's answer against technical ground truth reference
 */
export async function evaluateCandidateAnswer({
  questionTitle,
  questionBody = '',
  referenceAnswer,
  candidateAnswer,
  difficulty = 'Middle',
  onToken = null,
}) {
  if (!engine) {
    throw new Error('AI Interviewer engine is not initialized. Please load the model first.');
  }

  return queueLLMTask(async () => {
    const isGibberish = !candidateAnswer || candidateAnswer.trim().length < 3 || /^[\s\d\W]+$/.test(candidateAnswer);

    const systemPrompt = `You are a Principal Java Technical Interviewer.
Your role is to strictly and objectively evaluate the Candidate's Answer against the Ground Truth Reference Answer.

EVALUATION CRITERIA:
1. Technical Correctness (0-100%): Are facts accurate according to the reference? If candidate answer is nonsense/gibberish, unrelated words, or empty, give score 0-10 and verdict "REVISE".
2. Found Concepts: Key terms, APIs, or mechanisms explicitly mentioned correctly.
3. Missed Concepts: Crucial mechanisms, caveats, or trade-offs omitted by candidate.
4. Nuances: Did the candidate mention memory layout, thread safety, or performance trade-offs?
5. Follow-up Probe: Formulate 1 sharp, realistic follow-up technical interview question.

OUTPUT FORMAT:
You MUST output ONLY a valid JSON object. Do not wrap in markdown quotes if possible.
JSON Schema:
{
  "score": <number 0-100>,
  "verdict": "<STRONG_PASS | PASS | PARTIAL | REVISE>",
  "earnedXp": <number 0-10>,
  "summary": "<1-2 sentence overall summary in Russian>",
  "foundConcepts": ["<concept 1>", "<concept 2>"],
  "missedConcepts": ["<concept 1>", "<concept 2>"],
  "followUp": "<1 technical follow-up question in Russian>"
}`;

    const userPrompt = `### QUESTION (${difficulty}):
${questionTitle}
${questionBody ? questionBody.slice(0, 500) : ''}

### GROUND TRUTH REFERENCE ANSWER:
${referenceAnswer.slice(0, 1500)}

### CANDIDATE'S ANSWER:
${candidateAnswer}

Evaluate now and output JSON:`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const response = await engine.chat.completions.create({
      messages,
      temperature: 0.1,
      max_tokens: 500,
      stream: true,
    });

    let fullResponse = '';
    for await (const chunk of response) {
      const delta = chunk.choices[0]?.delta?.content || '';
      fullResponse += delta;
      if (onToken) onToken(delta, fullResponse);
    }

    // Robust JSON extraction
    try {
      const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          score: Math.min(100, Math.max(0, parseInt(parsed.score, 10) || (isGibberish ? 10 : 70))),
          verdict: parsed.verdict || (isGibberish ? 'REVISE' : (parsed.score >= 80 ? 'PASS' : 'PARTIAL')),
          earnedXp: Math.min(10, Math.max(0, parseInt(parsed.earnedXp, 10) || (isGibberish ? 0 : 7))),
          summary: parsed.summary || (isGibberish ? 'Ответ не содержит технической информации по вопросу.' : 'Ответ проанализирован.'),
          foundConcepts: Array.isArray(parsed.foundConcepts) ? parsed.foundConcepts : [],
          missedConcepts: Array.isArray(parsed.missedConcepts) ? parsed.missedConcepts : [],
          followUp: parsed.followUp || 'Можете подробнее раскрыть нюансы многопоточности?',
        };
      }
    } catch (err) {
      console.warn('[WebLLM] JSON parse error, generating structured fallback:', err);
    }

    return {
      score: isGibberish ? 10 : 75,
      verdict: isGibberish ? 'REVISE' : 'PASS',
      earnedXp: isGibberish ? 0 : 8,
      summary: fullResponse.slice(0, 200) || (isGibberish ? 'Ответ не относится к теме вопроса.' : 'Ответ обработан.'),
      foundConcepts: isGibberish ? [] : ['Ключевые принципы Java'],
      missedConcepts: [],
      followUp: 'Как это поведение меняется под высокой конкурентной нагрузкой?',
    };
  });
}

/**
 * Explain a complex technical concept using Richard Feynman's method (simple life analogies)
 */
export async function explainWithFeynmanMethod({
  topic,
  questionTitle,
  referenceAnswer = '',
  onToken = null,
}) {
  if (!engine) {
    throw new Error('AI Engine is not initialized. Please load the model first.');
  }

  return queueLLMTask(async () => {
    const systemPrompt = `You are Richard Feynman, the legendary Nobel laureate physicist and teacher.
Your superpower is taking ultra-complex, intimidating technical computer science abstractions (JVM memory layout, concurrency locks, volatile, virtual threads, distributed consensus, Kafka partition rebalance, B-Tree indexes) and explaining them with simple, vivid, intuitive real-world metaphors that anyone can grasp.

GUIDELINES:
1. 💡 **Жизненная метафора** (A vivid real-world metaphor: restaurant, kitchen, library, airport, traffic, postal office, etc.).
2. 🧩 **Как это работает в Java** (Direct connection to the technical mechanism, JVM memory, or code).
3. 🎯 **Золотое правило в 1 предложении** (One-sentence memorable rule).
4. Tone: Enthusiastic, brilliant, simple, friendly.
5. Format: Markdown with emojis in Russian.`;

    const userPrompt = `### ТЕМА: ${topic}
### ВОПРОС: ${questionTitle}
${referenceAnswer ? `### КОНТЕКСТ:\n${referenceAnswer.slice(0, 800)}` : ''}

Объясни эту тему методом Фейнмана:`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const response = await engine.chat.completions.create({
      messages,
      temperature: 0.6,
      max_tokens: 650,
      stream: true,
    });

    let fullResponse = '';
    for await (const chunk of response) {
      const delta = chunk.choices[0]?.delta?.content || '';
      fullResponse += delta;
      if (onToken) onToken(delta, fullResponse);
    }

    return fullResponse;
  });
}
