import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../App.css'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  
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
        </nav>
      </div>
    </>
  )
}

export default Header

