import { useEffect, useState, type CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';
import { PROMOTIONS, withPromotionDerived } from '../data/promotions';
import { buildPromotionEstimate } from '../utils/promotionEstimate';
import { trackPhoneClick } from '../utils/analytics';
import './SpecialsPage.css';

const offerHighlights = [
  'Transparent bundled pricing with clear inclusions',
  'Fast scheduling windows across Toronto and the GTA',
  'Clean prep and detail-focused finishing standards',
];

const howItWorks = [
  'Choose the package that best fits your home refresh goals.',
  'Add it to cart and complete your request details.',
  'Our team confirms scope, schedule, and final execution plan.',
];

const SpecialsPage = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const promotions = PROMOTIONS.map(withPromotionDerived);

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

  const handleAddPromotionToCart = (promotionId: string) => {
    const promotion = promotions.find((item) => item.id === promotionId);
    if (!promotion) return;

    const estimate = buildPromotionEstimate(promotion.price);

    const cartItem = {
      serviceId: promotionId,
      serviceName: promotion.name,
      serviceType: 'flat-rate' as const,
      estimate,
      formData: {
        promotionId,
        promotionName: promotion.name,
        promotionSubtitle: promotion.subtitle,
        originalPrice: promotion.originalPrice,
        savings: promotion.savings,
        percentage: promotion.percentage,
        price: promotion.price,
      },
    };

    addItem(cartItem);
    navigate('/cart');
  };

  return (
    <div className="specials-page">
      <SEO
        title="Painting Specials in Toronto & GTA | Limited-Time Packages"
        description="Save with bundled interior painting packages across Toronto and the GTA. Explore limited-time offers with clear inclusions, transparent pricing, and easy booking."
        canonical="/specials"
      />

      <section className="spl-hero">
        <div className="spl-hero-layer" aria-hidden="true" style={getParallaxStyle(0.12)} />
        <div className="container">
          <p className="spl-eyebrow">Limited-Time Offers</p>
          <h1>Special painting packages designed for value and peace of mind.</h1>
          <p className="spl-hero-subtitle">
            Choose a curated bundle, lock in your pricing, and schedule with a team known for organized prep and polished finishes.
          </p>

          <div className="spl-hero-actions">
            <Link to="/contact-us#quote-section" className="btn-primary">
              Request a Custom Quote
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

      <section className="spl-highlights">
        <div className="container spl-highlights-grid">
          {offerHighlights.map((item) => (
            <article key={item}>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="spl-offers">
        <div className="container">
          <div className="spl-heading">
            <p className="spl-eyebrow">Current Packages</p>
            <h2>Pick the offer that best matches your project.</h2>
          </div>

          <div className="spl-offers-grid">
            {promotions.map((promotion, index) => (
              <article
                key={promotion.id}
                className={`spl-offer-card ${index === 0 ? 'spl-offer-card--featured' : ''}`}
              >
                <div className="spl-offer-top">
                  <span className="spl-offer-subtitle">{promotion.subtitle}</span>
                  <span className="spl-offer-badge">{index === 0 ? 'Most Popular' : `${promotion.percentage}% Off`}</span>
                </div>

                <h3>{promotion.name}</h3>

                <div className="spl-pricing">
                  <p className="spl-price">${promotion.price.toLocaleString()} CAD</p>
                  <p className="spl-original">Regular ${promotion.originalPrice.toLocaleString()} CAD</p>
                  <p className="spl-savings">Save ${promotion.savings.toLocaleString()} total</p>
                </div>

                <ul className="spl-features">
                  {promotion.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                <button onClick={() => handleAddPromotionToCart(promotion.id)} className="btn-primary spl-offer-cta">
                  Add Package to Cart
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="spl-process">
        <div className="container">
          <div className="spl-heading">
            <p className="spl-eyebrow">How It Works</p>
            <h2>From offer selection to scheduled service in three steps.</h2>
          </div>

          <ol className="spl-step-grid">
            {howItWorks.map((step, index) => (
              <li key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>

          <p className="spl-terms">Package pricing applies to listed scope. Final details are confirmed before work begins.</p>
        </div>
      </section>
    </div>
  );
};

export default SpecialsPage;
