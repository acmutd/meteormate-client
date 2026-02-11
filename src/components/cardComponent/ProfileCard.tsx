"use client";

import { useMemo, useState } from "react";

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

    return (
        <div className="w-full flex flex-col justify-center items-center">
            <div className="w-full max-w-3xl rounded-[28px] border border-[#F1EADA] bg-white shadow-sm p-6">
                
                {/* Top: Stacked carousel - TODO for me */}
                <div className="relative rounded-[22px] overflow-hidden">
                    
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
    );
}
