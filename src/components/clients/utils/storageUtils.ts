
// Maximum localStorage size in bytes (typically 5MB)
const MAX_LOCAL_STORAGE_SIZE = 5 * 1024 * 1024;

// Check if a string is a base64 image
export const isBase64Image = (str: string): boolean => {
  return str.startsWith('data:image');
};

// Clean up base64 images in existing client data
export const cleanupClientImageData = (clientsData: any[]): any[] => {
  return clientsData.map(client => {
    if (isBase64Image(client.image)) {
      console.log(`Converting base64 image for ${client.name} to URL pattern`);
      const newImageUrl = `/lovable-uploads/client-${Date.now()}-${Math.floor(Math.random() * 1000)}.png`;
      return {
        ...client,
        image: newImageUrl
      };
    }
    return client;
  });
};

// Get the size of data in bytes
export const getDataSize = (data: any): number => {
  const jsonString = JSON.stringify(data);
  return jsonString.length * 2;
};

// Check if there's enough space in localStorage
export const hasEnoughStorageSpace = (dataToStore: string): boolean => {
  try {
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += key.length * 2 + value.length * 2;
        }
      }
    }
    
    const newDataSize = dataToStore.length * 2;
    const hasSpace = (totalSize + newDataSize) < MAX_LOCAL_STORAGE_SIZE;
    
    if (!hasSpace) {
      console.warn(`Not enough localStorage space. Current usage: ${totalSize / 1024}KB, New data: ${newDataSize / 1024}KB, Max: ${MAX_LOCAL_STORAGE_SIZE / 1024}KB`);
    }
    
    return hasSpace;
  } catch (error) {
    console.error("Error checking storage space:", error);
    return false;
  }
};
