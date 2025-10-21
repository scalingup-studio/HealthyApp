import React from "react";
import { Logo } from "../components/Logo.jsx";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../api/AuthContext";
import NotificationSystem from "../components/NotificationSystem.jsx";
import { useNotifications } from "../api/NotificationContext.jsx";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { logout } = useAuth();
  const { notifications, removeNotification } = useNotifications();

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
        <Logo height={28} />
      </header>
      <button className="hamburger" aria-label="Open menu" aria-expanded={menuOpen} aria-controls="sidebar" onClick={() => setMenuOpen(v => !v)}>
        <span />
        <span />
        <span />
      </button>
      <aside id="sidebar" className="dash-sidebar" role="navigation" style={{ display:'flex', flexDirection:'column' }}>
        <div className="dash-brand" style={{ display:'flex', alignItems:'center', gap:8 }}>
          <Logo height={28} />
        </div>
        <div className="dash-nav" style={{ flex: 1 }}>
          <NavLink end className={({ isActive }) => `dash-link ${isActive ? "active" : ""}`} to="/dashboard">Overview</NavLink>
          <NavLink className={({ isActive }) => `dash-link ${isActive ? "active" : ""}`} to="/dashboard/analytics">Analytics</NavLink>
          <NavLink className={({ isActive }) => `dash-link ${isActive ? "active" : ""}`} to="/dashboard/workouts">Workouts</NavLink>
          <NavLink className={({ isActive }) => `dash-link ${isActive ? "active" : ""}`} to="/dashboard/nutrition">Nutrition</NavLink>
          <NavLink className={({ isActive }) => `dash-link ${isActive ? "active" : ""}`} to="/dashboard/profile">Profile</NavLink>
          <NavLink className={({ isActive }) => `dash-link ${isActive ? "active" : ""}`} to="/dashboard/settings">Settings</NavLink>
          <NavLink className={({ isActive }) => `dash-link ${isActive ? "active" : ""}`} to="/dashboard/health-history">Health history</NavLink>
          <NavLink className={({ isActive }) => `dash-link ${isActive ? "active" : ""}`} to="/dashboard/health-data">Health Data</NavLink>
          <NavLink className={({ isActive }) => `dash-link ${isActive ? "active" : ""}`} to="/dashboard/medical_records">Medical Records</NavLink>


        </div>
        <UserSummaryAndLogout onLogout={handleLogOut} />
      </aside>
      {menuOpen && <div className="dash-backdrop" onClick={() => setMenuOpen(false)} />}
      <section className="dash-content">
        <div className="dash-toolbar">
          <h1 style={{ margin: 0 }}>Dashboard</h1>
        </div>
        <Outlet />
      </section>
      
      <NotificationSystem 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </div>
  );
}

function UserSummaryAndLogout({ onLogout }) {
  const { user } = useAuth();
  const initials = (user?.first_name || user?.name || '?')[0]?.toUpperCase() + (user?.last_name?.[0]?.toUpperCase() || '');
  return (
    <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border, #ececec)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
        <div style={{ width:36, height:36, borderRadius:999, background:'#ddd', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600 }}>
          {initials}
        </div>
        <div style={{ minWidth:0 }}>
          <div style={{ fontWeight:600, lineHeight:1.2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            {user?.first_name || user?.name || 'User'} {user?.last_name || ''}
          </div>
          <div style={{ fontSize:12, color:'#666', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            {user?.email || '—'}
          </div>
        </div>
      </div>
      <button className="btn outline" style={{ width:'100%' }} onClick={onLogout}>Log out</button>
    </div>
  );
}


