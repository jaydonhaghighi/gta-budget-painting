import { Link } from 'react-router-dom';
import './Footer.css';
import { trackPhoneClick } from '../utils/analytics';

const serviceLinks = [
  { label: 'Interior Painting', to: '/services/interior-painting' },
  { label: 'Exterior Painting', to: '/services/exterior-painting' },
  { label: 'Accent Walls', to: '/services/interior-painting/accent-wall' },
  { label: 'Bathroom Painting', to: '/services/interior-painting/small-bathroom' },
  { label: 'Bedroom Painting', to: '/services/interior-painting/bedroom-painting' },
  { label: 'Front Doors', to: '/services/exterior-painting/front-door' },
  { label: 'Garage Doors', to: '/services/exterior-painting/garage-door' },
  { label: 'Fence Painting', to: '/services/exterior-painting/fence-painting' },
];

const areas = [
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
];

const Footer = () => {
  const handlePhoneClick = () => {
    trackPhoneClick({ location: 'footer' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <section className="footer-top-cta">
          <div>
            <p className="footer-top-eyebrow">Thoughtful Painting, Beautifully Managed</p>
            <h3>Ready for a clean, calm home refresh?</h3>
          </div>
          <div className="footer-top-actions">
            <a href="tel:+16476758101" className="btn-secondary" onClick={handlePhoneClick}>
              Call 647-675-8101
            </a>
            <Link to="/contact-us#quote-section" className="btn-primary">
              Request a Quote
            </Link>
          </div>
        </section>

        <div className="footer-grid">
          <section className="footer-brand-col">
            <img src="/logo_BW.png" alt="GTA Budget Painting" className="footer-logo" />
            <p>
              Premium-feel residential painting with a friendly, organized process. We protect your home, communicate clearly,
              and leave every space fresh, polished, and move-in ready.
            </p>
            <div className="footer-trust-list">
              <span>Fully insured team</span>
              <span>Clean daily prep + cleanup</span>
              <span>Fast, reliable scheduling</span>
            </div>
          </section>

          <section>
            <h4>Popular Services</h4>
            <ul className="footer-links">
              {serviceLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h4>Company</h4>
            <ul className="footer-links">
              <li>
                <Link to="/about-us">About Us</Link>
              </li>
              <li>
                <Link to="/specials">Special Offers</Link>
              </li>
              <li>
                <Link to="/contact-us">Contact</Link>
              </li>
              <li>
                <Link to="/services">All Services</Link>
              </li>
            </ul>
          </section>

          <section>
            <h4>Contact</h4>
            <ul className="footer-contact-list">
              <li>
                <a href="tel:+16476758101" onClick={handlePhoneClick}>
                  +1 647 675-8101
                </a>
              </li>
              <li>
                <a href="mailto:info@gtabudgetpainting.ca">info@gtabudgetpainting.ca</a>
              </li>
              <li>Monday - Sunday</li>
              <li>8:00 AM - 8:00 PM</li>
            </ul>
            <div className="footer-socials">
              <a
                href="https://www.instagram.com/gtabudgetpainting/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61578315664485"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                Facebook
              </a>
            </div>
          </section>
        </div>

        <section className="footer-areas" aria-label="Service areas">
          <h4>Serving the GTA</h4>
          <div className="footer-area-chips">
            {areas.map((area) => (
              <span key={area}>{area}</span>
            ))}
          </div>
        </section>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} GTA Budget Painting. All rights reserved.</p>
          <a href="https://gtahomepainting.ca" target="_blank" rel="noopener noreferrer" className="partner-link">
            Partner of GTA Home Painting
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
