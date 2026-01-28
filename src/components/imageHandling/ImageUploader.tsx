import React, { useRef, useState } from "react";
import ImageCropper from "./ImageCropper";
import Image from "next/image";
import { getCurrentUserIdToken } from "@/firebase/auth";

interface ProfilePictureUploaderProps {
  initialImageUrl?: string;
  onImageChange?: (imageDataUrl: string) => void;
}

export default function ImageUploader({
  initialImageUrl,
  onImageChange,
}: ProfilePictureUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false); // Todo: Add loading screen
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
        setCropImage(result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadCroppedImage = async (croppedDataUrl: string) => {
    setUploading(true);
    try {
      const token = await getCurrentUserIdToken();
      const res = await fetch("/api/profiles/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ base64: croppedDataUrl }),
      });
      if (!res.ok) throw new Error("Failed to upload iamge");
      const data = await res.json();
      const urls = data?.profile_picture_url;
      if (urls && urls.length > 0) {
        setSelectedImage(urls[urls.length - 1]);
        if (onImageChange) onImageChange(urls[urls.length - 1]);
      }
    } catch {
    } finally {
      setUploading(false);
    }
  };

  const handleCropperDone = async (croppedDataUrl: string) => {
    setShowCropper(false);
    setCropImage(null);
    await uploadCroppedImage(croppedDataUrl);
  };

  return (
    <div className="relative mt-4 flex flex-col items-center">
      <Image
        src={
          selectedImage
            ? selectedImage
            : initialImageUrl
              ? initialImageUrl
              : "/peechi_duo.webp"
        }
        alt="Profile"
        className="w-30 h-30 rounded-xl object-cover shadow-md bg-gray-300 cursor-pointer"
        width={1000}
        height={1000}
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
    </div>
  );
}
