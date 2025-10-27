import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getServicesByCategory } from '../data/services';
import { PostalCodeVerification, isPostalCodeVerified } from '../components/PostalCodeVerification';
import './ExteriorPaintingPage.css';

const ExteriorPaintingPage = () => {
  const navigate = useNavigate();
  const [showPostalVerification, setShowPostalVerification] = useState(false);
  const [pendingServiceId, setPendingServiceId] = useState<string | null>(null);

  const handleServiceClick = (serviceId: string) => {
    // Check if user is already verified
    if (isPostalCodeVerified()) {
      navigate(`/services/exterior-painting/${serviceId}`);
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
      navigate(`/services/exterior-painting/${pendingServiceId}`);
    }
    setPendingServiceId(null);
  };

  // Get exterior services
  const exteriorServices = getServicesByCategory('exterior');

  const renderServiceCard = (service: typeof exteriorServices[0], isFeatured: boolean = false) => {
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
    <div className="exterior-painting-page">
      {/* Hero Section */}
      <section className="exterior-painting-hero">
        <div className="container">
          <h1>Exterior Painting Services</h1>
          <p className="hero-subtitle">Protect and beautify your home's exterior with our expert exterior painting services. Get free instant quotes from our estimator calculators.</p>
        </div>
      </section>

      {/* Exterior Services Section */}
      <section className="featured-services-section">
        <div className="container">
          <h3>Exterior Painting Services</h3>
          <p className="section-subtitle">Professional exterior painting services to protect and enhance your home's outdoor spaces</p>
          
          <div className="services-grid featured-grid">
            {exteriorServices.map((service) => renderServiceCard(service, service.featured))}
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

export default ExteriorPaintingPage;
