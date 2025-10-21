import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../api/AuthContext.jsx";
import { useNotifications } from "../api/NotificationContext.jsx";
import { Modal } from "../components/Modal.jsx";
import { Logo } from "../components/Logo.jsx";
import { AuthApi } from "../api/authApi";
import { ProfilesApi } from "../api/profilesApi.js";

export function SignupPage({ onClose }) {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [terms, setTerms] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const navigate = useNavigate?.() || (()=>{});
  const { login } = useAuth?.() || {};
  const { showSuccess, showError } = useNotifications();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!terms) {
      setError("Please agree to the Terms");
      return;
    }

    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      setLoading(true);
      const data = await AuthApi.signup({
        firstName,
        lastName,
        email,
        password,
      });
      console.log('📝 Signup response data:', data);
      // Auto-login and redirect straight to profile for onboarding
      try {
        if (login) {
          const res = await login(email, password);
          if (!res?.success) throw new Error(res?.error || "Auto login failed");
          console.log('🔐 Login after signup successful');
        }
      } catch (autoLoginErr) {
        // Fallback: if auto-login fails, send to login
        console.warn("Auto-login after signup failed:", autoLoginErr);
        showSuccess("Account created. Please log in to continue.");
        onClose?.();
        navigate("/login");
        return;
      }

      showSuccess("Account created successfully!");
      
      // Try to create profile with the provided data
      try {
        console.log('👤 Creating profile for new user...');
        const profileData = {
          user_id: data.user?.id || data.id,
          first_name: firstName,
          last_name: lastName,
          email: email
        };
        console.log('📝 Profile data to create:', profileData);
        
        const profile = await ProfilesApi.create(profileData);
        console.log('✅ Profile created successfully:', profile);
        showSuccess("Profile created with your information!");
      } catch (profileError) {
        console.warn('⚠️ Could not create profile automatically:', profileError.message);
        // Don't show error to user, they can create it manually later
      }
      
      onClose?.();
      // Redirect new users to onboarding to complete their profile setup
      navigate("/onboarding", { replace: true });
    } catch (err) {
      const apiMessage = err?.data?.message || err?.message;
      setError(apiMessage || "Unexpected error during signup");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open title="Sign Up" onClose={onClose}>

      <form className="form" onSubmit={onSubmit} noValidate>
        <div className="form-row" style={{ gap: 12 }}>
          <div className="form-field" style={{ flex: 1 }}>
            <label htmlFor="firstName">First name</label>
            <input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" required />
          </div>
          <div className="form-field" style={{ flex: 1 }}>
            <label htmlFor="lastName">Last name</label>
            <input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" required />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="signupEmail">Email address</label>
          <input id="signupEmail" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>

        <div className="form-field password">
          <label htmlFor="signupPassword">Password</label>
          <input id="signupPassword" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" required />
          <button type="button" className="toggle-visibility" aria-label="Toggle password visibility" onClick={() => setShowPassword(s => !s)}>{showPassword ? "Hide" : "Show"}</button>
        </div>

        <label className="checkbox" style={{ marginBottom: 12 }}>
          <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} />
          <span>I agree to the Terms</span>
        </label>

        {error ? <div className="alert">{error}</div> : null}

        <button className="btn primary" type="submit" disabled={loading || !terms}>{loading ? "Creating…" : "Create account"}</button>
      </form>
    </Modal>
  );
}


