
import React, { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { uploadClientImage, validateImageFile } from "./utils/firebaseStorage";
import { toast } from "@/hooks/use-toast";
import { SafeImage } from "@/components/ui/SafeImage";
import { ImageErrorBoundary } from "@/components/ui/ImageErrorBoundary";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

interface ImageUploadProps {
  selectedImage: string;
  onImageUpload: (imageUrl: string) => void;
  clientId?: string;
}

export const ImageUpload = ({ selectedImage, onImageUpload, clientId }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { isOnline } = useNetworkStatus();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check network connectivity
    if (!isOnline) {
      toast({
        title: "No Internet Connection",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
      return;
    }

    // Validate the file
    const validationError = validateImageFile(file);
    if (validationError) {
      toast({
        title: "Invalid File",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      console.log("Uploading image to Firebase Storage...");
      const result = await uploadClientImage(file, clientId);
      console.log("Upload successful, new image URL:", result.url);
      
      // Call the callback with the Firebase Storage URL
      onImageUpload(result.url);
      
      // Force a small delay to ensure state propagates
      setTimeout(() => {
        console.log("Image upload callback completed, data should refresh");
      }, 100);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });
      
    } catch (error) {
      console.error("Error uploading image:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: "Upload Failed",
        description: !isOnline ? "Connection lost during upload. Please try again." : `Failed to upload image: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
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
