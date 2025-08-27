import './App.css'

function App() {
  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <h2>GTA Budget Painting</h2>
          </div>
          <nav className="nav">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1>Professional Painting Services in GTA</h1>
          <p>Transform your space with our affordable, high-quality painting services. Residential and commercial projects welcome.</p>
          <div className="hero-buttons">
            <button className="btn-primary">Get Free Quote</button>
            <button className="btn-secondary">View Our Work</button>
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
      <section id="services" className="services">
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
      <section id="about" className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Why Choose GTA Budget Painting?</h2>
              <p>With over 10 years of experience serving the Greater Toronto Area, we've built our reputation on delivering exceptional painting services at affordable prices.</p>
              <div className="about-stats">
                <div className="stat">
                  <h3>500+</h3>
                  <p>Projects Completed</p>
                </div>
                <div className="stat">
                  <h3>10+</h3>
                  <p>Years Experience</p>
                </div>
                <div className="stat">
                  <h3>100%</h3>
                  <p>Satisfaction Rate</p>
                </div>
              </div>
            </div>
            <div className="about-features">
              <div className="about-feature">
                <span className="feature-icon">✓</span>
                <div>
                  <h4>Licensed & Insured</h4>
                  <p>Fully licensed and insured for your peace of mind</p>
                </div>
              </div>
              <div className="about-feature">
                <span className="feature-icon">✓</span>
                <div>
                  <h4>Quality Materials</h4>
                  <p>We use only premium paints and materials</p>
                </div>
              </div>
              <div className="about-feature">
                <span className="feature-icon">✓</span>
                <div>
                  <h4>Clean Work</h4>
                  <p>Meticulous cleanup after every project</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
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
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 GTA Budget Painting. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
