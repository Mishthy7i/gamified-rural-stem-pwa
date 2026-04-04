import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import PWABadge from './PWABadge';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import StudentOnboarding from './pages/StudentOnboarding';
import TeacherOnboarding from './pages/TeacherOnboarding';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import LearningMap from './pages/LearningMap';
import FractionsMap from './pages/missions/FractionsMap';
import FractionsMissionOne from './pages/missions/FractionsMissionOne';
import FractionsMissionTwo from './pages/missions/FractionsMissionTwo';
import UserProfile from './pages/UserProfile';
import { OfflineChatbot } from './components/OfflineChatbot';
import './App.css';

function AppRoutes() {
  const { userData } = useAuth();
  const isStudent = userData?.role === 'student';

  return (
    <Router>
      <div className="app-container">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding/student" element={<StudentOnboarding />} />
            <Route path="/onboarding/teacher" element={<TeacherOnboarding />} />
            
            {/* Protected App Routes */}
            <Route path="/dashboard/student" element={<StudentDashboard />} />
            <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            
            {/* Core Game Map Paths */}
            <Route path="/map" element={<LearningMap />} />
            
            {/* Mission Level 1 Sub-Paths */}
            <Route path="/level/fractions" element={<FractionsMap />} />
            <Route path="/mission/fractions/1" element={<FractionsMissionOne />} />
            <Route path="/mission/fractions/2" element={<FractionsMissionTwo />} />

            {/* 404 Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* Global Chatbot for Students ONLY */}
        {isStudent && <OfflineChatbot />}
        
        <PWABadge />
      </div>
    </Router>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;