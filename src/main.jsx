// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./api/AuthContext.jsx";
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
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import OnboardingPage from "./routes/OnboardingLayout.jsx"; // ✅ Додано сторінку onboarding
// import Layout from "./Layout.jsx";
import "./index.css";

// 🔐 Component for protecting private routes
function PrivateRoute({ children }) {
  const { authToken, loading } = useAuth();

  console.log('PrivateRoute - authToken:', authToken);
  console.log('PrivateRoute - loading:', loading);

  if (loading) return <p>Loading…</p>;
  if (!authToken) {
    console.log('No authToken - redirecting to login');
    return <Navigate to="/login" replace />;
  }
  return children;
}

// 🔐 Component for onboarding redirect - перенаправляє на onboarding якщо не завершено
function OnboardingRoute({ children }) {
  const { authToken, loading, user } = useAuth();

  if (loading) return <p>Loading…</p>;
  if (!authToken) return <Navigate to="/login" replace />;
  
  // Перевіряємо, чи користувач завершив onboarding
  // Тут можна додати логіку перевірки з бази даних або контексту
  const hasCompletedOnboarding = user?.onboarding_completed; // Припустиме поле
  
  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return children;
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

        {/* 🔐 Onboarding page - обов'язкова після авторизації */}
        <Route 
          path="/onboarding" 
          element={
            <PrivateRoute>
              <OnboardingPage />
            </PrivateRoute>
          } 
        />

        {/* Redirect root to onboarding або dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 🔐 Protected Dashboard - тепер з перевіркою onboarding */}
        <Route
          path="/dashboard"
          element={
            <OnboardingRoute>
              <DashboardLayout />
            </OnboardingRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="analytics" element={<DashboardAnalytics />} />
          <Route path="workouts" element={<DashboardWorkouts />} />
          <Route path="nutrition" element={<DashboardNutrition />} />
          <Route path="profile" element={<DashboardProfile />} />
          <Route path="settings" element={<DashboardSettings />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  );
}

// 🔒 Wrap entire app in AuthProvider
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <AppRouter />
  </AuthProvider>
);