import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { StudentDashboard } from './pages/StudentDashboard';
import { EditProfile } from './pages/EditProfile';
import { MySkills } from './pages/MySkills';
import { DiscoverStudents } from './pages/DiscoverStudents';
import { SkillMatching } from './pages/SkillMatching';
import { PersonalizedRecommendations } from './pages/PersonalizedRecommendations';
import { Chat } from './pages/Chat';
import { Connections } from './pages/Connections';
import { AdminDashboard } from './pages/AdminDashboard';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Student Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/chat"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                    <Chat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/recommendations"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                    <PersonalizedRecommendations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/profile"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/profile/edit"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                    <EditProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/skills"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                    <MySkills />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/discover"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                    <DiscoverStudents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/matching"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                    <SkillMatching />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/connections"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                    <Connections />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
