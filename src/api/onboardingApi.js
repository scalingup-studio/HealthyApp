import { authRequest } from "./apiClient";
import { ENDPOINTS, CUSTOM_ENDPOINTS } from "./apiConfig";

export const OnboardingApi = {
  /**
   * Save personal information step
   * Updates user table with basic profile data
   */
  async savePersonalInfo(data) {
    try {
      const payload = {
        user_id: data.userId || data.user_id,
        step: "personal",
        data_json: {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          dob: data.dateOfBirth,
          gender: data.genderIdentity,
          sex_of_birth: data.sexAtBirth || '',
          height: data.height ? parseInt(data.height) : null,
          weight: data.weight ? parseInt(data.weight) : null,
          zip_code: data.zipCode || null
        }
      };

      console.log('💾 Saving personal info:', payload);
      
      const res = await authRequest(CUSTOM_ENDPOINTS.onboarding.personal, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: payload,
      });
      
      return res?.result ?? res;
    } catch (error) {
      console.error('Error saving personal info:', error);
      throw error;
    }
  },

  /**
   * Save health snapshot step
   * Updates user_settings table with health_snapshot JSON
   */
  async saveHealthSnapshot(data) {
    try {
      const payload = {
        user_id: data.userId || data.user_id,
        step: "health_snapshot",
        data_json: {
          health_snapshot: {
            health_conditions: data.healthConditions || '',
            medications: data.medications || '',
            allergies: data.allergies || '',
          }
        }
      };

      console.log('💾 Saving health snapshot:', payload);
      
      const res = await authRequest(CUSTOM_ENDPOINTS.onboarding.healthSnapshot, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: payload,
      });
      
      return res?.result ?? res;
    } catch (error) {
      console.error('Error saving health snapshot:', error);
      throw error;
    }
  },

  /**
   * Save lifestyle & habits step
   * Updates user_settings table with lifestyle JSON
   */
  async saveLifestyle(data) {
    try {
      const payload = {
        user_id: data.userId || data.user_id,
        step: "lifestyle",
        data_json: {
          lifestyle: {
            habits: data.lifestyleHabits || [],
            preferences: {
              // Additional lifestyle preferences can be added here
            }
          }
        }
      };

      console.log('💾 Saving lifestyle:', payload);
      
      const res = await authRequest(CUSTOM_ENDPOINTS.onboarding.lifestyle, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: payload,
      });
      
      return res?.result ?? res;
    } catch (error) {
      console.error('Error saving lifestyle:', error);
      throw error;
    }
  },

  /**
   * Save health goals step
   * Creates entries in goals table
   */
  async saveHealthGoals(data) {
    try {
      // Create the main goal data structure
      const goalsData = {
        title: "Health Goals",
        description: data.goalNotes || `Goals: ${data.healthGoals.join(', ') || 'No specific goals'}`,
        status: "on track",
        target_date: data.targetDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +90 days default
        visibility_scope: data.goalVisibility || "private",
      };

      const payload = {
        user_id: data.userId || data.user_id,
        step: "health_goals",
        data_json: goalsData
      };

      console.log('💾 Saving health goals:', payload);
      console.log('📋 Goals structure:', {
        title: goalsData.title,
        description: goalsData.description,
        status: goalsData.status,
        target_date: goalsData.target_date,
        visibility_scope: goalsData.visibility_scope
      });
      
      const res = await authRequest(CUSTOM_ENDPOINTS.onboarding.healthGoals, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: payload,
      });
      
      return res?.result ?? res;
    } catch (error) {
      console.error('Error saving health goals:', error);
      throw error;
    }
  },

  /**
   * Save privacy settings step
   * Updates user_settings table with privacy JSON
   */
  async savePrivacySettings(data) {
    try {
      const payload = {
        user_id: data.userId || data.user_id,
        step: "privacy",
        data_json: {
          privacy: {
            data_visibility: data.dataVisibility,
            email_nudges: data.emailNudges,
            wearable_sync: data.wearableSync,
            preferences: {
              // Additional privacy preferences can be added here
            }
          }
        }
      };

      console.log('💾 Saving privacy settings:', payload);
      
      const res = await authRequest(CUSTOM_ENDPOINTS.onboarding.privacy, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: payload,
      });
      
      return res?.result ?? res;
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      throw error;
    }
  },

  /**
   * Complete onboarding process
   * Marks onboarding as completed and updates user_settings
   */
  async completeOnboarding(data) {
    try {
      const payload = {
        user_id: data.userId || data.user_id,
        data_json: {
          onboarding: {
            completed: true,
            completed_at: new Date().toISOString(),
            steps_completed: data.stepsCompleted || [],
            preferences: {
              // Additional onboarding preferences
            }
          }
        }
      };

      console.log('🎯 Completing onboarding:', payload);
      
      const res = await authRequest(CUSTOM_ENDPOINTS.onboarding.complete, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: payload,
      });
      
      return res?.result ?? res;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  },

  /**
   * Generic step saver - can be used for any step
   */
  async saveStep(stepId, data) {
    try {
      const endpoint = CUSTOM_ENDPOINTS.onboarding.step(stepId);
      
      console.log(`💾 Saving step ${stepId}:`, data);
      
      const res = await authRequest(endpoint, {
        method: "POST",
        body: data,
      });
      
      return res?.result ?? res;
    } catch (error) {
      console.error(`Error saving step ${stepId}:`, error);
      throw error;
    }
  },

  /**
   * Get current onboarding progress
   */
  async getProgress(userId) {
    try {
      const payload = {
        user_id: userId,
        data_json: {}
      };

      console.log('📊 Getting onboarding progress with payload:', payload);

      const res = await authRequest(CUSTOM_ENDPOINTS.onboarding.progress, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: payload,
      });
      
      return res?.result ?? res;
    } catch (error) {
      console.error('Error getting onboarding progress:', error);
      throw error;
    }
  }
};
