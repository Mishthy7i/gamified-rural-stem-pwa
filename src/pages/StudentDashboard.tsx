import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Search, Compass, LogOut, ArrowRight, BookOpen } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { userData, user, signOut, updateUserData } = useAuth();
  const navigate = useNavigate();

  const [recommendedClasses, setRecommendedClasses] = useState<any[]>([]);
  const [manualCode, setManualCode] = useState('');
  const [loadingCode, setLoadingCode] = useState(false);

  useEffect(() => {
    if (userData?.school && userData?.classLevel) {
      const fetchMatches = async () => {
        try {
          let q = query(
            collection(db, 'classes'),
            where('school', '==', userData.school),
            where('teachingClass', '==', userData.classLevel)
          );
          let snap = await getDocs(q);
          
          if (snap.empty) {
            // Fallback 1: Match ONLY by School name (ignore class level formatting issues)
            q = query(collection(db, 'classes'), where('school', '==', userData.school));
            snap = await getDocs(q);
            
            if (snap.empty) {
              // Fallback 2: Match ONLY by Class level
              q = query(collection(db, 'classes'), where('teachingClass', '==', userData.classLevel));
              snap = await getDocs(q);
            }
          }
          
          const classes = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setRecommendedClasses(classes);
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
    navigate('/learning');
  };

  const handleManualJoin = async () => {
    setLoadingCode(true);
    try {
      const q = query(collection(db, 'classes'), where('code', '==', manualCode));
      const snap = await getDocs(q);
      if (!snap.empty) {
        await updateUserData({ joinedClassCode: manualCode });
        navigate('/learning');
      } else {
        alert("Invalid Classroom Code!");
      }
    } catch {
      alert("Error joining class");
    }
    setLoadingCode(false);
  };

  const startSelfLearning = () => {
    navigate('/learning');
  };

  return (
    <div className="min-h-screen" style={{ padding: '2rem', background: 'var(--bg-primary)' }}>
      <header className="flex-between mb-6">
        <div>
          <h2>Welcome, {userData?.name}! 🎓</h2>
          <p className="text-secondary">Class: {userData?.classLevel}  |  School: {userData?.school}</p>
        </div>
        <button className="btn-secondary" onClick={signOut}><LogOut size={20} /></button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Recommended Classes by School/Class */}
        <div className="card-gamified">
          <h3 className="mb-4">Recommended for You 🎯</h3>
          <p className="text-secondary text-sm mb-4">Because you are in {userData?.classLevel} at {userData?.school}:</p>
          
          {recommendedClasses.length === 0 ? (
            <div className="bg-slate-100 p-4 rounded text-center">
              No teachers from your school have signed up yet!
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
                      Join Class
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(148,163,184,0.2)' }}>
            <h4>Have a code from your teacher?</h4>
            <div className="flex-between mt-2" style={{ gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Enter Code (e.g. MATH BY XYZ)" 
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

        {/* Self Learning Mode */}
        <div className="card-gamified" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <Compass size={64} style={{ color: 'var(--accent-secondary)', marginBottom: '1.5rem' }} />
          <h3 className="mb-2">Self Learning Mode 🚀</h3>
          <p className="text-secondary mb-6">Want to learn on your own without a classroom? Explore our missions and earn points!</p>
          <button className="btn-secondary" onClick={startSelfLearning} style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} /> Start Adventure
          </button>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
