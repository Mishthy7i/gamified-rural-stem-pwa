import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth, type UserRole } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Auth.css';

const Auth: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const { t } = useLanguage();
  
  // Gets the role selected from the Landing page, default to student.
  const selectedRole = (location.state?.role as UserRole) || 'student';
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleAuth = async () => {
    try {
      setErrorMsg('');
      const { isNewUser } = await signInWithGoogle(selectedRole);
      
      if (isNewUser) {
        // Go to onboarding
        if (selectedRole === 'student') navigate('/onboarding/student');
        else navigate('/onboarding/teacher');
      } else {
        // Existing user goes straight to dashboard
        if (selectedRole === 'student') navigate('/dashboard/student');
        else navigate('/dashboard/teacher');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
      console.error(err);
    }
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Email Auth implementation to come later
    setErrorMsg('Email login is under construction. Please use Google for now!');
  };

  return (
    <div className="auth-container">
      <div className="auth-card card-gamified">
        <div className="auth-header">
          <Sparkles className="auth-icon" size={32} />
          <h2>
            {isLogin ? t('auth.login') : t('auth.signup')}
          </h2>
          <p className="auth-role-badge">
            Continuing as: <strong>{selectedRole === 'student' ? '🎓 Student' : '👩‍🏫 Teacher'}</strong>
          </p>
        </div>

        {errorMsg && <div className="auth-error">{errorMsg}</div>}

        <button className="google-btn" onClick={handleGoogleAuth}>
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google logo" 
            className="google-logo" 
          />
          {t('auth.google')}
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <form onSubmit={handleEmailAuth} className="auth-form">
          <div className="input-group">
            <Mail className="input-icon" size={18} />
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <Lock className="input-icon" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary auth-submit">
            {isLogin ? 'Login' : 'Sign Up'}
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button className="switch-btn" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Create one' : 'Log in here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
