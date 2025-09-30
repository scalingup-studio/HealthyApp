import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthApi } from "../api/authApi";

export default function OAuthCallbackGoogle() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {

        console.log("🔵 OAuthCallbackGoogle MOUNTED");
        console.log("🔵 Full URL search:", location.search);
        async function handleGoogleCallback() {
            try {
                const query = location.search?.replace(/^\?/, "") || "";
                console.log("Processing Google OAuth callback with query:", query);
                
                // Вызываем API для обработки callback от Google
                await AuthApi.handleGoogleCallback(query);
                console.log("Google OAuth callback successful");
                
                // Перенаправляем на главную после успешной аутентификации
                navigate("/", { replace: true });
                
            } catch (err) {
                console.error("Google OAuth callback failed", err);
                // Перенаправляем на страницу логина при ошибке
                navigate("/login", { replace: true, state: { error: "Google authentication failed" } });
            }
        }

        handleGoogleCallback();
    }, [location.search, navigate]);

    return (
        <div style={{ maxWidth: 360, margin: "64px auto", padding: 16, textAlign: "center" }}>
            <h3>Signing you in…</h3>
            <p>Please wait while we complete Google sign-in.</p>
            <div>Processing authentication...</div>
        </div>
    );
}