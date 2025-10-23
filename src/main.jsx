// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./api/AuthContext.jsx";
import { NotificationProvider } from "./api/NotificationContext.jsx";
import { LoginPage } from "./pages/Login.jsx";
import { SignupPage } from "./pages/Signup.jsx";
import OAuthCallbackGoogle from "./pages/OAuthCallbackGoogle.jsx";
import DashboardLayout from "./routes/DashboardLayout.jsx";
import DashboardHome from "./routes/pages/Home.jsx";
import DashboardAnalytics from "./routes/pages/Analytics.jsx";
import DashboardWorkouts from "./routes/pages/Workouts.jsx";
import DashboardNutrition from "./routes/pages/Nutrition.jsx";
import DashboardProfile from "./routes/pages/Profile.jsx";
import DashboardSettings from "./routes/pages/Settings.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage-TEST.jsx";
import OnboardingPage from "./routes/OnboardingLayout.jsx";
import HealthDataPage from "./routes/pages/HealthDataPage-TEST.jsx";

import "./index.css";
import HealthHistoryPage from "./routes/pages/HealthHistoryPage-TEST.jsx";
import MedicalRecordsPage from "./routes/pages/MedicalRecordsPage-TEST.jsx";

// 🔐 Component for authorization verification
function PrivateRoute({ children }) {
  const { authToken, loading, user } = useAuth();

  // console.log('PrivateRoute - authToken:', authToken);
  // console.log('PrivateRoute - loading:', loading);
  // console.log('PrivateRoute - user:', user);

  if (loading) return <p>Loading…</p>;
  if (!authToken) {
    console.log('No authToken - redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// 🔄 Component for automatic redirection between onboarding and dashboard
function AutoRedirectRoute() {
  const { user, loading, hasCompletedOnboarding } = useAuth();
  
  console.log('🔄 AutoRedirectRoute - Debug info:', {
    loading,
    user: user ? {
      id: user.id,
      email: user.email,
      onboarding_completed: user.onboarding_completed,
      hasCompletedOnboarding: hasCompletedOnboarding?.()
    } : null,
    hasCompletedOnboardingResult: hasCompletedOnboarding?.()
  });
  
  if (loading) {
    console.log('⏳ AutoRedirectRoute - Still loading...');
    return <p>Loading…</p>;
  }
  
  // If onboarding is not completed - redirect to onboarding
  if (!hasCompletedOnboarding?.() && !user?.onboarding_completed) {
    console.log('📝 AutoRedirectRoute - Onboarding not completed, redirecting to /onboarding');
    return <Navigate to="/onboarding" replace />;
  }
  
  // If onboarding is complete - redirect to dashboard
  console.log('🎯 AutoRedirectRoute - Onboarding completed, redirecting to /dashboard');
  return <Navigate to="/dashboard" replace />;
}

function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage open />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* ✅ Google OAuth callback route */}
        <Route path="/auth/callback/google" element={<OAuthCallbackGoogle />} />
        <Route path="/auth/success" element={<OAuthCallbackGoogle />} />

        {/* 🔐 Onboarding page - only for non-completed users */}
        <Route 
          path="/onboarding" 
          element={
            <PrivateRoute>
              <OnboardingGuard>
                <OnboardingPage />
              </OnboardingGuard>
            </PrivateRoute>
          } 
        />

       {/* Automatic redirect from root */}
        <Route path="/" element={<PrivateRoute><AutoRedirectRoute /></PrivateRoute>} />

       {/* 🔐 Protected Dashboard - for advanced users only */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <DashboardGuard>
                <DashboardLayout />
              </DashboardGuard>
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="analytics" element={<DashboardAnalytics />} />
          <Route path="workouts" element={<DashboardWorkouts />} />
          <Route path="nutrition" element={<DashboardNutrition />} />
          <Route path="profile" element={<DashboardProfile />} />
          <Route path="settings" element={<DashboardSettings />} />
          <Route path="health-history" element={<HealthHistoryPage />} />
          <Route path="health-data" element={<HealthDataPage />} />
          <Route path="medical_records" element={<MedicalRecordsPage />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

// 🛡️ Захисник для onboarding - не дозволяє доступ якщо вже завершено
function OnboardingGuard({ children }) {
  const { user, loading, hasCompletedOnboarding } = useAuth();
  
  console.log('🛡️ OnboardingGuard - Debug info:', {
    loading,
    user: user ? {
      id: user.id,
      email: user.email,
      onboarding_completed: user.onboarding_completed
    } : null,
    hasCompletedOnboardingResult: hasCompletedOnboarding?.()
  });
  
  if (loading) {
    console.log('⏳ OnboardingGuard - Still loading...');
    return <p>Loading…</p>;
  }
  
  // Якщо onboarding вже завершено - перенаправляємо на dashboard
  if (hasCompletedOnboarding()) {
    console.log('🎯 OnboardingGuard - Onboarding already completed, redirecting to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log('📝 OnboardingGuard - Onboarding not completed, allowing access to onboarding');
  return children;
}

function DashboardGuard({ children }) {
  const { user, loading, hasCompletedOnboarding } = useAuth();
  
  console.log('🛡️ DashboardGuard - Debug info:', {
    loading,
    user: user ? {
      id: user.id,
      email: user.email,
      onboarding_completed: user.onboarding_completed
    } : null,
    hasCompletedOnboardingResult: hasCompletedOnboarding?.()
  });
  
  if (loading) {
    console.log('⏳ DashboardGuard - Still loading...');
    return <p>Loading…</p>;
  }
  
  // Якщо onboarding не завершено - перенаправляємо на onboarding
  if (!hasCompletedOnboarding()) {
    console.log('📝 DashboardGuard - Onboarding not completed, redirecting to /onboarding');
    return <Navigate to="/onboarding" replace />;
  }
  
  console.log('🎯 DashboardGuard - Onboarding completed, allowing access to dashboard');
  return children;
}
// 🔒 Wrap entire app in AuthProvider and NotificationProvider
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <NotificationProvider>
      <AppRouter />
    </NotificationProvider>
  </AuthProvider>
);