import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import './Header.css'
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
                    {(it.serviceId === 'interior-door' || it.serviceId === 'front-door') && it.formData?.doorCount && (
                      <div className="cart-item-meta">
                        {it.formData.doorCount} {it.formData.doorCount === 1 ? 'door' : 'doors'}
                        {it.formData.includeDoorFrames && ' • Frames'}
                        {it.formData.includeHardware && ' • Hardware'}
                        {it.formData.includeWeatherproofing && ' • Weatherproofing'}
                      </div>
                    )}
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false)
  const [isMobileServicesDropdownOpen, setIsMobileServicesDropdownOpen] = useState(false)
  const { cart } = useCart()
  const location = useLocation()

  const handleSectionClick = (sectionId: string) => {
    if (location.pathname === '/') {
      // If already on landing page, scroll to section
      const element = document.querySelector(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    // If not on landing page, Link will handle navigation
  }

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
          
          {/* Navigation Menu */}
          <nav className="desktop-nav">
            <Link to="/#company-section" className="nav-link" onClick={() => handleSectionClick('#company-section')}>About Us</Link>
            
            {/* Services Dropdown */}
            <div className="nav-dropdown">
              <button 
                className="nav-link dropdown-trigger"
                onMouseEnter={() => setIsServicesDropdownOpen(true)}
                onMouseLeave={() => setIsServicesDropdownOpen(false)}
              >
                Services
                <span className="dropdown-arrow">▼</span>
              </button>
              <div 
                className={`dropdown-menu ${isServicesDropdownOpen ? 'open' : ''}`}
                onMouseEnter={() => setIsServicesDropdownOpen(true)}
                onMouseLeave={() => setIsServicesDropdownOpen(false)}
              >
                <Link to="/services" className="dropdown-link">All Services</Link>
                <Link to="/services/interior-painting" className="dropdown-link">Interior Painting</Link>
                <Link to="/services/exterior-painting" className="dropdown-link">Exterior Painting</Link>
                <Link to="/services/custom-painting" className="dropdown-link">Custom Project</Link>
              </div>
            </div>
            
            <Link to="/#areas-served-section" className="nav-link" onClick={() => handleSectionClick('#areas-served-section')}>Areas Served</Link>
            <Link to="/gallery" className="nav-link">Gallery</Link>
            <Link to="/contact-us" className="nav-link">Contact Us</Link>
          </nav>

          {/* Phone Number */}
          <a href="tel:6473907181" className="nav-phone">
            <img src="/telephone.png" alt="Phone" className="nav-phone-icon" />
            Call (647) 390-7181
          </a>

            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
              <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
              <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
            <div className="mobile-nav-header">
              <h3>Navigation</h3>
              <button className="mobile-nav-close" onClick={() => setIsMobileMenuOpen(false)}>×</button>
            </div>
            <div className="mobile-nav-body">
              <Link to="/#company-section" className="mobile-nav-link" onClick={() => { setIsMobileMenuOpen(false); handleSectionClick('#company-section'); }}>About Us</Link>
              
              {/* Mobile Services Dropdown */}
              <div className="mobile-nav-dropdown">
                <button 
                  className="mobile-nav-link mobile-dropdown-trigger"
                  onClick={() => setIsMobileServicesDropdownOpen(!isMobileServicesDropdownOpen)}
                >
                  Services
                  <span className="mobile-dropdown-arrow">{isMobileServicesDropdownOpen ? '▲' : '▼'}</span>
                </button>
                <div className={`mobile-dropdown-menu ${isMobileServicesDropdownOpen ? 'open' : ''}`}>
                  <Link to="/services" className="mobile-dropdown-link" onClick={() => setIsMobileMenuOpen(false)}>All Services</Link>
                  <Link to="/services/interior-painting" className="mobile-dropdown-link" onClick={() => setIsMobileMenuOpen(false)}>Interior Painting</Link>
                  <Link to="/services/exterior-painting" className="mobile-dropdown-link" onClick={() => setIsMobileMenuOpen(false)}>Exterior Painting</Link>
                  <Link to="/services/custom-painting" className="mobile-dropdown-link" onClick={() => setIsMobileMenuOpen(false)}>Custom Project</Link>
                </div>
              </div>
              
              <Link to="/#areas-served-section" className="mobile-nav-link" onClick={() => { setIsMobileMenuOpen(false); handleSectionClick('#areas-served-section'); }}>Areas Served</Link>
              <Link to="/gallery" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Gallery</Link>
              <Link to="/contact-us" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
            </div>
          </nav>
        </header>

      {/* Floating Cart Button */}
      <button 
        className="floating-cart-btn" 
        onClick={() => {
          setIsCartOpen(true);
          setIsMobileMenuOpen(false);
        }}
        aria-label="Open Cart"
      >
        <CartIcon count={cart.items.length} />
      </button>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}

export default Header

