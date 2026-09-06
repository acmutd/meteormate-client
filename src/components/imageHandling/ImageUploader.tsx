import { forwardRef, useImperativeHandle, useCallback } from "react";
import { compressImage, uploadImages } from "@/utils/profile_pictures";

export interface ImageUploaderHandle {
  uploadImage: (base64: string) => Promise<void>;
}

interface ImageUploaderProps {
  onImageChange?: (imageUrl: string) => void | Promise<void>;
}

function readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read compressed image"));
        reader.readAsDataURL(file);
    });
}

const ImageUploader = forwardRef<ImageUploaderHandle, ImageUploaderProps>(
    ({ onImageChange }, ref) => {
        const uploadImage = useCallback(
            async (base64: string) => {
                try {
                    const response = await fetch(base64);
                    const blob = await response.blob();
                    const file = new File([blob], "cropped_image.jpg", {
                        type: blob.type || "image/jpeg",
                    });
                    const compressedFile = await compressImage(file);

                    if (compressedFile.size > 1024 * 1024) {
                        throw new Error("Image could not be compressed below 1MB");
                    }

                    const compressedDataUrl = await readAsDataUrl(compressedFile);
                    const uploadedImages = await uploadImages([compressedDataUrl]);
                    const imageUrl = uploadedImages[0];

                    if (!imageUrl) {
                        throw new Error("Firebase did not return an uploaded image URL");
                    }

                    await onImageChange?.(imageUrl);
                } catch (e) {
                    console.error(`Failed to upload image, error:`, e);
                    throw new Error(`${e instanceof Error ? e.message : e}`);
                }
            },
            [onImageChange],
        );
        useImperativeHandle(ref, () => ({ uploadImage }), [uploadImage]);
        return null;
    },
);

ImageUploader.displayName = "ImageUploader";

export default ImageUploader;
