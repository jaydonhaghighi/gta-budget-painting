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
  backgroundImage?: string; // Background image path
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
    badge: 'trending',
    backgroundImage: '/services/accent-wall/0e12ab43ba833f8eb4a8e8f6919cc4d3.jpg'
  },
  {
    id: 'ceiling',
    name: 'Ceiling',
    description: 'Roll-perfect ceilings with stain-blocking where needed.',
    type: 'calculated',
    icon: '',
    category: 'interior',
    backgroundImage: '/services/ceiling/915e96cd556424de9648fd44f742373a.jpg'
  },
  {
    id: 'small-bathroom',
    name: 'Small Bathroom Painting',
    description: 'Moisture-tolerant finishes, clean cut lines, and quick turnarounds.',
    type: 'calculated',
    icon: '',
    category: 'interior',
    featured: true,
    badge: 'quick-refresh',
    backgroundImage: '/services/bathroom/0773a067ee1c3fda8473965d13a360b0.jpg'
  },
  {
    id: 'trimming-baseboards',
    name: 'Trimming & Baseboards',
    description: 'Gap-free caulking and tough enamel finishes where scuffs happen most.',
    type: 'calculated',
    icon: '',
    category: 'interior',
    backgroundImage: '/services/trimming/2169f21924b68c9e2503f9c2788d794d.jpg'
  },
  {
    id: 'bedroom-painting',
    name: 'Bedroom(s) Painting',
    description: 'Complete bedroom painting including walls, ceiling, trim, doors, and windows.',
    type: 'calculated',
    icon: '',
    category: 'interior',
    featured: true,
    badge: 'most-popular',
    backgroundImage: '/services/bedroom/e1077bd2751943866c972d4cb3b3a576.jpg'
  },
  {
    id: 'staircase-painting',
    name: 'Staircase Painting',
    description: 'Staircase painting with increased labor for difficulty and safety requirements.',
    type: 'calculated',
    icon: '',
    category: 'interior',
    backgroundImage: '/services/staircase/5db3f964bfa951122f3c9defc12d3bfb.jpg'
  },
  {
    id: 'kitchen-walls',
    name: 'Kitchen Walls',
    description: 'High-traffic kitchen walls with durable, scrubbable finishes perfect for cooking spaces.',
    type: 'calculated',
    icon: '',
    category: 'interior',
    backgroundImage: '/services/kitchen-walls/ff79fd3533a771d876cb26226b7009e4.jpg'
  },
  {
    id: 'basement-painting',
    name: 'Basement Painting',
    description: 'Transform your basement with fresh paint - walls, ceiling, and trim for livable space.',
    type: 'calculated',
    icon: '',
    category: 'interior',
    backgroundImage: '/services/basement/ede4060fc66d608019efd65027cfa170.jpg'
  },
  
  // Flat Rate Services (Interior)
  {
    id: 'small-closet',
    name: 'Small Closet Interior',
    description: 'Clean, bright closet interiors with durable, scuff-resistant finishes.',
    type: 'flat-rate',
    icon: '',
    flatRate: 150,
    category: 'interior',
    backgroundImage: '/services/closet/cd3c175530ce127003382d5845296b2b.jpg'
  },
  {
    id: 'interior-door',
    name: 'Interior Door',
    description: 'Single interior door painting including both sides and edges.',
    type: 'flat-rate',
    icon: '',
    flatRate: 89,
    category: 'interior',
    backgroundImage: '/services/interior-door/663b0736b9625a124d64f7f2338b3b9b.jpg'
  },
  {
    id: 'front-door',
    name: 'Front Door',
    description: 'Front entry repaints with premium exterior enamel for a flawless finish.',
    type: 'flat-rate',
    icon: '',
    flatRate: 200,
    category: 'exterior',
    backgroundImage: '/services/front-door/d324393011a6ef7779fe4081482baf84.jpg'
  },
  {
    id: 'shutters',
    name: 'Shutters',
    description: 'UV-resistant coatings and secure refitting for lasting curb appeal.',
    type: 'flat-rate',
    icon: '',
    flatRate: 120,
    category: 'exterior',
    backgroundImage: '/services/shutters/d21acebc2f3ad3f06b55c76e17ee5147.jpg'
  },
  {
    id: 'fence-painting',
    name: 'Fence Painting',
    description: 'Fence painting/staining for any size - residential fences, privacy panels, and more.',
    type: 'calculated',
    icon: '',
    category: 'exterior',
    backgroundImage: '/services/fence/739cc85f924bf84f79f5414f52957d1c.jpg'
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
    badge: 'high-value',
    backgroundImage: '/services/kitchen-cabinets/1d5d1205901c93bfef8674023d3ed719.jpg'
  },
  {
    id: 'garage-door',
    name: 'Garage Door',
    description: 'Clean prep, smooth spray/roll, and durable exterior finish.',
    type: 'custom-quote',
    icon: '',
    category: 'exterior',
    backgroundImage: '/services/garage/c17cfed3ff5e1fa1bc19c27d41bc7f9a.jpg'
  },
  {
    id: 'exterior-railings',
    name: 'Exterior Railings & Porch',
    description: 'Deck railings, porch rails, posts, and ceilings with weather-resistant finishes.',
    type: 'calculated',
    icon: '',
    category: 'exterior',
    backgroundImage: '/services/railings/7e0e0eca999d1b8d42b34d1d4d3b5acb.jpg'
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

