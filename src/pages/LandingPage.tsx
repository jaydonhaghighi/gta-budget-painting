import { useNavigate } from 'react-router-dom';
import { allServices } from '../data/services';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleServiceClick = (serviceId: string) => {
    navigate(`/services/${serviceId}`);
  };

  // Separate featured and other services
  const featuredServices = allServices.filter(s => s.featured);
  const customProject = allServices.find(s => s.id === 'custom-project');
  const otherServices = allServices.filter(s => !s.featured && s.id !== 'custom-project');

  const getBadgeLabel = (badge?: string) => {
    switch (badge) {
      case 'most-popular': return '⭐ Most Popular';
      case 'trending': return '🔥 Trending';
      case 'quick-refresh': return '⚡ Quick Refresh';
      case 'high-value': return '💎 Best Value';
      default: return null;
    }
  };

  const renderServiceCard = (service: typeof allServices[0], isFeatured: boolean = false) => (
    <div
      key={service.id}
      className={`service-card ${isFeatured ? 'featured-card' : ''}`}
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
  );

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="booking-hero">
        <div className="container">
          <h1 style={{color: 'white'}}>Budget Painting Services in the GTA</h1>
          <p className="hero-subtitle">Fast, Affordable, Professional • Quick Jobs & Budget-Friendly Prices</p>
          <div className="hero-features">
            <div className="hero-feature">
              <span className="hero-icon">⚡</span>
              <span>Fast Response</span>
            </div>
            <div className="hero-feature">
              <span className="hero-icon">💰</span>
              <span>Budget-Friendly</span>
            </div>
            <div className="hero-feature">
              <span className="hero-icon">✅</span>
              <span>Quality Work</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="featured-services-section">
        <div className="container">
          <h2>🏆 Most Popular Services</h2>
          <p className="section-subtitle">Our best-selling services trusted by thousands of GTA homeowners</p>
          
          <div className="featured-grid-wrapper">
            <div className="services-grid featured-grid">
              {featuredServices.map((service) => renderServiceCard(service, true))}
            </div>
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
    </div>
  );
};

export default LandingPage;


