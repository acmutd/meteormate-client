"use client";
import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressHeader from "@/components/ProgressHeader";
import NextStepButton from "@/components/NextStepButton";
import { fetchCurrentUser } from "@/utils/api/auth";
import { uploadProfilePicture } from "@/utils/api/profile";
import { compressImage } from "@/utils/imageCompression";
import ImageCropper from "@/components/imageHandling/ImageCropper";
import ImageUpload from "@/components/imageHandling/imageUpload";
import ProfileCardPreview from "@/components/cardComponent/ProfileCardPreview";
import { UserProfile } from "@/types/userProfile";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function UploadPicturesPage() {
	const router = useRouter();

	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [initialLoading, setInitialLoading] = useState(true);

	const [photos, setPhotos] = useState<string[]>([]);
	const [cropImage, setCropImage] = useState<string | null>(null);
	const [isCropping, setIsCropping] = useState(false);
	const [isCompressing, setIsCompressing] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [compressionError, setCompressionError] = useState<string | null>(null);
	const [apiError, setApiError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const MIN_PHOTOS = 3;
	const MAX_PHOTOS = 5;

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetchCurrentUser();
				if (res.ok && res.data) {
					setUserProfile(res.data);
				}
			} catch (err) {
				console.error("Failed to fetch user profile", err);
			} finally {
				setInitialLoading(false);
			}
		};
		fetchUser();
	}, []);

	const [dropWarning, setDropWarning] = useState<string | null>(null);
	const [isDragOver, setIsDragOver] = useState(false);

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

	const handleCropDone = async (croppedDataUrl: string) => {
		setIsCropping(false);
		setCropImage(null);
		setIsCompressing(true);
		setCompressionError(null);

		try {
			const res = await fetch(croppedDataUrl);
			const blob = await res.blob();
			const file = new File([blob], "cropped_image.jpg", {
				type: Object.hasOwn(blob, "type") ? blob.type : "image/jpeg",
			});

			const compressedFile = await compressImage(file);

			const reader = new FileReader();
			reader.onload = () => {
				setPhotos((prev) => [...prev, reader.result as string]);
			};
			reader.readAsDataURL(compressedFile);
		} catch (error) {
			console.error("Image compression failed:", error);
			setCompressionError("Failed to process image. Please try a different photo.");
		} finally {
			setIsCompressing(false);
		}
	};

	const handleDeletePhoto = (index: number) => {
		setPhotos((prev) => prev.filter((_, i) => i !== index));
	};

	const handleNextStep = async () => {
		if (photos.length < MIN_PHOTOS || photos.length > MAX_PHOTOS) return;

		setApiError(null);
		setIsLoading(true);

		const tempPhotos = [...photos];
		const failedUploads: string[] = [];

		for (const photoBase64 of tempPhotos) {
			const picResult = await uploadProfilePicture({ base64: photoBase64 });
			if (!picResult.ok) {
				failedUploads.push(photoBase64);
			}
		}

		if (failedUploads.length > 0) {
			setPhotos(failedUploads);
			setApiError(`Failed to upload ${failedUploads.length} photo(s). Please try again.`);
			setIsLoading(false);
			return;
		}

		setIsLoading(false);
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
	const displayBio = userProfile?.profile?.bio || "Your bio will appear here...";

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
						primaryPhoto={primaryPhoto}
						isDragOver={isDragOver}
						isCompressing={isCompressing}
						compressionError={compressionError}
						dropWarning={dropWarning}
						maxPhotos={MAX_PHOTOS}
						fileInputRef={fileInputRef}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						onImageClick={handleImageClick}
						onDeletePhoto={handleDeletePhoto}
						onFileChange={handleFileChange}
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
					className={`mb-3 ${
						photos.length < MIN_PHOTOS || isLoading || isCompressing ? "opacity-50 cursor-not-allowed" : ""
					}`}
					onClick={handleNextStep}
					disabled={photos.length < MIN_PHOTOS || isLoading || isCompressing}
				/>
				{photos.length < MIN_PHOTOS && (
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
