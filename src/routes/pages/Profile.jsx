import React, { useEffect, useState } from "react";
import { useAuthRequest } from "../../api/authRequest.js"; // хук для автооновлення токена
import { ENDPOINTS } from "../../api/apiConfig.js";

export default function DashboardProfile() {
  const authRequest = useAuthRequest(); // отримуємо функцію запиту з токеном
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await authRequest(ENDPOINTS.profiles.getById(1));
        setProfile(data);
      } catch (err) {
        setError(err.message || "Failed to fetch profile");
      }
    }

    fetchProfile();
  }, []);

  if (error) {
    return (
      <div className="card">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="card">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Profile</h3>
      <p>Name: {profile.name}</p>
      <p>Email: {profile.email}</p>
    </div>
  );
}
