import React from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

export type PhotoSlotProps = {
    photo?: string;
    slotIndex: number;
    photosLength: number;
    isCompressing: boolean;
    primaryPhoto?: string;
    onDeletePhoto: (index: number) => void;
    onImageClick: () => void;
};

export default function PhotoSlot({
    photo,
    slotIndex,
    photosLength,
    isCompressing,
    primaryPhoto,
    onDeletePhoto,
    onImageClick
}: PhotoSlotProps) {
	const isUploadingThisSlot = isCompressing && photosLength === slotIndex;

	if (photo) {
		return (
			<div className="relative group aspect-3/4 rounded-xl overflow-hidden bg-gray-100 shadow-sm border border-gray-200">
				<Image src={photo} alt={`Photo ${slotIndex + 1}`} fill className="object-cover" />
				<button
					type="button"
					onClick={() => onDeletePhoto(slotIndex)}
					className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/40 hover:bg-red-500 transition-colors flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 backdrop-blur-sm"
					title="Remove photo"
				>
					X
				</button>
			</div>
		);
	}

	if (slotIndex === photosLength && !primaryPhoto) {
		return (
			<div className="aspect-3/4 rounded-xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center opacity-50 cursor-not-allowed">
				<svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
				</svg>
			</div>
		);
	}

	return (
		<button
			type="button"
			onClick={slotIndex === photosLength ? onImageClick : undefined}
			disabled={isCompressing && photosLength !== slotIndex}
			className={cn(
				"aspect-3/4 rounded-xl flex items-center justify-center transition-all overflow-hidden relative",
				slotIndex === photosLength
					? "border-2 border-dashed border-gray-300 hover:border-primary hover:bg-orange-50/50 cursor-pointer group"
					: "border border-dashed border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
			)}
		>
			{isUploadingThisSlot ? (
				<div className="flex flex-col items-center justify-center">
					<svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
						<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
				</div>
			) : (
				<div
					className={cn(
						"w-8 h-8 rounded-full flex items-center justify-center transition-transform",
						slotIndex === photosLength ? "bg-orange-50 group-hover:scale-110 group-hover:bg-orange-100 text-primary" : "text-gray-300"
					)}
				>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
					</svg>
				</div>
			)}
		</button>
	);
}
