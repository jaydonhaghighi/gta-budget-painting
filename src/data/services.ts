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
  featured?: boolean; // For bestsellers
  badge?: 'most-popular' | 'trending' | 'quick-refresh' | 'high-value'; // Badge type
}

// All Services
export const allServices: Service[] = [
  // Calculated Services (Interior)
  {
    id: 'accent-wall',
    name: 'Accent Wall',
    description: 'Colour consultation & feature wall repainting for instant impact.',
    type: 'calculated',
    icon: '',
    category: 'interior',
    featured: true,
    badge: 'trending'
  },
  {
    id: 'ceiling',
    name: 'Ceiling',
    description: 'Roll-perfect ceilings with stain-blocking where needed.',
    type: 'calculated',
    icon: '',
    category: 'interior'
  },
  {
    id: 'small-bathroom',
    name: 'Small Bathroom Painting',
    description: 'Moisture-tolerant finishes, clean cut lines, and quick turnarounds.',
    type: 'calculated',
    icon: '',
    category: 'interior',
    featured: true,
    badge: 'quick-refresh'
  },
  {
    id: 'trimming-baseboards',
    name: 'Trimming & Baseboards',
    description: 'Gap-free caulking and tough enamel finishes where scuffs happen most.',
    type: 'calculated',
    icon: '',
    category: 'interior'
  },
  {
    id: 'bedroom-painting',
    name: 'Bedroom(s) Painting',
    description: 'Complete bedroom painting including walls, ceiling, trim, doors, and windows.',
    type: 'calculated',
    icon: '',
    category: 'interior',
    featured: true,
    badge: 'most-popular'
  },
  {
    id: 'staircase-painting',
    name: 'Staircase Painting',
    description: 'Staircase painting with increased labor for difficulty and safety requirements.',
    type: 'calculated',
    icon: '',
    category: 'interior'
  },
  {
    id: 'kitchen-walls',
    name: 'Kitchen Walls',
    description: 'High-traffic kitchen walls with durable, scrubbable finishes perfect for cooking spaces.',
    type: 'calculated',
    icon: '',
    category: 'interior'
  },
  {
    id: 'basement-painting',
    name: 'Basement Painting',
    description: 'Transform your basement with fresh paint - walls, ceiling, and trim for livable space.',
    type: 'calculated',
    icon: '',
    category: 'interior'
  },
  
  // Flat Rate Services (Interior)
  {
    id: 'small-closet',
    name: 'Small Closet Interior',
    description: 'Clean, bright closet interiors with durable, scuff-resistant finishes.',
    type: 'flat-rate',
    icon: '',
    flatRate: 150,
    category: 'interior'
  },
  {
    id: 'interior-door',
    name: 'Interior Door',
    description: 'Single interior door painting including both sides and edges.',
    type: 'flat-rate',
    icon: '',
    flatRate: 89,
    category: 'interior'
  },
  {
    id: 'front-door',
    name: 'Front Door',
    description: 'Front entry repaints with premium exterior enamel for a flawless finish.',
    type: 'flat-rate',
    icon: '',
    flatRate: 200,
    category: 'exterior'
  },
  {
    id: 'shutters',
    name: 'Shutters',
    description: 'UV-resistant coatings and secure refitting for lasting curb appeal.',
    type: 'flat-rate',
    icon: '',
    flatRate: 120,
    category: 'exterior'
  },
  {
    id: 'fence-painting',
    name: 'Fence Painting',
    description: 'Fence painting/staining for any size - residential fences, privacy panels, and more.',
    type: 'calculated',
    icon: '',
    category: 'exterior'
  },
  
  // Custom Quote Services
  {
    id: 'kitchen-cabinets',
    name: 'Kitchen Cabinet Painting',
    description: 'Complete cabinet transformation - doors, frames, and hardware with professional spray or brush finish.',
    type: 'custom-quote',
    icon: '',
    category: 'interior',
    featured: true,
    badge: 'high-value'
  },
  {
    id: 'garage-door',
    name: 'Garage Door',
    description: 'Clean prep, smooth spray/roll, and durable exterior finish.',
    type: 'custom-quote',
    icon: '',
    category: 'exterior'
  },
  {
    id: 'exterior-railings',
    name: 'Exterior Railings & Porch',
    description: 'Deck railings, porch rails, posts, and ceilings with weather-resistant finishes.',
    type: 'calculated',
    icon: '',
    category: 'exterior'
  },
  
  // Custom Quote
  {
    id: 'custom-project',
    name: 'Custom Project',
    description: 'Tell us what you need and we\'ll get back to you with a quote within 24 hours.',
    type: 'custom-quote',
    icon: '',
    category: 'specialty'
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

