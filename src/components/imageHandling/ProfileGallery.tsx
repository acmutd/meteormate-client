import React, { useEffect, useState } from "react";
import ImageDisplay from "./ImageDisplay";
import { getCurrentUserIdToken } from "@/firebase/auth";

const MAX_IMAGES = 5;

interface ProfileGalleryProps {
  userId: string;
}

export default function ProfileGallery({ userId }: ProfileGalleryProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const DEFAULT_IMAGE = "/peechi_duo.webp";

  useEffect(() => {
    async function fetchProfileImages() {
      setLoading(true);
      try {
        const res = await fetch(`/api/profiles/get/${userId}`, {
          method: "GET",
        });
        if (!res.ok) throw new Error("Failed to recieve profile images");
        const data = await res.json();
        if (
          !data ||
          !Array.isArray(data.profile_picture_url) ||
          data.profile_picture_url.length === 0
        ) {
          setImages([DEFAULT_IMAGE]);
        } else {
          setImages(data.profile_picture_url);
        }
      } finally {
        setLoading(false);
      }
    }
    if (userId) fetchProfileImages();
  }, [userId]);

  // debug
  useEffect(() => {
    console.log("images:", images);
  }, [images]);

  const handleImageChange = (newImageUrl: string, index?: number) => {
    if (typeof index === "number") {
      setImages((prev) => {
        const updated = [...prev];
        updated[index] = newImageUrl;
        return updated;
      });
    } else {
      setImages((prev) => [...prev, newImageUrl]);
    }
  };

  const handleImageDelete = async (index: number) => {
    try {
      const token = await getCurrentUserIdToken();
      const res = await fetch(`/api/profiles/delete_picture/${index}`, {
        method: "DELETE",
        headers: {
              Authorization: `Bearer ${token}`,
        }
      });
      if (!res.ok) throw new Error("Failed to delete image");
      setImages((prev) => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });
    } catch (err) {
      console.error("Failed to delete image", err);
    }
  };

  if (loading) return <div>Loading images...</div>;

  // Ensure we always have 5 slots
  const filledImages =
    images.length < MAX_IMAGES
      ? [
          ...images,
          ...Array(MAX_IMAGES - images.length).fill(DEFAULT_IMAGE),
        ].slice(0, MAX_IMAGES)
      : images.slice(0, MAX_IMAGES);

  return (
    <div className="flex flex-col gap-6 mt-4">
      <div className="flex flex-row items-end gap-90">
        <div className="flex flex-col items-center">
          <span className="mb-2 font-semibold text-sm self-start">
            Your Profile Picture
          </span>
          <ImageDisplay
            key={0}
            imageUrl={filledImages[0]}
            onImageChange={(url) => handleImageChange(url, 0)}
            onDelete={images[0] !== DEFAULT_IMAGE && images.length > 0 ? () => handleImageDelete(0) : undefined}
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="mb-2 font-semibold text-sm self-start">
            Featured Pictures
          </span>
          <div className="flex flex-row gap-4">
            {filledImages.slice(1).map((img, idx) => (
              <ImageDisplay
                key={idx + 1}
                imageUrl={img}
                onImageChange={(url) => handleImageChange(url, idx + 1)}
                onDelete={images[idx + 1] !== DEFAULT_IMAGE && images.length > idx + 1 ? () => handleImageDelete(idx + 1) : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
