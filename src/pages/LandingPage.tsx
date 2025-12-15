import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import './LandingPage.css';
import '../pages/ContactUsPage.css';
import { db } from '../firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { useCart } from '../context/CartContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [showPromoBanner, setShowPromoBanner] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [isHowItWorksExpanded, setIsHowItWorksExpanded] = useState(false);
  const [isWhyChooseUsExpanded, setIsWhyChooseUsExpanded] = useState(false);
  const [isAreasServedExpanded, setIsAreasServedExpanded] = useState(false);
  const [expandedBenefits, setExpandedBenefits] = useState<{ [key: number]: boolean }>({});
  const [expandedSteps, setExpandedSteps] = useState<{ [key: number]: boolean }>({});
  
  // Inquiry form state
  const [inqName, setInqName] = useState('');
  const [inqEmail, setInqEmail] = useState('');
  const [inqPhone, setInqPhone] = useState('');
  const [inqMessage, setInqMessage] = useState('');
  const [inqSubmitting, setInqSubmitting] = useState(false);
  const [inqSuccess, setInqSuccess] = useState<string | null>(null);
  const [inqError, setInqError] = useState<string | null>(null);

  // Reviews carousel state
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Real customer reviews from GTA Home Painting (ordered from earliest to latest)
  const reviews = [
    {
      name: "Sagi K.",
      rating: 5,
      date: "January 9, 2025",
      text: "We had an amazing experience with GTA Home Painting! Peter and his team did an outstanding job painting the entire interior of our house. They worked quickly, stayed on budget, and the results were absolutely flawless. We were so impressed with their work that we decided to have them paint our kitchen as well, and it turned out just as perfect. If you're looking for reliable, professional, and efficient painters, we highly recommend GTA Home Painting. Thank you, Peter and team, for transforming our home!"
    },
    {
      name: "Messia Khachadurian",
      rating: 5,
      date: "January 23, 2025",
      text: "Found out about this company through a mutual friend, and I can say they don't disappoint. Aryan made everything an easy process for me, from the estimate to the finishing touches. Would recommend everyone to give them a try if you're looking for a hassle free project at great prices."
    },
    {
      name: "T G",
      rating: 5,
      date: "July 24, 2025",
      text: "Peter was amazing to deal with - from the estimate, all the way through to project completion. I wouldn't hesitate to use him again in future. Highly recommend!"
    },
    {
      name: "Kiara C",
      rating: 5,
      date: "August 21, 2025",
      text: "Did an excellent job, no complaints at all. Helped us choose the perfect colour and completely transformed the house with a fresh, clean look."
    },
    {
      name: "Eva Leek",
      rating: 5,
      date: "September 11, 2025",
      text: "Highly recommend. Peter and his team were very professional, neat and tidy. Cleaned up after themselves each day. Peter is knowledgeable about paint and explained the process needed to cover the faded window trim. He even went to the paint store to colour match the original and helped pick the colour. Will definitely have him come back for future projects."
    },
    {
      name: "Farhood N",
      rating: 5,
      date: "September 30, 2025",
      text: "Pirouz is friendly and trustworthy. He painted my one bedroom unit in short notice and reasonable price between two tenants. Strongly suggest his services."
    },
    {
      name: "L",
      rating: 5,
      date: "October 1, 2025",
      text: "Peter and his team were great. Peter worked with me diligently on picking the right colors for my home. His dedication showed in the work they completed. I've worked with Peter and his team on another project at my home, and they were fantastic. Peter is incredibly efficient, thorough, and goes above and beyond to ensure everything meets your expectations. I highly recommend them."
    },
    {
      name: "Kris J",
      rating: 5,
      date: "October 2, 2025",
      text: "Peter and team did an amazing job painting our kitchen. We weren't sure what colour we wanted and he came in with his recommendations and colour swatches. It completely updated and changed our kitchen. His professionalism, expert advice and ability to get the job done quickly and of quality was great!"
    },
    {
      name: "Paul Lillakas",
      rating: 5,
      date: "October 16, 2025",
      text: "Peter provides an exceptional service that warrants high regard and recommendation. Not only is the quality of workmanship top notch, he is trustworthy and made us feel so comfortable from the first quote up to the completion of the job. He went above and beyond, helping us choose colour, finishes and then working with us on scheduling. I would give 6 stars if I could and would highly recommend him for any painting project!"
    }
  ];

  const promotions = [
    {
      id: 'january-jumpstart',
      name: 'January Jumpstart',
      subtitle: '3-Room Bundle',
      price: 1000,
      originalPrice: 1850,
      savings: 850,
      percentage: 46,
      features: [
        'Any 3 standard rooms (up to 12\'x12\' each)',
        'Walls painted (2 coats) in each room',
        'Minor wall patching included',
        'Full prep & cleanup included'
      ]
    },
    {
      id: 'first-impressions',
      name: 'First Impressions Package',
      subtitle: 'Entryway & Powder Room',
      price: 700,
      originalPrice: 850,
      savings: 150,
      percentage: 18,
      features: [
        'Foyer/Hallway walls painted (2 coats)',
        'Powder Room walls painted (2 coats)',
        'Baseboard painting included',
        'Minor wall patching included'
      ]
    },
    {
      id: 'holiday-feast',
      name: 'Holiday Feast Combo',
      subtitle: 'Kitchen & Dining Room',
      price: 750,
      originalPrice: 1250,
      savings: 500,
      percentage: 40,
      features: [
        'Kitchen walls painted (2 coats)',
        'Dining Room walls painted (2 coats)',
        'Premium washable/scrubbable paint included',
        'Minor wall patching included'
      ]
    },
    {
      id: 'guest-suite',
      name: 'Guest Suite Special',
      subtitle: 'Bedroom with Free Trim',
      price: 500,
      originalPrice: 950,
      savings: 450,
      percentage: 47,
      features: [
        'Bedroom walls painted (2 coats)',
        'Up to 12\'x12\' room size',
        'Baseboards painted (2 coats)',
        'Window casings painted (2 coats)'
      ]
    },
    {
      id: 'master-suite',
      name: 'Master Suite Bundle',
      subtitle: 'Bedroom + Ensuite',
      price: 800,
      originalPrice: 1050,
      savings: 250,
      percentage: 24,
      features: [
        'Master bedroom walls painted (2 coats)',
        'Ensuite bathroom walls painted (2 coats)',
        'Premium moisture-resistant paint in bathroom',
        'Minor wall patching included'
      ]
    },
    {
      id: 'living-space',
      name: 'Living Space Bundle',
      subtitle: 'Living Room + Hallway',
      price: 1100,
      originalPrice: 1550,
      savings: 450,
      percentage: 29,
      features: [
        'Living room walls painted (2 coats)',
        'Hallway/foyer walls painted (2 coats)',
        'Baseboard painting included (2 coats)',
        'Minor wall patching included'
      ]
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

  const isInquiryValid =
    inqName.trim().length > 0 &&
    inqMessage.trim().length > 0 &&
    (inqEmail.trim().length > 0 || inqPhone.trim().length > 0);

  const handleQuickInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInqSubmitting(true);
    setInqSuccess(null);
    setInqError(null);

    try {
      if (!inqName || (!inqEmail && !inqPhone) || !inqMessage) {
        throw new Error('Please provide your name, a contact (email or phone), and a brief message.');
      }

      const inquiryId = (await addDoc(collection(db, 'inquiries'), {
        name: inqName,
        email: inqEmail || null,
        phone: inqPhone || null,
        message: inqMessage,
        source: 'landing-page-quick-form',
        createdAt: Timestamp.fromDate(new Date())
      })).id;

      // Send emails via Cloud Function
      try {
        const emailResponse = await fetch('https://us-central1-gta-budget-painting.cloudfunctions.net/sendInquiryEmails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: inqName,
            email: inqEmail || undefined,
            phone: inqPhone || undefined,
            message: inqMessage,
            inquiryId: inquiryId,
            createdAt: new Date().toISOString()
          }),
        });

        if (emailResponse.ok) {
          const emailResult = await emailResponse.json();
          console.log('Inquiry emails sent successfully:', emailResult);
        } else {
          const errorText = await emailResponse.text();
          console.error('Failed to send inquiry emails:', emailResponse.status, errorText);
        }
      } catch (emailError) {
        console.error('Error calling email function:', emailError);
        // Don't fail the submission if email fails
      }

      setInqSuccess('Thanks! We received your message and will reach out shortly.');
      setInqName('');
      setInqEmail('');
      setInqPhone('');
      setInqMessage('');
    } catch (err: any) {
      setInqError(err?.message || 'Failed to send. Please try again.');
    } finally {
      setInqSubmitting(false);
    }
  };

  // Handle hash navigation with offset for fixed header
  const scrollToSection = (hash: string) => {
    const element = document.querySelector(hash);
    if (element) {
      const headerOffset = 150; // Adjust this value based on your header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Toggle step card expansion
  const toggleStep = (stepNumber: number) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepNumber]: !prev[stepNumber]
    }));
  };

  // Toggle benefit card expansion
  const toggleBenefit = (benefitNumber: number) => {
    setExpandedBenefits(prev => ({
      ...prev,
      [benefitNumber]: !prev[benefitNumber]
    }));
  };

  // Handle hash navigation
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#company-section' || hash === '#areas-served-section' || hash === '#how-it-works-section' || hash === '#inquiry-section') {
      setTimeout(() => {
        scrollToSection(hash);
      }, 100);
    }
  }, []);

  // Handle hash changes when already on the page
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#company-section' || hash === '#areas-served-section' || hash === '#how-it-works-section' || hash === '#inquiry-section') {
        setTimeout(() => {
          scrollToSection(hash);
        }, 100);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update body class when banner visibility changes
  useEffect(() => {
    if (showPromoBanner && !bannerDismissed) {
      document.body.classList.add('promo-banner-visible');
    } else {
      document.body.classList.remove('promo-banner-visible');
    }
    return () => {
      document.body.classList.remove('promo-banner-visible');
    };
  }, [showPromoBanner, bannerDismissed]);

  // Position banner directly below header
  useEffect(() => {
    const updateBannerPosition = () => {
      const header = document.querySelector('.header');
      const banner = document.querySelector('.sticky-promo-banner') as HTMLElement;
      if (header && banner) {
        const headerHeight = header.getBoundingClientRect().height;
        banner.style.top = `${headerHeight}px`;
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      updateBannerPosition();
    }, 100);
    
    // Update on resize
    window.addEventListener('resize', updateBannerPosition);
    
    // Also update when banner visibility changes
    if (showPromoBanner) {
      updateBannerPosition();
    }
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateBannerPosition);
    };
  }, [showPromoBanner]);

  // Scroll-triggered banner logic - show after scrolling past hero
  useEffect(() => {
    if (bannerDismissed) {
      setShowPromoBanner(false);
      return;
    }

    const handleScroll = () => {
      const heroSection = document.querySelector('.booking-hero');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        // Show banner when user scrolls past the hero section
        const scrolledPastHero = rect.bottom <= 0;
        setShowPromoBanner(scrolledPastHero);
      } else {
        // Fallback: show after scrolling 400px
        const scrollY = window.scrollY || window.pageYOffset;
        setShowPromoBanner(scrollY > 400);
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      handleScroll();
    }, 100);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [bannerDismissed]);


  // Auto-rotate reviews every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prevIndex) => 
        prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  const handleBannerDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBannerDismissed(true);
    setShowPromoBanner(false);
  };

  // Helper function to render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="review-stars">
        {[...Array(5)].map((_, index) => (
          <span 
            key={index} 
            className={`star ${index < rating ? 'filled' : 'empty'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };


  return (
    <div className="landing-page">
      <SEO 
        title="Budget Painters Toronto | Fast Turnaround & Great Results | GTA Budget Painting"
        description="Need painting on a budget with fast turnaround? We specialize in small residential jobs across Toronto & the GTA—clean work, great results, and free quotes."
        canonical="/"
      />

      {/* Sticky Promotion Banner */}
      <div className={`sticky-promo-banner ${showPromoBanner ? 'show' : 'hidden'}`}>
        <div className="promo-banner-content">
          <span 
            className="promo-banner-text"
            onClick={() => scrollToSection('#promotions-section')}
            style={{ cursor: 'pointer' }}
          >
            {/* <img src="/megaphone.svg" alt="Megaphone" className="promo-banner-icon" /> */}
            Limited Time Deal! <span className="deal-bubble">15% off $1000+ painting jobs - Ends January 15th!</span>
          </span>
          <button className="promo-banner-close" onClick={handleBannerDismiss}>×</button>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="booking-hero">
        <div className="container">
          <h1>Quick & Affordable Painting for Small Residential Jobs in the GTA</h1>
          <p className="hero-subtitle">We specialize in quick turnaround times and great results for homeowners on a budget. Get free instant quotes now.</p>
          
          {/* Contact Info */}
          <div className="hero-contact">
            <a href="tel:6473907181" className="hero-contact-link">
              <img src="/telephone.png" alt="Phone" className="hero-contact-icon" />
              <span className="hero-contact-text">Call (647) 390-7181</span>
            </a>
            <button 
              className="hero-services-btn"
              onClick={() => navigate('/services')}
            >
              <img src="/paint-roller.svg" alt="Paint Roller" className="hero-services-icon" />
              Our Services
            </button>
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      <section id="promotions-section" className="promotions-section">
        <div className="container">
          <div className="promotions-content">
            <div className="promotions-heading">
              <h2>Winter Holiday Specials</h2>
              <p className="promotions-subtitle">
                Wow your guests this winter! All promotions end January 31st. Lock in your painting deal and get your home party-ready!
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
                    <span className="promotion-savings">Save ${promotion.savings.toLocaleString()} ({promotion.percentage}% off)</span>
                  </div>
                  <ul className="promotion-features">
                    {promotion.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
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

      {/* Company Section */}
      <section id="company-section" className="company-section">
        <div className="container">
          <div className="company-content">
            <div className="company-text">
              <div className="company-text-content">
                <h2>About GTA Budget Painting</h2>
                <p className="company-description">
                <span>GTA Budget Painting is a specialized division of <b style={{color: '#800000'}}><a href="https://gtahomepainting.ca" target="_blank" rel="noopener noreferrer">GTA Home Painting</a></b>, dedicated to serving homeowners who need high-quality, affordable painting for smaller projects. We specialize in residential interior and exterior painting for homes, condos, and apartments across the Greater Toronto Area. While many contractors overlook small jobs, our professional painters are committed to delivering exceptional results, quick turnarounds, and budget-friendly pricing for every project, no matter the size.</span>
                </p>
              </div>
              <div className="company-image">
                <img src="/partnership.png" alt="Professional painting team at work" className="company-photo" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works-section" className="how-it-works-section">
        <div className="container">
          <div className="how-it-works-content">
            <button 
              className="how-it-works-toggle"
              onClick={() => setIsHowItWorksExpanded(!isHowItWorksExpanded)}
              aria-expanded={isHowItWorksExpanded}
              aria-controls="how-it-works-collapsible"
            >
              <h2>How to Book Your Service?</h2>
              <span className={`how-it-works-toggle-icon ${isHowItWorksExpanded ? 'open' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
            <div 
              id="how-it-works-collapsible"
              className={`how-it-works-collapsible ${isHowItWorksExpanded ? 'open' : ''}`}
            >
              <div className="how-it-works-text">
                <div className="steps-container">
                  <div className="step-card">
                    <button 
                      className="step-card-header"
                      onClick={() => toggleStep(1)}
                      aria-expanded={expandedSteps[1]}
                    >
                      <div className="step-header-content">
                        <div className="step-number">1</div>
                        <div className="step-icon">
                          <img src="/folder.svg" alt="Browse" />
                        </div>
                        <h3>Browse Services</h3>
                      </div>
                      <span className={`step-toggle-icon ${expandedSteps[1] ? 'open' : ''}`}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </button>
                    <div className={`step-card-content ${expandedSteps[1] ? 'open' : ''}`}>
                      <p>Explore our wide range of interior and exterior painting services.</p>
                      <button 
                        className="step-action-btn"
                        onClick={() => navigate('/services')}
                      >
                        View Services
                      </button>
                    </div>
              </div>

              <div className="step-connector">
                <div className="connector-line"></div>
                <div className="connector-arrow">→</div>
              </div>

              <div className="step-card">
                    <button 
                      className="step-card-header"
                      onClick={() => toggleStep(2)}
                      aria-expanded={expandedSteps[2]}
                    >
                      <div className="step-header-content">
                        <div className="step-number">2</div>
                        <div className="step-icon">
                          <img src="/paint-roller.svg" alt="Select" />
                        </div>
                        <h3>Select Your Service</h3>
                      </div>
                      <span className={`step-toggle-icon ${expandedSteps[2] ? 'open' : ''}`}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </button>
                    <div className={`step-card-content ${expandedSteps[2] ? 'open' : ''}`}>
                      <p>Click on the service you need. You'll see detailed information about what's included, pricing options, and service details.</p>
                    </div>
              </div>

              <div className="step-connector">
                <div className="connector-line"></div>
                <div className="connector-arrow">→</div>
              </div>

              <div className="step-card">
                    <button 
                      className="step-card-header"
                      onClick={() => toggleStep(3)}
                      aria-expanded={expandedSteps[3]}
                    >
                      <div className="step-header-content">
                        <div className="step-number">3</div>
                        <div className="step-icon">
                          <img src="/calculator-bill.svg" alt="Calculate" />
                        </div>
                        <h3>Get Estimate or Contact Us</h3>
                      </div>
                      <span className={`step-toggle-icon ${expandedSteps[3] ? 'open' : ''}`}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </button>
                    <div className={`step-card-content ${expandedSteps[3] ? 'open' : ''}`}>
                      <p>Fill out our form for an instant estimate, or skip ahead and contact us directly for a personalized quote.</p>
                      <div className="step-contact-actions">
                        <a 
                          href="#inquiry-section" 
                          className="step-contact-btn step-email-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToSection('#inquiry-section');
                          }}
                        >
                          Send Inquiry
                        </a>
                        <a href="tel:6473907181" className="step-contact-btn step-phone-btn">
                          Call Us
                        </a>
                      </div>
                    </div>
              </div>

              <div className="step-connector">
                <div className="connector-line"></div>
                <div className="connector-arrow">→</div>
              </div>

              <div className="step-card">
                    <button 
                      className="step-card-header"
                      onClick={() => toggleStep(4)}
                      aria-expanded={expandedSteps[4]}
                    >
                      <div className="step-header-content">
                        <div className="step-number">4</div>
                        <div className="step-icon">
                          <img src="/shopping-cart.png" alt="Cart" />
                        </div>
                        <h3>Add to Cart (Optional)</h3>
                      </div>
                      <span className={`step-toggle-icon ${expandedSteps[4] ? 'open' : ''}`}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </button>
                    <div className={`step-card-content ${expandedSteps[4] ? 'open' : ''}`}>
                      <p>Need multiple services? Add them to your cart and book everything at once. You can also proceed directly to checkout for a single service.</p>
                    </div>
              </div>

              <div className="step-connector">
                <div className="connector-line"></div>
                <div className="connector-arrow">→</div>
              </div>

              <div className="step-card">
                    <button 
                      className="step-card-header"
                      onClick={() => toggleStep(5)}
                      aria-expanded={expandedSteps[5]}
                    >
                      <div className="step-header-content">
                        <div className="step-number">5</div>
                        <div className="step-icon">
                          <img src="/checkout/clipboard.svg" alt="Checkout" />
                        </div>
                        <h3>Complete Your Booking</h3>
                      </div>
                      <span className={`step-toggle-icon ${expandedSteps[5] ? 'open' : ''}`}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </button>
                    <div className={`step-card-content ${expandedSteps[5] ? 'open' : ''}`}>
                      <p>Enter your contact information, preferred dates, and any special requirements. Review your order summary and submit your request.</p>
                    </div>
              </div>

              <div className="step-connector">
                <div className="connector-line"></div>
                <div className="connector-arrow">→</div>
              </div>

              <div className="step-card">
                    <button 
                      className="step-card-header"
                      onClick={() => toggleStep(6)}
                      aria-expanded={expandedSteps[6]}
                    >
                      <div className="step-header-content">
                        <div className="step-number">6</div>
                        <div className="step-icon">
                          <img src="/checkout/info.svg" alt="Confirm" />
                        </div>
                        <h3>Receive Confirmation</h3>
                      </div>
                      <span className={`step-toggle-icon ${expandedSteps[6] ? 'open' : ''}`}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </button>
                    <div className={`step-card-content ${expandedSteps[6] ? 'open' : ''}`}>
                      <p>We'll send you a confirmation email and our team will contact you within 24 hours to schedule your service and answer any questions.</p>
                    </div>
              </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-choose-us-section" className="why-choose-us-section">
        <div className="container">
          <div className="why-choose-us-content">
            <button 
              className="why-choose-us-toggle"
              onClick={() => setIsWhyChooseUsExpanded(!isWhyChooseUsExpanded)}
              aria-expanded={isWhyChooseUsExpanded}
              aria-controls="why-choose-us-collapsible"
            >
              <h2>Why Choose GTA Budget Painting?</h2>
              <span className={`why-choose-us-toggle-icon ${isWhyChooseUsExpanded ? 'open' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
            <div 
              id="why-choose-us-collapsible"
              className={`why-choose-us-collapsible ${isWhyChooseUsExpanded ? 'open' : ''}`}
            >
              <div className="why-choose-us-text">
                <div className="benefits-grid">
            <div className="benefit-card">
              <button 
                className="benefit-card-header"
                onClick={() => toggleBenefit(1)}
                aria-expanded={expandedBenefits[1]}
              >
                <div className="benefit-header-content">
                  <h3>Budget-Friendly Pricing</h3>
                </div>
                <span className={`benefit-toggle-icon ${expandedBenefits[1] ? 'open' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
              <div className={`benefit-card-content ${expandedBenefits[1] ? 'open' : ''}`}>
                <p>Affordable rates designed for homeowners who need quality work without breaking the bank</p>
              </div>
            </div>
            <div className="benefit-card">
              <button 
                className="benefit-card-header"
                onClick={() => toggleBenefit(2)}
                aria-expanded={expandedBenefits[2]}
              >
                <div className="benefit-header-content">
                  <h3>Free Instant Estimates</h3>
                </div>
                <span className={`benefit-toggle-icon ${expandedBenefits[2] ? 'open' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
              <div className={`benefit-card-content ${expandedBenefits[2] ? 'open' : ''}`}>
                <p>Get free quotes online in minutes - no waiting, no obligation, transparent pricing upfront</p>
              </div>
            </div>
            <div className="benefit-card">
              <button 
                className="benefit-card-header"
                onClick={() => toggleBenefit(3)}
                aria-expanded={expandedBenefits[3]}
              >
                <div className="benefit-header-content">
                  <h3>Quick Turnaround</h3>
                </div>
                <span className={`benefit-toggle-icon ${expandedBenefits[3] ? 'open' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
              <div className={`benefit-card-content ${expandedBenefits[3] ? 'open' : ''}`}>
                <p>Fast completion times - we understand you need your space back quickly and efficiently</p>
              </div>
            </div>
            <div className="benefit-card">
              <button 
                className="benefit-card-header"
                onClick={() => toggleBenefit(4)}
                aria-expanded={expandedBenefits[4]}
              >
                <div className="benefit-header-content">
                  <h3>No Hidden Fees</h3>
                </div>
                <span className={`benefit-toggle-icon ${expandedBenefits[4] ? 'open' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
              <div className={`benefit-card-content ${expandedBenefits[4] ? 'open' : ''}`}>
                <p>What you see is what you pay - honest, upfront pricing with no surprises or extra charges</p>
              </div>
            </div>
            <div className="benefit-card">
              <button 
                className="benefit-card-header"
                onClick={() => toggleBenefit(5)}
                aria-expanded={expandedBenefits[5]}
              >
                <div className="benefit-header-content">
                  <h3>Small Jobs Welcome</h3>
                </div>
                <span className={`benefit-toggle-icon ${expandedBenefits[5] ? 'open' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
              <div className={`benefit-card-content ${expandedBenefits[5] ? 'open' : ''}`}>
                <p>We take on projects of all sizes - from single rooms to full homes, no job too small</p>
              </div>
            </div>
            <div className="benefit-card">
              <button 
                className="benefit-card-header"
                onClick={() => toggleBenefit(6)}
                aria-expanded={expandedBenefits[6]}
              >
                <div className="benefit-header-content">
                  <h3>Fast Response Time</h3>
                </div>
                <span className={`benefit-toggle-icon ${expandedBenefits[6] ? 'open' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
              <div className={`benefit-card-content ${expandedBenefits[6] ? 'open' : ''}`}>
                <p>Quick replies to inquiries and flexible scheduling to fit your timeline and budget</p>
              </div>
            </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Areas Served Section */}
      <section id="areas-served-section" className="areas-served-section">
        <div className="container">
          <div className="areas-served-content">
            <button 
              className="areas-served-toggle"
              onClick={() => setIsAreasServedExpanded(!isAreasServedExpanded)}
              aria-expanded={isAreasServedExpanded}
              aria-controls="areas-served-collapsible"
            >
              <h2>Service Areas</h2>
              <span className={`areas-served-toggle-icon ${isAreasServedExpanded ? 'open' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
            <div 
              id="areas-served-collapsible"
              className={`areas-served-collapsible ${isAreasServedExpanded ? 'open' : ''}`}
            >
              <div className="areas-served-text">
                <div className="areas-content">
                  <div className="areas-text">
                    <div className="areas-text-content">
                      <p className="areas-description">
                        We proudly serve the entire Greater Toronto Area, bringing professional painting services to communities across the region. From downtown Toronto to the outer suburbs, our experienced team is ready to transform your space.
                      </p>
                      <div className="areas-list">
                        <div className="areas-column">
                          <ul>
                            <li>Vaughan</li>
                            <li>Richmond Hill</li>
                            <li>Markham</li>
                            <li>Thornhill</li>
                            <li>Woodbridge</li>
                            <li>Maple</li>
                          </ul>
                        </div>
                        <div className="areas-column">
                          <ul>
                            <li>Downtown Toronto</li>
                            <li>North York</li>
                            <li>Scarborough</li>
                            <li>Etobicoke</li>
                            <li>York</li>
                            <li>East York</li>
                          </ul>
                        </div>
                        <div className="areas-column">
                          <ul>
                            <li>Mississauga</li>
                            <li>Brampton</li>
                            <li>Oakville</li>
                            <li>Burlington</li>
                            <li>Milton</li>
                            <li>Caledon</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="areas-image">
                      <img src="/bc3b5c629ebb79ac398492a345c50337.jpg" alt="Beautiful painted kitchen interior" className="areas-photo" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Inquiry Section */}
      <section id="inquiry-section" className="inquiry-section">
        <div className="container">
          <div className="inquiry-content">
            <div className="inquiry-text">
              <div className="inquiry-form-content">
                <h2>Get a Free Quote Now!</h2>
                <form className="quick-inquiry-form" onSubmit={handleQuickInquirySubmit} autoComplete="on">
                  <div className="qi-row">
                    <input
                      type="text"
                      id="inq-name"
                      name="name"
                      placeholder="Your name *"
                      value={inqName}
                      onChange={(e) => setInqName(e.target.value)}
                      autoComplete="name"
                      aria-label="Your name"
                    />
                  </div>
                  <div className="qi-row qi-grid-2">
                    <input
                      type="email"
                      id="inq-email"
                      name="email"
                      placeholder="Email"
                      value={inqEmail}
                      onChange={(e) => setInqEmail(e.target.value)}
                      autoComplete="email"
                      aria-label="Email"
                    />
                    <input
                      type="tel"
                      id="inq-phone"
                      name="phone"
                      placeholder="Phone"
                      value={inqPhone}
                      onChange={(e) => setInqPhone(e.target.value)}
                      autoComplete="tel"
                      aria-label="Phone"
                    />
                  </div>
                  <div className="qi-row">
                    <textarea
                      name="message"
                      placeholder="How can we help? *"
                      rows={3}
                      value={inqMessage}
                      onChange={(e) => setInqMessage(e.target.value)}
                      aria-label="Message"
                    />
                  </div>
                  {inqError && <div className="qi-alert error">{inqError}</div>}
                  {inqSuccess && <div className="qi-alert success">{inqSuccess}</div>}
                  <button className="btn-primary" type="submit" disabled={inqSubmitting || !isInquiryValid}>
                    {inqSubmitting ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Carousel Section */}
      <section className="reviews-section">
        <div className="container">
          <h2 className="reviews-title">What Our Customers Say</h2>
          <p className="reviews-disclosure">
            As a division of <a href="https://gtahomepainting.ca" target="_blank" rel="noopener noreferrer">GTA Home Painting</a>, we share the same commitment to quality. Here's what our customers say:
          </p>
          <div className="reviews-carousel">
            <div className="review-card">
              {renderStars(reviews[currentReviewIndex].rating)}
              <p className="review-text">"{reviews[currentReviewIndex].text}"</p>
              <div className="review-footer">
                <p className="review-author">— {reviews[currentReviewIndex].name}</p>
                <p className="review-date">{reviews[currentReviewIndex].date}</p>
              </div>
            </div>
            <div className="carousel-dots">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentReviewIndex ? 'active' : ''}`}
                  onClick={() => setCurrentReviewIndex(index)}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
            <div className="reviews-actions">
              <a 
                href="https://g.page/r/CdKUy82JtiCxEBM/review" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-review-action btn-leave-review"
              >
                Leave a Review
              </a>
              <a 
                href="https://www.google.com/search?q=gta+home+painting&sca_esv=0ce76fe6310e19b4&sxsrf=AE3TifOkPPPLeZSTrvYNiPivlQ3cqIf5Og%3A1762474120210&ei=iDgNacHBDJ615NoPuq7ksAE&ved=0ahUKEwjBpfHe396QAxWeGlkFHToXGRYQ4dUDCBE&uact=5&oq=gta+home+painting&gs_lp=Egxnd3Mtd2l6LXNlcnAiEWd0YSBob21lIHBhaW50aW5nMgoQIxiABBgnGIoFMgUQABiABDIIEAAYgAQYogQyBRAAGO8FMgUQABjvBUiCJVC-C1j8I3ACeAGQAQCYAcQBoAGoDqoBAzguObgBA8gBAPgBAZgCE6AChA_CAgoQABiwAxjWBBhHwgINEAAYgAQYsAMYQxiKBcICDhAAGLADGOQCGNYE2AEBwgIZEC4YgAQYsAMY0QMYQxjHARjIAxiKBdgBAcICChAAGIAEGEMYigXCAgsQABiABBixAxiDAcICEBAAGIAEGLEDGEMYgwEYigXCAhEQLhiABBixAxjRAxiDARjHAcICBxAjGCcYyQLCAhAQABiABBixAxiDARgUGIcCwgILEC4YgAQYsQMYgwHCAg4QABiABBixAxiDARiKBcICDhAuGIAEGLEDGIMBGNQCwgIQEC4YgAQYsQMYQxiDARiKBcICExAuGIAEGLEDGEMYgwEY1AIYigXCAg0QLhiABBixAxhDGIoFwgIFEC4YgATCAgsQLhiABBjHARivAcICERAuGIAEGMcBGJgFGJkFGK8BwgIIEAAYFhgKGB7CAgYQABgWGB7CAggQABiiBBiJBcICCxAAGIAEGIYDGIoFmAMAiAYBkAYRugYGCAEQARgJkgcGOC4xMC4xoAecnAGyBwY2LjEwLjG4B_sOwgcGMC44LjExyAc_&sclient=gws-wiz-serp#mpd=~7080208788974348707/customers/reviews" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-review-action btn-view-more"
              >
                View More Reviews
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;


