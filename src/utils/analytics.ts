/**
 * Google Analytics 4 Event Tracking Utility
 * 
 * This utility provides functions to track user interactions and conversions
 * throughout the GTA Budget Painting website.
 * 
 * Usage:
 * 1. Import: import { trackEvent, trackPageView } from '../utils/analytics'
 * 2. Call tracking functions at appropriate points in your components
 * 
 * Example:
 * trackEvent('add_to_cart', {
 *   service_id: 'interior-living-room',
 *   service_name: 'Living Room Painting',
 *   value: 1500.00
 * })
 */

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set' | 'js',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

/**
 * Check if Google Analytics is available
 */
const isGAAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

/**
 * Track a page view
 * @param pagePath - The path of the page (e.g., '/services/interior-painting')
 * @param pageTitle - Optional page title
 */
export const trackPageView = (pagePath: string, pageTitle?: string): void => {
  if (!isGAAvailable()) {
    console.log('[Analytics] Page view:', pagePath);
    return;
  }

  window.gtag!('config', process.env.VITE_GA_MEASUREMENT_ID || '', {
    page_path: pagePath,
    page_title: pageTitle || document.title,
  });
};

/**
 * Track a custom event
 * @param eventName - Name of the event
 * @param eventParams - Event parameters (custom dimensions, values, etc.)
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
): void => {
  if (!isGAAvailable()) {
    console.log('[Analytics] Event:', eventName, eventParams);
    return;
  }

  window.gtag!('event', eventName, {
    ...eventParams,
    // Add timestamp for debugging
    timestamp: new Date().toISOString(),
  });
};

// ============================================================================
// CONVERSION EVENTS (High Priority)
// ============================================================================

/**
 * Track checkout completion (PRIMARY CONVERSION)
 * Call this when user successfully submits checkout form
 */
export const trackCheckoutComplete = (data: {
  transaction_id: string;
  value: number;
  currency?: string;
  service_count?: number;
  services?: Array<{
    service_id: string;
    service_name: string;
    service_type: string;
    value: number;
  }>;
}): void => {
  trackEvent('checkout_complete', {
    transaction_id: data.transaction_id,
    value: data.value,
    currency: data.currency || 'CAD',
    service_count: data.service_count || 1,
    services: data.services,
    // GA4 e-commerce event
    ecommerce: {
      transaction_id: data.transaction_id,
      value: data.value,
      currency: data.currency || 'CAD',
      items: data.services?.map((service) => ({
        item_id: service.service_id,
        item_name: service.service_name,
        item_category: service.service_type,
        price: service.value,
        quantity: 1,
      })),
    },
  });
};

/**
 * Track inquiry form submission
 * Call this when user submits inquiry form (landing page or contact page)
 */
export const trackInquirySubmitted = (data: {
  form_source: 'landing-page-quick-form' | 'contact-page-quick-form';
  has_email: boolean;
  has_phone: boolean;
}): void => {
  trackEvent('inquiry_submitted', {
    form_source: data.form_source,
    has_email: data.has_email,
    has_phone: data.has_phone,
  });
};

// ============================================================================
// E-COMMERCE EVENTS (Medium Priority)
// ============================================================================

/**
 * Track add to cart
 * Call this when user adds a service to cart
 */
export const trackAddToCart = (data: {
  service_id: string;
  service_name: string;
  service_type: string;
  service_category?: 'interior' | 'exterior' | 'custom';
  value: number;
  currency?: string;
}): void => {
  trackEvent('add_to_cart', {
    service_id: data.service_id,
    service_name: data.service_name,
    service_type: data.service_type,
    service_category: data.service_category,
    value: data.value,
    currency: data.currency || 'CAD',
    // GA4 e-commerce event
    ecommerce: {
      currency: data.currency || 'CAD',
      value: data.value,
      items: [
        {
          item_id: data.service_id,
          item_name: data.service_name,
          item_category: data.service_type,
          item_category2: data.service_category,
          price: data.value,
          quantity: 1,
        },
      ],
    },
  });
};

