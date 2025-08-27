import './App.css'

function App() {
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <nav className="nav">
          <div className="nav-brand">
            <h2>GTA Budget Painting</h2>
          </div>
          <ul className="nav-menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1>Professional Painting Services in GTA</h1>
          <p>Transform your space with our expert painting services. Quality work, affordable prices, and exceptional customer service.</p>
          <div className="hero-buttons">
            <button className="btn-primary">Get Free Quote</button>
            <button className="btn-secondary">View Our Work</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="placeholder-image">🎨</div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="container">
          <h2>Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🏠</div>
              <h3>Residential Painting</h3>
              <p>Interior and exterior painting for homes, condos, and apartments.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🏢</div>
              <h3>Commercial Painting</h3>
              <p>Professional painting services for offices, retail spaces, and buildings.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🔧</div>
              <h3>Repairs & Prep</h3>
              <p>Drywall repair, surface preparation, and finishing work.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">✨</div>
              <h3>Specialty Finishes</h3>
              <p>Texture painting, decorative finishes, and custom color matching.</p>
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
              <div className="features">
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <div>
                    <h4>Licensed & Insured</h4>
                    <p>Fully licensed and insured for your peace of mind.</p>
                  </div>
                </div>
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <div>
                    <h4>Quality Materials</h4>
                    <p>We use only premium paints and materials for lasting results.</p>
                  </div>
                </div>
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <div>
                    <h4>Affordable Pricing</h4>
                    <p>Competitive rates without compromising on quality.</p>
                  </div>
                </div>
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <div>
                    <h4>Free Estimates</h4>
                    <p>Get a detailed quote at no cost or obligation.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="about-image">
              <div className="placeholder-image">👷‍♂️</div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="gallery">
        <div className="container">
          <h2>Our Recent Work</h2>
          <div className="gallery-grid">
            <div className="gallery-item">
              <div className="placeholder-image">🏠</div>
              <p>Residential Interior</p>
            </div>
            <div className="gallery-item">
              <div className="placeholder-image">🏢</div>
              <p>Commercial Exterior</p>
            </div>
            <div className="gallery-item">
              <div className="placeholder-image">🎨</div>
              <p>Decorative Finish</p>
            </div>
            <div className="gallery-item">
              <div className="placeholder-image">🚪</div>
              <p>Cabinet Refinishing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2>Get Your Free Quote Today</h2>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <h4>Phone</h4>
                  <p>(416) 123-4567</p>
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
            <form className="contact-form">
              <div className="form-group">
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Your Email" required />
              </div>
              <div className="form-group">
                <input type="tel" placeholder="Phone Number" />
              </div>
              <div className="form-group">
                <select required>
                  <option value="">Select Service</option>
                  <option value="residential">Residential Painting</option>
                  <option value="commercial">Commercial Painting</option>
                  <option value="repairs">Repairs & Prep</option>
                  <option value="specialty">Specialty Finishes</option>
                </select>
              </div>
              <div className="form-group">
                <textarea placeholder="Project Details" rows={4}></textarea>
              </div>
              <button type="submit" className="btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>GTA Budget Painting</h3>
              <p>Professional painting services across the Greater Toronto Area.</p>
            </div>
            <div className="footer-section">
              <h4>Services</h4>
              <ul>
                <li>Residential Painting</li>
                <li>Commercial Painting</li>
                <li>Repairs & Prep</li>
                <li>Specialty Finishes</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Phone: (416) 123-4567</p>
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
