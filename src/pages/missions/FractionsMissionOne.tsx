import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, PlayCircle, CheckCircle2, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import Confetti from 'react-confetti';
import { useVoice } from '../../hooks/useVoice';

const FractionsMissionOne: React.FC = () => {
  const { userData, updateUserData } = useAuth();
  const navigate = useNavigate();
  const { speak, stop } = useVoice();
  const [phase, setPhase] = useState<'video' | 'task' | 'success'>('video');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const problemText = "Mother has just cooked 1 large, hot roti on the chulha. Her 2 hungry children are sitting right next to her, eagerly waiting to eat. She needs to divide the roti so that both siblings get an exactly equal share. How much of the roti will each child get?";

  React.useEffect(() => {
    if (phase === 'task') {
      speak(problemText);
      setIsSpeaking(true);
    } else {
      stop();
      setIsSpeaking(false);
    }
  }, [phase]);

  const toggleVoice = () => {
    if (isSpeaking) {
      stop();
      setIsSpeaking(false);
    } else {
      speak(problemText);
      setIsSpeaking(true);
    }
  };

  const handleCorrect = async () => {
    setLoading(true);
    // Award 200 points if they haven't beaten this yet (assume < 200 means new)
    if (userData && (userData.points || 0) < 200) {
      const newPoints = (userData.points || 0) + 200;
      await updateUserData({ points: newPoints });
    }
    setPhase('success');
    setLoading(false);
  };

  const handleIncorrect = () => {
    setErrorMsg('Oops! Think about dividing 1 whole roti equally between 2 people. Try again!');
    setTimeout(() => setErrorMsg(''), 3500);
  };

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--bg-primary)', padding: '1rem' }}>
      
      {/* Top Bar */}
      <div className="flex-between mb-4">
        <button className="btn-secondary" onClick={() => navigate('/level/fractions')} style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ fontWeight: 'bold', color: 'var(--accent-secondary)' }}>
          Mission 1: The Basics
        </div>
        <div style={{ width: 32 }}></div> {/* Balancer */}
      </div>

      {phase === 'video' && (
        <div className="card-gamified animate-slide-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="mb-4">Step 1: Watch & Learn 📺</h2>
          <p className="text-secondary mb-4">Let's understand what Fractions are before we help Mother cook!</p>
          
          <div style={{ position: 'relative', background: 'black', paddingBottom: '56.25%', height: 0, borderRadius: 'var(--border-radius-sm)', overflow: 'hidden' }}>
            <video 
              src="/assets/mission1.mp4" 
              controls
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            >
              Please place your mission1.mp4 video file directly into the /public/assets/ folder!
            </video>
          </div>

          <button className="btn-primary mt-6" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} onClick={() => setPhase('task')}>
            <PlayCircle /> I've finished the video! Let's play.
          </button>
        </div>
      )}

      {phase === 'task' && (
        <div className="animate-slide-up" style={{ maxWidth: '800px', margin: '0 auto', background: '#0f172a', borderRadius: '16px', overflow: 'hidden', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
          
          {/* Background Image dynamically generated! */}
          <div style={{ 
            height: '350px', 
            backgroundImage: 'url(/assets/mission1_bg.png)', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, #0f172a)', height: '150px' }}></div>
          </div>

          <div style={{ padding: '2rem', position: 'relative', zIndex: 10, color: 'white' }}>
            <div className="flex-between mb-4">
              <h2 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Mother's Roti Challenge 🫓</h2>
              <button 
                onClick={toggleVoice} 
                style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center' }}
              >
                {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
            
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#cbd5e1', marginBottom: '2rem' }}>
              {problemText}
            </p>

            {errorMsg && (
              <div style={{ background: 'rgba(2ef, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#fca5a5', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RotateCcw size={18} /> {errorMsg}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              <button className="btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '1rem', fontSize: '1.1rem' }} onClick={handleIncorrect}>
                A) 1/4 and 3/4
              </button>
              <button className="btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '1rem', fontSize: '1.1rem' }} onClick={handleCorrect} disabled={loading}>
                B) 1/2 and 1/2 (Two equal Halves)
              </button>
              <button className="btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '1rem', fontSize: '1.1rem' }} onClick={handleIncorrect}>
                C) 1/3 and 2/3
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === 'success' && (
        <div className="card-gamified animate-slide-up text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Confetti recycle={false} numberOfPieces={400} />
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <CheckCircle2 size={80} color="var(--accent-primary)" />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Brilliant Work! 🎉</h2>
          <p className="text-secondary" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            You correctly told Mother to give <strong>1/2 (Half)</strong> of the roti to each child. Both siblings are happy!
          </p>
          <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'inline-block' }}>
            <strong style={{ color: 'var(--accent-secondary)' }}>+200 Points Earned!</strong>
          </div>
          <button className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} onClick={() => navigate('/level/fractions')}>
            Return to Map
          </button>
        </div>
      )}

    </div>
  );
};

export default FractionsMissionOne;
