import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, GraduationCap, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './Landing.css';

const Landing: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'student' | 'teacher') => {
    // We can pass state to the auth page to know which role the user selected
    navigate('/auth', { state: { role } });
  };

  return (
    <div className="landing-container">
      {/* Dynamic Background Elements */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      
      <div className="landing-content content-wrapper">
        <header className="landing-header animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="logo-badge">
            <Sparkles className="logo-icon" size={24} />
            <span>STEM</span>
          </div>
          
          <div className="language-selector">
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
          <div className="hero-text animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="hero-title">
              {t('landing.title')}
            </h1>
            <p className="hero-subtitle">
              {t('landing.subtitle')}
            </p>
          </div>

          <div className="role-selection-section animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="selection-title">{t('landing.selectRole')}</h2>
            
            <div className="role-cards">
              <button 
                className="role-card card-gamified"
                onClick={() => handleRoleSelect('student')}
              >
                <div className="role-icon-wrapper student-icon">
                  <GraduationCap size={40} />
                </div>
                <h3>{t('role.student')}</h3>
                <p className="role-desc">Learn, play, and complete missions!</p>
              </button>

              <button 
                className="role-card card-gamified"
                onClick={() => handleRoleSelect('teacher')}
              >
                <div className="role-icon-wrapper teacher-icon">
                  <Users size={40} />
                </div>
                <h3>{t('role.teacher')}</h3>
                <p className="role-desc">Guide students and track progress.</p>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Landing;
