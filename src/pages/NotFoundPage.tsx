import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <main className="not-found-page">
      <SEO
        title="Page Not Found | GTA Budget Painting"
        description="The page you requested could not be found. Browse our painting services or return to the homepage."
        canonical="/404"
        robots="noindex, follow"
      />
      <section className="not-found-card">
        <h1>Page not found</h1>
        <p>The URL may be incorrect or the page may have moved.</p>
        <div className="not-found-actions">
          <Link to="/" className="not-found-link">
            Go to homepage
          </Link>
          <Link to="/services" className="not-found-link not-found-link-secondary">
            Browse services
          </Link>
        </div>
      </section>
    </main>
  );
}
