import { useState } from 'react';
import './GalleryPage.css';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  type: 'before' | 'after';
  projectNumber: string;
  afterImageSrc?: string;
}

const GalleryPage = () => {
  const [toggledImages, setToggledImages] = useState<Set<string>>(new Set());

  const beforeImages: GalleryImage[] = [
    {
      id: 'work-4-before',
      src: '/gallery/gbp-work-4-before.jpeg',
      alt: 'Before painting - Project 4',
      title: 'Project 4 - Before',
      type: 'before',
      projectNumber: '4',
      afterImageSrc: '/gallery/gbp-work-4-after.jpeg'
    },
    {
      id: 'work-5-before',
      src: '/gallery/gbp-work-5-before.jpeg',
      alt: 'Before painting - Project 5',
      title: 'Project 5 - Before',
      type: 'before',
      projectNumber: '5',
      afterImageSrc: '/gallery/gbp-work-5-after.jpeg'
    },
    {
      id: 'work-6-before',
      src: '/gallery/gbp-work-6-before.jpeg',
      alt: 'Before painting - Project 6',
      title: 'Project 6 - Before',
      type: 'before',
      projectNumber: '6',
      afterImageSrc: '/gallery/gbp-work-6-after.jpeg'
    },
    {
      id: 'work-7-before',
      src: '/gallery/gbp-work-7-before.jpeg',
      alt: 'Before painting - Project 7',
      title: 'Project 7 - Before',
      type: 'before',
      projectNumber: '7',
      afterImageSrc: '/gallery/gbp-work-7-after.jpeg'
    },
    {
      id: 'work-8-before',
      src: '/gallery/gbp-work-8-before.jpeg',
      alt: 'Before painting - Project 8',
      title: 'Project 8 - Before',
      type: 'before',
      projectNumber: '8',
      afterImageSrc: '/gallery/gbp-work-8-after.jpeg'
    },
    {
      id: 'work-10-before',
      src: '/gallery/gbp-work-10-before.jpeg',
      alt: 'Before painting - Project 10',
      title: 'Project 10 - Before',
      type: 'before',
      projectNumber: '10',
      afterImageSrc: '/gallery/gbp-work-10-after.jpeg'
    },
    {
      id: 'work-12-before',
      src: '/gallery/gbp-work-12-before.jpeg',
      alt: 'Before painting - Project 12',
      title: 'Project 12 - Before',
      type: 'before',
      projectNumber: '12',
      afterImageSrc: '/gallery/gbp-work-12-after.jpeg'
    }
  ];

  const afterImages: GalleryImage[] = [
    {
      id: 'work-1-after',
      src: '/gallery/gbp-work-1-after.png',
      alt: 'Professional painting work - Project 1',
      title: 'Project 1 - After',
      type: 'after',
      projectNumber: '1'
    },
    {
      id: 'work-2-after',
      src: '/gallery/gbp-work-2-after.png',
      alt: 'Professional painting work - Project 2',
      title: 'Project 2 - After',
      type: 'after',
      projectNumber: '2'
    }
  ];

  const toggleImage = (image: GalleryImage) => {
    if (image.type === 'before' && image.afterImageSrc) {
      setToggledImages(prev => {
        const newSet = new Set(prev);
        if (newSet.has(image.id)) {
          newSet.delete(image.id);
        } else {
          newSet.add(image.id);
        }
        return newSet;
      });
    }
  };

  const getImageSrc = (image: GalleryImage) => {
    if (image.type === 'before' && image.afterImageSrc && toggledImages.has(image.id)) {
      return image.afterImageSrc;
    }
    return image.src;
  };

  return (
    <div className="gallery-page">
      <section className="gallery-hero">
        <div className="container">
          <h1>Our Work Gallery</h1>
          <p className="hero-subtitle">See the quality of our painting work through our project gallery</p>
        </div>
      </section>

      <section className="gallery-section">
        <div className="container">
          {/* Gallery Section */}
          <div className="gallery-section-content">
            <div className="gallery-grid">
              {beforeImages.map((image) => (
                <div 
                  key={image.id} 
                  className={`gallery-item ${toggledImages.has(image.id) ? 'toggled' : ''}`}
                  onClick={() => toggleImage(image)}
                >
                  <div className="gallery-image-container">
                    <img 
                      src={getImageSrc(image)} 
                      alt={image.alt}
                      className="gallery-image"
                      loading="lazy"
                    />
                    <div className="gallery-overlay">
                      <div className="gallery-overlay-content">
                        <span className="gallery-view-text">
                          {toggledImages.has(image.id) ? 'Click to see Before' : 'Click to see After'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {afterImages.map((image) => (
                <div 
                  key={image.id} 
                  className="gallery-item after-only"
                >
                  <div className="gallery-image-container">
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      className="gallery-image"
                      loading="lazy"
                    />
                    <div className="gallery-overlay after-overlay">
                      <div className="gallery-overlay-content">
                        <span className="gallery-view-text after-text">After</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          
        </div>
      </section>

    </div>
  );
};

export default GalleryPage;
