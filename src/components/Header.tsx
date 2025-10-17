import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../App.css'
import { useCart } from '../context/CartContext'

function CartIcon({ count }: { count: number }) {
  return (
    <div className="cart-icon" aria-label="Cart">
      <span className="cart-icon-bag">
        <img src="/shopping-cart.png" alt="Cart" />
      </span>
      {count > 0 && <span className="cart-badge">{count}</span>}
    </div>
  )
}

function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, totals, removeItem } = useCart()
  const navigate = useNavigate()
  return (
    <div className={`cart-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <aside className={`cart-drawer ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <h3>Your Cart</h3>
          <button className="cart-close" onClick={onClose}>×</button>
        </div>
        <div className="cart-drawer-body">
          {cart.items.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            <ul className="cart-items">
              {cart.items.map((it) => (
                <li key={it.id} className="cart-item">
                  <div className="cart-item-main">
                    <div className="cart-item-title">{it.serviceName}</div>
                  </div>
                  <div className="cart-item-price">${it.estimate.totalCost.toFixed(2)}</div>
                  <button className="icon-btn" aria-label="Edit" onClick={() => {
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
                    onClose();
                    navigate(`/services/${it.serviceId}?editId=${encodeURIComponent(it.id)}`)
                  }}>
                    <img src="/pen.svg" alt="Edit" />
                  </button>
                  <button className="cart-remove" onClick={() => removeItem(it.id)} aria-label="Remove">×</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="cart-drawer-footer">
          <div className="cart-summary">
            <div className="row"><span>Subtotal</span><span>${totals.itemsSubtotal.toFixed(2)}</span></div>
            {totals.travelFeeAdjustment > 0 && (
              <div className="row"><span>Travel Adj.</span><span>+${totals.travelFeeAdjustment.toFixed(2)}</span></div>
            )}
            {totals.discount > 0 && (
              <div className="row discount"><span>Discount (15%)</span><span>- ${totals.discount.toFixed(2)}</span></div>
            )}
            <div className="row total"><span>Total</span><span>${totals.grandTotal.toFixed(2)}</span></div>
          </div>
          <div className="cart-actions">
            <Link to="/cart" className="btn-primary" onClick={onClose}>View Cart</Link>
          </div>
        </div>
      </aside>
    </div>
  )
}

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cart } = useCart()

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <Link to="/">
              <img src="/logo.png" alt="GTA Budget Painting Logo" className="logo-image" />
            </Link>
          </div>
          
          {/* Contact Info */}
          <div className="header-contact">
            <a href="tel:6473907181" className="header-contact-link">
              <img src="/telephone.png" alt="Phone" className="header-contact-icon" />
              <span className="header-contact-text">(647) 390-7181</span>
            </a>
            <a href="mailto:info@gtabudgetpainting.com" className="header-contact-link">
              <img src="/mail.png" alt="Email" className="header-contact-icon" />
              <span className="header-contact-text">info@gtabudgetpainting.com</span>
            </a>
          </div>
        </div>
      </header>

      {/* Floating Cart Button */}
      <button 
        className="floating-cart-btn" 
        onClick={() => setIsCartOpen(true)}
        aria-label="Open Cart"
      >
        <CartIcon count={cart.items.length} />
      </button>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}

export default Header

