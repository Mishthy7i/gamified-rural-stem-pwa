import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, GraduationCap, Users, Rocket, Atom, BookOpen, Trophy, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './Landing.css';

const Landing: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleRoleSelect = (role: 'student' | 'teacher') => {
    navigate('/auth', { state: { role } });
  };

  return (
    <div className="landing-container">
      {/* Interactive Cursor Glow */}
      <div 
        className="cursor-glow"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      ></div>

      {/* Dynamic Background Elements */}
      <div className="bg-gradient-mesh"></div>
      <div className="bg-grid-overlay"></div>
      
      {/* Floating Decorative Icons & Particles */}
      <div className="floating-icon icon-1"><Rocket size={36} /></div>
      <div className="floating-icon icon-2"><Atom size={48} /></div>
      <div className="floating-icon icon-3"><BookOpen size={32} /></div>
      <div className="floating-icon icon-4"><Trophy size={42} /></div>
      
      {/* Animated tiny stars/particles */}
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>
      <div className="particle particle-5"></div>
      <div className="particle particle-6"></div>

      <div className="landing-content content-wrapper">
        <header className="landing-header animate-fade-in-down">
          <div className="logo-badge glass-effect interactive-hover">
            <div className="logo-icon-container shine-effect">
              <Sparkles className="logo-icon" size={20} />
            </div>
            <span className="logo-text">STEM Rural</span>
          </div>
          
          <div className="language-selector glass-effect interactive-hover">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as any)}
              className="lang-select"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
              <option value="pa">ਪੰਜਾਬੀ</option>
            </select>
          </div>
        </header>

        <main className="landing-main">
          <div className="hero-section">
            <div className="badge-pill animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="pulse-dot"></span>
              Welcome to the Future of Learning
            </div>
            
            <h1 className="hero-title animate-title-reveal" style={{ animationDelay: '0.2s' }}>
              <span className="text-gradient-primary">{t('landing.title')?.split(' ')[0]} </span>
              {t('landing.title')?.split(' ').slice(1).join(' ')}
            </h1>
            <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {t('landing.subtitle')}
            </p>
          </div>

          <div className="role-selection-section animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="section-header">
              <h2 className="selection-title">{t('landing.selectRole')}</h2>
              <div className="title-underline"></div>
            </div>
            
            <div className="role-cards">
              <button 
                className="role-card student-card glass-effect"
                onClick={() => handleRoleSelect('student')}
              >
                <div className="card-shine"></div>
                <div className="card-bg-gradient"></div>
                <div className="card-content">
                  <div className="role-icon-wrapper student-icon pulse-on-hover">
                    <GraduationCap size={44} />
                    <div className="icon-glow"></div>
                  </div>
                  <div className="role-text">
                    <h3>{t('role.student')}</h3>
                    <p className="role-desc">Step into a world of interactive learning, exciting missions, and rewards!</p>
                  </div>
                  <div className="action-arrow arrow-student">
                    <ChevronRight size={24} />
                  </div>
                </div>
              </button>

              <button 
                className="role-card teacher-card glass-effect"
                onClick={() => handleRoleSelect('teacher')}
              >
                <div className="card-shine"></div>
                <div className="card-bg-gradient"></div>
                <div className="card-content">
                  <div className="role-icon-wrapper teacher-icon pulse-on-hover">
                    <Users size={44} />
                    <div className="icon-glow"></div>
                  </div>
                  <div className="role-text">
                    <h3>{t('role.teacher')}</h3>
                    <p className="role-desc">Empower students, track their progress, and guide their educational journeys.</p>
                  </div>
                  <div className="action-arrow arrow-teacher">
                    <ChevronRight size={24} />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Landing;
