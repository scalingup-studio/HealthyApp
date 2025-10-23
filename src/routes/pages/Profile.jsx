import React, { useEffect, useState, useRef } from "react";
import { useAuthRequest } from "../../api/authRequest.js";
import { useAuth } from "../../api/AuthContext.jsx";
import { useNotifications } from "../../api/NotificationContext.jsx";
import { ProfilesApi } from "../../api/profilesApi.js";
import { UploadFileApi } from "../../api/uploadFileApi.js";
import { ENDPOINTS } from "../../api/apiConfig.js";

export default function DashboardProfile() {
  const authRequest = useAuthRequest();
  const { user } = useAuth();
  const { showSuccess, showError, showInfo } = useNotifications();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [pendingPhotoFile, setPendingPhotoFile] = useState(null);
  const fileInputRef = useRef(null);
  const [formValues, setFormValues] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    dob: "",
    gender: "",
    sex_of_birth: "",
    height_cm: "",
    weight_kg: "",
    zip_code: "",
    user_id: "",
  });
  const [activeTab, setActiveTab] = useState('personal');
  const [healthHistory, setHealthHistory] = useState({
    medical_conditions: [],
    medications: [],
    allergies: [],
    surgical_history: [],
    vaccinations: [],
    sensitivities: [],
    family_history: [],
  });

  // Track last updated timestamps for each section
  const [lastUpdated, setLastUpdated] = useState({
    medical_conditions: null,
    medications: null,
    allergies: null,
    surgical_history: null,
    vaccinations: null,
    sensitivities: null,
    family_history: null,
  });
  const healthOptions = {
    medical_conditions: [
      "Hypertension", "Diabetes Type 1", "Diabetes Type 2", "Asthma", "COPD", 
      "Cardiovascular Disease", "High Cholesterol", "Arthritis", "Depression", 
      "Anxiety", "Migraine", "Epilepsy", "Thyroid Disorders", "Autoimmune Diseases"
    ],
    medications: [
      "Metformin", "Lisinopril", "Atorvastatin", "Ibuprofen", "Aspirin", 
      "Levothyroxine", "Metoprolol", "Omeprazole", "Sertraline", "Albuterol",
      "Warfarin", "Furosemide", "Amlodipine", "Simvastatin", "Losartan"
    ],
    allergies: [
      "Penicillin", "Sulfa drugs", "Peanuts", "Tree nuts", "Shellfish", 
      "Dust mites", "Pollen", "Pet dander", "Latex", "Mold", "Eggs", "Milk",
      "Soy", "Wheat", "Insect stings", "Contrast dye"
    ],
    surgical_history: [
      "Appendectomy", "C-section", "Knee surgery", "Hip replacement", 
      "Gallbladder removal", "Hernia repair", "Cataract surgery", 
      "Tonsillectomy", "Cholecystectomy", "Hysterectomy", "Prostate surgery",
      "Heart surgery", "Spine surgery", "Shoulder surgery"
    ],
    vaccinations: [
      "COVID-19", "Influenza (Flu)", "Hepatitis A", "Hepatitis B", "MMR", 
      "Tdap", "Varicella", "Pneumococcal", "Meningococcal", "HPV", 
      "Shingles", "Polio", "Tetanus", "Diphtheria", "Pertussis"
    ],
    sensitivities: [
      "Latex", "Nickel", "Fragrances", "Cleaning products", "Pesticides",
      "Formaldehyde", "Dyes", "Preservatives", "Sulfites", "MSG",
      "Artificial sweeteners", "Food additives", "Chemicals", "Smoke"
    ],
    family_history: [
      "Heart disease", "Diabetes", "Cancer", "Alzheimer's", "Depression",
      "High blood pressure", "Stroke", "Kidney disease", "Liver disease",
      "Mental health disorders", "Autoimmune diseases", "Blood disorders",
      "Genetic conditions", "Obesity", "Substance abuse"
    ],
  };


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
        const msg = "User not authenticated";
        setError(msg);
        showError(msg);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🔍 Fetching profile for user ID:', user.id);
        
        // Try to get profile by user_id using ProfilesApi
        let profileData = null;
        try {
          // First try to get profile by user_id
          profileData = await ProfilesApi.getById(user.id);
          console.log('✅ Profile found by ID:', profileData);
        } catch (idError) {
          console.log('⚠️ Profile not found by ID, trying to get all profiles:', idError.message);
          // If not found by ID, try to get all profiles and filter by user_id
          const allProfilesResponse = await ProfilesApi.getAll();
          console.log('📋 All profiles response:', allProfilesResponse);
          
          // Handle API response format: { result: [...], success: true }
          const allProfiles = allProfilesResponse?.result || allProfilesResponse;
          console.log('📋 All profiles array:', allProfiles);
          
          if (Array.isArray(allProfiles)) {
            profileData = allProfiles.find(p => p.user_id === user.id || p.id === user.id);
            console.log('🔍 Found profile in list:', profileData);
          } else if (allProfiles && (allProfiles.user_id === user.id || allProfiles.id === user.id)) {
            profileData = allProfiles;
            console.log('🔍 Single profile found:', profileData);
          }
        }
        
        setProfile(profileData);
        const preview = profileData?.profile_photo?.url || profileData?.profile_photo?.path || "";
        if (preview) setPhotoPreview(preview);
        
        // Use profile data if available, otherwise fallback to user data
        const dataToUse = profileData || user;
        console.log('📊 Data to use for form:', dataToUse);
        console.log('📊 Profile data:', profileData);
        console.log('📊 User data:', user);
        
        const formData = {
          first_name: dataToUse?.first_name || dataToUse?.firstName || "",
          last_name: dataToUse?.last_name || dataToUse?.lastName || "",
          phone_number: dataToUse?.phone_number || dataToUse?.phone || "",
          dob: dataToUse?.dob || dataToUse?.date_of_birth || "",
          gender: dataToUse?.gender || "",
          sex_of_birth: dataToUse?.sex_of_birth || "",
          height_cm: (dataToUse?.height_cm ?? "") === 0 ? "" : (dataToUse?.height_cm ?? ""),
          weight_kg: (dataToUse?.weight_kg ?? "") === 0 ? "" : (dataToUse?.weight_kg ?? ""),
          zip_code: dataToUse?.zip_code ?? "",
          user_id: dataToUse?.user_id || user?.id || "",
        };
        
        console.log('📊 Form data to set:', formData);
        setFormValues(formData);
        setError(null);
        
        if (!profileData) {
          console.log('ℹ️ No profile found, using user data as fallback');
        }
      } catch (err) {
        console.warn('❌ Failed to fetch profile from API, using user data:', err.message);
        // Fallback to user data if API fails
        const profileData = user;
        setProfile(profileData);
        setFormValues({
          first_name: profileData?.first_name || profileData?.firstName || "",
          last_name: profileData?.last_name || profileData?.lastName || "",
          phone_number: profileData?.phone_number || profileData?.phone || "",
          dob: profileData?.dob || profileData?.date_of_birth || "",
          gender: profileData?.gender || "",
          height_cm: (profileData?.height_cm ?? "") === 0 ? "" : (profileData?.height_cm ?? ""),
          weight_kg: (profileData?.weight_kg ?? "") === 0 ? "" : (profileData?.weight_kg ?? ""),
          zip_code: profileData?.zip_code ?? "",
          user_id: profileData?.user_id || user?.id || "",
        });
        console.log('📊 Fallback form data set:', {
          first_name: profileData?.first_name || profileData?.firstName || "",
          last_name: profileData?.last_name || profileData?.lastName || "",
          phone_number: profileData?.phone_number || profileData?.phone || "",
          dob: profileData?.dob || profileData?.date_of_birth || "",
          gender: profileData?.gender || "",
        });
        const msg = `Profile API unavailable: ${err.message}`;
        setError(msg);
        showError(msg);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user?.id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e?.preventDefault?.();
    if (!user?.id) return;
    try {
      setSaving(true);
      setError(null);
      
      // Handle photo upload separately if user selected a new photo
      if (pendingPhotoFile) {
        try {
          setUploadingPhoto(true);
          console.log('📸 UPLOADING photo:');
          console.log('📍 Endpoint:', `${ENDPOINTS.uploudFile.uploudFile}`);
          console.log('📦 File:', {
            name: pendingPhotoFile.name,
            size: pendingPhotoFile.size,
            type: pendingPhotoFile.type
          });
          console.log('📦 User ID:', user.id);
          console.log('📦 Category:', 'profile');
          
          const res = await UploadFileApi.uploadFile(pendingPhotoFile, user.id, 'profile');
          const uploaded = res?.result || res;
          const url = uploaded?.url || uploaded?.path || '';
          
          console.log('✅ Photo upload response:', uploaded);
          console.log('🔗 Photo URL:', url);
          
          // Update local profile state with photo info
          setProfile(prev => ({
            ...(prev || {}),
            profile_photo: {
              access: uploaded?.access || 'public',
              path: uploaded?.path || url,
              name: uploaded?.name || pendingPhotoFile.name,
              type: uploaded?.type || pendingPhotoFile.type,
              size: uploaded?.size || pendingPhotoFile.size,
              mime: uploaded?.mime || pendingPhotoFile.type,
              meta: uploaded?.meta || {},
              url,
            }
          }));
          
          // Update photo preview
          setPhotoPreview(url);
          showSuccess("Photo uploaded successfully!");
        } catch (uploadErr) {
          const msg = uploadErr?.message || 'Failed to upload photo';
          setError(msg);
          showError(msg);
          return;
        } finally {
          setUploadingPhoto(false);
          setPendingPhotoFile(null);
        }
      }

      // Prepare profile data payload (without photo - photo is handled separately)
      const basePayload = {
        first_name: formValues.first_name?.trim(),
        last_name: formValues.last_name?.trim(),
        phone_number: formValues.phone_number?.trim(),
        dob: formValues.dob || null,
        gender: formValues.gender || "",
        sex_of_birth: formValues.sex_of_birth || "",
        height_cm: formValues.height_cm === "" ? 0 : Number(formValues.height_cm),
        weight_kg: formValues.weight_kg === "" ? 0 : Number(formValues.weight_kg),
        zip_code: formValues.zip_code?.trim() || "",
      };

      // For UPDATE the API expects profiles_id in the body
      let payload = basePayload;
      if (profile && profile.id) {
        payload = { profiles_id: profile.id, ...basePayload };
      } else {
        // For CREATE we keep user_id
        payload = { user_id: formValues.user_id || user.id, ...basePayload };
      }
      
      console.log('💾 Saving profile with payload (no photo):', payload);
      
      let updated;
      if (profile && profile.id) {
        // Update existing profile using user_id
        console.log('🔄 UPDATING existing profile:');
        console.log('📍 Endpoint:', `PATCH ${ENDPOINTS.profiles.update(user.id)}`);
        console.log('📦 Request Body:', JSON.stringify(payload, null, 2));
        console.log('📦 Request Body (formatted):', payload);
        
        updated = await ProfilesApi.update(user.id, payload);
        console.log('✅ Profile updated successfully:', updated);
      } else {
        // Create new profile
        console.log('🆕 CREATING new profile:');
        console.log('📍 Endpoint:', `POST ${ENDPOINTS.profiles.create}`);
        console.log('📦 Request Body:', JSON.stringify(payload, null, 2));
        console.log('📦 Request Body (formatted):', payload);
        
        updated = await ProfilesApi.create(payload);
        console.log('✅ Profile created successfully:', updated);
      }
      
      setProfile(updated);
      showSuccess("Profile updated successfully!");
    } catch (err) {
      const errorMessage = err.message || "Failed to save profile";
      console.error('❌ Profile save error:', err);
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dashboard-profile">
      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, paddingBottom:8, borderBottom: "1px solid var(--border)" }}>
        <button 
          onClick={() => setActiveTab('personal')} 
          className={`btn ${activeTab === 'personal' ? 'primary' : 'outline'}`}
          style={{ width:'auto', padding:'8px 16px', height:38 }}
        >
          Personal Info
        </button>
        <button 
          onClick={() => setActiveTab('health')} 
          className={`btn ${activeTab === 'health' ? 'primary' : 'outline'}`}
          style={{ width:'auto', padding:'8px 16px', height:38 }}
        >
          Health History
        </button>
      </div>

      {activeTab === 'personal' && (
      <div className="card" style={{ display: "flex", gap: 16, marginBottom: 24,  alignItems:'flex-start' }}>
        <div 
          style={{ width: 120, height: 120, backgroundColor: "#0b0b0b", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, border:'1px solid var(--border)', overflow:'hidden', cursor:'pointer', position:'relative' }}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          title="Change photo"
          aria-label="Change profile photo"
        >
          {photoPreview ? (
            <img src={photoPreview} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          ) : (
            <span style={{ fontSize: 48 }}>👤</span>
          )}
          {uploadingPhoto && (
            <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.45)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 }}>Uploading…</div>
          )}
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*"
            style={{ display:'none' }}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              // Create a local preview and defer actual upload until Save
              try {
                if (photoPreview?.startsWith('blob:')) {
                  URL.revokeObjectURL(photoPreview);
                }
                const localUrl = URL.createObjectURL(file);
                setPhotoPreview(localUrl);
                setPendingPhotoFile(file);
                showInfo('Photo selected. Click "Save changes" to upload.');
              } finally {
                e.target.value = '';
              }
            }}
          />
        </div>
        <div style={{ flex:1 }}>
          {loading ? (
            <p>Loading profile...</p>
          ) : (
            <>
              <h2 style={{ marginTop:0 }}>
                {profile?.name || 
                 (profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : 
                  profile?.first_name || profile?.last_name || 
                  user?.name || 
                  (user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : 
                   user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` :
                   user?.first_name || user?.last_name || user?.firstName || user?.lastName || 
                   (formValues.first_name || formValues.last_name ? 
                    `${formValues.first_name || ''} ${formValues.last_name || ''}`.trim() : 
                    "Loading...")))}
              </h2>
              <p style={{ color:'var(--muted)' }}>
                <strong style={{ color:'var(--text)' }}>Email:</strong> {profile?.email || user?.email || "No email"}
              </p>
              
        
              
              {error && (
                <p style={{ color: "var(--error)", fontSize: "14px", marginTop: "8px" }}>
                  ⚠️ {error}
                </p>
              )}
              <form onSubmit={handleSave} className="form" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12, maxWidth: 720 }}>
                <label className="form-field" style={{ display: "flex", flexDirection: "column" }}>
                  <span>First name</span>
                  <input name="first_name" value={formValues.first_name} onChange={handleChange} placeholder="John" />
                </label>
                <label className="form-field" style={{ display: "flex", flexDirection: "column" }}>
                  <span>Last name</span>
                  <input name="last_name" value={formValues.last_name} onChange={handleChange} placeholder="Doe" />
                </label>
                {/* User ID hidden from UI by request */}
                <label className="form-field" style={{ display: "flex", flexDirection: "column" }}>
                  <span>Phone</span>
                  <input name="phone_number" value={formValues.phone_number} onChange={handleChange} placeholder="+1 555-1234" />
                </label>
                <label className="form-field" style={{ display: "flex", flexDirection: "column" }}>
                  <span>Date of birth</span>
                  <input type="date" name="dob" value={formValues.dob || ""} onChange={handleChange} />
                </label>
                <label className="form-field" style={{ display: "flex", flexDirection: "column" }}>
                  <span>Gender Identity</span>
                  <select name="gender" value={formValues.gender || ""} onChange={handleChange}>
                    <option value="">Not specified</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </label>
                <label className="form-field" style={{ display: "flex", flexDirection: "column" }}>
                  <span>Sex at Birth</span>
                  <select name="sex_of_birth" value={formValues.sex_of_birth || ""} onChange={handleChange}>
                    <option value="">Not specified</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="intersex">Intersex</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </label>
                <label className="form-field" style={{ display: "flex", flexDirection: "column" }}>
                  <span>Height (cm)</span>
                  <input type="number" inputMode="numeric" name="height_cm" value={formValues.height_cm} onChange={handleChange} placeholder="e.g. 175" />
                </label>
                <label className="form-field" style={{ display: "flex", flexDirection: "column" }}>
                  <span>Weight (kg)</span>
                  <input type="number" inputMode="numeric" name="weight_kg" value={formValues.weight_kg} onChange={handleChange} placeholder="e.g. 70" />
                </label>
                <label className="form-field" style={{ display: "flex", flexDirection: "column" }}>
                  <span>ZIP Code</span>
                  <input name="zip_code" value={formValues.zip_code} onChange={handleChange} placeholder="e.g. 94105" />
                </label>
                <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, marginTop: 8 }}>
                  <button type="submit" className="btn primary full" disabled={saving}>
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      )}

      {activeTab === 'personal' && (
        <div className="card" style={{ height: 200, marginBottom: 24 }}>
          <h3 style={{ marginTop:0 }}>Main Data / Stats</h3>
          <p style={{ color:'var(--muted)' }}></p>
        </div>
      )}

      {activeTab === 'health' && (
        <div style={{ maxWidth: 920 }}>
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding:16, borderBottom:'1px solid var(--border)' }}>
              <h2 style={{ margin: 0 }}>Health History</h2>
              <p style={{ color:'var(--muted)', margin: '8px 0 0 0', fontSize: '14px' }}>
                Comprehensive health intake form. Each section can be collapsed/expanded for easy navigation.
              </p>
            </div>
            <div style={{ padding:16 }}>
              {([
                ['medical_conditions','Medical Conditions', 'Chronic conditions, diseases, and ongoing health issues'],
                ['medications','Current Medications', 'Prescription and over-the-counter medications with dosage and frequency'],
                ['allergies','Known Allergies', 'Medications, foods, and environmental triggers'],
                ['surgical_history','Surgical History', 'Past surgeries, procedures, and hospitalizations'],
                ['vaccinations','Vaccination History', 'Immunizations and vaccination records'],
                ['sensitivities','Environmental & Chemical Sensitivities', 'Chemical, environmental, and other sensitivities'],
                ['family_history','Family Health History', 'Genetic predispositions and family medical conditions'],
              ]).map(([key,label,description]) => (
                <HealthSection
                  key={key}
                  title={label}
                  description={description}
                  options={healthOptions[key]}
                  values={healthHistory[key]}
                  lastUpdated={lastUpdated[key]}
                  onToggle={(item) => setHealthHistory(prev => {
                    const set = new Set(prev[key]);
                    if (set.has(item)) set.delete(item); else set.add(item);
                    return { ...prev, [key]: Array.from(set) };
                  })}
                  onSave={async () => {
                    try {
                      setSaving(true);
                      const map = {
                        medical_conditions: ENDPOINTS.medicalConditions.create,
                        medications: ENDPOINTS.medications.create,
                        allergies: ENDPOINTS.allergies.create,
                        surgical_history: ENDPOINTS.surgicalHistory.create,
                        vaccinations: ENDPOINTS.vaccinations.create,
                        sensitivities: ENDPOINTS.sensitivities.create,
                        family_history: ENDPOINTS.familyHistory.create,
                      };
                      await authRequest(map[key], { method: 'POST', body: { user_id: user.id, items: healthHistory[key] } });
                      setLastUpdated(prev => ({ ...prev, [key]: new Date().toISOString() }));
                      showSuccess(`${label} saved successfully!`);
                    } catch (e) {
                      showError(e.message || `Failed to save ${label.toLowerCase()}`);
                    } finally {
                      setSaving(false);
                    }
                  }}
                  onAddNew={() => {
                    const newItem = prompt(`Add new ${label.toLowerCase().slice(0, -1)}:`);
                    if (newItem && newItem.trim()) {
                      setHealthHistory(prev => ({
                        ...prev,
                        [key]: [...prev[key], newItem.trim()]
                      }));
                    }
                  }}
                  saving={saving}
                />
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function HealthSection({ title, description, options, values, lastUpdated, onToggle, onSave, onAddNew, saving }) {
  const [open, setOpen] = useState(false);
  
  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div style={{ 
      borderTop: '1px solid var(--border)', 
      backgroundColor: open ? 'var(--bg-subtle)' : 'transparent',
      transition: 'background-color 0.2s ease'
    }}>
      <button 
        onClick={() => setOpen(v => !v)} 
        className="btn ghost"
        style={{ 
          width: '100%', 
          textAlign: 'left', 
          padding: '16px 0', 
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontWeight: 600, fontSize: '16px' }}>{title}</span>
            <span style={{ 
              color: 'var(--muted)', 
              fontSize: '12px',
              backgroundColor: 'var(--bg-subtle)',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              {values.length} item{values.length !== 1 ? 's' : ''}
            </span>
          </div>
          <p style={{ 
            color: 'var(--muted)', 
            fontSize: '14px', 
            margin: 0,
            textAlign: 'left'
          }}>
            {description}
          </p>
          {lastUpdated && (
            <p style={{ 
              color: 'var(--muted)', 
              fontSize: '12px', 
              margin: '4px 0 0 0',
              fontStyle: 'italic'
            }}>
              Last updated: {formatLastUpdated(lastUpdated)}
            </p>
          )}
        </div>
        <span style={{ 
          color: 'var(--muted)', 
          fontSize: '18px',
          marginLeft: '16px',
          flexShrink: 0
        }}>
          {open ? '▾' : '▸'}
        </span>
      </button>
      
      {open && (
        <div style={{ padding: '0 0 16px 0' }}>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 8, 
            marginBottom: 16,
            minHeight: '40px',
            alignItems: 'center'
          }}>
            {values.length === 0 ? (
              <p style={{ 
                color: 'var(--muted)', 
                fontSize: '14px', 
                fontStyle: 'italic',
                margin: 0
              }}>
                No {title.toLowerCase()} added yet
              </p>
            ) : (
              values.map(item => (
                <div key={item} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '14px'
                }}>
                  <span>{item}</span>
                  <button
                    onClick={() => onToggle(item)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--muted)',
                      cursor: 'pointer',
                      padding: '2px',
                      fontSize: '12px'
                    }}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
          
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 8, 
            marginBottom: 16 
          }}>
            {options.map(opt => (
              <label key={opt} className="inline-checkbox" style={{
                backgroundColor: values.includes(opt) ? 'var(--primary)' : 'transparent',
                borderColor: values.includes(opt) ? 'var(--primary)' : 'var(--border)',
                color: values.includes(opt) ? 'white' : 'var(--text)'
              }}>
                <input 
                  type="checkbox" 
                  checked={values.includes(opt)} 
                  onChange={() => onToggle(opt)}
                  style={{ display: 'none' }}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button 
              className="btn primary" 
              onClick={onSave} 
              disabled={saving}
              style={{ minWidth: '80px' }}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button 
              className="btn outline" 
              onClick={onAddNew}
              style={{ minWidth: '100px' }}
            >
              + Add New
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
