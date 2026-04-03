import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import PWABadge from './PWABadge';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import StudentOnboarding from './pages/StudentOnboarding';
import TeacherOnboarding from './pages/TeacherOnboarding';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="app-container">
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/onboarding/student" element={<StudentOnboarding />} />
                <Route path="/onboarding/teacher" element={<TeacherOnboarding />} />
                <Route path="/dashboard/student" element={<StudentDashboard />} />
                <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
                {/* 
                <Route path="/learning" element={<LearningMap />} />
                */}
              </Routes>
            </main>
            <PWABadge />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;