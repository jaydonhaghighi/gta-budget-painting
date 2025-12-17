import { useNavigate } from 'react-router-dom';
import { getServicesByCategory } from '../data/services';
import SEO from '../components/SEO';
import './InteriorPaintingPage.css';

const InteriorPaintingPage = () => {
  const navigate = useNavigate();

  const handleServiceClick = (serviceId: string) => {
    navigate(`/services/interior-painting/${serviceId}`);
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
      <SEO 
        title="Interior Painting Services Toronto | Rooms, Trim, Ceilings & More"
        description="Professional interior painting for single rooms, condos, and small projects. We paint kitchens, bedrooms, bathrooms, and trim. Fast service & great rates."
        canonical="/services/interior-painting"
      />
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
          
          <div className="services-grid featured-grid">
            {interiorServices.map((service) => renderServiceCard(service, service.featured))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default InteriorPaintingPage;
