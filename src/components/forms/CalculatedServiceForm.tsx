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
  calculateGarageDoor,
  calculateDrivewaySealing,
  calculatePopcornCeilingRemoval,
  calculateBathroomVanityCabinet,
  calculateStairway,
  calculateHallway,
  calculateDrywallRepair,
  RATES,
  PRODUCTION_RATES,
  type EstimateBreakdown
} from '../../utils/estimationCalculator';
import ImageUpload from './ImageUpload';
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
  const [images, setImages] = useState<File[]>(initialFormData.images || []);
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialFormData.imagePreviews || []);
  const [isFinishTypeGuideOpen, setIsFinishTypeGuideOpen] = useState<boolean>(false);

  // Update form data when initial props change (e.g., when navigating back or restored from localStorage)
  useEffect(() => {
    if (initialFormData && Object.keys(initialFormData).length > 0) {
      setFormData(initialFormData);
      if (initialFormData.images) {
        setImages(initialFormData.images);
      }
      if (initialFormData.imagePreviews) {
        setImagePreviews(initialFormData.imagePreviews);
      }
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

  const handleImagesChange = (newImages: File[], newPreviews: string[]) => {
    setImages(newImages);
    setImagePreviews(newPreviews);
    const newData = { ...formData, images: newImages, imagePreviews: newPreviews };
    setFormData(newData);
    
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
        return data.linearFeet && data.height && data.finishType &&
               parseFloat(data.linearFeet) > 0 && parseFloat(data.height) > 0;

      case 'driveway-sealing': {
        const sizeValid = Boolean(data.drivewaySize);
        if (!sizeValid) return false;
        // If crack filling is selected, require a positive linear-feet value
        if (data.includeCrackFilling) {
          return data.crackFillingLinearFeet && parseFloat(data.crackFillingLinearFeet) > 0;
        }
        return true;
      }
      
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
      
      case 'stairway-painting':
        const stairwayBaseValid = data.stairLength && data.stairHeight &&
               parseFloat(data.stairLength) > 0 && parseFloat(data.stairHeight) > 0;
        if (!stairwayBaseValid) return false;
        // If ceiling is included, length and width are required
        if (data.includeCeiling) {
          return data.ceilingLength && data.ceilingWidth &&
                 parseFloat(data.ceilingLength) > 0 && parseFloat(data.ceilingWidth) > 0;
        }
        return true;
      
      case 'hallway-painting':
        return data.hallwayLength && data.hallwayHeight && data.hallwayWidth &&
               parseFloat(data.hallwayLength) > 0 && parseFloat(data.hallwayHeight) > 0 && parseFloat(data.hallwayWidth) > 0;
      
      case 'drywall-repair':
        // Accept either room dimensions OR wall area
        const hasRoomDimensions = data.roomLength && data.roomWidth && 
                                  parseFloat(data.roomLength) > 0 && parseFloat(data.roomWidth) > 0;
        const hasWallArea = data.wallArea && parseFloat(data.wallArea) > 0;
        return (hasRoomDimensions || hasWallArea) && data.wallCondition;
      
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
                windows: parseInt(bedroom.windows) || 0,
                includeCloset: bedroom.includeCloset === true
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
          if (data.linearFeet && data.height && data.finishType) {
            const sides = parseInt(data.sides) || 1;
            const includeStaining = data.finishType && data.finishType !== 'paint';
            newEstimate = calculateFence({
              linearFeet: parseFloat(data.linearFeet),
              height: parseFloat(data.height),
              sides: (sides === 2 ? 2 : 1) as 1 | 2,
              includeStaining: includeStaining
            });
          }
          break;

        case 'driveway-sealing':
          if (data.drivewaySize) {
            newEstimate = calculateDrivewaySealing({
              drivewaySize: data.drivewaySize,
              drivewaySqFt: data.drivewaySqFt ? parseFloat(data.drivewaySqFt) : undefined,
              crackFillingLinearFeet: data.includeCrackFilling ? (parseFloat(data.crackFillingLinearFeet) || 0) : 0,
              includeOilStainPrimer: data.includeOilStainPrimer || false,
              includeSecondCoat: data.includeSecondCoat || false,
              includeHandEdging: data.includeHandEdging || false,
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

        case 'stairway-painting':
          if (data.stairLength && data.stairHeight) {
            const wallArea = 2 * (parseFloat(data.stairLength) || 0) * (parseFloat(data.stairHeight) || 0);
            const ceilingArea = data.includeCeiling && data.ceilingLength && data.ceilingWidth
              ? (parseFloat(data.ceilingLength) || 0) * (parseFloat(data.ceilingWidth) || 0)
              : 0;
            newEstimate = calculateStairway({
              wallArea,
              numberOfStairs: parseInt(data.numberOfStairs) || 0,
              staircaseType: data.staircaseType || 'straight',
              includeCeiling: data.includeCeiling || false,
              ceilingArea
            });
          }
          break;

        case 'hallway-painting':
          if (data.hallwayLength && data.hallwayHeight && data.hallwayWidth) {
            const hallwayLength = parseFloat(data.hallwayLength) || 0;
            const hallwayHeight = parseFloat(data.hallwayHeight) || 0;
            const hallwayWidth = parseFloat(data.hallwayWidth) || 0;
            const wallArea = 2 * hallwayLength * hallwayHeight;
            // Auto-calculate ceiling area from hallway dimensions
            const ceilingArea = data.includeCeiling ? hallwayLength * hallwayWidth : 0;
            // Auto-calculate baseboard linear feet (both sides of hallway)
            const baseboardLinearFeet = data.includeBaseboards ? hallwayLength * 2 : 0;
            newEstimate = calculateHallway({
              wallArea,
              includeCeiling: data.includeCeiling || false,
              ceilingArea,
              includeBaseboards: data.includeBaseboards || false,
              baseboardLinearFeet
            });
          }
          break;

        case 'drywall-repair':
          if (data.wallCondition) {
            // Calculate wall area from room dimensions if provided, otherwise use direct wallArea
            let wallArea = parseFloat(data.wallArea) || 0;
            if (!wallArea && data.roomLength && data.roomWidth && data.roomHeight) {
              const length = parseFloat(data.roomLength) || 0;
              const width = parseFloat(data.roomWidth) || 0;
              const height = parseFloat(data.roomHeight) || 9;
              wallArea = 2 * (length * height + width * height);
            }
            
            if (wallArea > 0) {
              newEstimate = calculateDrywallRepair({
                wallArea: wallArea,
                wallCondition: data.wallCondition,
                hasHoles: data.hasHoles || false,
                hasCracks: data.hasCracks || false,
                hasDents: data.hasDents || false,
                hasWaterDamage: data.hasWaterDamage || false,
                includePriming: data.includePriming !== false,
                includePainting: data.includePainting || false
              });
            }
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
            value={formData.height || ''}
            onChange={(e) => updateFormData('height', e.target.value)}
            required
          />
        </div>
      </div>

      <ImageUpload
        images={images}
        imagePreviews={imagePreviews}
        onImagesChange={handleImagesChange}
        maxImages={5}
        required={false}
      />
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
            value={formData.width || ''}
            onChange={(e) => updateFormData('width', e.target.value)}
            required
          />
        </div>
      </div>

      <ImageUpload
        images={images}
        imagePreviews={imagePreviews}
        onImagesChange={handleImagesChange}
        maxImages={5}
        required={false}
      />
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

      <ImageUpload
        images={images}
        imagePreviews={imagePreviews}
        onImagesChange={handleImagesChange}
        maxImages={5}
        required={false}
      />
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

      <ImageUpload
        images={images}
        imagePreviews={imagePreviews}
        onImagesChange={handleImagesChange}
        maxImages={5}
        required={false}
      />
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
            value={formData.windows || ''}
            onChange={(e) => updateFormData('windows', e.target.value)}
          />
          <small>Basement windows are often small or none</small>
        </div>
      </div>

      <div className="info-box" style={{
        background: 'var(--color-steel-blue)',
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

      <ImageUpload
        images={images}
        imagePreviews={imagePreviews}
        onImagesChange={handleImagesChange}
        maxImages={5}
        required={false}
      />
    </div>
  );

  const renderBedroomForm = () => {
    const bedrooms = formData.bedrooms || [
      { id: 1, type: '', length: '', width: '', height: '', includeCeiling: false, includeBaseboards: false, baseboardProfile: 'low', doors: '', windows: '', includeCloset: false }
    ];

    const addBedroom = () => {
      const newId = Math.max(...bedrooms.map((b: any) => b.id), 0) + 1;
      updateFormData('bedrooms', [
        ...bedrooms,
        { id: newId, type: '', length: '', width: '', height: '', includeCeiling: false, includeBaseboards: false, baseboardProfile: 'low', doors: '', windows: '', includeCloset: false }
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
                <option value="living-room">Living Room</option>
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
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={bedroom.includeCloset || false}
                      onChange={(e) => updateBedroom(bedroom.id, 'includeCloset', e.target.checked)}
                    />
                    <span>Include Closet</span>
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

        <ImageUpload
          images={images}
          imagePreviews={imagePreviews}
          onImagesChange={handleImagesChange}
          maxImages={5}
          required={false}
        />
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
            value={formData.windows || ''}
            onChange={(e) => updateFormData('windows', e.target.value)}
          />
        </div>
      </div>

      <ImageUpload
        images={images}
        imagePreviews={imagePreviews}
        onImagesChange={handleImagesChange}
        maxImages={5}
        required={false}
      />
    </div>
  );


  const renderFenceForm = () => (
    <div className="form-group-container fence-form">
      <div className="form-header">
        <h3>Fence Measurements</h3>
        <p>Tell us about your fence so we can provide an accurate estimate</p>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="linearFeet">Length (linear feet) *</label>
          <input
            type="number"
            id="linearFeet"
            min="1"
            step="0.5"
            value={formData.linearFeet || ''}
            onChange={(e) => updateFormData('linearFeet', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="height">Height (feet) *</label>
          <input
            type="number"
            id="height"
            min="1"
            step="0.5"
            value={formData.height || ''}
            onChange={(e) => updateFormData('height', e.target.value)}
            required
          />
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

      <div className="form-group">
        <label htmlFor="finishType">Finish Type *</label>
        <select
          id="finishType"
          value={formData.finishType || 'paint'}
          onChange={(e) => updateFormData('finishType', e.target.value)}
          required
        >
          <option value="paint">Paint (2 coats)</option>
          <option value="stain-transparent">Stain - Transparent</option>
          <option value="stain-semi-transparent">Stain - Semi-Transparent</option>
          <option value="stain-solid">Stain - Solid Color</option>
        </select>
      </div>

      <div className="info-box collapsible">
        <button
          type="button"
          className="collapsible-header"
          onClick={() => setIsFinishTypeGuideOpen(!isFinishTypeGuideOpen)}
          aria-expanded={isFinishTypeGuideOpen}
        >
          <strong>Finish Type Guide</strong>
          <span className="collapsible-icon">{isFinishTypeGuideOpen ? '▼' : '▶'}</span>
        </button>
        {isFinishTypeGuideOpen && (
          <div className="collapsible-content">
            <ul>
              <li><strong>Paint:</strong> Solid color, most durable, hides imperfections (2 coats)</li>
              <li><strong>Transparent Stain:</strong> Shows natural wood grain, minimal color (1 coat)</li>
              <li><strong>Semi-Transparent Stain:</strong> Some wood grain visible, moderate color (1 coat)</li>
              <li><strong>Solid Color Stain:</strong> Hides wood grain, opaque color, more durable (1 coat)</li>
            </ul>
          </div>
        )}
      </div>

      <ImageUpload
        images={images}
        imagePreviews={imagePreviews}
        onImagesChange={handleImagesChange}
        maxImages={5}
        required={false}
      />
    </div>
  );

  const renderDrivewaySealingForm = () => (
    <div className="form-group-container driveway-sealing-form">
      <div className="form-header">
        <h3>Driveway Sealing</h3>
        <p>Select your driveway size and optional add-ons to receive an estimate</p>
      </div>

      <div className="form-group">
        <label htmlFor="drivewaySize">Driveway Size *</label>
        <select
          id="drivewaySize"
          value={formData.drivewaySize || ''}
          onChange={(e) => updateFormData('drivewaySize', e.target.value)}
          required
        >
          <option value="">Select size</option>
          <option value="1-car">1-car driveway ($150-$200)</option>
          <option value="2-car">2-car driveway ($220-$300)</option>
          <option value="large">Large / double-wide ($300-$450+)</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="drivewaySqFt">Driveway Area (sq ft) (optional)</label>
        <input
          type="number"
          id="drivewaySqFt"
          min="0"
          step="1"
          value={formData.drivewaySqFt || ''}
          onChange={(e) => updateFormData('drivewaySqFt', e.target.value)}
        />
        <small>Used to estimate sealer quantity (not required)</small>
      </div>

      <h4 className="driveway-section-title">Add-Ons</h4>
      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.includeCrackFilling || false}
            onChange={(e) => updateFormData('includeCrackFilling', e.target.checked)}
          />
          <span>Crack filling ($1-$3 per linear ft)</span>
        </label>

        {formData.includeCrackFilling && (
          <div className="form-group" style={{ marginTop: '0.75rem', paddingLeft: '1.5rem', borderLeft: '3px solid var(--color-steel-blue)' }}>
            <label htmlFor="crackFillingLinearFeet">Crack filling length (linear ft) *</label>
            <input
              type="number"
              id="crackFillingLinearFeet"
              min="0"
              step="1"
              value={formData.crackFillingLinearFeet || ''}
              onChange={(e) => updateFormData('crackFillingLinearFeet', e.target.value)}
              required
            />
          </div>
        )}

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.includeOilStainPrimer || false}
            onChange={(e) => updateFormData('includeOilStainPrimer', e.target.checked)}
          />
          <span>Oil stain primer (+$25-$50)</span>
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.includeSecondCoat || false}
            onChange={(e) => updateFormData('includeSecondCoat', e.target.checked)}
          />
          <span>Second coat (+30-40%)</span>
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.includeHandEdging || false}
            onChange={(e) => updateFormData('includeHandEdging', e.target.checked)}
          />
          <span>Hand edging / brush finish (+$25-$50)</span>
        </label>
      </div>

      <div className="info-box">
        <strong>Sealer guidance:</strong>
        <ul style={{ marginTop: '0.75rem', paddingLeft: '1.5rem', marginBottom: 0, fontWeight: '500' }}>
          <li>1 pail (5-gal) covers about 250-300 sq ft</li>
          <li>Material quantity is calculated automatically based on your driveway size</li>
          <li>All pricing includes professional-grade sealer and application</li>
        </ul>
      </div>

      <ImageUpload
        images={images}
        imagePreviews={imagePreviews}
        onImagesChange={handleImagesChange}
        maxImages={5}
        required={false}
      />
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

      <ImageUpload
        images={images}
        imagePreviews={imagePreviews}
        onImagesChange={handleImagesChange}
        maxImages={5}
        required={false}
      />
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
            value={formData.railingsLength || ''}
            onChange={(e) => updateFormData('railingsLength', e.target.value)}
            required
          />
          <small>Total length of all railings/banisters</small>
        </div>
      )}

      <div className="info-box" style={{
        background: 'var(--color-steel-blue)',
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

      <ImageUpload
        images={images}
        imagePreviews={imagePreviews}
        onImagesChange={handleImagesChange}
        maxImages={5}
        required={false}
      />
    </div>
  );

  const renderGarageDoorForm = () => (
    <div className="form-group-container garage-door-form">
      <div className="form-header">
        <h3>Garage Door Details</h3>
        <p>Tell us about your garage door so we can provide an accurate estimate</p>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="width">Width (ft) *</label>
          <input
            type="number"
            id="width"
            min="6"
            max="20"
            step="0.5"
            value={formData.width || ''}
            onChange={(e) => updateFormData('width', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="height">Height (ft) *</label>
          <input
            type="number"
            id="height"
            min="6"
            max="8"
            step="0.5"
            value={formData.height || ''}
            onChange={(e) => updateFormData('height', e.target.value)}
            required
          />
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
            value={formData.doors || ''}
            onChange={(e) => updateFormData('doors', e.target.value)}
          />
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
        </div>
      </div>

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
      </div>

      <ImageUpload
        images={images}
        imagePreviews={imagePreviews}
        onImagesChange={handleImagesChange}
        maxImages={5}
        required={false}
      />
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

      <ImageUpload
        images={images}
        imagePreviews={imagePreviews}
        onImagesChange={handleImagesChange}
        maxImages={5}
        required={false}
      />
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

      <ImageUpload
        images={images}
        imagePreviews={imagePreviews}
        onImagesChange={handleImagesChange}
        maxImages={5}
        required={false}
      />
    </div>
  );

  const renderStairwayForm = () => (
    <div className="form-group-container stairway-form">
      <div className="form-header">
        <h3>Stairway Measurements</h3>
        <p>Enter your stairway measurements to receive an <b>estimate</b></p>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="stairLength">Stairway Length (ft) *</label>
          <input
            type="number"
            id="stairLength"
            min="1"
            step="0.5"
            value={formData.stairLength || ''}
            onChange={(e) => updateFormData('stairLength', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="stairHeight">Wall Height (ft) *</label>
          <input
            type="number"
            id="stairHeight"
            min="7"
            step="0.5"
            value={formData.stairHeight || ''}
            onChange={(e) => updateFormData('stairHeight', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="numberOfStairs">Number of Stairs</label>
          <input
            type="number"
            id="numberOfStairs"
            min="0"
            value={formData.numberOfStairs || ''}
            onChange={(e) => updateFormData('numberOfStairs', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="staircaseType">Staircase Type</label>
        <select
          id="staircaseType"
          value={formData.staircaseType || ''}
          onChange={(e) => updateFormData('staircaseType', e.target.value)}
        >
          <option value="">Select type</option>
          <option value="straight">Straight Staircase</option>
          <option value="l-shaped">L-Shaped Staircase</option>
          <option value="u-shaped">U-Shaped Staircase</option>
          <option value="spiral">Spiral Staircase</option>
          <option value="curved">Curved Staircase</option>
        </select>
      </div>

      <h4>Additional Services</h4>
      <div className="checkbox-group">
        <label style={{ marginBottom: '0.25rem' }} className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.includeCeiling || false}
            onChange={(e) => updateFormData('includeCeiling', e.target.checked)}
          />
          <span>Include Ceiling</span>
        </label>
      </div>

      {formData.includeCeiling && (
        <div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ceilingLength">Ceiling Length (ft) *</label>
              <input
                type="number"
                id="ceilingLength"
                min="1"
                step="0.5"
                value={formData.ceilingLength || ''}
                onChange={(e) => updateFormData('ceilingLength', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="ceilingWidth">Ceiling Width (ft) *</label>
              <input
                type="number"
                id="ceilingWidth"
                min="1"
                step="0.5"
                value={formData.ceilingWidth || ''}
                onChange={(e) => updateFormData('ceilingWidth', e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      )}

      <ImageUpload
        images={images}
        imagePreviews={imagePreviews}
        onImagesChange={handleImagesChange}
        maxImages={5}
        required={false}
      />
    </div>
  );

  const renderHallwayForm = () => (
    <div className="form-group-container hallway-form">
      <div className="form-header">
        <h3>Hallway Measurements</h3>
        <p>Enter your hallway measurements to receive an <b>estimate</b></p>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="hallwayLength">Hallway Length (ft) *</label>
          <input
            type="number"
            id="hallwayLength"
            min="1"
            step="0.5"
            value={formData.hallwayLength || ''}
            onChange={(e) => updateFormData('hallwayLength', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="hallwayHeight">Wall Height (ft) *</label>
          <input
            type="number"
            id="hallwayHeight"
            min="7"
            step="0.5"
            value={formData.hallwayHeight || ''}
            onChange={(e) => updateFormData('hallwayHeight', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="hallwayWidth">Hallway Width (ft) *</label>
          <input
            type="number"
            id="hallwayWidth"
            min="1"
            step="0.5"
            value={formData.hallwayWidth || ''}
            onChange={(e) => updateFormData('hallwayWidth', e.target.value)}
            required
          />
        </div>
      </div>

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

      <ImageUpload
        images={images}
        imagePreviews={imagePreviews}
        onImagesChange={handleImagesChange}
        maxImages={5}
        required={false}
      />
    </div>
  );

  const renderDrywallRepairForm = () => {
    // Calculate wall area from room dimensions if provided
    const calculateWallArea = (length: number, width: number, height: number) => {
      if (length && width && height) {
        // Calculate all 4 walls: 2 × (length × height) + 2 × (width × height)
        return 2 * (length * height + width * height);
      }
      return null;
    };

    // Auto-calculate wall area when dimensions change
    const roomLength = parseFloat(formData.roomLength) || 0;
    const roomWidth = parseFloat(formData.roomWidth) || 0;
    const roomHeight = parseFloat(formData.roomHeight) || 9; // Default to 9ft
    const calculatedArea = calculateWallArea(roomLength, roomWidth, roomHeight);

    // Auto-infer damage types based on condition to simplify form
    const handleConditionChange = (condition: string) => {
      const newData = { ...formData, wallCondition: condition };
      
      // Auto-set common damage types based on condition
      if (condition === 'minor') {
        newData.hasHoles = true;
        newData.hasDents = true;
        newData.hasCracks = false;
        newData.hasWaterDamage = false;
      } else if (condition === 'moderate') {
        newData.hasHoles = true;
        newData.hasCracks = true;
        newData.hasDents = true;
        newData.hasWaterDamage = false;
      } else if (condition === 'extensive') {
        newData.hasHoles = true;
        newData.hasCracks = true;
        newData.hasDents = true;
        // Water damage is optional even for extensive - preserve existing value
        newData.hasWaterDamage = newData.hasWaterDamage || false;
      }
      
      setFormData(newData);
      calculateEstimate(newData);
      if (onFormDataChange) {
        onFormDataChange(newData);
      }
    };

    // Update wall area when dimensions change
    const handleDimensionChange = (field: string, value: string) => {
      const newData = { ...formData, [field]: value };
      
      // If changing room dimensions, clear preset wallArea and recalculate
      if (field === 'roomLength' || field === 'roomWidth' || field === 'roomHeight') {
        const newLength = field === 'roomLength' ? parseFloat(value) || 0 : roomLength;
        const newWidth = field === 'roomWidth' ? parseFloat(value) || 0 : roomWidth;
        const newHeight = field === 'roomHeight' ? parseFloat(value) || 9 : roomHeight;
        const newArea = calculateWallArea(newLength, newWidth, newHeight);
        
        // If we have a calculated area, use it; otherwise clear wallArea
        if (newArea && newLength > 0 && newWidth > 0) {
          newData.wallArea = newArea.toFixed(0);
        } else if (newLength === 0 || newWidth === 0) {
          // Clear wallArea if dimensions are incomplete
          newData.wallArea = '';
        }
      }
      
      setFormData(newData);
      calculateEstimate(newData);
      if (onFormDataChange) {
        onFormDataChange(newData);
      }
    };

    return (
      <div className="form-group-container drywall-repair-form">
        <div className="form-header">
          <h3>Drywall Repair Assessment</h3>
          <p>Enter your repair details to receive an <b>estimate</b></p>
        </div>

        {/* Area Input */}
        <div className="form-group">
          <label htmlFor="wallArea">Wall Area Needing Repair (sq ft) *</label>
          <input
            type="number"
            id="wallArea"
            min="0"
            step="1"
            value={calculatedArea ? calculatedArea.toFixed(0) : (formData.wallArea || '')}
            onChange={(e) => {
              const value = e.target.value;
              const newData = {
                ...formData,
                wallArea: value,
                // Clear room dimensions when manually entering
                roomLength: value ? '' : formData.roomLength,
                roomWidth: value ? '' : formData.roomWidth
              };
              setFormData(newData);
              calculateEstimate(newData);
              if (onFormDataChange) {
                onFormDataChange(newData);
              }
            }}
            required
          />
        </div>

        {/* Room Dimensions Option */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="roomLength">Room Length (ft)</label>
            <input
              type="number"
              id="roomLength"
              min="1"
              step="0.5"
              value={formData.roomLength || ''}
              onChange={(e) => handleDimensionChange('roomLength', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="roomWidth">Room Width (ft)</label>
            <input
              type="number"
              id="roomWidth"
              min="1"
              step="0.5"
              value={formData.roomWidth || ''}
              onChange={(e) => handleDimensionChange('roomWidth', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="roomHeight">Wall Height (ft)</label>
            <input
              type="number"
              id="roomHeight"
              min="7"
              step="0.5"
              value={formData.roomHeight || ''}
              onChange={(e) => handleDimensionChange('roomHeight', e.target.value)}
            />
          </div>
        </div>

        {calculatedArea && (
          <div className="form-group">
            <small style={{ color: '#28a745', fontWeight: '500' }}>
              Calculated wall area: {calculatedArea.toFixed(0)} sq ft
            </small>
          </div>
        )}

        {/* Damage Level */}
        <div className="form-group">
          <label htmlFor="wallCondition">Damage Level *</label>
          <select
            id="wallCondition"
            value={formData.wallCondition || ''}
            onChange={(e) => handleConditionChange(e.target.value)}
            required
          >
            <option value="">Select damage level</option>
            <option value="minor">Minor - A few small holes, light scratches, minor dings</option>
            <option value="moderate">Moderate - Multiple holes, some cracks, noticeable dents</option>
            <option value="extensive">Extensive - Many holes, large cracks, significant damage</option>
          </select>
        </div>

        {/* Water damage checkbox - only shown for moderate/extensive */}
        {(formData.wallCondition === 'moderate' || formData.wallCondition === 'extensive') && (
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.hasWaterDamage || false}
                onChange={(e) => updateFormData('hasWaterDamage', e.target.checked)}
              />
              <span>Also includes water damage or stains</span>
            </label>
          </div>
        )}

        {/* Additional Services */}
        <h4>Additional Services</h4>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.includePainting || false}
              onChange={(e) => updateFormData('includePainting', e.target.checked)}
            />
            <span>Include painting after repair (priming included automatically)</span>
          </label>
        </div>
      <ImageUpload
        images={images}
        imagePreviews={imagePreviews}
        onImagesChange={handleImagesChange}
        maxImages={5}
        required={false}
      />
      </div>
    );
  };

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
      case 'driveway-sealing':
        return renderDrivewaySealingForm();
      case 'exterior-railings':
        return renderExteriorRailingsForm();
      case 'stucco-ceiling-removal':
        return renderPopcornCeilingRemovalForm();
      case 'bathroom-vanity-cabinet':
        return renderBathroomVanityCabinetForm();
      case 'stairway-painting':
        return renderStairwayForm();
      case 'hallway-painting':
        return renderHallwayForm();
      case 'drywall-repair':
        return renderDrywallRepairForm();
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

