import React, { useEffect, useState } from "react";
import { useAuthRequest } from "../../api/authRequest.js";
import { useAuth } from "../../api/AuthContext.jsx"; // ✅ Import useAuth
import { ENDPOINTS } from "../../api/apiConfig.js";

export default function DashboardProfile() {
  const authRequest = useAuthRequest();
  const { user } = useAuth(); // ✅ Get authenticated user
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      // ✅ Check if user exists and has id
      if (!user || !user.id) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // ✅ Use user.id from context instead of hardcoded 1
        const data = await authRequest(ENDPOINTS.profiles.getById(user.id));
        setProfile(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user?.id]); // ✅ Re-fetch if user.id changes

  if (loading) {
    return (
      <div className="card">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <p style={{ color: "var(--error)" }}>{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="card">
        <p>No profile data available</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Profile</h3>
      {/* <p>Name: {profile.name || `${user.firstName} ${user.lastName}`}</p> */}
      <p>Email: {profile.email || user.email}</p>
    </div>
  );
}
