import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { submitServiceRequest } from '../services/firestoreService'
import type { CustomerInfo } from '../types/ServiceRequest'
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
  const { cart, totals, clear } = useCart()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
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
      const serviceRequestData = {
        customerInfo,
        lineItems: cart.items.map(item => {
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
          itemsSubtotal: totals.itemsSubtotal,
          discount: totals.discount,
          travelFeeAdjustment: totals.travelFeeAdjustment,
          grandTotal: totals.grandTotal
        },
        createdAt: new Date()
      }

      // Submit to Firestore
      const requestId = await submitServiceRequest(serviceRequestData)
      console.log('Cart order submitted successfully:', requestId)

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

    } catch (error) {
      console.error('Error submitting cart order:', error)
      setSubmitError('Failed to submit order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="checkout-page">
      <div className="container">
        {/* Header */}
        <div className="checkout-header">
          <h1>Complete Your Request</h1>
          <p className="checkout-subtitle">Please provide your information to finalize your painting service request</p>
        </div>

        {cart.items.length === 0 ? (
          <div className="checkout-empty">
            <div className="empty-state">
              <h3>No items in cart</h3>
              <p>Add some services to your cart before checking out.</p>
              <button className="btn-primary" onClick={() => navigate('/')}>
                Browse Services
              </button>
            </div>
          </div>
        ) : (
          <div className="checkout-layout">
            {/* Main Form */}
            <div className="checkout-form-section">
              <form onSubmit={handleSubmit} className="checkout-form">
                {/* Date Range Section */}
                <div className="form-section">
                  <div className="section-header">
                    <h3>
                      <img src="/checkout/calendar-lines.svg" alt="Calendar" className="section-icon" />
                      Preferred Date Range
                    </h3>
                    <p className="section-description">When would you like us to start and finish your project?</p>
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
                      <small>When can we begin?</small>
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
                      <small>When should we be done by?</small>
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
                    <p className="section-description">Tell us how to reach you</p>
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
                        required 
                        placeholder="your.email@example.com"
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
                        required 
                        placeholder="(555) 123-4567"
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
                    <p className="section-description">Where will we be painting?</p>
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Street Address</label>
                    <input 
                      type="text" 
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required 
                      placeholder="123 Main Street"
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
                        required 
                        placeholder="Toronto"
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
                        required 
                        placeholder="M5V 3A8"
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
                    <p className="section-description">Help us provide the best service</p>
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
                    <small>Let us know about any special requirements or access instructions</small>
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
                  <h3>📋 Order Summary</h3>
                  <span className="item-count">{cart.items.length} {cart.items.length === 1 ? 'service' : 'services'}</span>
                </div>
                
                <div className="summary-items">
                  {cart.items.map((item, index) => (
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
                    <span>${totals.itemsSubtotal.toFixed(2)}</span>
                  </div>
                  {totals.travelFeeAdjustment > 0 && (
                    <div className="total-row">
                      <span>Travel Adjustment</span>
                      <span>+${totals.travelFeeAdjustment.toFixed(2)}</span>
                    </div>
                  )}
                  {totals.discount > 0 && (
                    <div className="total-row discount">
                      <span>Discount (15%)</span>
                      <span>-${totals.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="total-row final-total">
                    <span>Total</span>
                    <span>${totals.grandTotal.toFixed(2)}</span>
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


