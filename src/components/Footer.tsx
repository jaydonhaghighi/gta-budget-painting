import './Footer.css'
import { useState } from 'react'

const Footer = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const toggleDropdown = (section: string) => {
    setActiveDropdown(activeDropdown === section ? null : section)
  }
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section footer-about">
            <h3>GTA Budget Painting</h3>
            <p>Your trusted painting professionals in the Greater Toronto Area. We provide expert interior and exterior painting services across the GTA with quality workmanship and competitive pricing.</p>
            
            <div className="business-hours">
              <h4>Business Hours</h4>
              <p>Monday - Sunday: 8:00 AM - 8:00 PM</p> 
            </div>

            {/* Contact and Social Container */}
            <div className="contact-social-container">
              {/* Contact Info */}
              <div className="contact-info-section">
                <h4>Contact Us</h4>
                <div className="contact-item">
                  <img src="/telephone.png" alt="Phone" className="contact-icon" />
                  <a href="tel:6473907181">(647) 390-7181</a>
                </div>
                <div className="contact-item">
                  <img src="/mail.png" alt="Email" className="contact-icon" />
                  <a href="mailto:info@gtabudgetpainting.ca">info@gtabudgetpainting.ca</a>
                </div>
              </div>

              {/* Social Media */}
              <div className="social-section">
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
                    Facebook
                  </a>
                  <a 
                    href="https://www.instagram.com/gtabudgetpainting/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link instagram"
                    aria-label="Follow us on Instagram"
                  >
                    <img src="/instagram.png" alt="Instagram" className="social-icon-img" />
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Services and Service Areas Container */}
          <div className="services-container">
            {/* Services */}
            <div className={`footer-section ${activeDropdown === 'services' ? 'active' : ''}`}>
              <h4 
                onClick={() => toggleDropdown('services')}
                className={activeDropdown === 'services' ? 'active' : ''}
              >
                Our Services
              </h4>
              <ul className="footer-list">
                <li><a href="/services/interior-painting/accent-wall">Accent Wall Painting</a></li>
                <li><a href="/services/interior-painting/ceiling">Ceiling Painting</a></li>
                <li><a href="/services/interior-painting/bathroom-vanity-cabinet">Bathroom Vanity Painting</a></li>
                <li><a href="/services/interior-painting/interior-door">Interior Door Painting</a></li>
                <li><a href="/services/interior-painting/trimming-baseboards">Trimming & Baseboards</a></li>
                <li><a href="/services/interior-painting/small-bathroom">Bathroom Painting</a></li>
                <li><a href="/services/interior-painting/bedroom-painting">Bedroom Painting</a></li>
                <li><a href="/services/interior-painting/kitchen">Kitchen Painting</a></li>
                <li><a href="/services/interior-painting/trimming-baseboards">Trimming & Baseboards</a></li>
                <li><a href="/services/exterior-painting/front-door">Front Door Painting</a></li>
                <li><a href="/services/exterior-painting/fence-painting">Fence Painting</a></li>
                <li><a href="/services/exterior-painting/garage-door">Garage Door Painting</a></li>
              </ul>
            </div>

            {/* Service Areas */}
            <div className={`footer-section ${activeDropdown === 'areas' ? 'active' : ''}`}>
              <h4 
                onClick={() => toggleDropdown('areas')}
                className={activeDropdown === 'areas' ? 'active' : ''}
              >
                Service Areas
              </h4>
              <ul className="footer-list">
                <li>Vaughan</li>
                <li>Toronto</li>
                <li>Mississauga</li>
                <li>Brampton</li>
                <li>Markham</li>
                <li>Richmond Hill</li>
                <li>Thornhill</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 GTA Budget Painting. All rights reserved. | <a href="https://gtahomepainting.ca" target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'none'}} onMouseOver={e => (e.target as HTMLElement).style.color = '#8B0000'} onMouseOut={e => (e.target as HTMLElement).style.color = 'inherit'}>Partner of GTA Home Painting</a></p>
            <div className="footer-keywords">
              <span>Affordable Painting Toronto GTA | Budget-Friendly Interior Painting | Fast & Cheap Exterior Painting | Greater Toronto Area Residential Painting | Best Value House Painters | Cost-Effective Condo Painting | Quick & Affordable Commercial Painting | Budget Interior Painters GTA | Affordable Exterior House Painting | Fast Residential Painting Services</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

