import React from "react";
import { Modal } from "../components/Modal.jsx";

export function SignupPage({ onClose }) {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [terms, setTerms] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function onSubmit(e){
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await new Promise(r=>setTimeout(r, 600));
      alert("Account created (mock). Wire to Xano signup endpoint.");
      onClose?.();
    } catch (err) {
      setError(err.message || "Unexpected error");
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

        <div className="form-field">
          <label htmlFor="signupPassword">Password</label>
          <input id="signupPassword" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Create a password" required />
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


