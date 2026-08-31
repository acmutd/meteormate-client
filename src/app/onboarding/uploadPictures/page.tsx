"use client";
import React, { useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProgressHeader from "@/components/ProgressHeader";
import NextStepButton from "@/components/NextStepButton";
import { fetchCurrentUser } from "@/utils/api/auth";
import { updateProfile, deleteProfilePictures } from "@/utils/api/profile";
import { compressImage, uploadImages } from "@/utils/profile_pictures";
import ImageCropper from "@/components/imageHandling/ImageCropper";
import ImageUpload from "@/components/imageHandling/imageUpload";
import ProfileCardPreview from "@/components/cardComponent/ProfileCardPreview";
import { UserProfile } from "@/types/userProfile";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useOnboarding } from "@/contexts/onboardingContext";
import { useToast } from "@/components/ui/ToastProvider";

import { MIN_PHOTOS, MAX_PHOTOS } from "@/constants/onboarding";

export default function UploadPicturesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const toastShownRef = useRef(false);
    const { markPictureUploaded } = useOnboarding();

    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [initialLoading, setInitialLoading] = useState(true);

	const [photos, setPhotos] = useState<string[]>(["", "", "", "", ""]);
	const [deletedPhotoUrls, setDeletedPhotoUrls] = useState<string[]>([]);
	const [cropImage, setCropImage] = useState<string | null>(null);
	const [isCropping, setIsCropping] = useState(false);
	const [uploadingSlotIndex, setUploadingSlotIndex] = useState<number | null>(null);
	const [deletingSlotIndex, setDeletingSlotIndex] = useState<number | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

    const [compressionError, setCompressionError] = useState<string | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const filledPhotoCount = photos.filter((photo) => Boolean(photo)).length;

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetchCurrentUser();
				if (res.ok && res.data) {
					setUserProfile(res.data);
					const urls = res.data.profile?.profile_picture_url;
					if (urls?.length) {
						setPhotos(prev => prev.map((_, i) => urls[i] ?? ""));
					}
				}
			} catch (err) {
				console.error("Failed to fetch user profile", err);
			} finally {
				setInitialLoading(false);
			}
		};
		fetchUser();
	}, []);

    useEffect(() => {
        if (!toastShownRef.current && searchParams.get("toast") === "needs-pictures") {
            toast({
                type: "info",
                title: "Photos Required",
                description: `Please upload at least ${MIN_PHOTOS} photos to continue to the dashboard.`,
            });
            toastShownRef.current = true;
        }
    }, [searchParams, toast]);

    const [dropWarning, setDropWarning] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const processSelectedFile = (file: File) => {
        setCompressionError(null);
        setDropWarning(null);
        setApiError(null);
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

        if (filledPhotoCount >= MAX_PHOTOS) return;

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			const file = e.dataTransfer.files[0];
			if (!file.type.startsWith("image/")) {
				setDropWarning("Please drop an image file.");
				return;
			}
			processSelectedFile(file);
		}
	};

	const handleCropDone = async (croppedDataUrl: string) => {
		setIsCropping(false);
		setCropImage(null);

		const currentSlot = photos.findIndex(p => !p);
		setUploadingSlotIndex(currentSlot);
		setCompressionError(null);

        try {
            const res = await fetch(croppedDataUrl);
            const blob = await res.blob();
            const file = new File([blob], "cropped_image.jpg", {
                type: Object.hasOwn(blob, "type") ? blob.type : "image/jpeg",
            });

            const compressedFile = await compressImage(file);

            // 1MB safety check
            if (compressedFile.size > 1024 * 1024) {
                setCompressionError("Image is too complex to compress under 1MB. Please try a simpler photo.");
                return;
            }

			const reader = new FileReader();
			const base64Promise = new Promise<string>((resolve, reject) => {
				reader.onload = () => resolve(reader.result as string);
				reader.onerror = reject;
				reader.readAsDataURL(compressedFile);
			});

			const base64 = await base64Promise;
			setPhotos(prev => {
				const newPhotos = [...prev];
				newPhotos[currentSlot] = base64;
				return newPhotos;
			});
		} catch (error) {
			console.error("Image compression/upload failed:", error);
			setCompressionError("Failed to process image. Please try a different photo.");
		} finally {
			setUploadingSlotIndex(null);
		}
	};

	const handleDeletePhoto = async (index: number) => {
		setApiError(null);
		try {
			// Show specific loader over this slot while deleting
			setDeletingSlotIndex(index);
			if (!photos[index].startsWith("data:")) {
				setDeletedPhotoUrls(prev => [...prev, photos[index]]); // mark for deleting from db
			}
			setPhotos(prev => {
				const newPhotos = [...prev];
				newPhotos[index] = "";
				return newPhotos;
			});
		} catch (e) {
			console.error("Failed to delete photo", e);
		} finally {
			setDeletingSlotIndex(null);
		}
	};

    const handleNextStep = async () => {
        if (filledPhotoCount < MIN_PHOTOS || filledPhotoCount > MAX_PHOTOS) return;

		setApiError(null);
		setIsLoading(true);

		const changedImageMap = await uploadImages(photos);
		const newPhotos = Array.from({ length: MAX_PHOTOS }, (_, slotIndex) => {
			if (Object.prototype.hasOwnProperty.call(changedImageMap, slotIndex)) {
				return changedImageMap[slotIndex];
			}
			return photos[slotIndex] ?? "";
		});
		const newDeletedUrls = [...deletedPhotoUrls];
		
		for (const key in changedImageMap) {
			const slotIndex = Number.parseInt(key, 10);
			const newUrl = changedImageMap[slotIndex];
			if (photos[slotIndex] && !photos[slotIndex].startsWith("data:")) {
				newDeletedUrls.push(photos[slotIndex]);
			}
			newPhotos[slotIndex] = newUrl;
		}
		
		setPhotos(newPhotos);
		setDeletedPhotoUrls(newDeletedUrls);
		
		console.log("Changed image map after upload:", changedImageMap);
		console.log("Deleted photo URLs to remove from profile:", newDeletedUrls);
		console.log("Final photo URLs to save in profile:", newPhotos);
		
		const updateRes = await updateProfile({ profile_picture_url: newPhotos });
		if (!updateRes.ok) {
			console.error("Failed to update profile with new picture URLs", updateRes.error);
			setApiError("Failed to save photos. Please try again.");
			setIsLoading(false);
			return;
		} else {
			setUserProfile(prev => {
				if (!prev) return prev;
				return { ...prev, profile: updateRes.data ?? prev.profile };
			});
		}
		
		if (newDeletedUrls.length > 0) {
			const deleteRes = await deleteProfilePictures({ profile_picture_url: newDeletedUrls });
			if (!deleteRes.ok) {
				console.error("Failed to delete old photos from profile", deleteRes.error);
				setApiError("Failed to delete old photos. Please try again.");
				setIsLoading(false);
				return;
			}
		}
		
		setIsLoading(false);
		
		markPictureUploaded();
		
		router.push("/onboarding/lifestylePreferences");
	};

    if (initialLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    const displayName = userProfile?.profile?.first_name ? `${userProfile.profile.first_name}`.trim() : "Your Name";
    const DEFAULT_BIO = "Your bio will appear here...";
    const displayBio = userProfile?.profile?.bio || DEFAULT_BIO;

    return (
        <div className="min-h-screen w-screen overflow-x-hidden px-4 pb-10 sm:px-6 lg:px-10">
            <ProgressHeader
                title="Upload Your Photos"
                subtitle="Show off your best self."
                currentStep={2}
                progressImage="/peechi_progress_2.svg"
            />

			<div className="mx-auto mt-5 flex flex-col lg:flex-row gap-8 w-full justify-center lg:items-stretch">
				<div className="w-full lg:w-1/2 lg:max-w-135 flex flex-col pt-4">
					<ImageUpload
						photos={photos}
						primaryPhoto={photos[0]}
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
							isDragOver: isDragOver,
							onDragOver: handleDragOver,
							onDragLeave: handleDragLeave,
							onDrop: handleDrop
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

			<div className="mt-8 w-full flex flex-col items-center justify-center">
				<NextStepButton
					className={`mb-3 ${filledPhotoCount < MIN_PHOTOS || isLoading || uploadingSlotIndex !== null ? "opacity-50 cursor-not-allowed" : ""
						}`}
					onClick={handleNextStep}
					disabled={filledPhotoCount < MIN_PHOTOS || isLoading || uploadingSlotIndex !== null}
				/>
				{filledPhotoCount < MIN_PHOTOS && (
					<p className="text-[13px] text-gray-500 font-medium">A minimum of {MIN_PHOTOS} photos is required.</p>
				)}
				{apiError && <p className="text-red-500 text-sm text-center mt-2">{apiError}</p>}
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
    );
}
