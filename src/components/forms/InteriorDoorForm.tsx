import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { type Service } from '../../data/services';
import { useCart } from '../../context/CartContext';
import ImageUpload from './ImageUpload';
import './ServiceForms.css';

interface InteriorDoorFormProps {
  service: Service;
  onProceed: (formData: any) => void;
  initialFormData?: any;
}

const InteriorDoorForm = ({ service, initialFormData }: InteriorDoorFormProps) => {
  const [doorCount, setDoorCount] = useState<number>(initialFormData?.doorCount || 1);
  const [includeDoorFrames, setIncludeDoorFrames] = useState<boolean>(initialFormData?.includeDoorFrames || false);
  const [includeHardware, setIncludeHardware] = useState<boolean>(initialFormData?.includeHardware || false);
  const [images, setImages] = useState<File[]>(initialFormData?.images || []);
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialFormData?.imagePreviews || []);

  const handleImagesChange = (newImages: File[], newPreviews: string[]) => {
    setImages(newImages);
    setImagePreviews(newPreviews);
  };
  
  const { addItem, updateItem } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're editing an existing cart item
  const urlParams = new URLSearchParams(location.search);
  const editId = urlParams.get('editId');

  const basePrice = 75; // $75 per door
  const framePrice = 25; // $25 per door for frames
  const hardwarePrice = 15; // $15 per door for hardware

  const calculateTotal = () => {
    let total = doorCount * basePrice;
    if (includeDoorFrames) total += doorCount * framePrice;
    if (includeHardware) total += doorCount * hardwarePrice;
    return total;
  };

  const handleAddToCart = () => {
    const totalPrice = calculateTotal();
    
    // Create estimate breakdown for cart
    const estimate = {
      laborHours: Math.ceil(doorCount * 1.5), // 1.5 hours per door
      setupCleanupHours: 1,
      totalHours: Math.ceil(doorCount * 1.5) + 1,
      laborCost: totalPrice * 0.7, // 70% labor
      paintGallons: Math.ceil(doorCount * 0.25), // 0.25 gallons per door
      paintCost: Math.ceil(doorCount * 0.25) * 45, // $45 per gallon
      suppliesCost: totalPrice * 0.3, // 30% supplies
      otherFees: 0,
      subtotal: totalPrice,
      totalCost: totalPrice
    };

    const cartItem = {
      serviceId: service.id,
      serviceName: service.name,
      serviceType: service.type,
      estimate: estimate,
      formData: {
        doorCount,
        includeDoorFrames,
        includeHardware,
        totalPrice,
        images,
        imagePreviews
      }
    };

    if (editId) {
      // Update existing cart item
      updateItem(editId, cartItem);
    } else {
      // Add new cart item
      addItem(cartItem);
    }

    // Navigate to cart
    navigate('/cart');
  };

  return (
    <div className="interior-door-form-container">
      <div className="interior-door-card-container">

        {/* Price Display
        <div className="interior-door-price-display">
          <div className="interior-door-price-label">Per Door Pricing</div>
          <div className="interior-door-price-amount">${basePrice}</div>
          <div className="interior-door-price-note">Base rate per interior door</div>
        </div> */}

        {/* Door Count Input */}
        <div className="interior-door-form-section">
          <h4>Number of Doors</h4>
          <div className="interior-door-count-input">
            <button 
              className="interior-door-count-btn" 
              onClick={() => setDoorCount(Math.max(1, doorCount - 1))}
              disabled={doorCount <= 1}
            >
              −
            </button>
            <input
              type="number"
              value={doorCount}
              onChange={(e) => setDoorCount(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max="20"
              className="interior-door-count-input-field"
            />
            <button 
              className="interior-door-count-btn" 
              onClick={() => setDoorCount(Math.min(20, doorCount + 1))}
              disabled={doorCount >= 20}
            >
              +
            </button>
          </div>
        </div>

        {/* Additional Services */}
        <div className="interior-door-form-section">
          <h4>Additional Services</h4>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeDoorFrames}
                onChange={(e) => setIncludeDoorFrames(e.target.checked)}
              />
              <span>Include Door Frames/Trim (+${framePrice} per door)</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeHardware}
                onChange={(e) => setIncludeHardware(e.target.checked)}
              />
              <span>Include Hardware Removal/Replacement (+${hardwarePrice} per door)</span>
            </label>
          </div>
        </div>

        {/* Total Price Display */}
        <div className="interior-door-total-price-display">
          <div className="interior-door-total-label">Total Estimate</div>
          <div className="interior-door-total-amount">${calculateTotal()}</div>
        </div>

        <ImageUpload
          images={images}
          imagePreviews={imagePreviews}
          onImagesChange={handleImagesChange}
          maxImages={5}
          required={false}
        />

        <button
          className="interior-door-btn-proceed"
          onClick={handleAddToCart}
        >
          {editId ? 'Update Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default InteriorDoorForm;
