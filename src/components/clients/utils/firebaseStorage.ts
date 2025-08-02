
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from '../../../config/firebase';
import { v4 as uuidv4 } from 'uuid';
import { categorizeFirebaseError, createError, ErrorCodes } from '@/components/error/ErrorHandling';

const storage = getStorage(app);

export interface ImageUploadResult {
  url: string;
  path: string;
}

/**
 * Upload an image file to Firebase Storage with enhanced error handling
 */
export const uploadClientImage = async (file: File, clientId?: string): Promise<ImageUploadResult> => {
  try {
    // Validate the file first
    const validationError = validateImageFile(file);
    if (validationError) {
      throw createError(ErrorCodes.INVALID_FILE_TYPE, validationError);
    }

    // Generate a unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${clientId || uuidv4()}-${Date.now()}.${fileExtension}`;
    const filePath = `client-images/${fileName}`;
    
    // Create a reference to the file location
    const storageRef = ref(storage, filePath);
    
    console.log(`Uploading image to Firebase Storage: ${filePath}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log(`Successfully uploaded image. Download URL: ${downloadURL}`);
    
    return {
      url: downloadURL,
      path: filePath
    };
  } catch (error) {
    console.error('Error uploading image to Firebase Storage:', error);
    if (error.code) {
      throw categorizeFirebaseError(error);
    }
    throw createError(ErrorCodes.FIREBASE_ERROR, error);
  }
};

/**
 * Delete an image from Firebase Storage
 */
export const deleteClientImage = async (imagePath: string): Promise<void> => {
  try {
    // Don't delete placeholder or default images
    if (imagePath.includes('placeholder') || imagePath.includes('lovable-uploads')) {
      console.log('Skipping deletion of default/placeholder image');
      return;
    }
    
    const storageRef = ref(storage, imagePath);
    await deleteObject(storageRef);
    
    console.log(`Successfully deleted image: ${imagePath}`);
  } catch (error) {
    console.error('Error deleting image from Firebase Storage:', error);
    // Don't throw error for deletion failures - it's not critical
  }
};

/**
 * Get a download URL for an existing image path
 */
export const getImageDownloadURL = async (imagePath: string): Promise<string> => {
  try {
    const storageRef = ref(storage, imagePath);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error getting download URL:', error);
    return '/placeholder.svg'; // Return placeholder on error
  }
};

/**
 * Validate image file before upload
 */
export const validateImageFile = (file: File): string | null => {
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return 'Image file size must be less than 5MB';
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return 'Only JPEG, PNG, and WebP images are allowed';
  }
  
  return null; // No validation errors
};

export interface DocumentUploadResult {
  url: string;
  path: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

/**
 * Upload a document file to Firebase Storage
 */
export const uploadClientDocument = async (
  file: File, 
  clientId: string, 
  folder: string
): Promise<DocumentUploadResult> => {
  try {
    // Generate a unique filename
    const fileExtension = file.name.split('.').pop() || 'pdf';
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `documents/${clientId}/${folder}/${fileName}`;
    
    // Create a reference to the file location
    const storageRef = ref(storage, filePath);
    
    console.log(`Uploading document to Firebase Storage: ${filePath}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log(`Successfully uploaded document. Download URL: ${downloadURL}`);
    
    return {
      url: downloadURL,
      path: filePath,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    };
  } catch (error) {
    console.error('Error uploading document to Firebase Storage:', error);
    throw new Error(`Failed to upload document: ${error.message}`);
  }
};

/**
 * Delete a document from Firebase Storage
 */
export const deleteClientDocument = async (documentPath: string): Promise<void> => {
  try {
    const storageRef = ref(storage, documentPath);
    await deleteObject(storageRef);
    
    console.log(`Successfully deleted document: ${documentPath}`);
  } catch (error) {
    console.error('Error deleting document from Firebase Storage:', error);
    throw new Error(`Failed to delete document: ${error.message}`);
  }
};

/**
 * Validate document file before upload
 */
export const validateDocumentFile = (file: File): string | null => {
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return 'Document file size must be less than 10MB';
  }
  
  // Check file type
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg', 
    'image/png'
  ];
  if (!allowedTypes.includes(file.type)) {
    return 'Only PDF, DOC, DOCX, JPG, and PNG files are allowed';
  }
  
  return null; // No validation errors
};
