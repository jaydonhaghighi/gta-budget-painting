import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { allServices, type Service } from '../data/services';
import { trackInquirySubmitted, trackPhoneClick } from '../utils/analytics';
import './LandingPage.css';

interface Testimonial {
  name: string;
  date: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Eva Leek',
    date: 'September 11, 2025',
    quote:
      'Highly recommend. Peter and his team were very professional, neat and tidy. They cleaned up after themselves each day and helped with colour matching.',
  },
  {
    name: 'Kiara C.',
    date: 'August 21, 2025',
    quote:
      'They helped us choose the perfect colour and completely transformed the house with a fresh, clean look. Excellent work from start to finish.',
  },
  {
    name: 'Paul Lillakas',
    date: 'October 16, 2025',
    quote:
      'Exceptional service and workmanship. Trustworthy, organized, and very comfortable to work with from first quote through completion.',
  },
  {
    name: 'Kris J.',
    date: 'October 2, 2025',
    quote:
      'Professional advice, quality execution, and quick turnaround. They updated our kitchen beautifully and made the process easy.',
  },
  {
    name: 'Sagi K.',
    date: 'January 9, 2025',
    quote:
      'Outstanding interior painting results. The team worked quickly, stayed on budget, and delivered a flawless finish throughout the home.',
  },
];

