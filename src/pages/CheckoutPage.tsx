import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { submitServiceRequest } from '../services/firestoreService'
import type { CustomerInfo } from '../types/ServiceRequest'

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
    <main className="checkout-page" style={{ padding: '2rem 0' }}>
      <div className="container">
        <h1>Checkout</h1>
        {cart.items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No items in cart.</p>
            <button className="btn-primary" onClick={() => navigate('/')}>
              Browse Services
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
            <form onSubmit={handleSubmit}>
              <h3>Preferred Date Range</h3>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Earliest Start</label>
                  <input 
                    type="date" 
                    name="earliestStart"
                    value={formData.earliestStart}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Latest Finish</label>
                  <input 
                    type="date" 
                    name="latestFinish"
                    value={formData.latestFinish}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>

              <h3 style={{ marginTop: 16 }}>Contact Information</h3>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>City</label>
                  <input 
                    type="text" 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code</label>
                  <input 
                    type="text" 
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>

              <h3 style={{ marginTop: 16 }}>Additional Information</h3>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Preferred Contact</label>
                  <select 
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={handleInputChange}
                  >
                    <option value="phone">Phone</option>
                    <option value="email">Email</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Best Time to Call</label>
                  <select 
                    name="bestTimeToCall"
                    value={formData.bestTimeToCall}
                    onChange={handleInputChange}
                  >
                    <option value="">Select...</option>
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
                <label>How did you hear about us?</label>
                <select 
                  name="howDidYouHear"
                  value={formData.howDidYouHear}
                  onChange={handleInputChange}
                >
                  <option value="">Select...</option>
                  <option value="google">Google Search</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="referral">Referral</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Additional Notes</label>
                <textarea 
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any special requirements or notes..."
                />
              </div>

              {submitError && (
                <div style={{ color: 'var(--color-golden-beige)', marginTop: '1rem', padding: '0.5rem', background: '#fef2f2', borderRadius: '4px' }}>
                  {submitError}
                </div>
              )}

              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <button className="btn-secondary" type="button" onClick={() => navigate('/cart')}>
                  Back to Cart
                </button>
                <button className="btn-primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
            <aside style={{ border: '1px solid var(--color-background-dark)', borderRadius: 12, background: 'white', padding: 16, height: 'fit-content' }}>
              <h3>Order Summary</h3>
              <div className="row" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span>Subtotal</span><span>${totals.itemsSubtotal.toFixed(2)}</span>
              </div>
              {totals.travelFeeAdjustment > 0 && (
                <div className="row" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span>Travel Adjustment</span><span>+${totals.travelFeeAdjustment.toFixed(2)}</span>
                </div>
              )}
              {totals.discount > 0 && (
                <div className="row" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, color: '#166534' }}>
                  <span>Discount (15%)</span><span>- ${totals.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="row" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontWeight: 800 }}>
                <span>Total</span><span>${totals.grandTotal.toFixed(2)}</span>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}

export default CheckoutPage


