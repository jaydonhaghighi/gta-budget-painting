// Estimation Calculator based on W1DP Playbook

// Constants from playbook
export const RATES = {
  LABOR_RATE: 50, // $ per hour
  PAINT_RATE: 50, // $ per gallon
  SUPPLIES_RATE: 2, // $ per man hour
  PAINT_COVERAGE: 400, // sq ft per gallon
  TWO_COAT_MULTIPLIER: 1.6, // For calculating 2-coat paint needs
  SETUP_CLEANUP_DIVISOR: 6, // Total hours / 6 = setup/cleanup hours
};

// Production Rates (time to complete)
export const PRODUCTION_RATES = {
  // Interior (per hour)
  CEILING: 150, // sq ft per hour
  WALLS_TWO_COAT: 110, // sq ft per hour (2 coats)
  WALLS_ONE_COAT: 180, // sq ft per hour (1 coat)
  
  // Doors (hours per door, including trim and jam, 2 coats)
  DOOR_FLAT: 0.5,
  DOOR_PANEL: 0.75,
  DOOR_PANEL_WINDOW: 1.0,
  DOOR_FRENCH: 1.0,
  DOOR_FRENCH_PANELS: 1.5,
  
  // Windows (hours)
  WINDOW_SIMPLE: 0.5,
  WINDOW_COMPLEX: 1.0,
  
  // Baseboards (linear feet per hour)
  BASEBOARD_LOW_ONE_COAT: 60, // <4"
  BASEBOARD_LOW_TWO_COAT: 40,
  BASEBOARD_HIGH_ONE_COAT: 50, // >5"
  BASEBOARD_HIGH_TWO_COAT: 30,
  
  // Trim (linear feet per hour)
  TRIM_ONE_COAT: 50,
  TRIM_TWO_COAT: 30,
};

// Spread Rates (coverage)
export const SPREAD_RATES = {
  DOORS_PER_GALLON: 9,
  BASEBOARD_LOW_ONE_COAT: 800, // linear feet per gallon
  BASEBOARD_LOW_TWO_COAT: 450,
  BASEBOARD_HIGH_ONE_COAT: 700,
  BASEBOARD_HIGH_TWO_COAT: 400,
};

export interface EstimateBreakdown {
  laborHours: number;
  setupCleanupHours: number;
  totalHours: number;
  laborCost: number;
  paintGallons: number;
  paintCost: number;
  suppliesCost: number;
  totalCost: number;
  breakdown: string[];
}

// Calculate ceiling estimate
export function calculateCeiling(sqFt: number): EstimateBreakdown {
  const laborHours = sqFt / PRODUCTION_RATES.CEILING;
  const setupCleanupHours = laborHours / RATES.SETUP_CLEANUP_DIVISOR;
  const totalHours = Math.ceil(laborHours + setupCleanupHours);
  
  const paintGallons = Math.ceil(sqFt / RATES.PAINT_COVERAGE);
  
  const laborCost = totalHours * RATES.LABOR_RATE;
  const paintCost = paintGallons * RATES.PAINT_RATE;
  const suppliesCost = totalHours * RATES.SUPPLIES_RATE;
  const totalCost = laborCost + paintCost + suppliesCost;
  
  return {
    laborHours,
    setupCleanupHours,
    totalHours,
    laborCost,
    paintGallons,
    paintCost,
    suppliesCost,
    totalCost,
    breakdown: [
      `Ceiling area: ${sqFt} sq ft`,
      `Labor: ${totalHours} hours × $${RATES.LABOR_RATE} = $${laborCost}`,
      `Paint: ${paintGallons} gallons × $${RATES.PAINT_RATE} = $${paintCost}`,
      `Supplies: ${totalHours} hours × $${RATES.SUPPLIES_RATE} = $${suppliesCost}`
    ]
  };
}

// Calculate walls estimate (2 coats)
export function calculateWalls(sqFt: number, coats: number = 2): EstimateBreakdown {
  const productionRate = coats === 2 ? PRODUCTION_RATES.WALLS_TWO_COAT : PRODUCTION_RATES.WALLS_ONE_COAT;
  const laborHours = sqFt / productionRate;
  const setupCleanupHours = laborHours / RATES.SETUP_CLEANUP_DIVISOR;
  const totalHours = Math.ceil(laborHours + setupCleanupHours);
  
  const paintMultiplier = coats === 2 ? RATES.TWO_COAT_MULTIPLIER : 1;
  const paintGallons = Math.ceil((sqFt / RATES.PAINT_COVERAGE) * paintMultiplier);
  
  const laborCost = totalHours * RATES.LABOR_RATE;
  const paintCost = paintGallons * RATES.PAINT_RATE;
  const suppliesCost = totalHours * RATES.SUPPLIES_RATE;
  const totalCost = laborCost + paintCost + suppliesCost;
  
  return {
    laborHours,
    setupCleanupHours,
    totalHours,
    laborCost,
    paintGallons,
    paintCost,
    suppliesCost,
    totalCost,
    breakdown: [
      `Wall area: ${sqFt} sq ft (${coats} coat${coats > 1 ? 's' : ''})`,
      `Labor: ${totalHours} hours × $${RATES.LABOR_RATE} = $${laborCost}`,
      `Paint: ${paintGallons} gallons × $${RATES.PAINT_RATE} = $${paintCost}`,
      `Supplies: ${totalHours} hours × $${RATES.SUPPLIES_RATE} = $${suppliesCost}`
    ]
  };
}

