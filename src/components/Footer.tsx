import './Footer.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const toggleDropdown = (section: string) => {
    setActiveDropdown(activeDropdown === section ? null : section)
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          
          {/* Column 1: Brand & Hours */}
          <div className="footer-column brand-column">
            <h3>GTA Budget Painting</h3>
            <p className="brand-description">
              Your trusted professionals for residential painting in the Greater Toronto Area. Quick turnaround, budget-friendly pricing, and exceptional results.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              <Link to="/about-us">About Us</Link>
            </p>
            
            <div className="business-hours">
              <h4>Business Hours</h4>
              <p>Monday - Sunday<br />8:00 AM - 8:00 PM</p> 
            </div>
          </div>

          {/* Column 2: Services */}
          <div className={`footer-column services-column ${activeDropdown === 'services' ? 'active' : ''}`}>
            <h4 
              className="mobile-dropdown-header"
              onClick={() => toggleDropdown('services')}
            >
              Our Services
              <span className="dropdown-arrow"></span>
            </h4>
            <h4 className="desktop-header">Our Services</h4>
            
            <ul className="footer-links-list">
              <li><Link to="/services/interior-painting">Interior Painting</Link></li>
              <li><Link to="/services/exterior-painting">Exterior Painting</Link></li>
              <li><Link to="/services/custom-painting">Custom Painting</Link></li>
              <li><Link to="/services/interior-painting/kitchen-walls">Kitchen Painting</Link></li>
              <li><Link to="/services/interior-painting/bedroom-painting">Bedroom Painting</Link></li>
              <li><Link to="/services/interior-painting/small-bathroom">Bathroom Painting</Link></li>
              <li><Link to="/services/interior-painting/accent-wall">Accent Walls</Link></li>
              <li><Link to="/services/interior-painting/ceiling">Ceiling Painting</Link></li>
              <li><Link to="/services/interior-painting/interior-door">Interior Doors</Link></li>
              <li><Link to="/services/interior-painting/trimming-baseboards">Trim & Baseboards</Link></li>
              <li><Link to="/services/exterior-painting/front-door">Front Doors</Link></li>
              <li><Link to="/services/exterior-painting/garage-door">Garage Doors</Link></li>
              <li><Link to="/services/exterior-painting/fence-painting">Fence Painting</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact & Social */}
          <div className="footer-column contact-column">
            <div className="contact-wrapper">
              <h4>Contact Us</h4>
              <div className="contact-items">
                <a href="tel:6473907181" className="footer-contact-link">
                  <img src="/telephone.png" alt="Phone" className="footer-icon" />
                  (647) 390-7181
                </a>
                <a href="mailto:info@gtabudgetpainting.ca" className="footer-contact-link">
                  <img src="/mail.png" alt="Email" className="footer-icon" />
                  info@gtabudgetpainting.ca
                </a>
              </div>
            </div>

            <div className="social-wrapper">
              <h4>Follow Us</h4>
              <div className="social-links">
                <a 
                  href="https://www.facebook.com/profile.php?id=61578315664485" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link facebook"
                  aria-label="Facebook"
                >
                  <img src="/facebook.png" alt="Facebook" className="social-icon" />
                  Facebook
                </a>
                <a 
                  href="https://www.instagram.com/gtabudgetpainting/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link instagram"
                  aria-label="Instagram"
                >
                  <img src="/instagram.png" alt="Instagram" className="social-icon" />
                  Instagram
                </a>
              </div>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p className="copyright">
            &copy; {new Date().getFullYear()} GTA Budget Painting. All rights reserved. 
            <span className="divider">|</span> 
            <a href="https://gtahomepainting.ca" target="_blank" rel="noopener noreferrer" className="partner-link">
              Partner of GTA Home Painting
            </a>
          </p>
          <div className="footer-keywords">
            Small Job Painters Toronto • Quick Turnaround Painting GTA • Budget Residential Painting • Affordable Small Job Painters • Fast Interior Painting
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