/**
 * Track "Request Now" button click (bypasses cart)
 */
export const trackRequestNow = (data: {
  service_id: string;
  service_name: string;
  service_type: string;
  value: number;
}): void => {
  trackEvent('request_now', {
    service_id: data.service_id,
    service_name: data.service_name,
    service_type: data.service_type,
    value: data.value,
  });
};

/**
 * Track view estimate
 * Call this when user completes service form and sees estimate
 */
export const trackViewEstimate = (data: {
  service_id: string;
  service_name: string;
  service_type: string;
  estimate_value: number;
  form_data?: Record<string, any>;
}): void => {
  trackEvent('view_estimate', {
    service_id: data.service_id,
    service_name: data.service_name,
    service_type: data.service_type,
    estimate_value: data.estimate_value,
    // Include key form data for analysis
    room_count: data.form_data?.roomCount,
    square_feet: data.form_data?.squareFeet,
  });
};

// ============================================================================
// ENGAGEMENT EVENTS
// ============================================================================

/**
 * Track phone number click
 * Call this when user clicks phone number link
 */
export const trackPhoneClick = (data: {
  location: 'header' | 'hero' | 'footer' | 'step' | 'other';
  phone_number?: string;
}): void => {
  trackEvent('phone_click', {
    location: data.location,
    phone_number: data.phone_number || '6473907181',
  });
};

/**
 * Track service category view
 */
export const trackServiceCategoryView = (category: 'interior' | 'exterior' | 'custom'): void => {
  trackEvent('view_service_category', {
    service_category: category,
  });
};

/**
 * Track service detail view
 */
export const trackServiceView = (data: {
  service_id: string;
  service_name: string;
  service_type: string;
  service_category?: 'interior' | 'exterior' | 'custom';
}): void => {
  trackEvent('view_service', {
    service_id: data.service_id,
    service_name: data.service_name,
    service_type: data.service_type,
    service_category: data.service_category,
  });
};

/**
 * Track form start
 * Call this when user begins filling out service form
 */
export const trackFormStart = (data: {
  service_id: string;
  service_name: string;
  step?: number;
}): void => {
  trackEvent('form_start', {
    service_id: data.service_id,
    service_name: data.service_name,
    step: data.step || 1,
  });
};

/**
 * Track form abandonment
 * Call this when user starts form but leaves without completing
 */
export const trackFormAbandonment = (data: {
  service_id: string;
  service_name: string;
  step_abandoned: number;
  time_spent_seconds?: number;
}): void => {
  trackEvent('form_abandonment', {
    service_id: data.service_id,
    service_name: data.service_name,
    step_abandoned: data.step_abandoned,
    time_spent_seconds: data.time_spent_seconds,
  });
};

/**
 * Track cart abandonment
 * Call this when user adds to cart but doesn't complete checkout
 */
export const trackCartAbandonment = (data: {
  cart_value: number;
  item_count: number;
  services?: Array<{
    service_id: string;
    service_name: string;
  }>;
}): void => {
  trackEvent('cart_abandonment', {
    cart_value: data.cart_value,
    item_count: data.item_count,
    services: data.services,
  });
};

/**
 * Track section scroll/view
 * Call this when user scrolls to a specific section
 */
export const trackSectionView = (sectionName: string): void => {
  trackEvent('section_view', {
    section_name: sectionName,
  });
};

/**
 * Track review interaction
 * Call this when user clicks review-related buttons
 */
export const trackReviewInteraction = (action: 'leave_review' | 'view_more_reviews'): void => {
  trackEvent('review_interaction', {
    review_action: action,
  });
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Initialize Google Analytics
 * Call this once when the app loads
 */
export const initAnalytics = (measurementId: string): void => {
  if (typeof window === 'undefined') return;

  // Load Google Analytics script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer!.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_path: window.location.pathname,
  });
};

