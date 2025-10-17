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
      className="service-card-wrapper"
      onClick={() => handleServiceClick(service.id)}
    >
      <div
        className={`service-card ${isFeatured ? 'featured-card' : ''}`}
        style={service.backgroundImage ? {
          '--bg-image': `url(${service.backgroundImage})`
        } as React.CSSProperties : {}}
      >
        <span className="service-icon">{service.icon}</span>
      </div>
      <h3 className="service-card-title">{service.name}</h3>
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

          <h1 style={{color: 'var(--color-steel-blue)'}}>Budget Painting Services in the GTA</h1>
          <p className="hero-subtitle">We paint your home like it's our own — with quality work that fits your budget</p>
          
          {/* Social Proof */}
          <div className="hero-social-proof">
            <div className="proof-item">
              <img src="/money-bag.png" alt="Budget Friendly" className="proof-icon" />
              <span className="proof-label">Budget Friendly</span>
            </div>
            <div className="proof-divider">•</div>
            <div className="proof-item">
              <img src="/labour-time.png" alt="Quick Turnaround" className="proof-icon" />
              <span className="proof-label">Quick Turnaround</span>
            </div>
            <div className="proof-divider">•</div>
            <div className="proof-item">
              <img src="/star.png" alt="5 Star Rated" className="proof-icon" />
              <span className="proof-label">5★ Rated Service</span>
            </div>
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
                className="service-card-wrapper custom-project-wrapper"
                onClick={() => handleServiceClick('custom-project')}
              >
                <div
                  className="service-card custom-project-card"
                  style={customProject.backgroundImage ? {
                    '--bg-image': `url(${customProject.backgroundImage})`
                  } as React.CSSProperties : {}}
                >
                  <div className="custom-project-content">
                    <span className="service-icon">{customProject.icon}</span>
                    <div className="custom-project-text">
                      <h3>{customProject.name}</h3>
                      <p>Have a unique project in mind? Get a personalized quote for your custom painting needs.</p>
                    </div>
                  </div>
                </div>
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


