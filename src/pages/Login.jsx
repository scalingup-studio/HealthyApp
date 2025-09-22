import React from "react";
import { Modal } from "../components/Modal.jsx";

export function LoginPage({ onOpenSignup }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [emailHint, setEmailHint] = React.useState("");
  const [passwordHint, setPasswordHint] = React.useState("");
  const [forgotOpen, setForgotOpen] = React.useState(false);

  const XANO_LOGIN_URL = (window.ENV && window.ENV.XANO_LOGIN_URL) || "https://x8ki-letl-twmt.n7.xano.io/api:AUTH/login";
  const TOKEN_STORAGE_KEY = "healthyapp_auth_token";

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
    try {
      setLoading(true);
      const res = await fetch(XANO_LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || data?.error || "Login failed");
      const token = data.authToken || data.token || data.jwt;
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
    <section className="auth-card">
      <h1 className="auth-title">Log In</h1>
      <form className="form" onSubmit={onSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" placeholder="Placeholder" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <p className="field-hint">{emailHint}</p>
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Placeholder" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <p className="field-hint">{passwordHint}</p>
        </div>

        <div className="form-row between">
          <label className="checkbox">
            <input id="remember" name="remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <span>Remember me</span>
          </label>
          <a className="link" href="#" onClick={(e)=>{e.preventDefault(); setForgotOpen(true);}}>Forgot Password?</a>
        </div>

        <button type="submit" className="btn primary" disabled={loading}>{loading ? "Loading…" : "Log In"}</button>

        <div className="divider"><span>or</span></div>

        <div className="social-buttons">
          <button type="button" className="btn outline" onClick={() => alert("Google OAuth integration depends on your backend") }>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
            <span>Log in with Google</span>
          </button>
          <button type="button" className="btn outline" onClick={() => alert("Apple Sign-In integration depends on your backend") }>
            <img src="https://www.svgrepo.com/show/521649/apple.svg" alt="Apple" />
            <span>Log in with Apple</span>
          </button>
        </div>

        <p className="alt-action">No account yet? <a className="link" href="#" onClick={(e)=>{e.preventDefault(); onOpenSignup?.();}}>Sign up</a></p>

        {error ? <div className="alert">{error}</div> : null}
      </form>

      <Modal open={forgotOpen} title="Reset Password" onClose={()=>setForgotOpen(false)}>
        <ForgotForm onClose={()=>setForgotOpen(false)} />
      </Modal>
    </section>
  );
}

function ForgotForm({ onClose }) {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function submit(e){
    e.preventDefault();
    setLoading(true);
    await new Promise(r=>setTimeout(r, 600));
    setSent(true);
    setLoading(false);
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
        <input id="forgotEmail" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required />
      </div>
      <button className="btn primary" type="submit" disabled={loading}>{loading?"Sending…":"Send reset link"}</button>
    </form>
  );
}


