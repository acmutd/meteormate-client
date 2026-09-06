import React, { useEffect, useState } from "react";
import ImageDisplay from "./ImageDisplay";
import LoadingSpinner from "../LoadingSpinner";
import { fetchProfile, updateProfile } from "@/utils/api/profile";
import { MAX_PHOTOS } from "@/constants/onboarding";

interface ProfileGalleryProps {
  userId: string;
  initialImages?: string[];
}

function normalizeImages(images: string[] | undefined): string[] {
    return Array.from({ length: MAX_PHOTOS }, (_, index) => images?.[index] ?? "");
}

export default function ProfileGallery({ userId, initialImages }: ProfileGalleryProps) {
    const [images, setImages] = useState<string[]>(() => normalizeImages(initialImages));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (initialImages !== undefined) {
            setImages(normalizeImages(initialImages));
            setLoading(false);
            return;
        }

        let isMounted = true;

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
                if (!isMounted) return;

                if (
                    !data ||
          !Array.isArray(data.profile_picture_url) ||
          data.profile_picture_url.length === 0
                ) {
                    setImages(normalizeImages(undefined));
                } else {
                    setImages(normalizeImages(data.profile_picture_url));
                }
            } catch (error) {
                console.error("Failed to fetch profile images:", error);
                if (isMounted) setImages(normalizeImages(undefined));
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        if (userId) fetchProfileImages();

        return () => {
            isMounted = false;
        };
    }, [initialImages, userId]);

    const handleImageChange = async (newImageUrl: string, index: number) => {
        const updated = normalizeImages(images);
        updated[index] = newImageUrl;

        const result = await updateProfile({ profile_picture_url: updated });
        if (!result.ok) {
            throw new Error(result.error || "Failed to save profile picture");
        }

        setImages(normalizeImages(result.data.profile_picture_url));
    };

    const handleImageRemoved = (profilePictures: string[]) => {
        setImages(normalizeImages(profilePictures));
    };

    const profileImage = images[0];

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
                            canDelete
                            onDeleted={handleImageRemoved}
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
            </div>
        </div>
    );
}
