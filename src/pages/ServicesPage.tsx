import { Link } from 'react-router-dom';
import { getServicesByCategory } from '../data/services';
import SEO from '../components/SEO';
import './ServicesPage.css';

const ServicesPage = () => {
  const interiorServices = getServicesByCategory('interior');
  const exteriorServices = getServicesByCategory('exterior');
  const customServices = getServicesByCategory('specialty');

  const categories = [
    {
      title: 'Interior Painting',
      subtitle: 'Calm, polished spaces with meticulous prep and clean finishing.',
      to: '/services/interior-painting',
      image: '/services/bedroom/bedroom.jpeg',
      services: interiorServices,
    },
    {
      title: 'Exterior Painting',
      subtitle: 'Durable, weather-ready painting that elevates curb appeal.',
      to: '/services/exterior-painting',
      image: '/services/front-door/front-door.jpeg',
      services: exteriorServices,
    },
    {
      title: 'Custom Projects',
      subtitle: 'Tailored painting solutions for unique layouts and design goals.',
      to: '/services/custom-painting',
      image: '/gallery/gbp-work-10-process.jpeg',
      services: customServices,
    },
  ];

  return (
    <div className="services-page">
      <SEO
        title="House Painting Services in Toronto & GTA | Free Quotes"
        description="Professional interior, exterior, and custom home painting services across Toronto and the GTA. Clean execution, reliable scheduling, and transparent pricing."
        canonical="/services"
      />

      <section className="sp-hero">
        <div className="container">
          <p className="sp-eyebrow">Services Designed for Modern Homeowners</p>
          <h1>Choose the painting service that fits your home and timeline.</h1>
          <p className="sp-hero-subtitle">
            From single-room refreshes to full exterior updates, we deliver calm communication, careful prep, and beautiful results.
          </p>
          <div className="sp-hero-actions">
            <Link to="/contact-us#quote-section" className="btn-primary">
              Request a Quote
            </Link>
            <a href="tel:+16476758101" className="btn-secondary">
              Call 647-675-8101
            </a>
          </div>
        </div>
      </section>

      <section className="sp-categories" aria-label="Service categories">
        <div className="container">
          <div className="sp-heading">
            <p className="sp-eyebrow">Service Categories</p>
            <h2>Explore by project type.</h2>
          </div>

          <div className="sp-category-grid">
            {categories.map((category) => (
              <article key={category.title} className="sp-category-card">
                <img src={category.image} alt={`${category.title} example project`} loading="lazy" />
                <div className="sp-card-content">
                  <h3>{category.title}</h3>
                  <p>{category.subtitle}</p>

                  <div className="sp-card-meta">
                    <span className="sp-service-count">{category.services.length} services</span>
                    <div className="sp-service-tags" aria-label={`${category.title} examples`}>
                      {category.services.slice(0, 3).map((service) => (
                        <span key={service.id}>{service.name}</span>
                      ))}
                    </div>
                  </div>

                  <Link to={category.to} className="sp-card-link">
                    View {category.title}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sp-pillars">
        <div className="container sp-pillars-grid">
          <article>
            <h3>Clean Work Standards</h3>
            <p>Protective prep, tidy execution, and daily cleanup that respects your home.</p>
          </article>
          <article>
            <h3>Clear Communication</h3>
            <p>Transparent estimates, clear timelines, and straightforward next steps.</p>
          </article>
          <article>
            <h3>Reliable Craftsmanship</h3>
            <p>Professional painters focused on smooth coverage and lasting finishes.</p>
          </article>
        </div>
      </section>

      <section className="sp-process">
        <div className="container">
          <div className="sp-heading">
            <p className="sp-eyebrow">How It Works</p>
            <h2>A simple path to your quote.</h2>
          </div>

          <ol className="sp-steps">
            <li>
              <span>1</span>
              <p>Choose your service category</p>
            </li>
            <li>
              <span>2</span>
              <p>Complete details for a clear estimate</p>
            </li>
            <li>
              <span>3</span>
              <p>Book and schedule with confidence</p>
            </li>
          </ol>

          <div className="sp-final-cta">
            <Link to="/contact-us#quote-section" className="btn-primary">
              Start Your Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
