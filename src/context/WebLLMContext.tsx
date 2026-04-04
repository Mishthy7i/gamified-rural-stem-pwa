import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useWebLLMState, type WebLLMState } from "../hooks/useWebLLM";

const WebLLMContext = createContext<WebLLMState | undefined>(undefined);

/**
 * Starts WebLLM download / GPU init as soon as the app loads so the model is
 * cached before the user opens the chat or goes offline.
 */
export function WebLLMProvider({ children }: { children: ReactNode }) {
  const value = useWebLLMState();
  const valueRef = useRef(value);
  valueRef.current = value;

  // Single kickoff on app load; initEngine is invoked via ref so this effect stays stable.
  useEffect(() => {
    void valueRef.current.initEngine();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  return (
    <WebLLMContext.Provider value={value}>{children}</WebLLMContext.Provider>
  );
}

export function useWebLLM(): WebLLMState {
  const ctx = useContext(WebLLMContext);
  if (ctx === undefined) {
    throw new Error("useWebLLM must be used within WebLLMProvider");
  }
  return ctx;
}
