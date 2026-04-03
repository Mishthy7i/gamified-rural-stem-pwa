import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../hooks/useVoice';
import { Star, Lock, Play, ArrowLeft } from 'lucide-react';
import './LearningMap.css';

const levelData = [
  { id: 1, title: 'Fractions', description: 'Master Numerators', pointsReq: 0, icon: '🍕' },
  { id: 2, title: 'Equations', description: 'Solve for X', pointsReq: 50, icon: '⚖️' },
  { id: 3, title: 'Geometry', description: 'Angles & Shapes', pointsReq: 120, icon: '📐' },
  { id: 4, title: 'Logic', description: 'Puzzles', pointsReq: 250, icon: '🧩' },
];

const LearningMap: React.FC = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { speak, stop } = useVoice();

  const currentPoints = userData?.points || 0;

  // Speak welcome message using centralized hook
  const speakMessage = () => {
    const text = t('map.welcome').replace('{name}', userData?.name?.split(' ')[0] || t('map.friend'));
    speak(text);
  };

  // Auto-speak on map load!
  React.useEffect(() => {
    // Wake up the voice APIs to ensure the array isn't empty when we request it
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
    
    // Slight delay so the page animation finishes first
    const timer = setTimeout(() => {
      speakMessage();
    }, 800);
    
    return () => {
      clearTimeout(timer);
      stop();
    }
  }, [userData?.name]);

  const handleLevelClick = (levelId: number, isLocked: boolean) => {
    if (isLocked) {
      // Don't do anything if locked, visual cue handles it
      return;
    }
    
    if (levelId === 1) {
      navigate('/level/fractions');
    } else {
      alert(`Level ${levelId} logic coming soon!`);
    }
  };

  return (
    <div className="learning-map-container">
      
      {/* Decorative CSS Clouds */}
      <div className="cloud cloud-1">☁️</div>
      <div className="cloud cloud-2">☁️</div>
      <div className="cloud cloud-3">☁️</div>

      <header className="map-header flex-between">
        <button className="back-btn" onClick={() => navigate('/dashboard/student')}>
          <ArrowLeft size={24} color="white" />
        </button>
        <div className="score-badge">
          <Star size={20} className="star-icon text-yellow-300" />
          <span>{currentPoints} Pts</span>
        </div>
      </header>

      {/* Avatar Chat Section  - now with Voice API hook! */}
      <div className="avatar-section animate-slide-up" onClick={speakMessage} style={{ cursor: 'pointer' }}>
        <div className="chat-bubble">
          <p><strong>{t('map.welcome').replace('{name}', userData?.name?.split(' ')[0] || t('map.friend'))}</strong></p>
          <div className="bubble-arrow"></div>
          <p className="text-xs text-secondary mt-1 text-center italic">{t('map.clickAudio')}</p>
        </div>
        <div className="avatar-character animate-bounce-slow">
          🦉
        </div>
      </div>

      <div className="map-path-container">
        <div className="winding-line"></div>
        {levelData.map((level, index) => {
          const isLocked = currentPoints < level.pointsReq;
          const isCurrent = !isLocked && (index === levelData.length - 1 || currentPoints < levelData[index + 1].pointsReq);
          
          return (
            <div 
              key={level.id} 
              className={`saga-node-wrapper ${index % 2 === 0 ? 'left' : 'right'}`}
            >
              <div 
                className={`saga-node ${isLocked ? 'locked' : 'unlocked'} ${isCurrent ? 'current-node' : ''}`} 
                onClick={() => handleLevelClick(level.id, isLocked)}
              >
                <div className="node-3d-button">
                  <span className="node-emoji">{isLocked ? '🔒' : level.icon}</span>
                </div>
                
                <div className={`node-tooltip ${index % 2 === 0 ? 'tooltip-right' : 'tooltip-left'}`}>
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
