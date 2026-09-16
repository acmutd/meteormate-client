"use client";

import Image from "next/image";

type GroupMember = {
    id: number;
    name: string;
    image: string;
    major?: string;
    hasLease: boolean;
};

type GroupDiscoverCardProps = {
    members: GroupMember[];
    onDislike?: () => void;
    onLike?: () => void;
};

export default function GroupDiscoverCard({
    members,
    onDislike,
    onLike,
}: GroupDiscoverCardProps) {
    const displayMembers = members.slice(0, 3);

    return (
        <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row justify-center">
            <div className="flex flex-col flex-1 min-w-0 lg:items-center">

                {/* Same dimensions as ProfileCard */}
                <div className="w-full max-w-md sm:max-w-xl lg:max-w-195 relative">
                    <div className="relative w-full h-[560px] sm:h-[620px] lg:h-[720px]">

                        <div className="relative h-full w-full rounded-[28px] border border-[#F1EADA] bg-white shadow-sm p-6 overflow-hidden">

                            {/* Group Match Label */}
                            <div className="absolute top-8 left-8 z-40 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm">
                                Group Match
                            </div>

                            {/* =========================================
                                GROUP CONSTELLATION
                            ========================================= */}
                            <div className="relative h-[310px] sm:h-[350px] lg:h-[390px] rounded-[22px] overflow-hidden">

                                {/* Usagi's photo as the group background */}
                                <Image
                                    src="/p3.jpg"
                                    alt="Group background"
                                    fill
                                    priority
                                    className="object-cover"
                                />

                                {/* Dark overlay */}
                                <div className="absolute inset-0 bg-black/35" />

                                {/* Soft glow */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />

                                {/* Background stars */}
                                <div className="absolute left-[10%] top-[20%] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                                <div className="absolute left-[20%] top-[68%] h-1 w-1 rounded-full bg-white shadow-[0_0_7px_white]" />
                                <div className="absolute left-[42%] top-[15%] h-1 w-1 rounded-full bg-white shadow-[0_0_7px_white]" />
                                <div className="absolute right-[18%] top-[24%] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                                <div className="absolute right-[9%] bottom-[28%] h-1 w-1 rounded-full bg-white shadow-[0_0_7px_white]" />
                                <div className="absolute right-[38%] bottom-[14%] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />

                                {/* =====================================
                                    CONSTELLATION
                                ===================================== */}
                                <div className="absolute inset-0 flex items-center justify-center">

                                    <div className="relative h-[230px] w-[390px] sm:h-[250px] sm:w-[440px]">

                                        {/* Two straight connecting lines */}
                                        <svg
                                            className="absolute inset-0 h-full w-full"
                                            viewBox="0 0 440 250"
                                            fill="none"
                                            preserveAspectRatio="none"
                                        >
                                            {/* Left → Center */}
                                            <line
                                                x1="65"
                                                y1="135"
                                                x2="220"
                                                y2="80"
                                                stroke="white"
                                                strokeWidth="1.5"
                                                strokeDasharray="5 5"
                                                opacity="0.65"
                                            />

                                            {/* Center → Right */}
                                            <line
                                                x1="220"
                                                y1="80"
                                                x2="375"
                                                y2="135"
                                                stroke="white"
                                                strokeWidth="1.5"
                                                strokeDasharray="5 5"
                                                opacity="0.65"
                                            />

                                            {/* Small glowing stars at connection points */}
                                            <circle
                                                cx="65"
                                                cy="135"
                                                r="3"
                                                fill="white"
                                                opacity="0.9"
                                            />

                                            <circle
                                                cx="220"
                                                cy="80"
                                                r="4"
                                                fill="#FF9100"
                                            />

                                            <circle
                                                cx="375"
                                                cy="135"
                                                r="3"
                                                fill="white"
                                                opacity="0.9"
                                            />
                                        </svg>

                                        {/* =================================
                                            MEMBER 1
                                        ================================= */}
                                        {displayMembers[0] && (
                                            <div className="absolute left-[20px] top-[92px] z-20 flex flex-col items-center">
                                                <div className="relative h-[78px] w-[78px] sm:h-[88px] sm:w-[88px]">

                                                    <div className="absolute -inset-3 rounded-full border border-white/30" />

                                                    <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white shadow-2xl">
                                                        <Image
                                                            src={displayMembers[0].image}
                                                            alt={displayMembers[0].name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>

                                                    <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-[#FF9100] shadow-[0_0_10px_#FF9100]" />
                                                </div>

                                                <span className="mt-2 whitespace-nowrap rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                                                    {displayMembers[0].name}
                                                </span>
                                            </div>
                                        )}

                                        {/* =================================
                                            MEMBER 2
                                        ================================= */}
                                        {displayMembers[1] && (
                                            <div className="absolute left-1/2 top-[18px] z-30 flex -translate-x-1/2 flex-col items-center">

                                                <div className="relative h-[96px] w-[96px] sm:h-[108px] sm:w-[108px]">

                                                    <div className="absolute -inset-4 rounded-full border border-white/30" />

                                                    <div className="absolute -inset-7 rounded-full border border-white/10" />

                                                    <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white shadow-2xl">
                                                        <Image
                                                            src={displayMembers[1].image}
                                                            alt={displayMembers[1].name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>

                                                    <div className="absolute -right-1 -top-1 h-5 w-5 rounded-full border-2 border-white bg-[#FF9100] shadow-[0_0_14px_#FF9100]" />
                                                </div>

                                                <span className="mt-2 whitespace-nowrap rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                                                    {displayMembers[1].name}
                                                </span>
                                            </div>
                                        )}

                                        {/* =================================
                                            MEMBER 3
                                        ================================= */}
                                        {displayMembers[2] && (
                                            <div className="absolute right-[20px] top-[92px] z-20 flex flex-col items-center">

                                                <div className="relative h-[78px] w-[78px] sm:h-[88px] sm:w-[88px]">

                                                    <div className="absolute -inset-3 rounded-full border border-white/30" />

                                                    <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white shadow-2xl">
                                                        <Image
                                                            src={displayMembers[2].image}
                                                            alt={displayMembers[2].name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>

                                                    <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-[#FF9100] shadow-[0_0_10px_#FF9100]" />
                                                </div>

                                                <span className="mt-2 whitespace-nowrap rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                                                    {displayMembers[2].name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Group size */}
                                <div className="absolute bottom-4 left-1/2 z-40 -translate-x-1/2">
                                    <div className="flex items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs font-medium text-white backdrop-blur-md">
                                        <span className="h-2 w-2 rounded-full bg-[#FF9100] shadow-[0_0_8px_#FF9100]" />
                                        {members.length} roommates
                                    </div>
                                </div>
                            </div>

                            {/* =========================================
                                GROUP INFO
                            ========================================= */}
                            <div className="mt-5">

                                <h2 className="text-2xl font-bold text-gray-900">
                                    Roommate Group
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {members.length} potential roommates
                                </p>

                                {/* Member names */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {members.map((member) => (
                                        <span
                                            key={member.id}
                                            className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700"
                                        >
                                            {member.name}
                                        </span>
                                    ))}
                                </div>

                                {/* Shared preferences */}
                                <div className="mt-4 flex flex-wrap gap-3">

                                    <span className="inline-flex items-center rounded-xl border border-[#FF9100] bg-primary px-4 py-2 text-sm font-medium text-white">
                                        $1200 Rent range
                                    </span>

                                    <span className="inline-flex items-center rounded-xl border border-[#FF9100] bg-primary px-4 py-2 text-sm font-medium text-white">
                                        Year-long lease
                                    </span>

                                    <span className="inline-flex items-center rounded-xl border border-[#FF9100] bg-primary px-4 py-2 text-sm font-medium text-white">
                                        Okay with pets
                                    </span>
                                </div>
                            </div>

                            {/* Flip Corner */}
                            <div className="absolute bottom-4 right-4 z-20 h-12 w-12 rounded-2xl">
                                <span className="pointer-events-none absolute bottom-0 right-0 h-5 w-5 rounded-tl-2xl border-l border-t border-[#F1EADA] bg-white/60" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* =========================================
                    ACTION BUTTONS
                    Same as ProfileCard
                ========================================= */}
                <div className="mt-6 w-full flex items-center justify-center gap-8 sm:gap-10">

                    {/* Dislike */}
                    <button
                        type="button"
                        onClick={onDislike}
                        className="cursor-pointer h-16 w-16 rounded-full border border-[#F1EADA] bg-white shadow-sm hover:shadow-md transition flex items-center justify-center"
                        aria-label="Dislike group"
                    >
                        <span className="text-3xl text-primary">
                            ×
                        </span>
                    </button>

                    {/* Like */}
                    <button
                        type="button"
                        onClick={onLike}
                        className="cursor-pointer h-16 w-16 rounded-full bg-[#FF9100] shadow-sm hover:shadow-md transition flex items-center justify-center"
                        aria-label="Like group"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6 text-white"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 1 .322-1.672V2.75a.75.75 0 0 1 .75.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}