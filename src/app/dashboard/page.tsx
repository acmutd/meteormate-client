"use client";
import { useCallback, useEffect, useState } from "react";
import ProfileCard from "@/components/cardComponent/ProfileCard";
import confetti from "canvas-confetti";
import { ItsAMatchOverlay } from "@/components/itsAMatch";
import { getPotentialMatches } from "@/utils/api/matches";
import { PotentialMatch } from "@/types/matches";
import { fetchCurrentUser } from "@/utils/api/auth";


export default function Discover() {
    const [showMatch, setShowMatch] = useState(false);
    const [matches, setMatches] = useState<PotentialMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUserPhoto, setCurrentUserPhoto] = useState("/p2.png");

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

    const fireMatch = useCallback(() => {
        // A quick "for ~900ms keep firing" effect
        const duration = 900;
        const end = Date.now() + duration;

        // helper: random in range
        const rand = (min: number, max: number) => Math.random() * (max - min) + min;

        // Start match UI first (so overlay is visible immediately)
        setShowMatch(true);

        (function frame() {
            confetti({
                particleCount: 15,
                spread: 100,
                startVelocity: 20,
                scalar: 1.05,
                origin: { x: rand(0.05, 0.2), y: rand(0.2, 0.8) },
            });

            confetti({
                particleCount: 15,
                spread: 100,
                startVelocity: 20,
                scalar: 1.05,
                origin: { x: rand(0.8, 0.95), y: rand(0.2, 0.8) },
            });

            confetti({
                particleCount: 15,
                spread: 100,
                startVelocity: 20,
                scalar: 1.0,
                origin: { x: rand(0.2, 0.8), y: rand(0.05, 0.25) },
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

    if (matches.length === 0) {
        return (
            <div className="flex min-h-[600px] items-center justify-center">
                <p className="text-gray-500">
                    No potential matches found.
                </p>
            </div>
        );
    }
    const match = matches[0];
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
    ].filter((habit): habit is { label: string; selected: true } => habit !== null);
    return (
        <div className="relative">
            <ItsAMatchOverlay
                open={showMatch}
                onClose={() => setShowMatch(false)}
                onConfirm={() => setShowMatch(false)}
                leftImg={currentUserPhoto}
                rightImg={match.profile?.profile_picture_url?.[0] ?? "/p3.jpg"}
                rightName={match.profile?.first_name ?? "them"}
            />
    
            <div className="flex justify-center py-7">
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
                    onDislike={() => undefined}
                    onRewind={() => undefined}
                    onLike={() => {
                        fireMatch();
                    }}
                    back={{
                        interests: (match.survey?.interests ?? []).map((interest) => ({
                            label: interest,
                            selected: true,
                        })),
                        habits,
                        expandedBio: match.profile?.bio,
                    }}
                />
            </div>
        </div>
    );
    
}