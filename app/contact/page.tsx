export default function ContactPage() {
  return (
    <section className="contact">
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
  )
}
