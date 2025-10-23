import '../App.css'

const Footer = () => {
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
            <a 
              href="https://gtahomepainting.ca" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-larger-jobs-link"
            >
              <img src="/ghp-logo.png" alt="GTA Home Painting" className="ghp-logo" />
              <span>Proud Partner of GTA Home Painting</span>
            </a>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4>Our Services</h4>
            <ul className="footer-list">
              <li><a href="/services/accent-wall">Accent Wall Painting</a></li>
              <li><a href="/services/ceiling">Ceiling Painting</a></li>
              <li><a href="/services/small-bathroom">Bathroom Painting</a></li>
              <li><a href="/services/bedroom-painting">Bedroom Painting</a></li>
              <li><a href="/services/kitchen-walls">Kitchen Painting</a></li>
              <li><a href="/services/trimming-baseboards">Trimming & Baseboards</a></li>
              <li><a href="/services/front-door">Front Door Painting</a></li>
              <li><a href="/services/fence-painting">Fence Painting</a></li>
            </ul>
          </div>

          {/* Service Areas */}
          <div className="footer-section">
            <h4>Service Areas</h4>
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

          {/* Contact & Social */}
          <div className="footer-section">
            <h4>Contact Us</h4>
            <ul className="footer-list">
              <li>
                <a href="tel:6473907181" className="footer-contact-link">
                  <img src="/telephone.png" alt="Phone" className="footer-contact-icon" />
                  (647) 390-7181
                </a>
              </li>
              <li>
                <a href="mailto:info@gtabudgetpainting.ca" className="footer-contact-link">
                  <img src="/mail.png" alt="Email" className="footer-contact-icon" />
                  info@gtabudgetpainting.ca
                </a>
              </li>
            </ul>
            
            <h5>Follow Us</h5>
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
                href="https://www.instagram.com/gtabudgetpainting/" 
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
          <div className="footer-bottom-content">
            <p>&copy; 2025 GTA Budget Painting. All rights reserved. | Licensed & Insured Painting Contractors</p>
            <div className="footer-keywords">
              <span>Professional Painters Toronto | Interior Painting GTA | Exterior Painting Services | Residential Painting Contractors | Commercial Painting | House Painting | Apartment Painting | Condo Painting | Office Painting | Restaurant Painting</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

