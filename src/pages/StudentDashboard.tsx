import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Search, Compass, UserCircle, BookOpen, GraduationCap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './Dashboard.css';

const StudentDashboard: React.FC = () => {
  const { userData, updateUserData } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [recommendedClasses, setRecommendedClasses] = useState<any[]>([]);
  const [manualCode, setManualCode] = useState('');
  const [loadingCode, setLoadingCode] = useState(false);

  useEffect(() => {
    if (userData?.school && userData?.classLevel) {
      const fetchMatches = async () => {
        try {
          const q = collection(db, 'classes');
          const snap = await getDocs(q);
          const allClasses = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
          
          const mySchool = userData.school?.toLowerCase().trim() || '';
          
          let matches = allClasses.filter(c => 
            c.school?.toLowerCase().trim() === mySchool && 
            c.teachingClass === userData.classLevel
          );
          
          if (matches.length === 0 && mySchool) {
            matches = allClasses.filter(c => c.school?.toLowerCase().trim() === mySchool);
          }
          
          if (matches.length === 0) {
            matches = allClasses.filter(c => c.teachingClass === userData.classLevel);
          }
          
          setRecommendedClasses(matches);
        } catch (err) {
          console.error("Error fetching recommended classes:", err);
        }
      };
      // Simulate network wait for smooth animation rendering
      setTimeout(fetchMatches, 300);
    }
  }, [userData]);

  const joinClass = async (classData: any) => {
    setLoadingCode(true);
    await updateUserData({ joinedClassCode: classData.code });
    setLoadingCode(false);
    navigate('/map');
  };

  const handleManualJoin = async () => {
    setLoadingCode(true);
    try {
      const q = query(collection(db, 'classes'), where('code', '==', manualCode));
      const snap = await getDocs(q);
      if (!snap.empty) {
        await updateUserData({ joinedClassCode: manualCode });
        navigate('/map');
      } else {
        alert("Invalid Classroom Code!");
      }
    } catch {
      alert("Error joining class");
    }
    setLoadingCode(false);
  };

  const startSelfLearning = () => {
    navigate('/map');
  };

  const hasSchool = userData?.school && userData.school !== 'Skipped' && userData.school.trim() !== '';

  return (
    <div className="dashboard-container">
      {/* Background aesthetics carried over */}
      <div className="bg-gradient-mesh" style={{ position: 'fixed', opacity: 0.6 }}></div>
      <div className="bg-grid-overlay" style={{ position: 'fixed' }}></div>

      <div className="dashboard-content animate-fade-in-up">
        
        {/* Modern Glass Header */}
        <header className="dashboard-header">
          <div className="header-title-group">
            <h2>{t('dashboard.welcome')}, {userData?.name}!</h2>
            <div className="header-subtitle">
              <GraduationCap size={16} color="#6366f1" />
              <span>{t('dashboard.class')}: {userData?.classLevel}</span>
              {hasSchool && (
                <>
                  <span style={{ opacity: 0.5 }}>|</span>
                  <span>{t('dashboard.school')}: {userData?.school}</span>
                </>
              )}
            </div>
          </div>
          <button className="profile-btn" onClick={() => navigate('/profile')}>
            <UserCircle size={24} />
          </button>
        </header>

        <div className={hasSchool ? "dash-grid-2" : ""} style={{ maxWidth: hasSchool ? '100%' : '600px', margin: hasSchool ? '0' : '0 auto' }}>
          
          {hasSchool && (
            <div className="premium-glass-card">
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#d946ef' }}>★</span> {t('dashboard.recommended')}
              </h3>
              
              {recommendedClasses.length === 0 ? (
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <p style={{ color: '#94a3b8' }}>{t('dashboard.noClasses')}</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {recommendedClasses.map((cls, idx) => (
                    <div key={idx} className="class-item">
                      <div>
                        <h4 style={{ color: '#e0e7ff', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{cls.subject}</h4>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.75rem' }}>Teacher: {cls.teacherName}</p>
                        <span className="code-badge">{cls.code}</span>
                      </div>
                      <button className="btn-glow-primary" onClick={() => joinClass(cls)} disabled={loadingCode}>
                        {t('dashboard.joinClass')}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <h4 style={{ color: '#e2e8f0', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{t('dashboard.haveCode')}</h4>
                <div className="premium-input-group">
                  <input 
                    type="text" 
                    placeholder={t('dashboard.enterCode')} 
                    value={manualCode}
                    onChange={e => setManualCode(e.target.value.toUpperCase())}
                    className="premium-input"
                  />
                  <button className="btn-glow-primary" onClick={handleManualJoin} disabled={!manualCode || loadingCode}>
                    <Search size={20} /> Join
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Self Learning Mode Wrapper */}
          <div className="premium-glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '350px' }}>
            <div style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', marginBottom: '1.5rem' }}>
              <Compass size={56} color="#818cf8" />
            </div>
            <h3 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '1rem' }}>{t('dashboard.selfLearning')}</h3>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '80%' }}>
              Want to learn on your own without a classroom? Explore our missions and earn points!
            </p>
            <button className="btn-glow-secondary" onClick={startSelfLearning} style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
              <BookOpen size={24} /> {t('dashboard.startAdventure')}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
