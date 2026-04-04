import { useState, useCallback } from 'react';
import { CreateWebWorkerMLCEngine, type MLCEngineInterface, type InitProgressReport } from '@mlc-ai/web-llm';

export function useWebLLM() {
  const [isReady, setIsReady] = useState(false);
  const [progressText, setProgressText] = useState('Offline LLM ready to power up.');
  const [engine, setEngine] = useState<MLCEngineInterface | null>(null);

  const initEngine = useCallback(async () => {
    if (engine) return;
    try {
      const worker = new Worker(new URL('../worker', import.meta.url), { type: 'module' });
      setProgressText('Downloading AI into local cache...');
      
      const mlcEngine = await CreateWebWorkerMLCEngine(
        worker,
        "SmolLM2-135M-Instruct-q0f16-MLC",
        { 
          initProgressCallback: (progress: InitProgressReport) => {
            setProgressText(progress.text);
          }
        }
      );
      
      setEngine(mlcEngine as unknown as MLCEngineInterface);
      setIsReady(true);
      setProgressText('Ready');
    } catch (e: any) {
      console.error(e);
      setProgressText(`Error initializing model: ${e?.message}`);
    }
  }, [engine]);

  const resetEngine = useCallback(() => {
    setEngine(null);
    setIsReady(false);
    setProgressText('Engine Reset. Ready to restart.');
  }, []);

  return { engine, isReady, progressText, initEngine, resetEngine };
}
