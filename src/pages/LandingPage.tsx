import { useNavigate } from 'react-router-dom';
import { allServices } from '../data/services';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleServiceClick = (serviceId: string) => {
    navigate(`/services/${serviceId}`);
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="booking-hero">
        <div className="container">
          <h1 style={{color: 'white'}}>Book Your Painting Service</h1>
          <p className="hero-subtitle">Professional painting services in the GTA • 24/7 Emergency Available</p>
          <div className="hero-features">
            <div className="hero-feature">
              <span className="hero-icon">⚡</span>
              <span>Fast Response</span>
            </div>
            <div className="hero-feature">
              <span className="hero-icon">💰</span>
              <span>Fair Pricing</span>
            </div>
            <div className="hero-feature">
              <span className="hero-icon">✅</span>
              <span>Quality Guaranteed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Service Selection */}
      <section className="service-selection-section">
        <div className="container">
          <h2>What service do you need?</h2>
          <p className="section-subtitle">Select a service to get started with your free quote</p>
          
          <div className="services-grid">
            {allServices.map((service) => (
              <div
                key={service.id}
                className="service-card"
                onClick={() => handleServiceClick(service.id)}
              >
                <span className="service-icon">{service.icon}</span>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                {service.type === 'flat-rate' && service.flatRate && (
                  <div className="service-price">Starting at ${service.flatRate}</div>
                )}
                {service.type === 'calculated' && (
                  <div className="service-badge">Instant Estimate</div>
                )}
                {service.type === 'custom-quote' && (
                  <div className="service-badge">Custom Quote</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

