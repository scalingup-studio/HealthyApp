// pages/AuthSuccess.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../api/useAuth';

export function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    console.log('🔑 Token from URL:', token);

    if (token) {
      console.log('✅ Saving token to storage...');
      login(token);
      navigate('/', { replace: true });
    } else {
      console.error('❌ No token in URL');
      navigate('/login?error=no_token');
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className="ml-3">Завершення авторизації...</p>
    </div>
  );
}