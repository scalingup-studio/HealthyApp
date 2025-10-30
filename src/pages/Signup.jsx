// src__pages__Signup.jsx
/**
 * Fixed Signup Page
 * Key changes:
 * 1. Better error handling
 * 2. Automatic profile creation
 * 3. Proper redirect flow
 */

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

  const navigate = useNavigate?.() || (() => { });
  const { signup, login } = useAuth?.() || {}; 
  const { showSuccess, showError } = useNotifications();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    // Validation
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
      console.log('👤 Starting signup process...');

      // Step 1: Signup
      const signupData = await AuthApi.signup({
          firstName,
          lastName,
          email,
          password,
        });

      console.log('✅ Signup successful:', signupData);

      // Step 2: Auto-login
      if (login) {
        console.log('🔐 Auto-logging in...');
        const loginResult = await login(email, password);

        if (!loginResult?.success) {
          throw new Error(loginResult?.error || "Auto login failed");
        }

        console.log('✅ Auto-login successful');
      }

      // Step 3: Try to create profile
      try {
        console.log('👤 Creating user profile...');

        const userId = signupData.new_User?.id || signupData.user?.id;

        if (!userId) {
          console.warn('⚠️ No user ID in signup response, skipping profile creation');
        } else {
          const profileData = {
            user_id: userId,
            first_name: firstName,
            last_name: lastName,
            email: email,
          };

          console.log('📝 Profile data:', profileData);

          const profile = await ProfilesApi.create(profileData);
          console.log('✅ Profile created:', profile);
          showSuccess("Profile created successfully!");
        }
      } catch (profileError) {
        console.warn('⚠️ Could not create profile automatically:', profileError.message);
        // Don't fail signup if profile creation fails - they can complete it in onboarding
      }

      showSuccess("Account created successfully! Redirecting to onboarding...");

      // Close modal
      if (onClose) {
        onClose();
      }
      // navigate("/login", { replace: true })
      // Navigate to onboarding
      setTimeout(() => {
        navigate("/onboarding", { replace: true });
      }, 1000);

    } catch (err) {
      console.error('❌ Signup error:', err);
      const apiMessage = err?.data?.message || err?.message;
      setError(apiMessage || "Unexpected error during signup");
      showError(apiMessage || "Signup failed");
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
            <input
              id="firstName"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="John"
              required
              disabled={loading}
            />
          </div>
          <div className="form-field" style={{ flex: 1 }}>
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Doe"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="signupEmail">Email address</label>
          <input
            id="signupEmail"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={loading}
          />
        </div>

        <div className="form-field password">
          <label htmlFor="signupPassword">Password</label>
          <input
            id="signupPassword"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Create a password (min 6 characters)"
            required
            disabled={loading}
          />
          <button
            type="button"
            className="toggle-visibility"
            aria-label="Toggle password visibility"
            onClick={() => setShowPassword(s => !s)}
            disabled={loading}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <label className="checkbox" style={{ marginBottom: 12 }}>
          <input
            type="checkbox"
            checked={terms}
            onChange={e => setTerms(e.target.checked)}
            disabled={loading}
          />
          <span>I agree to the Terms of Service and Privacy Policy</span>
        </label>

        {error && <div className="alert">{error}</div>}

        <button
          className="btn primary"
          type="submit"
          disabled={loading || !terms}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="alt-action" style={{ marginTop: 12, textAlign: 'center' }}>
          Already have an account? {" "}
          <a
            className="link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (onClose) onClose();
              navigate("/login");
            }}
          >
            Log in
          </a>
        </p>
      </form>
    </Modal>
  );
}


