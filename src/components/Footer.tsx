import '../App.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section footer-about">
            <h3>GTA Budget Painting</h3>
            <p>Your trusted painting professionals in the Greater Toronto Area.</p>
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

          {/* Service Areas */}
          <div className="footer-section">
            <h4>Service Areas</h4>
            <ul className="footer-list">
              <li>Toronto</li>
              <li>Mississauga</li>
              <li>Brampton</li>
              <li>Markham</li>
              <li>Vaughan</li>
            </ul>
          </div>

          {/* Contact */}
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
                <a href="mailto:info@gtabudgetpainting.com" className="footer-contact-link">
                  <img src="/mail.png" alt="Email" className="footer-contact-icon" />
                  info@gtabudgetpainting.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
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
          <p>&copy; 2025 GTA Budget Painting. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

