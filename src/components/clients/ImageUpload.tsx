
import React, { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { uploadClientImage, validateImageFile } from "./utils/firebaseStorage";
import { toast } from "@/hooks/use-toast";
import { SafeImage } from "@/components/ui/SafeImage";
import { ImageErrorBoundary } from "@/components/ui/ImageErrorBoundary";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useOfflineQueue } from "@/hooks/useOfflineQueue";
import { useRetryableOperation } from "@/hooks/useRetryableOperation";
import { ErrorDisplay, showErrorToast, createError, ErrorCodes } from "@/components/error/ErrorHandling";

interface ImageUploadProps {
  selectedImage: string;
  onImageUpload: (imageUrl: string) => void;
  clientId?: string;
}

export const ImageUpload = ({ selectedImage, onImageUpload, clientId }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const { isOnline } = useNetworkStatus();
  const { addToQueue } = useOfflineQueue();
  
  const uploadOperation = useRetryableOperation(
    async () => {
      if (!currentFile) throw new Error('No file selected');
      return await uploadClientImage(currentFile, clientId);
    },
    {
      maxRetries: 3,
      baseDelay: 2000,
      retryCondition: (error, attempt) => {
        // Don't retry validation errors
        if (error.code === ErrorCodes.INVALID_FILE_TYPE || error.code === ErrorCodes.FILE_TOO_LARGE) {
          return false;
        }
        return attempt < 3;
      }
    }
  );

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate the file first
    const validationError = validateImageFile(file);
    if (validationError) {
      const error = createError(ErrorCodes.INVALID_FILE_TYPE, validationError);
      showErrorToast(error);
      return;
    }

    setCurrentFile(file);
    setIsUploading(true);

    try {
      let result;
      
      if (isOnline) {
        // Try upload immediately if online
        console.log("Uploading image to Firebase Storage...");
        result = await uploadOperation.execute();
      } else {
        // Queue for later if offline
        console.log("Queueing image upload for when online...");
        result = await addToQueue(
          () => uploadClientImage(file, clientId),
          {
            description: `Upload image for ${clientId || 'client'}`,
            priority: 1,
            maxRetries: 3,
          }
        );
      }
      
      console.log("Upload successful, new image URL:", result.url);
      
      // Call the callback with the Firebase Storage URL
      onImageUpload(result.url);
      
      // Force a small delay to ensure state propagates
      setTimeout(() => {
        console.log("Image upload callback completed, data should refresh");
      }, 100);
      
      toast({
        title: "Success",
        description: isOnline ? "Image uploaded successfully!" : "Image queued for upload when online",
      });
      
    } catch (error) {
      console.error("Error uploading image:", error);
      showErrorToast(error, () => {
        if (currentFile) {
          const newEvent = { target: { files: [currentFile] } } as any;
          handleFileUpload(newEvent);
        }
      });
    } finally {
      setIsUploading(false);
      setCurrentFile(null);
      // Reset the input so the same file can be uploaded again if needed
      event.target.value = '';
    }
  };

  return (
    <div className="flex justify-center mb-6">
      <div className="relative group cursor-pointer">
        <ImageErrorBoundary>
          <SafeImage
            src={selectedImage || "/placeholder.svg"}
            alt="Client avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-[#F499B7]"
            fallbackSrc="/placeholder.svg"
            placeholderSrc="/placeholder.svg"
            showRetryButton={false}
            showNetworkStatus={false}
            maxRetries={2}
          />
        </ImageErrorBoundary>
        <label
          htmlFor="avatar-upload"
          className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity ${
            isUploading ? 'opacity-100' : ''
          } ${!isOnline ? 'cursor-not-allowed' : ''}`}
        >
          {isUploading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Upload className={`w-6 h-6 text-white ${!isOnline ? 'opacity-50' : ''}`} />
          )}
        </label>
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          disabled={isUploading || !isOnline}
        />
        {!isOnline && (
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-destructive whitespace-nowrap">
            Offline
          </div>
        )}
      </div>
    </div>
  );
};
