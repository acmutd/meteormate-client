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
import { PROFILE_PHOTO_CONSTRAINTS } from "@/constants/profileConstraints";

const DEFAULT_BIO = "Your bio will appear here...";

type PhotoEntry =
    | { kind: "remote"; url: string; remoteIndex: number }
    | { kind: "local"; previewUrl: string; base64: string };

function getEntriesSignature(entries: PhotoEntry[]) {
    return JSON.stringify(
        entries.map((entry) =>
            entry.kind === "remote"
                ? `remote:${entry.remoteIndex}:${entry.url}`
                : `local:${entry.previewUrl}`,
        ),
    );
}

export default function UploadPicturesPage() {
    const router = useRouter();
    const { toast } = useToast();

    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [photoEntries, setPhotoEntries] = useState<PhotoEntry[]>([]);
    const [initialEntriesSignature, setInitialEntriesSignature] = useState("");
    const [initialRemoteCount, setInitialRemoteCount] = useState(0);

    const [cropImage, setCropImage] = useState<string | null>(null);
    const [isCropping, setIsCropping] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [hasLoadedProfileData, setHasLoadedProfileData] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [compressionError, setCompressionError] = useState<string | null>(null);
    const [dropWarning, setDropWarning] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const MIN_PHOTOS = PROFILE_PHOTO_CONSTRAINTS.minPhotos;
    const MAX_PHOTOS = PROFILE_PHOTO_CONSTRAINTS.maxPhotos;

    const photos = photoEntries.map((entry) =>
        entry.kind === "remote" ? entry.url : entry.previewUrl,
    );
    const uploadingSlotIndex = isUploading ? photos.length : null;

    const isDirty =
        hasLoadedProfileData &&
        (isCropping ||
            uploadingSlotIndex !== null ||
            isSaving ||
            getEntriesSignature(photoEntries) !== initialEntriesSignature);

    const { isDialogOpen, confirmNavigation, cancelNavigation } =
        useUnsavedChangesGuard({ isDirty });

    useEffect(() => {
        let isMounted = true;
        const fetchUser = async () => {
            try {
                const res = await fetchCurrentUser();
                if (!isMounted) return;

                if (res.ok && res.data) {
                    setUserProfile(res.data);
                    const profilePhotos = Array.isArray(
                        res.data.profile?.profile_picture_url,
                    )
                        ? res.data.profile.profile_picture_url
                        : [];
                    const entries: PhotoEntry[] = profilePhotos.map((url, index) => ({
                        kind: "remote",
                        url,
                        remoteIndex: index,
                    }));

                    setPhotoEntries(entries);
                    setInitialEntriesSignature(getEntriesSignature(entries));
                    setInitialRemoteCount(profilePhotos.length);
                    setHasLoadedProfileData(true);
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

        if (photos.length >= MAX_PHOTOS) {
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
        setIsUploading(true);
        setCompressionError(null);

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

            setPhotoEntries((prev) => [
                ...prev,
                {
                    kind: "local",
                    previewUrl: base64,
                    base64,
                },
            ]);
        } catch (error) {
            console.error("Image compression/preview failed:", error);
            setCompressionError("Failed to process image. Please try a different photo.");
            toast({
                type: "error",
                title: "Preview failed",
                description: "We could not process that image.",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeletePhoto = (index: number) => {
        setCompressionError(null);
        setDropWarning(null);
        setPhotoEntries((prev) => prev.filter((_, entryIndex) => entryIndex !== index));
    };

    const handleUpdateProfile = async () => {
        if (photos.length < MIN_PHOTOS || photos.length > MAX_PHOTOS) return;
        if (!hasLoadedProfileData) return;

        setIsSaving(true);
        let failedOperation: string | null = null;
        let appliedAnyOperation = false;
        try {
            const keptRemoteIndexes = new Set(
                photoEntries
                    .filter(
                        (
                            entry,
                        ): entry is Extract<PhotoEntry, { kind: "remote" }> =>
                            entry.kind === "remote",
                    )
                    .map((entry) => entry.remoteIndex),
            );

            const remoteIndexesToDelete: number[] = [];
            for (let i = 0; i < initialRemoteCount; i += 1) {
                if (!keptRemoteIndexes.has(i)) {
                    remoteIndexesToDelete.push(i);
                }
            }

            remoteIndexesToDelete.sort((a, b) => b - a);
            for (const remoteIndex of remoteIndexesToDelete) {
                failedOperation = `delete image #${remoteIndex + 1}`;
                const deleteRes = await deleteProfilePicture(remoteIndex);
                if (!deleteRes.ok) {
                    throw new Error(deleteRes.error || `Failed to ${failedOperation}.`);
                }
                appliedAnyOperation = true;
            }

            const localEntries = photoEntries.flatMap((entry, entryIndex) =>
                entry.kind === "local" ? [{ entry, entryIndex }] : [],
            );

            for (const localEntry of localEntries) {
                failedOperation = `upload image #${localEntry.entryIndex + 1}`;
                const uploadRes = await uploadProfilePicture({ base64: localEntry.entry.base64 });
                if (!uploadRes.ok) {
                    throw new Error(uploadRes.error || `Failed to ${failedOperation}.`);
                }
                appliedAnyOperation = true;
            }

            const refreshedUser = await fetchCurrentUser();
            if (!refreshedUser.ok || !refreshedUser.data) {
                throw new Error("Failed to refresh profile pictures after saving.");
            }

            const refreshedPhotos = Array.isArray(
                refreshedUser.data.profile?.profile_picture_url,
            )
                ? refreshedUser.data.profile.profile_picture_url
                : [];

            const refreshedEntries: PhotoEntry[] = refreshedPhotos.map((url, index) => ({
                kind: "remote",
                url,
                remoteIndex: index,
            }));

            setUserProfile(refreshedUser.data);
            setPhotoEntries(refreshedEntries);
            setInitialEntriesSignature(getEntriesSignature(refreshedEntries));
            setInitialRemoteCount(refreshedPhotos.length);

            toast({
                type: "success",
                title: "Profile updated",
                description: "Your photo changes were saved.",
            });
        } catch (error) {
            console.error("Failed to update profile pictures", error);
            const defaultDescription = failedOperation
                ? `We could not ${failedOperation}.`
                : "Could not save your photo changes.";
            const refreshPrompt = appliedAnyOperation
                ? "Some changes may have been applied. Please refresh this page to sync your latest photos."
                : "Please refresh this page before trying again.";

            toast({
                type: "error",
                title: "Save failed",
                description: `${defaultDescription} ${refreshPrompt}`,
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
                                photos.length < MIN_PHOTOS ||
                                uploadingSlotIndex !== null ||
                                isSaving || !isDirty
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
                                deletingSlotIndex={null}
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
