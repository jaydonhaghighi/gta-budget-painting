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
  // SEO Enhancement Fields
  seoDescription?: string; // Detailed SEO description
  keywords?: string[]; // SEO keywords
  metaDescription?: string; // Meta description for SEO
  content?: string; // Rich content for the service page
  benefits?: string[]; // Key benefits of the service
  process?: string[]; // Step-by-step process
  faq?: { question: string; answer: string }[]; // FAQ section
  images?: string[]; // Additional images for the service
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
    seoDescription: 'Professional accent wall painting services in the GTA. Transform your living room, bedroom, or office with expert color consultation and flawless paint application. Our skilled painters create stunning focal points that enhance your home\'s aesthetic appeal.',
    keywords: [
      'accent wall painting', 'feature wall painting', 'interior painting GTA', 'Toronto accent wall', 'Mississauga painting', 'Brampton painters', 'Oakville interior painting', 'Burlington accent wall', 'Hamilton painting services', 'Kitchener painters', 'Waterloo interior design', 'Guelph home painting', 'Markham accent wall', 'Richmond Hill painters', 'Vaughan painting services', 'Ajax interior painting', 'Pickering accent wall', 'Whitby painters', 'Oshawa painting', 'Durham region painting', 'York region painters', 'Peel region painting', 'Halton region painters', 'color consultation', 'interior design', 'home renovation', 'paint colors', 'wall painting', 'room transformation', 'focal point wall', 'statement wall', 'bold colors', 'neutral tones', 'trending colors', 'paint trends 2024', 'interior painting cost', 'painting estimate', 'professional painters', 'licensed painters', 'insured painters', 'quality painting', 'residential painting', 'home improvement'
    ],
    metaDescription: 'Professional accent wall painting services in the GTA. Expert color consultation, flawless application, and stunning results. Get your free estimate today!',
    content: `
      <h2>Transform Your Space with Professional Accent Wall Painting</h2>
      <p>An accent wall is one of the most impactful ways to transform any room in your home. Whether you're looking to create a bold statement in your living room, add warmth to your bedroom, or enhance your home office, our professional accent wall painting services will bring your vision to life.</p>
      
      <h3>Why Choose Our Accent Wall Painting Services?</h3>
      <p>Our experienced painters understand the power of color and design. We work with you to select the perfect shade that complements your existing décor while creating the visual impact you desire. From bold, dramatic colors to subtle, sophisticated tones, we help you achieve the perfect look for your space.</p>
      
      <h3>Popular Accent Wall Colors & Trends</h3>
      <p>Stay ahead of design trends with our expert knowledge of popular accent wall colors. From deep navy blues and rich emerald greens to warm terracotta and sophisticated charcoal grays, we help you choose colors that not only look stunning today but will remain timeless for years to come.</p>
      
      <h3>Our Accent Wall Painting Process</h3>
      <p>We follow a meticulous process to ensure your accent wall looks flawless. From proper surface preparation and primer application to precise cutting and rolling techniques, every step is executed with precision and attention to detail.</p>
    `,
    benefits: [
      'Creates a stunning focal point in any room',
      'Adds depth and visual interest to your space',
      'Enhances your home\'s aesthetic appeal',
      'Increases property value',
      'Allows for creative color expression',
      'Can make small rooms appear larger',
      'Defines different areas in open-concept spaces',
      'Easy to change when you want a new look'
    ],
    process: [
      'Free consultation and color selection',
      'Surface preparation and cleaning',
      'Protection of surrounding areas',
      'Primer application for optimal adhesion',
      'Precise cutting and edging',
      'Professional paint application',
      'Quality inspection and touch-ups',
      'Clean-up and final walkthrough'
    ],
    faq: [
      {
        question: 'How much does accent wall painting cost?',
        answer: 'Accent wall painting costs vary based on wall size, paint quality, and complexity. Our free estimates provide detailed pricing for your specific project.'
      },
      {
        question: 'What colors work best for accent walls?',
        answer: 'The best accent wall colors depend on your room\'s lighting, existing décor, and personal style. We provide expert color consultation to help you choose the perfect shade.'
      },
      {
        question: 'How long does accent wall painting take?',
        answer: 'Most accent walls can be completed in 1-2 days, including preparation, painting, and cleanup. Complex designs may take longer.'
      },
      {
        question: 'Do you provide color consultation?',
        answer: 'Yes! Our experienced team provides complimentary color consultation to help you select the perfect accent wall color for your space.'
      }
    ],
    images: [
      '/services/accent-wall/0e12ab43ba833f8eb4a8e8f6919cc4d3.jpg',
      '/services/accent-wall/accent-wall-living-room.jpg',
      '/services/accent-wall/accent-wall-bedroom.jpg',
      '/services/accent-wall/accent-wall-office.jpg'
    ]
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
    seoDescription: 'Expert ceiling painting services in the GTA. Professional ceiling painting for bedrooms, living rooms, kitchens, and bathrooms. We handle popcorn ceiling removal, texture application, and flawless paint application.',
    keywords: [
      'ceiling painting', 'ceiling painting GTA', 'Toronto ceiling painting', 'Mississauga ceiling painters', 'Brampton ceiling painting', 'Oakville ceiling services', 'Burlington ceiling painting', 'Hamilton ceiling painters', 'Kitchener ceiling painting', 'Waterloo ceiling services', 'Guelph ceiling painting', 'Markham ceiling painters', 'Richmond Hill ceiling painting', 'Vaughan ceiling services', 'Ajax ceiling painting', 'Pickering ceiling painters', 'Whitby ceiling painting', 'Oshawa ceiling services', 'Durham region ceiling painting', 'York region ceiling painters', 'Peel region ceiling painting', 'Halton region ceiling services', 'popcorn ceiling removal', 'ceiling texture', 'ceiling repair', 'ceiling painting cost', 'interior ceiling painting', 'ceiling paint colors', 'white ceiling paint', 'ceiling painting techniques', 'professional ceiling painters', 'ceiling painting estimate', 'ceiling painting services', 'residential ceiling painting', 'commercial ceiling painting', 'ceiling painting contractors', 'licensed ceiling painters', 'insured ceiling painters', 'quality ceiling painting', 'ceiling painting preparation', 'ceiling painting tools', 'ceiling painting materials', 'ceiling painting process', 'ceiling painting tips', 'ceiling painting maintenance'
    ],
    metaDescription: 'Professional ceiling painting services in the GTA. Expert ceiling painting, popcorn ceiling removal, and texture application. Get your free estimate today!',
    content: `
      <h2>Professional Ceiling Painting Services in the GTA</h2>
      <p>Your ceiling is one of the most important surfaces in any room, yet it's often overlooked. A professionally painted ceiling can dramatically improve the appearance and feel of your space, making rooms appear larger, brighter, and more polished.</p>
      
      <h3>Why Professional Ceiling Painting Matters</h3>
      <p>Ceiling painting requires specialized techniques and equipment to achieve smooth, even coverage without drips or roller marks. Our experienced painters use professional-grade tools and techniques to ensure your ceiling looks flawless from every angle.</p>
      
      <h3>Our Ceiling Painting Services Include:</h3>
      <ul>
        <li>Popcorn ceiling removal and repair</li>
        <li>Ceiling texture application</li>
        <li>Ceiling crack repair and preparation</li>
        <li>Primer application for optimal paint adhesion</li>
        <li>Professional paint application with specialized rollers</li>
        <li>Clean, precise cutting around fixtures and trim</li>
      </ul>
      
      <h3>Popular Ceiling Paint Colors</h3>
      <p>While white remains the most popular choice for ceilings, we also offer a range of ceiling paint colors to complement your room's design. From soft off-whites to subtle grays, we help you choose the perfect ceiling color for your space.</p>
    `,
    benefits: [
      'Brightens and refreshes your entire room',
      'Makes rooms appear larger and more spacious',
      'Hides imperfections and stains',
      'Improves overall room aesthetics',
      'Increases property value',
      'Professional finish that lasts for years',
      'Enhances lighting and ambiance',
      'Creates a clean, polished look'
    ],
    process: [
      'Free consultation and assessment',
      'Furniture protection and preparation',
      'Ceiling cleaning and repair',
      'Popcorn ceiling removal (if needed)',
      'Primer application for optimal adhesion',
      'Professional paint application',
      'Quality inspection and touch-ups',
      'Clean-up and final walkthrough'
    ],
    faq: [
      {
        question: 'How much does ceiling painting cost?',
        answer: 'Ceiling painting costs depend on room size, ceiling height, and complexity. Our free estimates provide detailed pricing for your specific project.'
      },
      {
        question: 'Do you remove popcorn ceilings?',
        answer: 'Yes! We specialize in popcorn ceiling removal and can restore your ceiling to a smooth, modern finish.'
      },
      {
        question: "What's the best ceiling paint color?",
        answer: 'White is the most popular choice as it reflects light and makes rooms appear larger. We can help you choose the perfect shade for your space.'
      },
      {
        question: 'How long does ceiling painting take?',
        answer: 'Most ceiling painting projects can be completed in 1-2 days, depending on room size and complexity.'
      }
    ],
    images: [
      '/services/ceiling/915e96cd556424de9648fd44f742373a.jpg',
      '/services/ceiling/ceiling-bedroom.jpg',
      '/services/ceiling/ceiling-living-room.jpg',
      '/services/ceiling/ceiling-kitchen.jpg'
    ]
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
    seoDescription: 'Professional bathroom painting services in the GTA. Expert bathroom painting for powder rooms, half baths, and bathrooms. We use moisture-resistant paints and specialized techniques for lasting results.',
    keywords: [
      'bathroom painting', 'bathroom painting GTA', 'Toronto bathroom painting', 'Mississauga bathroom painters', 'Brampton bathroom painting', 'Oakville bathroom services', 'Burlington bathroom painting', 'Hamilton bathroom painters', 'Kitchener bathroom painting', 'Waterloo bathroom services', 'Guelph bathroom painting', 'Markham bathroom painters', 'Richmond Hill bathroom painting', 'Vaughan bathroom services', 'Ajax bathroom painting', 'Pickering bathroom painters', 'Whitby bathroom painting', 'Oshawa bathroom services', 'Durham region bathroom painting', 'York region bathroom painters', 'Peel region bathroom painting', 'Halton region bathroom services', 'powder room painting', 'half bath painting', 'bathroom paint colors', 'moisture resistant paint', 'bathroom painting cost', 'bathroom renovation', 'bathroom makeover', 'bathroom paint ideas', 'bathroom design', 'bathroom painting tips', 'bathroom painting preparation', 'bathroom painting process', 'professional bathroom painters', 'bathroom painting estimate', 'bathroom painting services', 'residential bathroom painting', 'bathroom painting contractors', 'licensed bathroom painters', 'insured bathroom painters', 'quality bathroom painting', 'bathroom painting materials', 'bathroom painting maintenance', 'bathroom painting trends'
    ],
    metaDescription: 'Professional bathroom painting services in the GTA. Expert bathroom painting with moisture-resistant paints and specialized techniques. Get your free estimate today!',
    content: `
      <h2>Professional Bathroom Painting Services in the GTA</h2>
      <p>bathrooms present unique challenges and opportunities for transformation. Our specialized bathroom painting services are designed to maximize your space, create the illusion of more room, and provide a fresh, modern look that lasts.</p>
      
      <h3>Why Choose Our Bathroom Painting Services?</h3>
      <p>bathrooms require specialized techniques and moisture-resistant materials to ensure lasting results. Our experienced painters understand the unique challenges of small spaces and use proven methods to create beautiful, durable finishes.</p>
      
      <h3>Our Bathroom Painting Services Include:</h3>
      <ul>
        <li>Moisture-resistant paint application</li>
        <li>Proper surface preparation for high-humidity environments</li>
        <li>Color consultation to maximize space perception</li>
        <li>Precise cutting around fixtures and trim</li>
        <li>Protection of bathroom fixtures and hardware</li>
        <li>Quality materials designed for bathroom environments</li>
      </ul>
      
      <h3>Best Colors for Bathrooms</h3>
      <p>Light, bright colors can make bathrooms feel larger and more open. We help you choose colors that reflect light and create the illusion of more space, from crisp whites to soft pastels and modern neutrals.</p>
      
      <h3>Moisture-Resistant Paint Solutions</h3>
      <p>Bathrooms require special paint formulations that can withstand high humidity and frequent cleaning. We use premium moisture-resistant paints that provide excellent coverage, durability, and easy maintenance.</p>
    `,
    benefits: [
      'Makes bathrooms feel larger and brighter',
      'Uses moisture-resistant paints for lasting results',
      'Professional finish that withstands humidity',
      'Easy to clean and maintain',
      'Enhances overall bathroom aesthetics',
      'Increases property value',
      'Creates a fresh, modern look',
      'Maximizes space perception'
    ],
    process: [
      'Free consultation and color selection',
      'Fixture protection and preparation',
      'Surface cleaning and preparation',
      'Moisture-resistant primer application',
      'Professional paint application',
      'Precise cutting around fixtures',
      'Quality inspection and touch-ups',
      'Clean-up and final walkthrough'
    ],
    faq: [
      {
        question: 'What paint is best for bathrooms?',
        answer: 'We use premium moisture-resistant paints specifically designed for bathroom environments. These paints withstand high humidity and frequent cleaning.'
      },
      {
        question: 'How can I make my bathroom look bigger?',
        answer: 'Light colors, proper lighting, and strategic color placement can make bathrooms appear larger. We provide expert color consultation for your space.'
      },
      {
        question: 'How long does bathroom painting take?',
        answer: 'Most bathroom painting projects can be completed in 1-2 days, including preparation, painting, and cleanup.'
      },
      {
        question: 'Do you protect bathroom fixtures during painting?',
        answer: 'Yes! We carefully protect all bathroom fixtures, hardware, and surfaces to ensure they remain clean and undamaged during the painting process.'
      }
    ],
    images: [
      '/services/bathroom/0773a067ee1c3fda8473965d13a360b0.jpg',
      '/services/bathroom/small-bathroom-before.jpg',
      '/services/bathroom/small-bathroom-after.jpg',
      '/services/bathroom/powder-room-painting.jpg'
    ]
  },
  {
    id: 'trimming-baseboards',
    name: 'Baseboard Painting',
    type: 'calculated',
    icon: '',
    category: 'interior',
    backgroundImage: '/services/trimming/2169f21924b68c9e2503f9c2788d794d.jpg',
    description: 'Professional trimming and baseboard painting services that add the perfect finishing touch to your interior spaces.',
    seoDescription: 'Expert trimming and baseboard painting services in the GTA. Professional baseboard painting, crown molding, door frames, and window trim painting. We provide precise, clean finishes that enhance your home\'s interior.',
    keywords: [
      'baseboard painting', 'trimming painting', 'baseboard painting GTA', 'Toronto baseboard painting', 'Mississauga trimming painters', 'Brampton baseboard painting', 'Oakville trimming services', 'Burlington baseboard painting', 'Hamilton trimming painters', 'Kitchener baseboard painting', 'Waterloo trimming services', 'Guelph baseboard painting', 'Markham trimming painters', 'Richmond Hill baseboard painting', 'Vaughan trimming services', 'Ajax baseboard painting', 'Pickering trimming painters', 'Whitby baseboard painting', 'Oshawa trimming services', 'Durham region baseboard painting', 'York region trimming painters', 'Peel region baseboard painting', 'Halton region trimming services', 'crown molding painting', 'door frame painting', 'window trim painting', 'interior trim painting', 'baseboard paint colors', 'trimming paint ideas', 'baseboard painting cost', 'trimming painting estimate', 'baseboard painting preparation', 'trimming painting process', 'professional baseboard painters', 'baseboard painting services', 'trimming painting contractors', 'licensed baseboard painters', 'insured trimming painters', 'quality baseboard painting', 'baseboard painting materials', 'trimming painting tools', 'baseboard painting maintenance', 'interior trim painting tips', 'baseboard painting trends'
    ],
    metaDescription: 'Professional trimming and baseboard painting services in the GTA. Expert baseboard, crown molding, and trim painting with precise, clean finishes. Get your free estimate today!',
    content: `
      <h2>Professional Trimming & Baseboard Painting Services in the GTA</h2>
      <p>Trimming and baseboards are the finishing touches that complete your interior spaces. Our professional trimming and baseboard painting services provide the precision and attention to detail needed to achieve flawless results that enhance your home's overall appearance.</p>
      
      <h3>Why Professional Trimming & Baseboard Painting Matters</h3>
      <p>Trimming and baseboards require specialized techniques and precision to achieve clean, professional results. Our experienced painters use professional-grade tools and techniques to ensure every edge is crisp and every surface is perfectly finished.</p>
      
      <h3>Our Trimming & Baseboard Painting Services Include:</h3>
      <ul>
        <li>Baseboard painting and refinishing</li>
        <li>Crown molding painting and touch-ups</li>
        <li>Door frame painting and repair</li>
        <li>Window trim painting and restoration</li>
        <li>Chair rail painting and installation</li>
        <li>Wainscoting painting and refinishing</li>
        <li>Precise cutting and edging techniques</li>
        <li>Color matching and consultation</li>
      </ul>
      
      <h3>Popular Trimming & Baseboard Colors</h3>
      <p>White and off-white remain the most popular choices for trimming and baseboards, but we also offer a range of colors to complement your interior design. From classic whites to modern grays and bold accent colors, we help you choose the perfect finish for your space.</p>
      
      <h3>Professional Techniques for Perfect Results</h3>
      <p>Our painters use specialized techniques including precise cutting, proper primer application, and multiple coats for durability. We ensure clean lines, smooth finishes, and professional results that last for years.</p>
    `,
    benefits: [
      'Creates clean, professional finishes',
      'Enhances overall interior aesthetics',
      'Protects wood from wear and damage',
      'Easy to clean and maintain',
      'Increases property value',
      'Completes your interior design',
      'Professional appearance that lasts',
      'Precise, attention-to-detail work'
    ],
    process: [
      'Free consultation and color selection',
      'Furniture and floor protection',
      'Surface cleaning and preparation',
      'Primer application for optimal adhesion',
      'Precise cutting and edging',
      'Professional paint application',
      'Quality inspection and touch-ups',
      'Clean-up and final walkthrough'
    ],
    faq: [
      {
        question: 'What colors work best for baseboards and trimming?',
        answer: 'White and off-white are the most popular choices as they provide clean, classic looks. We can help you choose colors that complement your interior design.'
      },
      {
        question: 'How long does trimming and baseboard painting take?',
        answer: 'Most trimming and baseboard painting projects can be completed in 1-2 days, depending on the amount of trim and complexity of the project.'
      },
      {
        question: 'Do you paint existing trim or install new?',
        answer: 'We can paint existing trim, repair damaged areas, or work with new trim installation. We provide comprehensive trimming services to meet your needs.'
      },
      {
        question: 'What preparation is needed for trimming painting?',
        answer: 'We handle all preparation including cleaning, sanding, priming, and protecting surrounding areas. Our professional preparation ensures lasting results.'
      }
    ],
    images: [
      '/services/trimming/2169f21924b68c9e2503f9c2788d794d.jpg',
      '/services/trimming/baseboard-painting.jpg',
      '/services/trimming/crown-molding-painting.jpg',
      '/services/trimming/door-frame-painting.jpg'
    ]
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
    seoDescription: 'Professional bedroom painting services in the GTA. Expert bedroom painting for master bedrooms, guest rooms, and children\'s rooms. We create peaceful, relaxing spaces with quality paints and expert color consultation.',
    keywords: [
      'bedroom painting', 'bedroom painting GTA', 'Toronto bedroom painting', 'Mississauga bedroom painters', 'Brampton bedroom painting', 'Oakville bedroom services', 'Burlington bedroom painting', 'Hamilton bedroom painters', 'Kitchener bedroom painting', 'Waterloo bedroom services', 'Guelph bedroom painting', 'Markham bedroom painters', 'Richmond Hill bedroom painting', 'Vaughan bedroom services', 'Ajax bedroom painting', 'Pickering bedroom painters', 'Whitby bedroom painting', 'Oshawa bedroom services', 'Durham region bedroom painting', 'York region bedroom painters', 'Peel region bedroom painting', 'Halton region bedroom services', 'master bedroom painting', 'guest room painting', 'children bedroom painting', 'bedroom paint colors', 'bedroom color ideas', 'bedroom painting cost', 'bedroom renovation', 'bedroom makeover', 'bedroom paint trends', 'bedroom painting tips', 'bedroom painting preparation', 'bedroom painting process', 'professional bedroom painters', 'bedroom painting estimate', 'bedroom painting services', 'residential bedroom painting', 'bedroom painting contractors', 'licensed bedroom painters', 'insured bedroom painters', 'quality bedroom painting', 'bedroom painting materials', 'bedroom painting maintenance', 'bedroom painting trends 2024', 'calming bedroom colors', 'bedroom paint ideas'
    ],
    metaDescription: 'Professional bedroom painting services in the GTA. Expert bedroom painting with calming colors and quality finishes. Create your perfect sanctuary. Get your free estimate today!',
    content: `
      <h2>Professional Bedroom Painting Services in the GTA</h2>
      <p>Your bedroom is your personal sanctuary, and the right paint color can transform it into the perfect space for rest and relaxation. Our professional bedroom painting services are designed to create peaceful, calming environments that promote better sleep and overall well-being.</p>
      
      <h3>Why Professional Bedroom Painting Matters</h3>
      <p>Bedrooms require special consideration for color selection, lighting, and atmosphere. Our experienced painters understand the psychology of color and work with you to choose colors that promote relaxation, improve sleep quality, and reflect your personal style.</p>
      
      <h3>Our Bedroom Painting Services Include:</h3>
      <ul>
        <li>Master bedroom painting and design consultation</li>
        <li>Guest room painting and color coordination</li>
        <li>Children's bedroom painting with fun, safe colors</li>
        <li>Teen bedroom painting with modern, trendy colors</li>
        <li>Nursery painting with calming, gender-neutral options</li>
        <li>Color consultation for optimal sleep environment</li>
        <li>Furniture protection and careful preparation</li>
        <li>Low-VOC paint options for healthier indoor air</li>
      </ul>
      
      <h3>Best Colors for Bedrooms</h3>
      <p>Calming colors like soft blues, gentle greens, warm grays, and neutral tones create the perfect bedroom atmosphere. We help you choose colors that promote relaxation while complementing your furniture and décor.</p>
      
      <h3>Specialized Bedroom Painting Techniques</h3>
      <p>Bedroom painting requires careful attention to detail, especially around furniture and fixtures. Our painters use specialized techniques to ensure clean lines, smooth finishes, and minimal disruption to your daily routine.</p>
    `,
    benefits: [
      'Creates a peaceful, relaxing atmosphere',
      'Improves sleep quality and well-being',
      'Reflects your personal style and preferences',
      'Increases property value and appeal',
      'Uses low-VOC paints for healthier air quality',
      'Professional finish that lasts for years',
      'Minimal disruption to your daily routine',
      'Expert color consultation for optimal results'
    ],
    process: [
      'Free consultation and color selection',
      'Furniture protection and preparation',
      'Surface cleaning and preparation',
      'Primer application for optimal adhesion',
      'Professional paint application',
      'Precise cutting around fixtures and trim',
      'Quality inspection and touch-ups',
      'Clean-up and final walkthrough'
    ],
    faq: [
      {
        question: 'What colors are best for bedrooms?',
        answer: 'Calming colors like soft blues, gentle greens, warm grays, and neutral tones work best for bedrooms. We provide expert color consultation to help you choose the perfect shade for your space.'
      },
      {
        question: 'How long does bedroom painting take?',
        answer: 'Most bedroom painting projects can be completed in 1-2 days, depending on room size and complexity. We work efficiently to minimize disruption to your daily routine.'
      },
      {
        question: 'Do you use low-VOC paints for bedrooms?',
        answer: 'Yes! We offer low-VOC paint options that are safer for indoor air quality, especially important in bedrooms where you spend extended time.'
      },
      {
        question: 'Can you help choose colors for children\'s bedrooms?',
        answer: 'Absolutely! We provide color consultation for all types of bedrooms, including children\'s rooms, and can suggest fun, safe colors that kids will love.'
      }
    ],
    images: [
      '/services/bedroom/e1077bd2751943866c972d4cb3b3a576.jpg',
      '/services/bedroom/master-bedroom-painting.jpg',
      '/services/bedroom/guest-room-painting.jpg',
      '/services/bedroom/children-bedroom-painting.jpg'
    ]
  },
  {
    id: 'kitchen-walls',
    name: 'Kitchen Wall Painting',
    type: 'calculated',
    icon: '',
    category: 'interior',
    backgroundImage: '/services/kitchen-walls/ff79fd3533a771d876cb26226b7009e4.jpg',
    description: 'Transform your kitchen with professional wall painting services that create a fresh, clean, and inviting cooking space.',
    seoDescription: 'Professional kitchen wall painting services in the GTA. Expert kitchen painting with grease-resistant paints and specialized techniques. We create beautiful, durable finishes that withstand cooking and daily use.',
    keywords: [
      'kitchen wall painting', 'kitchen painting GTA', 'Toronto kitchen painting', 'Mississauga kitchen painters', 'Brampton kitchen painting', 'Oakville kitchen services', 'Burlington kitchen painting', 'Hamilton kitchen painters', 'Kitchener kitchen painting', 'Waterloo kitchen services', 'Guelph kitchen painting', 'Markham kitchen painters', 'Richmond Hill kitchen painting', 'Vaughan kitchen services', 'Ajax kitchen painting', 'Pickering kitchen painters', 'Whitby kitchen painting', 'Oshawa kitchen services', 'Durham region kitchen painting', 'York region kitchen painters', 'Peel region kitchen painting', 'Halton region kitchen services', 'kitchen paint colors', 'kitchen color ideas', 'kitchen painting cost', 'kitchen renovation', 'kitchen makeover', 'kitchen paint trends', 'kitchen painting tips', 'kitchen painting preparation', 'kitchen painting process', 'professional kitchen painters', 'kitchen painting estimate', 'kitchen painting services', 'residential kitchen painting', 'kitchen painting contractors', 'licensed kitchen painters', 'insured kitchen painters', 'quality kitchen painting', 'kitchen painting materials', 'kitchen painting maintenance', 'kitchen painting trends 2024', 'grease resistant paint', 'kitchen paint ideas', 'kitchen wall colors', 'kitchen design'
    ],
    metaDescription: 'Professional kitchen wall painting services in the GTA. Expert kitchen painting with grease-resistant paints and durable finishes. Transform your cooking space today!',
    content: `
      <h2>Professional Kitchen Wall Painting Services in the GTA</h2>
      <p>Your kitchen is the heart of your home, and the right paint can transform it into a beautiful, functional space that inspires cooking and brings family together. Our professional kitchen wall painting services are designed to create durable, beautiful finishes that withstand the demands of daily cooking and entertaining.</p>
      
      <h3>Why Professional Kitchen Painting Matters</h3>
      <p>Kitchens face unique challenges including grease, steam, and frequent cleaning. Our experienced painters use specialized techniques and grease-resistant paints to ensure your kitchen walls look beautiful and stay clean for years to come.</p>
      
      <h3>Our Kitchen Wall Painting Services Include:</h3>
      <ul>
        <li>Grease-resistant paint application</li>
        <li>Proper surface preparation for kitchen environments</li>
        <li>Color consultation for optimal kitchen design</li>
        <li>Protection of cabinets, appliances, and fixtures</li>
        <li>Precise cutting around outlets and switches</li>
        <li>Washable, durable paint finishes</li>
        <li>Stain-resistant paint options</li>
        <li>Low-VOC paint options for healthier air quality</li>
      </ul>
      
      <h3>Best Colors for Kitchen Walls</h3>
      <p>Kitchen colors should be both beautiful and functional. We help you choose colors that complement your cabinets, enhance lighting, and create the perfect atmosphere for cooking and entertaining.</p>
      
      <h3>Grease-Resistant Paint Solutions</h3>
      <p>Kitchen walls require special paint formulations that can withstand grease, steam, and frequent cleaning. We use premium grease-resistant paints that provide excellent coverage, durability, and easy maintenance.</p>
    `,
    benefits: [
      'Creates a fresh, clean kitchen environment',
      'Uses grease-resistant paints for lasting results',
      'Professional finish that withstands daily use',
      'Easy to clean and maintain',
      'Enhances overall kitchen aesthetics',
      'Increases property value and appeal',
      'Creates a welcoming cooking space',
      'Complements existing kitchen design'
    ],
    process: [
      'Free consultation and color selection',
      'Appliance and cabinet protection',
      'Surface cleaning and preparation',
      'Grease-resistant primer application',
      'Professional paint application',
      'Precise cutting around fixtures',
      'Quality inspection and touch-ups',
      'Clean-up and final walkthrough'
    ],
    faq: [
      {
        question: 'What paint is best for kitchen walls?',
        answer: 'We use premium grease-resistant paints specifically designed for kitchen environments. These paints withstand grease, steam, and frequent cleaning while maintaining their beautiful appearance.'
      },
      {
        question: 'How do you protect kitchen appliances during painting?',
        answer: 'We carefully protect all kitchen appliances, cabinets, and fixtures with professional-grade coverings to ensure they remain clean and undamaged during the painting process.'
      },
      {
        question: 'What colors work best in kitchens?',
        answer: 'Kitchen colors should complement your cabinets and enhance lighting. We provide expert color consultation to help you choose colors that create the perfect cooking atmosphere.'
      },
      {
        question: 'How long does kitchen wall painting take?',
        answer: 'Most kitchen wall painting projects can be completed in 1-2 days, depending on kitchen size and complexity. We work efficiently to minimize disruption to your cooking routine.'
      }
    ],
    images: [
      '/services/kitchen-walls/ff79fd3533a771d876cb26226b7009e4.jpg',
      '/services/kitchen-walls/kitchen-before-painting.jpg',
      '/services/kitchen-walls/kitchen-after-painting.jpg',
      '/services/kitchen-walls/kitchen-color-options.jpg'
    ]
  },
  {
    id: 'stucco-ceiling-removal',
    name: 'Popcorn Ceiling Removal',
    type: 'calculated',
    icon: '',
    category: 'interior',
    backgroundImage: '/services/stucco-ceiling-removal/8039a71027ffccfbcfac6eab26f3167c.jpg',
    description: 'Professional stucco ceiling removal services that transform outdated textured ceilings into smooth, modern surfaces.',
    seoDescription: 'Expert stucco ceiling removal services in the GTA. Professional popcorn ceiling removal, textured ceiling removal, and smooth ceiling restoration. We safely remove stucco and create modern, clean ceilings.',
    keywords: [
      'stucco ceiling removal', 'popcorn ceiling removal', 'textured ceiling removal', 'stucco ceiling removal GTA', 'Toronto stucco ceiling removal', 'Mississauga popcorn ceiling removal', 'Brampton textured ceiling removal', 'Oakville stucco ceiling services', 'Burlington popcorn ceiling removal', 'Hamilton textured ceiling removal', 'Kitchener stucco ceiling removal', 'Waterloo popcorn ceiling removal', 'Guelph textured ceiling removal', 'Markham stucco ceiling removal', 'Richmond Hill popcorn ceiling removal', 'Vaughan textured ceiling removal', 'Ajax stucco ceiling removal', 'Pickering popcorn ceiling removal', 'Whitby textured ceiling removal', 'Oshawa stucco ceiling removal', 'Durham region popcorn ceiling removal', 'York region textured ceiling removal', 'Peel region stucco ceiling removal', 'Halton region popcorn ceiling removal', 'ceiling texture removal', 'ceiling scraping', 'ceiling restoration', 'smooth ceiling', 'modern ceiling', 'ceiling renovation', 'ceiling makeover', 'ceiling removal cost', 'ceiling removal process', 'professional ceiling removal', 'ceiling removal contractors', 'licensed ceiling removal', 'insured ceiling removal', 'quality ceiling removal', 'ceiling removal materials', 'ceiling removal tools', 'ceiling removal safety', 'ceiling removal preparation', 'ceiling removal cleanup', 'ceiling removal estimate', 'ceiling removal services'
    ],
    metaDescription: 'Professional stucco ceiling removal services in the GTA. Expert popcorn ceiling removal and textured ceiling restoration. Transform your ceilings today!',
    content: `
      <h2>Professional Stucco Ceiling Removal Services in the GTA</h2>
      <p>Outdated stucco and popcorn ceilings can make your home feel dated and difficult to clean. Our professional stucco ceiling removal services safely transform these textured ceilings into smooth, modern surfaces that enhance your home's value and appeal.</p>
      
      <h3>Why Professional Stucco Ceiling Removal Matters</h3>
      <p>Stucco ceiling removal requires specialized techniques and safety precautions to avoid damage to your home and ensure a smooth, professional finish. Our experienced team uses professional-grade tools and methods to safely remove textured ceilings and prepare surfaces for painting.</p>
      
      <h3>Our Stucco Ceiling Removal Services Include:</h3>
      <ul>
        <li>Safe stucco and popcorn ceiling removal</li>
        <li>Textured ceiling scraping and preparation</li>
        <li>Ceiling surface repair and smoothing</li>
        <li>Primer application for optimal paint adhesion</li>
        <li>Professional ceiling painting and finishing</li>
        <li>Complete cleanup and debris removal</li>
        <li>Furniture and floor protection</li>
        <li>Safety measures and dust containment</li>
      </ul>
      
      <h3>Types of Ceiling Textures We Remove</h3>
      <p>We safely remove all types of ceiling textures including popcorn ceilings, stucco finishes, acoustic textures, and other outdated ceiling treatments. Our process ensures your ceiling is left smooth and ready for modern finishes.</p>
      
      <h3>Safety and Cleanup Process</h3>
      <p>Ceiling removal can be messy, but our professional process includes proper dust containment, furniture protection, and thorough cleanup to ensure your home is left clean and ready for use.</p>
    `,
    benefits: [
      'Removes outdated, difficult-to-clean textures',
      'Creates smooth, modern ceiling surfaces',
      'Increases home value and appeal',
      'Easier to clean and maintain',
      'Improves lighting and room brightness',
      'Modernizes your home\'s appearance',
      'Professional finish that lasts for years',
      'Safe removal process with minimal disruption'
    ],
    process: [
      'Free consultation and assessment',
      'Furniture and floor protection',
      'Safety setup and dust containment',
      'Careful ceiling texture removal',
      'Surface repair and smoothing',
      'Primer application for optimal adhesion',
      'Professional ceiling painting',
      'Complete cleanup and final inspection'
    ],
    faq: [
      {
        question: 'How much does stucco ceiling removal cost?',
        answer: 'Stucco ceiling removal costs depend on ceiling size, texture type, and complexity. Our free estimates provide detailed pricing for your specific project.'
      },
      {
        question: 'Is stucco ceiling removal messy?',
        answer: 'We use professional dust containment and cleanup methods to minimize mess. Our process includes proper protection and thorough cleanup to keep your home clean.'
      },
      {
        question: 'How long does stucco ceiling removal take?',
        answer: 'Most stucco ceiling removal projects can be completed in 1-3 days, depending on ceiling size and complexity. We work efficiently to minimize disruption to your daily routine.'
      },
      {
        question: 'Do you paint the ceiling after removal?',
        answer: 'Yes! We provide complete ceiling restoration including removal, repair, priming, and painting to give you a beautiful, finished ceiling.'
      }
    ],
    images: [
      '/services/stucco-ceiling-removal/8039a71027ffccfbcfac6eab26f3167c.jpg',
      '/services/stucco-ceiling-removal/before-stucco-removal.jpg',
      '/services/stucco-ceiling-removal/after-stucco-removal.jpg',
      '/services/stucco-ceiling-removal/smooth-ceiling-finish.jpg'
    ]
  },
  {
    id: 'bathroom-vanity-cabinet',
    name: 'Cabinet Painting',
    type: 'calculated',
    icon: '',
    category: 'interior',
    backgroundImage: '/services/bathroom-vanity/3daac1d98424946cbc1dbff549cdd7b7.jpg',
    description: 'Professional bathroom vanity cabinet painting services that refresh and modernize your bathroom storage with expert techniques and quality finishes.',
    seoDescription: 'Expert bathroom vanity cabinet painting services in the GTA. Professional vanity painting, cabinet refinishing, and bathroom storage painting. We transform outdated vanities with quality paints and specialized techniques.',
    keywords: [
      'bathroom vanity painting', 'vanity cabinet painting', 'bathroom vanity painting GTA', 'Toronto vanity painting', 'Mississauga vanity cabinet painting', 'Brampton bathroom vanity painting', 'Oakville vanity painting services', 'Burlington vanity cabinet painting', 'Hamilton bathroom vanity painting', 'Kitchener vanity painting', 'Waterloo vanity cabinet painting', 'Guelph bathroom vanity painting', 'Markham vanity painting', 'Richmond Hill vanity cabinet painting', 'Vaughan bathroom vanity painting', 'Ajax vanity painting', 'Pickering vanity cabinet painting', 'Whitby bathroom vanity painting', 'Oshawa vanity painting', 'Durham region vanity cabinet painting', 'York region bathroom vanity painting', 'Peel region vanity painting', 'Halton region vanity cabinet painting', 'cabinet refinishing', 'bathroom cabinet painting', 'vanity makeover', 'bathroom renovation', 'cabinet painting cost', 'vanity painting process', 'cabinet painting preparation', 'professional vanity painting', 'vanity painting estimate', 'cabinet painting services', 'residential vanity painting', 'cabinet painting contractors', 'licensed vanity painters', 'insured cabinet painters', 'quality vanity painting', 'cabinet painting materials', 'vanity painting maintenance', 'bathroom cabinet trends', 'vanity color ideas', 'cabinet paint colors', 'bathroom storage painting'
    ],
    metaDescription: 'Professional bathroom vanity cabinet painting services in the GTA. Expert vanity painting and cabinet refinishing. Transform your bathroom storage today!',
    content: `
      <h2>Professional Bathroom Vanity Cabinet Painting Services in the GTA</h2>
      <p>Your bathroom vanity is a focal point that can make or break your bathroom's overall appearance. Our professional bathroom vanity cabinet painting services transform outdated, worn vanities into beautiful, modern storage solutions that enhance your bathroom's style and functionality.</p>
      
      <h3>Why Professional Vanity Cabinet Painting Matters</h3>
      <p>Bathroom vanities face unique challenges including moisture, daily use, and frequent cleaning. Our experienced painters use specialized techniques and moisture-resistant paints to ensure your vanity looks beautiful and stays protected for years to come.</p>
      
      <h3>Our Bathroom Vanity Cabinet Painting Services Include:</h3>
      <ul>
        <li>Vanity cabinet painting and refinishing</li>
        <li>Cabinet door and drawer painting</li>
        <li>Hardware protection and removal</li>
        <li>Surface preparation for moisture resistance</li>
        <li>Primer application for optimal adhesion</li>
        <li>Professional paint application</li>
        <li>Hardware reinstallation and adjustment</li>
        <li>Quality inspection and touch-ups</li>
      </ul>
      
      <h3>Best Colors for Bathroom Vanities</h3>
      <p>Bathroom vanity colors should complement your bathroom's overall design while providing a clean, modern look. We help you choose colors that enhance your space and reflect your personal style.</p>
      
      <h3>Moisture-Resistant Paint Solutions</h3>
      <p>Bathroom vanities require special paint formulations that can withstand high humidity and frequent cleaning. We use premium moisture-resistant paints that provide excellent coverage, durability, and easy maintenance.</p>
    `,
    benefits: [
      'Refreshes outdated bathroom vanities',
      'Uses moisture-resistant paints for lasting results',
      'Professional finish that withstands daily use',
      'Easy to clean and maintain',
      'Enhances overall bathroom aesthetics',
      'Increases property value and appeal',
      'Creates a modern, updated look',
      'Protects wood from moisture damage'
    ],
    process: [
      'Free consultation and color selection',
      'Hardware removal and protection',
      'Surface cleaning and preparation',
      'Moisture-resistant primer application',
      'Professional paint application',
      'Hardware reinstallation and adjustment',
      'Quality inspection and touch-ups',
      'Clean-up and final walkthrough'
    ],
    faq: [
      {
        question: 'What paint is best for bathroom vanities?',
        answer: 'We use premium moisture-resistant paints specifically designed for bathroom environments. These paints withstand high humidity and frequent cleaning while maintaining their beautiful appearance.'
      },
      {
        question: 'Do you remove hardware during painting?',
        answer: 'Yes! We carefully remove all hardware including handles, knobs, and hinges to ensure a professional finish. We reinstall and adjust everything after painting.'
      },
      {
        question: 'How long does vanity cabinet painting take?',
        answer: 'Most vanity cabinet painting projects can be completed in 1-2 days, depending on the size and complexity of the vanity.'
      },
      {
        question: 'Can you paint over existing paint on vanities?',
        answer: 'Yes! We can paint over existing paint after proper preparation. We assess the current condition and prepare the surface for optimal paint adhesion.'
      }
    ],
    images: [
      '/services/bathroom-vanity/3daac1d98424946cbc1dbff549cdd7b7.jpg',
      '/services/bathroom-vanity/vanity-before-painting.jpg',
      '/services/bathroom-vanity/vanity-after-painting.jpg',
      '/services/bathroom-vanity/vanity-color-options.jpg'
    ]
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
    seoDescription: 'Expert interior door painting services in the GTA. Professional door painting, door refinishing, and interior door restoration. We transform outdated doors with quality paints and specialized techniques.',
    keywords: [
      'interior door painting', 'door painting GTA', 'Toronto interior door painting', 'Mississauga door painting', 'Brampton interior door painting', 'Oakville door painting services', 'Burlington interior door painting', 'Hamilton door painting', 'Kitchener interior door painting', 'Waterloo door painting services', 'Guelph interior door painting', 'Markham door painting', 'Richmond Hill interior door painting', 'Vaughan door painting services', 'Ajax interior door painting', 'Pickering door painting', 'Whitby interior door painting', 'Oshawa door painting', 'Durham region interior door painting', 'York region door painting', 'Peel region interior door painting', 'Halton region door painting', 'door refinishing', 'door restoration', 'door makeover', 'interior door renovation', 'door painting cost', 'door painting process', 'door painting preparation', 'professional door painting', 'door painting estimate', 'door painting services', 'residential door painting', 'door painting contractors', 'licensed door painters', 'insured door painters', 'quality door painting', 'door painting materials', 'door painting maintenance', 'door paint colors', 'door color ideas', 'interior door trends', 'door painting tips'
    ],
    metaDescription: 'Professional interior door painting services in the GTA. Expert door painting and refinishing. Transform your interior doors today!',
    content: `
      <h2>Professional Interior Door Painting Services in the GTA</h2>
      <p>Interior doors are often overlooked but play a crucial role in your home's overall appearance and flow. Our professional interior door painting services transform outdated, worn doors into beautiful, modern features that enhance your home's style and functionality.</p>
      
      <h3>Why Professional Interior Door Painting Matters</h3>
      <p>Interior doors require specialized techniques to achieve smooth, even coverage without drips or brush marks. Our experienced painters use professional-grade tools and methods to ensure your doors look flawless and operate smoothly.</p>
      
      <h3>Our Interior Door Painting Services Include:</h3>
      <ul>
        <li>Door panel painting and refinishing</li>
        <li>Door frame painting and touch-ups</li>
        <li>Hardware protection and removal</li>
        <li>Surface preparation for optimal paint adhesion</li>
        <li>Primer application for durability</li>
        <li>Professional paint application</li>
        <li>Hardware reinstallation and adjustment</li>
        <li>Quality inspection and touch-ups</li>
      </ul>
      
      <h3>Best Colors for Interior Doors</h3>
      <p>Interior door colors should complement your home's overall design while providing clean, modern appeal. We help you choose colors that enhance your space and reflect your personal style.</p>
      
      <h3>Professional Door Painting Techniques</h3>
      <p>Our painters use specialized techniques including proper brush selection, smooth rolling techniques, and careful attention to detail to ensure your doors look professional and last for years.</p>
    `,
    benefits: [
      'Refreshes outdated interior doors',
      'Professional finish that lasts for years',
      'Easy to clean and maintain',
      'Enhances overall home aesthetics',
      'Increases property value and appeal',
      'Creates a modern, updated look',
      'Improves door operation and appearance',
      'Protects wood from wear and damage'
    ],
    process: [
      'Free consultation and color selection',
      'Hardware removal and protection',
      'Surface cleaning and preparation',
      'Primer application for optimal adhesion',
      'Professional paint application',
      'Hardware reinstallation and adjustment',
      'Quality inspection and touch-ups',
      'Clean-up and final walkthrough'
    ],
    faq: [
      {
        question: 'What paint is best for interior doors?',
        answer: 'We use premium interior paints specifically designed for doors and trim. These paints provide excellent coverage, durability, and a smooth, professional finish.'
      },
      {
        question: 'Do you remove hardware during painting?',
        answer: 'Yes! We carefully remove all hardware including handles, knobs, and hinges to ensure a professional finish. We reinstall and adjust everything after painting.'
      },
      {
        question: 'How long does interior door painting take?',
        answer: 'Most interior door painting projects can be completed in 1-2 days, depending on the number of doors and complexity of the project.'
      },
      {
        question: 'Can you paint over existing paint on doors?',
        answer: 'Yes! We can paint over existing paint after proper preparation. We assess the current condition and prepare the surface for optimal paint adhesion.'
      }
    ],
    images: [
      '/services/interior-door/663b0736b9625a124d64f7f2338b3b9b.jpg',
      '/services/interior-door/door-before-painting.jpg',
      '/services/interior-door/door-after-painting.jpg',
      '/services/interior-door/door-color-options.jpg'
    ]
  },
  {
    id: 'front-door',
    name: 'Front Door Painting',
    type: 'flat-rate',
    icon: '',
    category: 'exterior',
    backgroundImage: '/services/front-door/d324393011a6ef7779fe4081482baf84.jpg',
    seoDescription: 'Professional front door painting services in the GTA. Transform your home\'s curb appeal with expert exterior door painting, staining, and refinishing.',
    keywords: ['front door painting', 'exterior door painting', 'door refinishing', 'curb appeal', 'home exterior', 'door staining', 'wood door painting', 'steel door painting', 'door maintenance', 'exterior painting'],
    metaDescription: 'Expert front door painting services in Toronto, Vaughan, Markham, and the GTA. Professional door refinishing, staining, and painting for enhanced curb appeal.',
    content: 'Your front door is the first impression visitors have of your home. Our professional front door painting services in the GTA can transform your home\'s curb appeal and increase its value. We specialize in painting, staining, and refinishing all types of exterior doors including wood, steel, and fiberglass doors. Our experienced team uses premium paints and stains specifically designed for exterior use, ensuring long-lasting protection against weather elements. Whether you need a simple color refresh or a complete door transformation, we provide meticulous preparation, professional application, and clean finishing touches. We work with all door styles including traditional, modern, and contemporary designs, and can match any color scheme to complement your home\'s exterior. Our services include door preparation, sanding, priming, painting or staining, hardware protection, and cleanup. We also offer color consultation to help you choose the perfect shade that enhances your home\'s architectural style and neighborhood aesthetic.',
    benefits: [
      'Enhanced curb appeal and first impressions',
      'Increased home value and marketability',
      'Protection against weather damage and UV rays',
      'Easy maintenance and long-lasting finish',
      'Professional color matching and consultation',
      'Quick turnaround with minimal disruption'
    ],
    process: [
      'Thorough door inspection and assessment',
      'Careful removal of hardware and protection of surrounding areas',
      'Surface preparation including cleaning and sanding',
      'Application of primer for optimal paint adhesion',
      'Professional painting or staining with premium materials',
      'Hardware reinstallation and final quality inspection'
    ],
    faq: [
      {
        question: 'How long does front door painting take?',
        answer: 'Most front door painting projects are completed in 4-6 hours, including preparation, painting, and cleanup. We can often complete the work in a single day.'
      },
      {
        question: 'What types of doors can you paint?',
        answer: 'We paint and refinish all types of exterior doors including wood, steel, fiberglass, and composite doors. Each material requires specific preparation and paint types.'
      },
      {
        question: 'Do you provide color consultation?',
        answer: 'Yes, we offer professional color consultation to help you choose the perfect shade that complements your home\'s exterior and architectural style.'
      },
      {
        question: 'How often should I repaint my front door?',
        answer: 'With proper preparation and quality paint, a front door should last 5-7 years before needing repainting, depending on exposure to weather elements.'
      }
    ],
    images: [
      '/services/front-door/front-door-wood.jpg',
      '/services/front-door/front-door-steel.jpg',
      '/services/front-door/front-door-fiberglass.jpg',
      '/services/front-door/front-door-staining.jpg'
    ]
  },
  {
    id: 'fence-painting',
    name: 'Fence Painting',
    type: 'calculated',
    icon: '',
    category: 'exterior',
    backgroundImage: '/services/fence/739cc85f924bf84f79f5414f52957d1c.jpg',
    seoDescription: 'Professional fence painting services in the GTA. Protect and beautify your fence with expert exterior painting, staining, and maintenance.',
    keywords: ['fence painting', 'fence staining', 'exterior fence painting', 'wood fence painting', 'fence maintenance', 'fence protection', 'fence refinishing', 'outdoor painting', 'fence restoration', 'exterior painting'],
    metaDescription: 'Expert fence painting services in Toronto, Vaughan, Markham, and the GTA. Professional fence staining, painting, and maintenance for lasting protection.',
    content: 'Your fence is one of the most visible elements of your property and requires regular maintenance to stay beautiful and functional. Our professional fence painting services in the GTA provide comprehensive protection and aesthetic enhancement for all types of fences including wood, vinyl, and metal. We specialize in both painting and staining services, using premium exterior-grade products that withstand harsh weather conditions. Our experienced team handles everything from preparation and cleaning to final application and cleanup. We work with various fence styles including privacy fences, picket fences, chain-link fences, and decorative fences. Our services include thorough cleaning, sanding, priming, painting or staining, and protective coating application. We also offer color consultation to help you choose the perfect shade that complements your home\'s exterior and landscaping. Whether you need a complete fence makeover or routine maintenance, we provide professional results that enhance your property\'s curb appeal and protect your investment.',
    benefits: [
      'Enhanced property appearance and curb appeal',
      'Protection against weather damage and UV rays',
      'Extended fence lifespan and durability',
      'Easy maintenance and cleaning',
      'Professional color matching and consultation',
      'Comprehensive preparation and application'
    ],
    process: [
      'Thorough fence inspection and assessment',
      'Careful cleaning and preparation of all surfaces',
      'Sanding and repair of damaged areas',
      'Application of primer for optimal adhesion',
      'Professional painting or staining with premium materials',
      'Final inspection and cleanup'
    ],
    faq: [
      {
        question: 'How long does fence painting take?',
        answer: 'Fence painting typically takes 1-3 days depending on the size and condition of your fence. We provide detailed timelines during our free estimate.'
      },
      {
        question: 'What types of fences can you paint?',
        answer: 'We paint and stain all types of fences including wood, vinyl, metal, and composite materials. Each material requires specific preparation and paint types.'
      },
      {
        question: 'How often should I paint my fence?',
        answer: 'Wood fences typically need repainting every 3-5 years, while other materials may last longer. Regular maintenance extends the life of your fence.'
      },
      {
        question: 'Do you provide color consultation?',
        answer: 'Yes, we offer professional color consultation to help you choose the perfect shade that complements your home\'s exterior and landscaping.'
      }
    ],
    images: [
      '/services/fence/wood-fence-painting.jpg',
      '/services/fence/vinyl-fence-painting.jpg',
      '/services/fence/metal-fence-painting.jpg',
      '/services/fence/fence-staining.jpg'
    ]
  },
  
  // Custom Quote Services
  {
    id: 'garage-door',
    name: 'Garage Door Painting',
    type: 'calculated',
    icon: '',
    category: 'exterior',
    backgroundImage: '/services/garage/c17cfed3ff5e1fa1bc19c27d41bc7f9a.jpg',
    seoDescription: 'Professional garage door painting services in the GTA. Transform your garage door with expert exterior painting, refinishing, and maintenance.',
    keywords: ['garage door painting', 'garage door refinishing', 'exterior garage door painting', 'garage door maintenance', 'garage door staining', 'garage door restoration', 'outdoor painting', 'garage door protection', 'exterior painting', 'garage door makeover'],
    metaDescription: 'Expert garage door painting services in Toronto, Vaughan, Markham, and the GTA. Professional garage door refinishing, painting, and maintenance for enhanced curb appeal.',
    content: 'Your garage door is one of the largest and most visible elements of your home\'s exterior, making it a crucial component of your property\'s curb appeal. Our professional garage door painting services in the GTA can transform your garage door from drab to dramatic, significantly enhancing your home\'s appearance and value. We specialize in painting and refinishing all types of garage doors including wood, steel, aluminum, and fiberglass. Our experienced team uses premium exterior-grade paints and stains specifically designed for garage door materials, ensuring long-lasting protection against weather elements and daily wear. Whether you need a simple color refresh or a complete garage door transformation, we provide meticulous preparation, professional application, and clean finishing touches. We work with all garage door styles including traditional, modern, carriage house, and contemporary designs. Our services include door preparation, sanding, priming, painting or staining, hardware protection, and cleanup. We also offer color consultation to help you choose the perfect shade that complements your home\'s exterior and architectural style.',
    benefits: [
      'Dramatically enhanced curb appeal and home value',
      'Protection against weather damage and UV rays',
      'Extended garage door lifespan and durability',
      'Easy maintenance and long-lasting finish',
      'Professional color matching and consultation',
      'Quick turnaround with minimal disruption'
    ],
    process: [
      'Thorough garage door inspection and assessment',
      'Careful preparation and protection of surrounding areas',
      'Surface preparation including cleaning and sanding',
      'Application of primer for optimal paint adhesion',
      'Professional painting or staining with premium materials',
      'Final inspection and cleanup'
    ],
    faq: [
      {
        question: 'How long does garage door painting take?',
        answer: 'Most garage door painting projects are completed in 6-8 hours, including preparation, painting, and cleanup. We can often complete the work in a single day.'
      },
      {
        question: 'What types of garage doors can you paint?',
        answer: 'We paint and refinish all types of garage doors including wood, steel, aluminum, and fiberglass. Each material requires specific preparation and paint types.'
      },
      {
        question: 'Do you provide color consultation?',
        answer: 'Yes, we offer professional color consultation to help you choose the perfect shade that complements your home\'s exterior and architectural style.'
      },
      {
        question: 'How often should I repaint my garage door?',
        answer: 'With proper preparation and quality paint, a garage door should last 5-7 years before needing repainting, depending on exposure to weather elements.'
      }
    ],
    images: [
      '/services/garage/wood-garage-door.jpg',
      '/services/garage/steel-garage-door.jpg',
      '/services/garage/aluminum-garage-door.jpg',
      '/services/garage/garage-door-staining.jpg'
    ]
  },
  
  // Custom Quote
  {
    id: 'custom-project',
    name: 'Custom Painting',
    type: 'custom-quote',
    icon: '',
    category: 'specialty',
    seoDescription: 'Custom painting projects in the GTA. Professional painting services for unique and specialized projects including murals, decorative finishes, and specialty applications.',
    keywords: ['custom painting', 'specialty painting', 'decorative painting', 'mural painting', 'custom finishes', 'specialty finishes', 'unique painting', 'artistic painting', 'custom design', 'specialized painting'],
    metaDescription: 'Custom painting projects in Toronto, Vaughan, Markham, and the GTA. Professional specialty painting, murals, decorative finishes, and unique painting solutions.',
    content: 'Every home and business has unique painting needs that require specialized expertise and creative solutions. Our custom painting projects in the GTA are designed to bring your vision to life with professional craftsmanship and artistic flair. We specialize in a wide range of custom painting services including decorative finishes, murals, specialty textures, color washing, faux finishes, and unique design applications. Our experienced team works closely with you to understand your vision and create a custom solution that perfectly matches your style and requirements. Whether you need a stunning accent wall, a children\'s room mural, a sophisticated faux finish, or a completely unique design, we have the skills and creativity to make it happen. We work with all types of surfaces including walls, ceilings, furniture, and specialty materials. Our custom projects include detailed consultation, design development, material selection, and professional execution. We also offer color consultation and design advice to help you achieve the perfect look for your space.',
    benefits: [
      'Unique and personalized design solutions',
      'Professional artistic craftsmanship',
      'Custom color matching and design consultation',
      'Specialized techniques and finishes',
      'Creative problem-solving for unique spaces',
      'Professional project management'
    ],
    process: [
      'Detailed consultation and design discussion',
      'Custom design development and approval',
      'Material selection and preparation',
      'Professional application of specialty techniques',
      'Quality inspection and final touches',
      'Project completion and satisfaction review'
    ],
    faq: [
      {
        question: 'What types of custom painting projects do you handle?',
        answer: 'We handle a wide range of custom projects including murals, decorative finishes, faux painting, specialty textures, color washing, and unique design applications.'
      },
      {
        question: 'How do you develop custom designs?',
        answer: 'We work closely with you through consultation, design sketches, and material samples to develop a custom solution that perfectly matches your vision and requirements.'
      },
      {
        question: 'Do you provide design consultation?',
        answer: 'Yes, we offer comprehensive design consultation including color selection, technique recommendations, and creative solutions for unique spaces and requirements.'
      },
      {
        question: 'How long do custom projects take?',
        answer: 'Custom project timelines vary depending on complexity and scope. We provide detailed timelines during our consultation and keep you updated throughout the process.'
      }
    ],
    images: [
      '/services/custom/mural-painting.jpg',
      '/services/custom/decorative-finishes.jpg',
      '/services/custom/faux-painting.jpg',
      '/services/custom/specialty-textures.jpg'
    ]
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

