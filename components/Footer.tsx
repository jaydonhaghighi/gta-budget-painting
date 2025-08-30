export default function Footer() {
  return (
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
  )
}
