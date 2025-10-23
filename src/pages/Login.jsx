import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Logo } from "../components/Logo.jsx";
import { SignupPage } from "./Signup.jsx";
import { ForgotPasswordModal } from "../components/ForgotPasswordModal.jsx";
import { AuthApi } from "../api/authApi";
import { useAuth } from "../api/AuthContext";
import { useNotifications } from "../api/NotificationContext.jsx";
import NotificationSystem from "../components/NotificationSystem.jsx";

export function LoginPage({ onOpenSignup }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [remember, setRemember] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [emailHint, setEmailHint] = React.useState("");
  const [passwordHint, setPasswordHint] = React.useState("");
  const [forgotOpen, setForgotOpen] = React.useState(false);
  const [signupOpen, setSignupOpen] = React.useState(false);
  
  const navigate = useNavigate();
  const { login, authToken, setAuthToken, setUser, hasCompletedOnboarding } = useAuth();
  const { notifications, removeNotification, showSuccess, showError } = useNotifications(); 

  function validate() {
    let ok = true;
    setEmailHint("");
    setPasswordHint("");
    if (!email || !/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(email)) {
      setEmailHint("Please enter a valid email");
      ok = false;
    }
    if (!password) {
      setPasswordHint("Please enter your password");
      ok = false;
    }
    return ok;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    
    try {
      setLoading(true);
      
      // ✅ Використовуємо AuthApi напряму для більшого контролю
      const response = await AuthApi.login({ email, password });
      console.log('🔍 API Login response:', response);
      
      if (response.authToken) {
        // ✅ Оновлюємо контекст вручну
        setAuthToken(response.authToken);
        setUser(response.user ?? null);
        
        console.log('✅ Auth context updated, checking onboarding status...');
        console.log('👤 User data:', response.user);
        console.log('📊 Onboarding completed:', response.user?.completed);
        console.log('📊 Onboarding completed (legacy):', response.user?.onboarding_completed);
        
        // Довіряємо централізованому AutoRedirectRoute
        console.log('🔁 Redirecting to root for centralized routing...');
        navigate("/");
      } else {
        setError("No authentication token received from server");
      }
      
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-layout">
      <section className="auth-card">
        <div style={{ marginBottom: 16 }}>
          <Logo height={56} className="logo-anatomous" />
        </div>
        <h1 className="auth-title">Log In</h1>
        <form className="form" onSubmit={onSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="email">Email address</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="Enter your email" 
              autoComplete="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <p className="field-hint">{emailHint}</p>
          </div>

          <div className="form-field password">
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="Enter your password" 
              autoComplete="current-password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <button 
              type="button" 
              className="toggle-visibility" 
              aria-label="Toggle password visibility" 
              onClick={() => setShowPassword(s => !s)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            <p className="field-hint">{passwordHint}</p>
          </div>
          
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? "Loading…" : "Log In"}
          </button>

          <div className="form-row between">
            <label className="checkbox">
              <input 
                id="remember" 
                name="remember" 
                type="checkbox" 
                checked={remember} 
                onChange={(e) => setRemember(e.target.checked)} 
              />
              <span>Remember me</span>
            </label>
            <a 
              className="link" 
              href="#" 
              onClick={(e) => { 
                e.preventDefault(); 
                setForgotOpen(true); 
              }}
            >
              Forgot Password?
            </a>
          </div>

          <div className="divider"><span>or</span></div>

          <div className="social-buttons">
            <button 
              type="button" 
              className="btn outline" 
              onClick={async () => {
                try {
                  const url = await AuthApi.getGoogleAuthUrl();
                  window.location.href = url;
                } catch (err) {
                  console.error('Failed to initiate Google OAuth', err);
                  setError('Failed to start Google login. Please try again.');
                }
              }}
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
              <span>Log in with Google</span>
            </button>
            
            <button 
              type="button" 
              className="btn outline" 
              onClick={() => alert("Apple Sign-In integration depends on your backend")}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_logo_white.svg" alt="Apple" />
              <span>Log in with Apple</span>
            </button>
          </div>
          
          <p className="alt-action">
            No account yet? {(
              <a 
                className="link" 
                href="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  setSignupOpen(true);
                }}
              >
                Sign up
              </a>
            )}
          </p>
          
          {error ? <div className="alert">{error}</div> : null}
        </form>

        <ForgotPasswordModal open={forgotOpen} onClose={() => setForgotOpen(false)} />
        {signupOpen && (
          <SignupPage onClose={() => setSignupOpen(false)} />
        )}
      </section>
      
      <aside className="artwork">
        <img src="/images/login_image.avif" alt="Artwork" />
      </aside>
      
      <NotificationSystem 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </div>
  );
}