import { useEffect, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { trackPhoneClick } from '../utils/analytics';
import './AboutUsPage.css';

const valueCards = [
  {
    title: 'Respectful In-Home Service',
    text: 'Floor protection, careful prep, and daily cleanup keep your home comfortable throughout the project.',
  },
  {
    title: 'Clear Communication',
    text: 'From quote to completion, you always know scope, timeline, and next steps.',
  },
  {
    title: 'Detail-Focused Finishing',
    text: 'Straight cut lines, smooth coverage, and neat final presentation are our baseline standard.',
  },
  {
    title: 'Reliable Scheduling',
    text: 'We prioritize efficient booking and realistic timelines so your home refresh stays on track.',
  },
];

const processSteps = [
  'Share your project details and choose your preferred service path.',
  'Receive transparent pricing and confirm scope with our team.',
  'We complete prep, painting, and cleanup with care and consistency.',
];

const AboutUsPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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
    <div className="about-page">
      <SEO
        title="About GTA Budget Painting | Calm, Clean, Professional Home Painting"
        description="Learn how GTA Budget Painting delivers clean, organized residential painting across Toronto and the GTA with transparent pricing, reliable scheduling, and detail-focused finishes."
        canonical="/about-us"
      />

      <section className="ab-hero">
        <div className="ab-hero-layer" aria-hidden="true" style={getParallaxStyle(0.12)} />
        <div className="container">
          <p className="ab-eyebrow">About GTA Budget Painting</p>
          <h1>A home painting team built around trust, care, and clean results.</h1>
          <p className="ab-hero-subtitle">
            We help homeowners refresh their spaces with a process that feels clear, respectful, and easy to manage from start to finish.
          </p>

          <div className="ab-hero-actions">
            <Link to="/contact-us#quote-section" className="btn-primary">
              Request a Quote
            </Link>
            <a
              href="tel:+16476758101"
              className="btn-secondary"
              onClick={() => trackPhoneClick({ location: 'hero' })}
            >
              Call 647-675-8101
            </a>
          </div>

          <div className="ab-hero-notes" role="list" aria-label="Company highlights">
            <span role="listitem">Fully insured team</span>
            <span role="listitem">Residential specialists</span>
            <span role="listitem">Toronto and GTA coverage</span>
          </div>
        </div>
      </section>

      <section className="ab-story">
        <div className="container ab-story-grid">
          <div className="ab-story-copy">
            <p className="ab-eyebrow">Our Story</p>
            <h2>Premium-feel home painting without the complexity.</h2>
            <p>
              GTA Budget Painting is a dedicated residential division of{' '}
              <a href="https://gtahomepainting.ca" target="_blank" rel="noopener noreferrer">
                GTA Home Painting
              </a>
              . We were built for homeowners who want a professional result with straightforward pricing and efficient scheduling.
            </p>
            <p>
              While many companies prioritize large projects, our model is optimized for practical interior and exterior refreshes where detail, cleanliness, and communication matter most.
            </p>
          </div>

          <div className="ab-story-media">
            <img src="/partnership.png" alt="GTA Budget Painting and GTA Home Painting partnership" loading="lazy" />
            <div className="ab-story-caption">Trusted residential painting support for everyday homeowners.</div>
          </div>
        </div>
      </section>

      <section className="ab-values">
        <div className="container">
          <div className="ab-heading">
            <p className="ab-eyebrow">What Defines Us</p>
            <h2>How we deliver a calmer painting experience.</h2>
          </div>

          <div className="ab-values-grid">
            {valueCards.map((card) => (
              <article key={card.title} className="ab-value-card">
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ab-process">
        <div className="container">
          <div className="ab-heading">
            <p className="ab-eyebrow">Our Process</p>
            <h2>Simple, transparent, and organized.</h2>
          </div>

          <ol className="ab-step-grid">
            {processSteps.map((step, index) => (
              <li key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="ab-cta">
        <div className="container ab-cta-inner">
          <div>
            <h2>Planning a home painting project?</h2>
            <p>Start with a clear quote and a team that treats your home with care.</p>
          </div>
          <div className="ab-cta-actions">
            <Link to="/services" className="btn-secondary">
              Browse Services
            </Link>
            <Link to="/contact-us#quote-section" className="btn-primary">
              Start Your Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
