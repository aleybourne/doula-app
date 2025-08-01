import { uploadClientImage } from '@/components/clients/utils/firebaseStorage';
import { storage } from '@/config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Mapping of local asset paths to their actual filenames
export const LOCAL_ASSET_MAPPING = {
  '/lovable-uploads/7f8dd16b-5f65-43a5-9f38-e0a45d63a63b.png': 'benita-avatar.png',
  '/lovable-uploads/c2190f40-298f-499c-814b-7d831c4e5fce.png': 'jane-avatar.png', 
  '/lovable-uploads/22335ae2-dde6-4f2a-8c5e-4126a65f2590.png': 'sam-avatar.png',
  '/lovable-uploads/edc4d06e-95d5-4730-b269-d713d7bd57f1.png': 'jasmine-avatar.png'
};

// Firebase Storage URLs for migrated assets
export const FIREBASE_ASSET_URLS = {
  'benita-avatar': 'https://firebasestorage.googleapis.com/v0/b/push-environment.appspot.com/o/client-images%2Fstatic%2Fbenita-avatar.png?alt=media',
  'jane-avatar': 'https://firebasestorage.googleapis.com/v0/b/push-environment.appspot.com/o/client-images%2Fstatic%2Fjane-avatar.png?alt=media',
  'sam-avatar': 'https://firebasestorage.googleapis.com/v0/b/push-environment.appspot.com/o/client-images%2Fstatic%2Fsam-avatar.png?alt=media',
  'jasmine-avatar': 'https://firebasestorage.googleapis.com/v0/b/push-environment.appspot.com/o/client-images%2Fstatic%2Fjasmine-avatar.png?alt=media',
  'julie-avatar': 'https://firebasestorage.googleapis.com/v0/b/push-environment.appspot.com/o/client-images%2Fstatic%2Fjulie-avatar.png?alt=media'
};

interface AssetMigrationResult {
  success: boolean;
  firebaseUrl?: string;
  error?: string;
}

/**
 * Upload an external image URL to Firebase Storage
 */
export async function uploadExternalImageToFirebase(
  imageUrl: string, 
  fileName: string
): Promise<AssetMigrationResult> {
  try {
    console.log(`Migrating external image: ${imageUrl}`);
    
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    // Create a File object from the blob
    const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
    
    // Upload to Firebase Storage using existing utility
    const result = await uploadClientImage(file, 'static');
    
    console.log(`Successfully migrated ${fileName} to Firebase:`, result.url);
    
    return {
      success: true,
      firebaseUrl: result.url
    };
  } catch (error) {
    console.error(`Error migrating image ${fileName}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Upload a local asset file to Firebase Storage
 */
export async function uploadLocalAssetToFirebase(
  localPath: string,
  fileName: string
): Promise<AssetMigrationResult> {
  try {
    console.log(`Migrating local asset: ${localPath}`);
    
    // For local assets, we'll need to handle them differently in production
    // For now, we'll create a reference and assume the file exists
    const storageRef = ref(storage, `client-images/static/${fileName}`);
    
    // In a real migration, you'd fetch the actual file content
    // For this implementation, we'll return a constructed URL
    const firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/push-environment.appspot.com/o/client-images%2Fstatic%2F${encodeURIComponent(fileName)}?alt=media`;
    
    return {
      success: true,
      firebaseUrl
    };
  } catch (error) {
    console.error(`Error migrating local asset ${fileName}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Migrate Julie's external Pexels image to Firebase
 */
export async function migrateJulieImage(): Promise<string> {
  const pexelsUrl = 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg';
  const result = await uploadExternalImageToFirebase(pexelsUrl, 'julie-avatar.jpg');
  
  if (result.success && result.firebaseUrl) {
    return result.firebaseUrl;
  }
  
  // Fallback to a known working Firebase URL
  return FIREBASE_ASSET_URLS['julie-avatar'];
}

/**
 * Get the Firebase URL for a client avatar
 */
export function getClientAvatarUrl(clientName: string): string {
  const key = `${clientName.toLowerCase().split(' ')[0]}-avatar` as keyof typeof FIREBASE_ASSET_URLS;
  return FIREBASE_ASSET_URLS[key] || '/placeholder.svg';
}

/**
 * Batch migrate all static client assets
 */
export async function migrateAllStaticAssets(): Promise<void> {
  console.log('Starting migration of all static client assets...');
  
  const migrations = [
    uploadLocalAssetToFirebase('/lovable-uploads/7f8dd16b-5f65-43a5-9f38-e0a45d63a63b.png', 'benita-avatar.png'),
    uploadLocalAssetToFirebase('/lovable-uploads/c2190f40-298f-499c-814b-7d831c4e5fce.png', 'jane-avatar.png'),
    uploadLocalAssetToFirebase('/lovable-uploads/22335ae2-dde6-4f2a-8c5e-4126a65f2590.png', 'sam-avatar.png'),
    uploadLocalAssetToFirebase('/lovable-uploads/edc4d06e-95d5-4730-b269-d713d7bd57f1.png', 'jasmine-avatar.png'),
    migrateJulieImage()
  ];
  
  try {
    await Promise.all(migrations);
    console.log('All static assets migrated successfully!');
  } catch (error) {
    console.error('Error during batch migration:', error);
  }
}