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
    <div className="custom-quote-service-form">
      <div className="custom-quote-card">
        <div className="quote-info">
          <h3>Get a Custom Quote</h3>
          <p>Help us understand your project by providing details and photos. Our team will review and send you a detailed quote within 24 hours.</p>
        </div>

        <div className="form-group">
          <label htmlFor="description">Project Description *</label>
          <textarea
            id="description"
            rows={6}
            placeholder="Please describe the work you need done. Include details such as:
                            • Current condition
                            • What needs to be painted
                            • Any damage or repairs needed
                            • Color preferences
                            • Special requirements or concerns"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <small>{description.length} / 1000 characters</small>
        </div>

        <div className="image-upload-section">
          <label>Upload Photos (Optional, but recommended)</label>
          <p className="upload-help">Photos help us provide more accurate quotes. Upload up to 5 images.</p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />

          <button
            type="button"
            className="btn-upload"
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= 5}
          >
            📷 {images.length > 0 ? 'Add More Photos' : 'Upload Photos'}
          </button>

          {images.length > 0 && (
            <div className="image-previews">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="image-preview">
                  <img src={preview} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    className="btn-remove-image"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <small className="upload-note">
            {images.length}/5 images uploaded
            {images.length >= 5 && ' (Maximum reached)'}
          </small>
        </div>

        <button
          className="btn-proceed"
          onClick={handleSubmit}
          disabled={!description.trim()}
        >
          Submit for Quote →
        </button>

        <div className="custom-quote-disclaimer">
          <strong>What happens next:</strong>
          <ol>
            <li>Our professionals review your request and photos</li>
            <li>We'll send you a detailed quote within 24 hours</li>
            <li>Once you approve, you can schedule and pay</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CustomQuoteServiceForm;

