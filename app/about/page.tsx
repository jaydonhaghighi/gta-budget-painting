import Link from 'next/link'

export default function AboutPage() {
  return (
    <section className="about">
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
          <Link href="/quote" className="btn-book-now">
            Book Your Painter Now
          </Link>
        </div>
      </div>
    </section>
  )
}
