
"use client";

import Image from "next/image";
import { useState } from "react";
import ProfileCardBack from "@/components/cardComponent/ProfileCardBack";

type Chip = {
    label: string;
    selected?: boolean;
};

export type GroupMember = {
    id: number;
    name: string;
    image: string;
    major?: string;
    hasLease: boolean;
    interests?: Chip[];
    habits?: Chip[];
    expandedBio?: string;
};

type GroupDiscoverCardProps = {
    members: GroupMember[];
    onDislike?: () => void;
    onLike?: () => void;
};

type Point = {
    x: number;
    y: number;
};

function getConstellationPoints(count: number): Point[] {
    if (count === 2) {
        return [
            { x: 105, y: 125 },
            { x: 335, y: 125 },
        ];
    }

    if (count === 3) {
        return [
            { x: 65, y: 135 },
            { x: 220, y: 80 },
            { x: 375, y: 135 },
        ];
    }

    if (count === 4) {
        return [
            { x: 45, y: 165 },
            { x: 155, y: 55 },
            { x: 285, y: 165 },
            { x: 395, y: 55 },
        ];
    }

    return [];
}

export default function GroupDiscoverCard({
    members,
    onDislike,
    onLike,
}: GroupDiscoverCardProps) {
    const displayMembers = members.slice(0, 4);
    const points = getConstellationPoints(displayMembers.length);

    const [showProfiles, setShowProfiles] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const activeMember = displayMembers[activeIndex];

    const previousMember = () => {
        setActiveIndex((current) =>
            current === 0 ? displayMembers.length - 1 : current - 1
        );
    };

    const nextMember = () => {
        setActiveIndex((current) =>
            current === displayMembers.length - 1 ? 0 : current + 1
        );
    };

    return (
        <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row justify-center">
            <div className="flex flex-col flex-1 min-w-0 lg:items-center">
                <div className="w-full max-w-md sm:max-w-xl lg:max-w-195 relative">
                    <div className="relative w-full h-[560px] sm:h-[620px] lg:h-[720px]">
                        <div className="relative h-full w-full rounded-[28px] border border-[#F1EADA] bg-white shadow-sm p-6 overflow-hidden">
                            {/* Header */}
                            <div className="absolute top-8 left-8 z-40 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm">
                                {showProfiles ? "Member Profile" : "Group Match"}
                            </div>

                            {/* Eye button */}
                            <button
                                type="button"
                                onClick={() => setShowProfiles((prev) => !prev)}
                                aria-label={
                                    showProfiles
                                        ? "Return to group constellation"
                                        : "View group member profiles"
                                }
                                title={
                                    showProfiles
                                        ? "Back to group"
                                        : "View member profiles"
                                }
                                className="absolute right-8 top-8 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-primary shadow-sm transition hover:bg-orange-50"
                            >
                                {showProfiles ? (
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 6l12 12M18 6L6 18"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                                        />
                                        <circle cx="12" cy="12" r="2.5" />
                                    </svg>
                                )}
                            </button>

                            {!showProfiles ? (
                                <>
                                    {/* Constellation */}
                                    <div className="relative mt-14 h-[310px] sm:h-[350px] lg:h-[390px] rounded-[22px] overflow-hidden">
                                        <Image
                                            src="/p3.jpg"
                                            alt="Group background"
                                            fill
                                            priority
                                            className="object-cover"
                                        />

                                        <div className="absolute inset-0 bg-black/35" />
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />

                                        {/* Background stars */}
                                        <div className="absolute left-[10%] top-[20%] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                                        <div className="absolute left-[20%] top-[68%] h-1 w-1 rounded-full bg-white shadow-[0_0_7px_white]" />
                                        <div className="absolute left-[42%] top-[15%] h-1 w-1 rounded-full bg-white shadow-[0_0_7px_white]" />
                                        <div className="absolute right-[18%] top-[24%] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                                        <div className="absolute right-[9%] bottom-[28%] h-1 w-1 rounded-full bg-white shadow-[0_0_7px_white]" />
                                        <div className="absolute right-[38%] bottom-[14%] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />

                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="relative h-[230px] w-full max-w-[440px]">
                                                <svg
                                                    className="absolute inset-0 h-full w-full"
                                                    viewBox="0 0 440 250"
                                                    fill="none"
                                                    preserveAspectRatio="none"
                                                >
                                                    {points.slice(1).map((point, index) => (
                                                        <line
                                                            key={`line-${index}`}
                                                            x1={points[index].x}
                                                            y1={points[index].y}
                                                            x2={point.x}
                                                            y2={point.y}
                                                            stroke="white"
                                                            strokeWidth="1.5"
                                                            strokeDasharray="5 5"
                                                            opacity="0.65"
                                                        />
                                                    ))}

                                                    {points.map((point, index) => (
                                                        <circle
                                                            key={`star-${index}`}
                                                            cx={point.x}
                                                            cy={point.y}
                                                            r={
                                                                displayMembers.length === 3 &&
                                                                index === 1
                                                                    ? 4
                                                                    : 3
                                                            }
                                                            fill={
                                                                displayMembers.length === 3 &&
                                                                index === 1
                                                                    ? "#FF9100"
                                                                    : "white"
                                                            }
                                                            opacity="0.9"
                                                        />
                                                    ))}
                                                </svg>

                                                {displayMembers.map((member, index) => {
                                                    const point = points[index];
                                                    const isCenter =
                                                        displayMembers.length === 3 &&
                                                        index === 1;
                                                    const size = isCenter ? 96 : 78;

                                                    return (
                                                        <div
                                                            key={member.id}
                                                            className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                                                            style={{
                                                                left: `${(point.x / 440) * 100}%`,
                                                                top: `${(point.y / 250) * 100}%`,
                                                            }}
                                                        >
                                                            <div
                                                                className="relative"
                                                                style={{
                                                                    width: size,
                                                                    height: size,
                                                                }}
                                                            >
                                                                <div className="absolute -inset-3 rounded-full border border-white/30" />

                                                                {isCenter && (
                                                                    <div className="absolute -inset-6 rounded-full border border-white/10" />
                                                                )}

                                                                <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white shadow-2xl">
                                                                    <Image
                                                                        src={member.image}
                                                                        alt={member.name}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>

                                                                <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-[#FF9100] shadow-[0_0_10px_#FF9100]" />
                                                            </div>

                                                            <span className="mt-2 max-w-[100px] truncate rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                                                                {member.name}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="absolute bottom-4 left-1/2 z-40 -translate-x-1/2">
                                            <div className="flex items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs font-medium text-white backdrop-blur-md">
                                                <span className="h-2 w-2 rounded-full bg-[#FF9100] shadow-[0_0_8px_#FF9100]" />
                                                {members.length} roommates
                                            </div>
                                        </div>
                                    </div>

                                    {/* Group information */}
                                    <div className="mt-5">
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            Roommate Group
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {members.length} potential roommates
                                        </p>

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
                                </>
                            ) : (
                                /* Member profile view */
                                <div className="pt-16">
                                    {activeMember ? (
                                        <>
                                            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-orange-200">
                                                    <Image
                                                        src={activeMember.image}
                                                        alt={activeMember.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <h2 className="text-xl font-bold text-gray-900">
                                                        {activeMember.name}
                                                    </h2>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {activeMember.major ?? "Major not provided"}
                                                    </p>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {activeMember.hasLease
                                                            ? "Has a lease"
                                                            : "Does not have a lease"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-5 max-h-[390px] overflow-y-auto pr-1">
                                                <ProfileCardBack
                                                    name={activeMember.name}
                                                    interests={activeMember.interests}
                                                    habits={activeMember.habits}
                                                    expandedBio={activeMember.expandedBio}
                                                />
                                            </div>

                                            <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between">
                                                <button
                                                    type="button"
                                                    onClick={previousMember}
                                                    disabled={displayMembers.length <= 1}
                                                    aria-label="Previous member"
                                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-primary transition hover:bg-orange-50 disabled:opacity-40"
                                                >
                                                    ←
                                                </button>

                                                <span className="text-sm font-medium text-gray-500">
                                                    {activeIndex + 1} of {displayMembers.length}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={nextMember}
                                                    disabled={displayMembers.length <= 1}
                                                    aria-label="Next member"
                                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-primary transition hover:bg-orange-50 disabled:opacity-40"
                                                >
                                                    →
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="pt-10 text-center text-gray-500">
                                            No group members to display.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Like / Dislike */}
                <div className="mt-6 w-full flex items-center justify-center gap-8 sm:gap-10">
                    <button
                        type="button"
                        onClick={onDislike}
                        className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-[#F1EADA] bg-white shadow-sm transition hover:shadow-md"
                        aria-label="Dislike group"
                    >
                        <span className="text-3xl text-primary">×</span>
                    </button>

                    <button
                        type="button"
                        onClick={onLike}
                        className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-[#FF9100] shadow-sm transition hover:shadow-md"
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