import React from 'react';
import './ContactUsPage.css';

const ContactUsPage: React.FC = () => {
  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="booking-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p className="hero-subtitle">Get in touch with our team for your painting needs</p>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section className="contact-cards-section">
        <div className="container">
          <div className="contact-cards-grid">
            
            {/* Contact Information Card */}
            <div className="contact-card">
              <div className="contact-card-header">
                <div className="contact-card-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9844 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3767 21.9119 20.0964 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90358 2.12887 3.62328 2.21949 3.35931C2.31012 3.09534 2.45554 2.85314 2.64573 2.64791C2.83591 2.44268 3.06706 2.27907 3.32404 2.16751C3.58102 2.05595 3.85833 1.99902 4.13999 2H7.13999C7.59531 1.99522 8.03537 2.16708 8.37191 2.48353C8.70845 2.79999 8.92563 3.23945 8.97999 3.72C9.10199 4.68007 9.36028 5.62273 9.74999 6.52C9.84454 6.74489 9.87679 6.99054 9.84364 7.23109C9.81049 7.47164 9.71324 7.69842 9.56249 7.89L8.39249 9.42C9.45699 11.3705 11.1295 13.043 13.08 14.1075L14.61 12.9375C14.8016 12.7868 15.0284 12.6895 15.2689 12.6564C15.5094 12.6232 15.7551 12.6555 15.98 12.75C16.8773 13.1397 17.82 13.398 18.78 13.52C19.2605 13.5744 19.6999 13.7916 20.0164 14.1281C20.3328 14.4647 20.5047 14.9047 20.5 15.36V18.36C20.5 18.64 20.5 18.92 20.5 19.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Contact Information</h3>
              </div>
              <div className="contact-card-content">
                <div className="contact-item">
                  <div className="contact-item-icon">
                    <img src="/telephone.png" alt="Phone" />
                  </div>
                  <div className="contact-item-details">
                    <h4>Phone</h4>
                    <a href="tel:6473907181">(647) 390-7181</a>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-item-icon">
                    <img src="/mail.png" alt="Email" />
                  </div>
                  <div className="contact-item-details">
                    <h4>Email</h4>
                    <a href="mailto:info@gtabudgetpainting.ca">info@gtabudgetpainting.ca</a>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-item-icon">
                    <img src="/instagram.png" alt="Social Media" />
                  </div>
                  <div className="contact-item-details">
                    <h4>Social Media</h4>
                    <div className="social-links">
                      <a href="https://www.facebook.com/profile.php?id=61578315664485" target="_blank" rel="noopener noreferrer">
                        <img src="/facebook.png" alt="Facebook" />
                        Facebook
                      </a>
                      <a href="https://www.instagram.com/gtabudgetpainting/" target="_blank" rel="noopener noreferrer">
                        <img src="/instagram.png" alt="Instagram" />
                        Instagram
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Process Card */}
            <div className="contact-card">
              <div className="contact-card-header">
                <div className="contact-card-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 18 21H17ZM17 21V10H13V6H7V19H17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Our Process</h3>
              </div>
              <div className="contact-card-content">
                <div className="process-step">
                  <div className="process-number">1</div>
                  <div className="process-details">
                    <h4>Contact Us</h4>
                    <p>Call us or send a request through our website</p>
                  </div>
                </div>
                <div className="process-step">
                  <div className="process-number">2</div>
                  <div className="process-details">
                    <h4>Professional Review</h4>
                    <p>Our professionals review your request and give you a quote</p>
                  </div>
                </div>
                <div className="process-step">
                  <div className="process-number">3</div>
                  <div className="process-details">
                    <h4>Schedule Service</h4>
                    <p>We set a date to come and complete your project</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Partnership Card */}
            <div className="contact-card">
              <div className="contact-card-header">
                <div className="contact-card-icon">
                  <img src="/ghp-logo.png" alt="GTA Home Painting" className="partner-icon" />
                </div>
                <h3>Proud Partner</h3>
              </div>
              <div className="contact-card-content">
                <div className="partnership-info">
                  <h4>GTA Home Painting</h4>
                  <p>We are proud to be partnered with GTA Home Painting, bringing you professional painting services across the Greater Toronto Area.</p>
                  <div className="partnership-features">
                    <div className="partnership-feature">
                      <span className="checkmark">✓</span>
                      <span>Licensed & Insured</span>
                    </div>
                    <div className="partnership-feature">
                      <span className="checkmark">✓</span>
                      <span>Professional Quality</span>
                    </div>
                    <div className="partnership-feature">
                      <span className="checkmark">✓</span>
                      <span>Free Quotes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;
