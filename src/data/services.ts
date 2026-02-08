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
  seoDescription?: string; // Detailed SEO-friendly description
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
    description: 'Transform any room with a stunning accent wall that adds depth, character, and visual interest to your space.',
    seoDescription: 'Professional accent wall painting services in Toronto and the GTA. Our expert painters transform any room with stunning accent walls that add depth, character, and visual interest. We use premium paints and professional techniques to create dramatic focal points that enhance your home\'s interior design. Perfect for living rooms, bedrooms, dining areas, and home offices. Licensed, insured, and trusted by hundreds of Toronto homeowners.'
  },
  {
    id: 'ceiling',
    name: 'Ceiling Painting',
    type: 'calculated',
    icon: '',
    category: 'interior',
    featured: true,
    backgroundImage: '/services/ceiling/915e96cd556424de9648fd44f742373a.jpg',
    description: 'Professional ceiling painting services that brighten and refresh your rooms with expert techniques and quality materials.',
    seoDescription: 'Expert ceiling painting services in Toronto and the Greater Toronto Area. Our professional painters specialize in ceiling painting techniques that brighten and refresh your rooms. We use premium paints, proper surface preparation, and professional application methods to ensure flawless results. Whether you need popcorn ceiling removal, textured ceiling painting, or smooth ceiling refinishing, our licensed and insured team delivers exceptional quality. Serving residential and commercial properties across the GTA with competitive pricing and guaranteed satisfaction.'
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
    seoDescription: 'Professional bathroom painting services in Toronto and the GTA. Our expert painters specialize in bathroom painting with moisture-resistant paints and professional techniques. We transform your bathroom with careful surface preparation, premium paints designed for high-humidity environments, and expert cutting around fixtures. Perfect for small bathrooms, powder rooms, and master bathrooms. Our licensed and insured team ensures mold-resistant finishes that last. Serving residential properties across Toronto, Mississauga, Brampton, and surrounding areas with competitive pricing.'
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
    seoDescription: 'Professional bedroom painting services in Toronto and the GTA. Our expert painters transform bedrooms into peaceful sanctuaries with carefully selected colors and professional techniques. We specialize in creating the perfect atmosphere for rest and relaxation using premium paints, proper surface preparation, and attention to detail. Whether you need a single bedroom or multiple bedrooms painted, our licensed and insured team delivers exceptional results. Serving residential properties across Toronto, Vaughan, Markham, and surrounding areas with competitive pricing and guaranteed satisfaction.'
  },
  {
    id: 'kitchen-walls',
    name: 'Kitchen Painting',
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
    name: 'Bathroom Vanity Painting',
    type: 'calculated',
    icon: '',
    category: 'interior',
    backgroundImage: '/services/bathroom-vanity/3daac1d98424946cbc1dbff549cdd7b7.jpg',
    description: 'Professional bathroom vanity cabinet painting services that refresh and modernize your bathroom storage with expert techniques and quality finishes.',
  },
  {
    id: 'stairway-painting',
    name: 'Stairway Painting',
    type: 'calculated',
    icon: '',
    category: 'interior',
    backgroundImage: '/services/staircase/5db3f964bfa951122f3c9defc12d3bfb.jpg',
    description: 'Professional stairway painting services that handle complex stairwells with expert techniques and safety equipment.',
    seoDescription: 'Professional stairway painting services in Toronto and the GTA. Our expert painters specialize in stairway painting with proper safety equipment and techniques for complex stairwells. We use premium paints, careful surface preparation, and professional methods to ensure flawless results in these challenging spaces. Whether you need straight, curved, or spiral staircases painted, our licensed and insured team delivers exceptional quality. Serving residential properties across Toronto, Vaughan, Markham, and surrounding areas with competitive pricing.'
  },
  {
    id: 'hallway-painting',
    name: 'Hallway Painting',
    type: 'calculated',
    icon: '',
    category: 'interior',
    backgroundImage: '/services/hallway/329e24c429f539051a368741a0cea969.jpg',
    description: 'Professional hallway painting services that create seamless transitions and enhance the flow of your home.',
    seoDescription: 'Professional hallway painting services in Toronto and the GTA. Our expert painters specialize in hallway painting that creates seamless transitions and enhances the flow of your home. We use premium paints, proper surface preparation, and professional techniques to ensure flawless results in these high-traffic areas. Whether you need narrow hallways, wide corridors, or multiple hallways painted, our licensed and insured team delivers exceptional quality. Serving residential properties across Toronto, Mississauga, Brampton, and surrounding areas with competitive pricing.'
  },
  {
    id: 'drywall-repair',
    name: 'Drywall Repair',
    type: 'calculated',
    icon: '',
    category: 'interior',
    backgroundImage: '/services/drywall-repair/66cf3bde7c2b864607ad0968_669e04cf4fd10614a10c59cd_drywall-repair-project-overview.png',
    description: 'Professional drywall repair services that fix holes, cracks, and damage to restore your walls to perfect condition before painting.',
    seoDescription: 'Professional drywall repair services in Toronto and the GTA. Our expert painters specialize in drywall repair that fixes holes, cracks, and damage to restore your walls to perfect condition. We use professional techniques, quality materials, and proper finishing to ensure seamless repairs that are ready for painting. Whether you need small hole repairs, large patch work, or crack repairs, our licensed and insured team delivers exceptional results. Serving residential properties across Toronto, Mississauga, Brampton, and surrounding areas with competitive pricing.'
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
    description: 'Professional front door painting services that enhance your home\'s curb appeal with weather-resistant finishes.',
    seoDescription: 'Professional front door painting services in Toronto and the GTA. Our expert painters specialize in front door painting that enhances your home\'s curb appeal with weather-resistant finishes. We use premium exterior paints, proper surface preparation, and professional techniques to ensure long-lasting results. Whether you need a single front door or multiple exterior doors painted, our licensed and insured team delivers exceptional quality. Serving residential properties across Toronto, Mississauga, Brampton, and surrounding areas with competitive flat-rate pricing.'
  },
  {
    id: 'fence-painting',
    name: 'Fence Painting',
    type: 'calculated',
    icon: '',
    category: 'exterior',
    backgroundImage: '/services/fence/739cc85f924bf84f79f5414f52957d1c.jpg',
    description: 'Professional fence painting services that protect and beautify your outdoor fencing with weather-resistant finishes.',
    seoDescription: 'Professional fence painting services in Toronto and the GTA. Our expert painters specialize in fence painting that protects and beautifies your outdoor fencing with weather-resistant finishes. We use premium exterior paints, proper surface preparation, and professional techniques to ensure long-lasting protection against weather elements. Whether you need wood fence painting, metal fence painting, or composite fence staining, our licensed and insured team delivers exceptional results. Serving residential properties across Toronto, Vaughan, Richmond Hill, and surrounding areas with competitive pricing.'
  },
  {
    id: 'driveway-sealing',
    name: 'Driveway Sealing',
    type: 'calculated',
    icon: '',
    category: 'exterior',
    backgroundImage: '/services/driveway/bac56abdd6adb37858835aacae49dcc8.jpg',
    description: 'Protect and refresh your asphalt driveway with professional sealing. Choose a driveway size and add optional crack filling, oil-stain primer, second coat, and hand edging.',
    seoDescription: 'Professional driveway sealing services in Toronto and the GTA. Protect your asphalt driveway from weather, salt, UV damage, and wear with a fresh coat of sealer. Choose from common driveway sizes with optional add-ons like crack filling, oil-stain primer, second coat, and hand edging for a clean finish. Serving homeowners across Toronto, Mississauga, Brampton, Vaughan, and surrounding areas.'
  },
  
  // Custom Quote Services
  {
    id: 'garage-door',
    name: 'Garage Door Painting',
    type: 'calculated',
    icon: '',
    category: 'exterior',
    backgroundImage: '/services/garage/c17cfed3ff5e1fa1bc19c27d41bc7f9a.jpg',
    description: 'Professional garage door painting services that enhance your home\'s exterior with weather-resistant finishes.',
    seoDescription: 'Professional garage door painting services in Toronto and the GTA. Our expert painters specialize in garage door painting that enhances your home\'s exterior with weather-resistant finishes. We use premium exterior paints, proper surface preparation, and professional techniques to ensure long-lasting protection against weather elements. Whether you need steel garage door painting, wood garage door painting, or aluminum garage door refinishing, our licensed and insured team delivers exceptional results. Serving residential properties across Toronto, Mississauga, Brampton, and surrounding areas with competitive pricing.'
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
