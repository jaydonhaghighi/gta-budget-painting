import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getServicesByCategory } from '../data/services';
import { PostalCodeVerification } from '../components/PostalCodeVerification';
import './ServicesPage.css';

const ServicesPage = () => {
  const navigate = useNavigate();
  const [showPostalVerification, setShowPostalVerification] = useState(false);
  const [pendingServiceId, setPendingServiceId] = useState<string | null>(null);


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

  // Get services by category
  const interiorServices = getServicesByCategory('interior');
  const exteriorServices = getServicesByCategory('exterior');
  const customServices = getServicesByCategory('specialty');


  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="container">
          <h1>Our Painting Services</h1>
          <p className="hero-subtitle">Professional painting services that won't break the bank. Get free instant quotes from our estimator calculators or from our licensed & insured contractors across the GTA.</p>
        </div>
      </section>

      {/* Service Categories */}
      <section className="featured-services-section">
        <div className="container">
          <h3>Choose Your Painting Category</h3>
          <p className="section-subtitle">Select the type of painting service you need to get started with your project</p>
          
          <div className="services-categories-grid">
            <div className="category-card" onClick={() => navigate('/services/interior-painting')}>
              <div className="category-icon">
              </div>
              <h4>Interior Painting</h4>
              <p>Transform your indoor spaces with professional interior painting services</p>
              <div className="category-count">{interiorServices.length} Services</div>
            </div>

            <div className="category-card" onClick={() => navigate('/services/exterior-painting')}>
              <div className="category-icon">
              </div>
              <h4>Exterior Painting</h4>
              <p>Protect and beautify your home's exterior with our expert exterior painting services</p>
              <div className="category-count">{exteriorServices.length} Services</div>
            </div>

            <div className="category-card" onClick={() => navigate('/services/custom-painting')}>
              <div className="category-icon">
              </div>
              <h4>Custom Project</h4>
              <p>Need something specific? We offer custom painting solutions tailored to your unique requirements</p>
              <div className="category-count">{customServices.length} Services</div>
            </div>
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

export default ServicesPage;
