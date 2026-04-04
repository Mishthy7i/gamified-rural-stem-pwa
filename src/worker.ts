import { WebWorkerMLCEngineHandler } from '@mlc-ai/web-llm';

// Hook up the handler to the worker's messaging system
const handler = new WebWorkerMLCEngineHandler();
self.onmessage = (msg: MessageEvent) => {
  handler.onmessage(msg);
};
