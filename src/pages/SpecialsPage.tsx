import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';
import { PROMOTIONS, withPromotionDerived } from '../data/promotions';
import { buildPromotionEstimate } from '../utils/promotionEstimate';
import './SpecialsPage.css';

const SpecialsPage = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const promotions = PROMOTIONS.map(withPromotionDerived);

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
        description="Save on bundled interior painting packages in Toronto and the GTA. See current limited-time offers, pricing, and what's included."
        canonical="/specials"
      />

      <section className="specials-hero">
        <div className="container">
          <h1>Painting Specials and Package Deals in Toronto & GTA</h1>
          <p className="specials-hero-subtitle">
            Limited-time bundles designed for fast turnarounds and great value.
            Lock in your package and book your project today.
          </p>
        </div>
      </section>

      <section className="promotions-section">
        <div className="container">
          <div className="promotions-content">
            <div className="promotions-heading">
              <h2>Current Painting Offers</h2>
              <p className="promotions-subtitle">
                Freshen up your home this spring with limited-time bundles.
              </p>
            </div>
            <div className="promotions-grid">
              {promotions.map((promotion, index) => (
                <div
                  key={promotion.id}
                  className={`promotion-card ${index === 0 ? 'promotion-featured promotion-best-deal' : ''}`}
                >
                  {index === 0 && (
                    <div className="promotion-badge">Best Deal</div>
                  )}
                  <h3>{promotion.name}</h3>
                  <p className="promotion-subtitle">{promotion.subtitle}</p>
                  <div className="promotion-pricing">
                    <span className="promotion-price">${promotion.price.toLocaleString()} CAD</span>
                    <span className="promotion-original">Regular ${promotion.originalPrice.toLocaleString()} CAD</span>
                    <span className="promotion-savings">
                      Save ${promotion.savings.toLocaleString()} ({promotion.percentage}% off)
                    </span>
                  </div>
                  <ul className="promotion-features">
                    {promotion.features.map((feature, featureIndex) => (
                      <li key={featureIndex}>{feature}</li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleAddPromotionToCart(promotion.id)}
                    className="btn-primary promotion-cta"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SpecialsPage;
