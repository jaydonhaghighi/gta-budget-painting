// Service Request Data Types for Firestore

export interface CustomerInfo {
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
  additionalNotes?: string;
}

export interface EstimateDetails {
  laborHours: number;
  setupCleanupHours: number;
  totalHours: number;
  laborCost: number;
  paintGallons: number;
  paintCost: number;
  suppliesCost: number;
  prepFee: number;
  travelFee: number;
  subtotal: number;
  totalCost: number;
  breakdown: string[];
}

export interface CartLineItem {
  serviceId: string;
  serviceName: string;
  serviceType: 'flat-rate' | 'calculated' | 'custom-quote';
  estimate?: EstimateDetails;
  formData: Record<string, any>;
}

export interface CartTotals {
  itemsSubtotal: number;
  travelFeeAdjustment: number;
  discount: number;
  grandTotal: number;
}

export interface ServiceRequest {
  id: string;
  serviceId?: string; // Optional for cart orders
  serviceName?: string; // Optional for cart orders
  serviceType?: 'flat-rate' | 'calculated' | 'custom-quote'; // Optional for cart orders
  
  // Customer Information
  customerInfo: CustomerInfo;
  
  // Estimate Details (for single service requests)
  estimate?: EstimateDetails;
  
  // Form Data (for single service requests)
  formData?: Record<string, any>;
  
  // Cart Order fields
  lineItems?: CartLineItem[];
  totals?: CartTotals;
  
  // Request Status
  status: 'pending' | 'confirmed' | 'scheduled' | 'completed' | 'cancelled' | 'denied';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Additional metadata
  source: 'website' | 'phone' | 'email';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  scheduledDate?: Date;
  completionDate?: Date;
  
  // Request type
  type?: 'single-service' | 'cart-order';
  
  // Custom project specific
  customProjectDetails?: {
    description: string;
    images: string[];
    budget?: number;
    timeline?: string;
  };
}

export interface ServiceRequestSubmission {
  serviceId: string;
  customerInfo: CustomerInfo;
  estimate?: EstimateDetails;
  formData: Record<string, any>;
  customProjectDetails?: {
    description: string;
    images: string[];
    budget?: number;
    timeline?: string;
  };
}