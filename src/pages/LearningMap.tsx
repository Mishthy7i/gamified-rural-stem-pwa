import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useVoice } from "../hooks/useVoice";
import { Star, ArrowLeft, UserCircle } from "lucide-react";
import { OfflineBanner } from "../components/OfflineBanner";
import "./LearningMap.css";

const LearningMap: React.FC = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { speak, stop } = useVoice();

  const currentPoints = userData?.points || 0;

  const getLevelData = () => [
    {
      id: 1,
      title: t("map.lvl.frac.title"),
      description: t("map.lvl.frac.desc"),
      pointsReq: 0,
      icon: "🍕",
    },
    {
      id: 2,
      title: t("map.lvl.eq.title"),
      description: t("map.lvl.eq.desc"),
      pointsReq: 50,
      icon: "⚖️",
    },
    {
      id: 3,
      title: "Geometry",
      description: "Angles & Shapes",
      pointsReq: 120,
      icon: "📐",
    },
    {
      id: 4,
      title: "Logic",
      description: "Puzzles",
      pointsReq: 250,
      icon: "🧩",
    },
  ];

  // Speak welcome message using centralized hook
  const speakMessage = () => {
    const text = t("map.welcome").replace(
      "{name}",
      userData?.name?.split(" ")[0] || t("map.friend")
    );
    speak(text);
  };

  // Auto-speak on map load!
  React.useEffect(() => {
    // Wake up the voice APIs to ensure the array isn't empty when we request it
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }

    // Slight delay so the page animation finishes first
    const timer = setTimeout(() => {
      speakMessage();
    }, 800);

    return () => {
      clearTimeout(timer);
      stop();
    };
  }, [userData?.name]);

  const handleLevelClick = (levelId: number, isLocked: boolean) => {
    if (isLocked) {
      // Don't do anything if locked, visual cue handles it
      return;
    }

    if (levelId === 1) {
      stop();
      navigate("/level/fractions");
    } else {
      alert(`Level ${levelId} logic coming soon!`);
    }
  };

  const handleNavigate = (path: string) => {
    stop();
    navigate(path);
  };

  return (
    <div className="learning-map-container">
      {/* Decorative CSS Clouds */}
      <div className="cloud cloud-1">☁️</div>
      <div className="cloud cloud-2">☁️</div>
      <div className="cloud cloud-3">☁️</div>

      <div style={{ padding: "0 1rem", position: "relative", zIndex: 2 }}>
        <OfflineBanner />
      </div>

      <header className="map-header flex-between">
        <button
          className="back-btn"
          onClick={() => handleNavigate("/dashboard/student")}
        >
          <ArrowLeft size={24} color="white" />
        </button>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div className="score-badge">
            <Star size={20} className="star-icon text-yellow-300" />
            <span>{currentPoints} Pts</span>
          </div>
          <button
            className="back-btn"
            onClick={() => handleNavigate("/profile")}
          >
            <UserCircle size={24} color="white" />
          </button>
        </div>
      </header>

      {/* Avatar Chat Section  - now with Voice API hook! */}
      <div
        className="avatar-section animate-slide-up"
        onClick={speakMessage}
        style={{ cursor: "pointer" }}
      >
        <div className="chat-bubble">
          <p>
            <strong>
              {t("map.welcome").replace(
                "{name}",
                userData?.name?.split(" ")[0] || t("map.friend")
              )}
            </strong>
          </p>
          <div className="bubble-arrow"></div>
          <p className="text-xs text-secondary mt-1 text-center italic">
            {t("map.clickAudio")}
          </p>
        </div>
        <div className="avatar-character animate-bounce-slow">🦉</div>
      </div>

      <div className="map-path-container">
        <div className="winding-line"></div>
        {getLevelData().map((level, index) => {
          const isLocked = currentPoints < level.pointsReq;
          const isCurrent =
            !isLocked &&
            (index === getLevelData().length - 1 ||
              currentPoints < getLevelData()[index + 1].pointsReq);

          return (
            <div
              key={level.id}
              className={`saga-node-wrapper ${
                index % 2 === 0 ? "left" : "right"
              }`}
            >
              <div
                className={`saga-node ${isLocked ? "locked" : "unlocked"} ${
                  isCurrent ? "current-node" : ""
                }`}
                onClick={() => handleLevelClick(level.id, isLocked)}
              >
                <div className="node-3d-button">
                  <span className="node-emoji">
                    {isLocked ? "🔒" : level.icon}
                  </span>
                </div>

                <div
                  className={`node-tooltip ${
                    index % 2 === 0 ? "tooltip-right" : "tooltip-left"
                  }`}
                >
                  <h4>Level {level.id}</h4>
                  <p>{level.title}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningMap;
