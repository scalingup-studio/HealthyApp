import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthApi } from "../api/authApi";

function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isValidToken, setIsValidToken] = useState(true);

    const token = searchParams.get('token');

    // Перевіряємо токен при завантаженні компонента
    useEffect(() => {
        if (!token) {
            setIsValidToken(false);
            setTimeout(() => navigate('/dashboard'), 3000);
        }
    }, [token, navigate]);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await AuthApi.resetPassword({ token, new_password: newPassword });
            alert('Password reset successfully!');
            navigate('/dashboard');
        } catch (error) {
            alert('Error: ' + (error.message || 'Failed to reset password'));
        } finally {
            setLoading(false);
        }
    };

    if (!isValidToken) {
        return (
            <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
                <h2>Invalid Token</h2>
                <p>The password reset link is invalid or has expired.</p>
                <p>Redirecting to dashboard...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
            <h2>Reset Your Password</h2>
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

export default ResetPasswordPage;