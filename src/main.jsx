// main.jsx
import React, { useEffect } from "react";
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
import DashboardInsights from "./routes/pages/Insights.jsx";
import DashboardWorkouts from "./routes/pages/Workouts.jsx";
import DashboardNutrition from "./routes/pages/Nutrition.jsx";
import DashboardProfile from "./routes/pages/Profile.jsx";
import DashboardSettings from "./routes/pages/Settings.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage-TEST.jsx";
import OnboardingPage from "./routes/OnboardingLayout.jsx";
import Logout from "./pages/Logout.jsx";

import "./index.css";

/**
 * Private Route - Requires Authentication
 */
function PrivateRoute({ children }) {
  const { authToken, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated()) {
    console.log('⚠️ Not authenticated - redirecting to login');
    return <Navigate to="/login" replace />;
  }

  return children;
}

/**
 * Auto Redirect Route - Smart routing based on auth/onboarding status
 */
function AutoRedirectRoute() {
  const { user, loading, isAuthenticated, hasCompletedOnboarding } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Not authenticated - go to login
  if (!isAuthenticated()) {
    console.log('⚠️ Not authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  // Authenticated but onboarding incomplete - go to onboarding
  if (!hasCompletedOnboarding()) {
    console.log('📝 Onboarding not completed, redirecting to /onboarding');
    return <Navigate to="/onboarding" replace />;
  }

  // All good - go to dashboard
  console.log('✅ All checks passed, redirecting to /dashboard');
  return <Navigate to="/dashboard" replace />;
}

/**
 * Onboarding Guard - Only allow access if onboarding is NOT complete
 */
function OnboardingGuard({ children }) {
  const { user, loading, hasCompletedOnboarding } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If onboarding is complete, redirect to dashboard
  if (hasCompletedOnboarding()) {
    console.log('✅ Onboarding already completed, redirecting to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // Onboarding not complete - allow access
  return children;
}

/**
 * Dashboard Guard - Requires both auth and completed onboarding
 */
function DashboardGuard({ children }) {
  const { user, loading, isAuthenticated, hasCompletedOnboarding } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated()) {
    console.log('⚠️ Not authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  // Onboarding not complete
  if (!hasCompletedOnboarding()) {
    console.log('📝 Onboarding not completed, redirecting to /onboarding');
    return <Navigate to="/onboarding" replace />;
  }

  // All checks passed
  return children;
}

/**
 * Public Only Route - Redirect if authenticated
 */
function PublicOnlyRoute({ children }) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated()) {
    console.log('ℹ️ Already authenticated, redirecting to root');
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        {/* Public pages - redirect if already authenticated */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <SignupPage open />
            </PublicOnlyRoute>
          }
        />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/logout" element={<Logout />} />

        {/* OAuth callback routes */}
        <Route path="/auth/callback/google" element={<OAuthCallbackGoogle />} />
        <Route path="/auth/success" element={<OAuthCallbackGoogle />} />

        {/* Onboarding page - only for non-completed users */}
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

        {/* Root - smart redirect */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AutoRedirectRoute />
            </PrivateRoute>
          }
        />

        {/* Protected Dashboard */}
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
          <Route path="insights" element={<DashboardInsights />} />
          <Route path="workouts" element={<DashboardWorkouts />} />
          <Route path="nutrition" element={<DashboardNutrition />} />
          <Route path="profile" element={<DashboardProfile />} />
          <Route path="settings" element={<DashboardSettings />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

// Wrap entire app
// 🛡️ Захисник для onboarding - не дозволяє доступ якщо вже завершено
function OnboardingGuard({ children }) {
  const { user, loading, hasCompletedOnboarding, isNewUser } = useAuth();

  // Check onboarding status once
  const onboardingCompleted = hasCompletedOnboarding();

  console.log('🛡️ OnboardingGuard - Debug info:', {
    loading,
    isNewUser,
    user: user ? {
      id: user.id,
      email: user.email,
      onboarding_completed: user.onboarding_completed
    } : null,
    hasCompletedOnboardingResult: onboardingCompleted
  });

  if (loading) {
    console.log('⏳ OnboardingGuard - Still loading...');
    return <p>Loading…</p>;
  }

  // Якщо onboarding вже завершено - перенаправляємо на dashboard
  if (onboardingCompleted) {
    console.log('🎯 OnboardingGuard - Onboarding already completed, redirecting to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('📝 OnboardingGuard - Onboarding not completed, allowing access to onboarding');
  return children;
}

function DashboardGuard({ children }) {
  const { user, loading, hasCompletedOnboarding, isNewUser } = useAuth();

  // Check onboarding status once
  const onboardingCompleted = hasCompletedOnboarding();

  console.log('🛡️ DashboardGuard - Debug info:', {
    loading,
    isNewUser,
    user: user ? {
      id: user.id,
      email: user.email,
      onboarding_completed: user.onboarding_completed
    } : null,
    hasCompletedOnboardingResult: onboardingCompleted
  });

  if (loading) {
    console.log('⏳ DashboardGuard - Still loading...');
    return <p>Loading…</p>;
  }

  // Якщо onboarding не завершено - перенаправляємо на onboarding
  if (!onboardingCompleted) {
    console.log('📝 DashboardGuard - Onboarding not completed, redirecting to /onboarding');
    return <Navigate to="/onboarding" replace />;
  }

  console.log('🎯 DashboardGuard - Allowing access to dashboard (onboarding check enabled)');
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
