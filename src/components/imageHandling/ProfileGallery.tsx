import React, { useEffect, useState } from "react";
import ImageDisplay from "./ImageDisplay";

const MAX_IMAGES = 5;

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
          setImages([]);
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

  if (loading) return <div>Loading images...</div>;

  const profileImage = images[0];
  const featuredImages = images.slice(1, MAX_IMAGES);
  const nextFeaturedIndex = 1 + featuredImages.length;

  return (
    <div className="flex flex-col gap-6 mt-4">
      <div className="flex flex-row items-end gap-90">
        <div className="flex flex-col items-center">
          <span className="mb-2 font-semibold text-sm self-start">
            Your Profile Picture
          </span>
          {profileImage ? (
            <ImageDisplay
              key={0}
              imageUrl={profileImage}
              onImageChange={(url) => handleImageChange(url, 0)}
              deleteIndex={images.length > 0 ? 0 : undefined}
              onDeleted={() => handleImageRemoved(0)}
            />
          ) : (
            <ImageDisplay
              key={0}
              imageUrl=""
              variant="placeholder"
              onImageChange={(url) => handleImageChange(url, 0)}
            />
          )}
        </div>
        <div className="flex flex-col items-center">
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
        </div>
      </div>
    </div>
  );
}
