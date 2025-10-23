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

  // Get all services including custom project
  const allServicesList = allServices;

  const renderServiceCard = (service: typeof allServices[0], isFeatured: boolean = false) => {
    // Special handling for custom project
    if (service.id === 'custom-project') {
      return (
        <div
          key={service.id}
          className="service-card-wrapper custom-project-wrapper"
          onClick={() => handleServiceClick(service.id)}
        >
              <div className="custom-project-text">
                <h3>Service Not Here?</h3>
                <p>Tell us what you need and we'll provide a personalized quote for your custom painting project.</p>
              </div>
            </div>
      );
    }

    // Regular service cards
    return (
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
          <h1 style={{color: 'var(--color-steel-blue)'}}>Professional Painting Services in the GTA</h1>
          <p className="hero-subtitle">Expert interior and exterior painting services across the Greater Toronto Area. Licensed, insured, and trusted by hundreds of homeowners.</p>
        </div>
      </section>

      {/* All Services Section */}
      <section className="featured-services-section">
        <div className="container">
          <h3>Most Popular Services</h3>
          <p className="section-subtitle">Our complete range of painting services trusted by thousands of GTA homeowners</p>
          
          <div className="services-grid featured-grid">
            {allServicesList.map((service) => renderServiceCard(service, service.featured))}
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


