import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';
import './LocationPage.css';

const LocationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const citySlug = location.pathname.replace('/painters-', '');

  const formattedCity = citySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const fastFacts = [
    {
      label: 'Fast turnaround',
      value: '1-2 days',
      detail: 'Perfect for a quick freshen up before holidays',
    },
    {
      label: 'Quick response',
      value: '8 hrs',
      detail: 'Requests reviewed same day',
    },
    {
      label: 'Best deals',
      value: 'Greater Toronto Area',
      detail: 'Best deals within Greater Toronto Area',
    },
  ];

  const promotions = [
    {
      id: 'january-jumpstart',
      name: 'January Jumpstart',
      subtitle: '3-Room Bundle',
      price: 999,
      originalPrice: 1847,
      savings: 848,
      percentage: 46,
    },
    {
      id: 'first-impressions',
      name: 'First Impressions Package',
      subtitle: 'Entryway & Powder Room',
      price: 699,
      originalPrice: 849,
      savings: 150,
      percentage: 18,
    },
    {
      id: 'holiday-feast',
      name: 'Holiday Feast Combo',
      subtitle: 'Kitchen & Dining Room',
      price: 749,
      originalPrice: 1248,
      savings: 499,
      percentage: 40,
    },
    {
      id: 'guest-suite',
      name: 'Guest Suite Special',
      subtitle: 'Bedroom with Free Trim',
      price: 499,
      originalPrice: 949,
      savings: 450,
      percentage: 47,
    },
    {
      id: 'master-suite',
      name: 'Master Suite Bundle',
      subtitle: 'Bedroom + Ensuite',
      price: 799,
      originalPrice: 1049,
      savings: 250,
      percentage: 24,
    },
    {
      id: 'living-space',
      name: 'Living Space Bundle',
      subtitle: 'Living Room + Hallway',
      price: 1099,
      originalPrice: 1548,
      savings: 449,
      percentage: 29,
    },
  ];

  const handleAddPromotionToCart = (promotionId: string) => {
    const promotion = promotions.find(p => p.id === promotionId);
    if (!promotion) return;

    const estimate = {
      laborHours: 8,
      setupCleanupHours: 1,
      totalHours: 9,
      laborCost: promotion.price * 0.7,
      paintGallons: 3,
      paintCost: promotion.price * 0.2,
      suppliesCost: promotion.price * 0.1,
      otherFees: 0,
      subtotal: promotion.price,
      totalCost: promotion.price,
    };

    const cartItem = {
      serviceId: promotionId,
      serviceName: promotion.name,
      serviceType: 'flat-rate' as const,
      estimate: estimate,
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

  const serviceHighlights = [
    {
      id: 'bedroom-painting',
      title: 'Bedroom Painting',
      subtitle: 'Walls • ceilings • trim',
      image: '/services/bedroom/e1077bd2751943866c972d4cb3b3a576.jpg',
      copy:
        'Transform your bedroom into a peaceful sanctuary with professional painting services that create the perfect atmosphere for rest and relaxation.',
    },
    {
      id: 'small-bathroom',
      title: 'Bathroom Painting',
      subtitle: 'Moisture-resistant finishes',
      image: '/services/bathroom/0773a067ee1c3fda8473965d13a360b0.jpg',
      copy:
        'Transform your bathroom with professional painting services designed to maximize space and create a fresh, modern look with mold-resistant finishes.',
    },
    {
      id: 'stucco-ceiling-removal',
      title: 'Popcorn Ceiling Removal and Painting',
      subtitle: 'Modern smooth ceilings',
      image: '/services/stucco-ceiling-removal/8039a71027ffccfbcfac6eab26f3167c.jpg',
      copy:
        'Professional popcorn ceiling removal services that transform outdated textured ceilings into smooth, modern surfaces ready for painting.',
    },
    {
      id: 'kitchen-walls',
      title: 'Kitchen Painting',
      subtitle: 'Walls • trim • updates',
      image: '/services/kitchen-walls/ff79fd3533a771d876cb26226b7009e4.jpg',
      copy:
        'Transform your kitchen with professional wall painting that creates a fresh, clean, and inviting cooking space.',
    },
  ];

  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const landingReviews = [
    {
      name: 'Sagi K.',
      rating: 5,
      date: 'January 9, 2025',
      text:
        'We had an amazing experience with GTA Home Painting! Peter and his team did an outstanding job painting the entire interior of our house. They worked quickly, stayed on budget, and the results were absolutely flawless. We were so impressed with their work that we decided to have them paint our kitchen as well, and it turned out just as perfect. If you\'re looking for reliable, professional, and efficient painters, we highly recommend GTA Home Painting. Thank you, Peter and team, for transforming our home!',
    },
    {
      name: 'Messia Khachadurian',
      rating: 5,
      date: 'January 23, 2025',
      text:
        'Found out about this company through a mutual friend, and I can say they don\'t disappoint. Aryan made everything an easy process for me, from the estimate to the finishing touches. Would recommend everyone to give them a try if you\'re looking for a hassle free project at great prices.',
    },
    {
      name: 'T G',
      rating: 5,
      date: 'July 24, 2025',
      text:
        "Peter was amazing to deal with - from the estimate, all the way through to project completion. I wouldn't hesitate to use him again in future. Highly recommend!",
    },
    {
      name: 'Kiara C',
      rating: 5,
      date: 'August 21, 2025',
      text:
        'Did an excellent job, no complaints at all. Helped us choose the perfect colour and completely transformed the house with a fresh, clean look.',
    },
    {
      name: 'Eva Leek',
      rating: 5,
      date: 'September 11, 2025',
      text:
        'Highly recommend. Peter and his team were very professional, neat and tidy. Cleaned up after themselves each day. Peter is knowledgeable about paint and explained the process needed to cover the faded window trim. He even went to the paint store to colour match the original and helped pick the colour. Will definitely have him come back for future projects.',
    },
    {
      name: 'Farhood N',
      rating: 5,
      date: 'September 30, 2025',
      text:
        'Pirouz is friendly and trustworthy. He painted my one bedroom unit in short notice and reasonable price between two tenants. Strongly suggest his services.',
    },
    {
      name: 'L',
      rating: 5,
      date: 'October 1, 2025',
      text:
        "Peter and his team were great. Peter worked with me diligently on picking the right colors for my home. His dedication showed in the work they completed. I've worked with Peter and his team on another project at my home, and they were fantastic. Peter is incredibly efficient, thorough, and goes above and beyond to ensure everything meets your expectations. I highly recommend them.",
    },
    {
      name: 'Kris J',
      rating: 5,
      date: 'October 2, 2025',
      text:
        'Peter and team did an amazing job painting our kitchen. We weren\'t sure what colour we wanted and he came in with his recommendations and colour swatches. It completely updated and changed our kitchen. His professionalism, expert advice and ability to get the job done quickly and of quality was great!',
    },
    {
      name: 'Paul Lillakas',
      rating: 5,
      date: 'October 16, 2025',
      text:
        'Peter provides an exceptional service that warrants high regard and recommendation. Not only is the quality of workmanship top notch, he is trustworthy and made us feel so comfortable from the first quote up to the completion of the job. He went above and beyond, helping us choose colour, finishes and then working with us on scheduling. I would give 6 stars if I could and would highly recommend him for any painting project!',
    },
  ];

  const truncateText = (text: string, maxWords: number = 35) => {
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const renderStars = (rating: number) => (
    <div className="location-review-stars">
      {[...Array(5)].map((_, index) => (
        <span key={index} className={index < rating ? 'location-star location-star-filled' : 'location-star'}>
          ★
        </span>
      ))}
    </div>
  );

  useEffect(() => {
    const interval = setInterval(
      () =>
        setCurrentReviewIndex(prev =>
          prev === landingReviews.length - 1 ? 0 : prev + 1,
        ),
      5000,
    );
    return () => clearInterval(interval);
  }, [landingReviews.length]);

  return (
    <div className="location-page">
      <SEO
        title={`Best Painters in ${formattedCity} | Affordable & Fast | GTA Budget Painting`}
        description={`Looking for painters in ${formattedCity}? We provide affordable, high-quality residential painting for small jobs in ${formattedCity}. Get a free quote today!`}
        canonical={location.pathname}
      />

      <section className="location-hero">
        <div className="location-hero-blob location-hero-blob-one" aria-hidden="true" />
        <div className="location-hero-blob location-hero-blob-two" aria-hidden="true" />
        <div className="location-hero-noise" aria-hidden="true" />
        <div className="location-container location-hero-grid">
          <div className="location-hero-copy">
            <p className="location-eyebrow">GTA Budget Painting · Locations</p>
            <h1>
              Painted to perfection in <span>{formattedCity}</span>
            </h1>
            <p className="location-hero-subtext">
              Professional residential painting services in {formattedCity}. Expert interior and exterior painters specializing in condos, homes, and apartments. Fast turnaround, affordable pricing, and free quotes for painting projects in {formattedCity}.
            </p>
            <div className="location-hero-actions">
              <a href="tel:6473907181" className="location-btn-primary">
                Call (647) 390-7181
              </a>
              <Link to="/contact-us#quote-section" className="location-btn-secondary">
                Send Inquiry
              </Link>
              <Link to="/services" className="location-btn-secondary">
                Get Free Estimate
              </Link>
            </div>
          </div>
          <div className="location-hero-panel">
            <p className="location-panel-label">Fast facts</p>
            <ul className="location-panel-list">
              {fastFacts.map(item => (
                <li key={item.label}>
                  <span className="location-panel-value">{item.value}</span>
                  <span className="location-panel-label-text">{item.label}</span>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ul>
            
          </div>
        </div>
      </section>

      <section className="location-section-shell location-promotions">
        <div className="location-container">
          <div className="location-section-heading">
            <p className="location-eyebrow">Limited time</p>
            <h2>Winter Holiday Specials</h2>
            <p className="location-promotions-subtitle">
              Wow your guests this winter! All promotions end January 31st. Lock in your painting deal and get your home party-ready!
            </p>
          </div>
          <div className="location-promotions-grid">
            <div className="location-promotion-card location-promotion-featured location-promotion-best-deal">
              <div className="location-promotion-badge">Best Deal</div>
              <h3>January Jumpstart</h3>
              <p className="location-promotion-subtitle">3-Room Bundle</p>
              <div className="location-promotion-pricing">
                <span className="location-promotion-price">$999 CAD</span>
                <span className="location-promotion-original">Regular $1,847 CAD</span>
                <span className="location-promotion-savings">Save $848 (46% off)</span>
              </div>
              <ul className="location-promotion-features">
                <li>Any 3 standard rooms (up to 12'x12' each)</li>
                <li>Walls painted (2 coats) in each room</li>
                <li>Minor wall patching included</li>
                <li>Full prep & cleanup included</li>
              </ul>
              <button 
                onClick={() => handleAddPromotionToCart('january-jumpstart')}
                className="location-btn-primary location-promotion-cta"
              >
                Add to Cart
              </button>
            </div>

            <div className="location-promotion-card">
              <h3>First Impressions Package</h3>
              <p className="location-promotion-subtitle">Entryway & Powder Room</p>
              <div className="location-promotion-pricing">
                <span className="location-promotion-price">$699 CAD</span>
                <span className="location-promotion-original">Regular $849 CAD</span>
                <span className="location-promotion-savings">Save $150 (18% off)</span>
              </div>
              <ul className="location-promotion-features">
                <li>Foyer/Hallway walls painted (2 coats)</li>
                <li>Powder Room walls painted (2 coats)</li>
                <li>Baseboard painting included</li>
                <li>Minor wall patching included</li>
              </ul>
              <button 
                onClick={() => handleAddPromotionToCart('first-impressions')}
                className="location-btn-primary location-promotion-cta"
              >
                Add to Cart
              </button>
            </div>

            <div className="location-promotion-card">
              <h3>Holiday Feast Combo</h3>
              <p className="location-promotion-subtitle">Kitchen & Dining Room</p>
              <div className="location-promotion-pricing">
                <span className="location-promotion-price">$749 CAD</span>
                <span className="location-promotion-original">Regular $1,248 CAD</span>
                <span className="location-promotion-savings">Save $499 (40% off)</span>
              </div>
              <ul className="location-promotion-features">
                <li>Kitchen walls painted (2 coats)</li>
                <li>Dining Room walls painted (2 coats)</li>
                <li>Premium washable/scrubbable paint included</li>
                <li>Minor wall patching included</li>
              </ul>
              <button 
                onClick={() => handleAddPromotionToCart('holiday-feast')}
                className="location-btn-primary location-promotion-cta"
              >
                Add to Cart
              </button>
            </div>

            <div className="location-promotion-card">
              <h3>Guest Suite Special</h3>
              <p className="location-promotion-subtitle">Bedroom with Free Trim</p>
              <div className="location-promotion-pricing">
                <span className="location-promotion-price">$499 CAD</span>
                <span className="location-promotion-original">Regular $949 CAD</span>
                <span className="location-promotion-savings">Save $450 (47% off)</span>
              </div>
              <ul className="location-promotion-features">
                <li>Bedroom walls painted (2 coats)</li>
                <li>Up to 12'x12' room size</li>
                <li>Baseboards painted (2 coats)</li>
                <li>Window casings painted (2 coats)</li>
              </ul>
              <button 
                onClick={() => handleAddPromotionToCart('guest-suite')}
                className="location-btn-primary location-promotion-cta"
              >
                Add to Cart
              </button>
            </div>

            <div className="location-promotion-card">
              <h3>Master Suite Bundle</h3>
              <p className="location-promotion-subtitle">Bedroom + Ensuite</p>
              <div className="location-promotion-pricing">
                <span className="location-promotion-price">$799 CAD</span>
                <span className="location-promotion-original">Regular $1,049 CAD</span>
                <span className="location-promotion-savings">Save $250 (24% off)</span>
              </div>
              <ul className="location-promotion-features">
                <li>Master bedroom walls painted (2 coats)</li>
                <li>Ensuite bathroom walls painted (2 coats)</li>
                <li>Premium moisture-resistant paint in bathroom</li>
                <li>Minor wall patching included</li>
              </ul>
              <button 
                onClick={() => handleAddPromotionToCart('master-suite')}
                className="location-btn-primary location-promotion-cta"
              >
                Add to Cart
              </button>
            </div>

            <div className="location-promotion-card">
              <h3>Living Space Bundle</h3>
              <p className="location-promotion-subtitle">Living Room + Hallway</p>
              <div className="location-promotion-pricing">
                <span className="location-promotion-price">$1,099 CAD</span>
                <span className="location-promotion-original">Regular $1,548 CAD</span>
                <span className="location-promotion-savings">Save $449 (29% off)</span>
              </div>
              <ul className="location-promotion-features">
                <li>Living room walls painted (2 coats)</li>
                <li>Hallway/foyer walls painted (2 coats)</li>
                <li>Baseboard painting included (2 coats)</li>
                <li>Minor wall patching included</li>
              </ul>
              <button 
                onClick={() => handleAddPromotionToCart('living-space')}
                className="location-btn-primary location-promotion-cta"
              >
                Add to Cart
              </button>
            </div>

          </div>
        </div>
      </section>

      <section className="location-section-shell location-services">
        <div className="location-container">
          <div className="location-section-heading">
            <p className="location-eyebrow">Service menu</p>
            <h2>Popular Services in {formattedCity}</h2>
            <p className="location-promotions-subtitle">
              Professional interior painting services tailored to your needs
            </p>
          </div>
          <div className="location-services-grid">
            {serviceHighlights.map(service => (
              <Link
                key={service.id}
                to={`/services/interior-painting/${service.id}`}
                className="location-service-card"
              >
                {service.image && (
                  <div className="location-service-card-image">
                    <img src={service.image} alt={service.title} />
                  </div>
                )}
                <div className="location-service-card-header">
                  <h3>{service.title}</h3>
                </div>
                <p>{service.copy}</p>
                <span className="location-text-link">
                  Explore service details ↗
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="location-section-shell location-testimonials location-reviews-section">
        <div className="location-container">
          <div className="location-section-heading">
            <p className="location-eyebrow">Reviews</p>
            <h2 className="location-reviews-title">People in {formattedCity} Trust us</h2>
            <p className="location-reviews-disclosure">
              GTA Budget Painting shares the same crews and standards as{' '}
              <a
                href="https://gtahomepainting.ca"
                target="_blank"
                rel="noreferrer"
              >
                GTA Home Painting
              </a>
              . Here's what recent clients say.
            </p>
          </div>
          <div className="location-reviews-carousel">
            <figure className="location-review-card">
              {renderStars(landingReviews[currentReviewIndex].rating)}
              <blockquote className="location-review-text">
                "{truncateText(landingReviews[currentReviewIndex].text)}"
              </blockquote>
              <div className="location-review-footer">
                <p className="location-review-author">
                  - {landingReviews[currentReviewIndex].name}
                </p>
                <p className="location-review-date">
                  {landingReviews[currentReviewIndex].date}
                </p>
              </div>
            </figure>
            <div className="location-carousel-dots">
              {landingReviews.map((_, index) => (
                <button
                  key={index}
                  className={`location-dot ${
                    index === currentReviewIndex ? 'location-dot-active' : ''
                  }`}
                  onClick={() => setCurrentReviewIndex(index)}
                  aria-label={`Show review ${index + 1}`}
                  type="button"
                />
              ))}
            </div>
            <div className="location-reviews-actions">
              <a
                href="https://g.page/r/CdKUy82JtiCxEBM/review"
                target="_blank"
                rel="noreferrer"
                className="location-btn-review-action location-btn-leave-review"
              >
                Leave a review
              </a>
              <a
                href="https://www.google.com/search?q=gta+budget+painting&sca_esv=940aa337a8577638&sxsrf=AE3TifNtylDfUI_S-KMDjIttMFibc79Vug%3A1764705125378&ei=ZUMvad3cFpauiLMP28PdiAM&oq=gta+bud+painting&gs_lp=Egxnd3Mtd2l6LXNlcnAiEGd0YSBidWQgcGFpbnRpbmcqAggAMgYQABgHGB4yCBAAGIAEGKIEMgUQABjvBTIIEAAYgAQYogQyCBAAGIAEGKIESL4hUPIJWP4RcAJ4AJABAJgBdaAB1AKqAQMwLjO4AQHIAQD4AQGYAgWgAvECwgIIEAAYgAQYsAPCAg4QABiABBiKBRiGAxiwA8ICCxAAGIAEGKIEGLADwgIIEAAY7wUYsAPCAggQABgIGAcYHsICCxAAGIAEGIoFGIYDwgIIECEYoAEYwwSYAwCIBgGQBgeSBwMyLjOgB-gOsgcDMC4zuAfoAsIHBTAuMi4zyAcQ&sclient=gws-wiz-serp#mpd=~8742943454755315298/customers/reviews"
                target="_blank"
                rel="noreferrer"
                className="location-btn-review-action location-btn-view-more"
              >
                View more
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LocationPage;

