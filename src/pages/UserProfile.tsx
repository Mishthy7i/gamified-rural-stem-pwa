import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, LogOut, Award, Edit3, UserCircle, LayoutDashboard } from 'lucide-react';

const UserProfile: React.FC = () => {
  const { userData, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleEditProfile = () => {
    if (userData?.role === 'student') {
      navigate('/onboarding/student');
    } else {
      navigate('/onboarding/teacher');
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const goBack = () => {
    navigate(-1);
  };

  const goDashboard = () => {
    if (userData?.role === 'student') {
      navigate('/dashboard/student');
    } else {
      navigate('/dashboard/teacher');
    }
  };

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--bg-primary)', padding: '1rem' }}>
      {/* Top Bar */}
      <div className="flex-between mb-8">
        <button className="btn-secondary" onClick={goBack} style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ fontWeight: 'bold', color: 'var(--accent-secondary)' }}>
          {t('profile.settings')}
        </div>
        <div style={{ width: 32 }}></div> {/* Balancer */}
      </div>

      <div className="card-gamified animate-slide-up" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <UserCircle size={80} color="var(--accent-primary)" />
        </div>

        <h2 style={{ marginBottom: '0.5rem' }}>{userData?.name || 'User'}</h2>
        <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)', padding: '0.2rem 0.8rem', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '1.5rem', border: '1px solid var(--accent-primary)' }}>
          {userData?.role === 'student' ? t('profile.student') : t('profile.teacher')}
        </div>

        {userData?.role === 'student' && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: '#0f172a', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <Award color="var(--accent-secondary)" />
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
              {t('profile.points')}: {userData?.points || 0}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button className="btn-primary" onClick={goDashboard} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <LayoutDashboard size={18} /> {t('profile.dashboard')}
          </button>

          <button className="btn-secondary" onClick={handleEditProfile} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Edit3 size={18} /> {t('profile.edit')}
          </button>

          <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', padding: '1rem', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 'var(--border-radius-sm)', cursor: 'pointer', transition: 'all 0.2s ease' }}>
            <LogOut size={18} /> {t('profile.signout')}
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
