import { forwardRef, useImperativeHandle, useCallback } from "react";
import { getCurrentUserIdToken } from "@/firebase/auth";

export interface ImageUploaderHandle {
  uploadImage: (base64: string) => Promise<void>;
}

interface ImageUploaderProps {
  onImageChange?: (imageUrl: string) => void;
}

const ImageUploader = forwardRef<ImageUploaderHandle, ImageUploaderProps>(
    ({ onImageChange }, ref) => {
        const uploadImage = useCallback(
            async (base64: string) => {
                try {
                    const token = await getCurrentUserIdToken();
                    const res = await fetch("/api/profiles/upload_picture", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ base64 }),
                    });
                    if (!res.ok) {
                        throw new Error(`Failed to upload image, status ${res.status}`);
                    }
                    const data = await res.json();
                    if (
                        data?.profile_picture_url &&
            data.profile_picture_url.length > 0 &&
            onImageChange
                    ) {
                        onImageChange(
                            data.profile_picture_url[data.profile_picture_url.length - 1],
                        );
                    }
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
