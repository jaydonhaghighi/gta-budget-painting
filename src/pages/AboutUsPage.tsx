import SEO from '../components/SEO';
import './AboutUsPage.css';

const AboutUsPage = () => {
  return (
    <div className="about-page">
      <SEO
        title="About GTA Budget Painting | Fast Turnaround, Great Results"
        description="Learn about GTA Budget Painting, focused on small residential painting jobs with budget-friendly pricing, fast turnaround, and great results across the Greater Toronto Area."
        canonical="/about-us"
      />

      <section className="about-hero">
        <div className="container">
          <h1>Painting on a budget, without cutting corners</h1>
          <p className="about-subtitle">
            GTA Budget Painting is built for homeowners who want a clean, professional finish on a realistic budget, with
            fast turnaround for small residential projects across the Greater Toronto Area.
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="container about-split">
          <div className="about-split-text">
            <h2>About GTA Budget Painting</h2>
            <p>
              GTA Budget Painting is a specialized division of{' '}
              <a href="https://gtahomepainting.ca" target="_blank" rel="noopener noreferrer">
                GTA Home Painting
              </a>
              , dedicated to homeowners who want high-quality, affordable painting for smaller projects.
            </p>
            <p>
              We focus on residential interior and exterior painting for homes, condos, and apartments across the Greater
              Toronto Area. While many contractors overlook small jobs, our team is set up to deliver a clean result with
              quick turnaround and budget-friendly pricing, no matter the size.
            </p>
          </div>
          <div className="about-split-media">
            <img
              src="/partnership.png"
              alt="Professional painting team at work"
              className="about-split-photo"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container about-grid">
          <div className="about-card">
            <h2>What we do</h2>
            <p>
              We specialize in small-to-medium residential painting jobs, single rooms, doors, trim, ceilings, and quick
              exterior upgrades, done efficiently with great results.
            </p>
          </div>

          <div className="about-card">
            <h2>How we keep it budget-friendly</h2>
            <p>
              Our process is designed to reduce wasted time and surprise costs: clear estimating, tight scheduling, and a
              simple service menu for the most common small jobs.
            </p>
          </div>

          <div className="about-card">
            <h2>Fast turnaround</h2>
            <p>
              Small jobs shouldn’t take weeks. We aim to respond quickly and schedule efficiently so you can get your
              space refreshed sooner.
            </p>
          </div>

          <div className="about-card">
            <h2>Great results</h2>
            <p>
              Clean lines, smooth finishes, and tidy workspaces. We focus on prep, protection, and a consistent process
              so the final result looks sharp.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section about-process">
        <div className="container">
          <h2 className="about-section-title">Our process</h2>
          <div className="about-steps">
            <div className="about-step">
              <h3>1) Quick quote</h3>
              <p>Use our estimator for instant pricing or send your details for a fast reply.</p>
            </div>
            <div className="about-step">
              <h3>2) Confirm details</h3>
              <p>We confirm scope, surfaces, and any special prep so pricing is clear.</p>
            </div>
            <div className="about-step">
              <h3>3) Paint & clean</h3>
              <p>We protect the space, do the work, and clean up so you can enjoy the update right away.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="container about-cta-inner">
          <h2>Ready for a budget-friendly refresh?</h2>
          <p>Get a fast quote and quick turnaround for your next small painting project.</p>
          <div className="about-cta-actions">
            <a className="btn-primary" href="/services">Browse Services</a>
            <a className="btn-primary" href="/contact-us">Contact Us</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;

