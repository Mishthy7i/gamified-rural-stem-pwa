import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Copy, Users, UserCircle, CheckCircle2, GraduationCap, PlusCircle } from 'lucide-react';
import './Dashboard.css';

const TeacherDashboard: React.FC = () => {
  const { userData, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [myClasses, setMyClasses] = useState<any[]>([]);
  const [studentsByCode, setStudentsByCode] = useState<Record<string, any[]>>({});
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!user) return;
      try {
        const qClasses = query(collection(db, 'classes'), where('teacherId', '==', user.uid));
        const classSnap = await getDocs(qClasses);
        const classesList = classSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
        setMyClasses(classesList);

        const studentMap: Record<string, any[]> = {};
        for (const cls of classesList) {
          const qStudents = query(collection(db, 'users'), where('joinedClassCode', '==', cls.code));
          const studentSnap = await getDocs(qStudents);
          studentMap[cls.code] = studentSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
        }
        setStudentsByCode(studentMap);
      } catch (err) {
        console.error("Error fetching teacher dashboard data", err);
      }
    };
    fetchTeacherData();
  }, [user]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(text);
    setTimeout(() => setCopySuccess(''), 2000);
  };

  return (
    <div className="dashboard-container">
      {/* Background aesthetics carried over */}
      <div className="bg-gradient-mesh" style={{ position: 'fixed', opacity: 0.6 }}></div>
      <div className="bg-grid-overlay" style={{ position: 'fixed' }}></div>

      <div className="dashboard-content animate-fade-in-up">
        
        {/* Modern Glass Header */}
        <header className="dashboard-header">
          <div className="header-title-group">
            <h2>{t('teacher.dashboard')}</h2>
            <div className="header-subtitle">
              <GraduationCap size={16} color="#10b981" />
              <span>{userData?.name}</span>
              <span style={{ opacity: 0.5 }}>|</span>
              <span>{userData?.school}</span>
            </div>
          </div>
          <button className="profile-btn" onClick={() => navigate('/profile')}>
            <UserCircle size={24} />
          </button>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {myClasses.length === 0 ? (
            <div className="premium-glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ display: 'inline-flex', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', marginBottom: '1.5rem' }}>
                <Users size={48} color="#34d399" />
              </div>
              <h3 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '1rem' }}>{t('teacher.noClasses')}</h3>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
                {t('teacher.noClassesDesc')}
              </p>
              <button className="btn-glow-primary" onClick={() => navigate('/onboarding/teacher')} style={{ margin: '0 auto' }}>
                <PlusCircle size={20} /> {t('teacher.generateCode')}
              </button>
            </div>
          ) : (
            <div className="dash-grid-2">
              {myClasses.map((cls, idx) => (
                <div key={idx} className="premium-glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.4rem', color: '#34d399', marginBottom: '0.25rem' }}>{cls.subject}</h3>
                      <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Class: {cls.teachingClass}</p>
                    </div>
                    
                    {/* Code UI */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                       <p style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('teacher.classroomCode')}</p>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                        <code style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', letterSpacing: '2px' }}>{cls.code}</code>
                        <button onClick={() => copyToClipboard(cls.code)} title="Copy Code" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}>
                          {copySuccess === cls.code ? <CheckCircle2 size={20} color="#10b981" /> : <Copy size={20} className="hover:text-white" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Student Roster */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      <Users size={20} color="#34d399" />
                      <h4 style={{ color: 'white', fontSize: '1.1rem' }}>{t('teacher.enrolled')}</h4>
                      <span style={{ background: 'rgba(52, 211, 153, 0.2)', color: '#34d399', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                         {studentsByCode[cls.code]?.length || 0}
                      </span>
                    </div>

                    {!studentsByCode[cls.code] || studentsByCode[cls.code].length === 0 ? (
                      <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <p style={{ color: '#64748b', fontStyle: 'italic' }}>{t('teacher.noStudents')}</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                        {studentsByCode[cls.code].map(student => (
                          <div key={student.id} className="student-roster-item">
                            <div>
                              <strong style={{ color: 'white', display: 'block', marginBottom: '0.2rem' }}>{student.name}</strong>
                              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{t('dashboard.class')}: {student.classLevel || t('teacher.unknown')}</span>
                            </div>
                            <div style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '0.3rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                              {t('teacher.level1')}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
