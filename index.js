// React Login App (JSX compiled by Babel in the browser)
const XANO_LOGIN_URL = (window.ENV && window.ENV.XANO_LOGIN_URL) || "https://x8ki-letl-twmt.n7.xano.io/api:AUTH/login"; // replace with your Xano endpoint
const TOKEN_STORAGE_KEY = "healthyapp_auth_token";

function persistToken(token, remember) {
  if (!token) return;
  if (remember) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
}

async function loginRequest(values) {
  const res = await fetch(XANO_LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: values.email, password: values.password }),
  });
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const msg = isJson && payload && (payload.message || payload.error) ? (payload.message || payload.error) : "Login failed. Check your credentials.";
    throw new Error(msg);
  }
  const token = payload.authToken || payload.token || payload.jwt || null;
  return { token, payload };
}

function Artwork() {
  return (
    <aside className="artwork">
      <div className="placeholder">
        <div className="x-line"></div>
        <div className="x-line"></div>
      </div>
    </aside>
  );
}

function LoginForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [emailHint, setEmailHint] = React.useState("");
  const [passwordHint, setPasswordHint] = React.useState("");

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
      const { token } = await loginRequest({ email, password });
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
          <a className="link" href="#" onClick={(e) => { e.preventDefault(); alert("Navigate to Forgot Password page"); }}>Forgot Password?</a>
        </div>

        <button id="submit-btn" type="submit" className="btn primary" disabled={loading}>{loading ? "Loading…" : "Log In"}</button>

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

        <p className="alt-action">No account yet? <a className="link" href="#" onClick={(e) => { e.preventDefault(); alert("Navigate to Sign Up page"); }}>Sign up</a></p>

        {error ? <div className="alert">{error}</div> : null}
      </form>
    </section>
  );
}

function App() {
  return (
    <main className="auth-layout">
      <LoginForm />
      <Artwork />
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
