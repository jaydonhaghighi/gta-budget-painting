import React from 'react'
import './ServicesPage.css'

interface Service {
  name: string
  description: string
  features: string[]
  priceRange: string
  icon: string
}

interface ServiceCategory {
  title: string
  description: string
  services: Service[]
  categoryIcon: string
}

const ServicesPage: React.FC = () => {
  const serviceCategories: ServiceCategory[] = [
    {
      title: "Interior Painting",
      description: "Transform your indoor spaces with our professional interior painting services. We handle everything from single accent walls to complete room makeovers.",
      categoryIcon: "🏠",
      services: [
        {
          name: "Accent Wall Painting",
          description: "Create a stunning focal point in any room with a professionally painted accent wall that complements your existing decor.",
          features: [
            "Color consultation included",
            "Premium paint selection",
            "Precise edge work",
            "Furniture protection"
          ],
          priceRange: "$150 - $400",
          icon: "🎨"
        },
        {
          name: "Interior Touch-ups",
          description: "Quick and affordable touch-ups to refresh scuffs, scratches, and worn areas throughout your home.",
          features: [
            "Color matching service",
            "Small area repairs",
            "Quick turnaround",
            "Minimal disruption"
          ],
          priceRange: "$75 - $200",
          icon: "🖌️"
        },
        {
          name: "Kitchen or Bathroom Cabinet Painting",
          description: "Give your kitchen or bathroom a fresh new look with professional cabinet painting and refinishing services.",
          features: [
            "Cabinet door removal",
            "Professional sanding & prep",
            "High-quality cabinet paint",
            "Hardware reinstallation"
          ],
          priceRange: "$800 - $2,500",
          icon: "🏺"
        },
        {
          name: "Small Room Makeover",
          description: "Complete transformation of bedrooms, bathrooms, or small living spaces with professional painting services.",
          features: [
            "Complete room painting",
            "Ceiling & trim options",
            "Color coordination",
            "Full room preparation"
          ],
          priceRange: "$400 - $1,200",
          icon: "🛏️"
        },
        {
          name: "Window & Trim Repainting",
          description: "Refresh and protect your window frames, baseboards, and decorative trim with precision painting.",
          features: [
            "Detailed prep work",
            "Smooth finish application",
            "Caulking & sealing",
            "Clean, sharp lines"
          ],
          priceRange: "$200 - $600",
          icon: "🪟"
        },
        {
          name: "Other Interior Services",
          description: "Custom interior painting projects tailored to your specific needs and vision.",
          features: [
            "Custom project consultation",
            "Specialty finishes",
            "Decorative techniques",
            "Unique surface painting"
          ],
          priceRange: "Quote on request",
          icon: "✨"
        }
      ]
    },
    {
      title: "Exterior Painting",
      description: "Protect and enhance your property's curb appeal with our comprehensive exterior painting and staining services.",
      categoryIcon: "🏡",
      services: [
        {
          name: "Deck Staining/Painting",
          description: "Protect and beautify your deck with professional staining or painting services using weather-resistant products.",
          features: [
            "Pressure washing included",
            "Wood preparation & repair",
            "Weather-resistant stains",
            "Multiple coat application"
          ],
          priceRange: "$300 - $1,500",
          icon: "🏗️"
        },
        {
          name: "Exterior Touch-ups",
          description: "Address weathered areas, scratches, and fading on your home's exterior with targeted touch-up services.",
          features: [
            "Weather damage repair",
            "Color matching",
            "Spot priming & painting",
            "Protective coating application"
          ],
          priceRange: "$150 - $500",
          icon: "🔧"
        },
        {
          name: "Garage & Front Door Painting",
          description: "Enhance your home's entrance and garage with professional painting that boosts curb appeal and provides protection.",
          features: [
            "Surface preparation",
            "Weather-resistant paint",
            "Hardware removal/reinstall",
            "Detailed finish work"
          ],
          priceRange: "$200 - $800",
          icon: "🚪"
        },
        {
          name: "Porch or Stair Rail Painting",
          description: "Refresh and protect your porch railings, stair rails, and outdoor structural elements with durable exterior paint.",
          features: [
            "Rust treatment (if needed)",
            "Prime & paint application",
            "Detailed brush work",
            "Long-lasting protection"
          ],
          priceRange: "$150 - $600",
          icon: "🏛️"
        },
        {
          name: "Shed or Small Outbuilding Painting",
          description: "Complete exterior painting for sheds, workshops, and small outbuildings to match your property's aesthetic.",
          features: [
            "Complete exterior coverage",
            "Weatherproofing",
            "Trim & detail work",
            "Color coordination"
          ],
          priceRange: "$300 - $1,000",
          icon: "🏚️"
        },
        {
          name: "Other Exterior Services",
          description: "Custom exterior painting projects including fences, outdoor furniture, and specialty structures.",
          features: [
            "Fence painting/staining",
            "Outdoor furniture refinishing",
            "Custom exterior projects",
            "Specialty surface preparation"
          ],
          priceRange: "Quote on request",
          icon: "🎯"
        }
      ]
    },
    {
      title: "Specialty & Cleaning Services",
      description: "Professional cleaning and specialty services to prepare surfaces and maintain your property's appearance.",
      categoryIcon: "🧽",
      services: [
        {
          name: "Pressure Washing",
          description: "Professional pressure washing services to clean and prepare surfaces for painting or general maintenance.",
          features: [
            "House exterior cleaning",
            "Deck & patio cleaning",
            "Driveway & walkway cleaning",
            "Pre-painting surface prep"
          ],
          priceRange: "$150 - $500",
          icon: "💨"
        },
        {
          name: "Other Specialty Services",
          description: "Additional services including surface preparation, minor repairs, and specialty cleaning solutions.",
          features: [
            "Surface preparation",
            "Minor drywall repairs",
            "Caulking & sealing",
            "Consultation services"
          ],
          priceRange: "Quote on request",
          icon: "🛠️"
        }
      ]
    }
  ]

  const handleGetQuote = (serviceName: string) => {
    // This would typically navigate to the quote page with the service pre-selected
    console.log(`Get quote for: ${serviceName}`)
    // You could add logic here to pass the service to the quote calculator
  }

  return (
    <div className="services-page">
      <div className="services-hero">
        <div className="container">
          <h1>Our Professional Painting Services</h1>
          <p>Comprehensive interior, exterior, and specialty services to transform your property</p>
        </div>
      </div>

      <div className="services-content">
        <div className="container">
          {serviceCategories.map((category, categoryIndex) => (
            <section key={categoryIndex} className="service-category">
              <div className="category-header">
                <span className="category-icon">{category.categoryIcon}</span>
                <div className="category-info">
                  <h2>{category.title}</h2>
                  <p>{category.description}</p>
                </div>
              </div>

              <div className="services-grid">
                {category.services.map((service, serviceIndex) => (
                  <div key={serviceIndex} className="service-card">
                    <div className="service-header">
                      <span className="service-icon">{service.icon}</span>
                      <h3>{service.name}</h3>
                    </div>
                    
                    <p className="service-description">{service.description}</p>
                    
                    <div className="service-features">
                      <h4>What's Included:</h4>
                      <ul>
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="service-footer">
                      <div className="price-range">
                        <span className="price-label">Starting from:</span>
                        <span className="price">{service.priceRange}</span>
                      </div>
                      <button 
                        className="btn-get-quote"
                        onClick={() => handleGetQuote(service.name)}
                      >
                        Get Quote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="services-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Space?</h2>
            <p>Get a free, detailed quote for any of our professional painting services</p>
            <div className="cta-buttons">
              <button className="btn-primary-large">Get Free Quote</button>
              <button className="btn-secondary-large">Call (416) 555-PAINT</button>
            </div>
          </div>
        </div>
      </div>

      <div className="services-guarantee">
        <div className="container">
          <div className="guarantee-content">
            <h3>Our Service Guarantee</h3>
            <div className="guarantee-features">
              <div className="guarantee-item">
                <span className="guarantee-icon">✅</span>
                <div>
                  <h4>Quality Workmanship</h4>
                  <p>Professional results backed by years of experience</p>
                </div>
              </div>
              <div className="guarantee-item">
                <span className="guarantee-icon">🛡️</span>
                <div>
                  <h4>Fully Insured</h4>
                  <p>Licensed and insured for your complete peace of mind</p>
                </div>
              </div>
              <div className="guarantee-item">
                <span className="guarantee-icon">⏰</span>
                <div>
                  <h4>On-Time Completion</h4>
                  <p>We respect your schedule and complete projects as promised</p>
                </div>
              </div>
              <div className="guarantee-item">
                <span className="guarantee-icon">💰</span>
                <div>
                  <h4>Fair Pricing</h4>
                  <p>Competitive rates with no hidden fees or surprises</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServicesPage
