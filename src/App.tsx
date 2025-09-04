import { useState } from 'react'
import './App.css'
import QuoteCalculator from './components/QuoteCalculator'
import ServicesPage from './components/ServicesPage'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedQuoteService, setSelectedQuoteService] = useState<{
    category: string
    serviceId: string
  } | null>(null)

  const handleNavigateToQuote = (category: string, serviceId: string) => {
    setSelectedQuoteService({ category, serviceId })
    setCurrentPage('quote')
  }

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo" onClick={() => setCurrentPage('home')}>
            <img src="/logo.png" alt="GTA Budget Painting Logo" className="logo-image" />
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
            <a 
              href="#home" 
              className={currentPage === 'home' ? 'active' : ''} 
              onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}
            >
              Home
            </a>
            <a 
              href="#services" 
              className={currentPage === 'services' ? 'active' : ''} 
              onClick={(e) => { e.preventDefault(); setCurrentPage('services'); }}
            >
              Services
            </a>
            <a 
              href="#quote" 
              className={currentPage === 'quote' ? 'active' : ''} 
              onClick={(e) => { e.preventDefault(); setCurrentPage('quote'); }}
            >
              Get Quote
            </a>
            <a 
              href="#about" 
              className={currentPage === 'about' ? 'active' : ''} 
              onClick={(e) => { e.preventDefault(); setCurrentPage('about'); }}
            >
              About
            </a>
            <a 
              href="#contact" 
              className={currentPage === 'contact' ? 'active' : ''} 
              onClick={(e) => { e.preventDefault(); setCurrentPage('contact'); }}
            >
              Contact
            </a>
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
          <a 
            href="#home" 
            className={currentPage === 'home' ? 'active' : ''} 
            onClick={(e) => { 
              e.preventDefault(); 
              setCurrentPage('home'); 
              setIsMobileMenuOpen(false);
            }}
          >
            Home
          </a>
          <a 
            href="#services" 
            className={currentPage === 'services' ? 'active' : ''} 
            onClick={(e) => { 
              e.preventDefault(); 
              setCurrentPage('services'); 
              setIsMobileMenuOpen(false);
            }}
          >
            Services
          </a>
          <a 
            href="#quote" 
            className={currentPage === 'quote' ? 'active' : ''} 
            onClick={(e) => { 
              e.preventDefault(); 
              setCurrentPage('quote'); 
              setIsMobileMenuOpen(false);
            }}
          >
            Get Quote
          </a>
          <a 
            href="#about" 
            className={currentPage === 'about' ? 'active' : ''} 
            onClick={(e) => { 
              e.preventDefault(); 
              setCurrentPage('about'); 
              setIsMobileMenuOpen(false);
            }}
          >
            About
          </a>
          <a 
            href="#contact" 
            className={currentPage === 'contact' ? 'active' : ''} 
            onClick={(e) => { 
              e.preventDefault(); 
              setCurrentPage('contact'); 
              setIsMobileMenuOpen(false);
            }}
          >
            Contact
          </a>
        </nav>
      </div>

      {/* Main Content */}
      {currentPage === 'quote' ? (
        <QuoteCalculator 
          preSelectedCategory={selectedQuoteService?.category}
          preSelectedService={selectedQuoteService?.serviceId}
        />
      ) : currentPage === 'services' ? (
        <ServicesPage onNavigateToQuote={handleNavigateToQuote} />
      ) : (
        <>
          {/* Hero Section */}
          <section id="home" className="hero" style={{ display: currentPage === 'home' ? 'block' : 'none' }}>
        <div className="hero-content">
          <h1>Professional Painting Services in GTA</h1>
          <p>Transform your space with our affordable, high-quality painting services. Residential and commercial projects welcome.</p>
          <div className="hero-buttons">
            <button 
              className="btn-primary" 
              onClick={() => setCurrentPage('quote')}
            >
              Get Free Quote
            </button>
            <button 
              className="btn-secondary"
              onClick={() => setCurrentPage('services')}
            >
              View Our Services
            </button>
          </div>
        </div>
        <div className="hero-features">
          <div className="feature">
            <span className="feature-icon">🎨</span>
            <h3>Expert Painters</h3>
            <p>Professional team with years of experience</p>
          </div>
          <div className="feature">
            <span className="feature-icon">💰</span>
            <h3>Budget Friendly</h3>
            <p>Competitive prices without compromising quality</p>
          </div>
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <h3>Fast Service</h3>
            <p>Quick turnaround times to meet your schedule</p>
          </div>
        </div>
      </section>

          {/* Services Section */}
          <section id="services" className="services" style={{ display: currentPage === 'services' ? 'block' : 'none' }}>
        <div className="container">
          <h2>Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>Interior Painting</h3>
              <p>Transform your indoor spaces with professional interior painting services. We handle everything from prep work to final touches.</p>
              <ul>
                <li>Wall painting</li>
                <li>Ceiling painting</li>
                <li>Trim & molding</li>
                <li>Color consultation</li>
              </ul>
            </div>
            <div className="service-card">
              <h3>Exterior Painting</h3>
              <p>Protect and beautify your property's exterior with weather-resistant paints and expert application techniques.</p>
              <ul>
                <li>House painting</li>
                <li>Deck & fence staining</li>
                <li>Pressure washing</li>
                <li>Surface preparation</li>
              </ul>
            </div>
            <div className="service-card">
              <h3>Commercial Painting</h3>
              <p>Professional painting services for offices, retail spaces, and commercial buildings with minimal disruption to your business.</p>
              <ul>
                <li>Office painting</li>
                <li>Retail spaces</li>
                <li>Warehouses</li>
                <li>Scheduled maintenance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

          {/* About Section */}
          <section id="about" className="about" style={{ display: currentPage === 'about' ? 'block' : 'none' }}>
            <div className="container">
              <div className="about-hero">
                <h2>Why GTA Budget Painting?</h2>
                <p>We understand that not every paint job is a full-scale renovation. Sometimes you just need a quick refresh before moving out of a rental, touching up a few rooms, or fixing scuffs and wear-and-tear. That's where we come in.</p>
              </div>

              <div className="pricing-highlight">
                <div className="pricing-card">
                  <h3>Flat Rate: $850/day</h3>
                  <p>Perfect for one-day jobs and small projects around the house. No surprises — just simple pricing.</p>
                </div>
              </div>

              <div className="about-features-grid">
                <div className="about-feature-card">
                  <div className="feature-header">
                    <span className="feature-icon">⚡</span>
                    <h4>No-Fuss Service</h4>
                  </div>
                  <p>Quick, clean, and professional. We show up on time, do the work right, and leave your space looking great.</p>
                </div>

                <div className="about-feature-card">
                  <div className="feature-header">
                    <span className="feature-icon">👥</span>
                    <h4>Trusted Team</h4>
                  </div>
                  <p>The same experienced painters from GTA Home Painting, now offering a budget-friendly solution.</p>
                </div>
              </div>

              <div className="perfect-for-section">
                <h3>Perfect for:</h3>
                <div className="perfect-for-grid">
                  <div className="perfect-for-item">
                    <span className="item-icon">🏠</span>
                    <p>Tenants moving out and needing a touch-up</p>
                  </div>
                  <div className="perfect-for-item">
                    <span className="item-icon">🎨</span>
                    <p>Homeowners wanting to freshen up a room or two</p>
                  </div>
                  <div className="perfect-for-item">
                    <span className="item-icon">🔧</span>
                    <p>Small repair jobs (walls, trim, baseboards)</p>
                  </div>
                </div>
              </div>

              <div className="value-proposition">
                <h3>Same Quality. Simpler Approach. Lower Cost.</h3>
                <p>At GTA Budget Painting, we believe that everyone deserves a home that looks and feels good — without breaking the bank. And with the backing of GTA Home Painting's trusted reputation (just check our Google Reviews), you know you're in good hands.</p>
              </div>

              <div className="ready-to-book">
                <h3>Ready to Book?</h3>
                <p>Book your painter online! Just pick the service you are looking for – let us know the day, and we will be there to do the job.</p>
                <button 
                  className="btn-book-now"
                  onClick={() => setCurrentPage('quote')}
                >
                  Book Your Painter Now
                </button>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="contact" style={{ display: currentPage === 'contact' ? 'block' : 'none' }}>
        <div className="container">
          <h2>Get Your Free Quote Today</h2>
          <p>Ready to transform your space? Contact us for a free, no-obligation quote.</p>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <h4>Phone</h4>
                  <p>(416) 555-PAINT</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div>
                  <h4>Email</h4>
                  <p>info@gtabudgetpainting.com</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <h4>Service Area</h4>
                  <p>Greater Toronto Area</p>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <form>
                <input type="text" placeholder="Your Name" required />
                <input type="email" placeholder="Your Email" required />
                <input type="tel" placeholder="Your Phone" />
                <textarea placeholder="Tell us about your project..." rows={4} required></textarea>
                <button type="submit" className="btn-primary">Send Message</button>
              </form>
            </div>
          </div>
        </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>GTA Budget Painting</h3>
              <p>Your trusted painting professionals in the Greater Toronto Area.</p>
            </div>
            <div className="footer-section">
              <h4>Services</h4>
              <ul>
                <li>Interior Painting</li>
                <li>Exterior Painting</li>
                <li>Commercial Painting</li>
                <li>Color Consultation</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Phone: (416) 555-PAINT</p>
              <p>Email: info@gtabudgetpainting.com</p>
            </div>
            <div className="footer-section">
              <h4>Follow Us</h4>
              <div className="social-links">
                <a 
                  href="https://www.facebook.com/profile.php?id=61578315664485" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link facebook"
                  aria-label="Follow us on Facebook"
                >
                  <img src="/facebook.png" alt="Facebook" className="social-icon-img" />
                </a>
                <a 
                  href="https://www.instagram.com/gta_budget_painting/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link instagram"
                  aria-label="Follow us on Instagram"
                >
                  <img src="/instagram.png" alt="Instagram" className="social-icon-img" />
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 GTA Budget Painting. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
