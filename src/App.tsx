import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { WebLLMProvider } from "./context/WebLLMContext";
import {
  RequireAuth,
  RequireRole,
  RequireOnboarding,
  GuestOnly,
} from "./components/ProtectedRoute";
import PWABadge from "./PWABadge";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import StudentOnboarding from "./pages/StudentOnboarding";
import TeacherOnboarding from "./pages/TeacherOnboarding";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import LearningMap from "./pages/LearningMap";
import FractionsMap from "./pages/missions/FractionsMap";
import FractionsMissionOne from "./pages/missions/FractionsMissionOne";
import FractionsMissionTwo from "./pages/missions/FractionsMissionTwo";
import UserProfile from "./pages/UserProfile";
import { OfflineChatbot } from "./components/OfflineChatbot";
import "./App.css";

function AppRoutes() {
  const { userData } = useAuth();
  const isStudentWithOnboarding =
    userData?.role === "student" && userData?.hasCompletedOnboarding === true;

  return (
    <Router>
      <div className="app-container">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/auth"
              element={
                <GuestOnly>
                  <Auth />
                </GuestOnly>
              }
            />

            <Route
              path="/onboarding/student"
              element={
                <RequireAuth>
                  <RequireRole role="student">
                    <StudentOnboarding />
                  </RequireRole>
                </RequireAuth>
              }
            />
            <Route
              path="/onboarding/teacher"
              element={
                <RequireAuth>
                  <RequireRole role="teacher">
                    <TeacherOnboarding />
                  </RequireRole>
                </RequireAuth>
              }
            />

            <Route
              path="/dashboard/student"
              element={
                <RequireAuth>
                  <RequireRole role="student">
                    <RequireOnboarding>
                      <StudentDashboard />
                    </RequireOnboarding>
                  </RequireRole>
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard/teacher"
              element={
                <RequireAuth>
                  <RequireRole role="teacher">
                    <RequireOnboarding>
                      <TeacherDashboard />
                    </RequireOnboarding>
                  </RequireRole>
                </RequireAuth>
              }
            />

            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <RequireOnboarding>
                    <UserProfile />
                  </RequireOnboarding>
                </RequireAuth>
              }
            />

            <Route
              path="/map"
              element={
                <RequireAuth>
                  <RequireRole role="student">
                    <RequireOnboarding>
                      <LearningMap />
                    </RequireOnboarding>
                  </RequireRole>
                </RequireAuth>
              }
            />

            <Route
              path="/level/fractions"
              element={
                <RequireAuth>
                  <RequireRole role="student">
                    <RequireOnboarding>
                      <FractionsMap />
                    </RequireOnboarding>
                  </RequireRole>
                </RequireAuth>
              }
            />
            <Route
              path="/mission/fractions/1"
              element={
                <RequireAuth>
                  <RequireRole role="student">
                    <RequireOnboarding>
                      <FractionsMissionOne />
                    </RequireOnboarding>
                  </RequireRole>
                </RequireAuth>
              }
            />
            <Route
              path="/mission/fractions/2"
              element={
                <RequireAuth>
                  <RequireRole role="student">
                    <RequireOnboarding>
                      <FractionsMissionTwo />
                    </RequireOnboarding>
                  </RequireRole>
                </RequireAuth>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {isStudentWithOnboarding && <OfflineChatbot />}

        <PWABadge />
      </div>
    </Router>
  );
}

function App() {
  return (
    <LanguageProvider>
      <WebLLMProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </WebLLMProvider>
    </LanguageProvider>
  );
}

export default App;
