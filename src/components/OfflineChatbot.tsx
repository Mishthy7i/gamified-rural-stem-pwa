import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, VolumeX, Mic } from "lucide-react";
import { useWebLLM } from "../context/WebLLMContext";
import { useVoice } from "../hooks/useVoice";
import { useLanguage } from "../context/LanguageContext";
import "./OfflineChatbot.css";
import type { ChatCompletionMessageParam } from "@mlc-ai/web-llm";

export const OfflineChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { engine, isReady, initFailed, progressText, initEngine, resetEngine } =
    useWebLLM();
  const { speak, stop } = useVoice();
  const { language } = useLanguage();
  const [inputVal, setInputVal] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Dragging state
  const dragRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null>(null);
  const [position, setPosition] = useState({
    x: window.innerWidth - 380,
    y: window.innerHeight - 560,
  });
  const [isDragging, setIsDragging] = useState(false);

  // Force English prompt: SmolLM2-135M is too small to output grammatically correct Hindi
  const baseSystemPrompt = `You are a warm, extremely encouraging AI teacher talking to a 7-year-old child. Explain EVERYTHING in very simple English words with fun, real-life examples (like animals, toys, food). Do NOT use complex words. Keep answers 1 or 2 sentences max. You MUST reply ONLY in English.`;

  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([
    { role: "system", content: baseSystemPrompt },
    {
      role: "assistant",
      content:
        "Hi there! I am your AI tutor. I love using fun examples! What do you want to learn about today?",
    },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto update system prompt if language flips during chat
  useEffect(() => {
    setMessages((prev) => {
      const updated = [...prev];
      if (updated[0]?.role === "system") {
        updated[0].content = baseSystemPrompt;
      }
      return updated;
    });
  }, [language, baseSystemPrompt]);

  // Setup Voice Input Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputVal((prev) => (prev + " " + transcript).trim());
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Mic start error", e);
      }
    }
  };

  // Auto scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Drag listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({
        x: dragRef.current.initialX + dx,
        y: dragRef.current.initialY + dy,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  const handleSend = async () => {
    if (!inputVal.trim() || !engine || isGenerating) return;

    const userMessage: ChatCompletionMessageParam = {
      role: "user",
      content: inputVal,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputVal("");
    setIsGenerating(true);
    stop(); // cancel any ongoing speech

    // THROW AWAY heavy memory context to ensure blazing fast speeds and no hallucination loop
    // Extract the system prompt (always index 0)
    const systemPrompt = newMessages[0];
    // Take the last 3 actual dialogue lines (ignoring system prompt)
    const dialogueHistory = newMessages.slice(1).slice(-3);

    const optimizedContext = [systemPrompt, ...dialogueHistory];

    try {
      // Add empty assistant message that will be streamed into
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const chunks = await engine.chat.completions.create({
        messages: optimizedContext,
        stream: true,
        temperature: 0.1, // extremely deterministic to block rambling
        top_p: 0.8,
        frequency_penalty: 0.8, // harshly block repeating loops
        max_tokens: 150, // strict length cap
      });

      let fullResponse = "";
      let textBufferForVoice = "";

      for await (const chunk of chunks) {
        const delta = chunk.choices[0]?.delta.content || "";
        fullResponse += delta;
        textBufferForVoice += delta;

        // Update the last message in real-time on UI
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: fullResponse,
          };
          return updated;
        });

        // Voice Streaming Logic: Wait for punctuation (sentence complete) to ensure proper audio cadence
        const isSentenceEnd = /[.!?\n]/.test(delta);

        if (isSentenceEnd) {
          if (textBufferForVoice.trim().length > 0) {
            // Give the browser TTS engine a complete sentence to read perfectly
            speak(textBufferForVoice.trim() + delta.trim());
            textBufferForVoice = ""; // flush buffer
          }
        }
      }

      // Flush final remaining words to audio queue
      if (textBufferForVoice.trim().length > 0) {
        speak(textBufferForVoice.trim());
      }
    } catch (e: any) {
      console.error("Chatbot generation error", e);
      const isCrash =
        e?.message?.includes("Instance reference") ||
        String(e).includes("Device lost");
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: isCrash
            ? "GPU Device was lost due to unmounting or memory limits. Please reset the AI engine."
            : "Sorry, I ran into an error generating that response.",
        };
        return updated;
      });
      if (isCrash && resetEngine) {
        resetEngine();
        setIsGenerating(false);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div
          className="chatbot-window animate-slide-up"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            bottom: "auto",
            right: "auto",
          }}
        >
          <div
            className="chatbot-header"
            onMouseDown={handleMouseDown}
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Bot size={20} /> AI Tutor (Draggable)
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => stop()}
                title="Mute Output"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                <VolumeX size={18} />
              </button>
              {isReady && (
                <button
                  onClick={resetEngine}
                  style={{
                    background: "transparent",
                    border: "1px solid white",
                    borderRadius: "4px",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "0.7rem",
                    padding: "0.2rem 0.5rem",
                  }}
                >
                  Reset GPU
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {!isReady ? (
            <div className="chatbot-init">
              <h3 style={{ color: "gray" }}>
                {initFailed
                  ? "Could not start offline AI"
                  : "Loading offline AI"}
              </h3>
              <p className="init-text">{progressText}</p>
              {initFailed ? (
                <button
                  className="btn-primary"
                  onClick={() => void initEngine()}
                  style={{ width: "100%" }}
                >
                  Try again
                </button>
              ) : (
                <p
                  className="init-text"
                  style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}
                >
                  Model downloads in the background when you open the app so it
                  works offline later.
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="chatbot-messages">
                {messages
                  .filter((m) => m.role !== "system")
                  .map((msg, idx) => (
                    <div
                      key={idx}
                      className={
                        msg.role === "user" ? "message-user" : "message-bot"
                      }
                    >
                      {typeof msg.content === "string"
                        ? msg.content
                        : JSON.stringify(msg.content)}
                    </div>
                  ))}
                {isGenerating && (
                  <div className="message-bot">
                    <span className="typing-indicator">...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="chatbot-input-area">
                <button
                  onClick={toggleMic}
                  className="chatbot-mic"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: isListening ? "var(--accent-primary)" : "#64748b",
                    cursor: "pointer",
                    padding: "0.5rem",
                    animation: isListening ? "pulse 1.5s infinite" : "none",
                  }}
                  title="Speak your question"
                >
                  <Mic size={20} />
                </button>
                <input
                  type="text"
                  className="chatbot-input"
                  placeholder={
                    isListening ? "Listening..." : "Ask me anything..."
                  }
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isGenerating}
                />
                <button
                  className="chatbot-send"
                  onClick={handleSend}
                  disabled={isGenerating || !inputVal.trim()}
                >
                  <Send size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div
          className="chatbot-bubble animate-scale"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle size={28} />
        </div>
      )}
    </div>
  );
};