// Calculate accent wall (single wall)
export function calculateAccentWall(length: number, height: number): EstimateBreakdown {
  const sqFt = length * height;
  return calculateWalls(sqFt, 2);
}

// Calculate baseboards
export function calculateBaseboards(
  linearFeet: number,
  profile: 'low' | 'high',
  coats: number = 2
): EstimateBreakdown {
  let productionRate: number;
  let spreadRate: number;
  
  if (profile === 'low') {
    productionRate = coats === 2 ? PRODUCTION_RATES.BASEBOARD_LOW_TWO_COAT : PRODUCTION_RATES.BASEBOARD_LOW_ONE_COAT;
    spreadRate = coats === 2 ? SPREAD_RATES.BASEBOARD_LOW_TWO_COAT : SPREAD_RATES.BASEBOARD_LOW_ONE_COAT;
  } else {
    productionRate = coats === 2 ? PRODUCTION_RATES.BASEBOARD_HIGH_TWO_COAT : PRODUCTION_RATES.BASEBOARD_HIGH_ONE_COAT;
    spreadRate = coats === 2 ? SPREAD_RATES.BASEBOARD_HIGH_TWO_COAT : SPREAD_RATES.BASEBOARD_HIGH_ONE_COAT;
  }
  
  const laborHours = linearFeet / productionRate;
  const setupCleanupHours = laborHours / RATES.SETUP_CLEANUP_DIVISOR;
  const totalHours = Math.ceil(laborHours + setupCleanupHours);
  
  const paintGallons = Math.ceil(linearFeet / spreadRate);
  
  const laborCost = totalHours * RATES.LABOR_RATE;
  const paintCost = paintGallons * RATES.PAINT_RATE;
  const suppliesCost = totalHours * RATES.SUPPLIES_RATE;
  const totalCost = laborCost + paintCost + suppliesCost;
  
  return {
    laborHours,
    setupCleanupHours,
    totalHours,
    laborCost,
    paintGallons,
    paintCost,
    suppliesCost,
    totalCost,
    breakdown: [
      `Baseboards: ${linearFeet} linear ft (${profile} profile, ${coats} coat${coats > 1 ? 's' : ''})`,
      `Labor: ${totalHours} hours × $${RATES.LABOR_RATE} = $${laborCost}`,
      `Paint: ${paintGallons} gallons × $${RATES.PAINT_RATE} = $${paintCost}`,
      `Supplies: ${totalHours} hours × $${RATES.SUPPLIES_RATE} = $${suppliesCost}`
    ]
  };
}

// Calculate room estimate (walls + ceiling + trim optional)
export function calculateRoom(params: {
  length: number;
  width: number;
  height: number;
  includeCeiling?: boolean;
  includeBaseboards?: boolean;
  baseboardProfile?: 'low' | 'high';
  doors?: number;
  windows?: number;
}): EstimateBreakdown {
  const { length, width, height, includeCeiling, includeBaseboards, baseboardProfile, doors = 0, windows = 0 } = params;
  
  // Calculate wall area
  const wallSqFt = 2 * (length * height + width * height);
  const wallEstimate = calculateWalls(wallSqFt, 2);
  
  let totalHours = wallEstimate.totalHours;
  let totalPaintGallons = wallEstimate.paintGallons;
  let breakdown = [...wallEstimate.breakdown];
  
  // Add ceiling if included
  if (includeCeiling) {
    const ceilingSqFt = length * width;
    const ceilingEstimate = calculateCeiling(ceilingSqFt);
    totalHours += ceilingEstimate.totalHours;
    totalPaintGallons += ceilingEstimate.paintGallons;
    breakdown.push(...ceilingEstimate.breakdown);
  }
  
  // Add baseboards if included
  if (includeBaseboards) {
    const perimeter = 2 * (length + width);
    const baseboardEstimate = calculateBaseboards(perimeter, baseboardProfile || 'low', 2);
    totalHours += baseboardEstimate.totalHours;
    totalPaintGallons += baseboardEstimate.paintGallons;
    breakdown.push(...baseboardEstimate.breakdown);
  }
  
  // Add doors
  if (doors > 0) {
    const doorHours = doors * PRODUCTION_RATES.DOOR_PANEL;
    totalHours += Math.ceil(doorHours);
    const doorGallons = Math.ceil(doors / SPREAD_RATES.DOORS_PER_GALLON);
    totalPaintGallons += doorGallons;
    breakdown.push(`Doors: ${doors} × ${PRODUCTION_RATES.DOOR_PANEL} hrs = ${doorHours.toFixed(1)} hours`);
  }
  
  // Add windows
  if (windows > 0) {
    const windowHours = windows * PRODUCTION_RATES.WINDOW_SIMPLE;
    totalHours += Math.ceil(windowHours);
    breakdown.push(`Windows: ${windows} × ${PRODUCTION_RATES.WINDOW_SIMPLE} hrs = ${windowHours.toFixed(1)} hours`);
  }
  
  const laborCost = totalHours * RATES.LABOR_RATE;
  const paintCost = totalPaintGallons * RATES.PAINT_RATE;
  const suppliesCost = totalHours * RATES.SUPPLIES_RATE;
  const totalCost = laborCost + paintCost + suppliesCost;
  
  return {
    laborHours: totalHours - Math.ceil(totalHours / RATES.SETUP_CLEANUP_DIVISOR),
    setupCleanupHours: Math.ceil(totalHours / RATES.SETUP_CLEANUP_DIVISOR),
    totalHours,
    laborCost,
    paintGallons: totalPaintGallons,
    paintCost,
    suppliesCost,
    totalCost,
    breakdown
  };
}

// Format currency
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

