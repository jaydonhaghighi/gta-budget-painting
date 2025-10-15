import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { allServices } from '../data/services';
import { PostalCodeVerification, isPostalCodeVerified } from '../components/PostalCodeVerification';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showPostalVerification, setShowPostalVerification] = useState(false);
  const [showPromoBanner, setShowPromoBanner] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [pendingServiceId, setPendingServiceId] = useState<string | null>(null);

  // Scroll-triggered banner logic
  useEffect(() => {
    const handleScroll = () => {
      const featuredSection = document.querySelector('.featured-services-section');
      if (featuredSection && !bannerDismissed) {
        const rect = featuredSection.getBoundingClientRect();
        // Show banner when the top of the featured services section hits the top of viewport
        if (rect.top <= 0) {
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

  const handleServiceClick = (serviceId: string) => {
    // Check if user is already verified
    if (isPostalCodeVerified()) {
      navigate(`/services/${serviceId}`);
    } else {
      // Show verification popup
      setPendingServiceId(serviceId);
      setShowPostalVerification(true);
    }
  };

  const handlePostalVerificationClose = () => {
    setShowPostalVerification(false);
    setPendingServiceId(null);
  };

  const handlePostalVerificationSuccess = () => {
    setShowPostalVerification(false);
    if (pendingServiceId) {
      navigate(`/services/${pendingServiceId}`);
    }
    setPendingServiceId(null);
  };

  // Separate featured and other services
  const featuredServices = allServices.filter(s => s.featured);
  const customProject = allServices.find(s => s.id === 'custom-project');
  const otherServices = allServices.filter(s => !s.featured && s.id !== 'custom-project');

  const renderServiceCard = (service: typeof allServices[0], isFeatured: boolean = false) => (
    <div
      key={service.id}
      className={`service-card ${isFeatured ? 'featured-card' : ''}`}
      onClick={() => handleServiceClick(service.id)}
      style={service.backgroundImage ? {
        '--bg-image': `url(${service.backgroundImage})`
      } as React.CSSProperties : {}}
    >
      <span className="service-icon">{service.icon}</span>
      <h3>{service.name}</h3>
      <p>{service.description}</p>
      {service.type === 'flat-rate' && service.flatRate && (
        <div className="service-price">
          Starting at ${service.flatRate}
          {service.flatRate >= 1000 && (
            <span className="discount-badge">SAVE 15%</span>
          )}
        </div>
      )}
      {service.type === 'calculated' && (
        <div className="service-badge">Instant Estimate</div>
      )}
      {service.type === 'custom-quote' && (
        <div className="service-badge">Custom Quote</div>
      )}
    </div>
  );

  return (
    <div className="landing-page">
      {/* Sticky Promotion Banner */}
      <div className={`sticky-promo-banner ${showPromoBanner ? 'show' : 'hidden'}`}>
        <div className="promo-banner-content">
          <span className="promo-banner-text">
            <img src="/megaphone.svg" alt="Megaphone" className="promo-banner-icon" />
            Big projects deserve big savings <span className="deal-bubble">15% off $1000+ painting jobs!</span>
          </span>
          <button className="promo-banner-close" onClick={handleBannerDismiss}>×</button>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="booking-hero">
        <div className="container">

          <h1 style={{color: 'white'}}>Budget Painting Services in the GTA</h1>
          <p className="hero-subtitle">We paint your home like it’s our own — with quality work that fits your budget</p>
          
          {/* Hero Features */}
          <div className="hero-features">
            <div className="hero-feature">
              <img src="/money-bag.png" alt="Money" className="hero-icon" />
              <span>Best Prices</span>
            </div>
            <div className="hero-feature">
              <img src="/star.png" alt="Star" className="hero-icon" />
              <span>5-Star Rated</span>
            </div>
            <div className="hero-feature">
              <img src="/security.png" alt="Security" className="hero-icon" />
              <span>Fully Insured</span>
            </div>
          </div>
          
          <div className="hero-contact">
            <div className="hero-contact-info">
              <a href="tel:6473907181" className="hero-phone">
                <img src="/telephone.png" alt="Phone" className="hero-icon" />
                Call (647) 390-7181
              </a>
              <span className="hero-divider">|</span>
              <a href="mailto:info@gtabudgetpainting.com" className="hero-email">
                <img src="/mail.png" alt="Email" className="hero-icon" />
                info@gtabudgetpainting.com
              </a>
            </div>
            <a 
              href="https://gtahomepainting.ca" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hero-cta-button"
            >
              For Larger Jobs: Visit GTA Home Painting
            </a>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="featured-services-section">
        <div className="container">
          <h2>Most Popular Services</h2>
          <p className="section-subtitle">Our best-selling services trusted by thousands of GTA homeowners</p>
          
          <div className="services-grid featured-grid">
            {featuredServices.map((service) => renderServiceCard(service, true))}
          </div>
        </div>
      </section>

      {/* All Services Section */}
      <section className="all-services-section">
        <div className="container">
          <h2>All Services</h2>
          <p className="section-subtitle">Browse our complete range of painting services</p>
          
          <div className="services-grid">
            {otherServices.map((service) => renderServiceCard(service, false))}
            
            {/* Custom Project Card - Full Width */}
            {customProject && (
              <div
                className="service-card custom-project-card"
                onClick={() => handleServiceClick('custom-project')}
                style={customProject.backgroundImage ? {
                  '--bg-image': `url(${customProject.backgroundImage})`
                } as React.CSSProperties : {}}
              >
                <span className="service-icon">{customProject.icon}</span>
                <h3>{customProject.name}</h3>
                <p>{customProject.description}</p>
                <div className="service-badge">Custom Quote</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Postal Code Verification Modal */}
      <PostalCodeVerification
        isOpen={showPostalVerification}
        onClose={handlePostalVerificationClose}
        onVerified={handlePostalVerificationSuccess}
      />
    </div>
  );
};

export default LandingPage;


