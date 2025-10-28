import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Service } from '../../data/services';
import './ServiceForms.css';

interface CustomQuoteServiceFormProps {
  service: Service;
  onSubmit?: (formData: any, images: File[]) => void;
}

const CustomQuoteServiceForm = ({ service, onSubmit }: CustomQuoteServiceFormProps) => {
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    // Filter only image files
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    // Limit to 5 images total
    const newImages = [...images, ...imageFiles].slice(0, 5);
    setImages(newImages);

    // Create previews
    const newPreviews = newImages.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (images.length >= 5) return;

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
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

    if (images.length === 0) {
      alert('Please upload at least one photo of your project');
      return;
    }

    // Create a temporary cart item for direct checkout
    const customProjectItem = {
      serviceId: service.id,
      serviceName: service.name,
      serviceType: 'custom-quote' as const,
      formData: {
        description,
        imageCount: images.length
      },
      estimate: {
        totalCost: 0, // Custom projects don't have fixed pricing
        laborHours: 0,
        totalHours: 0,
        setupCleanupHours: 0,
        paintGallons: 0,
        paintCost: 0,
        laborCost: 0,
        suppliesCost: 0,
        otherFees: 0,
        subtotal: 0
      },
      customProjectDetails: {
        description,
        images: images.map(img => ({
          name: img.name,
          size: img.size,
          type: img.type
        }))
      }
    };

    // Navigate directly to checkout with the custom project
    navigate('/checkout', {
      state: {
        isSingleService: true,
        singleService: customProjectItem,
        customImages: images
      }
    });
  };

  return (
    <div className="form-group-container custom-quote-form">
      <div className="form-header">
        <h3>Custom Project Details</h3>
        <p>Tell us about your custom painting project so we can provide an accurate quote</p>
      </div>

      {/* Project Description */}
      <div className="form-group">
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
      <div className="form-group">
        <label>Project Photos <span className="required">*</span></label>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          style={{ display: 'none' }}
        />

        <div 
          className={`upload-area ${images.length >= 5 ? 'disabled' : ''} ${isDragOver ? 'drag-over' : ''}`}
          onClick={() => images.length < 5 && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-content">
            <div className="upload-icon">
              <img src="/camera.svg" alt="Camera" />
            </div>
            <h4>
              {images.length > 0 ? 'Add More Photos' : 'Upload Photos'}
            </h4>
            <p>{isDragOver ? 'Drop images here' : 'Click to browse or drag & drop images here'}</p>
            <span className="upload-limit">At least 1 image required • Up to 5 images • JPG, PNG, GIF</span>
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
      <div className="form-group">
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={!description.trim() || images.length === 0}
        >
          Proceed to Submit Request
        </button>
      </div>
    </div>
  );
};

export default CustomQuoteServiceForm;

