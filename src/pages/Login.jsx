import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Modal } from "../components/Modal.jsx";
import { AuthApi } from "../api/authApi";

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
  const navigate = useNavigate();

  // Реальний Xano login endpoint
  const TOKEN_STORAGE_KEY = "authToken";

  function persistToken(token, rememberFlag) {
    if (!token) return;
    if (rememberFlag) localStorage.setItem(TOKEN_STORAGE_KEY, token);
    else sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

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
    // Bypass real auth for now; navigate to dashboard
    try {
      setLoading(true);
      const data = await AuthApi.login({ email, password });
      const token = data.token || data.authToken || data.jwt;
      if (!token) throw new Error("Server did not return a token");
      persistToken(token, remember);
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-layout">
      <section className="auth-card">
        <h1 className="auth-title">Log In</h1>
        <form className="form" onSubmit={onSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" placeholder="Enter your email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <p className="field-hint">{emailHint}</p>
          </div>

          <div className="form-field password">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" className="toggle-visibility" aria-label="Toggle password visibility" onClick={() => setShowPassword(s => !s)}>{showPassword ? "Hide" : "Show"}</button>
            <p className="field-hint">{passwordHint}</p>
          </div>
          <button type="submit" className="btn primary" disabled={loading}>{loading ? "Loading…" : "Log In"}</button>

          <div className="form-row between">
            <label className="checkbox">
              <input id="remember" name="remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span>Remember me</span>
            </label>
            <a className="link" href="#" onClick={(e) => { e.preventDefault(); setForgotOpen(true); }}>Forgot Password?</a>
          </div>


          <div className="divider"><span>or</span></div>

          <div className="social-buttons">
            <button type="button" className="btn outline" onClick={async () => {
              try {
                const url = await AuthApi.getGoogleAuthUrl(); // Fetch the URL
                window.location.href = url; // Then redirect
              } catch (err) {
                console.error('Failed to initiate Google OAuth', err);
                setError('Failed to start Google login. Please try again.');
              }
            }}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
              <span>Log in with Google</span>
            </button>
            <button type="button" className="btn outline" onClick={() => alert("Apple Sign-In integration depends on your backend")}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_logo_white.svg" alt="Apple" />
              <span>Log in with Apple</span>
            </button>
          </div>
          <p className="alt-action">No account yet? {onOpenSignup ? (
            <a className="link" href="#" onClick={(e) => { e.preventDefault(); onOpenSignup?.(); }}>Sign up</a>
          ) : (
            <Link className="link" to="/signup">Sign up</Link>
          )}
          </p>
          {error ? <div className="alert">{error}</div> : null}
        </form>

        <Modal open={forgotOpen} title="Reset Password" onClose={() => setForgotOpen(false)}>
          <ForgotForm onClose={() => setForgotOpen(false)} />
        </Modal>
      </section>
      <aside className="artwork">
        <div className="placeholder" aria-hidden="true">
          <div className="x-line"></div>
          <div className="x-line"></div>
        </div>
      </aside>
    </div>
  );
}

function ForgotForm({ onClose }) {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await AuthApi.requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  }

  if (sent) return (
    <div>
      <p>We sent a reset link to <strong>{email}</strong> if it exists in our system.</p>
      <button className="btn primary" onClick={onClose}>Close</button>
    </div>
  );

  return (
    <form onSubmit={submit} className="form" noValidate>
      <div className="form-field">
        <label htmlFor="forgotEmail">Email address</label>
        <input id="forgotEmail" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
      </div>
      {error ? <div className="alert">{error}</div> : null}
      <button className="btn primary" type="submit" disabled={loading}>{loading ? "Sending…" : "Send reset link"}</button>
    </form>
  );
}


