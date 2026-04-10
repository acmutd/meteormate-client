"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import StackedCarousel from "@/components/cardComponent/imageCarousel";
import { cn } from "@/utils/cn";

type Tag = {
    label: string;
    tone?: "orange" | "gray";
};

type ProfileCardPreviewProps = {
    name: string;
    images: string[];
    tags?: Tag[];
    bio?: string;
};


export default function ProfileCardPreview({
    name,
    images,
    tags = [],
    bio,
}: ProfileCardPreviewProps) {
    const safeImages = useMemo(
        () => (images ?? []).filter((img): img is string => typeof img === "string" && img.length > 0),
        [images]
    );
    const hasImages = safeImages.length > 0;

    return (
        <div className="w-full flex-1 max-w-md sm:max-w-xl lg:max-w-195 relative flex flex-col cursor-default select-none">
            <div className="perspective-distant relative w-full flex-1 flex flex-col">
                <div className="w-full flex-1 flex flex-col rounded-[28px] border border-[#F1EADA] bg-white shadow-sm p-6 overflow-hidden">
                    <div className="relative rounded-[22px] overflow-hidden bg-gray-100">
                        {hasImages ? (
                            <div className="w-full">
                                <StackedCarousel images={safeImages} altPrefix={name} />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400 p-8 text-center h-95">
                                <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <p className="text-sm">Upload a photo to see it here</p>
                            </div>
                        )}
                    </div>

                    {tags.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-3">
                            {tags.map((t, i) => (
                                <span
                                    key={`${t.label}-${i}`}
                                    className={cn(
                                        "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium border",
                                        t.tone === "gray"
                                            ? "bg-gray-50 text-gray-700 border-gray-200"
                                            : "bg-primary text-white border-primary"
                                    )}
                                >
                                    {t.label}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="mt-5 h-[112px] overflow-hidden text-[17px] leading-relaxed text-gray-600">
                        {bio ? (
                            <p className="line-clamp-4">{bio}</p>
                        ) : (
                            <p className="opacity-50 italic">Your bio will appear here...</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Header / Preview indicator */}
            <div className="absolute -bottom-7 right-1 flex items-center justify-between px-1">
                <span className="text-gray-500 font-medium text-sm flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    Preview
                </span>
            </div>
        </div>
    );
}
