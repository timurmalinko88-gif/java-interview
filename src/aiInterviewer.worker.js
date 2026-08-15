import { WebWorkerMLCEngineHandler } from '@mlc-ai/web-llm';

// WebWorker handler for WebLLM
const handler = new WebWorkerMLCEngineHandler();

self.onmessage = (msg) => {
  handler.onmessage(msg);
};
