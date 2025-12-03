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
import { 
  extractFileObjects, 
  uploadImages, 
  replaceFilesWithUrls 
} from './storageService';

const SERVICE_REQUESTS_COLLECTION = 'serviceRequests';

// (Removed) generateServiceRequestId was unused after switching to Firestore auto IDs

// Helper function to recursively remove File objects from data (fallback if upload fails)
const removeFileObjects = (data: any): any => {
  if (data === null || data === undefined) {
    return data;
  }
  
  // If it's a File object, return undefined to filter it out
  if (data instanceof File) {
    return undefined;
  }
  
  // If it's an array, recursively process each item
  if (Array.isArray(data)) {
    return data
      .map(item => removeFileObjects(item))
      .filter(item => item !== undefined);
  }
  
  // If it's an object, recursively process each property
  if (typeof data === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(data)) {
      const cleanedValue = removeFileObjects(value);
      // Only include the property if the cleaned value is not undefined
      if (cleanedValue !== undefined) {
        cleaned[key] = cleanedValue;
      }
    }
    return cleaned;
  }
  
  // For primitive values, return as-is
  return data;
};

// Submit a new service request to Firestore
export const submitServiceRequest = async (submission: ServiceRequestSubmission | any): Promise<string> => {
  try {
    // Extract all File objects from the submission
    const allFiles = extractFileObjects(submission);
    
    // Generate a temporary ID for organizing uploads (we'll use timestamp + random)
    const tempRequestId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Upload all images first (if any)
    let fileUrlMap = new Map<File, string>();
    if (allFiles.length > 0) {
      try {
        console.log(`Uploading ${allFiles.length} image(s) to Firebase Storage...`);
        const urls = await uploadImages(allFiles, tempRequestId);
        // Create a map of File objects to their URLs
        allFiles.forEach((file, index) => {
          fileUrlMap.set(file, urls[index]);
        });
        console.log('Images uploaded successfully');
      } catch (uploadError) {
        console.error('Error uploading images:', uploadError);
        // Continue without images if upload fails
        // You might want to throw an error here instead, depending on your requirements
      }
    }
    
    // Check if this is a cart submission (has lineItems)
    if (submission.lineItems && Array.isArray(submission.lineItems)) {
      // Cart submission with multiple line items
      const firestoreData: any = {
        customerInfo: submission.customerInfo,
        lineItems: submission.lineItems,
        totals: submission.totals,
        status: 'pending',
        createdAt: Timestamp.fromDate(new Date(submission.createdAt.getTime())),
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

      // Replace File objects with URLs
      const cleanedData = fileUrlMap.size > 0 
        ? replaceFilesWithUrls(firestoreData, fileUrlMap)
        : removeFileObjects(firestoreData);
      
      const filteredData = Object.fromEntries(
        Object.entries(cleanedData).filter(([_, value]) => value !== undefined)
      );

      // Also filter lineItems array to remove any items with undefined values
      if (filteredData.lineItems && Array.isArray(filteredData.lineItems)) {
        filteredData.lineItems = filteredData.lineItems.map((item: any) => {
          return Object.fromEntries(
            Object.entries(item).filter(([_, value]) => value !== undefined)
          );
        });
      }

      // Validate required fields before saving
      if (!filteredData.customerInfo) {
        throw new Error('Missing customerInfo in service request data');
      }
      if (!filteredData.lineItems || !Array.isArray(filteredData.lineItems) || filteredData.lineItems.length === 0) {
        throw new Error('Missing or empty lineItems in service request data');
      }
      if (!filteredData.totals) {
        throw new Error('Missing totals in service request data');
      }

      // Check for any remaining File objects (should not happen, but just in case)
      const remainingFiles = extractFileObjects(filteredData);
      if (remainingFiles.length > 0) {
        console.warn('Warning: Found', remainingFiles.length, 'File objects remaining in data after processing. Removing them...');
        // Re-process to remove any remaining File objects
        const cleanedAgain = removeFileObjects(filteredData);
        // Use the cleaned version
        const finalFilteredData = Object.fromEntries(
          Object.entries(cleanedAgain).filter(([_, value]) => value !== undefined)
        );
        
        // Update lineItems if they exist
        if (finalFilteredData.lineItems && Array.isArray(finalFilteredData.lineItems)) {
          finalFilteredData.lineItems = finalFilteredData.lineItems.map((item: any) => {
            return Object.fromEntries(
              Object.entries(item).filter(([_, value]) => value !== undefined)
            );
          });
        }
        
        // Use the final cleaned data
        Object.assign(filteredData, finalFilteredData);
      }

      try {
        const docRef = await addDoc(collection(db, SERVICE_REQUESTS_COLLECTION), filteredData);
        
        // Verify the document was actually saved
        const savedDoc = await getDoc(docRef);
        if (!savedDoc.exists()) {
          throw new Error('Document was not saved to Firestore');
        }
        
        return docRef.id;
      } catch (firestoreError: any) {
        console.error('Firestore addDoc error:', firestoreError);
        console.error('Error code:', firestoreError.code);
        console.error('Error message:', firestoreError.message);
        throw firestoreError;
      }
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

      // Replace File objects with URLs before creating Firestore data
      const processedFormData = fileUrlMap.size > 0
        ? replaceFilesWithUrls(serviceRequest.formData, fileUrlMap)
        : removeFileObjects(serviceRequest.formData);
      
      // Process customProjectDetails - remove any File objects (images are stored in formData.images only)
      let processedCustomProjectDetails = serviceRequest.customProjectDetails
        ? (fileUrlMap.size > 0
            ? replaceFilesWithUrls(serviceRequest.customProjectDetails, fileUrlMap)
            : removeFileObjects(serviceRequest.customProjectDetails))
        : undefined;
      
      // Remove images from customProjectDetails since they're already in formData.images
      // This prevents duplication in Firestore
      if (processedCustomProjectDetails && processedCustomProjectDetails.images) {
        delete processedCustomProjectDetails.images;
      }

      // Remove File objects and filter out undefined values for Firestore
      const firestoreData: any = {
        serviceId: serviceRequest.serviceId,
        serviceName: serviceRequest.serviceName,
        serviceType: serviceRequest.serviceType,
        customerInfo: serviceRequest.customerInfo,
        formData: processedFormData,
        status: serviceRequest.status,
        createdAt: Timestamp.fromDate(new Date(serviceRequest.createdAt.getTime())),
        updatedAt: Timestamp.fromDate(new Date(serviceRequest.updatedAt.getTime())),
        source: serviceRequest.source,
        priority: serviceRequest.priority,
        type: 'single-service'
      };

      // Only add estimate if it exists
      if (serviceRequest.estimate) {
        firestoreData.estimate = serviceRequest.estimate;
      }

      // Only add customProjectDetails if it exists (with uploaded image URLs)
      if (processedCustomProjectDetails) {
        firestoreData.customProjectDetails = processedCustomProjectDetails;
      }

      // Only add scheduledDate if it exists
      if (submission.customProjectDetails?.timeline) {
        firestoreData.scheduledDate = Timestamp.fromDate(new Date(submission.customProjectDetails.timeline));
      }

      // Final cleanup to remove any undefined values
      const cleanedFirestoreData = Object.fromEntries(
        Object.entries(firestoreData).filter(([_, value]) => value !== undefined)
      );

      const docRef = await addDoc(collection(db, SERVICE_REQUESTS_COLLECTION), cleanedFirestoreData);
      console.log('Service request submitted successfully:', docRef.id);
      
      // Images are already uploaded with the tempRequestId in the path
      // They're organized in: service-requests/{tempRequestId}/image-{index}-{timestamp}-{filename}
      // You can optionally move them to the final requestId path if needed
      
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
      // Handle estimate updates
      if (additionalData.estimate) {
        updateData.estimate = additionalData.estimate;
      }
      
      // Handle other fields
      Object.keys(additionalData).forEach(key => {
        if (key !== 'estimate' && key !== 'id') {
          updateData[key] = additionalData[key as keyof ServiceRequest];
        }
      });
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
      
      // Helper function to safely convert Firestore timestamps
      const safeToDate = (timestamp: any): Date | null => {
        if (!timestamp) return null;
        
        // Check if it has seconds and nanoseconds (Firestore Timestamp structure from Firestore)
        // This is the actual format when reading from Firestore - check this FIRST
        if (timestamp.seconds !== undefined) {
          const seconds = typeof timestamp.seconds === 'number' ? timestamp.seconds : parseInt(String(timestamp.seconds));
          const nanoseconds = timestamp.nanoseconds || 0;
          const nanosecondsNum = typeof nanoseconds === 'number' ? nanoseconds : parseInt(String(nanoseconds));
          // Convert seconds to milliseconds and nanoseconds to milliseconds, then add
          return new Date(seconds * 1000 + nanosecondsNum / 1000000);
        }
        
        // Check if it's a Firestore Timestamp instance
        if (timestamp instanceof Timestamp) {
          return timestamp.toDate();
        }
        
        // Check if it has a toDate method (Firestore Timestamp)
        if (timestamp.toDate && typeof timestamp.toDate === 'function') {
          return timestamp.toDate();
        }
        
        // Check if it's already a Date object
        if (timestamp instanceof Date) {
          return new Date(timestamp.getTime());
        }
        
        // Check if it's a string that can be parsed
        if (typeof timestamp === 'string') {
          return new Date(timestamp);
        }
        
        return null;
      };
      
      // Handle scheduledDate which can be an object with earliestStart/latestFinish or a single date
      let processedScheduledDate: Date | undefined;
      if (data.scheduledDate) {
        if (data.scheduledDate.earliestStart && data.scheduledDate.latestFinish) {
          // It's a date range object - we'll keep it as is for now, but convert the timestamps
          // For now, just use earliestStart as the scheduledDate
          processedScheduledDate = safeToDate(data.scheduledDate.earliestStart) || undefined;
        } else {
          processedScheduledDate = safeToDate(data.scheduledDate) || undefined;
        }
      }
      
      const createdAtDate = safeToDate(data.createdAt);
      const updatedAtDate = safeToDate(data.updatedAt);
      const completionDateDate = safeToDate(data.completionDate);
      
      // Create a new object without the timestamp fields to avoid overwriting
      const { createdAt: _, updatedAt: __, scheduledDate: ___, completionDate: ____, ...restData } = data;
      
      return {
        id: docSnap.id,
        ...restData,
        createdAt: createdAtDate || new Date(),
        updatedAt: updatedAtDate || new Date(),
        scheduledDate: processedScheduledDate,
        completionDate: completionDateDate || undefined,
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
      
      // Helper function to safely convert Firestore timestamps
      const safeToDate = (timestamp: any): Date | null => {
        if (!timestamp) return null;
        
        // Check if it has seconds and nanoseconds (Firestore Timestamp structure from Firestore)
        // This is the actual format when reading from Firestore - check this FIRST
        if (timestamp.seconds !== undefined) {
          const seconds = typeof timestamp.seconds === 'number' ? timestamp.seconds : parseInt(String(timestamp.seconds));
          const nanoseconds = timestamp.nanoseconds || 0;
          const nanosecondsNum = typeof nanoseconds === 'number' ? nanoseconds : parseInt(String(nanoseconds));
          // Convert seconds to milliseconds and nanoseconds to milliseconds, then add
          return new Date(seconds * 1000 + nanosecondsNum / 1000000);
        }
        
        // Check if it's a Firestore Timestamp instance
        if (timestamp instanceof Timestamp) {
          return timestamp.toDate();
        }
        
        // Check if it has a toDate method (Firestore Timestamp)
        if (timestamp.toDate && typeof timestamp.toDate === 'function') {
          return timestamp.toDate();
        }
        
        // Check if it's already a Date object
        if (timestamp instanceof Date) {
          return new Date(timestamp.getTime());
        }
        
        // Check if it's a string that can be parsed
        if (typeof timestamp === 'string') {
          return new Date(timestamp);
        }
        
        return null;
      };
      
      // Handle scheduledDate which can be an object with earliestStart/latestFinish or a single date
      let processedScheduledDate: Date | undefined;
      if (data.scheduledDate) {
        if (data.scheduledDate.earliestStart && data.scheduledDate.latestFinish) {
          // It's a date range object - we'll keep it as is for now, but convert the timestamps
          // For now, just use earliestStart as the scheduledDate
          processedScheduledDate = safeToDate(data.scheduledDate.earliestStart) || undefined;
        } else {
          processedScheduledDate = safeToDate(data.scheduledDate) || undefined;
        }
      }
      
      const createdAtDate = safeToDate(data.createdAt);
      const updatedAtDate = safeToDate(data.updatedAt);
      const completionDateDate = safeToDate(data.completionDate);
      
      // Create a new object without the timestamp fields to avoid overwriting
      const { createdAt: _, updatedAt: __, scheduledDate: ___, completionDate: ____, ...restData } = data;
      
      requests.push({
        id: doc.id,
        ...restData,
        createdAt: createdAtDate || new Date(),
        updatedAt: updatedAtDate || new Date(),
        scheduledDate: processedScheduledDate,
        completionDate: completionDateDate || undefined,
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
    'garage-door': 'Garage Door',
    'interior-door': 'Interior Door',
    'basement-painting': 'Basement Painting',
    'kitchen-walls': 'Kitchen Walls',
    'staircase-painting': 'Staircase Painting',
    'fence-painting': 'Fence Painting',
    'exterior-railings': 'Exterior Railings',
    'stairway-painting': 'Stairway Painting',
    'hallway-painting': 'Hallway Painting',
    'drywall-repair': 'Drywall Repair',
    'custom-project': 'Custom Project',
  };
  return serviceNames[serviceId] || 'Unknown Service';
};

const getServiceType = (serviceId: string): 'flat-rate' | 'calculated' | 'custom-quote' => {
  const serviceTypes: Record<string, 'flat-rate' | 'calculated' | 'custom-quote'> = {
    'bedroom-painting': 'calculated',
    'small-bathroom': 'calculated',
    'accent-wall': 'calculated',
    'garage-door': 'calculated',
    'interior-door': 'flat-rate',
    'basement-painting': 'calculated',
    'kitchen-walls': 'calculated',
    'staircase-painting': 'calculated',
    'fence-painting': 'calculated',
    'exterior-railings': 'calculated',
    'stairway-painting': 'calculated',
    'hallway-painting': 'calculated',
    'drywall-repair': 'calculated',
    'custom-project': 'custom-quote',
  };
  return serviceTypes[serviceId] || 'custom-quote';
};

const determinePriority = (submission: ServiceRequestSubmission): 'low' | 'medium' | 'high' => {
  // Determine priority based on service type and estimate
  if (submission.serviceId === 'custom-project') {
    return 'high'; // Custom Project are typically high priority
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
