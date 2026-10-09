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
import {
    getPotentialMatches,
    likeUser,
    passUser,
} from "@/utils/api/matches";
import { PotentialMatch } from "@/types/matches";
import { fetchCurrentUser } from "@/utils/api/auth";

type GroupMember = {
    id: number;
    name: string;
    image: string;
    major?: string;
    hasLease: boolean;
    interests?: { label: string; selected?: boolean }[];
    habits?: { label: string; selected?: boolean }[];
    expandedBio?: string;
};

const mockGroupMembers: GroupMember[] = [
    {
        id: 1,
        name: "Usagi",
        image: "/p3.jpg",
        major: "Biology - Junior",
        hasLease: true,
        interests: [
            { label: "Anime", selected: true },
            { label: "Music", selected: true },
            { label: "Hiking" },
        ],
        habits: [
            { label: "Tidy", selected: true },
            { label: "Early Bird" },
        ],
        expandedBio:
            "I enjoy spending time with friends, watching anime, and keeping shared spaces comfortable.",
    },
    {
        id: 2,
        name: "Aastha",
        image: "/p2.png",
        major: "Computer Science - Senior",
        hasLease: false,
        interests: [
            { label: "Art", selected: true },
            { label: "Music", selected: true },
            { label: "Video Games" },
        ],
        habits: [
            { label: "Quiet", selected: true },
            { label: "Tidy", selected: true },
        ],
        expandedBio:
            "I'm an easygoing roommate who values communication, organization, and a relaxed home environment.",
    },
    {
        id: 3,
        name: "Maya",
        image: "/p2.png",
        major: "Neuroscience - Sophomore",
        hasLease: true,
        interests: [
            { label: "Reading", selected: true },
            { label: "Cooking" },
            { label: "Hiking", selected: true },
        ],
        habits: [
            { label: "Clean", selected: true },
            { label: "Cooks Often", selected: true },
        ],
        expandedBio:
            "I like exploring new places, cooking, and having a clean, welcoming space to come home to.",
    },
    {
        id: 4,
        name: "Ryan Edward",
        image: "/p2.jpg",
        major: "Computer Science",
        hasLease: false,
        interests: [
            { label: "Gaming", selected: true },
            { label: "Sports" },
            { label: "Movies", selected: true },
        ],
        habits: [
            { label: "Night Owl", selected: true },
            { label: "Okay With Pets", selected: true },
        ],
        expandedBio:
            "I enjoy gaming, watching movies, and finding roommates who are respectful and easy to communicate with.",
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

    const [matches, setMatches] = useState<PotentialMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUserPhoto, setCurrentUserPhoto] = useState("/p2.png");
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

    useEffect(() => {
        async function loadMatches() {
            setLoading(true);
            setError(null);

            const result = await getPotentialMatches();

            if (!result.ok) {
                setError(result.error);
                setLoading(false);
                return;
            }

            setMatches(result.data.matches);

            const userResult = await fetchCurrentUser({
                preferCache: true,
                maxAgeMs: 5 * 60 * 1000,
            });

            if (userResult.ok) {
                setCurrentUserPhoto(
                    userResult.data.profile?.profile_picture_url?.[0] ?? "/p2.png"
                );
            }

            setLoading(false);
        }

        loadMatches();
    }, []);

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

    if (loading) {
        return (
            <div className="flex min-h-[600px] items-center justify-center">
                <p className="text-gray-500">Loading potential matches...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[600px] items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (matches.length === 0 || currentMatchIndex >= matches.length) {
        return (
            <div className="flex min-h-[600px] items-center justify-center">
                <p className="text-gray-500">
                    No potential matches found.
                </p>
            </div>
        );
    }

    const match = matches[currentMatchIndex];

    const habits = [
        match.survey?.wake_time === "early_bird"
            ? { label: "Early Bird", selected: true }
            : match.survey?.wake_time === "night_owl"
                ? { label: "Night Owl", selected: true }
                : null,

        match.survey?.cleanliness === "tidy"
            ? { label: "Tidy", selected: true }
            : match.survey?.cleanliness === "neat_freak"
                ? { label: "Neat Freak", selected: true }
                : match.survey?.cleanliness === "relaxed"
                    ? { label: "Relaxed", selected: true }
                    : null,

        match.survey?.noise_tolerance === "quiet"
            ? { label: "Quiet", selected: true }
            : match.survey?.noise_tolerance === "moderate"
                ? { label: "Moderate Noise", selected: true }
                : match.survey?.noise_tolerance === "loud"
                    ? { label: "Okay With Noise", selected: true }
                    : null,

        match.survey?.pet_preference === "okay"
            ? { label: "Okay With Pets", selected: true }
            : match.survey?.pet_preference === "have_a_pet"
                ? { label: "Has a Pet", selected: true }
                : match.survey?.pet_preference === "not_okay"
                    ? { label: "No Pets", selected: true }
                    : null,

        match.survey?.cooking_frequency === "often"
            ? { label: "Cooks Often", selected: true }
            : match.survey?.cooking_frequency === "rarely"
                ? { label: "Rarely Cooks", selected: true }
                : match.survey?.cooking_frequency === "never"
                    ? { label: "Doesn't Cook", selected: true }
                    : null,
    ].filter(
        (habit): habit is { label: string; selected: true } =>
            habit !== null
    );

    const goToNextMatch = () => {
        setCurrentMatchIndex((current) => current + 1);
    };

    const handleDislike = async () => {
        const result = await passUser(match.uid);

        if (!result.ok) {
            setError(result.error);
            return;
        }

        goToNextMatch();
    };

    const handleLike = async () => {
        const result = await likeUser(match.uid);

        if (!result.ok) {
            setError(result.error);
            return;
        }

        fireMatch();
    };

    return (
        <div className="relative">
            {/* Individual Match Overlay */}
            <ItsAMatchOverlay
                open={showMatch}
                onClose={() => {
                    setShowMatch(false);
                    goToNextMatch();
                }}
                onConfirm={() => {
                    setShowMatch(false);
                    goToNextMatch();
                }}
                leftImg={currentUserPhoto}
                rightImg={match.profile?.profile_picture_url?.[0] ?? "/p3.jpg"}
                rightName={match.profile?.first_name ?? "them"}
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
                        name={`${match.profile?.first_name ?? ""} ${match.profile?.last_name ?? ""}`.trim()}
                        subtitle={`${match.profile?.major ?? ""} - ${match.profile?.classification ?? ""}`}
                        images={match.profile?.profile_picture_url ?? []}
                        tags={[
                            ...(match.survey?.budget_min != null || match.survey?.budget_max != null
                                ? [
                                    {
                                        label: `$${match.survey?.budget_min ?? 0}–$${match.survey?.budget_max ?? 0} Rent range`,
                                        tone: "orange" as const,
                                    },
                                ]
                                : []),

                            ...(match.survey?.pet_preference === "have_a_pet"
                                ? [{ label: "Has a pet", tone: "gray" as const }]
                                : match.survey?.pet_preference === "okay"
                                    ? [{ label: "Okay with pets", tone: "gray" as const }]
                                    : match.survey?.pet_preference === "not_okay"
                                        ? [{ label: "No pets", tone: "gray" as const }]
                                        : []),
                        ]}
                        bio={match.profile?.bio}
                        onDislike={handleDislike}
                        onRewind={() => undefined}
                        onLike={handleLike}
                        back={{
                            interests: (match.survey?.interests ?? []).map((interest) => ({
                                label: interest,
                                selected: true,
                            })),
                            habits,
                            expandedBio: match.profile?.bio,
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