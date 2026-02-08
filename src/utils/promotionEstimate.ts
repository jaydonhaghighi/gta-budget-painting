type PromotionEstimate = {
  laborHours: number;
  setupCleanupHours: number;
  totalHours: number;
  laborCost: number;
  paintGallons: number;
  paintCost: number;
  suppliesCost: number;
  otherFees: number;
  subtotal: number;
  totalCost: number;
};

/**
 * Promo items are treated like flat-rate services in the cart.
 * This helper keeps the displayed breakdown "rounded" and guarantees the parts add up to the total.
 */
export function buildPromotionEstimate(price: number): PromotionEstimate {
  const roundedTotal = Math.round(price);

  const paintCost = Math.round(roundedTotal * 0.2);
  const suppliesCost = Math.round(roundedTotal * 0.1);
  const laborCost = roundedTotal - paintCost - suppliesCost;

  return {
    laborHours: 8,
    setupCleanupHours: 1,
    totalHours: 9,
    laborCost,
    paintGallons: 3,
    paintCost,
    suppliesCost,
    otherFees: 0,
    subtotal: roundedTotal,
    totalCost: roundedTotal,
  };
}

