import React, { useRef, useState } from "react";
import Image from "next/image";
import ImageCropper from "./ImageCropper";
import ImageUploader from "./ImageUploader";

interface ImageDisplayProps {
  imageUrl: string;
  onImageChange?: (newImageUrl: string) => void;
  onDelete?: () => void;
}

export default function ImageDisplay({
  imageUrl,
  onImageChange,
  onDelete,
}: ImageDisplayProps) {
  const [showCropper, setShowCropper] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploaderRef = useRef<{
    uploadImage: (base64: string) => Promise<void>;
  }>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropperDone = async (croppedDataUrl: string) => {
    setShowCropper(false);
    setCropImage(null);
    if (uploaderRef.current) {
      await uploaderRef.current.uploadImage(croppedDataUrl);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    try {
      await onDelete();
    } catch (err) {
      console.error("Failed to delete image", err);
    }
  };

  return (
    <div className="relative group">
      <Image
        src={imageUrl}
        alt="Profile"
        width={1000}
        height={1000}
        className="w-28 h-28 rounded-xl object-cover bg-gray-300 cursor-pointer"
        draggable="false"
        onClick={handleImageClick}
        title="Click to update this image"
      />
      {onDelete && (
        <button
          type="button"
          onClick={handleDelete}
          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
          title="Delete image"
        >
          X
        </button>
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {showCropper && cropImage && (
        <ImageCropper
          image={cropImage}
          onCropDone={handleCropperDone}
          onCancel={() => {
            setShowCropper(false);
            setCropImage(null);
          }}
        />
      )}
      <ImageUploader
        ref={uploaderRef}
        onImageChange={(newUrl) => {
          if (onImageChange) onImageChange(newUrl);
        }}
      />
    </div>
  );
}
