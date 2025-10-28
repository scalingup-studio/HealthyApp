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
  const { user, loading, hasCompletedOnboarding, isNewUser } = useAuth();
  
  // Check onboarding status once
  const onboardingCompleted = hasCompletedOnboarding();
  
  console.log('🔄 AutoRedirectRoute - Debug info:', {
    loading,
    isNewUser,
    user: user ? {
      id: user.id,
      email: user.email,
      completed: user.completed,
      onboarding_completed: user.onboarding_completed,
    } : null,
    hasCompletedOnboardingResult: onboardingCompleted,
    willRedirectToOnboarding: !onboardingCompleted
  });
  
  // Track changes in onboarding status
  useEffect(() => {
    console.log('🔄 AutoRedirectRoute - useEffect triggered:', {
      loading,
      isNewUser,
      onboardingCompleted,
      willRedirect: !onboardingCompleted,
      currentHash: window.location.hash
    });
    
    // Force redirect if needed
    if (!loading && !onboardingCompleted && window.location.hash !== '#/onboarding') {
      console.log('🔄 AutoRedirectRoute - Force redirecting to onboarding...');
      window.location.href = '#/onboarding';
    }
  }, [loading, onboardingCompleted, isNewUser]);
  
  if (loading) {
    console.log('⏳ AutoRedirectRoute - Still loading...');
    return <p>Loading…</p>;
  }
  
  // If onboarding is not completed - redirect to onboarding
  if (!onboardingCompleted) {
    console.log('📝 AutoRedirectRoute - Onboarding not completed, redirecting to /onboarding');
    console.log('🔄 AutoRedirectRoute - Rendering Navigate component to /onboarding');
    
    // Fallback: if Navigate doesn't work, try window.location
    setTimeout(() => {
      if (window.location.hash !== '#/onboarding') {
        console.log('🔄 AutoRedirectRoute - Navigate failed, using window.location fallback');
        window.location.href = '#/onboarding';
      }
    }, 100);
    
    return <Navigate to="/onboarding" replace />;
  }
  
  // Redirect to dashboard if onboarding is completed
  console.log('🎯 AutoRedirectRoute - Redirecting to /dashboard (onboarding check enabled)');
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
        <Route path="/logout" element={<Logout />} />

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