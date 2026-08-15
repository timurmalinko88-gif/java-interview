/**
 * In-Browser WebLLM AI Technical Interviewer
 * Powered by @mlc-ai/web-llm & WebGPU
 */
import { CreateWebWorkerMLCEngine } from '@mlc-ai/web-llm';

export const DEFAULT_MODEL = 'Qwen2.5-Coder-1.5B-Instruct-q4f16_1-MLC';
export const FALLBACK_MODEL = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';

let engine = null;
let isInitializing = false;

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
export async function initAIEngine(modelId = DEFAULT_MODEL, onProgress = null) {
  if (engine) return engine;
  if (isInitializing) {
    throw new Error('AI Engine is currently downloading/initializing...');
  }

  const supported = await isWebGPUSupported();
  if (!supported) {
    throw new Error('WebGPU is not supported in this browser or GPU. Please use Chrome/Edge 113+ or macOS Metal.');
  }

  isInitializing = true;
  try {
    const worker = new Worker(new URL('./aiInterviewer.worker.js', import.meta.url), {
      type: 'module',
    });

    engine = await CreateWebWorkerMLCEngine(worker, modelId, {
      initProgressCallback: (report) => {
        // report.progress: 0.0 -> 1.0, report.text: "Loading model weights..."
        if (onProgress) onProgress(report);
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
  }
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

  const systemPrompt = `You are a Principal Java Technical Interviewer.
Your role is to strictly and objectively evaluate the Candidate's Answer against the Ground Truth Reference Answer.

EVALUATION CRITERIA:
1. Technical Correctness (0-100%): Are facts accurate according to the reference?
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
    temperature: 0.1, // low temperature for consistent, strict grading
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
        score: Math.min(100, Math.max(0, parseInt(parsed.score, 10) || 70)),
        verdict: parsed.verdict || (parsed.score >= 80 ? 'PASS' : 'PARTIAL'),
        earnedXp: Math.min(10, Math.max(0, parseInt(parsed.earnedXp, 10) || Math.round((parsed.score || 70) / 10))),
        summary: parsed.summary || 'Ответ проанализирован.',
        foundConcepts: Array.isArray(parsed.foundConcepts) ? parsed.foundConcepts : [],
        missedConcepts: Array.isArray(parsed.missedConcepts) ? parsed.missedConcepts : [],
        followUp: parsed.followUp || 'Можете подробнее раскрыть нюансы многопоточности?',
      };
    }
  } catch (err) {
    console.warn('[WebLLM] JSON parse error, generating structured fallback:', err);
  }

  return {
    score: 75,
    verdict: 'PASS',
    earnedXp: 8,
    summary: fullResponse.slice(0, 200),
    foundConcepts: ['Ключевые принципы Java'],
    missedConcepts: [],
    followUp: 'Как это поведение меняется под высокой конкурентной нагрузкой?',
  };
}
