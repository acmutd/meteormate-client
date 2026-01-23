import React, { useRef, useState } from "react";

interface ProfilePictureUploaderProps {
  initialImageUrl?: string;
  onImageChange?: (imageDataUrl: string) => void;
}

export default function ProfilePictureUploader({
  initialImageUrl,
  onImageChange,
}: ProfilePictureUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedImage(result);
        if (onImageChange) onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative mt-4 flex flex-col items-center">
      <img
        src={
          selectedImage
            ? selectedImage
            : initialImageUrl
              ? initialImageUrl
              : "/images/peechi_duo.webp"
        }
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover shadow-md bg-gray-300 cursor-pointer"
        draggable="false"
        onClick={handleImageClick}
        title="Click to upload a new profile picture"
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
    </div>
  );
}
