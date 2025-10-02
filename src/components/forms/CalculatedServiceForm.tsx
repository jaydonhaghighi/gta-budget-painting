import { useState } from 'react';
import { type Service } from '../../data/services';
import {
  calculateAccentWall,
  calculateCeiling,
  calculateBaseboards,
  calculateRoom,
  formatCurrency,
  type EstimateBreakdown
} from '../../utils/estimationCalculator';
import './ServiceForms.css';

interface CalculatedServiceFormProps {
  service: Service;
  onEstimateCalculated: (estimate: EstimateBreakdown, formData: any) => void;
}

const CalculatedServiceForm = ({ service, onEstimateCalculated }: CalculatedServiceFormProps) => {
  const [formData, setFormData] = useState<any>({});
  const [estimate, setEstimate] = useState<EstimateBreakdown | null>(null);

  const updateFormData = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    calculateEstimate(newData);
  };

  const calculateEstimate = (data: any) => {
    let newEstimate: EstimateBreakdown | null = null;

    try {
      switch (service.id) {
        case 'accent-wall':
          if (data.length && data.height) {
            newEstimate = calculateAccentWall(
              parseFloat(data.length),
              parseFloat(data.height)
            );
          }
          break;

        case 'ceiling':
          if (data.length && data.width) {
            const sqFt = parseFloat(data.length) * parseFloat(data.width);
            newEstimate = calculateCeiling(sqFt);
          }
          break;

        case 'small-bathroom':
        case 'foyer-entryway':
          if (data.length && data.width && data.height) {
            newEstimate = calculateRoom({
              length: parseFloat(data.length),
              width: parseFloat(data.width),
              height: parseFloat(data.height),
              includeCeiling: data.includeCeiling || false,
              includeBaseboards: data.includeBaseboards || false,
              baseboardProfile: data.baseboardProfile || 'low',
              doors: parseInt(data.doors) || 0,
              windows: parseInt(data.windows) || 0
            });
          }
          break;

        case 'trimming-baseboards':
          if (data.linearFeet && data.profile) {
            newEstimate = calculateBaseboards(
              parseFloat(data.linearFeet),
              data.profile,
              2
            );
          }
          break;

        case 'staircase-railings':
        case 'deck-railings':
        case 'small-porch':
          if (data.linearFeet) {
            // Use baseboard calculation as approximation for railings
            newEstimate = calculateBaseboards(
              parseFloat(data.linearFeet),
              'high',
              2
            );
          }
          break;

        default:
          break;
      }

      setEstimate(newEstimate);
    } catch (error) {
      console.error('Error calculating estimate:', error);
      setEstimate(null);
    }
  };

  const handleContinue = () => {
    if (estimate) {
      onEstimateCalculated(estimate, formData);
    }
  };

  const renderAccentWallForm = () => (
    <div className="form-group-container">
      <h3>Wall Measurements</h3>
      <p className="form-help">Measure the wall you want to paint as an accent</p>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="length">Wall Length (feet) *</label>
          <input
            type="number"
            id="length"
            min="1"
            step="0.5"
            placeholder="e.g. 12"
            value={formData.length || ''}
            onChange={(e) => updateFormData('length', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="height">Wall Height (feet) *</label>
          <input
            type="number"
            id="height"
            min="7"
            step="0.5"
            placeholder="e.g. 9"
            value={formData.height || ''}
            onChange={(e) => updateFormData('height', e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );

  const renderCeilingForm = () => (
    <div className="form-group-container">
      <h3>Ceiling Measurements</h3>
      <p className="form-help">Measure the room's ceiling dimensions</p>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="length">Room Length (feet) *</label>
          <input
            type="number"
            id="length"
            min="1"
            step="0.5"
            placeholder="e.g. 12"
            value={formData.length || ''}
            onChange={(e) => updateFormData('length', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="width">Room Width (feet) *</label>
          <input
            type="number"
            id="width"
            min="1"
            step="0.5"
            placeholder="e.g. 10"
            value={formData.width || ''}
            onChange={(e) => updateFormData('width', e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );

  const renderRoomForm = () => (
    <div className="form-group-container">
      <h3>Room Measurements</h3>
      <p className="form-help">Provide the room dimensions for accurate estimate</p>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="length">Length (feet) *</label>
          <input
            type="number"
            id="length"
            min="1"
            step="0.5"
            placeholder="e.g. 12"
            value={formData.length || ''}
            onChange={(e) => updateFormData('length', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="width">Width (feet) *</label>
          <input
            type="number"
            id="width"
            min="1"
            step="0.5"
            placeholder="e.g. 10"
            value={formData.width || ''}
            onChange={(e) => updateFormData('width', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="height">Height (feet) *</label>
          <input
            type="number"
            id="height"
            min="7"
            step="0.5"
            placeholder="e.g. 9"
            value={formData.height || ''}
            onChange={(e) => updateFormData('height', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-options">
        <h4>Additional Services</h4>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.includeCeiling || false}
              onChange={(e) => updateFormData('includeCeiling', e.target.checked)}
            />
            <span>Include Ceiling</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.includeBaseboards || false}
              onChange={(e) => updateFormData('includeBaseboards', e.target.checked)}
            />
            <span>Include Baseboards</span>
          </label>
        </div>

        {formData.includeBaseboards && (
          <div className="form-group">
            <label htmlFor="baseboardProfile">Baseboard Profile</label>
            <select
              id="baseboardProfile"
              value={formData.baseboardProfile || 'low'}
              onChange={(e) => updateFormData('baseboardProfile', e.target.value)}
            >
              <option value="low">Low Profile (&lt;4")</option>
              <option value="high">High Profile (&gt;5")</option>
            </select>
          </div>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="doors">Number of Doors</label>
          <input
            type="number"
            id="doors"
            min="0"
            placeholder="0"
            value={formData.doors || ''}
            onChange={(e) => updateFormData('doors', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="windows">Number of Windows</label>
          <input
            type="number"
            id="windows"
            min="0"
            placeholder="0"
            value={formData.windows || ''}
            onChange={(e) => updateFormData('windows', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderBaseboardForm = () => (
    <div className="form-group-container">
      <h3>Baseboard/Trim Measurements</h3>
      <p className="form-help">Measure the total length of baseboards or trim</p>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="linearFeet">Total Linear Feet *</label>
          <input
            type="number"
            id="linearFeet"
            min="1"
            step="0.5"
            placeholder="e.g. 40"
            value={formData.linearFeet || ''}
            onChange={(e) => updateFormData('linearFeet', e.target.value)}
            required
          />
          <small>Add up all the wall lengths with baseboards/trim</small>
        </div>
        <div className="form-group">
          <label htmlFor="profile">Profile Size *</label>
          <select
            id="profile"
            value={formData.profile || ''}
            onChange={(e) => updateFormData('profile', e.target.value)}
            required
          >
            <option value="">Select size</option>
            <option value="low">Low Profile (&lt;4")</option>
            <option value="high">High Profile (&gt;5")</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderRailingForm = () => (
    <div className="form-group-container">
      <h3>Railing Measurements</h3>
      <p className="form-help">Measure the total length of railings to be painted</p>
      
      <div className="form-group">
        <label htmlFor="linearFeet">Total Linear Feet *</label>
        <input
          type="number"
          id="linearFeet"
          min="1"
          step="0.5"
          placeholder="e.g. 25"
          value={formData.linearFeet || ''}
          onChange={(e) => updateFormData('linearFeet', e.target.value)}
          required
        />
        <small>Include all sections of railing</small>
      </div>
    </div>
  );

  const renderForm = () => {
    switch (service.id) {
      case 'accent-wall':
        return renderAccentWallForm();
      case 'ceiling':
        return renderCeilingForm();
      case 'small-bathroom':
      case 'foyer-entryway':
        return renderRoomForm();
      case 'trimming-baseboards':
        return renderBaseboardForm();
      case 'staircase-railings':
      case 'deck-railings':
      case 'small-porch':
        return renderRailingForm();
      default:
        return <p>Form not implemented for this service</p>;
    }
  };

  return (
    <div className="calculated-service-form">
      {renderForm()}
      
      {estimate && (
        <div className="estimate-preview">
          <div className="estimate-header">
            <h3>Preliminary Estimate</h3>
            <div className="estimate-total">{formatCurrency(estimate.totalCost)}</div>
          </div>
          <div className="estimate-breakdown">
            {estimate.breakdown.map((line, index) => (
              <div key={index} className="breakdown-line">{line}</div>
            ))}
          </div>
          <div className="estimate-disclaimer">
            <strong>Note:</strong> This is a preliminary estimate. Final pricing will be confirmed by our professionals after review.
          </div>
          <button className="btn-continue-estimate" onClick={handleContinue}>
            Continue with This Estimate
          </button>
        </div>
      )}
    </div>
  );
};

export default CalculatedServiceForm;

