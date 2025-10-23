import { useState, useEffect } from 'react';
import {
  calculateKitchenCabinets,
  type EstimateBreakdown
} from '../../utils/estimationCalculator';
import './ServiceForms.css';

interface KitchenCabinetFormProps {
  initialFormData?: any;
  onEstimateCalculated: (estimate: EstimateBreakdown, formData: any) => void;
  onFormDataChange?: (formData: any) => void;
}

const KitchenCabinetForm = ({ 
  initialFormData = {}, 
  onEstimateCalculated,
  onFormDataChange,
}: KitchenCabinetFormProps) => {
  const [formData, setFormData] = useState<any>(initialFormData);

  // Update form data when initial props change
  useEffect(() => {
    if (initialFormData && Object.keys(initialFormData).length > 0) {
      setFormData(initialFormData);
      calculateEstimate(initialFormData);
    }
  }, [JSON.stringify(initialFormData)]);

  const calculateEstimate = (data: any) => {
    if (!data.cabinetDoors || !data.cabinetFrames || !data.drawerFronts || 
        !data.cabinetHeight || !data.cabinetWidth) {
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

      onEstimateCalculated(estimate, data);
    } catch (error) {
      console.error('Error calculating estimate:', error);
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

    </div>
  );
};

export default KitchenCabinetForm;
