import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getServiceById } from '../data/services';
import { type EstimateBreakdown } from '../utils/estimationCalculator';
import CalculatedServiceForm from '../components/forms/CalculatedServiceForm';
import InteriorDoorForm from '../components/forms/InteriorDoorForm';
import FrontDoorForm from '../components/forms/FrontDoorForm';
import CustomQuoteServiceForm from '../components/forms/CustomQuoteServiceForm';
import { submitServiceRequest } from '../services/firestoreService';
import type { ServiceRequestSubmission } from '../types/ServiceRequest';
import './ServicePage.css';
import { useCart } from '../context/CartContext';

type ServiceStep = 'service-form' | 'customer-info' | 'confirmation';

interface SavedBookingState {
  step: ServiceStep;
  estimate: EstimateBreakdown | null;
  formData: any;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    preferredContact: 'phone' | 'email' | 'text';
    bestTimeToCall: string;
    howDidYouHear: string;
    additionalNotes: string;
  };
  preferredDate: string;
  timestamp: number;
}

const ServicePage = () => {
  const { addItem } = useCart();
  const { serviceId } = useParams<{ serviceId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for collapsible service description
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  
  // Check if we're in editing mode
  const urlParams = new URLSearchParams(location.search);
  const editId = urlParams.get('editId');
  const isEditing = !!editId;
  
  // Get category from URL path
  const getCategoryFromPath = () => {
    const pathSegments = location.pathname.split('/');
    const categoryIndex = pathSegments.indexOf('services') + 1;
    const category = pathSegments[categoryIndex] || '';
    
    // Handle custom-painting as a special case
    if (category === 'custom-painting') {
      return 'custom';
    }
    
    return category;
  };
  
  const category = getCategoryFromPath();
  
  const service = serviceId ? getServiceById(serviceId) : (category === 'custom' ? getServiceById('custom-project') : null);

  // Service-specific description functions
  const getServiceDescriptionTitle = (serviceId: string) => {
    switch (serviceId) {
      case 'accent-wall':
        return 'Why Choose an Accent Wall?';
      case 'ceiling':
        return 'The Impact of Fresh Ceilings';
      case 'small-bathroom':
        return 'Small Space, Big Transformation';
      case 'basement-painting':
        return 'Unlock Your Basement\'s Potential';
      case 'kitchen-walls':
        return 'Make Your Kitchen Shine';
      case 'trimming-baseboards':
        return 'The Perfect Finishing Touch';
      case 'bedroom-painting':
        return 'Your Personal Sanctuary Awaits';
      case 'staircase-painting':
        return 'Making a Lasting Impression';
      case 'stairway-painting':
        return 'Why Your Stairway Matters';
      case 'hallway-painting':
        return 'Creating Seamless Home Flow';
      case 'fence-painting':
        return 'Protect and Beautify Your Fence';
      case 'kitchen-cabinet-painting':
        return 'Transform Without Full Replacement';
      case 'garage-door':
        return 'First Impressions Start Here';
      case 'exterior-railings':
        return 'Where Safety Meets Style';
      case 'stucco-ceiling-removal':
        return 'Modernize and Increase Home Value';
      case 'interior-door':
        return 'Details That Define Your Home';
      case 'front-door':
        return 'Welcome Guests with Confidence';
      case 'bathroom-vanity-cabinet':
        return 'Elevate Your Daily Routine';
      case 'custom-project':
        return 'Bringing Your Vision to Life';
      case 'drywall-repair':
        return 'Restore Your Walls to Perfection';
      default:
        return 'Why Choose Professional Painting?';
    }
  };

  const getServiceDescriptionText = (serviceId: string) => {
    switch (serviceId) {
      case 'accent-wall':
        return 'An accent wall instantly transforms ordinary spaces into extraordinary ones, adding personality and visual interest to any room. Our professional painters help you choose the right color and finish to create a stunning focal point that enhances your home\'s interior design. Well-executed accent walls draw the eye, add depth, and can make small spaces feel larger. Investing in professional accent wall painting elevates your home\'s aesthetic appeal and property value while allowing you to experiment with bold colors or textures without overwhelming the entire room.';
      case 'ceiling':
        return 'A fresh ceiling paint job dramatically brightens and modernizes any room, creating the illusion of more space and making your entire home feel cleaner. Professionally painted ceilings reflect light more effectively, reducing the need for artificial lighting and creating a brighter, more energy-efficient living environment. Our experts use premium paints and specialized techniques to ensure smooth, even coverage. Well-maintained ceilings are essential for a finished, polished look and can hide imperfections, update outdated colors, and protect against moisture. Investing in professional ceiling painting improves your home\'s aesthetic, protects this critical surface, and adds value to your property.';
      case 'small-bathroom':
        return 'Small bathrooms deserve big impact! Professional bathroom painting transforms cramped spaces into spa-like retreats that feel luxurious and spacious. Our specialists use moisture-resistant paints specifically designed for high-humidity areas to create beautiful, long-lasting finishes that resist mold and mildew. The right paint color and finish make small bathrooms feel larger and brighter, while proper preparation ensures your investment lasts. Well-painted bathrooms improve daily comfort and significantly increase your home\'s value, as updated bathrooms are among the top features homebuyers seek.';
      case 'basement-painting':
        return 'Transform your basement from a storage area into a beautiful, functional living space that adds valuable square footage. Professional basement painting creates an inviting atmosphere in below-grade spaces that often feel dark and unwelcoming. Our experts use specialized techniques and moisture-resistant paints designed for below-grade environments that prevent mold and mildew growth. The right paint colors brighten dark basements, make low ceilings feel higher, and create the perfect foundation for a home office or entertainment area. Well-painted basements significantly increase property value, as finished basements are highly desirable to homebuyers.';
      case 'kitchen-walls':
        return 'The kitchen is the heart of your home, and fresh paint makes it shine while protecting this high-traffic area from daily wear. Professional kitchen wall painting creates a clean, inviting atmosphere where families gather. Our specialists use durable, washable paints specifically formulated to stand up to cooking splatters, grease, and moisture while maintaining their beauty for years. The right paint finish and color make your kitchen feel more spacious, brighten dark corners, and create a cohesive design. Well-maintained kitchen walls enhance your home\'s value, as updated kitchens are one of the top selling features in real estate.';
      case 'trimming-baseboards':
        return 'Crisp, clean baseboards frame your rooms beautifully and create that polished, professional finish that separates average homes from exceptional ones. Professional baseboard painting adds the finishing touch that ties your entire room together, creating clean lines and visual boundaries that enhance your home\'s architectural details. Our precision painters give your baseboards a professional finish that complements your walls, protects them from scuff marks, and makes every room feel complete. Well-maintained baseboards improve your home\'s aesthetic appeal and protect walls from furniture damage. This attention to detail increases your home\'s perceived value and demonstrates quality care.';
      case 'bedroom-painting':
        return 'Create your personal sanctuary with bedroom painting that reflects your style and promotes restful sleep. Your bedroom should be a retreat from the daily hustle, and the right paint colors transform this space into a calming oasis. Whether you want calming neutrals that promote relaxation or bold statements that express your personality, our bedroom specialists help you achieve the perfect atmosphere. Professional bedroom painting improves your quality of sleep and enhances your home\'s overall comfort. Well-painted bedrooms create tranquility, make small spaces feel more spacious, and provide the perfect backdrop for your furniture. Investing in professional bedroom painting is an investment in your wellbeing, and beautifully painted bedrooms increase your home\'s marketability and value.';
      case 'staircase-painting':
        return 'Your staircase is often the first thing guests see when entering your home, making it a crucial focal point that sets the tone for your entire interior. Professional staircase painting transforms this high-traffic architectural feature into a stunning design element that creates a lasting impression. Our experts use durable, beautiful finishes specifically designed for high-traffic areas, ensuring your stairs look magnificent while standing up to daily wear. A well-painted staircase enhances your home\'s aesthetic appeal and protects surfaces from scuff marks and damage. The right color and finish make narrow staircases feel wider and create visual flow between floors. Investing in professional staircase painting elevates your entire home\'s interior design and increases property value.';
      case 'stairway-painting':
        return 'Professional stairway painting transforms one of your home\'s most visible architectural features, creating a stunning first impression and enhancing your home\'s overall value. Well-painted stairways improve your home\'s aesthetic appeal and protect high-traffic areas from wear and tear. Our expert painters use premium paints and specialized techniques to handle complex stairwells, ensuring flawless coverage even in challenging spaces. A beautifully painted stairway creates visual flow between floors, adds architectural interest, and makes narrow spaces feel more open. Investing in professional stairway painting elevates your entire home\'s interior design while protecting your investment for years to come.';
      case 'hallway-painting':
        return 'Hallway painting creates seamless transitions throughout your home and enhances the flow between rooms. Professionally painted hallways make narrow spaces feel more open and inviting, while carefully chosen colors brighten darker areas and create a welcoming atmosphere. Well-painted hallways improve your home\'s aesthetic continuity and protect high-traffic areas from scuff marks and daily wear. Our specialists understand how color, lighting, and finish work together to transform these connecting spaces. A beautifully painted hallway makes your entire home feel more cohesive, elegant, and spacious, improving the overall first impression for guests while increasing property value.';
      case 'fence-painting':
        return 'Protect your investment and boost curb appeal with professional fence painting that extends the life of your property\'s perimeter while dramatically improving its appearance. Well-maintained fences define your property boundaries, enhance your home\'s exterior aesthetic, and create privacy for your outdoor living spaces. Our exterior specialists use weather-resistant paints specifically formulated for outdoor use and proper preparation techniques to ensure your fence looks great and lasts for years, protecting it from UV damage, moisture, and rot. Professional fence painting prevents costly repairs and significantly extends your fence\'s lifespan. The right color and finish complement your home\'s exterior and increase your property\'s overall curb appeal and value.';
      case 'kitchen-cabinet-painting':
        return 'Give your kitchen a complete makeover without the cost of replacement, transforming dated cabinets into modern masterpieces that look like new. Professional kitchen cabinet painting is one of the most cost-effective ways to dramatically update your kitchen, saving you thousands compared to full cabinet replacement. Our experts transform your existing cabinets with premium finishes, durable paints, and expert techniques that ensure smooth, long-lasting results. Well-painted cabinets refresh your kitchen\'s appearance and protect them from wear, moisture, and grease buildup. The right paint color and finish completely change your kitchen\'s style and make small kitchens feel more spacious. Investing in professional cabinet painting significantly increases your home\'s value, as updated kitchens are among the top features homebuyers seek.';
      case 'garage-door':
        return 'Your garage door is a major part of your home\'s exterior, occupying up to 40% of your front facade and making it one of the first things people notice. Professional garage door painting enhances curb appeal and protects this large investment from weather damage, UV exposure, and wear. Our specialists refresh your door with durable exterior paints specifically designed for metal, wood, or composite materials, ensuring a beautiful, long-lasting finish that complements your home\'s architecture. A well-painted garage door completely transforms your home\'s exterior appearance, increases property value, and creates a cohesive, polished look. Investing in professional garage door painting protects your investment from rust, fading, and deterioration while significantly improving your home\'s first impression.';
      case 'exterior-railings':
        return 'Safety meets style with professional railing painting that protects your outdoor railings while enhancing your home\'s architectural beauty and curb appeal. Well-maintained exterior railings ensure safety for your family and guests while preventing costly rust damage, deterioration, and potential structural issues. Our experts restore your railings with weather-resistant finishes specifically designed for metal, wood, or composite materials, protecting against rust, corrosion, UV damage, and moisture. Professional railing painting extends the life of your railings significantly and prevents expensive replacements. The right paint color and finish highlight architectural details and complement your home\'s exterior. Investing in professional railing painting protects your investment, enhances safety, improves curb appeal, and increases property value.';
      case 'stucco-ceiling-removal':
        return 'Transform your home with professional popcorn ceiling removal that modernizes your interior and increases your property value. Outdated textured ceilings make rooms feel smaller, dated, and trap dust and allergens, while smooth, modern ceilings create a clean, contemporary look that brightens your entire space. Our specialists safely remove popcorn ceilings using proven techniques that minimize mess and protect your home, then create smooth, flawless surfaces ready for painting. Removing popcorn ceilings updates your home\'s appearance, improves air quality, makes rooms feel more spacious, and eliminates a dated feature that can decrease property value. The smooth, modern finish creates a professional, polished look that appeals to modern buyers and enhances any room\'s lighting. Investing in professional popcorn ceiling removal significantly increases your home\'s marketability and value.';
      case 'interior-door':
        return 'Refresh your interior doors with professional painting that enhances your home\'s flow, style, and overall aesthetic while protecting these high-use surfaces from daily wear. Interior doors see constant use and benefit from durable, smooth finishes that ensure smooth operation and maintain their beauty over time. Professional door painting updates your home\'s appearance and creates visual continuity throughout your living spaces, making your entire home feel more cohesive and well-designed. Our specialists ensure perfect coverage, smooth operation, and finishes that complement your interior design while protecting doors from scuff marks and daily wear. Well-painted interior doors frame your rooms beautifully and add architectural interest. This attention to detail increases your home\'s perceived quality and value.';
      case 'front-door':
        return 'Make a stunning first impression with professional front door painting that welcomes guests and protects your home\'s most important entry point. Your front door is the focal point of your home\'s exterior and deserves special attention, as it\'s the first thing visitors see and plays a crucial role in curb appeal. We use premium exterior paints and specialized techniques to create a beautiful, weather-resistant finish that stands up to harsh weather conditions, UV exposure, and daily use. A well-painted front door completely transforms your home\'s exterior, increases property value, and creates a welcoming atmosphere. The right color choice complements your home\'s architecture and makes your entrance stand out. Investing in professional front door painting protects this critical investment and significantly improves your home\'s curb appeal and marketability.';
      case 'bathroom-vanity-cabinet':
        return 'Professional bathroom vanity cabinet painting refreshes and modernizes your bathroom storage, transforming dated cabinets into beautiful, functional centerpieces. Updating your vanity cabinets is one of the most cost-effective ways to give your bathroom a complete makeover without the expense of full replacement. Our experts use premium paints, specialized primers for bathroom environments, and expert techniques to ensure smooth, durable finishes that resist moisture, humidity, and daily use. Well-painted vanity cabinets refresh your bathroom\'s style, protect them from water damage, and create a cohesive design. The right paint color and finish make your bathroom feel more spacious, modern, and luxurious. Investing in professional vanity cabinet painting significantly increases your home\'s value and creates a spa-like atmosphere.';
      case 'drywall-repair':
        return 'Professional drywall repair restores your walls to perfect condition, fixing holes, cracks, and damage before painting. Our specialists use expert techniques and quality materials to ensure seamless repairs that blend flawlessly with your existing walls. Well-repaired drywall not only improves your home\'s appearance but also prevents further damage and maintains structural integrity. Our experts assess wall conditions and apply appropriate repair methods, from small patch work to extensive restoration. Properly repaired walls provide the perfect foundation for painting, ensuring smooth, professional finishes that last. Investing in professional drywall repair protects your investment, enhances your home\'s value, and creates the flawless surface needed for beautiful paint results.';
      case 'custom-project':
        return 'Every home is unique, and so are your painting needs. Our custom painting services are tailored to your specific vision and requirements, bringing your creative ideas to life with professional quality and expert craftsmanship. Whether you need a special color match, intricate designs, unique finishes, or work on unusual surfaces, our experienced team has the skills and expertise to handle any challenge. Custom painting projects allow you to create truly personalized spaces that reflect your individual style and make your home stand out. From accent walls with specialty finishes to custom murals and decorative techniques, we work closely with you to understand your vision and deliver results that exceed expectations. Investing in custom painting services transforms your home into a one-of-a-kind space that expresses your personality and increases property value through unique features.';
      default:
        return 'Get accurate estimates for your painting project with our professional calculation tools. Our experienced team provides detailed quotes based on your specific requirements, ensuring transparency and fair pricing for every project.';
    }
  };

  const getServiceDescriptionImage = (serviceId: string) => {
    switch (serviceId) {
      case 'accent-wall':
        return '/services/accent-wall/0e12ab43ba833f8eb4a8e8f6919cc4d3.jpg';
      case 'ceiling':
        return '/services/ceiling/d9b8cceca38623dd777f98c279a07ff7.jpg';
      case 'small-bathroom':
        return '/services/bathroom/2031918adaa8a45c68f9dcaf26a85e54.jpg';
      case 'basement-painting':
        return '/services/basement/ede4060fc66d608019efd65027cfa170.jpg';
      case 'kitchen-walls':
        return '/services/kitchen-walls/18e71280752e388d198b783ef57e1a1a.jpg';
      case 'trimming-baseboards':
        return '/services/trimming/2169f21924b68c9e2503f9c2788d794d.jpg';
      case 'bedroom-painting':
        return '/services/bedroom/5d4fb4cdf08b0ec987e44298b53c5a41.jpg';
      case 'staircase-painting':
        return '/services/staircase/5db3f964bfa951122f3c9defc12d3bfb.jpg';
      case 'fence-painting':
        return '/services/fence/2d09e8bfd742f8617ccba90e8f9312e3.jpg';
      case 'kitchen-cabinet-painting':
        return '/services/kitchen-cabinets/1d5d1205901c93bfef8674023d3ed719.jpg';
      case 'garage-door':
        return '/services/garage/51af29468889910e0ff032eb12e29d79.jpg';
      case 'exterior-railings':
        return '/services/railings/7e0e0eca999d1b8d42b34d1d4d3b5acb.jpg';
      case 'stucco-ceiling-removal':
        return '/services/stucco-ceiling-removal/8039a71027ffccfbcfac6eab26f3167c.jpg';
      case 'interior-door':
        return '/services/interior-door/663b0736b9625a124d64f7f2338b3b9b.jpg';
      case 'front-door':
        return '/services/front-door/1ce69539f7e825bbfe8c82868b607f34.jpg';
      case 'bathroom-vanity-cabinet':
        return '/services/bathroom-vanity/3daac1d98424946cbc1dbff549cdd7b7.jpg';
      case 'stairway-painting':
        return '/services/staircase/8739f61c8295c4f8c61e7b1ff8693b0e.jpg';
      case 'hallway-painting':
        return '/services/hallway/3bfc0c21ce1ec2d983082d489b272075.jpg';
      case 'drywall-repair':
        return '/services/drywall-repair/66cf3bde7c2b864607ad0968_669e04cf4fd10614a10c59cd_drywall-repair-project-overview.png';
      case 'custom-project':
        return '/2b0cfa6e362fbb3aa1094b290832dbe0.jpg';
      default:
        return '/services/kitchen-walls/ff79fd3533a771d876cb26226b7009e4.jpg';
    }
  };
   
  const [step, setStep] = useState<ServiceStep>('service-form');
  const [estimate, setEstimate] = useState<EstimateBreakdown | null>(null);
  const [formData, setFormData] = useState<any>({}); // Store form field values
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    preferredContact: 'phone' as 'phone' | 'email' | 'text',
    bestTimeToCall: '',
    howDidYouHear: '',
    additionalNotes: ''
  });
  const [preferredDate, setPreferredDate] = useState('');
  const [isRestoringState, setIsRestoringState] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Redirect if service not found (but allow custom-painting route)
  useEffect(() => {
    if (!service && category !== 'custom') {
      navigate('/');
    }
  }, [service, category, navigate]);

  // Restore saved booking state on mount (only for custom painting or when editing)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const editId = urlParams.get('editId');
    
    if (serviceId && isRestoringState && (serviceId === 'custom-painting' || editId)) {
      try {
        const savedData = localStorage.getItem(`booking-${serviceId}`);
        if (savedData) {
          const parsed: SavedBookingState = JSON.parse(savedData);
          // Only restore if less than 24 hours old
          const age = Date.now() - parsed.timestamp;
          const twentyFourHours = 24 * 60 * 60 * 1000;
          
          if (age < twentyFourHours) {
            // Restore state
            setStep(parsed.step);
            setEstimate(parsed.estimate);
            setFormData(parsed.formData || {});
            setCustomerInfo(parsed.customerInfo);
            setPreferredDate(parsed.preferredDate);
          } else {
            // Data too old, remove it
            localStorage.removeItem(`booking-${serviceId}`);
          }
        }
      } catch (error) {
        console.error('Error restoring booking state:', error);
        localStorage.removeItem(`booking-${serviceId}`);
      }
      setIsRestoringState(false);
    } else if (!serviceId || (serviceId !== 'custom-painting' && !editId)) {
      // No serviceId or not custom painting/editing, don't restore state
      setIsRestoringState(false);
    }
  }, [serviceId, isRestoringState, location.search]);

  // Save booking state to localStorage whenever it changes (only for custom painting or when editing)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const editId = urlParams.get('editId');
    
    if (serviceId && !isRestoringState && step !== 'confirmation' && (serviceId === 'custom-painting' || editId)) {
      try {
        const dataToSave: SavedBookingState = {
          step,
          estimate,
          formData,
          customerInfo,
          preferredDate,
          timestamp: Date.now()
        };
        localStorage.setItem(`booking-${serviceId}`, JSON.stringify(dataToSave));
      } catch (error) {
        console.error('Error saving booking state:', error);
      }
    }
  }, [serviceId, step, estimate, formData, customerInfo, preferredDate, isRestoringState, location.search]);


  if (!service && category !== 'custom') {
    return null;
  }

  // Don't render form until restoration is complete
  if (isRestoringState) {
    return (
      <div className="service-page">
        <div className="service-page-header">
          <div className="container">
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              Loading...
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    if (step === 'customer-info') {
      setStep('service-form');
    } else {
      handleBackToServices();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Prepare service request data
      const serviceRequestData: ServiceRequestSubmission = {
        serviceId: serviceId!,
        customerInfo: {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address,
          city: customerInfo.city,
          postalCode: customerInfo.postalCode,
          preferredContact: customerInfo.preferredContact,
          bestTimeToCall: customerInfo.bestTimeToCall,
          howDidYouHear: customerInfo.howDidYouHear,
          additionalNotes: customerInfo.additionalNotes,
        },
        formData: formData,
      };

      // Only add estimate if it exists
      if (estimate) {
        serviceRequestData.estimate = estimate;
      }

      // Only add customProjectDetails if it's a custom quote service
      // Note: images are already in formData, so we don't duplicate them here
      // They will be extracted and uploaded from formData.images
      if (service?.type === 'custom-quote') {
        serviceRequestData.customProjectDetails = {
          description: formData.description || '',
          images: [], // Empty array - images are in formData.images and will be processed separately
          budget: formData.budget,
          timeline: formData.timeline,
        };
      }

      // Submit to Firestore
      const requestId = await submitServiceRequest(serviceRequestData);
      console.log('Service request submitted successfully:', requestId);
      
      // Send confirmation emails
      try {
        const emailData = {
          requestId,
          serviceId: serviceId!,
          serviceName: service!.name,
          customerInfo: serviceRequestData.customerInfo,
          estimate: serviceRequestData.estimate,
          formData: serviceRequestData.formData,
          createdAt: new Date(),
        };

        const emailResponse = await fetch(
          'https://us-central1-gta-budget-painting.cloudfunctions.net/sendServiceRequestEmails',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
          }
        );

        if (emailResponse.ok) {
          console.log('Confirmation emails sent successfully');
        } else {
          console.error('Failed to send emails:', await emailResponse.text());
          // Don't fail the entire submission if emails fail
        }
      } catch (emailError) {
        console.error('Error sending emails:', emailError);
        // Don't fail the entire submission if emails fail
      }
      
      // Clear saved booking progress on successful submission (only for custom painting)
      if (serviceId && serviceId === 'custom-painting') {
        localStorage.removeItem(`booking-${serviceId}`);
        console.log('Booking submitted, cleared saved progress');
      }
      
      setStep('confirmation');
    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitError('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear saved data when user navigates back to services
  const handleBackToServices = () => {
    const urlParams = new URLSearchParams(location.search);
    const editId = urlParams.get('editId');
    
    // Always clear localStorage for non-custom services when not editing
    if (serviceId && serviceId !== 'custom-painting' && !editId) {
      localStorage.removeItem(`booking-${serviceId}`);
    } else if (serviceId && serviceId === 'custom-painting' && step !== 'confirmation' && !editId) {
      localStorage.removeItem(`booking-${serviceId}`);
    }
    
    // Navigate to services page for Custom Project, otherwise to category page
    if (category === 'custom') {
      navigate('/services');
    } else {
      navigate(`/services/${category}`);
    }
  };


  return (
    <div className="service-page">
      {/* Back Button */}
      <div className="service-page-header">
        <div className="container">
          <button className="btn-back" onClick={handleBack}>
            ← {step === 'service-form' ? `Back to ${category === 'interior-painting' ? 'Interior Painting' : category === 'exterior-painting' ? 'Exterior Painting' : category === 'custom' ? 'Services' : 'Services'}` : 'Back'}
          </button>
          
          {/* Breadcrumb Navigation */}
          <nav className="breadcrumb">
            <a href="/services" className="breadcrumb-link">Services</a>
            <span className="breadcrumb-separator">›</span>
            {category === 'custom' ? (
              <span className="breadcrumb-current">Custom Painting</span>
            ) : (
              <>
                <a href={`/services/${category}`} className="breadcrumb-link">
                  {category === 'interior-painting' ? 'Interior Painting' : 
                   category === 'exterior-painting' ? 'Exterior Painting' : category}
                </a>
                <span className="breadcrumb-separator">›</span>
                <span className="breadcrumb-current">{service?.name}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Service Form */}
      {step === 'service-form' && (
        <section className="service-form-section">
          <div className="container">
            <div className="service-form-header">
              <div>
                <h1>{service?.name}</h1>
                <p className="service-description">{service?.description}</p>
              </div>
            </div>

             {/* Service Description Section - Only show when not editing */}
             {!isEditing && (
               <div className="service-description-content">
                 <button 
                   className="service-description-toggle"
                   onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                   aria-expanded={isDescriptionOpen}
                   aria-controls="service-description-collapsible"
                 >
                   <h2>{getServiceDescriptionTitle(service?.id || '')}</h2>
                   <span className={`service-description-toggle-icon ${isDescriptionOpen ? 'open' : ''}`}>
                     <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                   </span>
                 </button>
                 <div 
                   id="service-description-collapsible"
                   className={`service-description-collapsible ${isDescriptionOpen ? 'open' : ''}`}
                 >
                   <div className="service-description-text">
                     <div className="service-description-text-content">
                       <p className="service-description-description">
                         {getServiceDescriptionText(service?.id || '')}
                       </p>
                     </div>
                     <div className="service-description-image">
                       <img 
                         src={getServiceDescriptionImage(service?.id || '')} 
                         alt={service?.name || 'Professional painting service'} 
                         className="service-description-photo"
                       />
                     </div>
                   </div>
                 </div>
               </div>
             )}

            <div className="service-form-content">
              {service?.type === 'calculated' && (
                <CalculatedServiceForm
                  service={service}
                  initialFormData={formData}
                  initialEstimate={estimate}
                  onEstimateCalculated={(est: EstimateBreakdown | null, data: any) => {
                    setEstimate(est);
                    setFormData(data);
                  }}
                  onFormDataChange={(data: any) => {
                    setFormData(data);
                  }}
                />
              )}

              {service?.type === 'flat-rate' && service?.id === 'interior-door' && (
                <InteriorDoorForm
                  service={service}
                  onProceed={() => {}}
                  initialFormData={formData}
                />
              )}

              {service?.type === 'flat-rate' && service?.id === 'front-door' && (
                <FrontDoorForm
                  service={service}
                  onProceed={() => {}}
                  initialFormData={formData}
                />
              )}

              {service?.type === 'flat-rate' && service?.id !== 'interior-door' && service?.id !== 'front-door' && (
                <div className="service-not-available">
                  <h3>Service Not Available</h3>
                  <p>This service is currently not available for online booking. Please contact us directly for more information.</p>
                </div>
              )}

              {service?.type === 'custom-quote' && (
                <CustomQuoteServiceForm
                  service={service}
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Customer Info */}
      {step === 'customer-info' && (
        <section className="customer-info-section">
          <div className="container">
            <div className="customer-info-card">
              <h2>Almost Done!</h2>
              <p className="section-intro">Provide your contact information to receive your quote.</p>

              <form onSubmit={handleSubmit}>
                <div className="form-grid-2col">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      value={customerInfo.firstName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      value={customerInfo.lastName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone *</label>
                    <input
                      type="tel"
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Address *</label>
                    <input
                      type="text"
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="postalCode">Postal Code *</label>
                    <input
                      type="text"
                      id="postalCode"
                      value={customerInfo.postalCode}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, postalCode: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="preferredContact">Preferred Contact Method *</label>
                    <select
                      id="preferredContact"
                      value={customerInfo.preferredContact}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, preferredContact: e.target.value as 'phone' | 'email' | 'text' })}
                      required
                    >
                      <option value="phone">Phone Call</option>
                      <option value="email">Email</option>
                      <option value="text">Text Message</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="bestTimeToCall">Best Time to Call</label>
                    <input
                      type="text"
                      id="bestTimeToCall"
                      value={customerInfo.bestTimeToCall}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, bestTimeToCall: e.target.value })}
                      placeholder="e.g., Weekdays 9-5, Evenings after 6pm"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="howDidYouHear">How did you hear about us?</label>
                    <input
                      type="text"
                      id="howDidYouHear"
                      value={customerInfo.howDidYouHear}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, howDidYouHear: e.target.value })}
                      placeholder="e.g., Google, Facebook, Referral"
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="additionalNotes">Additional Notes</label>
                    <textarea
                      id="additionalNotes"
                      value={customerInfo.additionalNotes}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, additionalNotes: e.target.value })}
                      rows={3}
                      placeholder="Any special requirements or additional information..."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="preferredDate">Preferred Date *</label>
                  <input
                    type="date"
                    id="preferredDate"
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    required
                  />
                </div>

                <div className="summary-box">
                  <h3>Booking Summary</h3>
                  <div className="summary-item">
                    <span>Service:</span>
                    <span>{service?.name}</span>
                  </div>
                  {estimate && (
                    <div className="summary-item">
                      <span>Estimated Cost:</span>
                      <span className="price-highlight">${estimate.totalCost.toFixed(2)}</span>
                    </div>
                  )}
                  {service?.type === 'flat-rate' && service?.flatRate && (
                    <div className="summary-item">
                      <span>Fixed Price:</span>
                      <span className="price-highlight">${service.flatRate}</span>
                    </div>
                  )}
                </div>

                {submitError && (
                  <div className="error-message" style={{ 
                    color: '#e53e3e', 
                    marginBottom: '1rem', 
                    padding: '0.75rem', 
                    backgroundColor: '#fed7d7', 
                    borderRadius: '8px',
                    border: '1px solid #feb2b2'
                  }}>
                    {submitError}
                  </div>
                )}
                
                <button 
                  type="submit" 
                  className="btn-submit-booking"
                  disabled={isSubmitting}
                  style={{ 
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Confirmation */}
      {step === 'confirmation' && (
        <section className="confirmation-section">
          <div className="container">
            <div className="confirmation-card">
              <div className="confirmation-icon">✅</div>
              <h2>Quote Request Submitted!</h2>
              <p>We'll review your request and send a detailed quote within 24 hours.</p>
              <div className="confirmation-details">
                <h3>What's Next?</h3>
                <ol>
                  <li>Our professionals review your request</li>
                  <li>You'll receive a detailed quote via email</li>
                  <li>Once approved, pay online or in person</li>
                  <li>We'll schedule and complete your service!</li>
                </ol>
              </div>
              <button className="btn-primary" onClick={() => navigate('/')}>
                Request Another Quote
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Sticky Bottom Bar - Show estimate total when available, but not when editing */}
      {estimate && step === 'service-form' && !isEditing && (
        <div className="sticky-bottom-bar">
          <div className="sticky-bar-content">
            <div className="sticky-bar-total">
              <div className="sticky-bar-label">Estimated Total</div>
              <div className="sticky-bar-amount">${estimate.totalCost.toFixed(2)}</div>
            </div>
          </div>
          <div className="sticky-bar-actions">
            <button 
              className="sticky-bar-btn sticky-bar-btn-primary"
              onClick={() => {
                if (estimate) {
                  addItem({
                    serviceId: serviceId!,
                    serviceName: service!.name,
                    serviceType: service!.type,
                    estimate: {
                      ...estimate,
                      otherFees: estimate.prepFee + estimate.travelFee
                    },
                    formData: formData
                  });
                  navigate('/cart');
                }
              }}
              disabled={!estimate}
            >
              Add to Cart
            </button>
            <button 
              className="sticky-bar-btn sticky-bar-btn-secondary"
              onClick={() => {
                if (estimate) {
                  // Add this service to cart and go to checkout
                  addItem({
                    serviceId: serviceId!,
                    serviceName: service!.name,
                    serviceType: service!.type,
                    estimate: {
                      ...estimate,
                      otherFees: estimate.prepFee + estimate.travelFee
                    },
                    formData: formData
                  });
                  navigate('/checkout', { 
                    state: { 
                      serviceId: serviceId,
                      category: category,
                      isRequestNow: true // Flag to indicate this was a "Request Now" action
                    } 
                  });
                }
              }}
              disabled={!estimate}
            >
              Request Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePage;

