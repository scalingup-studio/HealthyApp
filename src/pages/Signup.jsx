import React from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../components/Modal.jsx";
// import { API_BASE } from "../../apiConfig.js";

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
     
     // Real request to your Xano API
      const response = await fetch("https://xu6p-ejbd-2ew4.n7e.xano.io/api:HBbbpjK5/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
  
      // Successful registration
      alert("Account created successfully!");
      onClose?.();
      navigate("/login");
    } catch (err) {
      setError(err.message || "Unexpected error during signup");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open title="Sign Up" onClose={onClose}>
      <form className="form" onSubmit={onSubmit} noValidate>
        <div className="form-row" style={{gap:12}}>
          <div className="form-field" style={{flex:1}}>
            <label htmlFor="firstName">First name</label>
            <input id="firstName" value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="John" required />
          </div>
          <div className="form-field" style={{flex:1}}>
            <label htmlFor="lastName">Last name</label>
            <input id="lastName" value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Doe" required />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="signupEmail">Email address</label>
          <input id="signupEmail" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>

        <div className="form-field password">
          <label htmlFor="signupPassword">Password</label>
          <input id="signupPassword" type={showPassword?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Create a password" required />
          <button type="button" className="toggle-visibility" aria-label="Toggle password visibility" onClick={()=>setShowPassword(s=>!s)}>{showPassword?"Hide":"Show"}</button>
        </div>

        <label className="checkbox" style={{marginBottom:12}}>
          <input type="checkbox" checked={terms} onChange={e=>setTerms(e.target.checked)} />
          <span>I agree to the Terms</span>
        </label>

        {error ? <div className="alert">{error}</div> : null}

        <button className="btn primary" type="submit" disabled={loading || !terms}>{loading?"Creating…":"Create account"}</button>
      </form>
    </Modal>
  );
}


