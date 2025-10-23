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
  const { refreshAuth, authToken, setAuthToken, setUser, user } = useAuth();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('Initializing...');
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    async function handleCallback() {
      try {
        setStatus('Processing authentication...');
        console.log('🔄 OAuth callback page loaded');
        
        // Wait a moment for cookies to be set by browser
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if we already have authToken
        if (authToken) {
          console.log('✅ Auth token already present, checking onboarding status...');
          console.log('👤 User data:', user);
          console.log('📊 Onboarding completed:', user?.onboarding_completed);
          
          // Централізований редірект через AutoRedirectRoute
          console.log('🔁 Redirecting to root for centralized routing...');
          navigate('/', { replace: true });
          return;
        }
        
        setStatus('Getting authentication token...');
        console.log('🔄 Calling refreshAuth to exchange cookie for token...');
        
        // Use the refresh_token cookie to get authToken
        const newAuthToken = await refreshAuth();
        
        console.log('📋 refreshAuth result:', {
          newAuthToken,
          tokenLength: newAuthToken?.length,
          tokenPreview: newAuthToken?.substring(0, 20) + '...'
        });
        
        setDebugInfo({
          hasToken: !!newAuthToken,
          tokenLength: newAuthToken?.length,
          authContext: { authToken, user: useAuth().user }
        });
        
        if (!newAuthToken) {
          throw new Error('Failed to get authentication token. The login session may have expired.');
        }
        
        console.log('✅ Authentication successful!');
        setStatus('Success! Checking onboarding status...');
        
        // Small delay so user sees success message
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Отримуємо дані користувача для перевірки онбордингу
        const currentUser = useAuth().user;
        console.log('👤 Current user data:', currentUser);
        console.log('📊 Onboarding completed:', currentUser?.completed);
        console.log('📊 Onboarding completed (legacy):', currentUser?.onboarding_completed);
        
        // Перевіряємо статус онбордингу і перенаправляємо відповідно
        if (currentUser?.completed === true || currentUser?.onboarding_completed === true) {
          console.log('🎯 Onboarding completed. Redirecting to root...');
          setStatus('Success! Redirecting...');
          navigate('/', { replace: true });
        } else {
          console.log('📝 Onboarding not completed. Redirecting to root...');
          setStatus('Success! Redirecting...');
          navigate('/', { replace: true });
        }
        
      } catch (err) {
        console.error('❌ OAuth callback error:', err);
        console.error('Error details:', {
          message: err.message,
          status: err.status,
          data: err.data
        });
        
        const errorMessage = err.message || 'Failed to complete Google login';
        setError(errorMessage);
        setDebugInfo({
          error: errorMessage,
          errorStatus: err.status,
          errorData: err.data
        });
        
        // Redirect to login after 5 seconds so user can read error
        // setTimeout(() => {
        //   navigate('/login', { 
        //     replace: true,
        //     state: { error: errorMessage }
        //   });
        // }, 5000);
      }
    }
    
    const timer = setTimeout(handleCallback, 200);
    return () => clearTimeout(timer);
    
  }, [navigate, refreshAuth, authToken]);

  if (error) {
    return (
      <div style={{ 
        maxWidth: 600, 
        margin: '100px auto', 
        padding: 24, 
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#111',
        color: '#fff'
      }}>
        <div style={{ fontSize: 48, marginBottom: 16, textAlign: 'center' }}>❌</div>
        <h3 style={{ color: '#ff4c4c', marginTop: 0, textAlign: 'center' }}>Authentication Failed</h3>
        <p style={{ color: '#ccc', marginBottom: 8, textAlign: 'center' }}>{error}</p>
        
        {debugInfo && (
          <details style={{ marginTop: 20, padding: 12, backgroundColor: '#1a1a1a', borderRadius: 4 }}>
            <summary style={{ cursor: 'pointer', color: '#00bace' }}>Debug Info</summary>
            <pre style={{ 
              fontSize: 11, 
              overflow: 'auto', 
              marginTop: 8,
              padding: 8,
              backgroundColor: '#0a0a0a',
              borderRadius: 4
            }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        )}
        
        <p style={{ fontSize: '14px', color: '#777', textAlign: 'center', marginTop: 16 }}>
          Redirecting to login in 5 seconds...
        </p>
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
      
      {debugInfo && (
        <details style={{ marginTop: 20, padding: 12, backgroundColor: '#1a1a1a', borderRadius: 4, textAlign: 'left' }}>
          <summary style={{ cursor: 'pointer', color: '#00bace', textAlign: 'center' }}>Debug Info</summary>
          <pre style={{ 
            fontSize: 11, 
            overflow: 'auto', 
            marginTop: 8,
            padding: 8,
            backgroundColor: '#0a0a0a',
            borderRadius: 4
          }}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </details>
      )}
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}