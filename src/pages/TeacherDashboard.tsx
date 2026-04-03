import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Copy, Users, LogOut, CheckCircle2 } from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const { userData, user, signOut } = useAuth();
  const navigate = useNavigate();

  const [myClasses, setMyClasses] = useState<any[]>([]);
  const [studentsByCode, setStudentsByCode] = useState<Record<string, any[]>>({});
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!user) return;
      try {
        // Fetch classes created by this teacher
        const qClasses = query(collection(db, 'classes'), where('teacherId', '==', user.uid));
        const classSnap = await getDocs(qClasses);
        const classesList = classSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMyClasses(classesList);

        // Fetch students for each code
        const studentMap: Record<string, any[]> = {};
        for (const cls of classesList) {
          const qStudents = query(collection(db, 'users'), where('joinedClassCode', '==', cls.code));
          const studentSnap = await getDocs(qStudents);
          studentMap[cls.code] = studentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
    <div className="min-h-screen" style={{ padding: '2rem', background: 'var(--bg-primary)' }}>
      <header className="flex-between mb-6">
        <div>
          <h2>Teacher Dashboard 👨‍🏫</h2>
          <p className="text-secondary">{userData?.name} • {userData?.school}</p>
        </div>
        <button className="btn-secondary" onClick={signOut}><LogOut size={20} /></button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr)', gap: '2rem' }}>
        
        {myClasses.length === 0 ? (
          <div className="card-gamified text-center">
            <h3>No Classes Found</h3>
            <p className="text-secondary mb-4">You have not generated any active classrooms yet.</p>
            <button className="btn-primary" onClick={() => navigate('/onboarding/teacher')}>Generate a Code</button>
          </div>
        ) : (
          myClasses.map((cls, idx) => (
            <div key={idx} className="card-gamified">
              <div className="flex-between mb-4 border-b pb-4" style={{ borderBottom: '1px solid rgba(148,163,184,0.2)' }}>
                <div>
                  <h3 style={{ color: 'var(--accent-primary)' }}>{cls.subject} ({cls.teachingClass})</h3>
                  <p className="text-secondary text-sm">Classroom Code</p>
                </div>
                
                {/* Code UI */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-primary)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px dashed var(--accent-secondary)' }}>
                  <code style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{cls.code}</code>
                  <button onClick={() => copyToClipboard(cls.code)} title="Copy Code" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    {copySuccess === cls.code ? <CheckCircle2 size={20} color="green" /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              {/* Student Roster */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Users size={18} className="text-secondary" />
                  <h4 className="text-secondary">Enrolled Students</h4>
                </div>

                {!studentsByCode[cls.code] || studentsByCode[cls.code].length === 0 ? (
                  <p className="text-sm text-secondary italic">No students have joined using this code yet.</p>
                ) : (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {studentsByCode[cls.code].map(student => (
                      <div key={student.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--border-radius-sm)', borderLeft: '4px solid var(--accent-primary)' }}>
                        <div>
                          <strong>{student.name}</strong>
                          <span className="text-sm text-secondary ml-2">Class Level: {student.classLevel || 'Unknown'}</span>
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-secondary)' }}>
                          Level 1
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default TeacherDashboard;
