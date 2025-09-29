import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { AuthApi } from "../api/authApi";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isValidToken, setIsValidToken] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setIsValidToken(false);
            const t = setTimeout(() => navigate('/dashboard'), 3000);
            return () => clearTimeout(t);
        }
    }, [token, navigate]);

    async function handleResetPassword(e) {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        try {
            await AuthApi.resetPassword({ token, new_password: newPassword });
            setSuccess('Password reset successfully! Redirecting…');
            setTimeout(() => navigate('/login'), 1200);
        } catch (err) {
            setError(err.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    }

    if (!isValidToken) {
        return (
            <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
                <h2>Invalid Token</h2>
                <p>The password reset link is invalid or has expired.</p>
                <p>You can request a new link on the <Link to="/login">Login</Link> page.</p>
                <p>Redirecting to dashboard...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
            <h2>Reset Your Password</h2>
            {error ? (<div className="alert" style={{ marginBottom: '12px' }}>{error}</div>) : null}
            {success ? (<div className="alert" style={{ marginBottom: '12px', color: 'green' }}>{success}</div>) : null}
            <form onSubmit={handleResetPassword}>
                <div style={{ marginBottom: '15px' }}>
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: loading ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px'
                    }}
                >
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </div>
    );
}


