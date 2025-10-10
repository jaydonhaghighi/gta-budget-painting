import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getServiceById } from '../data/services';
import { type EstimateBreakdown } from '../utils/estimationCalculator';
import CalculatedServiceForm from '../components/forms/CalculatedServiceForm';
import FlatRateServiceForm from '../components/forms/FlatRateServiceForm';
import CustomQuoteServiceForm from '../components/forms/CustomQuoteServiceForm';
import { submitServiceRequest } from '../services/firestoreService';
import type { ServiceRequestSubmission } from '../types/ServiceRequest';
import './ServicePage.css';
import { useCart } from '../context/CartContext';
import { isPostalCodeVerified } from '../components/PostalCodeVerification';

type ServiceStep = 'service-form' | 'customer-info' | 'confirmation';

interface SavedBookingState {
  step: ServiceStep;
  estimate: EstimateBreakdown | null;
  formData: any;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    preferredContact: 'phone' | 'email' | 'text';
    bestTimeToCall: string;
    howDidYouHear: string;
    additionalNotes: string;
  };
  preferredDate: string;
  timestamp: number;
}

const ServicePage = () => {
  const { addItem, updateItem } = useCart();
  const { serviceId } = useParams<{ serviceId: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editId = searchParams.get('editId');
  const navigate = useNavigate();
  
  const service = serviceId ? getServiceById(serviceId) : null;
  
  const [step, setStep] = useState<ServiceStep>('service-form');
  const [estimate, setEstimate] = useState<EstimateBreakdown | null>(null);
  const [formData, setFormData] = useState<any>({}); // Store form field values
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    preferredContact: 'phone' as 'phone' | 'email' | 'text',
    bestTimeToCall: '',
    howDidYouHear: '',
    additionalNotes: ''
  });
  const [preferredDate, setPreferredDate] = useState('');
  const [isRestoringState, setIsRestoringState] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
            setEstimate(parsed.estimate);
            setFormData(parsed.formData || {});
            setCustomerInfo(parsed.customerInfo);
            setPreferredDate(parsed.preferredDate);
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
  }, [serviceId, step, estimate, formData, customerInfo, preferredDate, isRestoringState]);


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
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Prepare service request data
      const serviceRequestData: ServiceRequestSubmission = {
        serviceId: serviceId!,
        customerInfo: {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address,
          city: customerInfo.city,
          postalCode: customerInfo.postalCode,
          preferredContact: customerInfo.preferredContact,
          bestTimeToCall: customerInfo.bestTimeToCall,
          howDidYouHear: customerInfo.howDidYouHear,
          additionalNotes: customerInfo.additionalNotes,
        },
        formData: formData,
      };

      // Only add estimate if it exists
      if (estimate) {
        serviceRequestData.estimate = estimate;
      }

      // Only add customProjectDetails if it's a custom quote service
      if (service?.type === 'custom-quote') {
        serviceRequestData.customProjectDetails = {
          description: formData.description || '',
          images: formData.images || [],
          budget: formData.budget,
          timeline: formData.timeline,
        };
      }

      // Submit to Firestore
      const requestId = await submitServiceRequest(serviceRequestData);
      console.log('Service request submitted successfully:', requestId);
      
      // Send confirmation emails
      try {
        const emailData = {
          requestId,
          serviceId: serviceId!,
          serviceName: service!.name,
          customerInfo: serviceRequestData.customerInfo,
          estimate: serviceRequestData.estimate,
          formData: serviceRequestData.formData,
          createdAt: new Date(),
        };

        const emailResponse = await fetch(
          'https://us-central1-gta-budget-painting.cloudfunctions.net/sendServiceRequestEmails',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
          }
        );

        if (emailResponse.ok) {
          console.log('Confirmation emails sent successfully');
        } else {
          console.error('Failed to send emails:', await emailResponse.text());
          // Don't fail the entire submission if emails fail
        }
      } catch (emailError) {
        console.error('Error sending emails:', emailError);
        // Don't fail the entire submission if emails fail
      }
      
      // Clear saved booking progress on successful submission
      if (serviceId) {
        localStorage.removeItem(`booking-${serviceId}`);
        console.log('Booking submitted, cleared saved progress');
      }
      
      setStep('confirmation');
    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitError('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
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
      {/* Back Button */}
      <div className="service-page-header">
        <div className="container">
          <button className="btn-back" onClick={handleBack}>
            ← {step === 'service-form' ? 'Back to Services' : 'Back'}
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
                  Service Details
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

      {/* Service Form */}
      {step === 'service-form' && (
        <section className="service-form-section">
          <div className="container">
            <div className="service-form-header">
              <span className="service-icon-large">{service.icon}</span>
              <div>
                <h1>{service.name}</h1>
                <p className="service-description">{service.description}</p>
              </div>
            </div>

            <div className="service-form-content">
              {service.type === 'calculated' && (
                <CalculatedServiceForm
                  service={service}
                  initialFormData={formData}
                  initialEstimate={estimate}
                  isEditMode={Boolean(editId)}
                  onEstimateCalculated={(est, data) => {
                    setEstimate(est);
                    setFormData(data);
                    setStep('customer-info');
                  }}
                  onFormDataChange={(data) => {
                    setFormData(data);
                  }}
                  onAddToCart={(est, data) => {
                    // Postal verification gating before add
                    if (!isPostalCodeVerified()) {
                      alert('Please verify your location before adding to cart.');
                      return;
                    }
                    const cartEstimate = {
                      totalCost: est.totalCost,
                      laborHours: est.laborHours,
                      totalHours: est.totalHours,
                      setupCleanupHours: est.setupCleanupHours,
                      paintGallons: est.paintGallons,
                      paintCost: est.paintCost,
                      laborCost: est.laborCost,
                      suppliesCost: est.suppliesCost,
                      otherFees: (est as any).otherFees ?? ((est as any).prepFee ?? 0) + ((est as any).travelFee ?? 0),
                      subtotal: (est as any).subtotal ?? (est.laborCost + est.paintCost + est.suppliesCost),
                    };
                    if (editId) {
                      const cartEstimate = {
                        totalCost: est.totalCost,
                        laborHours: est.laborHours,
                        totalHours: est.totalHours,
                        setupCleanupHours: est.setupCleanupHours,
                        paintGallons: est.paintGallons,
                        paintCost: est.paintCost,
                        laborCost: est.laborCost,
                        suppliesCost: est.suppliesCost,
                        otherFees: (est as any).otherFees ?? ((est as any).prepFee ?? 0) + ((est as any).travelFee ?? 0),
                        subtotal: (est as any).subtotal ?? (est.laborCost + est.paintCost + est.suppliesCost),
                      };
                      updateItem(editId, { formData: data, estimate: cartEstimate })
                      navigate('/cart')
                      return
                    }
                    addItem({
                      serviceId: service.id,
                      serviceName: service.name,
                      serviceType: service.type,
                      formData: data,
                      estimate: cartEstimate,
                    });
                    // Reset this service form state and saved progress
                    try {
                      if (serviceId) localStorage.removeItem(`booking-${serviceId}`);
                    } catch {}
                    setEstimate(null);
                    setFormData({});
                    setStep('service-form');
                    navigate('/');
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
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      value={customerInfo.firstName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      value={customerInfo.lastName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
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
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="postalCode">Postal Code *</label>
                    <input
                      type="text"
                      id="postalCode"
                      value={customerInfo.postalCode}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, postalCode: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="preferredContact">Preferred Contact Method *</label>
                    <select
                      id="preferredContact"
                      value={customerInfo.preferredContact}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, preferredContact: e.target.value as 'phone' | 'email' | 'text' })}
                      required
                    >
                      <option value="phone">Phone Call</option>
                      <option value="email">Email</option>
                      <option value="text">Text Message</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="bestTimeToCall">Best Time to Call</label>
                    <input
                      type="text"
                      id="bestTimeToCall"
                      value={customerInfo.bestTimeToCall}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, bestTimeToCall: e.target.value })}
                      placeholder="e.g., Weekdays 9-5, Evenings after 6pm"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="howDidYouHear">How did you hear about us?</label>
                    <input
                      type="text"
                      id="howDidYouHear"
                      value={customerInfo.howDidYouHear}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, howDidYouHear: e.target.value })}
                      placeholder="e.g., Google, Facebook, Referral"
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="additionalNotes">Additional Notes</label>
                    <textarea
                      id="additionalNotes"
                      value={customerInfo.additionalNotes}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, additionalNotes: e.target.value })}
                      rows={3}
                      placeholder="Any special requirements or additional information..."
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

                {submitError && (
                  <div className="error-message" style={{ 
                    color: '#e53e3e', 
                    marginBottom: '1rem', 
                    padding: '0.75rem', 
                    backgroundColor: '#fed7d7', 
                    borderRadius: '8px',
                    border: '1px solid #feb2b2'
                  }}>
                    {submitError}
                  </div>
                )}
                
                <button 
                  type="submit" 
                  className="btn-submit-booking"
                  disabled={isSubmitting}
                  style={{ 
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
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

