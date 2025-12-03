import { useRef, useState } from 'react';
import './ServiceForms.css';

interface ImageUploadProps {
  images: File[];
  imagePreviews: string[];
  onImagesChange: (newImages: File[], newPreviews: string[]) => void;
  maxImages?: number;
  required?: boolean;
}

const ImageUpload = ({
  images,
  imagePreviews,
  onImagesChange,
  maxImages = 5,
  required = false
}: ImageUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    // Filter only image files
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    // Limit to maxImages total
    const newImages = [...images, ...imageFiles].slice(0, maxImages);
    
    // Revoke old preview URLs to prevent memory leaks
    imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    
    // Create new previews
    const newPreviews = newImages.map(file => URL.createObjectURL(file));
    
    onImagesChange(newImages, newPreviews);
    
    // Reset file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

    if (images.length >= maxImages) return;

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const removeImage = (index: number) => {
    // Revoke the URL for the removed image
    URL.revokeObjectURL(imagePreviews[index]);
    
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    onImagesChange(newImages, newPreviews);
  };

  return (
    <div className="form-group">
      <label>
        Project Photos {required && <span className="required">*</span>}
      </label>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageSelect}
        style={{ display: 'none' }}
      />

      <div 
        className={`upload-area ${images.length >= maxImages ? 'disabled' : ''} ${isDragOver ? 'drag-over' : ''}`}
        onClick={() => images.length < maxImages && fileInputRef.current?.click()}
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
          <span className="upload-limit">
            {required ? 'At least 1 image required • ' : ''}
            Up to {maxImages} images • JPG, PNG, GIF
          </span>
        </div>
      </div>

      {images.length > 0 && (
        <div className="photo-gallery">
          <div className="gallery-header">
            <span>Uploaded Photos ({images.length}/{maxImages})</span>
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
  );
};

export default ImageUpload;








