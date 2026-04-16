"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCurrentUser } from "@/utils/api/auth";
import { uploadProfilePicture, deleteProfilePicture } from "@/utils/api/profile";
import { compressImage } from "@/utils/imageCompression";
import ImageCropper from "@/components/imageHandling/ImageCropper";
import ImageUpload from "@/components/imageHandling/imageUpload";
import ProfileCardPreview from "@/components/cardComponent/ProfileCardPreview";
import { UserProfile } from "@/types/userProfile";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/components/ui/ToastProvider";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import UnsavedChangesDialog from "@/components/navigation/UnsavedChangesDialog";

export default function UploadPicturesPage() {
    const router = useRouter();
    const { toast } = useToast();

    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [photos, setPhotos] = useState<string[]>([]);
    const [initialPhotos, setInitialPhotos] = useState<string[]>([]);
    const [cropImage, setCropImage] = useState<string | null>(null);
    const [isCropping, setIsCropping] = useState(false);
    const [uploadingSlotIndex, setUploadingSlotIndex] = useState<number | null>(null);
    const [deletingSlotIndex, setDeletingSlotIndex] = useState<number | null>(null);
    const [hasLoadedProfileData, setHasLoadedProfileData] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [compressionError, setCompressionError] = useState<string | null>(null);
    const [dropWarning, setDropWarning] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const MIN_PHOTOS = 3;
    const MAX_PHOTOS = 5;

    const isDirty =
        hasLoadedProfileData &&
        (isCropping || uploadingSlotIndex !== null || deletingSlotIndex !== null || JSON.stringify(photos) !== JSON.stringify(initialPhotos));

    const { isDialogOpen, confirmNavigation, cancelNavigation } = useUnsavedChangesGuard({ isDirty });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetchCurrentUser();
                if (res.ok && res.data) {
                    setUserProfile(res.data);
                    const profilePhotos = Array.isArray(res.data.profile?.profile_picture_url)
                        ? res.data.profile.profile_picture_url
                        : [];
                    setPhotos(profilePhotos);
                    setInitialPhotos(profilePhotos);
                    setHasLoadedProfileData(true);
                    return;
                }

                throw new Error("Failed to fetch user profile");
            } catch (error) {
                console.error("Failed to fetch user profile", error);
                setLoadError("Failed to load profile pictures.");
                router.push("/authentication?toast=not-signed-in");
            } finally {
                setInitialLoading(false);
            }
        };

        void fetchUser();
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
        if (photos.length < MAX_PHOTOS) {
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

        if (photos.length >= MAX_PHOTOS) return;

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

    const finalizePhotoState = (nextPhotos: string[]) => {
        setPhotos(nextPhotos);
        setInitialPhotos(nextPhotos);
        setUserProfile((current) =>
            current
                ? {
                    ...current,
                    profile: current.profile
                        ? {
                            ...current.profile,
                            profile_picture_url: nextPhotos,
                        }
                        : current.profile,
                }
                : current,
        );
    };

    const handleCropDone = async (croppedDataUrl: string) => {
        setIsCropping(false);
        setCropImage(null);
        setUploadingSlotIndex(photos.length);
        setCompressionError(null);

        try {
            const res = await fetch(croppedDataUrl);
            const blob = await res.blob();
            const file = new File([blob], "cropped_image.jpg", {
                type: blob.type || "image/jpeg",
            });

            const compressedFile = await compressImage(file);

            if (compressedFile.size > 1024 * 1024) {
                setCompressionError("Image is too complex to compress under 1MB. Please try a simpler photo.");
                return;
            }

            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => reject(new Error("Failed to read compressed image"));
                reader.readAsDataURL(compressedFile);
            });

            const uploadRes = await uploadProfilePicture({ base64 });

            if (uploadRes.ok && uploadRes.data?.profile_picture_url) {
                finalizePhotoState(uploadRes.data.profile_picture_url);
                toast({
                    type: "success",
                    title: "Photo uploaded",
                    description: "Your profile pictures were updated.",
                });
            } else {
                const errorMessage = !uploadRes.ok ? uploadRes.error : undefined;
                setCompressionError("Failed to upload image. Please try again.");
                toast({
                    type: "error",
                    title: "Upload failed",
                    description: errorMessage || "Failed to upload image.",
                });
            }
        } catch (error) {
            console.error("Image compression/upload failed:", error);
            setCompressionError("Failed to process image. Please try a different photo.");
            toast({
                type: "error",
                title: "Upload failed",
                description: "We could not process that image.",
            });
        } finally {
            setUploadingSlotIndex(null);
        }
    };

    const handleDeletePhoto = async (index: number) => {
        setCompressionError(null);
        setDropWarning(null);

        try {
            setDeletingSlotIndex(index);
            const res = await deleteProfilePicture(index);
            if (res.ok && res.data?.profile_picture_url) {
                finalizePhotoState(res.data.profile_picture_url);
                toast({
                    type: "success",
                    title: "Photo removed",
                    description: "Your profile pictures were updated.",
                });
            } else if (res.ok && res.data) {
                const nextPhotos = res.data.profile_picture_url || [];
                finalizePhotoState(nextPhotos);
                toast({
                    type: "success",
                    title: "Photo removed",
                    description: "Your profile pictures were updated.",
                });
            } else {
                const errorMessage = !res.ok ? res.error : undefined;
                toast({
                    type: "error",
                    title: "Delete failed",
                    description: errorMessage || "Unable to remove that photo.",
                });
            }
        } catch (error) {
            console.error("Failed to delete photo", error);
            toast({
                type: "error",
                title: "Delete failed",
                description: "Something went wrong while deleting the photo.",
            });
        } finally {
            setDeletingSlotIndex(null);
        }
    };

    const handleNextStep = async () => {
        if (photos.length < MIN_PHOTOS || photos.length > MAX_PHOTOS) return;
        router.push("/dashboard/profile/lifestylePreferences");
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

    const displayName = userProfile?.profile?.first_name ? `${userProfile.profile.first_name}`.trim() : "Your Name";
    const DEFAULT_BIO = "Your bio will appear here...";
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
                            onClick={handleNextStep}
                            disabled={photos.length < MIN_PHOTOS || uploadingSlotIndex !== null || deletingSlotIndex !== null}
                            className="absolute right-8 top-4 px-6 py-2 rounded-lg text-black font-medium shadow bg-linear-60 from-[#F28C00] to-[#FFC243] hover:from-[#d97706] hover:to-[#f59e0b] hover:shadow-md transition-all duration-200"
                        >
                            Update Profile
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

                    {photos.length < MIN_PHOTOS && (
                        <p className="mt-8 text-center text-[13px] font-medium text-gray-500">A minimum of {MIN_PHOTOS} photos is required.</p>
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
