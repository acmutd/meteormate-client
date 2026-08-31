"use client";

// this is for the image upload on the onboarding page

import React from "react";
import Image from "next/image";

import { cn } from "@/utils/cn";
import { MAX_PHOTOS } from "@/constants/onboarding";
import PhotoSlot from "./PhotoSlot";

type ImageUploadProps = {
	photos: string[];
	primaryPhoto?: string;
	maxPhotos?: number;
	// Status
	uploadingSlotIndex: number | null;
	deletingSlotIndex: number | null;
	compressionError: string | null;
	dropWarning: string | null;
	// File Input
	fileInputRef: React.RefObject<HTMLInputElement | null>;
	onImageClick: () => void;
	onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	// Drag and Drop grouping
	dragProps: {
		isDragOver: boolean;
		onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
		onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
		onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
	};
	// Actions
	onDeletePhoto: (index: number) => void;
};

export default function ImageUpload({
    photos,
    primaryPhoto,
    maxPhotos = MAX_PHOTOS,
    uploadingSlotIndex,
    deletingSlotIndex,
    compressionError,
    dropWarning,
    fileInputRef,
    onImageClick,
    onFileChange,
    dragProps,
    onDeletePhoto,
}: ImageUploadProps) {
	const secondaryPhotoSlots = Math.max(0, maxPhotos - 1);
	// all non empty strings from 1 to 4
	const secondaryPhotoCount = photos.filter((_, i) => i > 0 && Boolean(photos[i])).length;
	const nextSlotIndex = photos.findIndex((p, i) => i > 0 && !p);

    return (
        <div
            className={cn(
                "w-full bg-white rounded-[28px] shadow-sm border border-[#F1EADA] py-8 px-6 sm:px-10 flex flex-col flex-1 transition-all duration-200",
                dragProps.isDragOver ? "border-primary bg-orange-50/50" : ""
            )}
            onDragOver={dragProps.onDragOver}
            onDragLeave={dragProps.onDragLeave}
            onDrop={dragProps.onDrop}
        >
            <div className="mb-2">
                <h1 className="text-black font-semibold text-xl mb-1">Your Photos</h1>
                <p className="text-gray-500 text-sm mb-6">Drag and drop your photos here</p>

                <div className="flex flex-col gap-8 w-full">
                    <div className="w-full flex flex-col items-start">
                        <h2 className="text-black font-semibold text-[15px] flex items-center gap-2 mb-3">
							Profile Photo
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary">
                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005z" clipRule="evenodd" />
                            </svg>
                        </h2>

                        {primaryPhoto ? (
                            <div className="relative group w-full aspect-square max-w-30 rounded-full bg-gray-100 shadow-sm border border-gray-200">
                                <div className={cn("w-full h-full rounded-full overflow-hidden relative transition-opacity", deletingSlotIndex === 0 ? "opacity-50" : "opacity-100")}>
                                    <Image src={primaryPhoto} alt="Primary Profile Photo" fill sizes="100%" className="object-cover" />
                                </div>
                                {deletingSlotIndex === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => onDeletePhoto(0)}
                                    disabled={deletingSlotIndex !== null}
                                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/40 hover:bg-red-500 transition-colors flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                                    title="Remove primary photo"
                                    aria-label="Remove primary profile photo"
                                >
									X
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={onImageClick}
                                disabled={uploadingSlotIndex !== null}
                                aria-label="Upload primary profile photo"
                                className={cn(
                                    "group w-full aspect-square max-w-30 rounded-full border-2 border-dashed transition-all shrink-0 relative overflow-hidden flex flex-col items-center justify-center",
                                    dragProps.isDragOver ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary hover:bg-orange-50/50 cursor-pointer"
                                )}
                            >
                                {uploadingSlotIndex === 0 ? (
                                    <div className="flex flex-col items-center justify-center" aria-live="polite" aria-label="Uploading...">
                                        <svg className="animate-spin h-8 w-8 text-primary mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="text-gray-500 text-sm font-medium">Processing...</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-100 transition-transform">
                                            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                            </svg>
                                        </div>
                                    </>
                                )}
                            </button>
                        )}
                        <p className="mt-3 text-[13px] text-gray-400 font-medium">This becomes your profile picture</p>
                    </div>

                    <div className="w-full">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-black font-semibold text-[15px]">
								More Photos{" "}
                                <span className="text-gray-400 font-normal ml-1">
									({secondaryPhotoCount}/{secondaryPhotoSlots})
                                </span>
                            </h2>
                        </div>

						<div className="grid grid-cols-4 gap-3">
							{Array.from({ length: secondaryPhotoSlots }, (_, idx) => idx + 1).map((slotIndex) => {
								return (
									<PhotoSlot
										key={slotIndex}
										photo={photos[slotIndex]}
										slotIndex={slotIndex}
										isNextSlot={slotIndex === nextSlotIndex}
										uploadingSlotIndex={uploadingSlotIndex}
										deletingSlotIndex={deletingSlotIndex}
										primaryPhoto={primaryPhoto}
										onDeletePhoto={onDeletePhoto}
										onImageClick={onImageClick}
									/>
								);
							})}
						</div>
					</div>

                    {(compressionError || dropWarning) && (
                        <p className="mt-1 text-sm text-red-500 text-center">{compressionError || dropWarning}</p>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        className="hidden"
                    />
                </div>
            </div>
        </div>
    );
}
