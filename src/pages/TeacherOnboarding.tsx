import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { ArrowRight, KeyRound } from 'lucide-react';
import './Onboarding.css';

const TeacherOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUserData } = useAuth();

  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [subject, setSubject] = useState('Math');
  const [teachingClass, setTeachingClass] = useState('Class 6');
  
  const [generatedCode, setGeneratedCode] = useState('');

  const handleGenerateCode = async () => {
    if (!user) return;
    
    // Format: SUBJECT BY NAME CODE-RANDOM
    const prefix = `${subject.toUpperCase()} BY ${name.toUpperCase().split(' ')[0]} MAM`.substring(0, 20);
    const codeStr = `${prefix} CODE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setGeneratedCode(codeStr);
    
    // Update user profile
    await updateUserData({
      name,
      school,
      subjectCode: codeStr,
      hasCompletedOnboarding: true,
    });
    
    // Add classroom code mapping to classes collection
    const classesRef = collection(db, 'classes');
    await addDoc(classesRef, {
      teacherId: user.uid,
      teacherName: name,
      school: school,
      subject: subject,
      teachingClass: teachingClass,
      code: codeStr,
      students: [],
      created: Date.now()
    });
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card card-gamified animate-slide-up">
        <h2>Teacher Setup</h2>
        
        {!generatedCode ? (
          <div className="form-step mt-6">
            <input 
              type="text" 
              placeholder="Full Name (e.g. Priya Sharma)" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full mb-4"
            />
            
            <input 
              type="text" 
              placeholder="School Name" 
              value={school} 
              onChange={e => setSchool(e.target.value)} 
              className="w-full mb-4"
            />

            <select 
              value={subject} 
              onChange={e => setSubject(e.target.value)}
              className="w-full select-input mb-4"
            >
              <option value="Math">Math</option>
              <option value="Science">Science</option>
            </select>

            <select 
              value={teachingClass} 
              onChange={e => setTeachingClass(e.target.value)}
              className="w-full select-input mb-4"
            >
              <option value="Class 6">Class 6</option>
              <option value="Class 7">Class 7</option>
            </select>

            <button className="btn-primary w-full" onClick={handleGenerateCode} disabled={!name || !school}>
              Generate Subject Code <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className="form-step code-generation-step mt-6 text-center">
            <KeyRound size={48} className="text-emerald mx-auto mb-4" style={{ color: "var(--accent-success)" }} />
            <h3>Your Classroom Code is Ready!</h3>
            
            <div className="code-display my-6">
              <code>{generatedCode}</code>
            </div>
            
            <p className="text-secondary text-sm mb-6">
              Share this exact code with your students. They will use it to enter your learning track!
            </p>

            <button className="btn-primary w-full" onClick={() => navigate('/dashboard/teacher')}>
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherOnboarding;
