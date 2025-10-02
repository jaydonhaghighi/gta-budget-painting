import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById, emergencyServices, type EmergencySubService } from '../data/services';
import { type EstimateBreakdown } from '../utils/estimationCalculator';
import CalculatedServiceForm from '../components/forms/CalculatedServiceForm';
import FlatRateServiceForm from '../components/forms/FlatRateServiceForm';
import CustomQuoteServiceForm from '../components/forms/CustomQuoteServiceForm';
import './ServicePage.css';

type ServiceStep = 'service-form' | 'emergency-selection' | 'customer-info' | 'confirmation';

interface SavedBookingState {
  step: ServiceStep;
  selectedEmergencyService: EmergencySubService | null;
  estimate: EstimateBreakdown | null;
  formData: any;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  preferredDate: string;
  timestamp: number;
}

const ServicePage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  
  const service = serviceId ? getServiceById(serviceId) : null;
  
  const [step, setStep] = useState<ServiceStep>('service-form');
  const [selectedEmergencyService, setSelectedEmergencyService] = useState<EmergencySubService | null>(null);
  const [estimate, setEstimate] = useState<EstimateBreakdown | null>(null);
  const [formData, setFormData] = useState<any>({}); // Store form field values
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [preferredDate, setPreferredDate] = useState('');
  const [isRestoringState, setIsRestoringState] = useState(true);
  const [showRestoredMessage, setShowRestoredMessage] = useState(false);

  // Redirect if service not found
  useEffect(() => {
    if (!service) {
      navigate('/');
    }
  }, [service, navigate]);

  // Restore saved booking state on mount
  useEffect(() => {
    if (serviceId && isRestoringState) {
      try {
        const savedData = localStorage.getItem(`booking-${serviceId}`);
        if (savedData) {
          const parsed: SavedBookingState = JSON.parse(savedData);
          // Only restore if less than 24 hours old
          const age = Date.now() - parsed.timestamp;
          const twentyFourHours = 24 * 60 * 60 * 1000;
          
          if (age < twentyFourHours) {
            // Restore state
            setStep(parsed.step);
            setSelectedEmergencyService(parsed.selectedEmergencyService);
            setEstimate(parsed.estimate);
            setFormData(parsed.formData || {});
            setCustomerInfo(parsed.customerInfo);
            setPreferredDate(parsed.preferredDate);
            setShowRestoredMessage(true);
            
            // Hide message after 4 seconds
            setTimeout(() => setShowRestoredMessage(false), 4000);
          } else {
            // Data too old, remove it
            localStorage.removeItem(`booking-${serviceId}`);
          }
        }
      } catch (error) {
        console.error('Error restoring booking state:', error);
        localStorage.removeItem(`booking-${serviceId}`);
      }
      setIsRestoringState(false);
    }
  }, [serviceId, isRestoringState]);

  // Save booking state to localStorage whenever it changes
  useEffect(() => {
    if (serviceId && !isRestoringState && step !== 'confirmation') {
      try {
        const dataToSave: SavedBookingState = {
          step,
          selectedEmergencyService,
          estimate,
          formData,
          customerInfo,
          preferredDate,
          timestamp: Date.now()
        };
        localStorage.setItem(`booking-${serviceId}`, JSON.stringify(dataToSave));
      } catch (error) {
        console.error('Error saving booking state:', error);
      }
    }
  }, [serviceId, step, selectedEmergencyService, estimate, formData, customerInfo, preferredDate, isRestoringState]);

  // Show emergency selection for 24/7 emergency service (only if not restoring state)
  useEffect(() => {
    if (!isRestoringState && service?.id === 'emergency-247' && step === 'service-form') {
      setStep('emergency-selection');
    }
  }, [service, step, isRestoringState]);

  if (!service) {
    return null;
  }

  // Don't render form until restoration is complete
  if (isRestoringState) {
    return (
      <div className="service-page">
        <div className="service-page-header">
          <div className="container">
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              Loading...
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    if (step === 'customer-info') {
      setStep('service-form');
    } else {
      handleBackToServices();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // TODO: Save to Firebase
      
      // Clear saved booking progress on successful submission
      if (serviceId) {
        localStorage.removeItem(`booking-${serviceId}`);
        console.log('Booking submitted, cleared saved progress');
      }
      
      setStep('confirmation');
    } catch (error) {
      console.error('Error submitting booking:', error);
      // Keep localStorage data if submission fails
    }
  };

  // Clear saved data when user navigates back to services
  const handleBackToServices = () => {
    if (serviceId && step !== 'confirmation') {
      const shouldClear = window.confirm(
        'Going back will clear your current progress. Are you sure?'
      );
      if (shouldClear) {
        localStorage.removeItem(`booking-${serviceId}`);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  // Determine current step number for progress indicator
  const getStepNumber = () => {
    switch (step) {
      case 'emergency-selection':
      case 'service-form':
        return 1;
      case 'customer-info':
        return 2;
      case 'confirmation':
        return 3;
      default:
        return 1;
    }
  };

  const currentStepNumber = getStepNumber();

  return (
    <div className="service-page">
      {/* Restored Progress Notification */}
      {showRestoredMessage && (
        <div className="restored-notification">
          <div className="container">
            <div className="restored-message">
              ✓ Your progress has been restored. Continue where you left off!
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="service-page-header">
        <div className="container">
          <button className="btn-back" onClick={handleBack}>
            ← {step === 'service-form' || step === 'emergency-selection' ? 'Back to Services' : 'Back'}
          </button>
        </div>
      </div>

      {/* Progress Indicator */}
      {step !== 'confirmation' && (
        <div className="progress-container">
          <div className="container">
            <div className="progress-indicator">
              <div className={`progress-step ${currentStepNumber >= 1 ? 'active' : ''} ${currentStepNumber > 1 ? 'completed' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-label">
                  {service?.id === 'emergency-247' ? 'Select Emergency' : 'Service Details'}
                </div>
              </div>
              
              <div className={`progress-step ${currentStepNumber >= 2 ? 'active' : ''} ${currentStepNumber > 2 ? 'completed' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Your Information</div>
              </div>
              
              <div className={`progress-step ${currentStepNumber >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-label">Confirmation</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Service Selection */}
      {step === 'emergency-selection' && (
        <section className="emergency-selection-section">
          <div className="container">
            <div className="emergency-selection-card">
              <h2>Select Emergency Service</h2>
              <p>Choose the specific emergency service you need:</p>
              
              <div className="emergency-services-grid">
                {emergencyServices.map((emergencyService) => (
                  <div
                    key={emergencyService.id}
                    className="emergency-service-card"
                    onClick={() => {
                      setSelectedEmergencyService(emergencyService);
                      setStep('service-form');
                    }}
                  >
                    <h4>{emergencyService.name}</h4>
                    <p>{emergencyService.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Service Form */}
      {step === 'service-form' && service.id !== 'emergency-247' && (
        <section className="service-form-section">
          <div className="container">
            <div className="service-form-header">
              <span className="service-icon-large">{service.icon}</span>
              <div>
                <h1>{service.name}</h1>
                {selectedEmergencyService && (
                  <p className="emergency-subservice">{selectedEmergencyService.name}</p>
                )}
                <p className="service-description">{service.description}</p>
              </div>
            </div>

            <div className="service-form-content">
              {service.type === 'calculated' && (
                <CalculatedServiceForm
                  service={service}
                  initialFormData={formData}
                  initialEstimate={estimate}
                  onEstimateCalculated={(est, data) => {
                    setEstimate(est);
                    setFormData(data);
                    setStep('customer-info');
                  }}
                  onFormDataChange={(data) => {
                    setFormData(data);
                  }}
                />
              )}

              {service.type === 'flat-rate' && (
                <FlatRateServiceForm
                  service={service}
                  onProceed={() => {
                    setStep('customer-info');
                  }}
                />
              )}

              {service.type === 'custom-quote' && (
                <CustomQuoteServiceForm
                  service={service}
                  onSubmit={() => {
                    setStep('customer-info');
                  }}
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Customer Info */}
      {step === 'customer-info' && (
        <section className="customer-info-section">
          <div className="container">
            <div className="customer-info-card">
              <h2>Almost Done!</h2>
              <p className="section-intro">Provide your contact information to receive your quote.</p>

              <form onSubmit={handleSubmit}>
                <div className="form-grid-2col">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone *</label>
                    <input
                      type="tel"
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Address *</label>
                    <input
                      type="text"
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="preferredDate">Preferred Date *</label>
                  <input
                    type="date"
                    id="preferredDate"
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    required
                  />
                </div>

                <div className="summary-box">
                  <h3>Booking Summary</h3>
                  <div className="summary-item">
                    <span>Service:</span>
                    <span>{service.name}</span>
                  </div>
                  {estimate && (
                    <div className="summary-item">
                      <span>Estimated Cost:</span>
                      <span className="price-highlight">${estimate.totalCost.toFixed(2)}</span>
                    </div>
                  )}
                  {service.type === 'flat-rate' && service.flatRate && (
                    <div className="summary-item">
                      <span>Fixed Price:</span>
                      <span className="price-highlight">${service.flatRate}</span>
                    </div>
                  )}
                </div>

                <button type="submit" className="btn-submit-booking">
                  Submit Quote Request
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Confirmation */}
      {step === 'confirmation' && (
        <section className="confirmation-section">
          <div className="container">
            <div className="confirmation-card">
              <div className="confirmation-icon">✅</div>
              <h2>Quote Request Submitted!</h2>
              <p>We'll review your request and send a detailed quote within 24 hours.</p>
              <div className="confirmation-details">
                <h3>What's Next?</h3>
                <ol>
                  <li>Our professionals review your request</li>
                  <li>You'll receive a detailed quote via email</li>
                  <li>Once approved, pay online or in person</li>
                  <li>We'll schedule and complete your service!</li>
                </ol>
              </div>
              <button className="btn-primary" onClick={() => navigate('/')}>
                Request Another Quote
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ServicePage;

