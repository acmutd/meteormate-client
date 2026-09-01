"use client";
import { useCallback, useEffect, useState } from "react";
import ProfileCard from "@/components/cardComponent/ProfileCard";
import confetti from "canvas-confetti";
import { ItsAMatchOverlay } from "@/components/itsAMatch";
import { getPotentialMatches } from "@/utils/api/matches";
import { PotentialMatch } from "@/types/matches";


export default function Discover() {
    const [showMatch, setShowMatch] = useState(false);
    const [matches, setMatches] = useState<PotentialMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
    return (
        <div className="relative">
            <ItsAMatchOverlay
                open={showMatch}
                onClose={() => setShowMatch(false)}
                onConfirm={() => setShowMatch(false)}
                leftImg="/p2.png"
                rightImg="/p3.jpg"
                rightName="Usagi"
            />
    
            <div className="flex justify-center py-7">
                <ProfileCard
                    name={`${match.profile?.first_name ?? ""} ${match.profile?.last_name ?? ""}`.trim()}
                    subtitle={`${match.profile?.major ?? ""} - ${match.profile?.classification ?? ""}`}
                    images={match.profile?.profile_picture_url ?? []}
                    tags={[
                        { label: "Does not have a lease", tone: "orange"},
                        { label: "Year long lease", tone: "orange"},
                        { label: "$1200 Rent range", tone: "orange"},
                        { label: "Has a pet", tone: "gray" },
                    ]}
                    bio={match.profile?.bio}
                    onDislike={() => undefined}
                    onRewind={() => undefined}
                    onLike={() => {
                        fireMatch();
                    }}
                    back={{
                        interests: [
                            { label: "Music", selected: true },
                            { label: "Art", selected: true },
                            { label: "Lifting" },
                            { label: "Hiking" },
                            { label: "Video Games" },
                        ],
                        habits: [
                            { label: "Quiet", selected: true },
                            { label: "Tidy", selected: true },
                            { label: "Okay With Pets", selected: true },
                            { label: "Cooks Often" },
                            { label: "Early Bird" },
                        ],
                        expandedBio:
              "Easygoing, clean, and respectful roommate. I value communication, shared spaces that stay organized, and a chill home vibe. To do for mm: nuke atharva. WOHOOOOOOOOOOOOOOOOOOOOOOOOo",
                    }}
                />
            </div>
        </div>
    );
    
}