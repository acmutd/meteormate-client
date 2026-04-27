import React, { useEffect, useState } from "react";
import ImageDisplay from "./ImageDisplay";
import LoadingSpinner from "../LoadingSpinner";
import { fetchProfile } from "@/utils/api/profile";

// const MAX_IMAGES = 5;

interface ProfileGalleryProps {
  userId: string;
}

export default function ProfileGallery({ userId }: ProfileGalleryProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfileImages() {
      setLoading(true);
      try {
        const res = await fetchProfile(userId, {
          preferCache: true,
          maxAgeMs: 5 * 60 * 1000,
        });
        if (!res.ok) {
          throw new Error(res.error || "Failed to receive profile images");
        }

        const data = res.data;
        if (
          !data ||
          !Array.isArray(data.profile_picture_url) ||
          data.profile_picture_url.length === 0
        ) {
          setImages([]);
        } else {
          setImages(data.profile_picture_url);
        }
      } catch (error) {
        console.error("Failed to fetch profile images:", error);
        setImages([]);
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
    setImages((prev) => {
      if (typeof index !== "number") {
        return [...prev, newImageUrl];
      }

      if (index > prev.length) {
        return [...prev, newImageUrl];
      }

      const updated = [...prev];
      updated[index] = newImageUrl;
      return updated;
    });
  };

  const handleImageRemoved = (index: number) => {
    setImages((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const profileImage = images[0];
  // const featuredImages = images.slice(1, MAX_IMAGES);
  // const nextFeaturedIndex = 1 + featuredImages.length;

  return (
    <div>
      <div className="flex gap-100">
        <div className="flex flex-col items-center">
          <span className="mb-2 font-semibold text-sm self-start">
            Your Profile Picture
          </span>
          {profileImage && !loading ? (
            <ImageDisplay
              key={0}
              imageUrl={profileImage}
              onImageChange={(url) => handleImageChange(url, 0)}
              deleteIndex={images.length > 0 ? 0 : undefined}
              onDeleted={() => handleImageRemoved(0)}
            />
          ) : !loading ? (
            <ImageDisplay
              key={0}
              imageUrl=""
              variant="placeholder"
              onImageChange={(url) => handleImageChange(url, 0)}
            />
          ) : (
            <span className="w-32 h-32 rounded-xl object-cover bg-gray-300 cursor-pointer flex items-center justify-center">
              <LoadingSpinner />
            </span>
          )}
        </div>
        {/* Removing featured images to match figma design, but the code is still here */}
        {/* <div className="flex flex-col items-center">
          <span className="mb-2 font-semibold text-sm self-start">
            Featured Pictures
          </span>
          <div className="flex flex-row gap-4">
            {featuredImages.map((img, idx) => (
              <ImageDisplay
                key={idx + 1}
                imageUrl={img}
                onImageChange={(url) => handleImageChange(url, idx + 1)}
                deleteIndex={images.length > idx + 1 ? idx + 1 : undefined}
                onDeleted={() => handleImageRemoved(idx + 1)}
              />
            ))}
            {featuredImages.length < MAX_IMAGES - 1 && (
              <ImageDisplay
                key={nextFeaturedIndex}
                imageUrl=""
                variant="placeholder"
                onImageChange={(url) => handleImageChange(url, nextFeaturedIndex)}
              />
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
}
