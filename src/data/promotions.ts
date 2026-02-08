export type Promotion = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  features: string[];
};

export type PromotionWithDerived = Promotion & {
  savings: number;
  percentage: number;
};

export function withPromotionDerived(promotion: Promotion): PromotionWithDerived {
  const savings = promotion.originalPrice - promotion.price;
  const percentage =
    promotion.originalPrice > 0
      ? Math.round((savings / promotion.originalPrice) * 100)
      : 0;

  return {
    ...promotion,
    savings,
    percentage,
  };
}

/**
 * Central source of truth for promo bundles so Landing + Location pages never drift.
 * Prices are intentionally "rounded" marketing numbers; derived fields are computed.
 */
export const PROMOTIONS: Promotion[] = [
  {
    id: 'january-jumpstart',
    name: 'Spring Refresh',
    subtitle: '3-Room Bundle',
    price: 1000,
    originalPrice: 1850,
    features: [
      "Any 3 standard rooms (up to 12'x12' each)",
      'Walls painted (2 coats) in each room',
      'Minor wall patching included',
      'Full prep & cleanup included',
    ],
  },
  {
    id: 'first-impressions',
    name: 'Fresh Start Package',
    subtitle: 'Entryway & Powder Room',
    price: 700,
    originalPrice: 850,
    features: [
      'Foyer/Hallway walls painted (2 coats)',
      'Powder Room walls painted (2 coats)',
      'Baseboard painting included',
      'Minor wall patching included',
    ],
  },
  {
    id: 'holiday-feast',
    name: 'Kitchen & Dining Refresh',
    subtitle: 'Kitchen & Dining Room',
    price: 750,
    originalPrice: 1250,
    features: [
      'Kitchen walls painted (2 coats)',
      'Dining Room walls painted (2 coats)',
      'Premium washable/scrubbable paint included',
      'Minor wall patching included',
    ],
  },
  {
    id: 'guest-suite',
    name: 'Guest Room Refresh',
    subtitle: 'Bedroom with Free Trim',
    price: 500,
    originalPrice: 950,
    features: [
      'Bedroom walls painted (2 coats)',
      "Up to 12'x12' room size",
      'Baseboards painted (2 coats)',
      'Window casings painted (2 coats)',
    ],
  },
  {
    id: 'master-suite',
    name: 'Master Suite Bundle',
    subtitle: 'Bedroom + Ensuite',
    price: 800,
    originalPrice: 1050,
    features: [
      'Master bedroom walls painted (2 coats)',
      'Ensuite bathroom walls painted (2 coats)',
      'Premium moisture-resistant paint in bathroom',
      'Minor wall patching included',
    ],
  },
  {
    id: 'living-space',
    name: 'Living Space Bundle',
    subtitle: 'Living Room + Hallway',
    price: 1100,
    originalPrice: 1550,
    features: [
      'Living room walls painted (2 coats)',
      'Hallway/foyer walls painted (2 coats)',
      'Baseboard painting included (2 coats)',
      'Minor wall patching included',
    ],
  },
];

