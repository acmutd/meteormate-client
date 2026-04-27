"use client";

import Link from "next"
import React, { useMemo, useState, useEffect } from "react";
import StackedCarousel from "@/components/cardComponent/imageCarousel";
import { loadNotifications, type LikeNotification } from "@/lib/notifications";
import ProfileCardBack from "@/components/cardComponent/ProfileCardBack";
import { cn } from "@/utils/cn";

type Chip = {
	label: string;
	selected?: boolean; // orange if true
	icon?: React.ReactNode;
};

type ProfileBackData = {
	interests?: Chip[];
	habits?: Chip[];
	expandedBio?: string;
};

type Tag = {
    label: string;
    tone?: "orange" | "gray";
    icon?: React.ReactNode; 
};

type ProfileCardProps = {
    name: string;
    subtitle?: string;
    images: string[]; 
    tags?: Tag[];
    bio?: string;
    back?: ProfileBackData;

    onDislike?: () => void;
    onRewind?: () => void;
    onLike?: () => void;

    // showActions?: boolean;
    // showSidebar?: boolean;
};

function Dot({ active }: { active: boolean }) {
    return (
        <span
        className={cn(
            "h-2 w-2 rounded-full transition",
            active ? "bg-white" : "bg-white/40"
        )}
        />
    );
    }

