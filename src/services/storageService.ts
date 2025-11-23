import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Upload a single image file to Firebase Storage
 * @param file - The File object to upload
 * @param requestId - The service request ID (optional, for organizing uploads)
 * @param index - Index of the image (for naming)
 * @returns Promise<string> - The download URL of the uploaded image
 */
export const uploadImage = async (
  file: File,
  requestId?: string,
  index: number = 0
): Promise<string> => {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const fileName = requestId 
      ? `service-requests/${requestId}/image-${index}-${timestamp}-${file.name}`
      : `service-requests/temp/image-${index}-${timestamp}-${file.name}`;
    
    // Create a reference to the file location
    const storageRef = ref(storage, fileName);
    
    // Upload the file
    const uploadResult = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(uploadResult.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error(`Failed to upload image: ${file.name}`);
  }
};

/**
 * Upload multiple images to Firebase Storage
 * @param files - Array of File objects to upload
 * @param requestId - The service request ID (optional, for organizing uploads)
 * @returns Promise<string[]> - Array of download URLs
 */
export const uploadImages = async (
  files: File[],
  requestId?: string
): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file, index) => 
      uploadImage(file, requestId, index)
    );
    
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw new Error('Failed to upload images');
  }
};

/**
 * Recursively find and extract File objects from data structure
 * @param data - The data structure to search
 * @returns Array of unique File objects found
 */
export const extractFileObjects = (data: any, seenFiles: Set<File> = new Set()): File[] => {
  const files: File[] = [];
  
  if (!data || data === null || data === undefined) {
    return files;
  }
  
  // If it's a File object, add it to the array if we haven't seen it before
  if (data instanceof File) {
    if (!seenFiles.has(data)) {
      seenFiles.add(data);
      files.push(data);
    }
    return files;
  }
  
  // If it's an array, recursively process each item
  if (Array.isArray(data)) {
    data.forEach(item => {
      const extracted = extractFileObjects(item, seenFiles);
      files.push(...extracted);
    });
  }
  
  // If it's an object, recursively process each property
  if (typeof data === 'object') {
    Object.values(data).forEach(value => {
      const extracted = extractFileObjects(value, seenFiles);
      files.push(...extracted);
    });
  }
  
  return files;
};

/**
 * Replace File objects in data structure with their uploaded URLs
 * @param data - The data structure containing File objects
 * @param fileUrlMap - Map of File objects to their URLs
 * @returns The data structure with File objects replaced by URLs
 */
export const replaceFilesWithUrls = (data: any, fileUrlMap: Map<File, string>): any => {
  if (!data || data === null || data === undefined) {
    return data;
  }
  
  // If it's a File object, replace with URL
  if (data instanceof File) {
    return fileUrlMap.get(data) || null;
  }
  
  // If it's an array, recursively process each item
  if (Array.isArray(data)) {
    return data
      .map(item => replaceFilesWithUrls(item, fileUrlMap))
      .filter(item => item !== null && item !== undefined);
  }
  
  // If it's an object, recursively process each property
  if (typeof data === 'object') {
    const replaced: any = {};
    for (const [key, value] of Object.entries(data)) {
      const replacedValue = replaceFilesWithUrls(value, fileUrlMap);
      if (replacedValue !== null && replacedValue !== undefined) {
        replaced[key] = replacedValue;
      }
    }
    return replaced;
  }
  
  // For primitive values, return as-is
  return data;
};

