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
import Layout from "./Layout.jsx";
import "./index.css";

// 🔐 Компонент для захисту приватних маршрутів
function PrivateRoute({ children }) {
  const { authToken, loading } = useAuth(); 

  console.log('PrivateRoute - authToken:', authToken); // Додайте для дебагу
  console.log('PrivateRoute - loading:', loading);

  if (loading) return <p>Loading…</p>;
  if (!authToken) { 
    console.log('No authToken - redirecting to login');
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        {/* Публічні сторінки */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage open />} />
        <Route path="/auth/callback/google" element={<OAuthCallbackGoogle />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/HealthyApp" element={<Layout />} />

        {/* Перенаправлення */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 🔐 Захищений Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
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

        {/* Будь-який інший шлях */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  );
}

// 🔑 Обгортка всього додатку в AuthProvider
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <AppRouter />
  </AuthProvider>
);
