import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import type { ServiceRequest, ServiceRequestSubmission } from '../types/ServiceRequest';

const SERVICE_REQUESTS_COLLECTION = 'serviceRequests';

// (Removed) generateServiceRequestId was unused after switching to Firestore auto IDs

// Submit a new service request to Firestore
export const submitServiceRequest = async (submission: ServiceRequestSubmission | any): Promise<string> => {
  try {
    // Check if this is a cart submission (has lineItems)
    if (submission.lineItems && Array.isArray(submission.lineItems)) {
      // Cart submission with multiple line items
      const firestoreData: any = {
        customerInfo: submission.customerInfo,
        lineItems: submission.lineItems,
        totals: submission.totals,
        status: 'pending',
        createdAt: Timestamp.fromDate(submission.createdAt),
        updatedAt: Timestamp.fromDate(new Date()),
        source: 'website',
        priority: determineCartPriority(submission.totals),
        type: 'cart-order'
      };

      // Add scheduled date range if provided
      if (submission.scheduledDate) {
        firestoreData.scheduledDate = {
          earliestStart: Timestamp.fromDate(submission.scheduledDate.earliestStart),
          latestFinish: Timestamp.fromDate(submission.scheduledDate.latestFinish)
        };
      }

      // Filter out undefined values for Firestore
      const filteredData = Object.fromEntries(
        Object.entries(firestoreData).filter(([_, value]) => value !== undefined)
      );

      // Also filter lineItems array to remove any items with undefined values
      if (filteredData.lineItems && Array.isArray(filteredData.lineItems)) {
        filteredData.lineItems = filteredData.lineItems.map((item: any) => {
          return Object.fromEntries(
            Object.entries(item).filter(([_, value]) => value !== undefined)
          );
        });
      }

      const docRef = await addDoc(collection(db, SERVICE_REQUESTS_COLLECTION), filteredData);
      console.log('Cart order submitted successfully:', docRef.id);
      return docRef.id;
    } else {
      // Single service submission (legacy)
      const serviceRequest: Omit<ServiceRequest, 'id'> = {
        serviceId: submission.serviceId,
        serviceName: getServiceName(submission.serviceId),
        serviceType: getServiceType(submission.serviceId),
        customerInfo: submission.customerInfo,
        estimate: submission.estimate,
        formData: submission.formData,
        customProjectDetails: submission.customProjectDetails,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'website',
        priority: determinePriority(submission),
      };

      // Filter out undefined values for Firestore
      const firestoreData: any = {
        serviceId: serviceRequest.serviceId,
        serviceName: serviceRequest.serviceName,
        serviceType: serviceRequest.serviceType,
        customerInfo: serviceRequest.customerInfo,
        formData: serviceRequest.formData,
        status: serviceRequest.status,
        createdAt: Timestamp.fromDate(serviceRequest.createdAt),
        updatedAt: Timestamp.fromDate(serviceRequest.updatedAt),
        source: serviceRequest.source,
        priority: serviceRequest.priority,
        type: 'single-service'
      };

      // Only add estimate if it exists
      if (serviceRequest.estimate) {
        firestoreData.estimate = serviceRequest.estimate;
      }

      // Only add customProjectDetails if it exists
      if (serviceRequest.customProjectDetails) {
        firestoreData.customProjectDetails = serviceRequest.customProjectDetails;
      }

      // Only add scheduledDate if it exists
      if (submission.customProjectDetails?.timeline) {
        firestoreData.scheduledDate = Timestamp.fromDate(new Date(submission.customProjectDetails.timeline));
      }

      const docRef = await addDoc(collection(db, SERVICE_REQUESTS_COLLECTION), firestoreData);
      console.log('Service request submitted successfully:', docRef.id);
      return docRef.id;
    }
  } catch (error) {
    console.error('Error submitting service request:', error);
    throw new Error('Failed to submit service request. Please try again.');
  }
};

// Update service request status
export const updateServiceRequestStatus = async (
  requestId: string, 
  status: ServiceRequest['status'],
  additionalData?: Partial<ServiceRequest>
): Promise<void> => {
  try {
    const docRef = doc(db, SERVICE_REQUESTS_COLLECTION, requestId);
    const updateData: any = {
      status,
      updatedAt: Timestamp.fromDate(new Date()),
    };

    if (additionalData) {
      Object.assign(updateData, additionalData);
    }

    await updateDoc(docRef, updateData);
    console.log('Service request status updated:', requestId, status);
  } catch (error) {
    console.error('Error updating service request:', error);
    throw new Error('Failed to update service request status.');
  }
};

