import React from "react";
import { Modal } from "./Modal.jsx";
import { AuthApi } from "../api/authApi";

export function ForgotPasswordModal({ open, onClose }) {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setEmail("");
      setSent(false);
      setLoading(false);
      setError("");
    }
  }, [open]);

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

  return (
    <Modal open={open} title="Reset Password" onClose={onClose}>
      {sent ? (
        <div>
          <p>We sent a reset link to <strong>{email}</strong> if it exists in our system.</p>
          <button className="btn primary" onClick={onClose}>Close</button>
        </div>
      ) : (
        <form onSubmit={submit} className="form" noValidate>
          <div className="form-field">
            <label htmlFor="forgotEmail">Email address</label>
            <input 
              id="forgotEmail" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="you@example.com" 
              required 
            />
          </div>
          {error ? <div className="alert">{error}</div> : null}
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
    </Modal>
  );
}


