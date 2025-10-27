import { useState, useEffect } from 'react';
import { type Service } from '../../data/services';
import {
  calculateAccentWall,
  calculateCeiling,
  calculateBaseboards,
  calculateRoom,
  calculateStaircase,
  calculateFence,
  calculateMultipleBedrooms,
  calculateKitchenCabinets,
  calculateGarageDoor,
  calculatePopcornCeilingRemoval,
  calculateBathroomVanityCabinet,
  RATES,
  PRODUCTION_RATES,
  type EstimateBreakdown
} from '../../utils/estimationCalculator';
import './ServiceForms.css';

interface CalculatedServiceFormProps {
  service: Service;
  initialFormData?: any;
  initialEstimate?: EstimateBreakdown | null;
  onEstimateCalculated: (estimate: EstimateBreakdown | null, formData: any) => void;
  onFormDataChange?: (formData: any) => void; // NEW: Callback for every form change
}

const CalculatedServiceForm = ({ 
  service, 
  initialFormData = {}, 
  initialEstimate = null,
  onEstimateCalculated,
  onFormDataChange,
}: CalculatedServiceFormProps) => {
  const [formData, setFormData] = useState<any>(initialFormData);
  const [, setEstimate] = useState<EstimateBreakdown | null>(initialEstimate);

  // Update form data when initial props change (e.g., when navigating back or restored from localStorage)
  useEffect(() => {
    if (initialFormData && Object.keys(initialFormData).length > 0) {
      setFormData(initialFormData);
      // Recalculate estimate with restored data
      calculateEstimate(initialFormData);
    }
  }, [JSON.stringify(initialFormData)]); // Use JSON.stringify to detect object changes

  // Update estimate when initial estimate changes
  useEffect(() => {
    if (initialEstimate) {
      setEstimate(initialEstimate);
    }
  }, [initialEstimate]);

  const updateFormData = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    calculateEstimate(newData);
    
    // Notify parent component of the change
    if (onFormDataChange) {
      onFormDataChange(newData);
    }
  };

  // Validation function to check if all required fields are filled
  const isFormComplete = (data: any) => {
    switch (service.id) {
      case 'accent-wall':
        return data.length && data.height && parseFloat(data.length) > 0 && parseFloat(data.height) > 0;
      
      case 'ceiling':
        return data.length && data.width && parseFloat(data.length) > 0 && parseFloat(data.width) > 0;
      
      case 'small-bathroom':
        return data.length && data.width && data.height && 
               parseFloat(data.length) > 0 && parseFloat(data.width) > 0 && parseFloat(data.height) > 0;
      
      case 'basement-painting':
        return data.length && data.width && data.height && 
               parseFloat(data.length) > 0 && parseFloat(data.width) > 0 && parseFloat(data.height) > 0;
      
      case 'kitchen-walls':
        return data.length && data.width && data.height && 
               parseFloat(data.length) > 0 && parseFloat(data.width) > 0 && parseFloat(data.height) > 0;
      
      case 'trimming-baseboards':
        return data.linearFeet && data.profile && parseFloat(data.linearFeet) > 0;
      
      case 'bedroom-painting':
        return data.bedrooms && Array.isArray(data.bedrooms) && data.bedrooms.length > 0 &&
               data.bedrooms.some((bedroom: any) => 
                 bedroom.length && bedroom.width && bedroom.height &&
                 parseFloat(bedroom.length) > 0 && parseFloat(bedroom.width) > 0 && parseFloat(bedroom.height) > 0
               );
      
      case 'staircase-painting':
        return data.steps && parseFloat(data.steps) > 0;
      
      case 'fence-painting':
        return data.length && data.height && 
               parseFloat(data.length) > 0 && parseFloat(data.height) > 0;
      
      case 'kitchen-cabinet-painting':
        return data.cabinetSections && Array.isArray(data.cabinetSections) && data.cabinetSections.length > 0 &&
               data.cabinetSections.every((section: any) => 
                 section.width && section.height && section.depth &&
                 parseFloat(section.width) > 0 && parseFloat(section.height) > 0 && parseFloat(section.depth) > 0
               );
      
      case 'garage-door':
        return data.width && data.height && 
               parseFloat(data.width) > 0 && parseFloat(data.height) > 0;
      
      case 'exterior-railings':
        return data.length && parseFloat(data.length) > 0;
      
      case 'stucco-ceiling-removal':
        return data.length && data.width && parseFloat(data.length) > 0 && parseFloat(data.width) > 0;
      
      case 'bathroom-vanity-cabinet':
        return data.width && data.height && data.depth && 
               parseFloat(data.width) > 0 && parseFloat(data.height) > 0 && parseFloat(data.depth) > 0;
      
      default:
        return false;
    }
  };

  const calculateEstimate = (data: any) => {
    let newEstimate: EstimateBreakdown | null = null;

    // Only calculate estimate if all required fields are filled
    if (!isFormComplete(data)) {
      setEstimate(null);
      onEstimateCalculated(null, data);
      return;
    }

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

        case 'basement-painting':
          if (data.length && data.width && data.height) {
            newEstimate = calculateRoom({
              length: parseFloat(data.length),
              width: parseFloat(data.width),
              height: parseFloat(data.height),
              includeCeiling: data.includeCeiling !== false, // Default to true for basement
              includeBaseboards: data.includeBaseboards !== false, // Default to true
              baseboardProfile: data.baseboardProfile || 'low',
              doors: parseInt(data.doors) || 0,
              windows: parseInt(data.windows) || 0 // Basements often have few/no windows
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


        case 'bedroom-painting':
          if (data.bedrooms && data.bedrooms.length > 0) {
            // Multiple bedrooms
            const validBedrooms = data.bedrooms.filter((bedroom: any) =>
              bedroom.length && bedroom.width && bedroom.height
            );
            if (validBedrooms.length > 0) {
              newEstimate = calculateMultipleBedrooms(validBedrooms.map((bedroom: any) => ({
                name: bedroom.name || undefined,
                length: parseFloat(bedroom.length),
                width: parseFloat(bedroom.width),
                height: parseFloat(bedroom.height),
                includeCeiling: bedroom.includeCeiling === true,
                includeBaseboards: bedroom.includeBaseboards === true,
                baseboardProfile: bedroom.baseboardProfile || 'low',
                doors: parseInt(bedroom.doors) || 0,
                windows: parseInt(bedroom.windows) || 0
              })));
            }
          }
          break;

        case 'staircase-painting':
          if (data.wallArea || data.ceilingArea) {
            newEstimate = calculateStaircase({
              wallArea: parseFloat(data.wallArea) || 0,
              ceilingArea: parseFloat(data.ceilingArea) || 0,
              includeRailings: data.includeRailings || false,
              linearFeetRailings: data.includeRailings ? parseFloat(data.railingsLength) || 0 : 0
            });
          }
          break;

        case 'kitchen-walls':
          if (data.length && data.width && data.height) {
            newEstimate = calculateRoom({
              length: parseFloat(data.length),
              width: parseFloat(data.width),
              height: parseFloat(data.height),
              includeCeiling: false, // Kitchen walls typically don't include ceiling
              includeBaseboards: data.includeBaseboards || false,
              baseboardProfile: data.baseboardProfile || 'low',
              doors: parseInt(data.doors) || 0,
              windows: parseInt(data.windows) || 0
            });
          }
          break;

        case 'kitchen-cabinet-painting':
          if (data.cabinetSections && data.cabinetSections.length > 0) {
            newEstimate = calculateKitchenCabinets({
              cabinetSections: data.cabinetSections.map((section: any) => ({
                doors: parseInt(section.doors) || 0,
                frames: parseInt(section.frames) || 0,
                drawers: parseInt(section.drawers) || 0,
                height: parseFloat(section.height) || 0,
                width: parseFloat(section.width) || 0,
                includeHardware: section.includeHardware || false,
              }))
            });
          }
          break;

        case 'garage-door':
          if (data.width && data.height && data.doors && data.material && data.condition) {
            newEstimate = calculateGarageDoor({
              width: parseFloat(data.width) || 0,
              height: parseFloat(data.height) || 0,
              doors: parseInt(data.doors) || 0,
              material: data.material,
              condition: data.condition,
              includeHardware: data.includeHardware || false,
            });
          }
          break;

        case 'fence-painting':
          if (data.linearFeet && data.height) {
            const sides = parseInt(data.sides) || 1;
            newEstimate = calculateFence({
              linearFeet: parseFloat(data.linearFeet),
              height: parseFloat(data.height),
              sides: (sides === 2 ? 2 : 1) as 1 | 2,
              includeStaining: data.includeStaining || false
            });
          }
          break;

        case 'exterior-railings':
          // Exterior railings with optional additional areas
          if (data.railingsLength) {
            let baseEstimate = calculateBaseboards(
              parseFloat(data.railingsLength),
              'high',
              2
            );
            
            // If includes porch/deck areas, add them
            if (data.includePorchAreas && data.porchArea) {
              const porchArea = parseFloat(data.porchArea);
              const additionalHours = Math.ceil(porchArea / PRODUCTION_RATES.CEILING);
              const additionalPaint = Math.ceil(porchArea / RATES.PAINT_COVERAGE);
              
              baseEstimate = {
                ...baseEstimate,
                laborHours: baseEstimate.laborHours + additionalHours,
                totalHours: baseEstimate.totalHours + additionalHours,
                paintGallons: baseEstimate.paintGallons + additionalPaint,
                laborCost: (baseEstimate.totalHours + additionalHours) * RATES.LABOR_RATE,
                paintCost: (baseEstimate.paintGallons + additionalPaint) * RATES.PAINT_RATE,
                suppliesCost: (baseEstimate.totalHours + additionalHours) * RATES.SUPPLIES_RATE,
                subtotal: baseEstimate.laborCost + baseEstimate.paintCost + baseEstimate.suppliesCost,
                totalCost: baseEstimate.laborCost + baseEstimate.paintCost + baseEstimate.suppliesCost + baseEstimate.prepFee + baseEstimate.travelFee,
                breakdown: [
                  ...baseEstimate.breakdown,
                  `Porch/deck areas: ${porchArea} sq ft`
                ]
              };
            }
            
            newEstimate = baseEstimate;
          }
          break;

        case 'stucco-ceiling-removal':
          if (data.length && data.width) {
            const sqFt = parseFloat(data.length) * parseFloat(data.width);
            newEstimate = calculatePopcornCeilingRemoval(
              sqFt, 
              data.includeSkimCoat || false, 
              data.includePainting || false
            );
          }
          break;

        case 'bathroom-vanity-cabinet':
          if (data.width && data.height && data.depth) {
            newEstimate = calculateBathroomVanityCabinet({
              width: parseFloat(data.width),
              height: parseFloat(data.height),
              depth: parseFloat(data.depth),
              doors: parseInt(data.doors) || 0,
              drawers: parseInt(data.drawers) || 0,
              includeHardware: data.includeHardware || false
            });
          }
          break;

        default:
          break;
      }

      setEstimate(newEstimate);
      
      // Notify parent component of the new estimate
      if (newEstimate) {
        onEstimateCalculated(newEstimate, data);
      }
    } catch (error) {
      console.error('Error calculating estimate:', error);
      setEstimate(null);
    }
  };


  const renderAccentWallForm = () => (
    <div className="form-group-container accent-wall-form">
      <div className="form-header">
        <h3>Accent Wall Dimensions</h3>
        <p>Enter the length and height of your accent wall to receive an <b>estimate</b></p>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="length">Length (ft) *</label>
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
          <label htmlFor="height">Height (ft) *</label>
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
    <div className="form-group-container ceiling-form">
      <div className="form-header">
        <h3>Ceiling Dimensions</h3>
        <p>Enter the length and width of your room to receive an <b>estimate</b></p>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="length">Room Length (ft) *</label>
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
          <label htmlFor="width">Room Width (ft) *</label>
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

  const renderBathroomForm = () => (
    <div className="form-group-container bathroom-form">
      <div className="form-header">
        <h3>Bathroom Dimensions</h3>
        <p>Enter your bathroom measurements to receive an <b>estimate</b></p>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="length">Length (ft) *</label>
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
          <label htmlFor="width">Width (ft) *</label>
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

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="height">Height (ft) *</label>
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
        <div className="form-group">
          <label htmlFor="doors">Doors</label>
          <input
            type="number"
            id="doors"
            min="0"
            placeholder="0"
            value={formData.doors || ''}
            onChange={(e) => updateFormData('doors', e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="windows">Windows</label>
          <input
            type="number"
            id="windows"
            min="0"
            placeholder="0"
            value={formData.windows || ''}
            onChange={(e) => updateFormData('windows', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Additional Services</label>
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
        </div>
      </div>

    </div>
  );

  const renderBaseboardForm = () => (
    <div className="form-group-container baseboard-form">
      <div className="form-header">
        <h3>Baseboard Dimensions</h3>
        <p>Enter your baseboard measurements to receive an <b>estimate</b></p>
      </div>
      
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

  const renderBasementForm = () => (
    <div className="form-group-container">
      <h3>Basement Measurements</h3>
      <p className="form-help">Transform your basement into livable space with fresh paint</p>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="length">Basement Length (feet) *</label>
          <input
            type="number"
            id="length"
            min="1"
            step="0.5"
            placeholder="e.g. 25"
            value={formData.length || ''}
            onChange={(e) => updateFormData('length', e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="width">Basement Width (feet) *</label>
          <input
            type="number"
            id="width"
            min="1"
            step="0.5"
            placeholder="e.g. 20"
            value={formData.width || ''}
            onChange={(e) => updateFormData('width', e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="height">Ceiling Height (feet) *</label>
        <input
          type="number"
          id="height"
          min="1"
          step="0.5"
          placeholder="e.g. 7.5"
          value={formData.height || ''}
          onChange={(e) => updateFormData('height', e.target.value)}
          required
        />
        <small>Basement ceilings typically 7-8 feet</small>
      </div>

      <h4>What's Included?</h4>
      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.includeCeiling !== false}
            onChange={(e) => updateFormData('includeCeiling', e.target.checked)}
          />
          <span>Paint Ceiling</span>
        </label>
        
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.includeBaseboards !== false}
            onChange={(e) => updateFormData('includeBaseboards', e.target.checked)}
          />
          <span>Paint Baseboards</span>
        </label>
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
          <small>Basement windows are often small or none</small>
        </div>
      </div>

      <div className="info-box" style={{
        background: 'var(--color-golden-beige)',
        padding: '1.5rem',
        borderRadius: '12px',
        marginTop: '1.5rem',
        fontSize: '0.95rem',
        color: 'var(--color-soft-charcoal)',
        border: '2px solid var(--color-soft-charcoal)',
        boxShadow: '0 4px 12px rgba(217, 182, 101, 0.3)',
        fontWeight: '500'
      }}>
        <strong>Basement Tips:</strong>
        <ul style={{ marginTop: '0.75rem', paddingLeft: '1.5rem', marginBottom: 0, fontWeight: '500' }}>
          <li>We use mold/moisture-resistant paint for basement environments</li>
          <li>Unfinished basements may require primer for concrete walls</li>
          <li>Large open basements are perfect for budget transformation</li>
        </ul>
      </div>
    </div>
  );

  const renderBedroomForm = () => {
    const bedrooms = formData.bedrooms || [
      { id: 1, type: '', length: '', width: '', height: '', includeCeiling: false, includeBaseboards: false, baseboardProfile: 'low', doors: '', windows: '' }
    ];

    const addBedroom = () => {
      const newId = Math.max(...bedrooms.map((b: any) => b.id), 0) + 1;
      updateFormData('bedrooms', [
        ...bedrooms,
        { id: newId, type: '', length: '', width: '', height: '', includeCeiling: false, includeBaseboards: false, baseboardProfile: 'low', doors: '', windows: '' }
      ]);
    };

    const removeBedroom = (id: number) => {
      if (bedrooms.length > 1) {
        updateFormData('bedrooms', bedrooms.filter((bedroom: any) => bedroom.id !== id));
      }
    };

    const updateBedroom = (id: number, field: string, value: any) => {
      const updatedBedrooms = bedrooms.map((bedroom: any) =>
        bedroom.id === id ? { ...bedroom, [field]: value } : bedroom
      );
      updateFormData('bedrooms', updatedBedrooms);
    };

    return (
      <div className="form-group-container bedroom-form">
        <div className="form-header">
          <h3>Bedroom Dimensions</h3>
          <p>Add one or more bedrooms to receive an <b>estimate</b></p>
        </div>

        {bedrooms.map((bedroom: any, index: number) => (
          <div key={bedroom.id} className="bedroom-item">
            <div className="bedroom-header">
              <h4>Bedroom {index + 1}</h4>
              {bedrooms.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBedroom(bedroom.id)}
                  className="btn-remove-bedroom"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="form-group">
              <label htmlFor={`bedroom-${bedroom.id}-type`}>Bedroom Type</label>
              <select
                id={`bedroom-${bedroom.id}-type`}
                value={bedroom.type || ''}
                onChange={(e) => updateBedroom(bedroom.id, 'type', e.target.value)}
              >
                <option value="">Select bedroom type</option>
                <option value="master">Master Bedroom</option>
                <option value="guest">Guest Bedroom</option>
                <option value="kids">Kids Bedroom</option>
                <option value="nursery">Nursery</option>
                <option value="office">Bedroom/Office</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`bedroom-${bedroom.id}-length`}>Length (ft) *</label>
                <input
                  type="number"
                  id={`bedroom-${bedroom.id}-length`}
                  min="1"
                  step="0.5"
                  placeholder="12"
                  value={bedroom.length}
                  onChange={(e) => updateBedroom(bedroom.id, 'length', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`bedroom-${bedroom.id}-width`}>Width (ft) *</label>
                <input
                  type="number"
                  id={`bedroom-${bedroom.id}-width`}
                  min="1"
                  step="0.5"
                  placeholder="10"
                  value={bedroom.width}
                  onChange={(e) => updateBedroom(bedroom.id, 'width', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`bedroom-${bedroom.id}-height`}>Height (ft) *</label>
                <input
                  type="number"
                  id={`bedroom-${bedroom.id}-height`}
                  min="1"
                  step="0.5"
                  placeholder="8"
                  value={bedroom.height}
                  onChange={(e) => updateBedroom(bedroom.id, 'height', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Additional Services</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={bedroom.includeCeiling !== false}
                      onChange={(e) => updateBedroom(bedroom.id, 'includeCeiling', e.target.checked)}
                    />
                    <span>Include Ceiling</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={bedroom.includeBaseboards !== false}
                      onChange={(e) => updateBedroom(bedroom.id, 'includeBaseboards', e.target.checked)}
                    />
                    <span>Include Baseboards</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`bedroom-${bedroom.id}-doors`}>Doors</label>
                <input
                  type="number"
                  id={`bedroom-${bedroom.id}-doors`}
                  min="0"
                  placeholder="1"
                  value={bedroom.doors}
                  onChange={(e) => updateBedroom(bedroom.id, 'doors', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor={`bedroom-${bedroom.id}-windows`}>Windows</label>
                <input
                  type="number"
                  id={`bedroom-${bedroom.id}-windows`}
                  min="0"
                  placeholder="1"
                  value={bedroom.windows}
                  onChange={(e) => updateBedroom(bedroom.id, 'windows', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addBedroom}
          className="btn-add-bedroom"
        >
          + Add Another Bedroom
        </button>
      </div>
    );
  };

  const renderKitchenWallsForm = () => (
    <div className="form-group-container kitchen-walls-form">
      <div className="form-header">
        <h3>Kitchen Dimensions</h3>
        <p>Enter your kitchen measurements to receive an <b>estimate</b></p>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="length">Length (ft) *</label>
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
          <label htmlFor="width">Width (ft) *</label>
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

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="height">Height (ft) *</label>
          <input
            type="number"
            id="height"
            min="1"
            step="0.5"
            placeholder="e.g. 8"
            value={formData.height || ''}
            onChange={(e) => updateFormData('height', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Additional Services</label>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.includeBaseboards || false}
                onChange={(e) => updateFormData('includeBaseboards', e.target.checked)}
              />
              <span>Paint Baseboards</span>
            </label>
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="doors">Doors</label>
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
          <label htmlFor="windows">Windows</label>
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

  const renderKitchenCabinetForm = () => {
    const addCabinetSection = () => {
      const newSection = {
        doors: 0,
        frames: 0,
        drawers: 0,
        height: 0,
        width: 0,
        includeHardware: false
      };
      updateFormData('cabinetSections', [...(formData.cabinetSections || []), newSection]);
    };

    const updateCabinetSection = (index: number, field: string, value: any) => {
      const updatedSections = [...(formData.cabinetSections || [])];
      updatedSections[index] = { ...updatedSections[index], [field]: value };
      updateFormData('cabinetSections', updatedSections);
    };

    const removeCabinetSection = (index: number) => {
      const updatedSections = (formData.cabinetSections || []).filter((_: any, i: number) => i !== index);
      updateFormData('cabinetSections', updatedSections);
    };

    return (
      <div className="form-group-container">
        <h3>Cabinet Sections</h3>
        <p className="form-help">
          Add each cabinet section in your kitchen. This allows for precise measurements 
          and accurate pricing based on your specific cabinet configuration.
        </p>

        {(formData.cabinetSections || []).map((section: any, index: number) => (
          <div key={index} className="multi-room-item" style={{
            background: 'var(--color-bone)',
            border: '2px solid var(--color-calm-blue-gray)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 12px rgba(44, 61, 75, 0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ color: 'var(--color-steel-blue)', margin: 0, fontSize: '1.1rem' }}>
                Cabinet Section {index + 1}
              </h4>
              <button
                type="button"
                className="btn-remove-room"
                onClick={() => removeCabinetSection(index)}
                style={{
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
        fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Remove Section
              </button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Number of Doors</label>
                <input
                  type="number"
                  value={section.doors || ''}
                  onChange={(e) => updateCabinetSection(index, 'doors', e.target.value)}
                  min="0"
                  placeholder="e.g., 2"
                />
                <small>Cabinet doors in this section</small>
              </div>

              <div className="form-group">
                <label>Number of Frames</label>
                <input
                  type="number"
                  value={section.frames || ''}
                  onChange={(e) => updateCabinetSection(index, 'frames', e.target.value)}
                  min="0"
                  placeholder="e.g., 1"
                />
                <small>Cabinet frame sections</small>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Number of Drawers</label>
                <input
                  type="number"
                  value={section.drawers || ''}
                  onChange={(e) => updateCabinetSection(index, 'drawers', e.target.value)}
                  min="0"
                  placeholder="e.g., 3"
                />
                <small>Drawer fronts in this section</small>
              </div>

              <div className="form-group">
                <label>Height (inches)</label>
                <input
                  type="number"
                  value={section.height || ''}
                  onChange={(e) => updateCabinetSection(index, 'height', e.target.value)}
                  min="0"
                  step="0.1"
                  placeholder="e.g., 30"
                />
                <small>Height of cabinet doors</small>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Width (inches)</label>
                <input
                  type="number"
                  value={section.width || ''}
                  onChange={(e) => updateCabinetSection(index, 'width', e.target.value)}
                  min="0"
                  step="0.1"
                  placeholder="e.g., 18"
                />
                <small>Width of cabinet doors</small>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={section.includeHardware || false}
                    onChange={(e) => updateCabinetSection(index, 'includeHardware', e.target.checked)}
                  />
                  <span>Include hardware for this section</span>
                </label>
                <small>Remove and reinstall handles, knobs, hinges</small>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addCabinetSection}
          style={{
            background: 'var(--color-steel-blue)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            width: '100%',
            marginTop: '1rem'
          }}
        >
          + Add Another Cabinet Section
        </button>

        {/* Image Upload Section */}
        <div className="image-upload-section" style={{
          margin: '2.5rem 0',
          padding: '2.5rem',
          background: 'white',
          borderRadius: '16px',
          border: '3px dashed var(--color-calm-blue-gray)',
          boxShadow: '0 8px 24px rgba(44, 61, 75, 0.08)'
        }}>
          <label style={{
            color: 'var(--color-steel-blue)',
            fontSize: '1.2rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <img src="/camera.svg" alt="Camera" style={{ width: '24px', height: '24px', filter: 'brightness(0) saturate(100%) invert(20%) sepia(8%) saturate(2000%) hue-rotate(180deg) brightness(95%) contrast(90%)' }} />
            Upload Cabinet Photos (Optional)
          </label>
          <p className="upload-help" style={{
            color: 'var(--color-calm-blue-gray)',
            fontSize: '1rem',
            fontWeight: '500',
            marginBottom: '1.5rem'
          }}>
            Help us provide a more accurate estimate by uploading photos of your cabinets. 
            Include different angles and any specific details you'd like us to see.
          </p>
          
          <input
            type="file"
            id="cabinetImages"
            multiple
            accept="image/*"
            onChange={(e) => updateFormData('cabinetImages', e.target.files)}
            style={{ display: 'none' }}
          />
          
          <label
            htmlFor="cabinetImages"
            className="btn-upload"
            style={{
              padding: '1.25rem',
              background: 'white',
              border: '3px solid var(--color-steel-blue)',
              color: 'var(--color-steel-blue)',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-block',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(44, 61, 75, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-steel-blue)';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(44, 61, 75, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = 'var(--color-steel-blue)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(44, 61, 75, 0.1)';
            }}
          >
            <img src="/folder.svg" alt="Folder" style={{ width: '18px', height: '18px', marginRight: '0.5rem', filter: 'brightness(0) saturate(100%) invert(20%) sepia(8%) saturate(2000%) hue-rotate(180deg) brightness(95%) contrast(90%)' }} />
            Choose Images
          </label>
          
          {formData.cabinetImages && formData.cabinetImages.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ 
                color: 'var(--color-steel-blue)', 
                fontWeight: '600', 
                marginBottom: '1rem' 
              }}>
                Selected Images ({formData.cabinetImages.length}):
              </p>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                gap: '1rem' 
              }}>
                {Array.from(formData.cabinetImages).map((file, index) => (
                  <div key={index} style={{
                    position: 'relative',
                    border: '2px solid var(--color-calm-blue-gray)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'var(--color-bone)'
                  }}>
                    <img
                      src={URL.createObjectURL(file as File)}
                      alt={`Cabinet ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '120px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      padding: '0.5rem',
                      fontSize: '0.8rem',
                      color: 'var(--color-steel-blue)',
                      fontWeight: '500',
                      textAlign: 'center'
                    }}>
                      {(file as File).name}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newFiles = Array.from(formData.cabinetImages).filter((_, i) => i !== index);
                        updateFormData('cabinetImages', newFiles);
                      }}
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        width: '24px',
                        height: '24px',
                        background: 'var(--color-golden-beige)',
                        color: 'var(--color-soft-charcoal)',
                        border: '2px solid var(--color-soft-charcoal)',
                        borderRadius: '50%',
                        fontSize: '0.8rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="upload-note" style={{
            marginTop: '1.5rem',
            color: 'var(--color-calm-blue-gray)',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            <strong>Tip:</strong> Upload clear photos showing the current condition, style, and any specific details of your cabinets. This helps us provide the most accurate estimate.
          </div>
        </div>

        <div className="info-box" style={{
          background: 'var(--color-bone)',
          padding: '1.5rem',
          borderRadius: '12px',
          marginTop: '1.5rem',
          fontSize: '0.95rem',
          color: 'var(--color-steel-blue)',
          border: '2px solid var(--color-calm-blue-gray)',
          boxShadow: '0 4px 12px rgba(44, 61, 75, 0.08)',
          fontWeight: '500'
        }}>
          <strong>Note:</strong> Cabinet painting requires detailed preparation, multiple coats, and careful attention to hardware. Each section can have different dimensions and hardware requirements.
      </div>
    </div>
  );
  };

  const renderFenceForm = () => (
    <div className="form-group-container">
      <h3>Fence Measurements</h3>
      <p className="form-help">Tell us about your fence so we can provide an accurate estimate</p>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="linearFeet">Fence Length (linear feet) *</label>
          <input
            type="number"
            id="linearFeet"
            min="1"
            step="0.5"
            placeholder="e.g. 50"
            value={formData.linearFeet || ''}
            onChange={(e) => updateFormData('linearFeet', e.target.value)}
            required
          />
          <small>Total length of fence to be painted/stained</small>
        </div>

        <div className="form-group">
          <label htmlFor="height">Fence Height (feet) *</label>
          <input
            type="number"
            id="height"
            min="1"
            step="0.5"
            placeholder="e.g. 6"
            value={formData.height || ''}
            onChange={(e) => updateFormData('height', e.target.value)}
            required
          />
          <small>Typical residential fence: 4-6 feet</small>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="sides">Paint/Stain Sides *</label>
        <select
          id="sides"
          value={formData.sides || '1'}
          onChange={(e) => updateFormData('sides', e.target.value)}
          required
        >
          <option value="1">One Side Only</option>
          <option value="2">Both Sides</option>
        </select>
      </div>

      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.includeStaining || false}
            onChange={(e) => updateFormData('includeStaining', e.target.checked)}
          />
          <span>Staining (instead of painting)</span>
        </label>
      </div>

      <div className="info-box" style={{
        background: 'var(--color-golden-beige)',
        padding: '1.5rem',
        borderRadius: '12px',
        marginTop: '1.5rem',
        fontSize: '0.95rem',
        color: 'var(--color-soft-charcoal)',
        border: '2px solid var(--color-soft-charcoal)',
        boxShadow: '0 4px 12px rgba(217, 182, 101, 0.3)',
        fontWeight: '500'
      }}>
        <strong>Painting vs Staining:</strong>
        <ul style={{ marginTop: '0.75rem', paddingLeft: '1.5rem', marginBottom: 0, fontWeight: '500' }}>
          <li><strong>Paint:</strong> Solid color, more durable, hides imperfections (2 coats)</li>
          <li><strong>Stain:</strong> Shows wood grain, natural look, faster application (1 coat)</li>
        </ul>
      </div>
    </div>
  );

  const renderExteriorRailingsForm = () => (
    <div className="form-group-container">
      <h3>Exterior Railings & Porch</h3>
      <p className="form-help">Measure deck railings, porch railings, and any additional areas</p>

      <div className="form-group">
        <label htmlFor="railingsLength">Railing Length (linear feet) *</label>
        <input
          type="number"
          id="railingsLength"
          min="1"
          step="0.5"
          placeholder="e.g. 30"
          value={formData.railingsLength || ''}
          onChange={(e) => updateFormData('railingsLength', e.target.value)}
          required
        />
        <small>Total length of all exterior railings (deck, porch, patio)</small>
      </div>

      <h4 style={{ marginTop: '1.5rem' }}>Optional Add-Ons</h4>
      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.includePorchAreas || false}
            onChange={(e) => updateFormData('includePorchAreas', e.target.checked)}
          />
          <span>Include Porch/Deck Posts, Ceiling, or Floor</span>
        </label>
      </div>

      {formData.includePorchAreas && (
        <div className="form-group" style={{ marginTop: '1rem', paddingLeft: '1.5rem', borderLeft: '3px solid var(--color-steel-blue)' }}>
          <label htmlFor="porchArea">Additional Porch/Deck Area (square feet) *</label>
          <input
            type="number"
            id="porchArea"
            min="0"
            step="1"
            placeholder="e.g. 100"
            value={formData.porchArea || ''}
            onChange={(e) => updateFormData('porchArea', e.target.value)}
            required
          />
          <small>Include posts, ceiling, or floor area you want painted</small>
        </div>
      )}

      <div className="info-box" style={{
        background: 'var(--color-bone)',
        padding: '1.5rem',
        borderRadius: '12px',
        marginTop: '1.5rem',
        fontSize: '0.95rem',
        color: 'var(--color-steel-blue)',
        border: '2px solid var(--color-calm-blue-gray)',
        boxShadow: '0 4px 12px rgba(44, 61, 75, 0.08)',
        fontWeight: '500'
      }}>
        <strong>✓ Includes:</strong>
        <ul style={{ marginTop: '0.75rem', paddingLeft: '1.5rem', marginBottom: 0, fontWeight: '500' }}>
          <li>Weather-resistant exterior paint</li>
          <li>Proper surface prep and priming</li>
          <li>UV protection for lasting durability</li>
        </ul>
      </div>
    </div>
  );

  const renderStaircaseForm = () => (
    <div className="form-group-container">
      <h3>Staircase Measurements</h3>
      <p className="form-help">Staircase painting includes difficulty multipliers for safety and access</p>

      <div className="form-group">
        <label htmlFor="wallArea">Wall Area (square feet)</label>
        <input
          type="number"
          id="wallArea"
          min="0"
          step="1"
          placeholder="e.g. 150"
          value={formData.wallArea || ''}
          onChange={(e) => updateFormData('wallArea', e.target.value)}
        />
        <small>Stairwell walls only (not including adjacent hallways)</small>
      </div>

      <div className="form-group">
        <label htmlFor="ceilingArea">Ceiling Area (square feet)</label>
        <input
          type="number"
          id="ceilingArea"
          min="0"
          step="1"
          placeholder="e.g. 80"
          value={formData.ceilingArea || ''}
          onChange={(e) => updateFormData('ceilingArea', e.target.value)}
        />
        <small>Overhead ceiling above stairs</small>
      </div>

      <h4 style={{ marginTop: '1.5rem' }}>Optional Add-Ons</h4>
      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.includeRailings || false}
            onChange={(e) => updateFormData('includeRailings', e.target.checked)}
          />
          <span>Include Railings/Banisters</span>
        </label>
      </div>

      {formData.includeRailings && (
        <div className="form-group" style={{ marginTop: '1rem', paddingLeft: '1.5rem', borderLeft: '3px solid var(--color-steel-blue)' }}>
          <label htmlFor="railingsLength">Railing Length (linear feet) *</label>
          <input
            type="number"
            id="railingsLength"
            min="0"
            step="0.5"
            placeholder="e.g. 20"
            value={formData.railingsLength || ''}
            onChange={(e) => updateFormData('railingsLength', e.target.value)}
            required
          />
          <small>Total length of all railings/banisters</small>
        </div>
      )}

      <div className="info-box" style={{
        background: 'var(--color-golden-beige)',
        padding: '1.5rem',
        borderRadius: '12px',
        marginTop: '1.5rem',
        fontSize: '0.95rem',
        color: 'var(--color-soft-charcoal)',
        border: '2px solid var(--color-soft-charcoal)',
        boxShadow: '0 4px 12px rgba(217, 182, 101, 0.3)',
        fontWeight: '500'
      }}>
        <strong>Note:</strong> Staircase painting includes additional labor costs due to:
        <ul style={{ marginTop: '0.75rem', paddingLeft: '1.5rem', fontWeight: '500' }}>
          <li>Difficult access and positioning</li>
          <li>Safety equipment requirements</li>
          <li>Overhead work on angles</li>
        </ul>
      </div>
    </div>
  );

  const renderGarageDoorForm = () => (
    <div className="form-group-container">
      <h3>Garage Door Details</h3>
      <p className="form-help">
        Provide details about your garage door for an accurate exterior painting estimate. 
        Weather-resistant finishes ensure long-lasting protection.
      </p>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="width">Door Width (feet) *</label>
          <input
            type="number"
            id="width"
            min="6"
            max="20"
            step="0.5"
            placeholder="e.g., 16"
            value={formData.width || ''}
            onChange={(e) => updateFormData('width', e.target.value)}
            required
          />
          <small>Standard garage doors are 8-18 feet wide</small>
        </div>

        <div className="form-group">
          <label htmlFor="height">Door Height (feet) *</label>
          <input
            type="number"
            id="height"
            min="6"
            max="8"
            step="0.5"
            placeholder="e.g., 7"
            value={formData.height || ''}
            onChange={(e) => updateFormData('height', e.target.value)}
            required
          />
          <small>Standard garage doors are 7-8 feet tall</small>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="doors">Number of Doors</label>
          <input
            type="number"
            id="doors"
            min="1"
            max="4"
            placeholder="e.g., 2"
            value={formData.doors || ''}
            onChange={(e) => updateFormData('doors', e.target.value)}
          />
          <small>Count the number of garage door sections</small>
        </div>

        <div className="form-group">
          <label htmlFor="material">Door Material *</label>
          <select
            id="material"
            value={formData.material || ''}
            onChange={(e) => updateFormData('material', e.target.value)}
            required
          >
            <option value="">Select material</option>
            <option value="steel">Steel</option>
            <option value="wood">Wood</option>
            <option value="aluminum">Aluminum</option>
            <option value="fiberglass">Fiberglass</option>
          </select>
          <small>Different materials require different prep work</small>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="condition">Current Condition *</label>
          <select
            id="condition"
            value={formData.condition || ''}
            onChange={(e) => updateFormData('condition', e.target.value)}
            required
          >
            <option value="">Select condition</option>
            <option value="good">Good - Minimal prep needed</option>
            <option value="fair">Fair - Some prep required</option>
            <option value="poor">Poor - Extensive prep needed</option>
          </select>
          <small>Condition affects prep time and cost</small>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.includeHardware || false}
              onChange={(e) => updateFormData('includeHardware', e.target.checked)}
            />
            <span>Include hardware removal and replacement</span>
          </label>
          <small>Remove and reinstall handles, hinges, and hardware</small>
        </div>
      </div>

      <div className="info-box" style={{
        background: 'var(--color-bone)',
        padding: '1.5rem',
        borderRadius: '12px',
        marginTop: '1.5rem',
        fontSize: '0.95rem',
        color: 'var(--color-steel-blue)',
        border: '2px solid var(--color-calm-blue-gray)',
        boxShadow: '0 4px 12px rgba(44, 61, 75, 0.08)',
        fontWeight: '500'
      }}>
        <strong>Note:</strong> Garage door painting includes weather-resistant exterior paint, 
        proper surface preparation, and protection of surrounding areas. Different materials 
        and conditions affect prep time and final cost.
      </div>
    </div>
  );

  const renderPopcornCeilingRemovalForm = () => (
    <div className="form-group-container popcorn-ceiling-form">
      <div className="form-header">
        <h3>Ceiling Removal Details</h3>
        <p>Enter your ceiling measurements and additional services to receive an <b>estimate</b></p>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="length">Length (ft) *</label>
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
          <label htmlFor="width">Width (ft) *</label>
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

      <div className="form-group">
        <label>Additional Services</label>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.includeSkimCoat || false}
              onChange={(e) => updateFormData('includeSkimCoat', e.target.checked)}
            />
            <span>Skim Coat (Smooth Finish)</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.includePainting || false}
              onChange={(e) => updateFormData('includePainting', e.target.checked)}
            />
            <span>Paint Ceiling</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderBathroomVanityCabinetForm = () => (
    <div className="form-group-container bathroom-vanity-form">
      <div className="form-header">
        <h3>Vanity Dimensions</h3>
        <p>Enter your bathroom vanity measurements to receive an <b>estimate</b></p>
      </div>

      <div className="form-row dimensions-row">
        <div className="form-group">
          <label htmlFor="width">Width (in) *</label>
          <input
            type="number"
            id="width"
            min="1"
            step="0.5"
            placeholder="e.g. 30"
            value={formData.width || ''}
            onChange={(e) => updateFormData('width', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="height">Height (in) *</label>
          <input
            type="number"
            id="height"
            min="1"
            step="0.5"
            placeholder="e.g. 34"
            value={formData.height || ''}
            onChange={(e) => updateFormData('height', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="depth">Depth (in) *</label>
          <input
            type="number"
            id="depth"
            min="1"
            step="0.5"
            placeholder="e.g. 21"
            value={formData.depth || ''}
            onChange={(e) => updateFormData('depth', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-row counts-row">
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
          <label htmlFor="drawers">Number of Drawers</label>
          <input
            type="number"
            id="drawers"
            min="0"
            placeholder="0"
            value={formData.drawers || ''}
            onChange={(e) => updateFormData('drawers', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Additional Services</label>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.includeHardware || false}
              onChange={(e) => updateFormData('includeHardware', e.target.checked)}
            />
            <span>Include Hardware Removal/Replacement</span>
          </label>
        </div>
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
        return renderBathroomForm();
      case 'kitchen-walls':
        return renderKitchenWallsForm();
      case 'kitchen-cabinet-painting':
        return renderKitchenCabinetForm();
      case 'garage-door':
        return renderGarageDoorForm();
      case 'basement-painting':
        return renderBasementForm();
      case 'trimming-baseboards':
        return renderBaseboardForm();
      case 'bedroom-painting':
        return renderBedroomForm();
      case 'staircase-painting':
        return renderStaircaseForm();
      case 'fence-painting':
        return renderFenceForm();
      case 'exterior-railings':
        return renderExteriorRailingsForm();
      case 'stucco-ceiling-removal':
        return renderPopcornCeilingRemovalForm();
      case 'bathroom-vanity-cabinet':
        return renderBathroomVanityCabinetForm();
      default:
        return <p>Form not implemented for this service</p>;
    }
  };

  return (
    <div className="calculated-service-form">
      {renderForm()}
      
    </div>
  );
};

export default CalculatedServiceForm;

