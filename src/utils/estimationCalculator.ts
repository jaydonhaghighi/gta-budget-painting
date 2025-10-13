// Estimation Calculator based on W1DP Playbook

// Constants from playbook
export const RATES = {
  LABOR_RATE: 50, // $ per hour
  PAINT_RATE: 50, // $ per gallon
  SUPPLIES_RATE: 2, // $ per man hour
  PAINT_COVERAGE: 400, // sq ft per gallon
  TWO_COAT_MULTIPLIER: 1.6, // For calculating 2-coat paint needs
  SETUP_CLEANUP_DIVISOR: 6, // Total hours / 6 = setup/cleanup hours
  PREP_FEE_PERCENTAGE: 0.15, // 15% of labor cost for prep work
  TRAVEL_FEE: 50, // Flat fee for travel
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
  prepFee: number;
  travelFee: number;
  subtotal: number;
  totalCost: number;
  breakdown: string[];
}

// Calculate ceiling estimate
export function calculateCeiling(sqFt: number, includeFeesAndSetup: boolean = true): EstimateBreakdown {
  const laborHours = sqFt / PRODUCTION_RATES.CEILING;
  const roundedLaborHours = Math.ceil(laborHours);
  
  const setupCleanupHours = includeFeesAndSetup ? Math.ceil(roundedLaborHours / RATES.SETUP_CLEANUP_DIVISOR) : 0;
  const totalHours = roundedLaborHours + setupCleanupHours;
  
  const paintGallons = Math.ceil(sqFt / RATES.PAINT_COVERAGE);
  
  const laborCost = totalHours * RATES.LABOR_RATE;
  const paintCost = paintGallons * RATES.PAINT_RATE;
  const suppliesCost = totalHours * RATES.SUPPLIES_RATE;
  const prepFee = includeFeesAndSetup ? Math.ceil(laborCost * RATES.PREP_FEE_PERCENTAGE) : 0;
  const travelFee = includeFeesAndSetup ? RATES.TRAVEL_FEE : 0;
  
  const subtotal = laborCost + paintCost + suppliesCost;
  const otherFees = prepFee + travelFee;
  const totalCost = subtotal + otherFees;
  
  return {
    laborHours: roundedLaborHours,
    setupCleanupHours,
    totalHours,
    laborCost,
    paintGallons,
    paintCost,
    suppliesCost,
    prepFee,
    travelFee,
    subtotal,
    totalCost,
    breakdown: [
      `Ceiling area: ${sqFt} sq ft`,
      `Labor hours: ${roundedLaborHours}`,
      `Setup/cleanup: ${setupCleanupHours} hours`,
      `Total hours: ${totalHours}`,
      `Labor: ${totalHours} hours × $${RATES.LABOR_RATE} = $${laborCost}`,
      `Paint: ${paintGallons} gallons × $${RATES.PAINT_RATE} = $${paintCost}`,
      `Supplies: ${totalHours} hours × $${RATES.SUPPLIES_RATE} = $${suppliesCost}`,
      ...(includeFeesAndSetup ? [
        `Other fees (prep & travel): $${otherFees}`
      ] : [])
    ]
  };
}

