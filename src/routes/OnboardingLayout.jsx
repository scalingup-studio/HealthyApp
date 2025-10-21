import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext.jsx';
import { useNotifications } from '../api/NotificationContext.jsx';
import { OnboardingApi } from '../api/onboardingApi.js';
import { Logo } from '../components/Logo.jsx';
import './OnboardingLayout.css';

const OnboardingLayout = () => {
  const navigate = useNavigate();
  const { user, completeOnboarding } = useAuth();
  const { showSuccess, showError } = useNotifications();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    sexAtBirth: '',
    genderIdentity: '',
    height: '',
    weight: '',
    zipCode: '',

    // Health Snapshot
    healthConditions: '',
    medications: '',
    allergies: '',

    // Lifestyle & Habits
    lifestyleHabits: [],

    // Health Goals
    healthGoals: [],
    otherGoal: '',

    // Privacy Settings
    dataVisibility: 'private',
    emailNudges: true,
    wearableSync: false
  });

  const steps = [
    { id: 'welcome', title: 'Welcome', description: 'Get started with Anatomous' },
    { id: 'personal', title: 'Personal Info', description: 'Basic information' },
    { id: 'health', title: 'Health Snapshot', description: 'Current health status' },
    { id: 'lifestyle', title: 'Lifestyle & Habits', description: 'Daily habits' },
    { id: 'goals', title: 'Health Goals', description: 'What you want to achieve' },
    { id: 'privacy', title: 'Privacy Settings', description: 'Data preferences' },
    { id: 'review', title: 'Review & Finish', description: 'Complete setup' }
  ];

  const lifestyleOptions = [
    'Sedentary lifestyle',
    'Regular exercise',
    'High stress',
    'Irregular sleep',
    'Smokes or vapes',
    'Drinks alcohol',
    'Special diet (e.g., keto, plant-based)',
    'Works night shifts',
    'Manages a chronic condition',
    'Prefers natural or alternative medicine'
  ];

  const healthGoalOptions = [
    'Lose weight',
    'Gain muscle',
    'Improve sleep',
    'Reduce stress',
    'Manage a condition',
    'Improve energy',
    'Optimize performance',
    'Prevent disease',
    'General wellness'
  ];

  // Load saved progress from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('onboarding-progress');
    const savedStep = localStorage.getItem('onboarding-step');
    const savedCompleted = localStorage.getItem('onboarding-completed');
    
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }
    if (savedCompleted) {
      setCompletedSteps(new Set(JSON.parse(savedCompleted)));
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = () => {
    localStorage.setItem('onboarding-progress', JSON.stringify(formData));
    localStorage.setItem('onboarding-step', currentStep.toString());
    localStorage.setItem('onboarding-completed', JSON.stringify([...completedSteps]));
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const saveStepData = async (stepIndex) => {
    const stepId = steps[stepIndex].id;
    
    switch (stepId) {
      case 'personal':
        await OnboardingApi.savePersonalInfo(formData);
        break;
      case 'health_snapshot':
        await OnboardingApi.saveHealthSnapshot(formData);
        break;
      case 'lifestyle':
        await OnboardingApi.saveLifestyle(formData);
        break;
      case 'health_goals':
        await OnboardingApi.saveHealthGoals(formData);
        break;
      case 'privacy':
        await OnboardingApi.savePrivacySettings(formData);
        break;
      default:
        // For welcome and review steps, no data to save
        break;
    }
  };

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      try {
        // Save current step data to server
        await saveStepData(currentStep);
        
        setCompletedSteps(prev => new Set([...prev, currentStep]));
        setCurrentStep(prev => prev + 1);
        saveProgress();
      } catch (error) {
        console.error('Error saving step data:', error);
        showError('Failed to save step. Please try again.');
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (stepIndex) => {
    if (stepIndex <= currentStep || completedSteps.has(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  };

  const finishLater = () => {
    saveProgress();
    navigate('/dashboard');
  };

  const completeOnboardingProcess = async () => {
    try {
      setLoading(true);
      
      // Save the last step (privacy) if not already saved
      if (currentStep === 6) {
        await OnboardingApi.savePrivacySettings(formData);
      }
      
      // Complete onboarding
      await OnboardingApi.completeOnboarding({
        stepsCompleted: [...completedSteps, currentStep]
      });
      
      // Mark onboarding as completed in AuthContext
      await completeOnboarding();
      
      // Clear saved progress
      localStorage.removeItem('onboarding-progress');
      localStorage.removeItem('onboarding-step');
      localStorage.removeItem('onboarding-completed');
      
      showSuccess('Welcome to Anatomous! Your profile has been set up successfully.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      showError('Failed to complete setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Welcome
        return (
          <div className="onboarding-step-content">
            <h2>Welcome to Anatomous</h2>
            <p className="step-description">
              Let's set up your personalized health profile in just a few steps. 
              This will help us provide you with tailored insights and recommendations.
            </p>
            <div className="welcome-info">
              <div className="info-item">
                <span className="info-icon">⏱️</span>
                <span>3-5 minutes to complete</span>
              </div>
              <div className="info-item">
                <span className="info-icon">🔒</span>
                <span>Your data is secure and private</span>
              </div>
              <div className="info-item">
                <span className="info-icon">📊</span>
                <span>Get personalized health insights</span>
              </div>
            </div>
            <button className="btn primary large" onClick={nextStep}>
              Let's Get Started
            </button>
          </div>
        );

      case 1: // Personal Info
        return (
          <div className="onboarding-step-content">
            <h2>Personal Information</h2>
            <p className="step-description">Tell us about yourself to personalize your experience.</p>
            
            <div className="form-grid">
              <div className="form-field">
                <label>First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  placeholder="Enter your first name"
                  required
                />
              </div>
              
              <div className="form-field">
                <label>Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  placeholder="Enter your last name"
                  required
                />
              </div>
              
              <div className="form-field">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                  required
                />
              </div>
              
              <div className="form-field">
                <label>Sex at Birth *</label>
                <select
                  value={formData.sexAtBirth}
                  onChange={(e) => updateFormData('sexAtBirth', e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-field">
                <label>Gender Identity</label>
                <select
                  value={formData.genderIdentity}
                  onChange={(e) => updateFormData('genderIdentity', e.target.value)}
                >
                  <option value="">Select (optional)</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="transgender">Transgender</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
              
              <div className="form-field">
                <label>Height (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => updateFormData('height', e.target.value)}
                  placeholder="e.g., 175"
                />
              </div>
              
              <div className="form-field">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => updateFormData('weight', e.target.value)}
                  placeholder="e.g., 70"
                />
              </div>
              
              <div className="form-field">
                <label>ZIP Code</label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => updateFormData('zipCode', e.target.value)}
                  placeholder="e.g., 94105"
                />
              </div>
            </div>
            
            <div className="step-navigation">
              <button className="btn outline" onClick={prevStep}>Back</button>
              <button 
                className="btn primary" 
                onClick={nextStep}
                disabled={loading || !formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.sexAtBirth}
              >
                {loading ? 'Saving...' : 'Continue'}
              </button>
            </div>
          </div>
        );

      case 2: // Health Snapshot
        return (
          <div className="onboarding-step-content">
            <h2>Health Snapshot</h2>
            <p className="step-description">Help us understand your current health status.</p>
            
            <div className="form-fields">
              <div className="form-field">
                <label>Known Health Conditions</label>
                <textarea
                  value={formData.healthConditions}
                  onChange={(e) => updateFormData('healthConditions', e.target.value)}
                  placeholder="List any health conditions you have (e.g., diabetes, hypertension, asthma)"
                  rows={4}
                />
              </div>
              
              <div className="form-field">
                <label>Current Medications (Optional)</label>
                <textarea
                  value={formData.medications}
                  onChange={(e) => updateFormData('medications', e.target.value)}
                  placeholder="List any medications you're currently taking"
                  rows={3}
                />
              </div>
              
              <div className="form-field">
                <label>Known Allergies (Optional)</label>
                <textarea
                  value={formData.allergies}
                  onChange={(e) => updateFormData('allergies', e.target.value)}
                  placeholder="List any allergies you have"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="step-navigation">
              <button className="btn outline" onClick={prevStep}>Back</button>
              <button 
                className="btn primary" 
                onClick={nextStep}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Continue'}
              </button>
            </div>
          </div>
        );

      case 3: // Lifestyle & Habits
        return (
          <div className="onboarding-step-content">
            <h2>Lifestyle & Habits</h2>
            <p className="step-description">Select all that apply to your lifestyle.</p>
            
            <div className="checkbox-grid">
              {lifestyleOptions.map((option) => (
                <label key={option} className="checkbox">
                  <input
                    type="checkbox"
                    checked={formData.lifestyleHabits.includes(option)}
                    onChange={() => toggleArrayItem('lifestyleHabits', option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            
            <div className="step-navigation">
              <button className="btn outline" onClick={prevStep}>Back</button>
              <button 
                className="btn primary" 
                onClick={nextStep}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Continue'}
              </button>
            </div>
          </div>
        );

      case 4: // Health Goals
        return (
          <div className="onboarding-step-content">
            <h2>Health Goals</h2>
            <p className="step-description">What would you like to achieve with Anatomous?</p>
            
            <div className="checkbox-grid">
              {healthGoalOptions.map((goal) => (
                <label key={goal} className="checkbox">
                  <input
                    type="checkbox"
                    checked={formData.healthGoals.includes(goal)}
                    onChange={() => toggleArrayItem('healthGoals', goal)}
                  />
                  <span>{goal}</span>
                </label>
              ))}
            </div>
            
            <div className="form-field">
              <label>Other Goals (Optional)</label>
              <textarea
                value={formData.otherGoal}
                onChange={(e) => updateFormData('otherGoal', e.target.value)}
                placeholder="Describe any other health goals you have"
                rows={3}
              />
            </div>
            
            <div className="step-navigation">
              <button className="btn outline" onClick={prevStep}>Back</button>
              <button 
                className="btn primary" 
                onClick={nextStep}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Continue'}
              </button>
            </div>
          </div>
        );

      case 5: // Privacy Settings
        return (
          <div className="onboarding-step-content">
            <h2>Privacy Settings</h2>
            <p className="step-description">Control how your data is used and shared.</p>
            
            <div className="form-fields">
              <div className="form-field">
                <label>Who can see my data?</label>
                <select
                  value={formData.dataVisibility}
                  onChange={(e) => updateFormData('dataVisibility', e.target.value)}
                >
                  <option value="private">Private - Only I can see my data</option>
                  <option value="shareable">Shareable - I can share with healthcare providers</option>
                  <option value="export-only">Export-only - I can export my data</option>
                </select>
              </div>
              
              <div className="checkbox">
                <input
                  type="checkbox"
                  checked={formData.emailNudges}
                  onChange={(e) => updateFormData('emailNudges', e.target.checked)}
                />
                <span>Receive email nudges and insights</span>
              </div>
              
              <div className="checkbox">
                <input
                  type="checkbox"
                  checked={formData.wearableSync}
                  onChange={(e) => updateFormData('wearableSync', e.target.checked)}
                />
                <span>Enable wearable sync (coming soon)</span>
              </div>
            </div>
            
            <div className="step-navigation">
              <button className="btn outline" onClick={prevStep}>Back</button>
              <button 
                className="btn primary" 
                onClick={nextStep}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Continue'}
              </button>
            </div>
          </div>
        );

      case 6: // Review & Finish
        return (
          <div className="onboarding-step-content">
            <h2>Review & Finish</h2>
            <p className="step-description">Review your information and complete your setup.</p>
            
            <div className="review-sections">
              <div className="review-section">
                <h3>Personal Information</h3>
                <div className="review-content">
                  <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                  <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
                  <p><strong>Sex at Birth:</strong> {formData.sexAtBirth}</p>
                  {formData.genderIdentity && <p><strong>Gender Identity:</strong> {formData.genderIdentity}</p>}
                  {formData.height && <p><strong>Height:</strong> {formData.height} cm</p>}
                  {formData.weight && <p><strong>Weight:</strong> {formData.weight} kg</p>}
                  {formData.zipCode && <p><strong>ZIP Code:</strong> {formData.zipCode}</p>}
                </div>
                <button className="btn ghost small" onClick={() => goToStep(1)}>Edit</button>
              </div>
              
              <div className="review-section">
                <h3>Health Information</h3>
                <div className="review-content">
                  {formData.healthConditions && <p><strong>Health Conditions:</strong> {formData.healthConditions}</p>}
                  {formData.medications && <p><strong>Medications:</strong> {formData.medications}</p>}
                  {formData.allergies && <p><strong>Allergies:</strong> {formData.allergies}</p>}
                </div>
                <button className="btn ghost small" onClick={() => goToStep(2)}>Edit</button>
              </div>
              
              <div className="review-section">
                <h3>Lifestyle & Goals</h3>
                <div className="review-content">
                  {formData.lifestyleHabits.length > 0 && (
                    <p><strong>Lifestyle Habits:</strong> {formData.lifestyleHabits.join(', ')}</p>
                  )}
                  {formData.healthGoals.length > 0 && (
                    <p><strong>Health Goals:</strong> {formData.healthGoals.join(', ')}</p>
                  )}
                  {formData.otherGoal && <p><strong>Other Goals:</strong> {formData.otherGoal}</p>}
                </div>
                <button className="btn ghost small" onClick={() => goToStep(3)}>Edit</button>
              </div>
              
              <div className="review-section">
                <h3>Privacy Settings</h3>
                <div className="review-content">
                  <p><strong>Data Visibility:</strong> {formData.dataVisibility}</p>
                  <p><strong>Email Nudges:</strong> {formData.emailNudges ? 'Yes' : 'No'}</p>
                  <p><strong>Wearable Sync:</strong> {formData.wearableSync ? 'Yes' : 'No'}</p>
                </div>
                <button className="btn ghost small" onClick={() => goToStep(5)}>Edit</button>
              </div>
            </div>
            
            <div className="step-navigation">
              <button className="btn outline" onClick={prevStep}>Back</button>
              <button 
                className="btn success large" 
                onClick={completeOnboardingProcess}
                disabled={loading}
              >
                {loading ? 'Completing Setup...' : 'Complete Setup & Go to Dashboard'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="onboarding-layout">
      {/* Header */}
      <header className="onboarding-header">
        <div className="header-left">
          <Logo height={32} />
        </div>
        
        <div className="header-center">
          <div className="progress-indicator">
            Step {currentStep + 1} of {steps.length}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="header-right">
          <button className="btn ghost small" onClick={finishLater}>
            Finish Later
          </button>
          <button className="btn ghost small" onClick={() => window.open('https://crisp.chat', '_blank')}>
            Help
          </button>
          <button className="btn ghost small" onClick={() => navigate('/logout')}>
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="onboarding-content">
        {/* Left Sidebar */}
        <aside className="onboarding-sidebar">
          <nav className="steps-navigation">
            {steps.map((step, index) => (
              <button
                key={step.id}
                className={`step-item ${index === currentStep ? 'active' : ''} ${completedSteps.has(index) ? 'completed' : ''}`}
                onClick={() => goToStep(index)}
                disabled={index > currentStep && !completedSteps.has(index)}
              >
                <div className="step-number">
                  {completedSteps.has(index) ? '✓' : index + 1}
                </div>
                <div className="step-info">
                  <div className="step-title">{step.title}</div>
                  <div className="step-description">{step.description}</div>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Panel */}
        <main className="onboarding-main">
          {renderStepContent()}
        </main>
      </div>

      {/* Footer */}
      <footer className="onboarding-footer">
        <div className="footer-content">
          <div className="footer-left">
            <span>© 2025 Anatomous</span>
            <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>
          </div>
          <div className="footer-right">
            <a href="https://crisp.chat" target="_blank" rel="noopener noreferrer">Need Help?</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OnboardingLayout;
