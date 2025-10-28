import React from 'react';
import './GalleryPage.css';

interface GalleryItem {
  id: string;
  before: string;
  after: string;
  title: string;
  description?: string;
}

const GalleryPage = () => {
  const galleryItems: GalleryItem[] = [
    {
      id: 'work-1',
      before: '/gallery/gbp-work-1-after.png', // Using after as before since we don't have before
      after: '/gallery/gbp-work-1-after.png',
      title: 'Interior Room Transformation',
      description: 'Complete interior painting with modern color scheme'
    },
    {
      id: 'work-2',
      before: '/gallery/gbp-work-2-after.png', // Using after as before since we don't have before
      after: '/gallery/gbp-work-2-after.png',
      title: 'Living Space Makeover',
      description: 'Professional interior painting service'
    },
    {
      id: 'work-4',
      before: '/gallery/gbp-work-4-before.jpeg',
      after: '/gallery/gbp-work-4-after.jpeg',
      title: 'Kitchen Cabinet Refresh',
      description: 'Before and after kitchen cabinet painting'
    },
    {
      id: 'work-5',
      before: '/gallery/gbp-work-5-before.jpeg',
      after: '/gallery/gbp-work-5-after.jpeg',
      title: 'Bedroom Renovation',
      description: 'Complete bedroom transformation with new paint'
    },
    {
      id: 'work-6',
      before: '/gallery/gbp-work-6-before.jpeg',
      after: '/gallery/gbp-work-6-after.jpeg',
      title: 'Living Room Update',
      description: 'Modern living room painting project'
    },
    {
      id: 'work-7',
      before: '/gallery/gbp-work-7-before.jpeg', // Using after as before since we don't have before
      after: '/gallery/gbp-work-7-after.jpeg',
      title: 'Interior Painting Project',
      description: 'Professional interior painting service'
    },
    {
      id: 'work-8',
      before: '/gallery/gbp-work-8-before.jpeg',
      after: '/gallery/gbp-work-9-after.jpeg',
      title: 'Exterior Home Painting',
      description: 'Complete exterior home transformation'
    },
    {
      id: 'work-10',
      before: '/gallery/gbp-work-10-before.jpeg',
      after: '/gallery/gbp-work-10-after.jpeg',
      title: 'Multi-Room Project',
      description: 'Comprehensive interior painting across multiple rooms'
    },
    {
      id: 'work-12',
      before: '/gallery/gbp-work-12-before.jpeg',
      after: '/gallery/gbp-work-12-after.jpeg',
      title: 'Home Interior Update',
      description: 'Professional interior painting and renovation'
    }
  ];

  return (
    <div className="gallery-page">
      {/* Hero Section */}
      <section className="gallery-hero">
        <div className="container">
          <h1>Our Work Gallery</h1>
          <p className="gallery-subtitle">
            See the amazing transformations we've completed for our clients. 
            Each project showcases our commitment to quality and attention to detail.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="container">
          <div className="gallery-grid">
            {galleryItems.map((item) => (
              <div key={item.id} className="gallery-item">
                <div className="comparison-container">
                  <div className="before-after-labels">
                    <span className="before-label">Before</span>
                    <span className="after-label">After</span>
                  </div>
                  <div className="image-comparison">
                    <div className="image-container before-container">
                      <img 
                        src={item.before} 
                        alt={`${item.title} - Before`}
                        className="gallery-image"
                      />
                    </div>
                    <div className="image-container after-container">
                      <img 
                        src={item.after} 
                        alt={`${item.title} - After`}
                        className="gallery-image"
                      />
                    </div>
                  </div>
                </div>
                <div className="gallery-item-info">
                  <h3 className="gallery-item-title">{item.title}</h3>
                  {item.description && (
                    <p className="gallery-item-description">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;
