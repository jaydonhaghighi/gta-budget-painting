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
    name: 'Accent Wall',
    type: 'calculated',
    icon: '',
    category: 'interior',
    featured: true,
    backgroundImage: '/services/accent-wall/0e12ab43ba833f8eb4a8e8f6919cc4d3.jpg'
  },
  {
    id: 'ceiling',
    name: 'Ceiling',
    type: 'calculated',
    icon: '',
    category: 'interior',
    featured: true,
    backgroundImage: '/services/ceiling/915e96cd556424de9648fd44f742373a.jpg'
  },
  {
    id: 'small-bathroom',
    name: 'Small Bathroom Painting',
    type: 'calculated',
    icon: '',
    category: 'interior',
    featured: true,
    backgroundImage: '/services/bathroom/0773a067ee1c3fda8473965d13a360b0.jpg'
  },
  {
    id: 'trimming-baseboards',
    name: 'Trimming & Baseboards',
    type: 'calculated',
    icon: '',
    category: 'interior',
    backgroundImage: '/services/trimming/2169f21924b68c9e2503f9c2788d794d.jpg'
  },
  {
    id: 'bedroom-painting',
    name: 'Bedroom(s) Painting',
    type: 'calculated',
    icon: '',
    category: 'interior',
    featured: true,
    backgroundImage: '/services/bedroom/e1077bd2751943866c972d4cb3b3a576.jpg'
  },
  {
    id: 'kitchen-walls',
    name: 'Kitchen Walls',
    type: 'calculated',
    icon: '',
    category: 'interior',
    backgroundImage: '/services/kitchen-walls/ff79fd3533a771d876cb26226b7009e4.jpg'
  },
  {
    id: 'stucco-ceiling-removal',
    name: 'Stucco Ceiling Removal',
    type: 'calculated',
    icon: '',
    category: 'interior',
    backgroundImage: '/services/stucco-ceiling-removal/8039a71027ffccfbcfac6eab26f3167c.jpg'
  },
  {
    id: 'bathroom-vanity-cabinet',
    name: 'Bathroom Vanity Cabinet',
    type: 'calculated',
    icon: '',
    category: 'interior',
    backgroundImage: '/services/bathroom-vanity/3daac1d98424946cbc1dbff549cdd7b7.jpg'
  },
  
  // Flat Rate Services (Interior)
  {
    id: 'interior-door',
    name: 'Interior Door',
    type: 'flat-rate',
    icon: '',
    category: 'interior',
    backgroundImage: '/services/interior-door/663b0736b9625a124d64f7f2338b3b9b.jpg'
  },
  {
    id: 'front-door',
    name: 'Front Door',
    type: 'flat-rate',
    icon: '',
    category: 'exterior',
    backgroundImage: '/services/front-door/d324393011a6ef7779fe4081482baf84.jpg'
  },
  {
    id: 'fence-painting',
    name: 'Fence Painting',
    type: 'calculated',
    icon: '',
    category: 'exterior',
    backgroundImage: '/services/fence/739cc85f924bf84f79f5414f52957d1c.jpg'
  },
  
  // Custom Quote Services
  {
    id: 'garage-door',
    name: 'Garage Door',
    type: 'calculated',
    icon: '',
    category: 'exterior',
    backgroundImage: '/services/garage/c17cfed3ff5e1fa1bc19c27d41bc7f9a.jpg'
  },
  
  // Custom Quote
  {
    id: 'custom-project',
    name: 'Custom Project',
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

