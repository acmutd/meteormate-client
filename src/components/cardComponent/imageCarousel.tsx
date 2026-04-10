"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type StackedCarouselProps = {
    images?: string[]; // backend URLs will come here
    altPrefix?: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export default function StackedCarousel({
    images,
    altPrefix = "Profile photo",
}: StackedCarouselProps) {

    const safeImages = useMemo(() => images ?? [], [images]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [direction, setDirection] = useState<"left" | "right" | null>(null);

    const totalImages = safeImages.length;


    React.useEffect(() => {
        if (currentIndex >= totalImages) setCurrentIndex(0);
    }, [totalImages, currentIndex]);

    if (totalImages === 0) return null;

    const maxVisible = Math.min(totalImages, 5);
    const stackDepth = 3;
    const stackSpacing = 125;

    const getImageIndex = (offset: number) => {
        return (currentIndex + offset) % totalImages;
    };

    const goNext = useCallback(() => {
        if (isAnimating || totalImages <= 1) return;

        setDirection("left");
        setIsAnimating(true);

        window.setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % totalImages);
        setIsAnimating(false);
        setDirection(null);
        }, 500);
    }, [isAnimating, totalImages]);

    const goPrev = useCallback(() => {
        if (isAnimating || totalImages <= 1) return;

        setDirection("right");
        setIsAnimating(true);

        window.setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
        setIsAnimating(false);
        setDirection(null);
        }, 500);
    }, [isAnimating, totalImages]);

    return (
        <div className="relative flex w-full items-center gap-4 select-none">
            {/* Stacked Cards */}
            <div className="relative h-[380px] w-full">
                {Array.from({ length: maxVisible }).map((_, offset) => {
                const imgIndex = getImageIndex(offset);
                const isActive = offset === 0;

                const translateX = Math.min(offset, stackDepth - 1) * stackSpacing;
                const zIndex = maxVisible - offset;
                const depthShade = isActive ? 0 : Math.min(0.45, 0.08 + offset * 0.12);

                let animTranslateX = translateX;
                let animOpacity = 1;
                let animShade = depthShade;

                if (isAnimating && direction === "left") {
                    if (isActive) {
                    animTranslateX = -600;
                    animOpacity = 0;
                    } else {
                    animTranslateX = Math.min(Math.max(offset - 1, 0), stackDepth - 1) * stackSpacing;
                    animShade = offset - 1 === 0 ? 0 : Math.min(0.45, 0.08 + (offset - 1) * 0.12);
                    }
                }

                if (isAnimating && direction === "right") {
                    if (isActive) {
                    animTranslateX = stackSpacing;
                    } else {
                    animTranslateX = Math.min(offset + 1, stackDepth - 1) * stackSpacing;
                    animShade = Math.min(0.45, 0.08 + (offset + 1) * 0.12);
                    }
                }

                const src = safeImages[imgIndex];

                return (
                    <div
                    key={`${imgIndex}-${offset}`}
                    className={cn(
                        "absolute left-0 top-0 h-full overflow-hidden rounded-[22px]",
                        isActive ? "shadow-2xl border border-white" : "shadow-none border-0"
                    )}
                    style={{
                        width: "65%",
                        zIndex,
                        transform: `translateX(${animTranslateX}px)`,
                        opacity: animOpacity,
                        transition: isAnimating
                        ? "all 500ms cubic-bezier(0.4, 0, 0.2, 1)"
                        : "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
                        transformOrigin: "left center",
                    }}
                    >
                    <Image
                        src={src}
                        alt={`${altPrefix} ${imgIndex + 1}`}
                        fill
                        className="object-cover pointer-events-none"
                        sizes="(max-width: 768px) 80vw, 500px"
                        priority={isActive}
                    />
                    {isActive && totalImages > 1 && (
                    <>
                        <button
                        onClick={goPrev}
                        disabled={isAnimating}
                        className={cn(
                            " cursor-pointer absolute left-3 top-1/2 -translate-y-1/2 z-50",
                            "flex h-11 w-11 items-center justify-center rounded-full",
                            "bg-black/35 text-white backdrop-blur-sm",
                            "transition-all duration-200 hover:bg-black/50 hover:scale-105",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                            "disabled:opacity-40 disabled:cursor-not-allowed"
                        )}
                        aria-label="Previous image"
                        type="button"
                        >
                        <ChevronLeft className="h-6 w-6" />
                        </button>

                        <button
                        onClick={goNext}
                        disabled={isAnimating}
                        className={cn(
                            " cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 z-50",
                            "flex h-11 w-11 items-center justify-center rounded-full",
                            "bg-black/35 text-white backdrop-blur-sm",
                            "transition-all duration-200 hover:bg-black/50 hover:scale-105",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                            "disabled:opacity-40 disabled:cursor-not-allowed"
                        )}
                        aria-label="Next image"
                        type="button"
                        >
                        <ChevronRight className="h-6 w-6" />
                        </button>
                    </>
)}
                    {!isActive && (
                        <div
                            className="absolute inset-0"
                            style={{ backgroundColor: `rgba(0, 0, 0, ${animShade})` }}
                        />
                    )}
                    </div>
                );
                })}

                {/* Entering card animation when swiping right */}
                {isAnimating && direction === "right" && totalImages > 1 && (
                <div
                    className="absolute left-0 top-0 h-full overflow-hidden rounded-[22px] shadow-2xl"
                    style={{
                    width: "65%",
                    zIndex: maxVisible + 1,
                    transform: "translateX(0px) scale(1)",
                    opacity: 1,
                    transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1)",
                    transformOrigin: "left center",
                    }}
                >
                    <Image
                    src={safeImages[(currentIndex - 1 + totalImages) % totalImages]}
                    alt={`${altPrefix}`}
                    fill
                    className="object-cover pointer-events-none"
                    sizes="(max-width: 768px) 80vw, 500px"
                    />
                </div>
                )}
            </div>

            {/* Right Arrow */}
            {/* <button
                onClick={goNext}
                disabled={isAnimating || totalImages <= 1}
                className={cn(
                "z-30 flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                "bg-black/10 text-black backdrop-blur-sm",
                "transition-all duration-200 hover:bg-black/20 hover:scale-110",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30",
                "disabled:opacity-40 disabled:cursor-not-allowed"
                )}
                aria-label="Next image"
                type="button"
            >
                <ChevronRight className="h-6 w-6" />
            </button> */}
        </div>
    );
}
