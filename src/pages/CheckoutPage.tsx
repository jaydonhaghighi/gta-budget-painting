import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { submitServiceRequest } from '../services/firestoreService'
import type { CustomerInfo } from '../types/ServiceRequest'
import type { CartItem } from '../context/CartContext'
import SEO from '../components/SEO'
import './CheckoutPage.css'

interface CheckoutFormData {
  earliestStart: string
  latestFinish: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  preferredContact: 'email' | 'phone'
  bestTimeToCall: string
  howDidYouHear: string
  additionalNotes: string
}

const CheckoutPage = () => {
  const { cart, totals, clear, addItem } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Handle back navigation
  const handleBack = () => {
    // Check if user came from a service page (has serviceId in state)
    if (location.state?.serviceId) {
      navigate(`/services/${location.state.category}/${location.state.serviceId}`)
    } else {
      // Default to cart page
      navigate('/cart')
    }
  }
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  // Handle single-service checkout
  const [singleService, setSingleService] = useState<CartItem | null>(null)
  const [isSingleService, setIsSingleService] = useState(false)
  const [purchaseCompleted, setPurchaseCompleted] = useState(false)
  const [serviceAddedToCart, setServiceAddedToCart] = useState(false)
  const serviceAddedRef = useRef(false)
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    earliestStart: '',
    latestFinish: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    preferredContact: 'phone',
    bestTimeToCall: '',
    howDidYouHear: '',
    additionalNotes: ''
  })

  // Handle single-service checkout from location state
  useEffect(() => {
    if (location.state?.isSingleService && location.state?.singleService) {
      const service = location.state.singleService;
      // If customImages are provided, merge them into customProjectDetails
      if (location.state?.customImages && Array.isArray(location.state.customImages)) {
        if (!service.customProjectDetails) {
          service.customProjectDetails = {};
        }
        // Replace the metadata with actual File objects
        service.customProjectDetails.images = location.state.customImages;
      }
      setSingleService(service);
      setIsSingleService(true);
    }
  }, [location.state])

  // Handle adding single service to cart if user leaves without completing purchase
  const addToCartIfNeeded = () => {
    if (isSingleService && singleService && !purchaseCompleted && !serviceAddedRef.current) {
      // Set ref immediately to prevent race conditions
      serviceAddedRef.current = true;
      setServiceAddedToCart(true);
      
      // Add the single service to cart when user leaves without completing purchase
      const cartItem: any = {
        serviceId: singleService.serviceId,
        serviceName: singleService.serviceName,
        serviceType: singleService.serviceType,
        estimate: singleService.estimate,
        formData: singleService.formData
      };
      
      // Add custom project details if they exist
      if (singleService.customProjectDetails) {
        cartItem.customProjectDetails = singleService.customProjectDetails;
      }
      
      addItem(cartItem);
    }
  };


  useEffect(() => {
    const handleBeforeUnload = () => {
      addToCartIfNeeded();
    };

    const handlePopState = () => {
      addToCartIfNeeded();
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Cleanup function - this runs when component unmounts (any navigation away)
    return () => {
      addToCartIfNeeded();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isSingleService, singleService, purchaseCompleted, serviceAddedToCart, addItem])

  // Additional detection for programmatic navigation
  useEffect(() => {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      addToCartIfNeeded();
      return originalPushState.apply(history, args);
    };

    history.replaceState = function(...args) {
      addToCartIfNeeded();
      return originalReplaceState.apply(history, args);
    };

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [isSingleService, singleService, purchaseCompleted, serviceAddedToCart, addItem])

  // Calculate totals for single-service checkout
  const singleServiceTotals = singleService ? {
    itemsSubtotal: singleService.estimate.totalCost,
    discount: singleService.estimate.totalCost > 1000 ? singleService.estimate.totalCost * 0.15 : 0,
    travelFeeAdjustment: 0, // Travel fee already included in otherFees
    grandTotal: singleService.estimate.totalCost - (singleService.estimate.totalCost > 1000 ? singleService.estimate.totalCost * 0.15 : 0)
  } : null

  // Use appropriate totals based on checkout type
  const displayTotals = isSingleService && singleServiceTotals ? singleServiceTotals : totals
  const displayItems = isSingleService && singleService ? [singleService] : cart.items

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Prepare customer info
      const customerInfo: CustomerInfo = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        preferredContact: formData.preferredContact,
        bestTimeToCall: formData.bestTimeToCall,
        howDidYouHear: formData.howDidYouHear,
        additionalNotes: formData.additionalNotes
      }

      // Prepare service request data for cart submission
      const itemsToProcess = isSingleService && singleService ? [singleService] : cart.items;
      
      const serviceRequestData = {
        customerInfo,
        lineItems: itemsToProcess.map(item => {
          const lineItem: any = {
            serviceId: item.serviceId,
            serviceName: item.serviceName,
            serviceType: item.serviceType,
            formData: item.formData,
            estimate: item.estimate
          };
          
          // Only add customProjectDetails if it exists
          if (item.customProjectDetails) {
            lineItem.customProjectDetails = item.customProjectDetails;
          }
          
          return lineItem;
        }),
        scheduledDate: {
          earliestStart: new Date(formData.earliestStart),
          latestFinish: new Date(formData.latestFinish)
        },
        totals: {
          itemsSubtotal: displayTotals.itemsSubtotal,
          discount: displayTotals.discount,
          travelFeeAdjustment: displayTotals.travelFeeAdjustment,
          grandTotal: displayTotals.grandTotal
        },
        createdAt: new Date()
      }

      // Submit to Firestore
      const requestId = await submitServiceRequest(serviceRequestData)
      
      if (!requestId) {
        throw new Error('Service request submission returned no ID');
      }
      
      // Mark purchase as completed to prevent adding to cart on exit
      setPurchaseCompleted(true)

      // Send emails via Cloud Function
      try {
        const emailResponse = await fetch('https://us-central1-gta-budget-painting.cloudfunctions.net/sendServiceRequestEmails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...serviceRequestData,
            requestId,
            createdAt: serviceRequestData.createdAt.toISOString()
          })
        })

        if (emailResponse.ok) {
          console.log('Emails sent successfully')
        } else {
          console.error('Failed to send emails:', await emailResponse.text())
        }
      } catch (emailError) {
        console.error('Error sending emails:', emailError)
        // Don't block the main flow if emails fail
      }

      // Clear cart and redirect
      clear()
      navigate('/?success=true')

    } catch (error: any) {
      console.error('Error submitting cart order:', error)
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        stack: error?.stack
      });
      setSubmitError(
        error?.message || 'Failed to submit order. Please try again. ' +
        'If the problem persists, please call us at (647) 390-7181.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="checkout-page">
      <SEO
        title="Checkout | GTA Budget Painting"
        description="Submit your painting service request."
        canonical="/checkout"
        robots="noindex, nofollow"
      />
      <div className="container">
        {/* Back Button */}
        <div className="checkout-back-section">
          <button className="checkout-back-btn" onClick={handleBack}>
            ← Back
          </button>
        </div>

        {/* Header */}
        <div className="checkout-header">
          <h1>Complete Your Request</h1>
          <p className="checkout-subtitle">Please provide your information to finalize your painting service request</p>
        </div>

        {/* Prefer to Call Section */}
        <div className="prefer-call-section">
          <p className="prefer-call-text">Want a Free Estimate?</p>
          <button className="call-button" onClick={() => window.location.href = 'tel:+16473907181'}>
            <img src="/telephone.png" alt="Phone" className="call-icon" />
            Call us (647) 390-7181
          </button>
        </div>

        {displayItems.length === 0 ? (
          <div className="checkout-empty">
            <div className="empty-state">
              <h3>No items in cart</h3>
              <p>Add some services to your cart before checking out.</p>
              <button className="btn-primary" onClick={() => navigate('/services')}>
                Browse Services
              </button>
            </div>
          </div>
        ) : (
          <div className="checkout-layout">
            {/* Main Form */}
            <div className="checkout-form-section">
              <form onSubmit={handleSubmit} className="checkout-form" autoComplete="on" method="post">
                {/* Date Range Section */}
                <div className="form-section">
                  <div className="section-header">
                    <h3>
                      <img src="/checkout/calendar-lines.svg" alt="Calendar" className="section-icon" />
                      Preferred Date Range
                    </h3>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="earliestStart">Earliest Start Date</label>
                      <input 
                        type="date" 
                        id="earliestStart"
                        name="earliestStart"
                        value={formData.earliestStart}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="latestFinish">Latest Finish Date</label>
                      <input 
                        type="date" 
                        id="latestFinish"
                        name="latestFinish"
                        value={formData.latestFinish}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="form-section">
                  <div className="section-header">
                    <h3>
                      <img src="/checkout/circle-user.svg" alt="User" className="section-icon" />
                      Contact Information
                    </h3>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input 
                        type="text" 
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        autoComplete="given-name"
                        required 
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input 
                        type="text" 
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        autoComplete="family-name"
                        required 
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input 
                        type="email" 
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        autoComplete="email"
                        required 
                        placeholder="Email address"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        autoComplete="tel"
                        required 
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="form-section">
                  <div className="section-header">
                    <h3>
                      <img src="/checkout/home.svg" alt="Home" className="section-icon" />
                      Service Address
                    </h3>
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Street Address</label>
                    <input 
                      type="text" 
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      autoComplete="street-address"
                      required 
                      placeholder="Street address"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input 
                        type="text" 
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        autoComplete="address-level2"
                        required 
                        placeholder="City"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="postalCode">Postal Code</label>
                      <input 
                        type="text" 
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        autoComplete="postal-code"
                        required 
                        placeholder="Postal code"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="form-section">
                  <div className="section-header">
                    <h3>
                      <img src="/checkout/info.svg" alt="Info" className="section-icon" />
                      Additional Information
                    </h3>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="preferredContact">Preferred Contact Method</label>
                      <select 
                        id="preferredContact"
                        name="preferredContact"
                        value={formData.preferredContact}
                        onChange={handleInputChange}
                      >
                        <option value="phone">Phone Call</option>
                        <option value="email">Email</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="bestTimeToCall">Best Time to Call</label>
                      <select 
                        id="bestTimeToCall"
                        name="bestTimeToCall"
                        value={formData.bestTimeToCall}
                        onChange={handleInputChange}
                      >
                        <option value="">Select best time...</option>
                        <option value="morning">Morning (8AM-12PM)</option>
                        <option value="afternoon">Afternoon (12PM-5PM)</option>
                        <option value="evening">Evening (5PM-8PM)</option>
                        <option value="weekdays">Weekdays</option>
                        <option value="weekends">Weekends</option>
                        <option value="anytime">Anytime</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="howDidYouHear">How did you hear about us?</label>
                    <select 
                      id="howDidYouHear"
                      name="howDidYouHear"
                      value={formData.howDidYouHear}
                      onChange={handleInputChange}
                    >
                      <option value="">Select an option...</option>
                      <option value="google">Google Search</option>
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                      <option value="referral">Referral</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="additionalNotes">Additional Notes</label>
                    <textarea 
                      id="additionalNotes"
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Any special requirements, access instructions, or additional notes..."
                    />
                  </div>
                </div>

                {/* Error Display */}
                {submitError && (
                  <div className="error-message">
                    <strong>⚠️ Error:</strong> {submitError}
                  </div>
                )}

                {/* Form Actions */}
                <div className="form-actions">
                  <button className="btn-secondary" type="button" onClick={() => navigate('/cart')}>
                    Back to Cart
                  </button>
                  <button className="btn-primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <img src="/checkout/hourglass-end.svg" alt="Loading" className="btn-icon" />
                        Submitting Request...
                      </>
                    ) : (
                      <>
                        Submit Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <aside className="checkout-summary">
              <div className="summary-card">
                <div className="summary-header">
                  <h3>
                    <img src="/checkout/clipboard.svg" alt="Order Summary" className="section-icon" />
                    Order Summary
                  </h3>
                  <span className="item-count">{displayItems.length} {displayItems.length === 1 ? 'service' : 'services'}</span>
                </div>
                
                <div className="summary-items">
                  {displayItems.map((item) => (
                    <div key={item.id} className="summary-item">
                      <div className="item-info">
                        <h4>{item.serviceName}</h4>
                        <span className="item-type">{item.serviceType}</span>
                      </div>
                      <div className="item-price">${item.estimate.totalCost.toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="summary-totals">
                  <div className="total-row">
                    <span>Subtotal</span>
                    <span>${displayTotals.itemsSubtotal.toFixed(2)}</span>
                  </div>
                  {displayTotals.travelFeeAdjustment > 0 && (
                    <div className="total-row">
                      <span>Travel Adjustment</span>
                      <span>+${displayTotals.travelFeeAdjustment.toFixed(2)}</span>
                    </div>
                  )}
                  {displayTotals.discount > 0 && (
                    <div className="total-row discount">
                      <span>Discount (15%)</span>
                      <span>-${displayTotals.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="total-row final-total">
                    <span>Total</span>
                    <span>${displayTotals.grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="summary-footer">
                  <p className="summary-note">
                    💡 <strong>What happens next?</strong><br/>
                    We'll review your request and contact you within 24 hours to confirm details and schedule your project.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}

export default CheckoutPage



