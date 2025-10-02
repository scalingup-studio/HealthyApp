import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext.jsx';
import { UserSettingsApi } from '../api/userSettingsApi.js'; 
import './OnboardingPage.css';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { completeOnboarding, user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Health Snapshot
    age: '',
    height: '',
    weight: '',
    gender: '',
    
    // Lifestyle & Habits
    diet: '',
    sleepHours: '',
    activityLevel: '',
    smoking: '',
    alcohol: '',
    
    // Health Goals
    goals: [],
    targetWeight: '',
    targetDate: '',
    focusAreas: [],
    goalNotes: '',
    
    // Privacy Settings
    profileVisibility: 'private',
    dataSharing: false,
    newsletter: true
  });

  const steps = [
    { id: 'welcome', title: 'Welcome' },
    { id: 'personal', title: 'Personal Info' },
    { id: 'health_snapshot', title: 'Health Snapshot' },
    { id: 'lifestyle', title: 'Lifestyle & Habits' },
    { id: 'health_goals', title: 'Health Goals' },
    { id: 'privacy', title: 'Privacy Settings' },
    { id: 'review', title: 'Review & Finish' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
     // ✅ Save the current step data before moving on
      if (currentStep > 0) { // Don't save the welcome step
        await saveCurrentStep();
      }
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // ✅ Function to save the current step
  const saveCurrentStep = async () => {
    try {
      const step = steps[currentStep].id;
      
     // ✅ We don't try to save welcome and review steps
      if (step === 'welcome' || step === 'review') {
        console.log(`⏭️ Skipping save for step: ${step} (no data to save)`);
        return;
      }
      
      const stepData = getStepData(step);
      
      // ✅ Check if there is data to save
      if (Object.keys(stepData).length === 0) {
        console.log(`⏭️ No data to save for step: ${step}`);
        return;
      }
      
      console.log('📤 Sending to API - step:', step, 'data:', stepData);
      
      const requestData = {
        user_id: user?.id,
        step: step,
        data_json: stepData  
      };
      
      console.log('📦 Final request data:', requestData);
      
      await UserSettingsApi.saveOnboardingStep(step, requestData);
      
      console.log(`✅ Step ${step} saved successfully`);
      
    } catch (error) {
      console.error(`❌ Error saving step ${steps[currentStep].id}:`, error);
      
     // ✅ Detailed information about the error type
      if (error.status === 404) {
        console.warn(`🔧 Endpoint /onboarding/${steps[currentStep].id} not found in Xano`);
        console.log('💡 Create this endpoint in Xano or use a different approach');
      } else if (error.status === 500) {
        console.warn(`⚙️ Server error for step ${steps[currentStep].id}`);
        console.log('💡 Check Xano function stack for this endpoint');
      } else if (error.message.includes('Network')) {
        console.warn('🌐 Network connection issue');
      }
      // ✅ Skip the error to continue onboarding
      console.warn('Continuing to next step despite save error');
    }
  };

  // ✅ Function to get data for a specific step
  const getStepData = (step) => {
    console.log('🔄 Getting data for step:', step);
    console.log('📊 Current formData:', formData);
    
    switch (step) {
      case 'personal':
        const personalData = {
          firstName: formData.firstName || '',
          lastName: formData.lastName || '',
          email: formData.email || '',
          phone: formData.phone || ''
        };
        console.log('👤 Personal data:', personalData);
        return personalData;
        
      case 'health_snapshot':
        const healthData = {
          age: formData.age ? parseInt(formData.age) : 0,
          height: formData.height || '',
          weight: formData.weight || '',
          gender: formData.gender || ''
        };
        console.log('🏥 Health data:', healthData);
        return healthData;
        
      case 'lifestyle':
        const lifestyleData = {
          diet: formData.diet || '',
          sleepHours: formData.sleepHours ? parseInt(formData.sleepHours) : 0,
          activityLevel: formData.activityLevel || '',
          smoking: formData.smoking || '',
          alcohol: formData.alcohol || ''
        };
        console.log('🥗 Lifestyle data:', lifestyleData);
        return lifestyleData;
        
        case 'health_goals':
            const goalsData = {
              title: "Health Goals",
              description: formData.goalNotes || `Goals: ${formData.goals.join(', ') || 'No specific goals'}`,
              status: "active",
              target_date: formData.targetDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +90 днів за замовчуванням
              visibility_scope: "private",
            };
            console.log('🎯 Goals data:', goalsData);
            return goalsData;
        
      case 'privacy':
        const privacyData = {
          profileVisibility: formData.profileVisibility || 'private',
          dataSharing: Boolean(formData.dataSharing),
          newsletter: Boolean(formData.newsletter)
        };
        console.log('🔒 Privacy data:', privacyData);
        return privacyData;
        
      default:
        console.log('⚪ No data for step:', step);
        return {};
    }
  };

  const handleComplete = async () => {
    try {
      setLoading(true);
      
      // ✅ Зберігаємо останній крок
      await saveCurrentStep();
      
      // ✅ Викликаємо completeOnboarding для оновлення статусу в AuthContext
      completeOnboarding();
      
      // ✅ Перенаправляємо на dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('There was an error completing your setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

 // Add this useEffect to debug formData changes
  React.useEffect(() => {
    console.log('🔄 formData updated:', formData);
  }, [formData]);

  const renderStepContent = () => {
    // Додайте перевірку поточних значень для кожного кроку
    React.useEffect(() => {
      console.log(`📋 Current step ${currentStep} (${steps[currentStep]?.id}) form values:`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        height: formData.height,
        weight: formData.weight,
        gender: formData.gender
      });
    }, [currentStep, formData]);

    switch (currentStep) {
      case 0: // Welcome
        return (
          <div className="step-content welcome-step">
            <h2>Welcome to Anatomous!</h2>
            <p>Let's set up your profile to personalize your health and fitness journey.</p>
            <div className="welcome-features">
              <div className="feature">
                <h3>🎯 Personalized Plans</h3>
                <p>Workouts and nutrition tailored to your goals</p>
              </div>
              <div className="feature">
                <h3>📊 Progress Tracking</h3>
                <p>Monitor your health metrics and achievements</p>
              </div>
              <div className="feature">
                <h3>🔒 Privacy First</h3>
                <p>Your data is always secure and private</p>
              </div>
            </div>
          </div>
        );

      case 1: // Personal Info
        return (
          <div className="step-content">
            <h2>Personal Information</h2>
            <p>Tell us a bit about yourself</p>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => {
                    console.log('First name changed:', e.target.value);
                    handleInputChange('firstName', e.target.value);
                  }}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => {
                    console.log('Last name changed:', e.target.value);
                    handleInputChange('lastName', e.target.value);
                  }}
                  placeholder="Enter your last name"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    console.log('Email changed:', e.target.value);
                    handleInputChange('email', e.target.value);
                  }}
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    console.log('Phone changed:', e.target.value);
                    handleInputChange('phone', e.target.value);
                  }}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>
        );

      case 2: // Health Snapshot
        return (
          <div className="step-content">
            <h2>Health Snapshot</h2>
            <p>Help us understand your current health status</p>
            <div className="form-grid">
              <div className="form-group">
                <label>Age *</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => {
                    console.log('Age changed:', e.target.value);
                    handleInputChange('age', e.target.value);
                  }}
                  placeholder="Years"
                />
              </div>
              <div className="form-group">
                <label>Height *</label>
                <input
                  type="text"
                  value={formData.height}
                  onChange={(e) => {
                    console.log('Height changed:', e.target.value);
                    handleInputChange('height', e.target.value);
                  }}
                  placeholder="cm or ft/in"
                />
              </div>
              <div className="form-group">
                <label>Weight *</label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => {
                    console.log('Weight changed:', e.target.value);
                    handleInputChange('weight', e.target.value);
                  }}
                  placeholder="kg or lbs"
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => {
                    console.log('Gender changed:', e.target.value);
                    handleInputChange('gender', e.target.value);
                  }}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3: // Lifestyle & Habits
        return (
          <div className="step-content">
            <h2>Lifestyle & Habits</h2>
            <p>Tell us about your daily habits and lifestyle</p>
            <div className="form-grid">
              <div className="form-group">
                <label>Diet Type</label>
                <select
                  value={formData.diet}
                  onChange={(e) => handleInputChange('diet', e.target.value)}
                >
                  <option value="">Select diet</option>
                  <option value="omnivore">Omnivore</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="keto">Keto</option>
                  <option value="paleo">Paleo</option>
                  <option value="mediterranean">Mediterranean</option>
                </select>
              </div>
              <div className="form-group">
                <label>Sleep Hours</label>
                <input
                  type="number"
                  value={formData.sleepHours}
                  onChange={(e) => handleInputChange('sleepHours', e.target.value)}
                  placeholder="Average hours per night"
                />
              </div>
              <div className="form-group">
                <label>Activity Level</label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                >
                  <option value="">Select activity level</option>
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Lightly Active</option>
                  <option value="moderate">Moderately Active</option>
                  <option value="very">Very Active</option>
                  <option value="extreme">Extremely Active</option>
                </select>
              </div>
            </div>
          </div>
        );

        case 4: // Health Goals
        return (
          <div className="step-content">
            <h2>Health Goals</h2>
            <p>What do you want to achieve?</p>
            
            {/* Основні цілі */}
            <div className="goals-section">
              <h3>Primary Goals</h3>
              <div className="goals-grid">
                <div className="goal-option">
                  <input
                    type="checkbox"
                    id="weight-loss"
                    checked={formData.goals.includes('weight-loss')}
                    onChange={(e) => {
                      const goals = e.target.checked
                        ? [...formData.goals, 'weight-loss']
                        : formData.goals.filter(g => g !== 'weight-loss');
                      handleInputChange('goals', goals);
                    }}
                  />
                  <label htmlFor="weight-loss">Weight Loss</label>
                </div>
                <div className="goal-option">
                  <input
                    type="checkbox"
                    id="muscle-gain"
                    checked={formData.goals.includes('muscle-gain')}
                    onChange={(e) => {
                      const goals = e.target.checked
                        ? [...formData.goals, 'muscle-gain']
                        : formData.goals.filter(g => g !== 'muscle-gain');
                      handleInputChange('goals', goals);
                    }}
                  />
                  <label htmlFor="muscle-gain">Muscle Gain</label>
                </div>
                <div className="goal-option">
                  <input
                    type="checkbox"
                    id="fitness"
                    checked={formData.goals.includes('fitness')}
                    onChange={(e) => {
                      const goals = e.target.checked
                        ? [...formData.goals, 'fitness']
                        : formData.goals.filter(g => g !== 'fitness');
                      handleInputChange('goals', goals);
                    }}
                  />
                  <label htmlFor="fitness">Improve Fitness</label>
                </div>
                <div className="goal-option">
                  <input
                    type="checkbox"
                    id="nutrition"
                    checked={formData.goals.includes('nutrition')}
                    onChange={(e) => {
                      const goals = e.target.checked
                        ? [...formData.goals, 'nutrition']
                        : formData.goals.filter(g => g !== 'nutrition');
                      handleInputChange('goals', goals);
                    }}
                  />
                  <label htmlFor="nutrition">Better Nutrition</label>
                </div>
                <div className="goal-option">
                  <input
                    type="checkbox"
                    id="stress-reduction"
                    checked={formData.goals.includes('stress-reduction')}
                    onChange={(e) => {
                      const goals = e.target.checked
                        ? [...formData.goals, 'stress-reduction']
                        : formData.goals.filter(g => g !== 'stress-reduction');
                      handleInputChange('goals', goals);
                    }}
                  />
                  <label htmlFor="stress-reduction">Stress Reduction</label>
                </div>
                <div className="goal-option">
                  <input
                    type="checkbox"
                    id="sleep-improvement"
                    checked={formData.goals.includes('sleep-improvement')}
                    onChange={(e) => {
                      const goals = e.target.checked
                        ? [...formData.goals, 'sleep-improvement']
                        : formData.goals.filter(g => g !== 'sleep-improvement');
                      handleInputChange('goals', goals);
                    }}
                  />
                  <label htmlFor="sleep-improvement">Better Sleep</label>
                </div>
              </div>
            </div>
          </div>
        );

      case 5: // Privacy Settings
        return (
          <div className="step-content">
            <h2>Privacy Settings</h2>
            <p>Control how your data is used and shared</p>
            <div className="privacy-options">
              <div className="privacy-option">
                <label>Profile Visibility</label>
                <select
                  value={formData.profileVisibility}
                  onChange={(e) => handleInputChange('profileVisibility', e.target.value)}
                >
                  <option value="private">Private</option>
                  <option value="friends">Friends Only</option>
                  <option value="public">Public</option>
                </select>
              </div>
              <div className="privacy-option checkbox-option">
                <input
                  type="checkbox"
                  id="data-sharing"
                  checked={formData.dataSharing}
                  onChange={(e) => handleInputChange('dataSharing', e.target.checked)}
                />
                <label htmlFor="data-sharing">
                  Allow anonymous data for research and improvements
                </label>
              </div>
              <div className="privacy-option checkbox-option">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={formData.newsletter}
                  onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                />
                <label htmlFor="newsletter">
                  Send me health tips and newsletter updates
                </label>
              </div>
            </div>
          </div>
        );

      case 6: // Review & Finish
        return (
          <div className="step-content review-step">
            <h2>Review Your Information</h2>
            <p>Please review all the information before completing your setup</p>
            <div className="review-section">
              <h3>Personal Info</h3>
              <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone:</strong> {formData.phone || 'Not provided'}</p>
            </div>
            <div className="review-section">
              <h3>Health & Lifestyle</h3>
              <p><strong>Age:</strong> {formData.age}</p>
              <p><strong>Height:</strong> {formData.height}</p>
              <p><strong>Weight:</strong> {formData.weight}</p>
              <p><strong>Diet:</strong> {formData.diet || 'Not specified'}</p>
              <p><strong>Sleep:</strong> {formData.sleepHours} hours/night</p>
            </div>
            <div className="review-section">
              <h3>Goals & Privacy</h3>
              <p><strong>Goals:</strong> {formData.goals.join(', ') || 'None selected'}</p>
              <p><strong>Profile:</strong> {formData.profileVisibility}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="onboarding-container">
      {/* Header */}
      <header className="onboarding-header">
        <div className="company-logo">
          <span>Logo</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="onboarding-content">
        {/* Progress Steps */}
        <div className="progress-steps-vertical">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            >
              <div className="step-indicator">
                <div className="step-number">
                  {index < currentStep ? '✓' : index + 1}
                </div>
              </div>
              <div className="step-info">
                <div className="step-title">{step.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form Section */}
        <div className="onboarding-form-container">
          {renderStepContent()}
          
          {/* Navigation Buttons */}
          <div className="form-navigation">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleBack}
              disabled={currentStep === 0 || loading}
            >
              Back
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? 'Saving...' : 
               currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;