import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Search, Compass, UserCircle, ArrowRight, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const StudentDashboard: React.FC = () => {
  const { userData, user, updateUserData } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [recommendedClasses, setRecommendedClasses] = useState<any[]>([]);
  const [manualCode, setManualCode] = useState('');
  const [loadingCode, setLoadingCode] = useState(false);

  useEffect(() => {
    if (userData?.school && userData?.classLevel) {
      const fetchMatches = async () => {
        try {
          // Bypass Firestore Multi-Field Index required errors by using simple JS mapping
          const q = collection(db, 'classes');
          const snap = await getDocs(q);
          const allClasses = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
          
          const mySchool = userData.school?.toLowerCase().trim() || '';
          
          // 1. Exact match (School + Class)
          let matches = allClasses.filter(c => 
            c.school?.toLowerCase().trim() === mySchool && 
            c.teachingClass === userData.classLevel
          );
          
          // 2. Fallback: Match ONLY by School name
          if (matches.length === 0 && mySchool) {
            matches = allClasses.filter(c => c.school?.toLowerCase().trim() === mySchool);
          }
          
          // 3. Fallback: Match ONLY by Class level
          if (matches.length === 0) {
            matches = allClasses.filter(c => c.teachingClass === userData.classLevel);
          }
          
          setRecommendedClasses(matches);
        } catch (err) {
          console.error("Error fetching recommended classes:", err);
        }
      };
      fetchMatches();
    }
  }, [userData]);

  const joinClass = async (classData: any) => {
    setLoadingCode(true);
    // In a full implementation we would add the student ID to the teacher's class doc students array
    // For now we just bind the student to this code
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

  // Determine if the user actually provided a school (or hit the Skip button which saves "Skipped")
  const hasSchool = userData?.school && userData.school !== 'Skipped' && userData.school.trim() !== '';

  return (
    <div className="min-h-screen" style={{ padding: '2rem', background: 'var(--bg-primary)' }}>
      <header className="flex-between mb-6">
        <div>
          <h2>{t('dashboard.welcome')}, {userData?.name}! 🎓</h2>
          <p className="text-secondary">
            {t('dashboard.class')}: {userData?.classLevel} 
            {hasSchool ? `  |  ${t('dashboard.school')}: ${userData?.school}` : ''}
          </p>
        </div>
        <button className="btn-secondary" onClick={() => navigate('/profile')}><UserCircle size={20} /></button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: hasSchool ? '1fr 1fr' : '1fr', gap: '2rem', maxWidth: hasSchool ? '100%' : '600px', margin: hasSchool ? '0' : '0 auto' }}>
        
        {/* Recommended Classes by School/Class - ONLY SHOW IF SCHOOL SUBMITTED */}
        {hasSchool && (
          <div className="card-gamified">
            <h3 className="mb-4">{t('dashboard.recommended')}</h3>
            
            {recommendedClasses.length === 0 ? (
              <div className="bg-slate-100 p-4 rounded text-center">
                {t('dashboard.noClasses')}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recommendedClasses.map((cls, idx) => (
                  <div key={idx} style={{ padding: '1rem', border: '1px solid var(--accent-primary)', borderRadius: 'var(--border-radius-sm)', background: 'rgba(99, 102, 241, 0.05)' }}>
                    <div className="flex-between">
                      <div>
                        <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.2rem' }}>{cls.subject}</h4>
                        <p className="text-sm text-secondary mb-2">by {cls.teacherName}</p>
                        <code style={{ background: 'var(--bg-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px dashed var(--accent-secondary)' }}>
                          {cls.code}
                        </code>
                      </div>
                      <button className="btn-primary" onClick={() => joinClass(cls)} disabled={loadingCode}>
                        {t('dashboard.joinClass')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(148,163,184,0.2)' }}>
              <h4>{t('dashboard.haveCode')}</h4>
              <div className="flex-between mt-2" style={{ gap: '1rem' }}>
                <input 
                  type="text" 
                  placeholder={t('dashboard.enterCode')} 
                  value={manualCode}
                  onChange={e => setManualCode(e.target.value.toUpperCase())}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid #ccc' }}
                />
                <button className="btn-primary" onClick={handleManualJoin} disabled={!manualCode || loadingCode}>
                  <Search size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Self Learning Mode */}
        <div className="card-gamified" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <Compass size={64} style={{ color: 'var(--accent-secondary)', marginBottom: '1.5rem' }} />
          <h3 className="mb-2">{t('dashboard.selfLearning')}</h3>
          <p className="text-secondary mb-6">Want to learn on your own without a classroom? Explore our missions and earn points!</p>
          <button className="btn-secondary" onClick={startSelfLearning} style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} /> {t('dashboard.startAdventure')}
          </button>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
