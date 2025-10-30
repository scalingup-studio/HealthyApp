// src__hooks__useAuthGuard.js
/**
 * Reusable authentication guard hook
 * Handles common auth checks and redirects
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';

/**
 * Protect route - requires authentication
 */
export function useRequireAuth() {
    const { authToken, loading, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated()) {
            console.log('⚠️ Not authenticated, redirecting to login');
            navigate('/login', { replace: true });
        }
    }, [loading, authToken, navigate, isAuthenticated]);

    return { loading, isAuthenticated: isAuthenticated() };
}

/**
 * Require onboarding completion
 */
export function useRequireOnboarding() {
    const { loading, hasCompletedOnboarding } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !hasCompletedOnboarding()) {
            console.log('⚠️ Onboarding not completed, redirecting');
            navigate('/onboarding', { replace: true });
        }
    }, [loading, hasCompletedOnboarding, navigate]);

    return { loading, hasCompletedOnboarding: hasCompletedOnboarding() };
}

/**
 * Redirect if already authenticated
 */
export function useRedirectIfAuthenticated(redirectTo = '/') {
    const { authToken, loading, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && isAuthenticated()) {
            console.log('ℹ️ Already authenticated, redirecting');
            navigate(redirectTo, { replace: true });
        }
    }, [loading, authToken, redirectTo, navigate, isAuthenticated]);

    return { loading, isAuthenticated: isAuthenticated() };
}

/**
 * Combined auth + onboarding guard
 */
export function useAuthWithOnboarding() {
    const { authToken, loading, isAuthenticated, hasCompletedOnboarding } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;

        if (!isAuthenticated()) {
            console.log('⚠️ Not authenticated, redirecting to login');
            navigate('/login', { replace: true });
            return;
        }

        if (!hasCompletedOnboarding()) {
            console.log('⚠️ Onboarding not completed, redirecting');
            navigate('/onboarding', { replace: true });
        }
    }, [loading, authToken, navigate, isAuthenticated, hasCompletedOnboarding]);

    return {
        loading,
        isAuthenticated: isAuthenticated(),
        hasCompletedOnboarding: hasCompletedOnboarding(),
    };
}

export default {
    useRequireAuth,
    useRequireOnboarding,
    useRedirectIfAuthenticated,
    useAuthWithOnboarding,
};