// Get service request by ID
export const getServiceRequest = async (requestId: string): Promise<ServiceRequest | null> => {
  try {
    const docRef = doc(db, SERVICE_REQUESTS_COLLECTION, requestId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        scheduledDate: data.scheduledDate?.toDate(),
        completionDate: data.completionDate?.toDate(),
      } as ServiceRequest;
    }
    return null;
  } catch (error) {
    console.error('Error getting service request:', error);
    throw new Error('Failed to retrieve service request.');
  }
};

// Get all service requests (with optional filters)
export const getServiceRequests = async (
  filters?: {
    status?: ServiceRequest['status'];
    serviceId?: string;
    dateRange?: { start: Date; end: Date };
    limitCount?: number;
  }
): Promise<ServiceRequest[]> => {
  try {
    let q = query(collection(db, SERVICE_REQUESTS_COLLECTION));
    
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    if (filters?.serviceId) {
      q = query(q, where('serviceId', '==', filters.serviceId));
    }
    
    if (filters?.dateRange) {
      q = query(q, 
        where('createdAt', '>=', Timestamp.fromDate(filters.dateRange.start)),
        where('createdAt', '<=', Timestamp.fromDate(filters.dateRange.end))
      );
    }
    
    q = query(q, orderBy('createdAt', 'desc'));
    
    if (filters?.limitCount) {
      q = query(q, limit(filters.limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    const requests: ServiceRequest[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      requests.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        scheduledDate: data.scheduledDate?.toDate(),
        completionDate: data.completionDate?.toDate(),
      } as ServiceRequest);
    });
    
    return requests;
  } catch (error) {
    console.error('Error getting service requests:', error);
    throw new Error('Failed to retrieve service requests.');
  }
};

// Delete service request
export const deleteServiceRequest = async (requestId: string): Promise<void> => {
  try {
    const docRef = doc(db, SERVICE_REQUESTS_COLLECTION, requestId);
    await deleteDoc(docRef);
    console.log('Service request deleted:', requestId);
  } catch (error) {
    console.error('Error deleting service request:', error);
    throw new Error('Failed to delete service request.');
  }
};

// Helper functions
const getServiceName = (serviceId: string): string => {
  // This would typically come from your services data
  const serviceNames: Record<string, string> = {
    'bedroom-painting': 'Bedroom Painting',
    'small-bathroom': 'Small Bathroom',
    'accent-wall': 'Accent Wall',
    'kitchen-cabinets': 'Kitchen Cabinet Painting',
    'interior-door': 'Interior Door',
    'basement-painting': 'Basement Painting',
    'kitchen-walls': 'Kitchen Walls',
    'staircase-painting': 'Staircase Painting',
    'fence-painting': 'Fence Painting',
    'exterior-railings': 'Exterior Railings',
    'custom-project': 'Custom Project',
  };
  return serviceNames[serviceId] || 'Unknown Service';
};

const getServiceType = (serviceId: string): 'flat-rate' | 'calculated' | 'custom-quote' => {
  const serviceTypes: Record<string, 'flat-rate' | 'calculated' | 'custom-quote'> = {
    'bedroom-painting': 'calculated',
    'small-bathroom': 'calculated',
    'accent-wall': 'calculated',
    'kitchen-cabinets': 'calculated',
    'interior-door': 'flat-rate',
    'basement-painting': 'calculated',
    'kitchen-walls': 'calculated',
    'staircase-painting': 'calculated',
    'fence-painting': 'calculated',
    'exterior-railings': 'calculated',
    'custom-project': 'custom-quote',
  };
  return serviceTypes[serviceId] || 'custom-quote';
};

const determinePriority = (submission: ServiceRequestSubmission): 'low' | 'medium' | 'high' => {
  // Determine priority based on service type and estimate
  if (submission.serviceId === 'custom-project') {
    return 'high'; // Custom projects are typically high priority
  }
  
  if (submission.estimate && submission.estimate.totalCost > 2000) {
    return 'high'; // High-value projects
  }
  
  if (submission.estimate && submission.estimate.totalCost > 1000) {
    return 'medium'; // Medium-value projects
  }
  
  return 'low'; // Standard priority
};

const determineCartPriority = (totals: any): 'low' | 'medium' | 'high' => {
  // Determine priority based on cart total value
  if (totals.grandTotal > 2000) {
    return 'high'; // High-value orders
  }
  
  if (totals.grandTotal > 1000) {
    return 'medium'; // Medium-value orders
  }
  
  return 'low'; // Standard priority
};
