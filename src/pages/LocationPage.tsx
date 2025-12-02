import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import './LocationPage.css';

const LocationPage = () => {
  const location = useLocation();
  
  // Extract city from URL path (e.g. "/painters-mississauga" -> "mississauga")
  const citySlug = location.pathname.replace('/painters-', '');
  
  // Format city name (e.g. "mississauga" -> "Mississauga", "north-york" -> "North York")
  const formattedCity = citySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="location-page">
      <SEO 
        title={`Best Painters in ${formattedCity} | Affordable & Fast | GTA Budget Painting`}
        description={`Looking for painters in ${formattedCity}? We provide affordable, high-quality residential painting for small jobs in ${formattedCity}. Get a free quote today!`}
        canonical={location.pathname}
      />

      {/* Hero Section */}
      <section className="location-hero">
        <div className="container">
          <h1>Affordable Painting Services in <span className="highlight">{formattedCity}</span></h1>
          <p className="hero-subtitle">
            Professional residential painting for homeowners in {formattedCity}. 
            Specializing in small jobs, quick turnarounds, and budget-friendly prices.
          </p>
          <div className="hero-actions">
            <Link to="/services" className="btn-primary">View Services</Link>
            <Link to="/contact-us" className="btn-secondary">Get a Quote</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us in City */}
      <section className="location-content">
        <div className="container">
          <div className="content-grid">
            <div className="text-content">
              <h2>Why {formattedCity} Homeowners Choose Us</h2>
              <p>
                Finding reliable painters in {formattedCity} shouldn't be hard or expensive. 
                At GTA Budget Painting, we focus specifically on smaller residential projects 
                that other contractors might overlook.
              </p>
              <ul className="benefits-list">
                <li><strong>Local Expertise:</strong> We know the homes and condos in {formattedCity}.</li>
                <li><strong>Budget Friendly:</strong> High quality results without the high price tag.</li>
                <li><strong>Quick Turnaround:</strong> Most jobs completed in 1-2 days.</li>
                <li><strong>No Job Too Small:</strong> Single rooms, accent walls, and touch-ups welcome.</li>
              </ul>
            </div>
            <div className="image-content">
               <img src="/partnership.png" alt={`Painters in ${formattedCity}`} className="location-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="location-services">
        <div className="container">
          <h2>Our Painting Services in {formattedCity}</h2>
          <div className="services-grid">
            <Link to="/services/interior-painting" className="service-card-preview">
              <h3>Interior Painting</h3>
              <p>Walls, ceilings, trim, and doors.</p>
            </Link>
            <Link to="/services/interior-painting/kitchen-walls" className="service-card-preview">
              <h3>Kitchens</h3>
              <p>Cabinet & wall updates.</p>
            </Link>
            <Link to="/services/interior-painting/bedroom-painting" className="service-card-preview">
              <h3>Bedrooms</h3>
              <p>Create your perfect sanctuary.</p>
            </Link>
            <Link to="/services/exterior-painting" className="service-card-preview">
              <h3>Exterior</h3>
              <p>Doors, garages, and fences.</p>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="location-cta">
        <div className="container">
          <h2>Ready to Paint Your Home in {formattedCity}?</h2>
          <p>Get a detailed estimate online or give us a call.</p>
          <a href="tel:6473907181" className="cta-phone">(647) 390-7181</a>
        </div>
      </section>
    </div>
  );
};

export default LocationPage;

