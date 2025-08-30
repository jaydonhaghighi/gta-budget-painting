import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Professional Painting Services in GTA</h1>
          <p>Transform your space with our affordable, high-quality painting services. Residential and commercial projects welcome.</p>
          <div className="hero-buttons">
            <Link href="/quote" className="btn-primary">
              Get Free Quote
            </Link>
            <Link href="/services" className="btn-secondary">
              View Our Services
            </Link>
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
      <section className="services">
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
    </>
  )
}
