import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './LandingPage.css';
import '../pages/ContactUsPage.css';
import { db } from '../firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showPromoBanner, setShowPromoBanner] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  
  // Inquiry form state
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
        source: 'landing-page-quick-form',
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

  // Handle hash navigation with offset for fixed header
  const scrollToSection = (hash: string) => {
    const element = document.querySelector(hash);
    if (element) {
      const headerOffset = 150; // Adjust this value based on your header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Handle hash navigation
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#company-section' || hash === '#areas-served-section') {
      setTimeout(() => {
        scrollToSection(hash);
      }, 100);
    }
  }, []);

  // Handle hash changes when already on the page
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#company-section' || hash === '#areas-served-section') {
        setTimeout(() => {
          scrollToSection(hash);
        }, 100);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Scroll-triggered banner logic
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('.booking-hero');
      if (heroSection && !bannerDismissed) {
        const rect = heroSection.getBoundingClientRect();
        // Show banner when user scrolls past the hero section
        if (rect.bottom <= 0) {
          setShowPromoBanner(true);
        } else {
          setShowPromoBanner(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [bannerDismissed]);

  // Match inquiry image height to form height (desktop only)
  useEffect(() => {
    const matchInquiryHeights = () => {
      // Only match heights on desktop (width > 630px)
      if (window.innerWidth <= 630) {
        const imageContainer = document.querySelector('.inquiry-image');
        if (imageContainer) {
          (imageContainer as HTMLElement).style.height = 'auto';
        }
        return;
      }

      const formContent = document.querySelector('.inquiry-form-content');
      const imageContainer = document.querySelector('.inquiry-image');
      
      if (formContent && imageContainer) {
        const formHeight = formContent.getBoundingClientRect().height;
        if (formHeight > 0) {
          (imageContainer as HTMLElement).style.height = `${formHeight}px`;
        }
      }
    };

    // Match heights on mount and resize
    matchInquiryHeights();
    window.addEventListener('resize', matchInquiryHeights);
    
    // Also match after a short delay to account for any dynamic content
    const timeoutId = setTimeout(matchInquiryHeights, 100);
    
    return () => {
      window.removeEventListener('resize', matchInquiryHeights);
      clearTimeout(timeoutId);
    };
  }, [inqSuccess, inqError]);

  const handleBannerDismiss = () => {
    setBannerDismissed(true);
    setShowPromoBanner(false);
  };


  return (
    <div className="landing-page">
      {/* Sticky Promotion Banner */}
      <div className={`sticky-promo-banner ${showPromoBanner ? 'show' : 'hidden'}`}>
        <div className="promo-banner-content">
          <span className="promo-banner-text">
            {/* <img src="/megaphone.svg" alt="Megaphone" className="promo-banner-icon" /> */}
            Big projects deserve big savings <span className="deal-bubble">15% off $1000+ painting jobs!</span>
          </span>
          <button className="promo-banner-close" onClick={handleBannerDismiss}>×</button>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="booking-hero">
        <div className="container">
          <h1>Affordable Painting Services in the Greater Toronto Area</h1>
          <p className="hero-subtitle">Professional painting services that won't break the bank. Get free instant quotes from licensed & insured contractors across the GTA.</p>
          
          {/* Contact Info */}
          <div className="hero-contact">
            <a href="tel:6473907181" className="hero-contact-link">
              <img src="/telephone.png" alt="Phone" className="hero-contact-icon" />
              <span className="hero-contact-text">Call (647) 390-7181</span>
            </a>
            <button 
              className="hero-services-btn"
              onClick={() => navigate('/services')}
            >
              <img src="/paint-roller.svg" alt="Paint Roller" className="hero-services-icon" />
              Our Services
            </button>
          </div>
        </div>
      </section>

      {/* Company Section */}
      <section id="company-section" className="company-section">
        <div className="container">
          <div className="company-content">
            <div className="company-text">
              <div className="company-text-content">
                <h2>About GTA Budget Painting</h2>
                <p className="company-description">
                <span>GTA Budget Painting is a specialized division of <b style={{color: '#800000'}}><a href="https://gtahomepainting.ca" target="_blank" rel="noopener noreferrer">GTA Home Painting</a></b>, designed to serve homeowners who need smaller, more affordable painting projects. While larger companies often overlook smaller jobs, we're committed to providing quality painting services at budget-friendly prices for every project, no matter the size.</span>
                </p>
              </div>
              <div className="company-image">
                <img src="/partnership.png" alt="Professional painting team at work" className="company-photo" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Areas Served Section */}
      <section id="areas-served-section" className="areas-served-section">
        <div className="container">
          <div className="areas-content">
            <div className="areas-text">
              <div className="areas-text-content">
                <h2>Service Areas</h2>
                <p className="areas-description">
                  We proudly serve the entire Greater Toronto Area, bringing professional painting services to communities across the region. From downtown Toronto to the outer suburbs, our experienced team is ready to transform your space.
                </p>
                <div className="areas-list">
                  <div className="areas-column">
                    <ul>
                      <li>Vaughan</li>
                      <li>Richmond Hill</li>
                      <li>Markham</li>
                      <li>Thornhill</li>
                      <li>Woodbridge</li>
                      <li>Maple</li>
                    </ul>
                  </div>
                  <div className="areas-column">
                    <ul>
                      <li>Downtown Toronto</li>
                      <li>North York</li>
                      <li>Scarborough</li>
                      <li>Etobicoke</li>
                      <li>York</li>
                      <li>East York</li>
                    </ul>
                  </div>
                  <div className="areas-column">
                    <ul>
                      <li>Mississauga</li>
                      <li>Brampton</li>
                      <li>Oakville</li>
                      <li>Burlington</li>
                      <li>Milton</li>
                      <li>Caledon</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="areas-image">
                <img src="/bc3b5c629ebb79ac398492a345c50337.jpg" alt="Beautiful painted kitchen interior" className="areas-photo" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Inquiry Section */}
      <section id="inquiry-section" className="inquiry-section">
        <div className="container">
          <div className="inquiry-content">
            <div className="inquiry-text">
              <div className="inquiry-image">
                <img src="/f16f1bd449899777bf18714eb6cb3df3.jpg" alt="Professional painting service" className="inquiry-photo" />
              </div>
              <div className="inquiry-form-content">
                <h2>Get a Free Quote Now!</h2>
                <form className="quick-inquiry-form" onSubmit={handleQuickInquirySubmit}>
                  <div className="qi-row">
                    <input
                      type="text"
                      placeholder="Your name *"
                      value={inqName}
                      onChange={(e) => setInqName(e.target.value)}
                      aria-label="Your name"
                    />
                  </div>
                  <div className="qi-row qi-grid-2">
                    <input
                      type="email"
                      placeholder="Email"
                      value={inqEmail}
                      onChange={(e) => setInqEmail(e.target.value)}
                      aria-label="Email"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={inqPhone}
                      onChange={(e) => setInqPhone(e.target.value)}
                      aria-label="Phone"
                    />
                  </div>
                  <div className="qi-row">
                    <textarea
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
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;


