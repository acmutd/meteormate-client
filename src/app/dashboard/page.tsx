"use client";

import React, {
    useEffect,
    useState,
    useMemo,
    useCallback,
} from "react";
import ProfileCard from "@/components/cardComponent/ProfileCard";
import GroupDiscoverCard from "@/components/cardComponent/GroupDiscoverCard";
import confetti from "canvas-confetti";
import { ItsAMatchOverlay } from "@/components/itsAMatch";
import { ItsAGroupMatchOverlay } from "@/components/itsAGroupMatch";
import FilterSideBar from "@/components/cardComponent/FilterSideBar";
import {
    loadNotifications,
    type LikeNotification,
} from "@/lib/notifications";

type GroupMember = {
    id: number;
    name: string;
    image: string;
    major?: string;
    hasLease: boolean;
};

const mockGroupMembers: GroupMember[] = [
    {
        id: 1,
        name: "Usagi",
        image: "/p3.jpg",
        major: "Biology - Junior",
        hasLease: true,
    },
    {
        id: 2,
        name: "Aastha",
        image: "/p2.png",
        major: "Computer Science - Senior",
        hasLease: false,
    },
    {
        id: 3,
        name: "Maya",
        image: "/p2.png",
        major: "Neuroscience - Sophomore",
        hasLease: true,
    },
];

export default function Discover() {
    const [showMatch, setShowMatch] = useState(false);
    const [showGroupMatch, setShowGroupMatch] = useState(false);

    // Temporary toggle so you can preview the group card.
    // This will eventually be replaced with the actual matching data.
    const [showGroup, setShowGroup] = useState(false);

    const [notifications, setNotifications] = useState<
        LikeNotification[]
    >([]);

    const [loadingNotifications, setLoadingNotifications] =
        useState(true);

    useEffect(() => {
        let mounted = true;

        try {
            setLoadingNotifications(true);
            const data = loadNotifications();

            if (mounted) {
                setNotifications(data);
            }
        } finally {
            if (mounted) {
                setLoadingNotifications(false);
            }
        }

        return () => {
            mounted = false;
        };
    }, []);

    const top3 = useMemo(() => {
        return [...notifications]
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            )
            .slice(0, 3);
    }, [notifications]);

    const fireMatch = useCallback(() => {
        const duration = 900;
        const end = Date.now() + duration;

        const rand = (min: number, max: number) =>
            Math.random() * (max - min) + min;

        setShowMatch(true);

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
    }, []);

    const fireGroupMatch = useCallback(() => {
        const duration = 900;
        const end = Date.now() + duration;

        const rand = (min: number, max: number) =>
            Math.random() * (max - min) + min;

        setShowGroupMatch(true);

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
    }, []);

    return (
        <div className="relative">
            {/* Individual Match Overlay */}
            <ItsAMatchOverlay
                open={showMatch}
                onClose={() => setShowMatch(false)}
                onConfirm={() => setShowMatch(false)}
                leftImg="/p2.png"
                rightImg="/p3.jpg"
                rightName="Usagi"
            />

            {/* Group Match Overlay */}
            <ItsAGroupMatchOverlay
                open={showGroupMatch}
                onClose={() => setShowGroupMatch(false)}
                onConfirm={() => setShowGroupMatch(false)}
                currentUserImg="/p2.png"
                members={mockGroupMembers.map((member) => ({
                    name: member.name,
                    image: member.image,
                }))}
            />

            <div className="flex justify-center py-7">
                {showGroup ? (
                    <GroupDiscoverCard
                        members={mockGroupMembers}
                        onDislike={() => {
                            console.log("Disliked group");
                        }}
                        onLike={() => {
                            fireGroupMatch();
                        }}
                    />
                ) : (
                    <ProfileCard
                        name="Aastha Sheth"
                        subtitle="Comp sci. major - senior"
                        images={[
                            "/p2.png",
                            "/p3.jpg",
                            "/p2.png",
                        ]}
                        tags={[
                            {
                                label: "Does not have a lease",
                                tone: "orange",
                            },
                            {
                                label: "Year long lease",
                                tone: "orange",
                            },
                            {
                                label: "$1200 Rent range",
                                tone: "orange",
                            },
                            {
                                label: "Has a pet",
                                tone: "gray",
                            },
                        ]}
                        bio="Easygoing, clean, and respectful roommate. I value communication, shared spaces that stay organized, and a chill home vibe..."
                        onDislike={() => undefined}
                        onRewind={() => undefined}
                        onLike={() => {
                            fireMatch();
                        }}
                        back={{
                            interests: [
                                {
                                    label: "Music",
                                    selected: true,
                                },
                                {
                                    label: "Art",
                                    selected: true,
                                },
                                {
                                    label: "Lifting",
                                },
                                {
                                    label: "Hiking",
                                },
                                {
                                    label: "Video Games",
                                },
                            ],
                            habits: [
                                {
                                    label: "Quiet",
                                    selected: true,
                                },
                                {
                                    label: "Tidy",
                                    selected: true,
                                },
                                {
                                    label: "Okay With Pets",
                                    selected: true,
                                },
                                {
                                    label: "Cooks Often",
                                },
                                {
                                    label: "Early Bird",
                                },
                            ],
                            expandedBio:
                                "Easygoing, clean, and respectful roommate. I value communication, shared spaces that stay organized, and a chill home vibe.",
                        }}
                    />
                )}

                {/* TODO: Connect FilterSideBar to the discover/matching API once backend filtering
                    is implemented. Current filter UI is intentionally static. */}
                <FilterSideBar
                    loadingNotifications={loadingNotifications}
                    top3={top3}
                />
            </div>

            {/* TEMPORARY GROUP PREVIEW TOGGLE */}
            <div className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2">
                <button
                    type="button"
                    onClick={() => setShowGroup((prev) => !prev)}
                    className="cursor-pointer rounded-full border border-orange-200 bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow-lg transition hover:bg-orange-50"
                >
                    {showGroup
                        ? "Preview Individual Match"
                        : "Preview Group Match"}
                </button>
            </div>
        </div>
    );
}