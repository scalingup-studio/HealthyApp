import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthApi } from "../api/authApi";

export default function OAuthCallbackGoogle() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        async function handle() {
            try {
                const query = location.search?.replace(/^\?/, "") || "";
                // Токен автоматично зберігається в HTTPOnly cookie
                await AuthApi.handleGoogleCallback(query);
                console.log("OAuthCallbackGoogle")
                // Перенаправляємо на головну
                window.location.href = "/"; // 🔴 Використовуємо window.location для повного перезавантаження
            } catch (err) {
                console.error("Google OAuth callback failed", err);
                navigate("/login", { replace: true });
            }
        }
        handle();
    }, [location.search, navigate]);

    return (
        <div style={{ maxWidth: 360, margin: "64px auto", padding: 16 }}>
            <h3>Signing you in…</h3>
            <p>Please wait while we complete Google sign-in.</p>
        </div>
    );
}