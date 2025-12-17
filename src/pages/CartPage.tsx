import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import SEO from '../components/SEO'
import './CartPage.css'

const CartPage = () => {
  const { cart, totals, removeItem, canCheckout, checkoutValidationMessage } = useCart()
  const navigate = useNavigate()
  const count = cart.items.length
  return (
    <main className="cart-page">
      <SEO
        title="Service Cart | GTA Budget Painting"
        description="Review your selected painting services."
        canonical="/cart"
        robots="noindex, nofollow"
      />
      <div className="container">
        <div className="cart-header">
          <div className="cart-title">
            <h3>Service Cart</h3>
          </div>
          {/* Clear Cart removed as requested */}
        </div>

        {count === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <Link to="/services" className="btn-primary">Browse Services</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <section className={`cart-list ${count > 5 ? 'scrollable' : ''}`}>
              {cart.items.map((it) => (
                <article key={it.id} className="cart-item">
                  <div className="cart-item-main">
                    <div className="cart-item-title">{it.serviceName}</div>
                    {(it.serviceId === 'interior-door' || it.serviceId === 'front-door') && it.formData?.doorCount && (
                      <div className="cart-item-meta">
                        {it.formData.doorCount} {it.formData.doorCount === 1 ? 'door' : 'doors'}
                        {it.formData.includeDoorFrames && ' • Frames included'}
                        {it.formData.includeHardware && ' • Hardware included'}
                        {it.formData.includeWeatherproofing && ' • Weatherproofing included'}
                      </div>
                    )}
                  </div>
                  <div className="cart-item-price">${it.estimate.totalCost.toFixed(2)}</div>
                  <button
                    className="icon-btn"
                    onClick={() => {
                      try {
                        const stateKey = `booking-${it.serviceId}`
                        const saved = {
                          step: 'service-form',
                          estimate: it.estimate,
                          formData: it.formData,
                          customerInfo: {
                            firstName: '', lastName: '', email: '', phone: '', address: '', city: '', postalCode: '', preferredContact: 'phone', bestTimeToCall: '', howDidYouHear: '', additionalNotes: ''
                          },
                          preferredDate: '',
                          timestamp: Date.now()
                        }
                        localStorage.setItem(stateKey, JSON.stringify(saved))
                      } catch {}
                      
                      // Handle different service routing
                      if (it.serviceId === 'interior-door') {
                        navigate(`/services/interior-painting/interior-door?editId=${encodeURIComponent(it.id)}`)
                      } else if (it.serviceId === 'front-door') {
                        navigate(`/services/exterior-painting/front-door?editId=${encodeURIComponent(it.id)}`)
                      } else {
                        navigate(`/services/${it.serviceId}?editId=${encodeURIComponent(it.id)}`)
                      }
                    }}
                    aria-label="Edit"
                  >
                    <img src="/pen.svg" alt="Edit" />
                  </button>
                  <button className="cart-remove" onClick={() => removeItem(it.id)} aria-label="Remove">×</button>
                </article>
              ))}
            </section>

            <aside className="cart-summary-card">
              <h3>Order Summary <span className="cart-count">({count} {count === 1 ? 'item' : 'items'})</span></h3>
              <div className="cart-summary-rows">
                <div className="row"><span>Subtotal</span><span>${totals.itemsSubtotal.toFixed(2)}</span></div>
                {totals.travelFeeAdjustment > 0 && (
                  <div className="row"><span>Travel Adjustment</span><span>+${totals.travelFeeAdjustment.toFixed(2)}</span></div>
                )}
                {totals.discount > 0 && (
                  <div className="row discount"><span>Discount (15%)</span><span>- ${totals.discount.toFixed(2)}</span></div>
                )}
                <div className="row total"><span>Total</span><span>${totals.grandTotal.toFixed(2)}</span></div>
              </div>
              <div className="cart-summary-actions">
                {!canCheckout && checkoutValidationMessage && (
                  <div className="checkout-validation-message">
                    <div className="validation-icon">⚠️</div>
                    <div className="validation-text">{checkoutValidationMessage}</div>
                  </div>
                )}
                <Link 
                  to="/checkout" 
                  className={`btn-primary ${!canCheckout ? 'disabled' : ''}`}
                  onClick={(e) => {
                    if (!canCheckout) {
                      e.preventDefault();
                    }
                  }}
                >
                  Submit Request
                </Link>
                <Link to="/services" className="btn-secondary">Continue Shopping</Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}

export default CartPage


