// Service Categories
export type ServiceType = 'calculated' | 'flat-rate' | 'custom-quote';

export interface Service {
  id: string;
  name: string;
  description: string;
  type: ServiceType;
  icon: string;
  flatRate?: number; // For flat-rate services
  category: 'interior' | 'exterior' | 'specialty';
}

// All Services
export const allServices: Service[] = [
  // Calculated Services (Interior)
  {
    id: 'accent-wall',
    name: 'Accent Wall',
    description: 'Colour consultation & feature wall repainting for instant impact.',
    type: 'calculated',
    icon: '🎨',
    category: 'interior'
  },
  {
    id: 'ceiling',
    name: 'Ceiling',
    description: 'Roll-perfect ceilings with stain-blocking where needed.',
    type: 'calculated',
    icon: '⬆️',
    category: 'interior'
  },
  {
    id: 'small-bathroom',
    name: 'Small Bathroom Painting',
    description: 'Moisture-tolerant finishes, clean cut lines, and quick turnarounds.',
    type: 'calculated',
    icon: '🚿',
    category: 'interior'
  },
  {
    id: 'foyer-entryway',
    name: 'Foyer/Entryway',
    description: 'High-traffic walls & trim refreshed quickly with durable scuff-resistant paints.',
    type: 'calculated',
    icon: '🚪',
    category: 'interior'
  },
  {
    id: 'trimming-baseboards',
    name: 'Trimming & Baseboards',
    description: 'Gap-free caulking and tough enamel finishes where scuffs happen most.',
    type: 'calculated',
    icon: '📏',
    category: 'interior'
  },
  
  // Flat Rate Services (Interior)
  {
    id: 'small-closet',
    name: 'Small Closet Interior',
    description: 'Clean, bright closet interiors with durable, scuff-resistant finishes.',
    type: 'flat-rate',
    icon: '🚪',
    flatRate: 150,
    category: 'interior'
  },
  {
    id: 'front-door',
    name: 'Front Door',
    description: 'Front entry repaints with premium exterior enamel for a flawless finish.',
    type: 'flat-rate',
    icon: '🏠',
    flatRate: 200,
    category: 'exterior'
  },
  {
    id: 'mailbox-post',
    name: 'Mailbox and Post',
    description: 'Quick refresh for mailbox posts & boxes to sharpen first impressions.',
    type: 'flat-rate',
    icon: '📮',
    flatRate: 100,
    category: 'exterior'
  },
  {
    id: 'shutters',
    name: 'Shutters',
    description: 'UV-resistant coatings and secure refitting for lasting curb appeal.',
    type: 'flat-rate',
    icon: '🪟',
    flatRate: 120,
    category: 'exterior'
  },
  {
    id: 'small-fence',
    name: 'Small Fence',
    description: 'Spot repairs and repaint/stain for compact fence sections.',
    type: 'flat-rate',
    icon: '🚧',
    flatRate: 250,
    category: 'exterior'
  },
  
  // Custom Quote Services
  {
    id: 'cabinet-touchups',
    name: 'Touch-Ups on Kitchen Cabinets',
    description: 'Colour-matched cabinet fixes, scratch and chip repair, and sheen blending.',
    type: 'custom-quote',
    icon: '🏺',
    category: 'interior'
  },
  {
    id: 'fireplace-mantel',
    name: 'Fire Place Mantel',
    description: 'Crisp lines & smooth enamel finishes to make your mantel a focal point again.',
    type: 'custom-quote',
    icon: '🔥',
    category: 'interior'
  },
  {
    id: 'builtin-shelving',
    name: 'Built-in Shelving',
    description: 'Priming, caulking, and fine-finish spraying or rolling for built-ins.',
    type: 'custom-quote',
    icon: '📚',
    category: 'interior'
  },
  {
    id: 'staircase-railings',
    name: 'Staircase Railings',
    description: 'Hand-sand, prime, and repaint/clear-coat for durability and safety.',
    type: 'calculated',
    icon: '🪜',
    category: 'interior'
  },
  {
    id: 'garage-door',
    name: 'Garage Door',
    description: 'Clean prep, smooth spray/roll, and durable exterior finish.',
    type: 'custom-quote',
    icon: '🚗',
    category: 'exterior'
  },
  {
    id: 'small-porch',
    name: 'Small Porch',
    description: 'Rails, posts, ceilings & doors refreshed with weather-tough systems.',
    type: 'calculated',
    icon: '🏡',
    category: 'exterior'
  },
  {
    id: 'deck-railings',
    name: 'Deck Railings',
    description: 'Prep & repaint for wood/metal rails to resist weathering.',
    type: 'calculated',
    icon: '🏗️',
    category: 'exterior'
  }
];

// Helper functions
export const getServiceById = (id: string): Service | undefined => {
  return allServices.find(service => service.id === id);
};

export const getServicesByCategory = (category: Service['category']): Service[] => {
  return allServices.filter(service => service.category === category);
};

export const getServicesByType = (type: ServiceType): Service[] => {
  return allServices.filter(service => service.type === type);
};

