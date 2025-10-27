import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getServicesByCategory } from '../data/services';
import { PostalCodeVerification, isPostalCodeVerified } from '../components/PostalCodeVerification';
import './InteriorPaintingPage.css';

const InteriorPaintingPage = () => {
  const navigate = useNavigate();
  const [showPostalVerification, setShowPostalVerification] = useState(false);
  const [pendingServiceId, setPendingServiceId] = useState<string | null>(null);

  const handleServiceClick = (serviceId: string) => {
    // Check if user is already verified
    if (isPostalCodeVerified()) {
      navigate(`/services/interior-painting/${serviceId}`);
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
      navigate(`/services/interior-painting/${pendingServiceId}`);
    }
    setPendingServiceId(null);
  };

  // Get interior services
  const interiorServices = getServicesByCategory('interior');

  const renderServiceCard = (service: typeof interiorServices[0], isFeatured: boolean = false) => {
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
    <div className="interior-painting-page">
      {/* Hero Section */}
      <section className="interior-painting-hero">
        <div className="container">
          <h1>Interior Painting Services</h1>
          <p className="hero-subtitle">Transform your indoor spaces with professional interior painting services. Get free instant quotes from our estimator calculators.</p>
        </div>
      </section>

      {/* Interior Services Section */}
      <section className="featured-services-section">
        <div className="container">
          <h3>Interior Painting Services</h3>
          <p className="section-subtitle">Professional interior painting services to transform your home's indoor spaces</p>
          
          <div className="services-grid featured-grid">
            {interiorServices.map((service) => renderServiceCard(service, service.featured))}
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

export default InteriorPaintingPage;
