import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { getServicesByCategory } from '../data/services';
import SEO from '../components/SEO';
import { trackPhoneClick, trackServiceCategoryView } from '../utils/analytics';
import './ExteriorPaintingPage.css';

const serviceTypeLabel: Record<'calculated' | 'flat-rate' | 'custom-quote', string> = {
  calculated: 'Instant Estimator',
  'flat-rate': 'Flat-Rate Service',
  'custom-quote': 'Custom Quote',
};

const exteriorShowcase = [
  {
    title: 'Front Entrance Refresh',
    image: '/services/front-door/front-door.jpeg',
    alt: 'Freshly painted front door with elegant curb appeal',
  },
  {
    title: 'Fence Renewal',
    image: '/services/fence/739cc85f924bf84f79f5414f52957d1c.webp',
    alt: 'Exterior fence after weather-resistant paint application',
  },
  {
    title: 'Driveway Protection',
    image: '/services/driveway/bac56abdd6adb37858835aacae49dcc8.jpg',
    alt: 'Sealed and refreshed driveway surface',
  },
];

const trustPillars = [
  'Weather-ready prep and durable exterior-grade products',
  'Clean site management with respectful property protection',
  'Clear timelines and communication from estimate to completion',
];

const processSteps = [
  'Choose your exterior service and enter project details.',
  'Review your estimate and optional add-ons instantly.',
  'Submit your request and finalize scheduling with our team.',
];

const ExteriorPaintingPage = () => {
  const exteriorServices = useMemo(() => getServicesByCategory('exterior'), []);

  const [scrollY, setScrollY] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    trackServiceCategoryView('exterior');
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
    <div className="category-page exterior-painting-page">
      <SEO
        title="Exterior Painting Services Toronto | Doors, Garage Doors, Fences"
        description="Exterior painting services for doors, fences, garage doors, railings, and driveways across Toronto and the GTA. Weather-ready finishes and clear pricing."
        canonical="/services/exterior-painting"
      />

      <section className="scp-hero">
        <div className="scp-hero-parallax" aria-hidden="true" style={getParallaxStyle(0.12)} />
        <div className="container">
          <p className="scp-eyebrow">Exterior Painting</p>
          <h1>Protect your home exterior while elevating curb appeal.</h1>
          <p className="scp-hero-subtitle">
            From front doors to fences and driveways, our exterior services combine durable materials, thoughtful prep, and polished finish quality.
          </p>

          <div className="scp-hero-actions">
            <Link to="/contact-us#quote-section" className="btn-primary">
              Request Exterior Quote
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

      <section className="scp-trust">
        <div className="container scp-trust-grid">
          {trustPillars.map((pillar) => (
            <article key={pillar} className="scp-trust-card">
              <p>{pillar}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="scp-showcase" aria-label="Exterior painting highlights">
        <div className="container">
          <div className="scp-heading">
            <p className="scp-eyebrow">Project Highlights</p>
            <h2>Exterior updates that make homes feel fresh and well cared for.</h2>
          </div>

          <div className="scp-showcase-grid">
            {exteriorShowcase.map((item) => (
              <article key={item.title} className="scp-showcase-card">
                <img src={item.image} alt={item.alt} loading="lazy" />
                <div className="scp-showcase-copy">
                  <h3>{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="scp-services" id="exterior-services">
        <div className="container">
          <div className="scp-heading">
            <p className="scp-eyebrow">Estimator Services</p>
            <h2>Select your exterior project type.</h2>
            <p>
              Use our estimator tools for transparent pricing and faster planning for your next exterior upgrade.
            </p>
          </div>

          <div className="scp-service-grid">
            {exteriorServices.map((service) => (
              <article
                key={service.id}
                className={`scp-service-card ${service.featured ? 'scp-service-card--featured' : ''}`}
              >
                <img
                  src={service.backgroundImage || '/services/front-door/front-door.jpeg'}
                  alt={`${service.name} project example`}
                  loading="lazy"
                />
                <div className="scp-service-content">
                  <span className="scp-service-type">{serviceTypeLabel[service.type]}</span>
                  <h3>{service.name}</h3>
                  <p>{service.description || 'Durable exterior finishing tailored to your home and climate.'}</p>
                  <Link to={`/services/exterior-painting/${service.id}`} className="scp-service-link">
                    Open estimator
                  </Link>
                </div>
              </article>
            ))}

            <article className="scp-service-card scp-service-card--custom">
              <div className="scp-service-content">
                <span className="scp-service-type">Custom Support</span>
                <h3>Have a unique exterior project?</h3>
                <p>
                  Tell us what you need and we will build a custom quote around your exact surfaces and scope.
                </p>
                <Link to="/services/custom-painting" className="scp-service-link">
                  Request custom quote
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="scp-process">
        <div className="container">
          <div className="scp-heading">
            <p className="scp-eyebrow">How It Works</p>
            <h2>A clear, low-stress way to plan exterior painting.</h2>
          </div>

          <ol className="scp-step-grid">
            {processSteps.map((step, index) => (
              <li key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="scp-final-cta">
        <div className="container scp-final-cta-inner">
          <div>
            <h2>Ready to improve curb appeal and protection?</h2>
            <p>Get a detailed quote for your exterior project anywhere in Toronto and the GTA.</p>
          </div>
          <Link to="/contact-us#quote-section" className="btn-primary">
            Start Your Quote
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ExteriorPaintingPage;
