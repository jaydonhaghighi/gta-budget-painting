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

export interface ServiceRequest {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceType: 'flat-rate' | 'calculated' | 'custom-quote';
  
  // Customer Information
  customerInfo: CustomerInfo;
  
  // Estimate Details (for calculated services)
  estimate?: EstimateDetails;
  
  // Form Data (service-specific inputs)
  formData: Record<string, any>;
  
  // Request Status
  status: 'pending' | 'confirmed' | 'scheduled' | 'completed' | 'cancelled';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Additional metadata
  source: 'website' | 'phone' | 'email';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  scheduledDate?: Date;
  completionDate?: Date;
  
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