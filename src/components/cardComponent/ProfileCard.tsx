"use client";

import Link from "next"
import { useMemo, useState, useEffect } from "react";
import StackedCarousel from "@/components/cardComponent/imageCarousel";
import { loadNotifications, type LikeNotification } from "@/lib/notifications";



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

    onDislike?: () => void;
    onRewind?: () => void;
    onLike?: () => void;
};

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

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
    onDislike,
    onRewind,
    onLike,
    }: ProfileCardProps) {
    const safeImages = useMemo(() => (images?.length ? images : [""]), [images]);
    const [idx, setIdx] = useState(0);

    const canPrev = idx > 0;
    const canNext = idx < safeImages.length - 1;

    const prev = () => canPrev && setIdx((v) => v - 1);
    const next = () => canNext && setIdx((v) => v + 1);

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

    return (
        <div className="flex w-[85%] justify-between">
            <div className="flex flex-col">        
                <div className="w-full max-w-2xl rounded-[28px] border border-[#F1EADA] bg-white shadow-sm p-6">
                    
                    {/* Top: Stacked carousel - TODO for me */}
                    <div className="relative rounded-[22px] overflow-hidden">
                        <StackedCarousel images={images} altPrefix={name} />
                    </div>


                    {/* Tags row */}
                    {tags.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-3">
                        {tags.map((t, i) => (
                        <span
                            key={`${t.label}-${i}`}
                            className={cn(
                            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium border",
                            t.tone === "gray"
                                ? "bg-gray-50 text-gray-700 border-gray-200"
                                : "bg-[#FF9100] text-white border-[#FF9100]"
                            )}
                        >
                            {t.label}
                        </span>
                        ))}
                    </div>
                    )}

                    {/* Bio ?!*/}
                    {bio && (
                    <p className="mt-5 text-[17px] leading-relaxed text-gray-600">
                        {bio}
                    </p>
                    )}
                </div>
                {/* Action buttonsssss */}
                <div className="mt-8 flex items-center justify-center gap-10">
                    <button
                        type="button"
                        onClick={onDislike}
                        className="cursor-pointer h-16 w-16 rounded-full border border-[#F1EADA] bg-white shadow-sm hover:shadow-md transition flex items-center justify-center"
                        aria-label="Dislike"
                    >
                        <span className="text-3xl text-orange-500">×</span>
                    </button>

                    <button
                        type="button"
                        onClick={onRewind}
                        className="cursor-pointer h-16 w-16 rounded-full border border-[#F1EADA] bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center"
                        aria-label="Rewind"
                    >
                        <span className="text-2xl text-gray-700">↺</span>
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
                
                <div className="flex-col h-full">
                    <div className="rounded-2xl h-[35%] border border-[#F1EADA] bg-white shadow-sm p-6 flex-col mb-6">
                        <div className="flex items-center justify-start gap-2 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                            </svg>
                            <p className="text-sm font-semibold text-gray-900">
                                Filters
                            </p>
                        </div>
                        <p className="mb-2">Dealbreakers - Location</p>
                        <div className="flex justify-between mb-2">
                            <button className="border rounded-xl px-2 py-1 text-[12px] cursor-pointer">On Campus</button>
                            <button className="border rounded-xl px-2 py-1 text-[12px] cursor-pointer">Off Campus</button>
                        </div>
                        <p className="mb-2">Dealbreakers - Pets</p>
                        <button className="border rounded-xl px-2 py-1 text-[12px] cursor-pointer">No Pets</button>
                            
                        
                    </div>
                    {/* Here's the filter's and recent activity */}
                    <div className="rounded-2xl h-[30%] border border-[#F1EADA] bg-white shadow-sm p-6 flex-col">
                        <div className="flex items-center justify-start gap-2 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <p className="text-sm font-semibold text-gray-900">
                                Recent activity
                            </p>
                        </div>
                        

                        {loadingNotifications && (
                            <p className="text-sm text-gray-500">
                                Loading…
                            </p>
                        )}

                        {!loadingNotifications && top3.length === 0 && (
                            <p className="text-sm text-gray-500">
                                No notifications yet.
                            </p>
                        )}

                        {!loadingNotifications && top3.length > 0 && (
                            <div className="space-y-3">
                                {top3.map((n) => (
                                    <div
                                        key={n.id}
                                        className={[
                                            "flex items-centerpx-4",
                                            n.isRead ? "bg-white" : "bg-[#FFF7ED]",
                                        ].join(" ")}
                                    >

                                        <p className="text-sm text-gray-900 truncate">
                                            <span className="font-semibold">
                                                {n.liker.name}
                                            </span>{" "}
                                            liked your profile
                                            {!n.isRead && (
                                                <span className="ml-2 inline-block h-2 w-2 rounded-full bg-orange-400 align-middle" />
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>   
                </div>
        </div>
    );
}