// Calculate walls estimate (2 coats)
export function calculateWalls(sqFt: number, coats: number = 2, includeFeesAndSetup: boolean = true): EstimateBreakdown {
  const productionRate = coats === 2 ? PRODUCTION_RATES.WALLS_TWO_COAT : PRODUCTION_RATES.WALLS_ONE_COAT;
  const laborHours = sqFt / productionRate;
  const roundedLaborHours = Math.ceil(laborHours);
  
  const setupCleanupHours = includeFeesAndSetup ? Math.ceil(roundedLaborHours / RATES.SETUP_CLEANUP_DIVISOR) : 0;
  const totalHours = roundedLaborHours + setupCleanupHours;
  
  const paintMultiplier = coats === 2 ? RATES.TWO_COAT_MULTIPLIER : 1;
  const paintGallons = Math.ceil((sqFt / RATES.PAINT_COVERAGE) * paintMultiplier);
  
  const laborCost = totalHours * RATES.LABOR_RATE;
  const paintCost = paintGallons * RATES.PAINT_RATE;
  const suppliesCost = totalHours * RATES.SUPPLIES_RATE;
  const prepFee = includeFeesAndSetup ? Math.ceil(laborCost * RATES.PREP_FEE_PERCENTAGE) : 0;
  const travelFee = includeFeesAndSetup ? RATES.TRAVEL_FEE : 0;
  
  const subtotal = laborCost + paintCost + suppliesCost;
  const otherFees = prepFee + travelFee;
  const totalCost = subtotal + otherFees;
  
  return {
    laborHours: roundedLaborHours,
    setupCleanupHours,
    totalHours,
    laborCost,
    paintGallons,
    paintCost,
    suppliesCost,
    prepFee,
    travelFee,
    subtotal,
    totalCost,
    breakdown: [
      `Wall area: ${sqFt} sq ft (${coats} coat${coats > 1 ? 's' : ''})`,
      `Labor hours: ${roundedLaborHours}`,
      `Setup/cleanup: ${setupCleanupHours} hours`,
      `Total hours: ${totalHours}`,
      `Labor: ${totalHours} hours × $${RATES.LABOR_RATE} = $${laborCost}`,
      `Paint: ${paintGallons} gallons × $${RATES.PAINT_RATE} = $${paintCost}`,
      `Supplies: ${totalHours} hours × $${RATES.SUPPLIES_RATE} = $${suppliesCost}`,
      ...(includeFeesAndSetup ? [
        `Other fees (prep & travel): $${otherFees}`
      ] : [])
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
  coats: number = 2,
  includeFeesAndSetup: boolean = true
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
  const roundedLaborHours = Math.ceil(laborHours);
  
  const setupCleanupHours = includeFeesAndSetup ? Math.ceil(roundedLaborHours / RATES.SETUP_CLEANUP_DIVISOR) : 0;
  const totalHours = roundedLaborHours + setupCleanupHours;
  
  const paintGallons = Math.ceil(linearFeet / spreadRate);
  
  const laborCost = totalHours * RATES.LABOR_RATE;
  const paintCost = paintGallons * RATES.PAINT_RATE;
  const suppliesCost = totalHours * RATES.SUPPLIES_RATE;
  const prepFee = includeFeesAndSetup ? Math.ceil(laborCost * RATES.PREP_FEE_PERCENTAGE) : 0;
  const travelFee = includeFeesAndSetup ? RATES.TRAVEL_FEE : 0;
  
  const subtotal = laborCost + paintCost + suppliesCost;
  const otherFees = prepFee + travelFee;
  const totalCost = subtotal + otherFees;
  
  return {
    laborHours: roundedLaborHours,
    setupCleanupHours,
    totalHours,
    laborCost,
    paintGallons,
    paintCost,
    suppliesCost,
    prepFee,
    travelFee,
    subtotal,
    totalCost,
    breakdown: [
      `Baseboards: ${linearFeet} linear ft (${profile} profile, ${coats} coat${coats > 1 ? 's' : ''})`,
      `Labor hours: ${roundedLaborHours}`,
      `Setup/cleanup: ${setupCleanupHours} hours`,
      `Total hours: ${totalHours}`,
      `Labor: ${totalHours} hours × $${RATES.LABOR_RATE} = $${laborCost}`,
      `Paint: ${paintGallons} gallons × $${RATES.PAINT_RATE} = $${paintCost}`,
      `Supplies: ${totalHours} hours × $${RATES.SUPPLIES_RATE} = $${suppliesCost}`,
      ...(includeFeesAndSetup ? [
        `Other fees (prep & travel): $${otherFees}`
      ] : [])
    ]
  };
}

// Calculate room estimate (walls + ceiling + trim optional)
// This follows the playbook methodology: calculate all raw hours first, then add setup/cleanup once
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
  
  let rawLaborHours = 0;
  let ceilingPaintGallons = 0;
  let wallPaintGallons = 0;
  let trimPaintGallons = 0;
  const breakdown: string[] = [];
  
  // Calculate walls
  const wallSqFt = 2 * (length * height + width * height);
  const wallLaborHours = wallSqFt / PRODUCTION_RATES.WALLS_TWO_COAT;
  rawLaborHours += wallLaborHours;
  wallPaintGallons = Math.ceil((wallSqFt / RATES.PAINT_COVERAGE) * RATES.TWO_COAT_MULTIPLIER);
  breakdown.push(`Walls: ${wallSqFt} sq ft / ${PRODUCTION_RATES.WALLS_TWO_COAT} PR = ${wallLaborHours.toFixed(2)} hours`);
  
  // Calculate ceiling if included
  if (includeCeiling) {
    const ceilingSqFt = length * width;
    const ceilingLaborHours = ceilingSqFt / PRODUCTION_RATES.CEILING;
    rawLaborHours += ceilingLaborHours;
    ceilingPaintGallons = Math.ceil(ceilingSqFt / RATES.PAINT_COVERAGE);
    breakdown.push(`Ceiling: ${ceilingSqFt} sq ft / ${PRODUCTION_RATES.CEILING} PR = ${ceilingLaborHours.toFixed(2)} hours`);
  }
  
  // Calculate baseboards if included
  if (includeBaseboards) {
    const perimeter = 2 * (length + width);
    const profile = baseboardProfile || 'low';
    const productionRate = profile === 'low' ? PRODUCTION_RATES.BASEBOARD_LOW_TWO_COAT : PRODUCTION_RATES.BASEBOARD_HIGH_TWO_COAT;
    const spreadRate = profile === 'low' ? SPREAD_RATES.BASEBOARD_LOW_TWO_COAT : SPREAD_RATES.BASEBOARD_HIGH_TWO_COAT;
    
    const baseboardLaborHours = perimeter / productionRate;
    rawLaborHours += baseboardLaborHours;
    const baseboardPaint = perimeter / spreadRate;
    trimPaintGallons += baseboardPaint;
    breakdown.push(`Baseboards: ${perimeter} ft / ${productionRate} PR = ${baseboardLaborHours.toFixed(2)} hours`);
  }
  
  // Add doors (chunk items)
  if (doors > 0) {
    const doorLaborHours = doors * PRODUCTION_RATES.DOOR_FLAT;
    rawLaborHours += doorLaborHours;
    const doorPaint = doors / SPREAD_RATES.DOORS_PER_GALLON;
    trimPaintGallons += doorPaint;
    breakdown.push(`Doors: ${doors} × ${PRODUCTION_RATES.DOOR_FLAT} hrs = ${doorLaborHours.toFixed(2)} hours`);
  }
  
  // Add windows (chunk items)
  if (windows > 0) {
    const windowLaborHours = windows * PRODUCTION_RATES.WINDOW_SIMPLE;
    rawLaborHours += windowLaborHours;
    // Windows add minimal paint, grouped with trim
    breakdown.push(`Windows: ${windows} × ${PRODUCTION_RATES.WINDOW_SIMPLE} hrs = ${windowLaborHours.toFixed(2)} hours`);
  }
  
  // Round up raw labor hours FIRST
  const roundedLaborHours = Math.ceil(rawLaborHours);
  
  // Calculate setup/cleanup ONCE based on rounded hours
  const setupCleanupHours = Math.ceil(roundedLaborHours / RATES.SETUP_CLEANUP_DIVISOR);
  const totalHours = roundedLaborHours + setupCleanupHours;
  
  // Round up paint gallons
  const ceilingGallons = Math.ceil(ceilingPaintGallons);
  const wallGallons = Math.ceil(wallPaintGallons);
  const trimGallons = Math.ceil(trimPaintGallons);
  const totalPaintGallons = ceilingGallons + wallGallons + trimGallons;
  
  // Calculate costs
  const laborCost = totalHours * RATES.LABOR_RATE;
  const paintCost = totalPaintGallons * RATES.PAINT_RATE;
  const suppliesCost = totalHours * RATES.SUPPLIES_RATE;
  const prepFee = Math.ceil(laborCost * RATES.PREP_FEE_PERCENTAGE);
  const travelFee = RATES.TRAVEL_FEE;
  
  const subtotal = laborCost + paintCost + suppliesCost;
  const otherFees = prepFee + travelFee;
  const totalCost = subtotal + otherFees;
  
  // Add summary to breakdown
  breakdown.push('');
  breakdown.push(`Total raw labor: ${rawLaborHours.toFixed(2)} → ${roundedLaborHours} hours`);
  breakdown.push(`Setup/cleanup: ${roundedLaborHours} / ${RATES.SETUP_CLEANUP_DIVISOR} = ${setupCleanupHours} hours`);
  breakdown.push(`Total hours: ${totalHours}`);
  breakdown.push('');
  if (ceilingGallons > 0) breakdown.push(`Ceiling paint: ${ceilingGallons} gallons`);
  if (wallGallons > 0) breakdown.push(`Wall paint: ${wallGallons} gallons`);
  if (trimGallons > 0) breakdown.push(`Trim paint: ${trimGallons} gallons`);
  breakdown.push(`Total paint: ${totalPaintGallons} gallons × $${RATES.PAINT_RATE} = $${paintCost}`);
  breakdown.push('');
  breakdown.push(`Labor: ${totalHours} hours × $${RATES.LABOR_RATE} = $${laborCost}`);
  breakdown.push(`Supplies: ${totalHours} hours × $${RATES.SUPPLIES_RATE} = $${suppliesCost}`);
  breakdown.push(`Other fees (prep & travel): $${otherFees}`);
  
  return {
    laborHours: roundedLaborHours,
    setupCleanupHours,
    totalHours,
    laborCost,
    paintGallons: totalPaintGallons,
    paintCost,
    suppliesCost,
    prepFee,
    travelFee,
    subtotal,
    totalCost,
    breakdown
  };
}

// Calculate staircase (with difficulty multiplier and optional railings)
export function calculateStaircase(params: {
  wallArea: number; // sq ft of stairwell walls
  ceilingArea: number; // sq ft of stairwell ceiling
  includeRailings?: boolean;
  linearFeetRailings?: number;
}): EstimateBreakdown {
  const { wallArea, ceilingArea, includeRailings, linearFeetRailings = 0 } = params;
  
  let rawLaborHours = 0;
  let wallPaintGallons = 0;
  let ceilingPaintGallons = 0;
  let trimPaintGallons = 0;
  const breakdown: string[] = [];
  
  // Railings (2 coats, difficult access) - OPTIONAL
  if (includeRailings && linearFeetRailings > 0) {
    const railingProductionRate = PRODUCTION_RATES.BASEBOARD_HIGH_TWO_COAT; // Similar to high baseboards
    const railingSpreadRate = SPREAD_RATES.BASEBOARD_HIGH_TWO_COAT;
    const railingLaborHours = linearFeetRailings / railingProductionRate;
    
    // Add 50% difficulty multiplier for staircase access
    const adjustedRailingHours = railingLaborHours * 1.5;
    rawLaborHours += adjustedRailingHours;
    
    const railingPaint = linearFeetRailings / railingSpreadRate;
    trimPaintGallons += railingPaint;
    breakdown.push(`Railings: ${linearFeetRailings} ft / ${railingProductionRate} PR × 1.5 (difficulty) = ${adjustedRailingHours.toFixed(2)} hours`);
  }
  
  // Walls (2 coats, difficult access)
  if (wallArea > 0) {
    const wallLaborHours = wallArea / PRODUCTION_RATES.WALLS_TWO_COAT;
    // Add 30% difficulty multiplier for stairwell walls
    const adjustedWallHours = wallLaborHours * 1.3;
    rawLaborHours += adjustedWallHours;
    
    wallPaintGallons = (wallArea / RATES.PAINT_COVERAGE) * RATES.TWO_COAT_MULTIPLIER;
    breakdown.push(`Walls: ${wallArea} sq ft / ${PRODUCTION_RATES.WALLS_TWO_COAT} PR × 1.3 (difficulty) = ${adjustedWallHours.toFixed(2)} hours`);
  }
  
  // Ceiling (difficult overhead work)
  if (ceilingArea > 0) {
    const ceilingLaborHours = ceilingArea / PRODUCTION_RATES.CEILING;
    // Add 40% difficulty multiplier for stairwell ceiling
    const adjustedCeilingHours = ceilingLaborHours * 1.4;
    rawLaborHours += adjustedCeilingHours;
    
    ceilingPaintGallons = ceilingArea / RATES.PAINT_COVERAGE;
    breakdown.push(`Ceiling: ${ceilingArea} sq ft / ${PRODUCTION_RATES.CEILING} PR × 1.4 (difficulty) = ${adjustedCeilingHours.toFixed(2)} hours`);
  }
  
  // Round up raw labor hours
  const roundedLaborHours = Math.ceil(rawLaborHours);
  
  // Calculate setup/cleanup once
  const setupCleanupHours = Math.ceil(roundedLaborHours / RATES.SETUP_CLEANUP_DIVISOR);
  const totalHours = roundedLaborHours + setupCleanupHours;
  
  // Round up paint gallons
  const ceilingGallons = Math.ceil(ceilingPaintGallons);
  const wallGallons = Math.ceil(wallPaintGallons);
  const trimGallons = Math.ceil(trimPaintGallons);
  const totalPaintGallons = ceilingGallons + wallGallons + trimGallons;
  
  // Calculate costs
  const laborCost = totalHours * RATES.LABOR_RATE;
  const paintCost = totalPaintGallons * RATES.PAINT_RATE;
  const suppliesCost = totalHours * RATES.SUPPLIES_RATE;
  const prepFee = Math.ceil(laborCost * RATES.PREP_FEE_PERCENTAGE);
  const travelFee = RATES.TRAVEL_FEE;
  
  const subtotal = laborCost + paintCost + suppliesCost;
  const otherFees = prepFee + travelFee;
  const totalCost = subtotal + otherFees;
  
  // Add summary to breakdown
  breakdown.push('');
  breakdown.push(`Total raw labor: ${rawLaborHours.toFixed(2)} → ${roundedLaborHours} hours`);
  breakdown.push(`Setup/cleanup: ${roundedLaborHours} / ${RATES.SETUP_CLEANUP_DIVISOR} = ${setupCleanupHours} hours`);
  breakdown.push(`Total hours: ${totalHours}`);
  breakdown.push('');
  if (ceilingGallons > 0) breakdown.push(`Ceiling paint: ${ceilingGallons} gallons`);
  if (wallGallons > 0) breakdown.push(`Wall paint: ${wallGallons} gallons`);
  if (trimGallons > 0) breakdown.push(`Trim paint: ${trimGallons} gallons`);
  breakdown.push(`Total paint: ${totalPaintGallons} gallons × $${RATES.PAINT_RATE} = $${paintCost}`);
  breakdown.push('');
  breakdown.push(`Labor: ${totalHours} hours × $${RATES.LABOR_RATE} = $${laborCost}`);
  breakdown.push(`Supplies: ${totalHours} hours × $${RATES.SUPPLIES_RATE} = $${suppliesCost}`);
  breakdown.push(`Other fees (prep & travel): $${otherFees}`);
  
  return {
    laborHours: roundedLaborHours,
    setupCleanupHours,
    totalHours,
    laborCost,
    paintGallons: totalPaintGallons,
    paintCost,
    suppliesCost,
    prepFee,
    travelFee,
    subtotal,
    totalCost,
    breakdown
  };
}

// Calculate multiple bedrooms together (with single setup/cleanup)
export function calculateMultipleBedrooms(rooms: Array<{
  name?: string;
  length: number;
  width: number;
  height: number;
  includeCeiling?: boolean;
  includeBaseboards?: boolean;
  baseboardProfile?: 'low' | 'high';
  doors?: number;
  windows?: number;
}>): EstimateBreakdown {
  let totalRawLaborHours = 0;
  let totalCeilingPaint = 0;
  let totalWallPaint = 0;
  let totalTrimPaint = 0;
  const breakdown: string[] = [];

  breakdown.push('=== MULTIPLE BEDROOMS ===');
  breakdown.push('');

  // Calculate each room individually (without fees/setup)
  rooms.forEach((room, index) => {
    const { length, width, height, includeCeiling = true, includeBaseboards = true, baseboardProfile = 'low', doors = 1, windows = 1 } = room;
    const roomName = room.name || `Bedroom ${index + 1}`;
    
    breakdown.push(`--- ${roomName} ---`);
    
    let roomLaborHours = 0;
    let ceilingPaint = 0;
    let wallPaint = 0;
    let trimPaint = 0;

    // Walls (2 coats)
    const wallSqFt = 2 * (length * height + width * height);
    const wallLaborHours = wallSqFt / PRODUCTION_RATES.WALLS_TWO_COAT;
    roomLaborHours += wallLaborHours;
    wallPaint += (wallSqFt / RATES.PAINT_COVERAGE) * RATES.TWO_COAT_MULTIPLIER;
    breakdown.push(`  Walls: ${wallSqFt} sq ft = ${wallLaborHours.toFixed(2)} hrs`);

    // Ceiling
    if (includeCeiling) {
      const ceilingSqFt = length * width;
      const ceilingLaborHours = ceilingSqFt / PRODUCTION_RATES.CEILING;
      roomLaborHours += ceilingLaborHours;
      ceilingPaint += ceilingSqFt / RATES.PAINT_COVERAGE;
      breakdown.push(`  Ceiling: ${ceilingSqFt} sq ft = ${ceilingLaborHours.toFixed(2)} hrs`);
    }

    // Baseboards
    if (includeBaseboards) {
      const perimeter = 2 * (length + width);
      const productionRate = baseboardProfile === 'low' ? PRODUCTION_RATES.BASEBOARD_LOW_TWO_COAT : PRODUCTION_RATES.BASEBOARD_HIGH_TWO_COAT;
      const spreadRate = baseboardProfile === 'low' ? SPREAD_RATES.BASEBOARD_LOW_TWO_COAT : SPREAD_RATES.BASEBOARD_HIGH_TWO_COAT;
      
      const baseboardLaborHours = perimeter / productionRate;
      roomLaborHours += baseboardLaborHours;
      trimPaint += perimeter / spreadRate;
      breakdown.push(`  Baseboards: ${perimeter} ft = ${baseboardLaborHours.toFixed(2)} hrs`);
    }

    // Doors
    if (doors > 0) {
      const doorLaborHours = doors * PRODUCTION_RATES.DOOR_FLAT;
      roomLaborHours += doorLaborHours;
      trimPaint += doors / SPREAD_RATES.DOORS_PER_GALLON;
      breakdown.push(`  Doors: ${doors} × ${PRODUCTION_RATES.DOOR_FLAT} hrs = ${doorLaborHours.toFixed(2)} hrs`);
    }

    // Windows
    if (windows > 0) {
      const windowLaborHours = windows * PRODUCTION_RATES.WINDOW_SIMPLE;
      roomLaborHours += windowLaborHours;
      breakdown.push(`  Windows: ${windows} × ${PRODUCTION_RATES.WINDOW_SIMPLE} hrs = ${windowLaborHours.toFixed(2)} hrs`);
    }

    breakdown.push(`  Room subtotal: ${roomLaborHours.toFixed(2)} hrs`);
    breakdown.push('');

    totalRawLaborHours += roomLaborHours;
    totalCeilingPaint += ceilingPaint;
    totalWallPaint += wallPaint;
    totalTrimPaint += trimPaint;
  });

  // Round up total raw labor hours
  const roundedLaborHours = Math.ceil(totalRawLaborHours);

  // Calculate setup/cleanup ONCE for all rooms
  const setupCleanupHours = Math.ceil(roundedLaborHours / RATES.SETUP_CLEANUP_DIVISOR);
  const totalHours = roundedLaborHours + setupCleanupHours;

  // Round up paint gallons
  const ceilingGallons = Math.ceil(totalCeilingPaint);
  const wallGallons = Math.ceil(totalWallPaint);
  const trimGallons = Math.ceil(totalTrimPaint);
  const totalPaintGallons = ceilingGallons + wallGallons + trimGallons;

  // Calculate costs
  const laborCost = totalHours * RATES.LABOR_RATE;
  const paintCost = totalPaintGallons * RATES.PAINT_RATE;
  const suppliesCost = totalHours * RATES.SUPPLIES_RATE;
  const prepFee = Math.ceil(laborCost * RATES.PREP_FEE_PERCENTAGE);
  const travelFee = RATES.TRAVEL_FEE;

  const subtotal = laborCost + paintCost + suppliesCost;
  const otherFees = prepFee + travelFee;
  const totalCost = subtotal + otherFees;

  // Add summary
  breakdown.push('=== TOTAL SUMMARY ===');
  breakdown.push(`Total bedrooms: ${rooms.length}`);
  breakdown.push(`Total raw labor: ${totalRawLaborHours.toFixed(2)} → ${roundedLaborHours} hours`);
  breakdown.push(`Setup/cleanup: ${roundedLaborHours} / ${RATES.SETUP_CLEANUP_DIVISOR} = ${setupCleanupHours} hours`);
  breakdown.push(`Total hours: ${totalHours}`);
  breakdown.push('');
  if (ceilingGallons > 0) breakdown.push(`Ceiling paint: ${ceilingGallons} gallons`);
  if (wallGallons > 0) breakdown.push(`Wall paint: ${wallGallons} gallons`);
  if (trimGallons > 0) breakdown.push(`Trim paint: ${trimGallons} gallons`);
  breakdown.push(`Total paint: ${totalPaintGallons} gallons × $${RATES.PAINT_RATE} = $${paintCost}`);
  breakdown.push('');
  breakdown.push(`Labor: ${totalHours} hours × $${RATES.LABOR_RATE} = $${laborCost}`);
  breakdown.push(`Supplies: ${totalHours} hours × $${RATES.SUPPLIES_RATE} = $${suppliesCost}`);
  breakdown.push(`Other fees (prep & travel): $${otherFees}`);

  return {
    laborHours: roundedLaborHours,
    setupCleanupHours,
    totalHours,
    laborCost,
    paintGallons: totalPaintGallons,
    paintCost,
    suppliesCost,
    prepFee,
    travelFee,
    subtotal,
    totalCost,
    breakdown
  };
}

// Calculate fence painting (any size)
export function calculateFence(params: {
  linearFeet: number;
  height: number;
  sides: 1 | 2; // Paint one side or both sides
  includeStaining?: boolean;
}): EstimateBreakdown {
  const { linearFeet, height, sides, includeStaining } = params;
  
  // Calculate fence area
  const areaSqFt = linearFeet * height * sides;
  
  // Exterior fence has slower production rate than interior walls (prep + weather considerations)
  const productionRate = includeStaining ? 80 : 90; // sq ft per hour (staining is faster than painting)
  const rawLaborHours = areaSqFt / productionRate;
  const roundedLaborHours = Math.ceil(rawLaborHours);
  
  // Calculate setup/cleanup
  const setupCleanupHours = Math.ceil(roundedLaborHours / RATES.SETUP_CLEANUP_DIVISOR);
  const totalHours = roundedLaborHours + setupCleanupHours;
  
  // Paint/stain calculation (one coat for stain, two coats for paint)
  const paintMultiplier = includeStaining ? 1 : RATES.TWO_COAT_MULTIPLIER;
  const paintGallons = Math.ceil((areaSqFt / RATES.PAINT_COVERAGE) * paintMultiplier);
  
  // Calculate costs
  const laborCost = totalHours * RATES.LABOR_RATE;
  const paintCost = paintGallons * RATES.PAINT_RATE;
  const suppliesCost = totalHours * RATES.SUPPLIES_RATE;
  const prepFee = Math.ceil(laborCost * RATES.PREP_FEE_PERCENTAGE);
  const travelFee = RATES.TRAVEL_FEE;
  
  const subtotal = laborCost + paintCost + suppliesCost;
  const otherFees = prepFee + travelFee;
  const totalCost = subtotal + otherFees;
  
  const breakdown: string[] = [
    `Fence: ${linearFeet} ft × ${height} ft ${sides === 2 ? '(both sides)' : '(one side)'}`,
    `Total area: ${areaSqFt} sq ft`,
    `Labor: ${areaSqFt} sq ft / ${productionRate} PR = ${rawLaborHours.toFixed(2)} → ${roundedLaborHours} hours`,
    `Setup/cleanup: ${setupCleanupHours} hours`,
    `Total hours: ${totalHours}`,
    '',
    includeStaining ? `Stain: ${paintGallons} gallons × $${RATES.PAINT_RATE} = $${paintCost}` : `Paint: ${paintGallons} gallons × $${RATES.PAINT_RATE} = $${paintCost}`,
    `Labor: ${totalHours} hours × $${RATES.LABOR_RATE} = $${laborCost}`,
    `Supplies: ${totalHours} hours × $${RATES.SUPPLIES_RATE} = $${suppliesCost}`,
    `Other fees (prep & travel): $${otherFees}`
  ];
  
  return {
    laborHours: roundedLaborHours,
    setupCleanupHours,
    totalHours,
    laborCost,
    paintGallons,
    paintCost,
    suppliesCost,
    prepFee,
    travelFee,
    subtotal,
    totalCost,
    breakdown
  };
}

// Calculate kitchen cabinet painting
export function calculateKitchenCabinets(params: {
  cabinetSections: Array<{
    doors: number;
    frames: number;
    drawers: number;
    height: number;
    width: number;
    includeHardware?: boolean;
  }>;
}): EstimateBreakdown {
  const { cabinetSections } = params;
  
  // Cabinet painting is more complex than walls - detailed prep, multiple coats, hardware removal/replacement
  const CABINET_PRODUCTION_RATES = {
    DOORS_PER_HOUR: 2, // 2 doors per hour (prep + prime + 2 coats + hardware)
    FRAMES_PER_HOUR: 3, // 3 frames per hour (prep + prime + 2 coats)
    DRAWERS_PER_HOUR: 4, // 4 drawer fronts per hour
    HARDWARE_PER_HOUR: 6, // 6 pieces of hardware per hour (removal + replacement)
  };
  
  // Calculate totals across all sections
  let totalDoors = 0;
  let totalFrames = 0;
  let totalDrawers = 0;
  let totalHardwarePieces = 0;
  let totalArea = 0;
  
  cabinetSections.forEach(section => {
    totalDoors += section.doors;
    totalFrames += section.frames;
    totalDrawers += section.drawers;
    
    // Calculate area for this section
    const sectionArea = (section.doors + section.frames + section.drawers) * (section.height * section.width / 144);
    totalArea += sectionArea;
    
    // Count hardware pieces if included
    if (section.includeHardware) {
      totalHardwarePieces += section.doors + section.drawers;
    }
  });
  
  // Calculate labor hours for each component
  const doorHours = Math.ceil(totalDoors / CABINET_PRODUCTION_RATES.DOORS_PER_HOUR);
  const frameHours = Math.ceil(totalFrames / CABINET_PRODUCTION_RATES.FRAMES_PER_HOUR);
  const drawerHours = Math.ceil(totalDrawers / CABINET_PRODUCTION_RATES.DRAWERS_PER_HOUR);
  const hardwareHours = Math.ceil(totalHardwarePieces / CABINET_PRODUCTION_RATES.HARDWARE_PER_HOUR);
  
  const rawLaborHours = doorHours + frameHours + drawerHours + hardwareHours;
  const roundedLaborHours = Math.ceil(rawLaborHours);
  
  // Cabinet painting requires more setup/cleanup due to complexity
  const setupCleanupHours = Math.ceil(roundedLaborHours / 4); // More setup time for cabinets
  const totalHours = roundedLaborHours + setupCleanupHours;
  
  // Cabinet painting requires more paint (multiple coats, better coverage)
  const paintMultiplier = 2.5; // More paint needed for cabinets
  const paintGallons = Math.ceil((totalArea / RATES.PAINT_COVERAGE) * paintMultiplier);
  
  // Calculate costs
  const laborCost = totalHours * RATES.LABOR_RATE;
  const paintCost = paintGallons * RATES.PAINT_RATE;
  const suppliesCost = totalHours * RATES.SUPPLIES_RATE;
  const prepFee = Math.ceil(laborCost * RATES.PREP_FEE_PERCENTAGE);
  const travelFee = RATES.TRAVEL_FEE;
  
  const subtotal = laborCost + paintCost + suppliesCost;
  const otherFees = prepFee + travelFee;
  const totalCost = subtotal + otherFees;
  
  const breakdown: string[] = [
    `Cabinet sections: ${cabinetSections.length} sections`,
    `Total doors: ${totalDoors} doors`,
    `Total frames: ${totalFrames} frames`,
    `Total drawers: ${totalDrawers} drawers`,
    `Total area: ${totalArea.toFixed(1)} sq ft`,
    '',
    `Door labor: ${totalDoors} doors / ${CABINET_PRODUCTION_RATES.DOORS_PER_HOUR} = ${doorHours} hours`,
    `Frame labor: ${totalFrames} frames / ${CABINET_PRODUCTION_RATES.FRAMES_PER_HOUR} = ${frameHours} hours`,
    `Drawer labor: ${totalDrawers} drawers / ${CABINET_PRODUCTION_RATES.DRAWERS_PER_HOUR} = ${drawerHours} hours`,
    totalHardwarePieces > 0 ? `Hardware labor: ${totalHardwarePieces} pieces / ${CABINET_PRODUCTION_RATES.HARDWARE_PER_HOUR} = ${hardwareHours} hours` : 'Hardware: Not included',
    `Setup/cleanup: ${setupCleanupHours} hours`,
    `Total hours: ${totalHours}`,
    '',
    `Paint: ${paintGallons} gallons × $${RATES.PAINT_RATE} = $${paintCost}`,
    `Labor: ${totalHours} hours × $${RATES.LABOR_RATE} = $${laborCost}`,
    `Supplies: ${totalHours} hours × $${RATES.SUPPLIES_RATE} = $${suppliesCost}`,
    `Other fees (prep & travel): $${otherFees}`
  ];
  
  return {
    laborHours: roundedLaborHours,
    setupCleanupHours,
    totalHours,
    laborCost,
    paintGallons,
    paintCost,
    suppliesCost,
    prepFee,
    travelFee,
    subtotal,
    totalCost,
    breakdown
  };
}

// Format currency
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

