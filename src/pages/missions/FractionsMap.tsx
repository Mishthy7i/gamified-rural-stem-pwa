import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Lock, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const FractionsMap: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  
  const currentPoints = userData?.points || 0;
  
  // Mission 1 is unlocked immediately (0 pts)
  // Mission 2 unlocks at 200 pts (beating mission 1)
  const isMission2Locked = currentPoints < 200;
  
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', padding: '1rem' }}>
      
      {/* Top Bar */}
      <div className="flex-between mb-8">
        <button className="btn-secondary" onClick={() => navigate('/map')} style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>
          Level 1: Fractions
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#f59e0b' }}>
          <Star size={18} fill="#f59e0b" />
          {currentPoints} Pts
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Select Mission</h1>
        
        <div style={{ display: 'grid', gap: '2rem' }}>
          
          {/* Mission 1 Node */}
          <div 
            onClick={() => navigate('/mission/fractions/1')}
            style={{ 
              background: 'white', 
              borderRadius: '16px', 
              padding: '2rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              border: currentPoints >= 200 ? '2px solid #10b981' : '2px solid var(--accent-primary)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.2s',
            }}
            className="animate-slide-up hover-scale"
          >
            {currentPoints >= 200 && (
              <div style={{ position: 'absolute', top: 0, right: 0, background: '#10b981', color: 'white', padding: '0.2rem 1rem', borderBottomLeftRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                COMPLETED
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', textAlign: 'left' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: currentPoints >= 200 ? '#10b981' : 'var(--accent-primary)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Play size={24} fill="currentColor" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>1. The Basics</h3>
                <p className="text-secondary mb-2">Learn what fractions are through Mother's Rotis.</p>
                <span style={{ fontSize: '0.9rem', color: '#f59e0b', fontWeight: 'bold' }}>Reward: 200 PTS</span>
              </div>
            </div>
          </div>

          {/* Mission 2 Node */}
          <div 
            onClick={() => !isMission2Locked && navigate('/mission/fractions/2')}
            style={{ 
              background: isMission2Locked ? '#f1f5f9' : 'white', 
              borderRadius: '16px', 
              padding: '2rem',
              boxShadow: isMission2Locked ? 'none' : '0 10px 25px rgba(0,0,0,0.05)',
              cursor: isMission2Locked ? 'not-allowed' : 'pointer',
              border: isMission2Locked ? '2px dashed #cbd5e1' : '2px solid var(--accent-secondary)',
              opacity: isMission2Locked ? 0.7 : 1,
              transition: 'transform 0.2s',
            }}
            className="animate-slide-up hover-scale"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', textAlign: 'left' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: isMission2Locked ? '#cbd5e1' : 'var(--accent-secondary)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {isMission2Locked ? <Lock size={24} /> : <Play size={24} fill="currentColor" />}
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>2. Playing with Parts</h3>
                <p className="text-secondary mb-2">Can we add them together?</p>
                <span style={{ fontSize: '0.9rem', color: isMission2Locked ? '#94a3b8' : '#f59e0b', fontWeight: 'bold' }}>
                  {isMission2Locked ? 'Requires 200 PTS to unlock' : 'Reward: 200 PTS'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FractionsMap;
