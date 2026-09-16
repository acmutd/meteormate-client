"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Users, X, Plus } from "lucide-react";
import { useState } from "react";
import confetti from "canvas-confetti";
import ProfileCard from "@/components/cardComponent/ProfileCard";
import { ItsAGroupMatchOverlay } from "@/components/itsAGroupMatch";

type GroupMember = {
    id: number;
    name: string;
    image: string;
    major?: string;
    hasLease: boolean;
    bio?: string;
};

type GroupMatch = {
    id: number;
    members: GroupMember[];
};

const mockGroups: GroupMatch[] = [
    {
        id: 1,
        members: [
            {
                id: 1,
                name: "Usagi Tanaka",
                image: "/p3.jpg",
                major: "Biology - Junior",
                hasLease: true,
                bio: "Friendly, organized, and looking for a clean and respectful roommate.",
            },
            {
                id: 2,
                name: "Aastha Sheth",
                image: "/p2.png",
                major: "Computer Science - Senior",
                hasLease: false,
                bio: "Easygoing, clean, and respectful roommate who enjoys hanging out and studying.",
            },
            {
                id: 3,
                name: "Maya Patel",
                image: "/p2.png",
                major: "Neuroscience - Sophomore",
                hasLease: true,
                bio: "Quiet, responsible, and looking for a comfortable living environment.",
            },
        ],
    },
    {
        id: 2,
        members: [
            {
                id: 2,
                name: "Aastha Sheth",
                image: "/p2.png",
                major: "Computer Science - Senior",
                hasLease: false,
                bio: "Easygoing, clean, and respectful roommate who enjoys hanging out and studying.",
            },
            {
                id: 3,
                name: "Maya Patel",
                image: "/p2.png",
                major: "Neuroscience - Sophomore",
                hasLease: true,
                bio: "Quiet, responsible, and looking for a comfortable living environment.",
            },
            {
                id: 4,
                name: "Zara Ahmed",
                image: "/p3.jpg",
                major: "Business - Senior",
                hasLease: false,
                bio: "Social, organized, and looking for roommates with similar living habits.",
            },
        ],
    },
];

/* -------------------------------------------------------
   MOCK TOP MATCHES
   These will eventually come from the user's real matches.
------------------------------------------------------- */

const mockTopMatches: GroupMember[] = [
    {
        id: 1,
        name: "Usagi Tanaka",
        image: "/p3.jpg",
        major: "Biology - Junior",
        hasLease: true,
        bio: "Friendly, organized, and looking for a clean and respectful roommate.",
    },
    {
        id: 2,
        name: "Aastha Sheth",
        image: "/p2.png",
        major: "Computer Science - Senior",
        hasLease: false,
        bio: "Easygoing, clean, and respectful roommate who enjoys hanging out and studying.",
    },
    {
        id: 3,
        name: "Maya Patel",
        image: "/p2.png",
        major: "Neuroscience - Sophomore",
        hasLease: true,
        bio: "Quiet, responsible, and looking for a comfortable living environment.",
    },
    {
        id: 4,
        name: "Zara Ahmed",
        image: "/p3.jpg",
        major: "Business - Senior",
        hasLease: false,
        bio: "Social, organized, and looking for roommates with similar living habits.",
    },
];

/* -------------------------------------------------------
   GROUP PROFILE VIEWER
------------------------------------------------------- */

