import { Link } from 'react-router-dom';
import { getServicesByCategory } from '../data/services';
import SEO from '../components/SEO';
import './ServicesPage.css';

const ServicesPage = () => {
  // Get services by category
  const interiorServices = getServicesByCategory('interior');
  const exteriorServices = getServicesByCategory('exterior');
  const customServices = getServicesByCategory('specialty');


  return (
    <div className="services-page">
      <SEO
        title="House Painting Services in Toronto & GTA | Free Quotes"
        description="Affordable interior, exterior, and custom house painting services across Toronto and the GTA. Fast turnaround, transparent pricing, and free estimates."
        canonical="/services"
      />
      {/* Hero Section */}
      <section className="all-services-hero">
        <div className="container">
          <h1>Affordable House Painting Services in Toronto & GTA</h1>
          <p className="hero-subtitle">Professional painting for small residential jobs that won't break the bank. Get free instant quotes from our estimator calculators or from our licensed & insured professionals.</p>
          <h2 className="section-subtitle">Interior, Exterior, and Custom Painting for Small Residential Jobs</h2>
        </div>
      </section>

      {/* Service Categories */}
      <section className="featured-services-section">
        <div className="container">
          <h3>Choose Your Painting Category</h3>
          <p className="section-subtitle">Select the type of painting service you need to get started with your project</p>
          
          <div className="services-categories-grid">
            <Link className="category-card" to="/services/interior-painting">
              <div className="category-icon">
              </div>
              <h4>Interior Painting</h4>
              <p>Transform your indoor spaces with professional interior painting services</p>
              <div className="category-count">{interiorServices.length} Services</div>
            </Link>

            <Link className="category-card" to="/services/exterior-painting">
              <div className="category-icon">
              </div>
              <h4>Exterior Painting</h4>
              <p>Protect and beautify your home's exterior with our expert exterior painting services</p>
              <div className="category-count">{exteriorServices.length} Services</div>
            </Link>

            <Link className="category-card" to="/services/custom-painting">
              <div className="category-icon">
              </div>
              <h4>Custom Project</h4>
              <p>Need something specific? We offer custom painting solutions tailored to your unique requirements</p>
              <div className="category-count">{customServices.length} Services</div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
