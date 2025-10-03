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
import OnboardingPage from "./routes/OnboardingLayout.jsx";
import "./index.css";

// 🔐 Компонент для перевірки авторизації
function PrivateRoute({ children }) {
  const { authToken, loading, user } = useAuth();

  console.log('PrivateRoute - authToken:', authToken);
  console.log('PrivateRoute - loading:', loading);
  console.log('PrivateRoute - user:', user);

  if (loading) return <p>Loading…</p>;
  if (!authToken) {
    console.log('No authToken - redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// 🔄 Компонент для автоматичного перенаправлення між onboarding та dashboard
function AutoRedirectRoute() {
  const { user, loading } = useAuth();
  
  if (loading) return <p>Loading…</p>;
  
  // Якщо onboarding не завершено - перенаправляємо на onboarding
  if (!user?.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }
  
  // Якщо onboarding завершено - перенаправляємо на dashboard
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

        {/* 🔐 Onboarding page - тільки для не завершених користувачів */}
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

        {/* Автоматичне перенаправлення з кореня */}
        <Route path="/" element={<PrivateRoute><AutoRedirectRoute /></PrivateRoute>} />

        {/* 🔐 Protected Dashboard - тільки для завершених користувачів */}
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
  
  if (loading) return <p>Loading…</p>;
  
  // Якщо onboarding вже завершено - перенаправляємо на dashboard
  if (hasCompletedOnboarding()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function DashboardGuard({ children }) {
  const { user, loading, hasCompletedOnboarding } = useAuth();
  
  if (loading) return <p>Loading…</p>;
  
  // Якщо onboarding не завершено - перенаправляємо на onboarding
  if (!hasCompletedOnboarding()) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return children;
}
// 🔒 Wrap entire app in AuthProvider
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <AppRouter />
  </AuthProvider>
);