import { useState, useRef } from 'react';
import { type Service } from '../../data/services';
import './ServiceForms.css';

interface CustomQuoteServiceFormProps {
  service: Service;
  onSubmit: (formData: any, images: File[]) => void;
}

const CustomQuoteServiceForm = ({ service, onSubmit }: CustomQuoteServiceFormProps) => {
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limit to 5 images
    const newImages = [...images, ...files].slice(0, 5);
    setImages(newImages);

    // Create previews
    const newPreviews = newImages.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      alert('Please provide a description of the work needed');
      return;
    }

    onSubmit({
      serviceId: service.id,
      serviceName: service.name,
      description,
      imageCount: images.length
    }, images);
  };

  return (
    <div className="simple-custom-form">
      <div className="form-container">
        <div className="form-header">
        </div>

        <div className="form-content">
          {/* Project Description */}
          <div className="form-section">
            <label htmlFor="description">
              Describe Your Project <span className="required">*</span>
            </label>
            <textarea
              id="description"
              rows={5}
              placeholder="Please describe the work you need done. Include details such as:
• Current condition of the area
• What needs to be painted
• Any damage or repairs needed
• Color preferences
• Special requirements or concerns"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className={description.length > 800 ? 'warning' : ''}
            />
            <div className="character-count">
              <span className={description.length > 800 ? 'warning' : ''}>
                {description.length} / 1000 characters
              </span>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="form-section">
            <label>Project Photos <span className="optional">(Optional)</span></label>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />

            <div 
              className={`upload-area ${images.length >= 5 ? 'disabled' : ''}`}
              onClick={() => images.length < 5 && fileInputRef.current?.click()}
            >
              <div className="upload-content">
                <div className="upload-icon">📷</div>
                <h4>
                  {images.length > 0 ? 'Add More Photos' : 'Upload Photos'}
                </h4>
                <p>Click to browse or drag & drop images here</p>
                <span className="upload-limit">Up to 5 images • JPG, PNG, GIF</span>
              </div>
            </div>

            {images.length > 0 && (
              <div className="photo-gallery">
                <div className="gallery-header">
                  <span>Uploaded Photos ({images.length}/5)</span>
                </div>
                <div className="photo-grid">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="photo-item">
                      <img src={preview} alt={`Project photo ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-photo"
                        onClick={() => removeImage(index)}
                        aria-label="Remove photo"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="submit-section">
            <button
              className="submit-button"
              onClick={handleSubmit}
              disabled={!description.trim()}
            >
              Submit for Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomQuoteServiceForm;

