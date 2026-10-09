import React, { useState } from "react";
import { deleteProfilePictures } from "@/utils/api/profile";

interface ImageDeleteProps {
  imageUrl: string;
  onDeleted?: (profilePictures: string[]) => void;
}

export default function ImageDelete({ imageUrl, onDeleted }: ImageDeleteProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (isDeleting) return;
        setIsDeleting(true);
        try {
            const result = await deleteProfilePictures({
                profile_picture_url: [imageUrl],
            });
            if (!result.ok) {
                throw new Error(result.error || "Failed to delete image");
            }
            onDeleted?.(result.data.profile_picture_url);
        } catch (err) {
            console.error("Failed to delete image", err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || !imageUrl}
            className={
                "absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            }
            title={"Delete image"}
        >
      x
        </button>
    );
}
