import { useState, useCallback, useRef } from "react";
import {
  CreateWebWorkerMLCEngine,
  deleteModelAllInfoInCache,
  prebuiltAppConfig,
  type MLCEngineInterface,
  type InitProgressReport,
} from "@mlc-ai/web-llm";

const MODEL_ID = "SmolLM2-135M-Instruct-q0f16-MLC" as const;

function isIndexedDbConstraintError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes("ConstraintError") || msg.includes("Key already exists");
}

export type WebLLMState = {
  engine: MLCEngineInterface | null;
  isReady: boolean;
  initFailed: boolean;
  progressText: string;
  initEngine: () => Promise<void>;
  resetEngine: () => void;
};

/** Core state + actions; mount once inside WebLLMProvider. */
export function useWebLLMState() {
  const [isReady, setIsReady] = useState(false);
  const [initFailed, setInitFailed] = useState(false);
  const [progressText, setProgressText] = useState(
    "Preparing offline AI model in the background…"
  );
  const [engine, setEngine] = useState<MLCEngineInterface | null>(null);
  const engineRef = useRef<MLCEngineInterface | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const initInFlightRef = useRef(false);

  const disposeWorker = useCallback(() => {
    workerRef.current?.terminate();
    workerRef.current = null;
  }, []);

  const initEngine = useCallback(async () => {
    if (engineRef.current || initInFlightRef.current) return;
    initInFlightRef.current = true;
    setInitFailed(false);

    const appConfig = {
      ...prebuiltAppConfig,
      useIndexedDBCache: true,
    };

    const engineOpts = {
      initProgressCallback: (progress: InitProgressReport) => {
        setProgressText(progress.text);
      },
      appConfig,
    };

    disposeWorker();
    const worker = new Worker(new URL("../worker", import.meta.url), {
      type: "module",
    });
    workerRef.current = worker;

    setProgressText("Downloading AI into local cache...");

    try {
      const load = () => CreateWebWorkerMLCEngine(worker, MODEL_ID, engineOpts);

      try {
        const mlcEngine = await load();
        const ready = mlcEngine as unknown as MLCEngineInterface;
        engineRef.current = ready;
        setEngine(ready);
        setIsReady(true);
        setInitFailed(false);
        setProgressText("Ready");
      } catch (firstErr: unknown) {
        // Web-LLM IndexedDB uses `add()`; parallel shard downloads can race (TOCTOU),
        // or a stray worker can leave half-written state — clear and retry once.
        if (!isIndexedDbConstraintError(firstErr)) {
          throw firstErr;
        }
        setProgressText("Repairing model cache, retrying…");
        disposeWorker();
        await deleteModelAllInfoInCache(MODEL_ID, appConfig);
        const worker2 = new Worker(new URL("../worker", import.meta.url), {
          type: "module",
        });
        workerRef.current = worker2;
        const mlcEngine = await CreateWebWorkerMLCEngine(
          worker2,
          MODEL_ID,
          engineOpts
        );
        const ready = mlcEngine as unknown as MLCEngineInterface;
        engineRef.current = ready;
        setEngine(ready);
        setIsReady(true);
        setInitFailed(false);
        setProgressText("Ready");
      }
    } catch (e: unknown) {
      console.error(e);
      disposeWorker();
      engineRef.current = null;
      setEngine(null);
      const message = e instanceof Error ? e.message : String(e);
      setInitFailed(true);
      setProgressText(`Error initializing model: ${message}`);
    } finally {
      initInFlightRef.current = false;
    }
  }, [disposeWorker]);

  const resetEngine = useCallback(() => {
    disposeWorker();
    engineRef.current = null;
    setEngine(null);
    setIsReady(false);
    setInitFailed(false);
    initInFlightRef.current = false;
    setProgressText("Engine reset. Restarting model load…");
    void initEngine();
  }, [disposeWorker, initEngine]);

  return { engine, isReady, initFailed, progressText, initEngine, resetEngine };
}
