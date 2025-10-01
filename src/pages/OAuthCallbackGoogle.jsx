// pages/OAuthCallbackGoogle.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';

/**
 * Handles OAuth callback after Xano sets refresh_token cookie
 * 
 * Flow:
 * 1. Google redirects to Xano with code
 * 2. Xano processes, sets HttpOnly refresh_token cookie
 * 3. Xano redirects here
 * 4. We call refreshAuth() which uses the cookie to get authToken
 * 5. Redirect to dashboard
 */
export default function OAuthCallbackGoogle() {
  const navigate = useNavigate();
  const { refreshAuth, authToken } = useAuth();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    async function handleCallback() {
      try {
        setStatus('Processing authentication...');
        console.log('🔄 OAuth callback page loaded');
        
        // Wait a moment for cookies to be set by browser
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if we already have authToken (shouldn't happen but just in case)
        if (authToken) {
          console.log('✅ Auth token already present, redirecting...');
          navigate('/dashboard', { replace: true });
          return;
        }
        
        setStatus('Getting authentication token...');
        console.log('🔄 Calling refreshAuth to exchange cookie for token...');
        
        // Use the refresh_token cookie to get authToken
        // The cookie is HttpOnly so we can't read it, but it's automatically
        // sent with the refresh request to Xano
        const newAuthToken = await refreshAuth();
        
        if (!newAuthToken) {
          throw new Error('Failed to get authentication token. The login session may have expired.');
        }
        
        console.log('✅ Authentication successful!');
        setStatus('Success! Redirecting to dashboard...');
        
        // Small delay so user sees success message
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Redirect to dashboard
        navigate('/dashboard', { replace: true });
        
      } catch (err) {
        console.error('❌ OAuth callback error:', err);
        const errorMessage = err.message || 'Failed to complete Google login';
        setError(errorMessage);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { 
            replace: true,
            state: { error: errorMessage }
          });
        }, 3000);
      }
    }
    
    // Start the process after a small delay
    const timer = setTimeout(handleCallback, 200);
    return () => clearTimeout(timer);
    
  }, [navigate, refreshAuth, authToken]);

  if (error) {
    return (
      <div style={{ 
        maxWidth: 400, 
        margin: '100px auto', 
        padding: 24, 
        textAlign: 'center',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#111',
        color: '#fff'
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
        <h3 style={{ color: '#ff4c4c', marginTop: 0 }}>Authentication Failed</h3>
        <p style={{ color: '#ccc', marginBottom: 8 }}>{error}</p>
        <p style={{ fontSize: '14px', color: '#777' }}>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: 400, 
      margin: '100px auto', 
      padding: 24, 
      textAlign: 'center',
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      backgroundColor: '#111',
      color: '#fff'
    }}>
      <h3 style={{ marginTop: 0, color: '#00bace' }}>Completing Google Sign-In</h3>
      <p style={{ color: '#ccc', marginBottom: 24 }}>{status}</p>
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          border: '3px solid #222',
          borderTop: '3px solid #00bace',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}