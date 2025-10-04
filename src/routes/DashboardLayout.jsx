import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../api/AuthContext";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { logout } = useAuth();

  const handleLogOut = async () => {

    await logout();

    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    localStorage.removeItem('refresh_token');

    navigate("/login");
  }

  React.useEffect(() => { setMenuOpen(false); }, [location.pathname]);
  return (
    <div className={`dash-layout ${menuOpen ? "menu-open" : ""}`}>
      <header className="dash-header">
        <h1>HealthyApp</h1>
      </header>
      <button className="hamburger" aria-label="Open menu" aria-expanded={menuOpen} aria-controls="sidebar" onClick={() => setMenuOpen(v => !v)}>
        <span />
        <span />
        <span />
      </button>
      <aside id="sidebar" className="dash-sidebar" role="navigation">
        <h2 className="dash-brand">HealthyApp</h2>
        <div className="dash-nav">
          <NavLink end className={({ isActive }) => `dash-link ${isActive ? "active" : ""}`} to="/dashboard">Overview</NavLink>
          <NavLink className={({ isActive }) => `dash-link ${isActive ? "active" : ""}`} to="/dashboard/analytics">Analytics</NavLink>
          <NavLink className={({ isActive }) => `dash-link ${isActive ? "active" : ""}`} to="/dashboard/workouts">Workouts</NavLink>
          <NavLink className={({ isActive }) => `dash-link ${isActive ? "active" : ""}`} to="/dashboard/nutrition">Nutrition</NavLink>
          <NavLink className={({ isActive }) => `dash-link ${isActive ? "active" : ""}`} to="/dashboard/profile">Profile</NavLink>
          <NavLink className={({ isActive }) => `dash-link ${isActive ? "active" : ""}`} to="/dashboard/settings">Settings</NavLink>
          <NavLink className={({ isActive }) => `dash-link ${isActive ? "active" : ""}`} to="/dashboard/health-history">Health history</NavLink>
        </div>
        <div style={{ marginTop: 16 }}>
          <button className="btn outline" onClick={handleLogOut}>Log out</button>
        </div>
      </aside>
      {menuOpen && <div className="dash-backdrop" onClick={() => setMenuOpen(false)} />}
      <section className="dash-content">
        <div className="dash-toolbar">
          <h1 style={{ margin: 0 }}>Dashboard</h1>
        </div>
        <Outlet />
      </section>
    </div>
  );
}


