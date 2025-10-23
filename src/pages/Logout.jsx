import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext.jsx';

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        console.log('🚪 Logging out user...');
        
        // Call logout function from AuthContext
        await logout();
        
        console.log('✅ Logout successful, redirecting to login...');
        
        // Redirect to login page
        navigate('/login', { replace: true });
      } catch (error) {
        console.error('❌ Error during logout:', error);
        
        // Even if logout fails, redirect to login
        navigate('/login', { replace: true });
      }
    };

    performLogout();
  }, [logout, navigate]);

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
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
