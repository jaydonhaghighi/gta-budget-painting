import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showPromoBanner, setShowPromoBanner] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Handle hash navigation
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#company-section' || hash === '#areas-served-section') {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  // Handle hash changes when already on the page
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#company-section' || hash === '#areas-served-section') {
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
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

    </div>
  );
};

export default LandingPage;


