import React, { useRef, useState } from "react";
import Image from "next/image";
import ImageCropper from "./ImageCropper";
import ImageUploader from "./ImageUploader";
import ImageDelete from "./ImageDelete";

interface ImageDisplayProps {
  imageUrl: string;
  onImageChange?: (newImageUrl: string) => void;
  deleteIndex?: number;
  onDeleted?: () => void;
  variant?: "image" | "placeholder";
}

export default function ImageDisplay({
    imageUrl,
    onImageChange,
    deleteIndex,
    onDeleted,
    variant = "image",
}: ImageDisplayProps) {
    const [showCropper, setShowCropper] = useState(false);
    const [cropImage, setCropImage] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
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
            e.currentTarget.value = "";
        }
    };

    const handleCropperDone = async (croppedDataUrl: string) => {
        setShowCropper(false);
        setCropImage(null);
        setUploadError(null);
        try {
            if (uploaderRef.current) {
                await uploaderRef.current.uploadImage(croppedDataUrl);
            }
        } catch (e) {
            setUploadError(e instanceof Error ? e.message : "Upload failed. Please try again.");
        }
    };

    return (
        <div className="relative group">
            {/* Credit to Nathan Sujatno for creating the "Upload your photo" place holder */}
            {variant === "placeholder" ? (
                <button
                    onClick={handleImageClick}
                    className="bg-[#F6F3ED] w-32 h-32 rounded-xl border-2 border-dashed border-black cursor-pointer overflow-hidden flex flex-col items-center justify-center hover:opacity-80"
                    title="Upload photo"
                >
                    <Image
                        src="/upload_photo_picture.svg"
                        alt="Upload Photo"
                        width={128}
                        height={128}
                        className="size-12 mb-3"
                    />
                    <span className="text-black text-[10px] text-center leading-tight">
            Upload your<br />photo
                    </span>
                </button>
            ) : (
                <>
                    <Image
                        src={imageUrl}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="w-32 h-32 rounded-xl object-cover bg-gray-300 cursor-pointer"
                        draggable="false"
                        onClick={handleImageClick}
                        title="Click to update this image"
                    />
                    {typeof deleteIndex === "number" && (
                        <ImageDelete index={deleteIndex} onDeleted={onDeleted} />
                    )}
                </>
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
            {uploadError && (
                <p className="mt-2 text-xs text-red-600">
                    {uploadError}
                </p>
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
