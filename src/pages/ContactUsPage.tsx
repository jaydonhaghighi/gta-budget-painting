import { useEffect, useState, type FormEvent } from 'react';
import './ContactUsPage.css';
import { db } from '../firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import SEO from '../components/SEO';
import { trackInquirySubmitted, trackPhoneClick } from '../utils/analytics';

const ContactUsPage = () => {
  const [inqName, setInqName] = useState('');
  const [inqEmail, setInqEmail] = useState('');
  const [inqPhone, setInqPhone] = useState('');
  const [inqMessage, setInqMessage] = useState('');
  const [inqSubmitting, setInqSubmitting] = useState(false);
  const [inqSuccess, setInqSuccess] = useState<string | null>(null);
  const [inqError, setInqError] = useState<string | null>(null);

  useEffect(() => {
    const getQuoteSectionOffset = () => {
      if (window.innerWidth <= 540) return 100;
      if (window.innerWidth <= 768) return 108;
      if (window.innerWidth <= 1024) return 116;
      return 126;
    };

    const scrollToQuote = () => {
      if (window.location.hash !== '#quote-section') return;
      window.setTimeout(() => {
        const element = document.getElementById('quote-section');
        if (element) {
          const targetY =
            element.getBoundingClientRect().top +
            window.scrollY -
            getQuoteSectionOffset();

          window.scrollTo({
            top: Math.max(0, targetY),
            behavior: 'smooth',
          });
        }
      }, 120);
    };

    scrollToQuote();
    window.addEventListener('hashchange', scrollToQuote);
    return () => window.removeEventListener('hashchange', scrollToQuote);
  }, []);

  const isInquiryValid =
    inqName.trim().length > 0 &&
    inqMessage.trim().length > 0 &&
    (inqEmail.trim().length > 0 || inqPhone.trim().length > 0);

  const handleQuickInquirySubmit = async (event: FormEvent) => {
    event.preventDefault();
    setInqSubmitting(true);
    setInqSuccess(null);
    setInqError(null);

    try {
      if (!inqName || (!inqEmail && !inqPhone) || !inqMessage) {
        throw new Error('Please provide your name, contact info, and project details.');
      }

      const inquiryId = (
        await addDoc(collection(db, 'inquiries'), {
          name: inqName,
          email: inqEmail || null,
          phone: inqPhone || null,
          message: inqMessage,
          source: 'contact-page-quick-form',
          createdAt: Timestamp.fromDate(new Date()),
        })
      ).id;

      try {
        await fetch('https://us-central1-gta-budget-painting.cloudfunctions.net/sendInquiryEmails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: inqName,
            email: inqEmail || undefined,
            phone: inqPhone || undefined,
            message: inqMessage,
            inquiryId,
            createdAt: new Date().toISOString(),
          }),
        });
      } catch {
        // Firestore write is primary; email relay can fail silently.
      }

      trackInquirySubmitted({
        form_source: 'contact-page-quick-form',
        has_email: inqEmail.trim().length > 0,
        has_phone: inqPhone.trim().length > 0,
      });

      setInqSuccess('Thanks. Your request is in and we’ll follow up shortly.');
      setInqName('');
      setInqEmail('');
      setInqPhone('');
      setInqMessage('');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to send your request. Please try again.';
      setInqError(message);
    } finally {
      setInqSubmitting(false);
    }
  };

  const handlePhoneClick = () => {
    trackPhoneClick({ location: 'other' });
  };

  return (
    <div className="contact-page">
      <SEO
        title="Contact GTA Budget Painting | Fast Quotes in Toronto & GTA"
        description="Request a home painting quote across Toronto and the GTA. Clean work, reliable scheduling, and professional residential painting service."
        canonical="/contact-us"
      />

      <section className="cu-hero">
        <div className="container">
          <p className="cu-eyebrow">Contact & Quotes</p>
          <h1>Tell us about your project and we’ll guide the next step.</h1>
          <p>
            We keep the process simple: clear communication, practical recommendations, and a quote you can trust.
          </p>
          <div className="cu-hero-actions">
            <a href="tel:+16476758101" className="btn-secondary" onClick={handlePhoneClick}>
              Call 647-675-8101
            </a>
          </div>
        </div>
      </section>

      <section className="cu-info-strip">
        <div className="container cu-info-grid">
          <article>
            <h3>Phone</h3>
            <a href="tel:+16476758101" onClick={handlePhoneClick}>
              +1 647 675-8101
            </a>
          </article>
          <article>
            <h3>Email</h3>
            <a href="mailto:info@gtabudgetpainting.ca">info@gtabudgetpainting.ca</a>
          </article>
          <article>
            <h3>Hours</h3>
            <p>Monday - Sunday, 8:00 AM - 8:00 PM</p>
          </article>
          <article>
            <h3>Social</h3>
            <div className="cu-social-links">
              <a href="https://www.instagram.com/gtabudgetpainting/" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href="https://www.facebook.com/profile.php?id=61578315664485" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="cu-main">
        <div className="container cu-main-grid">
          <article id="quote-section" className="cu-card cu-form-card">
            <p className="cu-eyebrow">Quote Form</p>
            <h2>Get your free quote</h2>
            <p className="cu-card-subtitle">Share basic project details and your preferred contact method.</p>

            <form className="cu-form" onSubmit={handleQuickInquirySubmit} autoComplete="on">
              <label htmlFor="inq-name">Name *</label>
              <input
                type="text"
                id="inq-name"
                name="name"
                placeholder="Your full name"
                value={inqName}
                onChange={(event) => setInqName(event.target.value)}
                autoComplete="name"
              />

              <div className="cu-form-grid">
                <div>
                  <label htmlFor="inq-email">Email</label>
                  <input
                    type="email"
                    id="inq-email"
                    name="email"
                    placeholder="you@example.com"
                    value={inqEmail}
                    onChange={(event) => setInqEmail(event.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label htmlFor="inq-phone">Phone</label>
                  <input
                    type="tel"
                    id="inq-phone"
                    name="phone"
                    placeholder="(647) 000-0000"
                    value={inqPhone}
                    onChange={(event) => setInqPhone(event.target.value)}
                    autoComplete="tel"
                  />
                </div>
              </div>

              <label htmlFor="inq-message">Project details *</label>
              <textarea
                id="inq-message"
                name="message"
                placeholder="Rooms, surfaces, desired timing, and anything we should know"
                rows={4}
                value={inqMessage}
                onChange={(event) => setInqMessage(event.target.value)}
              />

              {inqError && <p className="cu-alert cu-error">{inqError}</p>}
              {inqSuccess && <p className="cu-alert cu-success">{inqSuccess}</p>}

              <button className="btn-primary" type="submit" disabled={inqSubmitting || !isInquiryValid}>
                {inqSubmitting ? 'Sending...' : 'Send Request'}
              </button>
            </form>
          </article>

          <article className="cu-card">
            <p className="cu-eyebrow">Process</p>
            <h2>What happens next</h2>

            <ol className="cu-steps">
              <li>
                <span>1</span>
                <div>
                  <h3>We review your request</h3>
                  <p>We confirm scope and ask clarifying questions if needed.</p>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <h3>You receive a clear quote</h3>
                  <p>Transparent pricing, straightforward options, no pressure.</p>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <h3>We schedule your project</h3>
                  <p>Convenient timing with clean execution and careful finishing.</p>
                </div>
              </li>
            </ol>

            <div className="cu-partner-card">
              <img src="/ghp-logo.png" alt="GTA Home Painting logo" />
              <div>
                <h3>Proud Partner of GTA Home Painting</h3>
                <p>Professional standards, insured teams, and trusted service across the GTA.</p>
                <a href="https://gtahomepainting.ca" target="_blank" rel="noopener noreferrer">
                  Visit GTA Home Painting
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;
