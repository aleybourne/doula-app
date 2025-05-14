
import React, { useState } from "react";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  selectedImage: string;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUpload = ({ selectedImage, onImageUpload }: ImageUploadProps) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
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
          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
        >
          <Upload className="w-6 h-6 text-white" />
        </label>
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};
