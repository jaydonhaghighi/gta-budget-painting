import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { getServicesByCategory } from '../data/services';
import SEO from '../components/SEO';
import { trackPhoneClick, trackServiceCategoryView } from '../utils/analytics';
import './InteriorPaintingPage.css';

const serviceTypeLabel: Record<'calculated' | 'flat-rate' | 'custom-quote', string> = {
  calculated: 'Instant Estimator',
  'flat-rate': 'Flat-Rate Service',
  'custom-quote': 'Custom Quote',
};

const InteriorPaintingPage = () => {
  const interiorServices = useMemo(() => getServicesByCategory('interior'), []);

  const [scrollY, setScrollY] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    trackServiceCategoryView('interior');
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleMediaQueryChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    handleMediaQueryChange();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaQueryChange);
      return () => mediaQuery.removeEventListener('change', handleMediaQueryChange);
    }

    mediaQuery.addListener(handleMediaQueryChange);
    return () => mediaQuery.removeListener(handleMediaQueryChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        ticking = false;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  const getParallaxStyle = (speed: number): CSSProperties => ({
    transform: `translate3d(0, ${prefersReducedMotion ? 0 : Math.round(scrollY * speed)}px, 0)`,
  });

  return (
    <div className="category-page interior-painting-page">
      <SEO
        title="Interior Painting Services Toronto | Rooms, Trim, Ceilings & More"
        description="Professional interior painting for bedrooms, kitchens, bathrooms, ceilings, trim, and more across Toronto and the GTA. Clean prep, beautiful finishes, and transparent pricing."
        canonical="/services/interior-painting"
      />

      <section className="scp-hero">
        <div className="scp-hero-parallax" aria-hidden="true" style={getParallaxStyle(0.14)} />
        <div className="container">
          <p className="scp-eyebrow">Interior Painting</p>
          <h1>Beautiful interiors delivered with care, clarity, and clean execution.</h1>
          <p className="scp-hero-subtitle">
            We help homeowners refresh everyday spaces with polished finishes, organized prep, and a calm, professional painting experience.
          </p>

          <div className="scp-hero-actions">
            <Link to="/contact-us#quote-section" className="btn-primary">
              Request Interior Quote
            </Link>
            <a
              href="tel:+16476758101"
              className="btn-secondary"
              onClick={() => trackPhoneClick({ location: 'hero' })}
            >
              Call 647-675-8101
            </a>
          </div>
        </div>
      </section>

      <section className="scp-services" id="interior-services">
        <div className="container">
          <div className="scp-heading">
            <p className="scp-eyebrow">Estimator Services</p>
            <h2>Select your interior project type.</h2>
            <p>
              Every service includes clear scope-based pricing so you can plan confidently before booking.
            </p>
          </div>

          <div className="scp-service-grid">
            {interiorServices.map((service) => (
              <Link
                key={service.id}
                to={`/services/interior-painting/${service.id}`}
                className={`scp-service-card ${service.featured ? 'scp-service-card--featured' : ''}`}
                aria-label={`Open estimator for ${service.name}`}
              >
                <img
                  src={service.backgroundImage || '/services/kitchen-walls/kitchen-walls.jpeg'}
                  alt={`${service.name} project example`}
                  loading="lazy"
                />
                <div className="scp-service-content">
                  <span className="scp-service-type">{serviceTypeLabel[service.type]}</span>
                  <h3>{service.name}</h3>
                  <p>{service.description || 'Professional prep and clean finishing tailored to your home.'}</p>
                  <span className="scp-service-link">
                    Open estimator
                  </span>
                </div>
              </Link>
            ))}

            <article className="scp-service-card scp-service-card--custom">
              <div className="scp-service-content">
                <span className="scp-service-type">Custom Support</span>
                <h3>Need a custom interior quote?</h3>
                <p>
                  If your project is unique, share details and photos for a tailored estimate from our team.
                </p>
                <Link to="/services/custom-painting" className="scp-service-link">
                  Request custom quote
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="scp-final-cta">
        <div className="container scp-final-cta-inner">
          <div>
            <h2>Ready to refresh your interior spaces?</h2>
            <p>Serving Toronto and the GTA with reliable scheduling and premium-quality finishes.</p>
          </div>
          <Link to="/contact-us#quote-section" className="btn-primary">
            Start Your Quote
          </Link>
        </div>
      </section>
    </div>
  );
};

export default InteriorPaintingPage;
