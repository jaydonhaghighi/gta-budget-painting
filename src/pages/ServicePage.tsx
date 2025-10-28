import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getServiceById } from '../data/services';
import { type EstimateBreakdown } from '../utils/estimationCalculator';
import CalculatedServiceForm from '../components/forms/CalculatedServiceForm';
import InteriorDoorForm from '../components/forms/InteriorDoorForm';
import FrontDoorForm from '../components/forms/FrontDoorForm';
import CustomQuoteServiceForm from '../components/forms/CustomQuoteServiceForm';
import { submitServiceRequest } from '../services/firestoreService';
import type { ServiceRequestSubmission } from '../types/ServiceRequest';
import './ServicePage.css';
import { useCart } from '../context/CartContext';

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
  const { addItem } = useCart();
  const { serviceId } = useParams<{ serviceId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we're in editing mode
  const urlParams = new URLSearchParams(location.search);
  const editId = urlParams.get('editId');
  const isEditing = !!editId;
  
  // Get category from URL path
  const getCategoryFromPath = () => {
    const pathSegments = location.pathname.split('/');
    const categoryIndex = pathSegments.indexOf('services') + 1;
    const category = pathSegments[categoryIndex] || '';
    
    // Handle custom-painting as a special case
    if (category === 'custom-painting') {
      return 'custom';
    }
    
    return category;
  };
  
  const category = getCategoryFromPath();
  
  const service = serviceId ? getServiceById(serviceId) : (category === 'custom' ? getServiceById('custom-project') : null);

  // Service-specific description functions
  const getServiceDescriptionTitle = (serviceId: string) => {
    switch (serviceId) {
      case 'accent-wall':
        return 'Transform Your Space with Accent Walls';
      case 'ceiling':
        return 'Refresh Your Ceiling Painting';
      case 'small-bathroom':
        return 'Complete Bathroom Makeover';
      case 'basement-painting':
        return 'Transform Your Basement';
      case 'kitchen-walls':
        return 'Kitchen Wall Transformation';
      case 'trimming-baseboards':
        return 'Professional Baseboard Painting';
      case 'bedroom-painting':
        return 'Create Your Perfect Bedroom';
      case 'staircase-painting':
        return 'Elevate Your Staircase';
      case 'fence-painting':
        return 'Protect & Beautify Your Fence';
      case 'kitchen-cabinet-painting':
        return 'Kitchen Cabinet Makeover';
      case 'garage-door':
        return 'Garage Door Refresh';
      case 'exterior-railings':
        return 'Exterior Railing Restoration';
      case 'stucco-ceiling-removal':
        return 'Remove Popcorn Ceiling for Modern Look';
      case 'interior-door':
        return 'Interior Door Painting & Restoration';
      case 'front-door':
        return 'Front Door Painting & Curb Appeal';
      case 'bathroom-vanity-cabinet':
        return 'Bathroom Vanity Painting';
      case 'custom-project':
        return 'Custom Painting Projects';
      default:
        return 'Professional Painting Services';
    }
  };

  const getServiceDescriptionText = (serviceId: string) => {
    switch (serviceId) {
      case 'accent-wall':
        return 'An accent wall is the perfect way to add personality and visual interest to any room. Our professional painters will help you choose the right color and finish to create a stunning focal point that transforms your space.';
      case 'ceiling':
        return 'A fresh ceiling paint job can dramatically brighten and modernize any room. Our experts use premium paints and techniques to ensure smooth, even coverage that enhances your home\'s overall appearance.';
      case 'small-bathroom':
        return 'Small bathrooms deserve big impact! Our bathroom painting specialists understand the unique challenges of humid environments and will use moisture-resistant paints to create a beautiful, long-lasting finish.';
      case 'basement-painting':
        return 'Transform your basement from a storage area into a beautiful living space. Our basement painting experts use specialized techniques and paints designed for below-grade environments to create a fresh, inviting atmosphere.';
      case 'kitchen-walls':
        return 'The kitchen is the heart of your home, and fresh paint can make it shine. Our kitchen specialists use durable, washable paints that stand up to cooking splatters and daily wear while maintaining their beauty.';
      case 'trimming-baseboards':
        return 'Crisp, clean baseboards frame your rooms beautifully. Our precision painters will give your baseboards a professional finish that complements your walls and adds that polished, finished look to your home.';
      case 'bedroom-painting':
        return 'Create your personal sanctuary with bedroom painting that reflects your style. Whether you want calming neutrals or bold statements, our bedroom specialists will help you achieve the perfect atmosphere for rest and relaxation.';
      case 'staircase-painting':
        return 'Your staircase is often the first thing guests see. Our staircase painting experts will transform this high-traffic area with durable, beautiful finishes that make a lasting impression and protect against daily wear.';
      case 'fence-painting':
        return 'Protect your investment and boost curb appeal with professional fence painting. Our exterior specialists use weather-resistant paints and proper preparation techniques to ensure your fence looks great and lasts for years.';
      case 'kitchen-cabinet-painting':
        return 'Give your kitchen a complete makeover without the cost of replacement. Our cabinet painting experts will transform your existing cabinets with premium finishes that look like new, saving you thousands while dramatically updating your space.';
      case 'garage-door':
        return 'Your garage door is a major part of your home\'s exterior. Our garage door specialists will refresh it with durable exterior paints that enhance curb appeal and protect against weather damage.';
      case 'exterior-railings':
        return 'Safety meets style with professional railing painting. Our exterior experts will restore your railings with weather-resistant finishes that protect against rust and wear while enhancing your home\'s architectural beauty.';
      case 'stucco-ceiling-removal':
        return 'Transform your home with professional popcorn ceiling removal. Outdated textured ceilings can make rooms feel smaller and dated. Our specialists safely remove popcorn ceilings and create smooth, modern surfaces that brighten your space and increase your home\'s value.';
      case 'interior-door':
        return 'Refresh your interior doors with professional painting that enhances your home\'s flow and style. Interior doors see constant use and benefit from durable, smooth finishes. Our door specialists ensure perfect coverage and smooth operation while matching your interior design.';
      case 'front-door':
        return 'Make a stunning first impression with professional front door painting. Your front door is the focal point of your home\'s exterior and deserves special attention. We use premium exterior paints and techniques to create a beautiful, weather-resistant finish that welcomes guests and protects your investment.';
      case 'bathroom-vanity-cabinet':
        return 'Professional bathroom vanity cabinet painting services that refresh and modernize your bathroom storage with expert techniques and quality finishes.';
      case 'custom-project':
        return 'Every home is unique, and so are your painting needs. Our custom painting services are tailored to your specific vision and requirements. Whether you need a special color match, intricate designs, or work on unusual surfaces, our experienced team will bring your ideas to life with professional quality and attention to detail.';
      default:
        return 'Get accurate estimates for your painting project with our professional calculation tools. Our experienced team provides detailed quotes based on your specific requirements, ensuring transparency and fair pricing for every project.';
    }
  };

  const getServiceDescriptionImage = (serviceId: string) => {
    switch (serviceId) {
      case 'accent-wall':
        return '/services/accent-wall/0e12ab43ba833f8eb4a8e8f6919cc4d3.jpg';
      case 'ceiling':
        return '/services/ceiling/d9b8cceca38623dd777f98c279a07ff7.jpg';
      case 'small-bathroom':
        return '/services/bathroom/2031918adaa8a45c68f9dcaf26a85e54.jpg';
      case 'basement-painting':
        return '/services/basement/ede4060fc66d608019efd65027cfa170.jpg';
      case 'kitchen-walls':
        return '/services/kitchen-walls/18e71280752e388d198b783ef57e1a1a.jpg';
      case 'trimming-baseboards':
        return '/services/trimming/2169f21924b68c9e2503f9c2788d794d.jpg';
      case 'bedroom-painting':
        return '/services/bedroom/5d4fb4cdf08b0ec987e44298b53c5a41.jpg';
      case 'staircase-painting':
        return '/services/staircase/5db3f964bfa951122f3c9defc12d3bfb.jpg';
      case 'fence-painting':
        return '/services/fence/2d09e8bfd742f8617ccba90e8f9312e3.jpg';
      case 'kitchen-cabinet-painting':
        return '/services/kitchen-cabinets/1d5d1205901c93bfef8674023d3ed719.jpg';
      case 'garage-door':
        return '/services/garage/51af29468889910e0ff032eb12e29d79.jpg';
      case 'exterior-railings':
        return '/services/railings/7e0e0eca999d1b8d42b34d1d4d3b5acb.jpg';
      case 'stucco-ceiling-removal':
        return '/services/stucco-ceiling-removal/8039a71027ffccfbcfac6eab26f3167c.jpg';
      case 'interior-door':
        return '/services/interior-door/663b0736b9625a124d64f7f2338b3b9b.jpg';
      case 'front-door':
        return '/services/front-door/1ce69539f7e825bbfe8c82868b607f34.jpg';
      case 'bathroom-vanity-cabinet':
        return '/services/bathroom-vanity/3daac1d98424946cbc1dbff549cdd7b7.jpg';
      case 'custom-project':
        return '/2b0cfa6e362fbb3aa1094b290832dbe0.jpg';
      default:
        return '/services/kitchen-walls/ff79fd3533a771d876cb26226b7009e4.jpg';
    }
  };
   
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

  // Redirect if service not found (but allow custom-painting route)
  useEffect(() => {
    if (!service && category !== 'custom') {
      navigate('/');
    }
  }, [service, category, navigate]);

  // Restore saved booking state on mount (only for custom painting or when editing)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const editId = urlParams.get('editId');
    
    if (serviceId && isRestoringState && (serviceId === 'custom-painting' || editId)) {
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
    } else if (!serviceId || (serviceId !== 'custom-painting' && !editId)) {
      // No serviceId or not custom painting/editing, don't restore state
      setIsRestoringState(false);
    }
  }, [serviceId, isRestoringState, location.search]);

  // Save booking state to localStorage whenever it changes (only for custom painting or when editing)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const editId = urlParams.get('editId');
    
    if (serviceId && !isRestoringState && step !== 'confirmation' && (serviceId === 'custom-painting' || editId)) {
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
  }, [serviceId, step, estimate, formData, customerInfo, preferredDate, isRestoringState, location.search]);


  if (!service && category !== 'custom') {
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
      
      // Clear saved booking progress on successful submission (only for custom painting)
      if (serviceId && serviceId === 'custom-painting') {
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
    const urlParams = new URLSearchParams(location.search);
    const editId = urlParams.get('editId');
    
    // Always clear localStorage for non-custom services when not editing
    if (serviceId && serviceId !== 'custom-painting' && !editId) {
      localStorage.removeItem(`booking-${serviceId}`);
    } else if (serviceId && serviceId === 'custom-painting' && step !== 'confirmation' && !editId) {
      localStorage.removeItem(`booking-${serviceId}`);
    }
    
    // Navigate to services page for Custom Project, otherwise to category page
    if (category === 'custom') {
      navigate('/services');
    } else {
      navigate(`/services/${category}`);
    }
  };


  return (
    <div className="service-page">
      {/* Back Button */}
      <div className="service-page-header">
        <div className="container">
          <button className="btn-back" onClick={handleBack}>
            ← {step === 'service-form' ? `Back to ${category === 'interior-painting' ? 'Interior Painting' : category === 'exterior-painting' ? 'Exterior Painting' : category === 'custom' ? 'Services' : 'Services'}` : 'Back'}
          </button>
          
          {/* Breadcrumb Navigation */}
          <nav className="breadcrumb">
            <a href="/services" className="breadcrumb-link">Services</a>
            <span className="breadcrumb-separator">›</span>
            {category === 'custom' ? (
              <span className="breadcrumb-current">Custom Painting</span>
            ) : (
              <>
                <a href={`/services/${category}`} className="breadcrumb-link">
                  {category === 'interior-painting' ? 'Interior Painting' : 
                   category === 'exterior-painting' ? 'Exterior Painting' : category}
                </a>
                <span className="breadcrumb-separator">›</span>
                <span className="breadcrumb-current">{service?.name}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Service Form */}
      {step === 'service-form' && (
        <section className="service-form-section">
          <div className="container">
            <div className="service-form-header">
              <div>
                <h1>{service?.name}</h1>
                <p className="service-description">{service?.description}</p>
              </div>
            </div>

             {/* Service Description Section - Only show when not editing */}
             {!isEditing && (
               <div className="service-description-content">
                   <div className="service-description-text">
                     <div className="service-description-text-content">
                       <h2>{getServiceDescriptionTitle(service?.id || '')}</h2>
                       <p className="service-description-description">
                         {getServiceDescriptionText(service?.id || '')}
                       </p>
                     </div>
                     <div className="service-description-image">
                       <img 
                         src={getServiceDescriptionImage(service?.id || '')} 
                         alt={service?.name || 'Professional painting service'} 
                         className="service-description-photo"
                       />
                     </div>
                   </div>
               </div>
             )}

            <div className="service-form-content">
              {service?.type === 'calculated' && (
                <CalculatedServiceForm
                  service={service}
                  initialFormData={formData}
                  initialEstimate={estimate}
                  onEstimateCalculated={(est: EstimateBreakdown | null, data: any) => {
                    setEstimate(est);
                    setFormData(data);
                  }}
                  onFormDataChange={(data: any) => {
                    setFormData(data);
                  }}
                />
              )}

              {service?.type === 'flat-rate' && service?.id === 'interior-door' && (
                <InteriorDoorForm
                  service={service}
                  onProceed={() => {}}
                  initialFormData={formData}
                />
              )}

              {service?.type === 'flat-rate' && service?.id === 'front-door' && (
                <FrontDoorForm
                  service={service}
                  onProceed={() => {}}
                  initialFormData={formData}
                />
              )}

              {service?.type === 'flat-rate' && service?.id !== 'interior-door' && service?.id !== 'front-door' && (
                <div className="service-not-available">
                  <h3>Service Not Available</h3>
                  <p>This service is currently not available for online booking. Please contact us directly for more information.</p>
                </div>
              )}

              {service?.type === 'custom-quote' && (
                <CustomQuoteServiceForm
                  service={service}
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
                    <span>{service?.name}</span>
                  </div>
                  {estimate && (
                    <div className="summary-item">
                      <span>Estimated Cost:</span>
                      <span className="price-highlight">${estimate.totalCost.toFixed(2)}</span>
                    </div>
                  )}
                  {service?.type === 'flat-rate' && service?.flatRate && (
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

      {/* Sticky Bottom Bar - Show estimate total when available, but not when editing */}
      {estimate && step === 'service-form' && !isEditing && (
        <div className="sticky-bottom-bar">
          <div className="sticky-bar-content">
            <div className="sticky-bar-total">
              <div className="sticky-bar-label">Estimated Total</div>
              <div className="sticky-bar-amount">${estimate.totalCost.toFixed(2)}</div>
            </div>
          </div>
          <div className="sticky-bar-actions">
            <button 
              className="sticky-bar-btn sticky-bar-btn-primary"
              onClick={() => {
                if (estimate) {
                  addItem({
                    serviceId: serviceId!,
                    serviceName: service!.name,
                    serviceType: service!.type,
                    estimate: {
                      ...estimate,
                      otherFees: estimate.prepFee + estimate.travelFee
                    },
                    formData: formData
                  });
                  navigate('/cart');
                }
              }}
              disabled={!estimate}
            >
              Add to Cart
            </button>
            <button 
              className="sticky-bar-btn sticky-bar-btn-secondary"
              onClick={() => {
                if (estimate) {
                  // Add this service to cart and go to checkout
                  addItem({
                    serviceId: serviceId!,
                    serviceName: service!.name,
                    serviceType: service!.type,
                    estimate: {
                      ...estimate,
                      otherFees: estimate.prepFee + estimate.travelFee
                    },
                    formData: formData
                  });
                  navigate('/checkout', { 
                    state: { 
                      serviceId: serviceId,
                      category: category,
                      isRequestNow: true // Flag to indicate this was a "Request Now" action
                    } 
                  });
                }
              }}
              disabled={!estimate}
            >
              Request Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePage;

