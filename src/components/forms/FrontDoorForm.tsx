import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { type Service } from '../../data/services';

interface FrontDoorFormProps {
  service: Service;
  onProceed: (formData: any) => void;
  initialFormData?: any;
}

const FrontDoorForm = ({ service, initialFormData }: FrontDoorFormProps) => {
  const [doorCount, setDoorCount] = useState<number>(initialFormData?.doorCount || 1);
  const [includeDoorFrames, setIncludeDoorFrames] = useState<boolean>(initialFormData?.includeDoorFrames || false);
  const [includeHardware, setIncludeHardware] = useState<boolean>(initialFormData?.includeHardware || false);
  const [includeWeatherproofing, setIncludeWeatherproofing] = useState<boolean>(initialFormData?.includeWeatherproofing || true);
  
  const { addItem, updateItem } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're editing an existing cart item
  const urlParams = new URLSearchParams(location.search);
  const editId = urlParams.get('editId');

  const basePrice = 150; // $150 per front door
  const framePrice = 25; // $25 per door for frames/trim
  const hardwarePrice = 20; // $20 per door for hardware
  const weatherproofingPrice = 25; // $25 per door for weatherproofing (caulking, sealing)

  const calculateTotal = () => {
    let total = doorCount * basePrice;
    if (includeDoorFrames) total += doorCount * framePrice;
    if (includeHardware) total += doorCount * hardwarePrice;
    if (includeWeatherproofing) total += doorCount * weatherproofingPrice;
    return total;
  };

  const handleAddToCart = () => {
    const totalPrice = calculateTotal();
    const formData = {
      doorCount,
      includeDoorFrames,
      includeHardware,
      includeWeatherproofing,
      totalPrice
    };

    if (editId) {
      // Update existing cart item
      updateItem(editId, {
        serviceId: service.id,
        serviceName: service.name,
        serviceType: service.type,
        estimate: {
          laborHours: doorCount * 2, // 2 hours per door for front doors
          setupCleanupHours: 1,
          totalHours: (doorCount * 2) + 1,
          laborCost: totalPrice * 0.6, // 60% labor
          paintGallons: Math.ceil(doorCount * 0.5), // 0.5 gallons per door
          paintCost: totalPrice * 0.25, // 25% paint
          suppliesCost: totalPrice * 0.1, // 10% supplies
          otherFees: totalPrice * 0.05, // 5% prep fee
          subtotal: totalPrice,
          totalCost: totalPrice
        },
        formData: formData
      });
    } else {
      // Add new cart item
      addItem({
        serviceId: service.id,
        serviceName: service.name,
        serviceType: service.type,
        estimate: {
          laborHours: doorCount * 2,
          setupCleanupHours: 1,
          totalHours: (doorCount * 2) + 1,
          laborCost: totalPrice * 0.6,
          paintGallons: Math.ceil(doorCount * 0.5),
          paintCost: totalPrice * 0.25,
          suppliesCost: totalPrice * 0.1,
          otherFees: totalPrice * 0.05,
          subtotal: totalPrice,
          totalCost: totalPrice
        },
        formData: formData
      });
    }

    // Navigate to cart
    navigate('/cart');
  };

  return (
    <div className="front-door-form-container">
      <div className="front-door-card-container">

        {/* Price Display */}
        <div className="front-door-price-display">
          <div className="front-door-price-label">Per Door Pricing</div>
          <div className="front-door-price-amount">${basePrice}</div>
          <div className="front-door-price-note">Base rate per front door</div>
        </div>

        {/* Door Count Input */}
        <div className="front-door-form-section">
          <h4>Number of Front Doors</h4>
          <div className="front-door-count-input">
            <button 
              className="front-door-count-btn" 
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
              max="10"
              className="front-door-count-input-field"
            />
            <button 
              className="front-door-count-btn" 
              onClick={() => setDoorCount(Math.min(10, doorCount + 1))}
              disabled={doorCount >= 10}
            >
              +
            </button>
          </div>
        </div>

        {/* Additional Services */}
        <div className="front-door-form-section">
          <h4>Additional Services</h4>
          <div className="front-door-checkbox-group">
            <label className="front-door-checkbox-label">
              <input
                type="checkbox"
                checked={includeDoorFrames}
                onChange={(e) => setIncludeDoorFrames(e.target.checked)}
              />
              <span>Include Door Frames/Trim (+${framePrice} per door)</span>
            </label>
            <label className="front-door-checkbox-label">
              <input
                type="checkbox"
                checked={includeHardware}
                onChange={(e) => setIncludeHardware(e.target.checked)}
              />
              <span>Include Hardware Removal/Replacement (+${hardwarePrice} per door)</span>
            </label>
            <label className="front-door-checkbox-label">
              <input
                type="checkbox"
                checked={includeWeatherproofing}
                onChange={(e) => setIncludeWeatherproofing(e.target.checked)}
              />
              <span>Weatherproofing & Sealing (+${weatherproofingPrice} per door)</span>
            </label>
          </div>
        </div>

        {/* Total Price Display */}
        <div className="front-door-total-price-display">
          <div className="front-door-total-label">Total Estimate</div>
          <div className="front-door-total-amount">${calculateTotal()}</div>
        </div>

        <button
          className="front-door-btn-proceed"
          onClick={handleAddToCart}
        >
          {editId ? 'Update Cart' : 'Add to Cart'}
        </button>

        <div className="front-door-disclaimer">
          <div className="front-door-disclaimer-icon">⚠️</div>
          <div className="front-door-disclaimer-content">
            <strong>Important:</strong> Front door painting must be combined with other interior or exterior services. Our professionals will confirm all details before the scheduled date.
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontDoorForm;
