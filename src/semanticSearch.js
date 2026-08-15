/**
 * Client-Side Semantic Vector Search Engine
 * Powered by @xenova/transformers (all-MiniLM-L6-v2) & Web Worker
 */

class SemanticSearchEngine {
  constructor() {
    this.worker = null;
    this.isReady = false;
    this.isLoading = false;
    this.error = null;
    this.callbacks = new Map();
    this.statusListeners = new Set();
    this.cache = new Map();

    this.initWorker();
  }

  initWorker() {
    try {
      this.worker = new Worker(new URL('./vectorSearch.worker.js', import.meta.url), {
        type: 'module',
      });

      this.worker.onmessage = (e) => {
        const data = e.data;
        if (data.status === 'ready') {
          this.isReady = true;
          this.isLoading = false;
          this.notifyStatus('ready', `Готово (${data.count} вопросов)`);
        } else if (data.status === 'loading') {
          this.isLoading = true;
          this.notifyStatus('loading', data.message);
        } else if (data.status === 'error') {
          this.error = data.error;
          this.isLoading = false;
          this.notifyStatus('error', data.error);
        } else if (data.type === 'results') {
          const cb = this.callbacks.get(data.query);
          if (cb) {
            this.callbacks.delete(data.query);
            this.cache.set(data.query, data.results);
            cb(data.results || [], data.elapsedMs || 0);
          }
        }
      };

      this.worker.onerror = (err) => {
        console.warn('[SemanticSearch] Worker error:', err);
        this.error = err.message;
        this.notifyStatus('error', err.message);
      };

      const baseUrl = import.meta.env?.BASE_URL || './';
      this.worker.postMessage({ type: 'init', baseUrl });
    } catch (err) {
      console.warn('[SemanticSearch] Could not start worker:', err);
      this.error = err.message;
    }
  }

  onStatusChange(fn) {
    this.statusListeners.add(fn);
    if (this.isReady) fn('ready', 'Семантический AI-поиск активен ✨');
    else if (this.isLoading) fn('loading', 'Загрузка векторов...');
    else if (this.error) fn('error', this.error);
    return () => this.statusListeners.delete(fn);
  }

  notifyStatus(status, message) {
    this.statusListeners.forEach((fn) => fn(status, message));
  }

  /**
   * Search for questions semantically matching the query.
   * @param {string} query 
   * @param {number} topK 
   * @returns {Promise<Array<{id: string, score: number}>>}
   */
  search(query, topK = 40) {
    const trimmed = (query || '').trim();
    if (!trimmed) return Promise.resolve([]);

    if (this.cache.has(trimmed)) {
      return Promise.resolve(this.cache.get(trimmed));
    }

    if (!this.worker || !this.isReady) {
      return Promise.resolve(null); // Fallback to classic keyword search
    }

    return new Promise((resolve) => {
      // Timeout fallback after 3s
      const timer = setTimeout(() => {
        if (this.callbacks.has(trimmed)) {
          this.callbacks.delete(trimmed);
          resolve(null);
        }
      }, 3000);

      this.callbacks.set(trimmed, (results) => {
        clearTimeout(timer);
        resolve(results);
      });

      const baseUrl = import.meta.env?.BASE_URL || './';
      this.worker.postMessage({ type: 'search', query: trimmed, topK, baseUrl });
    });
  }
}

export const semanticSearch = new SemanticSearchEngine();