export default function ProfileCard({
    name,
    subtitle,
    images,
    tags = [],
    bio,
    back,
    onDislike,
    onRewind,
    onLike,
    }: ProfileCardProps) {
    

    const [flipped, setFlipped] = useState(false); 
    const [peek, setPeek] = useState(false);  
    const [peekDown, setPeekDown] = useState(false);
    const [showHint, setShowHint] = useState(true);

    const [notifications, setNotifications] = useState<LikeNotification[]>([]);
    const [loadingNotifications, setLoadingNotifications] = useState(true);
    useEffect(() => {
        let mounted = true;

        try {
            setLoadingNotifications(true);
            const data = loadNotifications(); // reads local storage cache you already use
            if (mounted) setNotifications(data);
        } finally {
            if (mounted) setLoadingNotifications(false);
        }

        return () => {
            mounted = false;
        };
    }, []);

    const top3 = useMemo(() => {
    return [...notifications]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);
    }, [notifications]);

    const handleFlip = () => {
        setFlipped((v) => !v);
        onRewind?.();
    };

    return (
        <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row justify-center">
            <div className="flex flex-col flex-1 min-w-0 lg:items-center">
                {/* we don't need the old wrapper so here I made the new one just few changes  */}
                <div className="w-full max-w-md sm:max-w-xl lg:max-w-195 relative">
                    <div className="[perspective:1200px] relative w-full h-[560px] sm:h-[620px] lg:h-[720px]">
                        <div
                            className={cn(
                                "relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]",
                                flipped
                                    ? "[transform:rotateY(-180deg)]"
                                    : peek
                                    ? (peekDown
                                        ? "[transform:rotateY(-10deg)]"
                                        : "[transform:rotateY(-7deg)]")
                                    : "[transform:rotateY(0deg)]"
                            )}
                        >
                            {/* FRONT FACE */}
                            <div
                                className={cn(
                                "absolute inset-0 h-full w-full",
                                "[backface-visibility:hidden] [-webkit-backface-visibility:hidden]",
                                "[transform:rotateY(0deg)]"
                                )}
                            >
                                {/* use ONE shared outer card shell */}
                                <div className="relative h-full w-full rounded-[28px] border border-[#F1EADA] bg-white shadow-sm p-6 overflow-hidden">
                                    <div className="relative rounded-[22px] overflow-hidden">
                                        <StackedCarousel images={images} altPrefix={name} />

                                        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-5 py-4">
                                            <h2 className="text-2xl font-bold text-white drop-shadow-sm">
                                            {name}
                                            </h2>
                                            {subtitle && (
                                            <p className="text-sm text-white/90 drop-shadow-sm">
                                                {subtitle}
                                            </p>
                                            )}
                                        </div>
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
                                            : "bg-primary text-white border-[#FF9100]"
                                        )}
                                        >
                                        {t.label}
                                        </span>
                                    ))}
                                    </div>
                                )}

                                {bio && (
                                    <p className="mt-5 text-[17px] leading-relaxed text-gray-600">
                                    {bio}
                                    </p>
                                )}
                                {showHint && !flipped && (
                                    <div className="absolute bottom-16 right-4 z-30 animate-fade-in">
                                        <div className="relative bg-white border border-[#F1EADA] shadow-md rounded-xl px-4 py-2 text-sm text-gray-700">
                                        Flip over to see more details!

                                        {/* little triangle */}
                                        <div className="absolute -bottom-2 right-4 w-3 h-3 bg-white border-l border-b border-[#F1EADA] rotate-45" />
                                        </div>
                                    </div>
                                )}
                                {/* Bottom-right peek + flip hotspot */}
                                <button
                                    type="button"
                                    aria-label="Flip card"
                                    onMouseEnter={() => setPeek(true)}
                                    onMouseLeave={() => {
                                        setPeek(false);
                                        setPeekDown(false);
                                    }}
                                    onMouseDown={() => setPeekDown(true)}
                                    onMouseUp={() => setPeekDown(false)}
                                    onClick={() => {
                                        setFlipped(true);
                                        setShowHint(false);
                                    }}
                                    className={cn(
                                        "cursor-pointer absolute bottom-4 right-4 z-20",
                                        "h-12 w-12 rounded-2xl",
                                        
                                        "flex items-center justify-center",
                                        "group"
                                    )}
                                    >
                                    
                                    <span
                                        className={cn(
                                        "pointer-events-none absolute bottom-0 right-0",
                                        "h-5 w-5 rounded-tl-2xl",
                                        "border-l border-t border-[#F1EADA]",
                                        "bg-white/60"
                                        )}
                                    />
                                </button>
                                </div>
                            </div>

                            {/* BACK FACE */}
                            <div
                                className={cn(
                                "absolute inset-0 h-full w-full",
                                "[backface-visibility:hidden] [-webkit-backface-visibility:hidden]",
                                "[transform:rotateY(180deg)]"
                                )}
                            >
                                {/* SAME shared outer card shell to preserve exact shape */}
                                <div className="relative h-full w-full rounded-[28px] border border-[#F1EADA] bg-white shadow-sm p-6 overflow-hidden">
                                {/* if back content is taller, allow scrolling INSIDE without changing card height */}
                                    <div className="h-full overflow-auto">
                                        <ProfileCardBack
                                            name={name}
                                            interests={back?.interests}
                                            habits={back?.habits}
                                            expandedBio={back?.expandedBio}
                                        />
                                    </div>
                                    {/* Bottom-right flip-back hotspot */}
                                    <button
                                        type="button"
                                        aria-label="Flip back"
                                        onMouseEnter={() => setPeek(true)}
                                        onMouseLeave={() => {
                                            setPeek(false);
                                            setPeekDown(false);
                                        }}
                                        onMouseDown={() => setPeekDown(true)}
                                        onMouseUp={() => setPeekDown(false)}
                                        onClick={() => setFlipped(false)}
                                        className={cn(
                                            "cursor-pointer absolute bottom-4 right-4 z-20",
                                            "h-12 w-12 rounded-2xl",
                                            "flex items-center justify-center",
                                            "group"
                                        )}
                                        >
                                     

                                        <span
                                            className={cn(
                                            "pointer-events-none absolute bottom-0 right-0",
                                            "h-5 w-5 rounded-tl-2xl",
                                            "border-l border-t border-[#F1EADA]",
                                            "bg-white/60"
                                            )}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action buttonsssss */}
            
                <div className="mt-6 w-full flex items-center justify-center gap-8 sm:gap-10">
                    <button
                        type="button"
                        onClick={onDislike}
                        className="cursor-pointer h-16 w-16 rounded-full border border-[#F1EADA] bg-white shadow-sm hover:shadow-md transition flex items-center justify-center"
                        aria-label="Dislike"
                    >
                        <span className="text-3xl text-primary">×</span>
                    </button>
                    
                    <button
                        type="button"
                        onClick={onLike}
                        className="cursor-pointer h-16 w-16 rounded-full bg-[#FF9100] shadow-sm hover:shadow-md transition flex items-center justify-center"
                        aria-label="Like"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                        </svg>

                    </button>
                    </div> 
                </div>
                
       
        </div>
    );
}
