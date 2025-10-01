import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';
import { AuthApi } from '../api/authApi';

function OAuthCallbackGoogle() {
  const navigate = useNavigate();
  const { setAuthToken, setUser } = useAuth();

  useEffect(() => {
    async function handleGoogleCallback() {
      try {
        console.log('🔄 Processing Google OAuth callback...');
        console.log('🍪 Current cookies:', document.cookie);
        
        // Перевіряємо чи є refresh_token cookie
        const hasRefreshToken = document.cookie.includes('refresh_token=');
        
        if (hasRefreshToken) {
          console.log('✅ Refresh token found, getting auth token...');
          
          // Використовуємо refresh token для отримання authToken
          try {
            const refreshRes = await AuthApi.refreshToken();
            console.log('🔑 Refresh response:', refreshRes);
            
            if (refreshRes?.authToken) {
              setAuthToken(refreshRes.authToken);
              setUser(refreshRes.user ?? null);
              
              // Зберігаємо в localStorage для надійності
              localStorage.setItem('authToken', refreshRes.authToken);
              if (refreshRes.user) {
                localStorage.setItem('user', JSON.stringify(refreshRes.user));
              }
              
              console.log('✅ Google OAuth successful, redirecting to dashboard');
              navigate('/dashboard');
            } else {
              throw new Error('No authToken received from refresh');
            }
          } catch (refreshError) {
            console.error('❌ Failed to get auth token:', refreshError);
            navigate('/login?error=token_refresh_failed');
          }
        } else {
          console.error('❌ No refresh token found after Google OAuth');
          navigate('/login?error=no_refresh_token');
        }
      } catch (error) {
        console.error('❌ Google OAuth processing error:', error);
        navigate('/login?error=oauth_failed');
      }
    }

    // Додаємо невелику затримку, щоб cookies встигли встановитися
    setTimeout(handleGoogleCallback, 100);
  }, [navigate, setAuthToken, setUser]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Processing Google login...</h2>
      <p>Please wait while we complete your authentication.</p>
    </div>
  );
}

export default OAuthCallbackGoogle;