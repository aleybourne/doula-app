
import React, { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { uploadClientImage, validateImageFile } from "./utils/firebaseStorage";
import { toast } from "@/hooks/use-toast";

interface ImageUploadProps {
  selectedImage: string;
  onImageUpload: (imageUrl: string) => void;
  clientId?: string;
}

export const ImageUpload = ({ selectedImage, onImageUpload, clientId }: ImageUploadProps) => {
  const [imageError, setImageError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
      
      // Call the callback with the Firebase Storage URL
      onImageUpload(result.url);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });
      
      setImageError(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
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
        <img
          src={imageError || !selectedImage ? "/placeholder.svg" : selectedImage}
          alt="Client avatar"
          onError={handleImageError}
          className="w-24 h-24 rounded-full object-cover border-2 border-[#F499B7]"
        />
        <label
          htmlFor="avatar-upload"
          className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity ${
            isUploading ? 'opacity-100' : ''
          }`}
        >
          {isUploading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Upload className="w-6 h-6 text-white" />
          )}
        </label>
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          disabled={isUploading}
        />
      </div>
    </div>
  );
};
