// Service Categories
export type ServiceType = 'calculated' | 'flat-rate' | 'custom-quote';

export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  icon: string;
  category: 'interior' | 'exterior' | 'specialty';
  featured?: boolean; // For bestsellers
  backgroundImage?: string; // Background image path
  description?: string; // Optional description (used in forms/pages)
  flatRate?: number; // Optional flat rate pricing
}

// All Services
export const allServices: Service[] = [
  // Calculated Services (Interior)
  {
    id: 'accent-wall',
    name: 'Accent Wall Painting',
    type: 'calculated',
    icon: '',
    category: 'interior',
    featured: true,
    backgroundImage: '/services/accent-wall/0e12ab43ba833f8eb4a8e8f6919cc4d3.jpg',
    description: 'Transform any room with a stunning accent wall that adds depth, character, and visual interest to your space.'
  },
  {
    id: 'ceiling',
    name: 'Ceiling Painting',
    type: 'calculated',
    icon: '',
    category: 'interior',
    featured: true,
    backgroundImage: '/services/ceiling/915e96cd556424de9648fd44f742373a.jpg',
    description: 'Professional ceiling painting services that brighten and refresh your rooms with expert techniques and quality materials.'
  },
  {
    id: 'small-bathroom',
    name: 'Bathroom Painting',
    type: 'calculated',
    icon: '',
    category: 'interior',
    featured: true,
    backgroundImage: '/services/bathroom/0773a067ee1c3fda8473965d13a360b0.jpg',
    description: 'Transform your bathroom with professional painting services designed to maximize space and create a fresh, modern look.',
  },
  {
    id: 'trimming-baseboards',
    name: 'Baseboard Painting',
    type: 'calculated',
    icon: '',
    category: 'interior',
    backgroundImage: '/services/trimming/2169f21924b68c9e2503f9c2788d794d.jpg',
    description: 'Professional trimming and baseboard painting services that add the perfect finishing touch to your interior spaces.',
  },
  {
    id: 'bedroom-painting',
    name: 'Bedroom Painting',
    type: 'calculated',
    icon: '',
    category: 'interior',
    featured: true,
    backgroundImage: '/services/bedroom/e1077bd2751943866c972d4cb3b3a576.jpg',
    description: 'Transform your bedroom into a peaceful sanctuary with professional bedroom painting services that create the perfect atmosphere for rest and relaxation.',
  },
  {
    id: 'kitchen-walls',
    name: 'Kitchen Wall Painting',
    type: 'calculated',
    icon: '',
    category: 'interior',
    backgroundImage: '/services/kitchen-walls/ff79fd3533a771d876cb26226b7009e4.jpg',
    description: 'Transform your kitchen with professional wall painting services that create a fresh, clean, and inviting cooking space.',
  },
  {
    id: 'stucco-ceiling-removal',
    name: 'Popcorn Ceiling Removal',
    type: 'calculated',
    icon: '',
    category: 'interior',
    backgroundImage: '/services/stucco-ceiling-removal/8039a71027ffccfbcfac6eab26f3167c.jpg',
    description: 'Professional stucco ceiling removal services that transform outdated textured ceilings into smooth, modern surfaces.',
  },
  {
    id: 'bathroom-vanity-cabinet',
    name: 'Cabinet Painting',
    type: 'calculated',
    icon: '',
    category: 'interior',
    backgroundImage: '/services/bathroom-vanity/3daac1d98424946cbc1dbff549cdd7b7.jpg',
    description: 'Professional bathroom vanity cabinet painting services that refresh and modernize your bathroom storage with expert techniques and quality finishes.',
  },
  
  // Flat Rate Services (Interior)
  {
    id: 'interior-door',
    name: 'Interior Door Painting',
    type: 'flat-rate',
    icon: '',
    category: 'interior',
    backgroundImage: '/services/interior-door/663b0736b9625a124d64f7f2338b3b9b.jpg',
    description: 'Professional interior door painting services that refresh and modernize your home\'s interior doors with expert techniques and quality finishes.',
  },
  {
    id: 'front-door',
    name: 'Front Door Painting',
    type: 'flat-rate',
    icon: '',
    category: 'exterior',
    backgroundImage: '/services/front-door/d324393011a6ef7779fe4081482baf84.jpg',
  },
  {
    id: 'fence-painting',
    name: 'Fence Painting',
    type: 'calculated',
    icon: '',
    category: 'exterior',
    backgroundImage: '/services/fence/739cc85f924bf84f79f5414f52957d1c.jpg',
  },
  
  // Custom Quote Services
  {
    id: 'garage-door',
    name: 'Garage Door Painting',
    type: 'calculated',
    icon: '',
    category: 'exterior',
    backgroundImage: '/services/garage/c17cfed3ff5e1fa1bc19c27d41bc7f9a.jpg',
  },
  
  // Custom Quote
  {
    id: 'custom-project',
    name: 'Custom Painting',
    type: 'custom-quote',
    icon: '',
    category: 'specialty',
    description: 'Custom painting projects tailored to your specific needs and requirements.'
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
