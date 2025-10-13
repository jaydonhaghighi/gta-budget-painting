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
  formatCurrency,
  RATES,
  PRODUCTION_RATES,
  type EstimateBreakdown
} from '../../utils/estimationCalculator';
import './ServiceForms.css';

interface CalculatedServiceFormProps {
  service: Service;
  initialFormData?: any;
  initialEstimate?: EstimateBreakdown | null;
  onEstimateCalculated: (estimate: EstimateBreakdown, formData: any) => void;
  onFormDataChange?: (formData: any) => void; // NEW: Callback for every form change
  onAddToCart?: (estimate: EstimateBreakdown, formData: any) => void;
  onSaveEdit?: (estimate: EstimateBreakdown, formData: any) => void;
  isEditMode?: boolean;
}

const CalculatedServiceForm = ({ 
  service, 
  initialFormData = {}, 
  initialEstimate = null,
  onEstimateCalculated,
  onFormDataChange,
  onAddToCart,
  onSaveEdit,
  isEditMode = false,
}: CalculatedServiceFormProps) => {
  const [formData, setFormData] = useState<any>(initialFormData);
  const [estimate, setEstimate] = useState<EstimateBreakdown | null>(initialEstimate);

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
                includeCeiling: bedroom.includeCeiling !== false,
                includeBaseboards: bedroom.includeBaseboards !== false,
                baseboardProfile: bedroom.baseboardProfile || 'low',
                doors: parseInt(bedroom.doors) || 1,
                windows: parseInt(bedroom.windows) || 1
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

  const renderBathroomForm = () => (
    <div className="form-group-container">
      <h3>Bathroom Measurements</h3>
      <p className="form-help">Provide your bathroom dimensions for accurate estimate</p>
      
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
        <strong>💡 Note:</strong> Small bathrooms use moisture-resistant paint and require careful cutting around fixtures.
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
        <strong>💡 Basement Tips:</strong>
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
      { id: 1, name: '', length: '', width: '', height: '', includeCeiling: true, includeBaseboards: true, baseboardProfile: 'low', doors: '1', windows: '1' }
    ];

    const addBedroom = () => {
      const newId = Math.max(...bedrooms.map((b: any) => b.id), 0) + 1;
      updateFormData('bedrooms', [
        ...bedrooms,
        { id: newId, name: '', length: '', width: '', height: '', includeCeiling: true, includeBaseboards: true, baseboardProfile: 'low', doors: '1', windows: '1' }
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
      <div className="form-group-container">
        <h3>Bedroom(s) Measurements</h3>
        <p className="form-help">Add one or more bedrooms to calculate your total estimate</p>

        {bedrooms.map((bedroom: any, index: number) => (
          <div key={bedroom.id} className="multi-room-item" style={{
            border: '2px solid var(--color-calm-blue-gray)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            background: 'var(--color-bone)',
            boxShadow: '0 4px 12px rgba(44, 61, 75, 0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0, color: 'var(--color-steel-blue)', fontWeight: '700' }}>Bedroom {index + 1}</h4>
              {bedrooms.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBedroom(bedroom.id)}
                  className="btn-remove-room"
                  style={{
                    background: 'var(--color-golden-beige)',
                    color: 'var(--color-soft-charcoal)',
                    border: '2px solid var(--color-soft-charcoal)',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    boxShadow: '0 4px 12px rgba(217, 182, 101, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Remove
                </button>
              )}
            </div>

            <div className="form-group">
              <label htmlFor={`bedroom-${bedroom.id}-name`}>Bedroom Name (optional)</label>
              <input
                type="text"
                id={`bedroom-${bedroom.id}-name`}
                placeholder="e.g. Master Bedroom, Guest Room"
                value={bedroom.name}
                onChange={(e) => updateBedroom(bedroom.id, 'name', e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`bedroom-${bedroom.id}-length`}>Length (feet) *</label>
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
                <label htmlFor={`bedroom-${bedroom.id}-width`}>Width (feet) *</label>
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
              <div className="form-group">
                <label htmlFor={`bedroom-${bedroom.id}-height`}>Height (feet) *</label>
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
            </div>

            <div className="checkbox-group" style={{ marginTop: '0.75rem' }}>
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

            <div className="form-row" style={{ marginTop: '0.75rem' }}>
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
          className="btn-add-room"
          style={{
            background: 'var(--color-steel-blue)',
            color: 'white',
            border: '3px solid var(--color-golden-beige)',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '700',
            width: '100%',
            marginTop: '1rem',
            boxShadow: '0 8px 24px rgba(44, 61, 75, 0.2)',
            transition: 'all 0.3s ease'
          }}
        >
          + Add Another Bedroom
        </button>
      </div>
    );
  };

  const renderKitchenWallsForm = () => (
    <div className="form-group-container">
      <h3>Kitchen Measurements</h3>
      <p className="form-help">Measure your kitchen walls for high-traffic, scrubbable paint</p>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="length">Kitchen Length (feet) *</label>
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
          <label htmlFor="width">Kitchen Width (feet) *</label>
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
        <label htmlFor="height">Wall Height (feet) *</label>
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
        <small>Typically 8 feet for standard kitchens</small>
      </div>

      <h4>What's Included?</h4>
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
        <strong>💡 Note:</strong> Kitchen walls use durable, scrubbable paint perfect for high-traffic cooking areas. Ceiling not typically included.
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
            display: 'block',
            marginBottom: '1rem'
          }}>
            📸 Upload Cabinet Photos (Optional)
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
            📁 Choose Images
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
            <strong>💡 Tip:</strong> Upload clear photos showing the current condition, style, and any specific details of your cabinets. This helps us provide the most accurate estimate.
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
          <strong>💡 Note:</strong> Cabinet painting requires detailed preparation, multiple coats, and careful attention to hardware. Each section can have different dimensions and hardware requirements.
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
            <div className="estimate-badge">
              <img src="/money-bag.png" alt="Money" className="estimate-badge-icon" />
              Your Estimate
            </div>
            <div className="estimate-total-section">
              <div className="estimate-label">Estimated Total</div>
              <div className="estimate-total">{formatCurrency(estimate.totalCost)}</div>
              <div className="estimate-subtitle">Professional review pending</div>
            </div>
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
                  <span>Paint ({estimate.paintGallons} gallons @ ${RATES.PAINT_RATE}/gal)</span>
                  <span className="detail-value">{formatCurrency(estimate.paintCost)}</span>
                </div>
                <div className="detail-row">
                  <span>Supplies</span>
                  <span className="detail-value">{formatCurrency(estimate.suppliesCost)}</span>
                </div>
                <div className="detail-row">
                  <span>Other Fees</span>
                  <span className="detail-value">{formatCurrency(estimate.prepFee + estimate.travelFee)}</span>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="estimate-section estimate-total-box">
              <div className="detail-row total-final">
                <span>Total Price</span>
                <span className="detail-value-large">{formatCurrency(estimate.totalCost)}</span>
              </div>
            </div>
          </div>

          <div className="estimate-disclaimer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm.93 12.93h-1.86v-1.86h1.86v1.86zm0-3.72H7.07V3.07h1.86v6.14z"/>
            </svg>
            <span>This is a preliminary estimate. Final pricing will be confirmed by our professionals after review.</span>
          </div>
          
          <div className="estimate-actions">
            {isEditMode ? (
              <>
                <button className="btn-secondary" onClick={(e) => {
                  e.preventDefault()
                  if (estimate && onSaveEdit) onSaveEdit(estimate, formData)
                }}>Save Changes</button>
                <button className="btn-continue-estimate" onClick={(e) => { e.preventDefault(); window.history.back() }}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button className="btn-secondary" onClick={(e) => {
                  e.preventDefault()
                  if (estimate && onAddToCart) onAddToCart(estimate, formData)
                }}>Add to Cart</button>
                <button className="btn-continue-estimate" onClick={handleContinue}>
                  Continue with This Estimate
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculatedServiceForm;

