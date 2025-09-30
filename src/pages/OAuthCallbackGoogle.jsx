import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TOKEN_STORAGE_KEY = "authToken";

export default function OAuthCallbackGoogle() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        function handleRedirect() {
            try {
                // Отримуємо токен з URL параметрів
                const urlParams = new URLSearchParams(location.search);
                const token = urlParams.get('authToken');
                
                if (token) {
                    localStorage.setItem(TOKEN_STORAGE_KEY, token);
                    navigate("/dashboard", { replace: true });
                } else {
                    console.error("No token found in URL");
                    navigate("/login", { replace: true });
                }
            } catch (err) {
                console.error("Google OAuth callback failed", err);
                navigate("/login", { replace: true });
            }
        }
        
        handleRedirect();
    }, [location.search, navigate]);

    return (
        <div style={{ maxWidth: 360, margin: "64px auto", padding: 16 }}>
            <h3>Signing you in…</h3>
            <p>Please wait while we complete Google sign-in.</p>
        </div>
    );
}