const serviceAreas = [
  'Toronto',
  'North York',
  'Etobicoke',
  'Scarborough',
  'Mississauga',
  'Brampton',
  'Vaughan',
  'Markham',
  'Richmond Hill',
  'Oakville',
  'Burlington',
  'Milton',
  'Caledon',
  'Thornhill',
  'Woodbridge',
  'Downtown Toronto',
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const [inqName, setInqName] = useState('');
  const [inqEmail, setInqEmail] = useState('');
  const [inqPhone, setInqPhone] = useState('');
  const [inqMessage, setInqMessage] = useState('');
  const [inqSubmitting, setInqSubmitting] = useState(false);
  const [inqSuccess, setInqSuccess] = useState<string | null>(null);
  const [inqError, setInqError] = useState<string | null>(null);

  const servicesForHomepage = useMemo(() => {
    const featured = allServices.filter((service) => service.featured && service.id !== 'custom-project');
    const others = allServices.filter((service) => service.id !== 'custom-project');
    const deduplicated = [...featured, ...others.filter((service) => !featured.some((item) => item.id === service.id))];
    return deduplicated.slice(0, 6);
  }, []);

  const isInquiryValid =
    inqName.trim().length > 0 &&
    inqMessage.trim().length > 0 &&
    (inqEmail.trim().length > 0 || inqPhone.trim().length > 0);

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

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal');
    if (!elements.length) return;

    if (prefersReducedMotion) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || testimonials.length < 2) return;

    const interval = window.setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  const scrollToSection = (hash: string) => {
    const section = document.querySelector(hash);
    if (!section) return;

    const headerOffset = window.innerWidth <= 768 ? 100 : 128;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: sectionTop,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash;
      if (!hash) return;

      if (hash === '#company-section') {
        navigate('/about-us');
        return;
      }

      const validHashes = ['#inquiry-section', '#areas-served-section'];
      if (validHashes.includes(hash)) {
        window.setTimeout(() => scrollToSection(hash), 90);
      }
    };

    handleHashNavigation();
    window.addEventListener('hashchange', handleHashNavigation);

    return () => window.removeEventListener('hashchange', handleHashNavigation);
  }, [navigate]);

  const getServiceRoute = (service: Service) => {
    if (service.category === 'exterior') {
      return `/services/exterior-painting/${service.id}`;
    }

    if (service.category === 'specialty') {
      return '/services/custom-painting';
    }

    return `/services/interior-painting/${service.id}`;
  };

  const getParallaxStyle = (speed: number): CSSProperties => ({
    transform: `translate3d(0, ${prefersReducedMotion ? 0 : Math.round(scrollY * speed)}px, 0)`,
  });

  const handleQuickInquirySubmit = async (event: FormEvent) => {
    event.preventDefault();
    setInqSubmitting(true);
    setInqSuccess(null);
    setInqError(null);

    try {
      if (!inqName || (!inqEmail && !inqPhone) || !inqMessage) {
        throw new Error('Please include your name, a contact method, and a short message.');
      }

      const [{ db }, firestore] = await Promise.all([import('../firebase'), import('firebase/firestore')]);

      const inquiryId = (
        await firestore.addDoc(firestore.collection(db, 'inquiries'), {
          name: inqName,
          email: inqEmail || null,
          phone: inqPhone || null,
          message: inqMessage,
          source: 'landing-page-quick-form',
          createdAt: firestore.Timestamp.fromDate(new Date()),
        })
      ).id;

      try {
        await fetch('https://us-central1-gta-budget-painting.cloudfunctions.net/sendInquiryEmails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: inqName,
            email: inqEmail || undefined,
            phone: inqPhone || undefined,
            message: inqMessage,
            inquiryId,
            createdAt: new Date().toISOString(),
          }),
        });
      } catch {
        // Inquiry write to Firestore is the critical path; email forwarding can fail silently.
      }

      trackInquirySubmitted({
        form_source: 'landing-page-quick-form',
        has_email: inqEmail.trim().length > 0,
        has_phone: inqPhone.trim().length > 0,
      });

      setInqSuccess('Thanks. We received your request and will reach out shortly.');
      setInqName('');
      setInqEmail('');
      setInqPhone('');
      setInqMessage('');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to send your request right now. Please try again.';
      setInqError(message);
    } finally {
      setInqSubmitting(false);
    }
  };

  const handlePhoneClick = (location: 'hero' | 'other') => {
    trackPhoneClick({ location });
  };

  return (
    <div className="landing-page">
      <SEO
        title="Trusted Home Painters in Toronto & GTA | Calm, Clean, Professional"
        description="Elegant interior and exterior home painting for Toronto and GTA homeowners. Clean preparation, reliable scheduling, beautiful finishes, and easy quote requests."
        canonical="/"
      />

      <section className="lp-hero">
        <div className="lp-hero-layer" aria-hidden="true" style={getParallaxStyle(0.12)} />
        <div className="container lp-hero-grid">
          <div className="lp-hero-copy reveal">
            <p className="lp-eyebrow">Residential Painting for Beautiful, Peaceful Homes</p>
            <h1>Painting your home should feel calm, organized, and effortless.</h1>
            <p className="lp-hero-description">
              We help GTA homeowners refresh their spaces with clean prep, thoughtful colour guidance, and polished finishes that feel elevated but approachable.
            </p>

            <div className="lp-hero-list" role="list" aria-label="Key customer benefits">
              <span role="listitem">Insured team with respectful in-home care</span>
              <span role="listitem">Clear communication from estimate to completion</span>
              <span role="listitem">Daily cleanup and detail-focused finishing</span>
            </div>

            <div className="lp-hero-actions">
              <Link to="/contact-us#quote-section" className="btn-primary">
                Get a Free Quote
              </Link>
              <a href="tel:+16476758101" className="btn-secondary" onClick={() => handlePhoneClick('hero')}>
                Call 647-675-8101
              </a>
            </div>

          </div>

          <div className="lp-hero-visual reveal">
            <img src="/services/kitchen-walls/kitchen-walls.jpeg" alt="Freshly painted elegant kitchen interior" />
            <div className="lp-hero-stat-card">
              <p>Trusted by GTA homeowners who value clean, thoughtful craftsmanship.</p>
              <strong>Interior + Exterior Specialists</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-services">
        <div className="lp-services-layer" aria-hidden="true" style={getParallaxStyle(0.06)} />
        <div className="container">
          <div className="lp-section-heading reveal">
            <p className="lp-eyebrow">Services Overview</p>
            <h2>Popular services designed around real homes and real schedules.</h2>
          </div>

          <div className="lp-services-grid">
            {servicesForHomepage.map((service) => (
              <article key={service.id} className="lp-service-card reveal">
                <div className="lp-service-image-wrap">
                  <img
                    src={service.backgroundImage || '/logo.png'}
                    alt={`${service.name} service example`}
                    loading="lazy"
                    className="lp-service-image"
                  />
                </div>
                <div className="lp-service-copy">
                  <p className="lp-service-tag">{service.category === 'interior' ? 'Interior' : 'Exterior'}</p>
                  <h3>{service.name}</h3>
                  <p>{service.description || 'Professional painting completed with careful prep and detail-driven finishing.'}</p>
                  <Link to={getServiceRoute(service)} className="lp-service-link">
                    Explore Service
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="lp-section-actions reveal">
            <Link to="/services" className="btn-secondary">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      <section id="inquiry-section" className="lp-quote">
        <div className="container lp-quote-grid">
          <div className="lp-quote-copy reveal">
            <p className="lp-eyebrow">Quote Request Form</p>
            <h2>Tell us about your project.</h2>
            <p>
              Share what you need and your preferred contact method. We typically reply quickly with next steps and estimate details.
            </p>
            <ul>
              <li>Fast response window</li>
              <li>No-pressure consultation</li>
              <li>Clear scope and pricing</li>
            </ul>
          </div>

          <form className="lp-quote-form reveal" onSubmit={handleQuickInquirySubmit} autoComplete="on">
            <label htmlFor="inq-name">Name *</label>
            <input
              id="inq-name"
              name="name"
              type="text"
              placeholder="Your full name"
              autoComplete="name"
              value={inqName}
              onChange={(event) => setInqName(event.target.value)}
            />

            <div className="lp-quote-form-grid">
              <div>
                <label htmlFor="inq-email">Email</label>
                <input
                  id="inq-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={inqEmail}
                  onChange={(event) => setInqEmail(event.target.value)}
                />
              </div>
              <div>
                <label htmlFor="inq-phone">Phone</label>
                <input
                  id="inq-phone"
                  name="phone"
                  type="tel"
                  placeholder="(647) 000-0000"
                  autoComplete="tel"
                  value={inqPhone}
                  onChange={(event) => setInqPhone(event.target.value)}
                />
              </div>
            </div>

            <label htmlFor="inq-message">Project details *</label>
            <textarea
              id="inq-message"
              name="message"
              placeholder="Rooms, surfaces, timeline, and anything important for your quote"
              rows={4}
              value={inqMessage}
              onChange={(event) => setInqMessage(event.target.value)}
            />

            {inqError && (
              <p className="lp-quote-alert lp-error" role="alert" aria-live="assertive">
                {inqError}
              </p>
            )}
            {inqSuccess && (
              <p className="lp-quote-alert lp-success" role="status" aria-live="polite">
                {inqSuccess}
              </p>
            )}

            <button type="submit" className="btn-primary" disabled={!isInquiryValid || inqSubmitting}>
              {inqSubmitting ? 'Sending...' : 'Send Request'}
            </button>
          </form>
        </div>
      </section>

      <section className="lp-trust">
        <div className="container">
          <div className="lp-section-heading reveal">
            <p className="lp-eyebrow">Trust Indicators</p>
            <h2>Professional standards designed for peace of mind.</h2>
          </div>

          <div className="lp-trust-grid">
            <article className="lp-trust-card reveal">
              <h3>Clean & Careful</h3>
              <p>We protect furniture, floors, and fixtures, then clean each day before leaving.</p>
            </article>
            <article className="lp-trust-card reveal">
              <h3>Reliable Scheduling</h3>
              <p>You get clear timelines, punctual arrivals, and consistent updates.</p>
            </article>
            <article className="lp-trust-card reveal">
              <h3>Quality Materials</h3>
              <p>Premium paints and proper prep create smooth, lasting finishes.</p>
            </article>
            <article className="lp-trust-card reveal">
              <h3>Friendly Guidance</h3>
              <p>Need colour support? We help you choose tones that feel right in your space.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="lp-testimonials">
        <div className="lp-testimonial-layer" aria-hidden="true" style={getParallaxStyle(0.07)} />
        <div className="container">
          <div className="lp-section-heading reveal">
            <p className="lp-eyebrow">Testimonials</p>
            <h2>Homeowners choose us for professionalism, cleanliness, and care.</h2>
          </div>

          <article className="lp-testimonial-card reveal" aria-live="polite">
            <p className="lp-testimonial-quote">“{testimonials[currentReviewIndex].quote}”</p>
            <div className="lp-testimonial-meta">
              <strong>{testimonials[currentReviewIndex].name}</strong>
              <span>{testimonials[currentReviewIndex].date}</span>
            </div>
          </article>

          <div className="lp-testimonial-dots" role="tablist" aria-label="Testimonials navigation">
            {testimonials.map((item, index) => (
              <button
                key={item.name + item.date}
                type="button"
                className={`lp-dot ${index === currentReviewIndex ? 'active' : ''}`}
                onClick={() => setCurrentReviewIndex(index)}
                aria-label={`Show testimonial ${index + 1}`}
                aria-selected={index === currentReviewIndex}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="lp-gallery">
        <div className="container">
          <div className="lp-section-heading reveal">
            <p className="lp-eyebrow">Gallery</p>
            <h2>Fresh finishes, balanced colours, and beautiful room flow.</h2>
          </div>

          <div className="lp-gallery-embed reveal">
            <iframe
              title="GTA Budget Painting website gallery"
              style={{ width: '100%', height: '100%', minHeight: '870px' }}
              frameBorder="0"
              src="https://trusty.app/embed/website-gallery/bc8c4042-c648-4d7b-b415-6972de26a943?limit=6"
              allow="fullscreen"
              loading="lazy"
            />
          </div>

        </div>
      </section>

      <section id="areas-served-section" className="lp-areas">
        <div className="container">
          <div className="lp-section-heading reveal">
            <p className="lp-eyebrow">Service Area Indicators</p>
            <h2>Serving homes across Toronto and the Greater Toronto Area.</h2>
          </div>

          <div className="lp-areas-panel reveal">
            <div className="lp-areas-map-wrap">
              <iframe
                title="Service area map with Vaughan pin"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-79.72%2C43.68%2C-79.28%2C43.99&layer=mapnik&marker=43.8361%2C-79.4983"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="lp-areas-map-caption">
                <span>Pin: Vaughan</span>
                <a
                  href="https://www.openstreetmap.org/?mlat=43.8361&mlon=-79.4983#map=11/43.8361/-79.4983"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open map
                </a>
              </div>
            </div>
            <div className="lp-areas-chip-wrap">
              {serviceAreas.map((area) => (
                <span key={area}>{area}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="lp-callout">
        <div className="container">
          <div className="lp-callout-panel reveal">
            <div>
              <p className="lp-eyebrow">Call To Action</p>
              <h2>Let’s make your home feel lighter, cleaner, and beautifully renewed.</h2>
              <p>
                Whether you want one room refreshed or a full-home update, we’ll guide you through a professional and easy process.
              </p>
            </div>
            <div className="lp-callout-actions">
              <Link to="/contact-us#quote-section" className="btn-primary">
                Request Your Quote
              </Link>
              <a href="tel:+16476758101" className="btn-secondary" onClick={() => handlePhoneClick('other')}>
                Speak With Our Team
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
