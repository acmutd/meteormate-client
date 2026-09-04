"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCurrentUser } from "@/utils/api/auth";
import { updateProfile } from "@/utils/api/profile";
import { compressImage, uploadImages } from "@/utils/profile_pictures";
import ImageCropper from "@/components/imageHandling/ImageCropper";
import ImageUpload from "@/components/imageHandling/imageUpload";
import ProfileCardPreview from "@/components/cardComponent/ProfileCardPreview";
import { UserProfile } from "@/types/userProfile";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/components/ui/ToastProvider";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import UnsavedChangesDialog from "@/components/navigation/UnsavedChangesDialog";
import { MIN_PHOTOS, MAX_PHOTOS } from "@/constants/onboarding";

const DEFAULT_BIO = "Your bio will appear here...";

function getPhotosSignature(photos: string[]) {
    return JSON.stringify(
        photos,
    );
}

export default function UploadPicturesPage() {
    const router = useRouter();
    const { toast } = useToast();

    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [photos, setPhotos] = useState<string[]>(Array(MAX_PHOTOS).fill(""));
    const [initialPhotosSignature, setInitialPhotosSignature] = useState("");

    const [cropImage, setCropImage] = useState<string | null>(null);
    const [isCropping, setIsCropping] = useState(false);
    const [uploadingSlotIndex, setUploadingSlotIndex] = useState<number | null>(null);
    const [deletingSlotIndex, setDeletingSlotIndex] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [compressionError, setCompressionError] = useState<string | null>(null);
    const [dropWarning, setDropWarning] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const filledPhotoCount = photos.filter((photo) => Boolean(photo)).length;

    const isDirty =
        (isCropping ||
            uploadingSlotIndex !== null ||
            isSaving ||
            getPhotosSignature(photos) !== initialPhotosSignature);

    const { isDialogOpen, confirmNavigation, cancelNavigation } =
        useUnsavedChangesGuard({ isDirty });

    useEffect(() => {
        let isMounted = true;
        const fetchUser = async () => {
            try {
                const res = await fetchCurrentUser({
                    preferCache: true,
                    maxAgeMs: 5 * 60 * 1000,
                });
                if (!isMounted) return;

                if (res.ok && res.data) {
                    setUserProfile(res.data);
                    const profilePhotos = Array.isArray(
                        res.data.profile?.profile_picture_url,
                    )
                        ? res.data.profile.profile_picture_url
                        : [];
                    const normalizedPhotos = Array.from(
                        { length: MAX_PHOTOS },
                        (_, index) => profilePhotos[index] ?? "",
                    );

                    setPhotos(normalizedPhotos);
                    setInitialPhotosSignature(getPhotosSignature(normalizedPhotos));
                    return;
                }

                if (!res.ok) {
                    if (res.code === "401") {
                        router.push("/authentication?toast=not-signed-in");
                        return;
                    }

                    setLoadError(
                        "Failed to load profile pictures. Please try again in a moment.",
                    );
                }
            } catch (error) {
                if (!isMounted) return;
                console.error("Failed to fetch user profile", error);
                setLoadError(
                    "Failed to load profile pictures. Please check your connection and try again.",
                );
            } finally {
                if (isMounted) {
                    setInitialLoading(false);
                }
            }
        };
        void fetchUser();
        return () => {
            isMounted = false;
        };
    }, [router]);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const processSelectedFile = (file: File) => {
        setCompressionError(null);
        setDropWarning(null);
        const reader = new FileReader();
        reader.onload = () => {
            setCropImage(reader.result as string);
            setIsCropping(true);
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        processSelectedFile(file);
        e.target.value = "";
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (filledPhotoCount < MAX_PHOTOS) {
            setIsDragOver(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        setDropWarning(null);

        if (filledPhotoCount >= MAX_PHOTOS) {
            toast({
                type: "error",
                title: "Upload failed",
                description: "The max photos is " + MAX_PHOTOS,
            });
            return;
        }

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (!file.type.startsWith("image/")) {
                setDropWarning("Please drop an image file.");
                return;
            }
            processSelectedFile(file);
        }
    };

    const primaryPhoto = photos[0];

    const handleCropDone = async (croppedDataUrl: string) => {
        setIsCropping(false);
        setCropImage(null);
        setCompressionError(null);

        const currentSlot = photos.findIndex((photo) => !photo);
        setUploadingSlotIndex(currentSlot);

        try {
            const res = await fetch(croppedDataUrl);
            const blob = await res.blob();
            const file = new File([blob], "cropped_image.jpg", {
                type: blob.type || "image/jpeg",
            });

            const compressedFile = await compressImage(file);

            if (compressedFile.size > 1024 * 1024) {
                setCompressionError(
                    "Image is too complex to compress under 1MB. Please try a simpler photo.",
                );
                return;
            }

            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => reject(new Error("Failed to read compressed image"));
                reader.readAsDataURL(compressedFile);
            });

            setPhotos((prev) => {
                const nextPhotos = [...prev];
                nextPhotos[currentSlot] = base64;
                return nextPhotos;
            });
        } catch (error) {
            console.error("Image compression/preview failed:", error);
            setCompressionError("Failed to process image. Please try a different photo.");
            toast({
                type: "error",
                title: "Preview failed",
                description: "We could not process that image.",
            });
        } finally {
            setUploadingSlotIndex(null);
        }
    };

    const handleDeletePhoto = (index: number) => {
        setCompressionError(null);
        setDropWarning(null);

        setDeletingSlotIndex(index);
        setPhotos((prev) => {
            const nextPhotos = [...prev];
            nextPhotos[index] = "";
            return nextPhotos;
        });
        setDeletingSlotIndex(null);
    };

    const handleUpdateProfile = async () => {
        if (filledPhotoCount < MIN_PHOTOS || filledPhotoCount > MAX_PHOTOS) return;

        setIsSaving(true);
        try {
            const changedImageMap = await uploadImages(photos);

            const updatedPhotos = [...photos];
            for (const key in changedImageMap) {
                const slotIndex = Number.parseInt(key, 10);
                updatedPhotos[slotIndex] = changedImageMap[slotIndex];
            }

            const profileUpdateRes = await updateProfile({
                profile_picture_url: updatedPhotos,
            });

            if (!profileUpdateRes.ok) {
                throw new Error(profileUpdateRes.error || "Failed to save profile pictures.");
            }

            setUserProfile((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    profile: profileUpdateRes.data,
                };
            });
            setPhotos(updatedPhotos);
            setInitialPhotosSignature(getPhotosSignature(updatedPhotos));

            toast({
                type: "success",
                title: "Profile updated",
                description: "Your photo changes were saved.",
            });
        } catch (error) {
            console.error("Failed to update profile pictures", error);
            toast({
                type: "error",
                title: "Save failed",
                description:
                    "Could not save your photo changes. Please refresh this page before trying again.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 text-center">
                <p className="text-sm text-gray-600">{loadError}</p>
            </div>
        );
    }

    const displayName = userProfile?.profile?.first_name
        ? `${userProfile.profile.first_name}`.trim()
        : "Your Name";
    const displayBio = userProfile?.profile?.bio || DEFAULT_BIO;

    return (
        <>
            <UnsavedChangesDialog
                isOpen={isDialogOpen}
                onConfirm={confirmNavigation}
                onCancel={cancelNavigation}
            />
            <div className="flex flex-col items-center justify-center">
                <div className="w-[76%] min-h-180 bg-[#FFFFFF] rounded-2xl shadow-2xl">
                    <div className="text-center mt-2 relative">
                        <button
                            type="button"
                            onClick={handleUpdateProfile}
                            disabled={
                                filledPhotoCount < MIN_PHOTOS ||
                                uploadingSlotIndex !== null ||
                                isSaving ||
                                !isDirty
                            }
                            className="absolute right-8 top-4 px-6 py-2 rounded-lg text-black font-medium shadow bg-linear-60 from-[#F28C00] to-[#FFC243] hover:from-[#d97706] hover:to-[#f59e0b] hover:shadow-md transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSaving ? "Saving..." : "Update Profile"}
                        </button>
                        <p className="text-3xl font-bold">Upload Your Photos</p>
                        <p className="text-center text-md text-gray-600">
                            Show off your best self.
                        </p>
                    </div>

                    <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch justify-center sm:px-8 lg:px-10">
                        <div className="w-full lg:w-1/2 lg:max-w-135 flex flex-col pt-4">
                            <ImageUpload
                                photos={photos}
                                primaryPhoto={primaryPhoto}
                                uploadingSlotIndex={uploadingSlotIndex}
                                deletingSlotIndex={deletingSlotIndex}
                                compressionError={compressionError}
                                dropWarning={dropWarning}
                                maxPhotos={MAX_PHOTOS}
                                fileInputRef={fileInputRef}
                                onImageClick={handleImageClick}
                                onDeletePhoto={handleDeletePhoto}
                                onFileChange={handleFileChange}
                                dragProps={{
                                    isDragOver,
                                    onDragOver: handleDragOver,
                                    onDragLeave: handleDragLeave,
                                    onDrop: handleDrop,
                                }}
                            />
                        </div>

                        <div className="w-full lg:w-1/2 lg:max-w-195 flex flex-col pt-4">
                            <ProfileCardPreview
                                name={displayName}
                                images={photos}
                                bio={displayBio}
                                tags={[]}
                            />
                        </div>
                    </div>

                    {filledPhotoCount < MIN_PHOTOS && (
                        <p className="mt-8 text-center text-[13px] font-medium text-gray-500">
                            A minimum of {MIN_PHOTOS} photos is required.
                        </p>
                    )}
                </div>

                {isCropping && cropImage && (
                    <ImageCropper
                        image={cropImage}
                        onCropDone={handleCropDone}
                        onCancel={() => {
                            setIsCropping(false);
                            setCropImage(null);
                        }}
                    />
                )}
            </div>
        </>
    );
}
