import React, { useRef, useState } from "react";
import ImageCropper, { getCroppedImg } from "./ImageCropper";
import { Area } from "react-easy-crop";
import Image from "next/image";
import { getCurrentUserIdToken } from "@/firebase/auth";

interface ProfilePictureUploaderProps {
  initialImageUrl?: string;
  onImageChange?: (imageDataUrl: string) => void;
}

export default function ProfilePictureUploader({
  initialImageUrl,
  onImageChange,
}: ProfilePictureUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [zoom, setZoom] = useState(1);
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

  const handleCropComplete = (_croppedArea: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const uploadCroppedImage = async (croppedDataUrl: string) => {
    setUploading(true);
    try {
      const token = await getCurrentUserIdToken();
      const res = await fetch("http://127.0.0.1:3000/api/profiles/upload", {
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

  const handleCropConfirm = async () => {
    if (!cropImage || !croppedAreaPixels) return;
    try {
      const croppedDataUrl = await getCroppedImg(cropImage, croppedAreaPixels);
      setShowCropper(false);
      setCropImage(null);
      setCroppedAreaPixels(null);
      await uploadCroppedImage(croppedDataUrl);
    } catch {
      setShowCropper(false);
      setCropImage(null);
      setCroppedAreaPixels(null);
    }
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
        <>
          <div
            className="fixed inset-0 z-40 bg-black"
            style={{ opacity: 0.5 }}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center w-87 max-w-full">
              <div className="relative w-75 h-75 bg-gray-100 rounded overflow-hidden">
                <ImageCropper
                  image={cropImage}
                  onCropComplete={handleCropComplete}
                  zoom={zoom}
                  setZoom={setZoom}
                />
              </div>
              <div className="w-full flex flex-col items-center mt-2">
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-3/4 mt-2"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={handleCropConfirm}
                >
                  Crop
                </button>
                <button
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  onClick={() => {
                    setShowCropper(false);
                    setCropImage(null);
                    setCroppedAreaPixels(null);
                    setZoom(1);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
