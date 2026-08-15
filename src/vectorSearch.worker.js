import { pipeline, env } from '@xenova/transformers';

// Configure transformers.js for browser environment
env.allowLocalModels = false;
env.useBrowserCache = true;

let extractor = null;
let indexData = null; // { ids: string[], vectors: Float32Array[] }
let isInitializing = false;

async function init(baseUrl = './') {
  if (extractor && indexData) return;
  if (isInitializing) return;

  isInitializing = true;
  try {
    self.postMessage({ status: 'loading', message: 'Загрузка векторов семантического поиска...' });

    // 1. Load precomputed vector catalog
    const embeddingsUrl = `${baseUrl.replace(/\/+$/, '')}/embeddings.json`;
    const res = await fetch(embeddingsUrl);
    if (!res.ok) {
      throw new Error(`Failed to load embeddings.json (HTTP ${res.status})`);
    }
    const data = await res.json();
    
    indexData = {
      ids: data.ids,
      vectors: data.vectors.map((v) => new Float32Array(v)),
    };

    self.postMessage({ status: 'loading', message: 'Инициализация AI-модели all-MiniLM-L6-v2...' });

    // 2. Load quantized ONNX feature-extraction pipeline
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      quantized: true,
    });

    self.postMessage({ status: 'ready', count: indexData.ids.length });
  } catch (err) {
    self.postMessage({ status: 'error', error: err.message });
  } finally {
    isInitializing = false;
  }
}

function dotProduct(a, b) {
  let sum = 0.0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

self.onmessage = async (e) => {
  const { type, query, topK = 40, minScore = 0.2, baseUrl = './' } = e.data;

  if (type === 'init') {
    await init(baseUrl);
    return;
  }

  if (type === 'search') {
    if (!extractor || !indexData) {
      await init(baseUrl);
    }

    if (!extractor || !indexData) {
      self.postMessage({ type: 'results', query, results: [], error: 'Engine not ready' });
      return;
    }

    try {
      const startTime = performance.now();

      // Embed query text
      const output = await extractor(query, { pooling: 'mean', normalize: true });
      const queryVector = new Float32Array(output.data);

      // Compute dot products against all precomputed vectors
      const scores = [];
      for (let i = 0; i < indexData.ids.length; i++) {
        const score = dotProduct(queryVector, indexData.vectors[i]);
        if (score >= minScore) {
          scores.push({ id: indexData.ids[i], score });
        }
      }

      // Sort descending by cosine similarity score
      scores.sort((a, b) => b.score - a.score);
      const topResults = scores.slice(0, topK);
      const elapsedMs = performance.now() - startTime;

      self.postMessage({
        type: 'results',
        query,
        results: topResults,
        elapsedMs: Math.round(elapsedMs * 10) / 10,
      });
    } catch (err) {
      self.postMessage({ type: 'results', query, results: [], error: err.message });
    }
  }
};