function GroupProfileViewer({
    group,
    open,
    onClose,
}: {
    group: GroupMatch | null;
    open: boolean;
    onClose: () => void;
}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!open || !group) return null;

    const member = group.members[currentIndex];
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === group.members.length - 1;

    const closeViewer = () => {
        setCurrentIndex(0);
        onClose();
    };

    const handleNext = () => {
        if (isLast) {
            closeViewer();
            return;
        }

        setCurrentIndex((prev) => prev + 1);
    };

    const handlePrevious = () => {
        if (!isFirst) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/20"
                onClick={closeViewer}
            />

            <div className="relative flex h-full w-full items-center justify-center px-4 py-6">
                <button
                    type="button"
                    onClick={closeViewer}
                    aria-label="Close group"
                    className="absolute left-6 top-6 z-[60] flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#F1EADA] bg-white shadow-md transition hover:bg-gray-50"
                >
                    <X className="h-5 w-5 text-gray-700" />
                </button>

                <div className="absolute left-1/2 top-7 z-[60] flex -translate-x-1/2 items-center gap-2">
                    {group.members.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 rounded-full transition-all ${
                                index === currentIndex
                                    ? "w-8 bg-primary"
                                    : "w-2 bg-gray-300"
                            }`}
                        />
                    ))}
                </div>

                <div className="relative flex w-full max-w-6xl items-center justify-center">
                    <button
                        type="button"
                        onClick={handlePrevious}
                        disabled={isFirst}
                        aria-label="Previous profile"
                        className={`absolute left-0 z-[60] hidden h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[#F1EADA] bg-white shadow-md transition lg:flex ${
                            isFirst
                                ? "pointer-events-none opacity-0"
                                : "hover:bg-gray-50"
                        }`}
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-700" />
                    </button>

                    <ProfileCard
                        key={member.id}
                        name={member.name}
                        subtitle={member.major}
                        images={[
                            member.image,
                            member.image,
                            member.image,
                        ]}
                        tags={[
                            {
                                label: member.hasLease
                                    ? "Has a lease"
                                    : "Does not have a lease",
                                tone: "orange",
                            },
                            {
                                label: "$1200 Rent range",
                                tone: "orange",
                            },
                        ]}
                        bio={member.bio}
                        showActions={false}
                        back={{
                            interests: [
                                { label: "Movies" },
                                { label: "Music" },
                                { label: "Travel" },
                            ],
                            habits: [
                                { label: "Clean" },
                                { label: "Organized" },
                                { label: "Respectful" },
                            ],
                            expandedBio:
                                member.bio ??
                                "Looking for a compatible roommate and a comfortable living environment.",
                        }}
                    />

                    <button
                        type="button"
                        onClick={handleNext}
                        aria-label={isLast ? "Finish" : "Next profile"}
                        className="absolute right-0 z-[60] hidden h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[#F1EADA] bg-white shadow-md transition hover:bg-gray-50 lg:flex"
                    >
                        {isLast ? (
                            <X className="h-5 w-5 text-gray-700" />
                        ) : (
                            <ArrowRight className="h-5 w-5 text-gray-700" />
                        )}
                    </button>
                </div>

                <div className="absolute bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-3 lg:hidden">
                    <button
                        type="button"
                        onClick={handlePrevious}
                        disabled={isFirst}
                        className={`flex h-11 items-center gap-2 rounded-full border border-[#F1EADA] bg-white px-5 text-sm font-semibold text-gray-700 shadow-md ${
                            isFirst
                                ? "pointer-events-none opacity-40"
                                : "cursor-pointer"
                        }`}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </button>

                    <button
                        type="button"
                        onClick={handleNext}
                        className="flex h-11 cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-5 text-sm font-semibold text-white shadow-md"
                    >
                        {isLast ? "Done" : "Next"}
                        {!isLast && <ArrowRight className="h-4 w-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------
   CREATE GROUP MODAL
------------------------------------------------------- */

function CreateGroupModal({
    open,
    onClose,
    onCreate,
}: {
    open: boolean;
    onClose: () => void;
    onCreate: (members: GroupMember[]) => void;
}) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    if (!open) return null;

    const toggleMember = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((memberId) => memberId !== id)
                : [...prev, id]
        );
    };

    const handleCreate = () => {
        const selectedMembers = mockTopMatches.filter((member) =>
            selectedIds.includes(member.id)
        );

        if (selectedMembers.length === 0) return;

        onCreate(selectedMembers);
        setSelectedIds([]);
    };

    const handleClose = () => {
        setSelectedIds([]);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-lg rounded-3xl border border-orange-100 bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-orange-100 px-6 py-5">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Create Roommate Group
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Choose people from your top matches to add.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Close"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#F1EADA] bg-white text-gray-600 shadow-sm transition hover:bg-gray-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Matches */}
                <div className="max-h-[430px] overflow-y-auto px-6 py-5">
                    <div className="space-y-3">
                        {mockTopMatches.map((member) => {
                            const selected = selectedIds.includes(member.id);

                            return (
                                <button
                                    key={member.id}
                                    type="button"
                                    onClick={() => toggleMember(member.id)}
                                    className={`flex w-full cursor-pointer items-center gap-4 rounded-2xl border p-3 text-left transition ${
                                        selected
                                            ? "border-primary bg-orange-50"
                                            : "border-orange-100 bg-white hover:bg-orange-50/50"
                                    }`}
                                >
                                    {/* Checkbox */}
                                    <div
                                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                                            selected
                                                ? "border-primary bg-primary"
                                                : "border-gray-300 bg-white"
                                        }`}
                                    >
                                        {selected && (
                                            <svg
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                className="h-4 w-4 text-white"
                                            >
                                                <path
                                                    d="M5 10.5L8.5 14L15 6.5"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        )}
                                    </div>

                                    {/* Profile image */}
                                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-gray-800">
                                            {member.name}
                                        </p>

                                        <p className="mt-0.5 text-xs text-gray-500">
                                            {member.major}
                                        </p>
                                    </div>

                                    {/* Lease */}
                                    <span className="shrink-0 rounded-full border border-primary px-2.5 py-1 text-[10px] font-medium text-primary">
                                        {member.hasLease
                                            ? "Has a lease"
                                            : "No lease"}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-orange-100 px-6 py-5">
                    <p className="text-sm text-gray-500">
                        {selectedIds.length}{" "}
                        {selectedIds.length === 1 ? "person" : "people"}{" "}
                        selected
                    </p>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="cursor-pointer rounded-2xl border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-orange-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleCreate}
                            disabled={selectedIds.length === 0}
                            className={`rounded-2xl px-5 py-2.5 text-sm font-semibold text-white shadow-md ${
                                selectedIds.length === 0
                                    ? "cursor-not-allowed bg-gray-300"
                                    : "cursor-pointer bg-gradient-to-r from-primary to-secondary transition hover:scale-[1.01]"
                            }`}
                        >
                            Create Group
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------
   GROUP CARD
------------------------------------------------------- */

function GroupCard({
    group,
    onViewGroup,
    onJoinGroup,
}: {
    group: GroupMatch;
    onViewGroup: (group: GroupMatch) => void;
    onJoinGroup: (group: GroupMatch) => void;
}) {
    return (
        <div className="group relative overflow-hidden rounded-3xl border border-orange-100 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-orange-50 to-orange-100/40" />

            <div className="relative p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex -space-x-3">
                            {group.members.map((member) => (
                                <div
                                    key={member.id}
                                    className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-white shadow-md"
                                >
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-gray-900">
                            Roommate Group
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {group.members.length} potential roommates
                        </p>
                    </div>

                    <div className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-primary">
                        Top Match
                    </div>
                </div>

                <div className="mt-5 rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-orange-50/60 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Users className="h-4 w-4 text-primary" />
                        <span>Group members</span>
                    </div>

                    <div className="mt-3 space-y-3">
                        {group.members.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center gap-3"
                            >
                                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-gray-800">
                                        {member.name}
                                    </p>

                                    <p className="truncate text-xs text-gray-500">
                                        {member.major}
                                    </p>
                                </div>

                                <span className="shrink-0 rounded-full border border-primary px-2.5 py-1 text-[11px] font-medium text-primary">
                                    {member.hasLease
                                        ? "Has a lease"
                                        : "No lease"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => onViewGroup(group)}
                        className="flex cursor-pointer items-center justify-center rounded-2xl border border-primary px-4 py-3 text-sm font-semibold text-primary transition hover:bg-orange-50"
                    >
                        View Group
                    </button>

                    <button
                        type="button"
                        onClick={() => onJoinGroup(group)}
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.01]"
                    >
                        Join Group
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------
   PAGE
------------------------------------------------------- */

export default function Groups() {
    const [showGroupProfile, setShowGroupProfile] = useState(false);
    const [showGroupMatch, setShowGroupMatch] = useState(false);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<GroupMatch | null>(
        null
    );

    const handleViewGroup = (group: GroupMatch) => {
        setSelectedGroup(group);
        setShowGroupProfile(true);
    };

    const handleJoinGroup = (group: GroupMatch) => {
        setSelectedGroup(group);
        setShowGroupProfile(false);
        setShowGroupMatch(true);

        const duration = 900;
        const end = Date.now() + duration;

        const rand = (min: number, max: number) =>
            Math.random() * (max - min) + min;

        (function frame() {
            confetti({
                particleCount: 15,
                spread: 100,
                startVelocity: 20,
                scalar: 1.05,
                origin: {
                    x: rand(0.05, 0.2),
                    y: rand(0.2, 0.8),
                },
            });

            confetti({
                particleCount: 15,
                spread: 100,
                startVelocity: 20,
                scalar: 1.05,
                origin: {
                    x: rand(0.8, 0.95),
                    y: rand(0.2, 0.8),
                },
            });

            confetti({
                particleCount: 15,
                spread: 100,
                startVelocity: 20,
                scalar: 1.0,
                origin: {
                    x: rand(0.2, 0.8),
                    y: rand(0.05, 0.25),
                },
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    };

    const handleCreateGroup = (members: GroupMember[]) => {
        const newGroup: GroupMatch = {
            id: mockGroups.length + 1,
            members,
        };

        console.log("New group created:", newGroup);

        setShowCreateGroup(false);
    };

    return (
        <div className="relative min-h-screen px-4 md:px-8">
            {/* View Group */}
            <GroupProfileViewer
                group={selectedGroup}
                open={showGroupProfile}
                onClose={() => setShowGroupProfile(false)}
            />

            {/* Create Group */}
            <CreateGroupModal
                open={showCreateGroup}
                onClose={() => setShowCreateGroup(false)}
                onCreate={handleCreateGroup}
            />

            {/* Join Group */}
            {selectedGroup && (
                <ItsAGroupMatchOverlay
                    open={showGroupMatch}
                    onClose={() => setShowGroupMatch(false)}
                    onConfirm={() => setShowGroupMatch(false)}
                    currentUserImg="/p2.png"
                    members={selectedGroup.members.map((member) => ({
                        name: member.name,
                        image: member.image,
                    }))}
                />
            )}

            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Roommate Groups
                    </h1>

                    <p className="mt-2 text-sm text-gray-600">
                        Find compatible groups of students looking for
                        roommates.
                    </p>
                </div>

                <section>
                    {/* Section heading + Create Group */}
                    <div className="mb-5 flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Top Group Matches
                            </h2>

                            <p className="mt-1 text-sm text-gray-600">
                                Groups of potential roommates based on your
                                preferences.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowCreateGroup(true)}
                            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.01]"
                        >
                            <Plus className="h-4 w-4" />
                            Create Group
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {mockGroups.map((group) => (
                            <GroupCard
                                key={group.id}
                                group={group}
                                onViewGroup={handleViewGroup}
                                onJoinGroup={handleJoinGroup}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}