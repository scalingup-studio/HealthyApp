import React, { useEffect, useState } from "react";
import { useAuthRequest } from "../../api/authRequest.js";
import { useAuth } from "../../api/AuthContext.jsx";
import { ENDPOINTS } from "../../api/apiConfig.js";

export default function DashboardProfile() {
  const authRequest = useAuthRequest();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


const calculateAgeFromDOB = (dob) => {
  if (!dob) return null;
  
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};
  useEffect(() => {
    async function fetchProfile() {
      if (!user || !user.id) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await authRequest(ENDPOINTS.profiles.getById(user.id));
        setProfile(data);
        console.log('data', data)
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user?.id]);

  return (
    <div className="dashboard-profile">
      {/* Верхній блок: Аватар + Основна інформація */}
      <div className="profile-header" style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <div className="avatar" style={{ width: 120, height: 120, backgroundColor: "#ddd", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8 }}>
          <span style={{ fontSize: 48 }}>👤</span>
        </div>
        <div className="profile-info">
          {loading ? (
            <p>Loading profile...</p>
          ) : error ? (
            <p style={{ color: "var(--error)" }}>{error}</p>
          ) : profile ? (
            <>
              <h2>{profile.name || (profile.first_name && profile.last_name ? `${profile.first_name} ${profile.last_name}` : 
               profile.first_name || profile.last_name|| "No Name")}
              </h2>
              <p><strong>Email:</strong> {profile.email || user.email}</p>
              <p><strong>Phone:</strong> {profile.phone_number || "Not provided"}</p>
              <p><strong>Age:</strong> {calculateAgeFromDOB(profile.dob) || "N/A"}</p>
              <p><strong>Gender:</strong> {profile.gender || "N/A"}</p>
            </>
          ) : (
            <p>No profile data available</p>
          )}
        </div>
      </div>

      {/* Великий блок статистики */}
      <div className="profile-main" style={{ backgroundColor: "#eee", height: 200, borderRadius: 8, marginBottom: 24, padding: 16 }}>
        <h3>Main Data / Stats</h3>
        <p>Тут можна відобразити графіки або детальні дані користувача</p>
      </div>

      {/* Нижні картки / показники */}
      <div className="profile-cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <div className="card" style={{ padding: 16, borderRadius: 8, backgroundColor: "#fff" }}>
          <h4>Today</h4>
          <p>Steps: 8,214</p>
          <p>Calories: 1,920 kcal</p>
        </div>
        <div className="card" style={{ padding: 16, borderRadius: 8, backgroundColor: "#fff" }}>
          <h4>Sleep</h4>
          <p>7h 45m last night</p>
        </div>
        <div className="card" style={{ padding: 16, borderRadius: 8, backgroundColor: "#fff" }}>
          <h4>Water</h4>
          <p>1.7 L of 2.0 L goal</p>
        </div>
        <div className="card" style={{ padding: 16, borderRadius: 8, backgroundColor: "#fff" }}>
          <h4>Goal</h4>
          <p>Workout 4x/week</p>
        </div>
      </div>
    </div>
  );
}
