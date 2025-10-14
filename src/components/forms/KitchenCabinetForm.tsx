import { useState, useEffect } from 'react';
import { type Service } from '../../data/services';
import {
  calculateKitchenCabinets,
  formatCurrency,
  RATES,
  type EstimateBreakdown
} from '../../utils/estimationCalculator';
import './ServiceForms.css';

interface KitchenCabinetFormProps {
  initialFormData?: any;
  initialEstimate?: EstimateBreakdown | null;
  onEstimateCalculated: (estimate: EstimateBreakdown, formData: any) => void;
  onFormDataChange?: (formData: any) => void;
  onAddToCart?: (estimate: EstimateBreakdown, formData: any) => void;
  onSaveEdit?: (estimate: EstimateBreakdown, formData: any) => void;
  isEditMode?: boolean;
}

const KitchenCabinetForm = ({ 
  initialFormData = {}, 
  initialEstimate = null,
  onEstimateCalculated,
  onFormDataChange,
  onAddToCart,
  onSaveEdit,
  isEditMode = false,
}: KitchenCabinetFormProps) => {
  const [formData, setFormData] = useState<any>(initialFormData);
  const [estimate, setEstimate] = useState<EstimateBreakdown | null>(initialEstimate);

  // Update form data when initial props change
  useEffect(() => {
    if (initialFormData && Object.keys(initialFormData).length > 0) {
      setFormData(initialFormData);
      calculateEstimate(initialFormData);
    }
  }, [JSON.stringify(initialFormData)]);

  // Recalculate estimate when initial estimate changes
  useEffect(() => {
    if (initialEstimate) {
      setEstimate(initialEstimate);
    }
  }, [initialEstimate]);

  const calculateEstimate = (data: any) => {
    if (!data.cabinetDoors || !data.cabinetFrames || !data.drawerFronts || 
        !data.cabinetHeight || !data.cabinetWidth) {
      setEstimate(null);
      return;
    }

    try {
      const estimate = calculateKitchenCabinets({
        cabinetSections: [{
          doors: parseInt(data.cabinetDoors) || 0,
          frames: parseInt(data.cabinetFrames) || 0,
          drawers: parseInt(data.drawerFronts) || 0,
          height: parseFloat(data.cabinetHeight) || 0,
          width: parseFloat(data.cabinetWidth) || 0,
          includeHardware: data.includeHardware || false,
        }]
      });

      setEstimate(estimate);
      onEstimateCalculated(estimate, data);
    } catch (error) {
      console.error('Error calculating estimate:', error);
      setEstimate(null);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Notify parent of form changes
    if (onFormDataChange) {
      onFormDataChange(newFormData);
    }
    
    calculateEstimate(newFormData);
  };

  const handleAddToCart = () => {
    if (estimate && onAddToCart) {
      onAddToCart(estimate, formData);
    }
  };

  const handleSaveEdit = () => {
    if (estimate && onSaveEdit) {
      onSaveEdit(estimate, formData);
    }
  };

  return (
    <div className="kitchen-cabinet-form">
      <div className="form-group-container">
        <h3>Cabinet Dimensions</h3>
        <p className="form-help">
          Please provide the dimensions and quantities for your kitchen cabinets. 
          We'll calculate the exact cost based on your specific measurements.
        </p>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cabinetDoors">Number of Cabinet Doors</label>
            <input
              type="number"
              id="cabinetDoors"
              value={formData.cabinetDoors || ''}
              onChange={(e) => handleInputChange('cabinetDoors', e.target.value)}
              min="0"
              placeholder="e.g., 12"
            />
            <small>Count all cabinet doors in your kitchen</small>
          </div>

          <div className="form-group">
            <label htmlFor="cabinetFrames">Number of Cabinet Frames</label>
            <input
              type="number"
              id="cabinetFrames"
              value={formData.cabinetFrames || ''}
              onChange={(e) => handleInputChange('cabinetFrames', e.target.value)}
              min="0"
              placeholder="e.g., 8"
            />
            <small>Count the cabinet frame sections</small>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="drawerFronts">Number of Drawer Fronts</label>
            <input
              type="number"
              id="drawerFronts"
              value={formData.drawerFronts || ''}
              onChange={(e) => handleInputChange('drawerFronts', e.target.value)}
              min="0"
              placeholder="e.g., 6"
            />
            <small>Count all drawer fronts</small>
          </div>

          <div className="form-group">
            <label htmlFor="cabinetHeight">Average Cabinet Height (inches)</label>
            <input
              type="number"
              id="cabinetHeight"
              value={formData.cabinetHeight || ''}
              onChange={(e) => handleInputChange('cabinetHeight', e.target.value)}
              min="0"
              step="0.1"
              placeholder="e.g., 30"
            />
            <small>Typical height of your cabinet doors</small>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cabinetWidth">Average Cabinet Width (inches)</label>
            <input
              type="number"
              id="cabinetWidth"
              value={formData.cabinetWidth || ''}
              onChange={(e) => handleInputChange('cabinetWidth', e.target.value)}
              min="0"
              step="0.1"
              placeholder="e.g., 18"
            />
            <small>Typical width of your cabinet doors</small>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.includeHardware || false}
                onChange={(e) => handleInputChange('includeHardware', e.target.checked)}
              />
              <span>Include hardware removal and replacement</span>
            </label>
            <small>We'll remove and reinstall handles, knobs, and hinges</small>
          </div>
        </div>
      </div>

      {estimate && (
        <div className="estimate-preview">
          <div className="estimate-header">
            <div className="estimate-badge">
              <img src="/money-bag.png" alt="Money" className="estimate-badge-icon" />
              Your Cabinet Painting Estimate
            </div>
            <div className="estimate-label">Total Project Cost</div>
            <div className="estimate-total">{formatCurrency(estimate.totalCost)}</div>
            <div className="estimate-subtitle">Professional cabinet painting with premium finishes</div>
          </div>

          <div className="estimate-details">
            {/* Time Section */}
            <div className="estimate-section">
              <div className="section-title">
                <img src="/labour-time.png" alt="Time" className="section-icon" />
                <span>Time Required</span>
              </div>
              <div className="section-content">
                <div className="detail-row">
                  <span>Labor Hours</span>
                  <span className="detail-value">{estimate.laborHours} hrs</span>
                </div>
                <div className="detail-row">
                  <span>Setup & Cleanup</span>
                  <span className="detail-value">{estimate.setupCleanupHours} hrs</span>
                </div>
                <div className="detail-row total-row">
                  <span>Total Time</span>
                  <span className="detail-value">{estimate.totalHours} hrs</span>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="estimate-section">
              <div className="section-title">
                <img src="/breakdown.png" alt="Breakdown" className="section-icon" />
                <span>Cost Breakdown</span>
              </div>
              <div className="section-content">
                <div className="detail-row">
                  <span>Labor ({estimate.totalHours} hrs @ ${RATES.LABOR_RATE}/hr)</span>
                  <span className="detail-value">{formatCurrency(estimate.laborCost)}</span>
                </div>
                <div className="detail-row">
                  <span>Paint ({estimate.paintGallons} gallons @ ${RATES.PAINT_RATE}/gallon)</span>
                  <span className="detail-value">{formatCurrency(estimate.paintCost)}</span>
                </div>
                <div className="detail-row">
                  <span>Supplies & Materials</span>
                  <span className="detail-value">{formatCurrency(estimate.suppliesCost)}</span>
                </div>
                <div className="detail-row">
                  <span>Prep Work</span>
                  <span className="detail-value">{formatCurrency(estimate.prepFee)}</span>
                </div>
                <div className="detail-row">
                  <span>Travel Fee</span>
                  <span className="detail-value">{formatCurrency(estimate.travelFee)}</span>
                </div>
                <div className="detail-row total-row">
                  <span>Total Cost</span>
                  <span className="detail-value">{formatCurrency(estimate.totalCost)}</span>
                </div>
              </div>
            </div>

            <div className="estimate-actions">
              {isEditMode ? (
                <button 
                  className="btn-continue-estimate"
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </button>
              ) : (
                <button 
                  className="btn-continue-estimate"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>

          <div className="estimate-disclaimer">
            <strong>What's Included:</strong>
            <ol>
              <li>Professional cabinet preparation (cleaning, sanding, priming)</li>
              <li>High-quality paint application with multiple coats</li>
              <li>Hardware removal and replacement (if selected)</li>
              <li>Cleanup and protection of surrounding areas</li>
              <li>All materials, supplies, and labor included</li>
            </ol>
            <p><strong>Note:</strong> This estimate is based on standard cabinet painting. Complex designs or special finishes may require additional consultation.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitchenCabinetForm;
