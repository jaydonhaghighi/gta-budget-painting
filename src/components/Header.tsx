import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../App.css'
import { useCart } from '../context/CartContext'

function CartIcon({ count }: { count: number }) {
  return (
    <div className="cart-icon" aria-label="Cart">
      <span className="cart-icon-bag">🛒</span>
      {count > 0 && <span className="cart-badge">{count}</span>}
    </div>
  )
}

function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, totals, removeItem, clear } = useCart()
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
                    <div className="cart-item-sub">{it.serviceType}</div>
                  </div>
                  <div className="cart-item-price">${it.estimate.totalCost.toFixed(2)}</div>
                  <button className="cart-remove" onClick={() => removeItem(it.id)}>Remove</button>
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
            <button className="btn-secondary" onClick={clear}>Clear</button>
            <Link to="/cart" className="btn-primary" onClick={onClose}>View Cart</Link>
          </div>
        </div>
      </aside>
    </div>
  )
}

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const location = useLocation()
  const { cart } = useCart()
  
  const currentPage = location.pathname === '/' ? 'home' : 'services'

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
          
          {/* Hamburger Menu Button */}
          <button 
            className={`hamburger-btn ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>

          {/* Desktop Navigation */}
          <nav className="nav desktop-nav">
            <Link 
              to="/" 
              className={currentPage === 'home' ? 'active' : ''}
            >
              Book Now
            </Link>
            <button className="cart-header-btn" onClick={() => setIsCartOpen(true)}>
              <CartIcon count={cart.items.length} />
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Navigation Panel */}
      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <h3 className="mobile-nav-title">GTA Budget Painting</h3>
          <button 
            className="mobile-nav-close"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close mobile menu"
          >
            <span className="close-icon">×</span>
          </button>
        </div>
        <nav className="mobile-nav">
          <Link 
            to="/" 
            className={currentPage === 'home' ? 'active' : ''}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Book Now
          </Link>
          <button className="cart-mobile-btn" onClick={() => { setIsMobileMenuOpen(false); setIsCartOpen(true) }}>
            <CartIcon count={cart.items.length} />
          </button>
        </nav>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}

export default Header

