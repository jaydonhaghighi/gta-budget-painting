import { useEffect, useState, type MouseEvent } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import { useCart } from '../context/CartContext';
import { trackPhoneClick } from '../utils/analytics';

function CartIcon({ count }: { count: number }) {
  return (
    <span className="cart-icon" aria-hidden="true">
      <span className="cart-icon-bag">
        <img src="/shopping-cart.png" alt="" />
      </span>
      {count > 0 && <span className="cart-badge">{count}</span>}
    </span>
  );
}

function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, totals, removeItem } = useCart();
  const navigate = useNavigate();

  const handleEdit = (id: string, serviceId: string, estimate: unknown, formData: unknown) => {
    try {
      const stateKey = `booking-${serviceId}`;
      const saved = {
        step: 'service-form',
        estimate,
        formData,
        customerInfo: {
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
          additionalNotes: '',
        },
        preferredDate: '',
        timestamp: Date.now(),
      };
      localStorage.setItem(stateKey, JSON.stringify(saved));
    } catch {
      // Local storage restore is optional.
    }

    onClose();
    navigate(`/services/${serviceId}?editId=${encodeURIComponent(id)}`);
  };

  return (
    <div className={`cart-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <aside className={`cart-drawer ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <h3>Your Booking Cart</h3>
          <button type="button" className="cart-close" onClick={onClose} aria-label="Close cart">
            ×
          </button>
        </div>

        <div className="cart-drawer-body">
          {cart.items.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            <ul className="cart-items">
              {cart.items.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item-main">
                    <p className="cart-item-title">{item.serviceName}</p>
                    {(item.serviceId === 'interior-door' || item.serviceId === 'front-door') && item.formData?.doorCount && (
                      <p className="cart-item-meta">
                        {item.formData.doorCount} {item.formData.doorCount === 1 ? 'door' : 'doors'}
                        {item.formData.includeDoorFrames && ' • Frames'}
                        {item.formData.includeHardware && ' • Hardware'}
                        {item.formData.includeWeatherproofing && ' • Weatherproofing'}
                      </p>
                    )}
                  </div>

                  <p className="cart-item-price">${item.estimate.totalCost.toFixed(2)}</p>

                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => handleEdit(item.id, item.serviceId, item.estimate, item.formData)}
                    aria-label="Edit item"
                  >
                    <img src="/pen.svg" alt="" />
                  </button>

                  <button
                    type="button"
                    className="cart-remove"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="cart-drawer-footer">
          <div className="cart-summary">
            <div className="row">
              <span>Subtotal</span>
              <span>${totals.itemsSubtotal.toFixed(2)}</span>
            </div>
            {totals.travelFeeAdjustment > 0 && (
              <div className="row">
                <span>Travel Adj.</span>
                <span>+${totals.travelFeeAdjustment.toFixed(2)}</span>
              </div>
            )}
            {totals.discount > 0 && (
              <div className="row discount">
                <span>Discount</span>
                <span>- ${totals.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="row total">
              <span>Total</span>
              <span>${totals.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="cart-actions">
            <Link to="/cart" className="btn-primary" onClick={onClose}>
              View Cart
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isCartOpen && !isMobileMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCartOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isCartOpen, isMobileMenuOpen]);

  const scrollToSection = (hash: string) => {
    const section = document.querySelector(hash);
    if (!section) return;
    const headerOffset = 120;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: sectionTop, behavior: 'smooth' });
  };

  const navigateToSection = (hash: string) => {
    setIsMobileMenuOpen(false);
    if (location.pathname === '/') {
      scrollToSection(hash);
      return;
    }
    navigate(`/${hash}`);
  };

  const handleLogoClick = (event: MouseEvent) => {
    event.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    navigate('/');
  };

  const handlePhoneClick = () => {
    trackPhoneClick({ location: 'header' });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="header" role="banner">
        <div className="container header-inner">
          <div className="logo-wrap">
            <Link to="/" onClick={handleLogoClick} className="logo" aria-label="GTA Budget Painting home">
              <img src="/logo_BW.png" alt="GTA Budget Painting" className="logo-image" />
            </Link>
          </div>

          <nav className="desktop-nav" aria-label="Main navigation">
            <div
              className="nav-dropdown"
              onMouseEnter={() => setIsServicesDropdownOpen(true)}
              onMouseLeave={() => setIsServicesDropdownOpen(false)}
            >
              <button
                type="button"
                className="nav-link dropdown-trigger"
                aria-expanded={isServicesDropdownOpen}
                onClick={() => setIsServicesDropdownOpen((prev) => !prev)}
              >
                Services
                <span className="dropdown-arrow" aria-hidden="true">
                  ▼
                </span>
              </button>
              <div className={`dropdown-menu ${isServicesDropdownOpen ? 'open' : ''}`}>
                <Link to="/services" className="dropdown-link">
                  All Services
                </Link>
                <Link to="/services/interior-painting" className="dropdown-link">
                  Interior Painting
                </Link>
                <Link to="/services/exterior-painting" className="dropdown-link">
                  Exterior Painting
                </Link>
                <Link to="/services/custom-painting" className="dropdown-link">
                  Custom Projects
                </Link>
              </div>
            </div>

            <button type="button" className="nav-link nav-link-button" onClick={() => navigateToSection('#areas-served-section')}>
              Areas Served
            </button>
            <NavLink to="/about-us" className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}>
              About
            </NavLink>
            <NavLink to="/specials" className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}>
              Specials
            </NavLink>
            <NavLink
              to="/contact-us"
              className={({ isActive }) => `nav-link nav-quote-link${isActive ? ' is-active' : ''}`}
            >
              Request Quote
            </NavLink>
          </nav>

          <div className="header-actions">
            <a href="tel:+16476758101" className="nav-phone" onClick={handlePhoneClick}>
              <img src="/telephone.png" alt="" className="nav-phone-icon" />
              <span>647-675-8101</span>
            </a>

            <button
              type="button"
              className="cart-header-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="Open cart"
            >
              <CartIcon count={cart.items.length} />
            </button>

            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`} />
              <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`} />
              <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`} />
            </button>
          </div>
        </div>

        <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
          <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="mobile-nav-header">
              <h3>Menu</h3>
              <button type="button" className="mobile-nav-close" onClick={() => setIsMobileMenuOpen(false)}>
                ×
              </button>
            </div>

            <div className="mobile-nav-body">
              <Link to="/services" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                All Services
              </Link>
              <Link to="/services/interior-painting" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                Interior Painting
              </Link>
              <Link to="/services/exterior-painting" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                Exterior Painting
              </Link>
              <Link to="/services/custom-painting" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                Custom Projects
              </Link>
              <button type="button" className="mobile-nav-link mobile-nav-button" onClick={() => navigateToSection('#areas-served-section')}>
                Areas Served
              </button>
              <Link to="/about-us" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                About Us
              </Link>
              <Link to="/specials" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                Specials
              </Link>
              <Link to="/contact-us" className="mobile-nav-link mobile-quote-link" onClick={() => setIsMobileMenuOpen(false)}>
                Request Quote
              </Link>

              <a href="tel:+16476758101" className="mobile-phone" onClick={handlePhoneClick}>
                <img src="/telephone.png" alt="" className="nav-phone-icon" />
                Call 647-675-8101
              </a>

              <button
                type="button"
                className="cart-mobile-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
              >
                <CartIcon count={cart.items.length} />
                <span>Open Cart</span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
