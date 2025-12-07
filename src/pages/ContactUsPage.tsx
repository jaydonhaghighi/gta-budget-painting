import React, { useState, useEffect } from 'react';
import './ContactUsPage.css';
import { db } from '../firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';

const ContactUsPage: React.FC = () => {
  useEffect(() => {
    // Scroll to quote section if hash is present
    if (window.location.hash === '#quote-section') {
      setTimeout(() => {
        const element = document.getElementById('quote-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);
  const [inqName, setInqName] = useState('');
  const [inqEmail, setInqEmail] = useState('');
  const [inqPhone, setInqPhone] = useState('');
  const [inqMessage, setInqMessage] = useState('');
  const [inqSubmitting, setInqSubmitting] = useState(false);
  const [inqSuccess, setInqSuccess] = useState<string | null>(null);
  const [inqError, setInqError] = useState<string | null>(null);

  const isInquiryValid =
    inqName.trim().length > 0 &&
    inqMessage.trim().length > 0 &&
    (inqEmail.trim().length > 0 || inqPhone.trim().length > 0);

  const handleQuickInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInqSubmitting(true);
    setInqSuccess(null);
    setInqError(null);

    try {
      if (!inqName || (!inqEmail && !inqPhone) || !inqMessage) {
        throw new Error('Please provide your name, a contact (email or phone), and a brief message.');
      }

      const inquiryId = (await addDoc(collection(db, 'inquiries'), {
        name: inqName,
        email: inqEmail || null,
        phone: inqPhone || null,
        message: inqMessage,
        source: 'contact-page-quick-form',
        createdAt: Timestamp.fromDate(new Date())
      })).id;

      // Send emails via Cloud Function
      try {
        const emailResponse = await fetch('https://us-central1-gta-budget-painting.cloudfunctions.net/sendInquiryEmails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: inqName,
            email: inqEmail || undefined,
            phone: inqPhone || undefined,
            message: inqMessage,
            inquiryId: inquiryId,
            createdAt: new Date().toISOString()
          }),
        });

        if (emailResponse.ok) {
          const emailResult = await emailResponse.json();
          console.log('Inquiry emails sent successfully:', emailResult);
        } else {
          const errorText = await emailResponse.text();
          console.error('Failed to send inquiry emails:', emailResponse.status, errorText);
        }
      } catch (emailError) {
        console.error('Error calling email function:', emailError);
        // Don't fail the submission if email fails
      }

      setInqSuccess('Thanks! We received your message and will reach out shortly.');
      setInqName('');
      setInqEmail('');
      setInqPhone('');
      setInqMessage('');
    } catch (err: any) {
      setInqError(err?.message || 'Failed to send. Please try again.');
    } finally {
      setInqSubmitting(false);
    }
  };

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
                  <div className="contact-item-icon">
                    <img src="/telephone.png" alt="Phone" />
                  </div>
                </div>
                <h3>Contact Information</h3>
              </div>
              <div className="contact-card-content">
                <div 
                  className="contact-item clickable-contact-item"
                  onClick={() => window.open('tel:6473907181', '_self')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      window.open('tel:6473907181', '_self');
                    }
                  }}
                >
                  <div className="contact-item-details">
                    <h4>Phone</h4>
                    <span className="contact-value">(647) 390-7181</span>
                    <span className="contact-action">Tap to call</span>
                  </div>
                </div>
                <div 
                  className="contact-item clickable-contact-item"
                  onClick={() => window.open('mailto:info@gtabudgetpainting.ca', '_self')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      window.open('mailto:info@gtabudgetpainting.ca', '_self');
                    }
                  }}
                >
                  <div className="contact-item-details">
                    <h4>Email</h4>
                    <span className="contact-value">info@gtabudgetpainting.ca</span>
                    <span className="contact-action">Tap to email</span>
                  </div>
                </div>
                <div className="contact-item clickable-contact-item">
                  <div className="contact-item-details">
                    <h4>Social Media</h4>
                    <div className="social-links">
                      <div 
                        className="social-link-item clickable-social-item facebook-item"
                        onClick={() => window.open('https://www.facebook.com/profile.php?id=61578315664485', '_blank', 'noopener,noreferrer')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            window.open('https://www.facebook.com/profile.php?id=61578315664485', '_blank', 'noopener,noreferrer');
                          }
                        }}
                      >
                        <img src="/facebook.png" alt="Facebook" />
                        <span>Facebook</span>
                        <span className="social-action">Visit page</span>
                      </div>
                      <div 
                        className="social-link-item clickable-social-item instagram-item"
                        onClick={() => window.open('https://www.instagram.com/gtabudgetpainting/', '_blank', 'noopener,noreferrer')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            window.open('https://www.instagram.com/gtabudgetpainting/', '_blank', 'noopener,noreferrer');
                          }
                        }}
                      >
                        <img src="/instagram.png" alt="Instagram" />
                        <span>Instagram</span>
                        <span className="social-action">Visit page</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Inquiry Card */}
            <div id="quote-section" className="contact-card">
              <div className="contact-card-header">
                <div className="contact-card-icon">
                  <div className="contact-item-icon">
                    <img src="/mail.png" alt="Quick Inquiry" />
                  </div>
                </div>
                <h3>Get a Free Quote Now!</h3>
              </div>
              <div className="contact-card-content">
                <form className="quick-inquiry-form" onSubmit={handleQuickInquirySubmit} autoComplete="on">
                  <div className="qi-row">
                    <input
                      type="text"
                      id="inq-name"
                      name="name"
                      placeholder="Your name *"
                      value={inqName}
                      onChange={(e) => setInqName(e.target.value)}
                      autoComplete="name"
                      aria-label="Your name"
                    />
                  </div>
                  <div className="qi-row qi-grid-2">
                    <input
                      type="email"
                      id="inq-email"
                      name="email"
                      placeholder="Email"
                      value={inqEmail}
                      onChange={(e) => setInqEmail(e.target.value)}
                      autoComplete="email"
                      aria-label="Email"
                    />
                    <input
                      type="tel"
                      id="inq-phone"
                      name="phone"
                      placeholder="Phone"
                      value={inqPhone}
                      onChange={(e) => setInqPhone(e.target.value)}
                      autoComplete="tel"
                      aria-label="Phone"
                    />
                  </div>
                  <div className="qi-row">
                    <textarea
                      name="message"
                      placeholder="How can we help? *"
                      rows={3}
                      value={inqMessage}
                      onChange={(e) => setInqMessage(e.target.value)}
                      aria-label="Message"
                    />
                  </div>
                  {inqError && <div className="qi-alert error">{inqError}</div>}
                  {inqSuccess && <div className="qi-alert success">{inqSuccess}</div>}
                  <button className="btn-primary" type="submit" disabled={inqSubmitting || !isInquiryValid}>
                    {inqSubmitting ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>

            {/* Our Process Card */}
            <div className="contact-card">
              <div className="contact-card-header">
                <div className="contact-card-icon">
                <div className="contact-item-icon">
                    <img src="/breakdown.png" alt="Phone" />
                  </div>
                </div>
                <h3>Our Process</h3>
              </div>
              <div className="contact-card-content">
                <div className="timeline">
                  <div className="timeline-step">
                    <div className="timeline-icon">
                      <img src="/telephone.png" alt="Contact Us" />
                    </div>
                    <div className="timeline-content">
                      <h4>Contact Us</h4>
                      <p>Call us or send a request through our website</p>
                    </div>
                  </div>
                  
                  <div className="timeline-step">
                    <div className="timeline-icon">
                      <img src="/calculator-bill.svg" alt="Professional Review" />
                    </div>
                    <div className="timeline-content">
                      <h4>Professional Review</h4>
                      <p>Our professionals review your request and give you a quote</p>
                    </div>
                  </div>
                  
                  <div className="timeline-step">
                    <div className="timeline-icon">
                      <img src="/checkout/calendar-lines.svg" alt="Schedule Service" />
                    </div>
                    <div className="timeline-content">
                      <h4>Schedule Service</h4>
                      <p>We set a date to come and complete your project</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Partnership Card */}
            <div 
              className="contact-card partnership-card clickable-card" 
              onClick={() => window.open('https://gtahomepainting.ca', '_blank', 'noopener,noreferrer')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open('https://gtahomepainting.ca', '_blank', 'noopener,noreferrer');
                }
              }}
            >
              <div className="partnership-content">
                <div className="partnership-header">
                  <div className="partnership-logo">
                    <img src="/ghp-logo.png" alt="GTA Home Painting" className="partner-icon" />
                  </div>
                  <h3>Proud Partner</h3>
                </div>
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
