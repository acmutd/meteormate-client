"use client";

import LandingPageMatchCard, { type LandingPageMatchCardProps } from "@/components/cardComponent/LandingPageMatchCard";
import MatchConstellation from "@/components/landing/MatchConstellation";
import { useRef, type CSSProperties } from "react";

// Edit each position directly: left/top accept percentages or pixel numbers.
// Percentages refer to the page's 1440:4000 card canvas; width and marginTop are pixels.
// translateX(-50%) centers the card on left; translateX(-100%) aligns its right edge.
export const LANDING_MATCHES: {
    position: CSSProperties;
    card: LandingPageMatchCardProps;
}[] = [
    {
        position: {
            left: "81.82734%",
            top: "5.773413%",
            width: 384,
            transform: "translateX(-50%)",
            marginTop: -32,
        },
        card: {
            name: "Amelia B.",
            initials: "AB",
            major: "Computer Science",
            onCampus: true,
            sleepSchedule: "earlybird",
            budgetMin: 1200,
            budgetMax: 1800,
            matchPercent: 74,
        },
    },
    {
        position: {
            left: "61.370425%",
            top: "9.889571%",
            width: 384,
            transform: "translateX(-50%)",
        },
        card: {
            name: "Noah R.",
            initials: "NR",
            major: "Mechanical Engineering",
            onCampus: false,
            sleepSchedule: "nightowl",
            budgetMin: 800,
            budgetMax: 1100,
            matchPercent: 92,
        },
    },
    {
        position: {
            left: "65.084837%",
            top: "4.019427%",
            width: 384,
            transform: "translateX(-100%)",
            marginTop: 16,
        },
        card: {
            name: "Sofia K.",
            initials: "SK",
            major: "Business Administration",
            onCampus: true,
            sleepSchedule: "flexible",
            budgetMin: 950,
            budgetMax: 1400,
            matchPercent: 86,
        },
    },
];

export default function LandingMatchCards({ layout = "stacked" }: { layout?: "desktop" | "stacked" }) {
    const cardsRef = useRef<HTMLUListElement>(null);

    if (layout === "desktop") {
        return (
            <div className="absolute inset-0 hidden 2xl:block">
                <MatchConstellation cardsRef={cardsRef} layout={layout} />
                <ul ref={cardsRef} className="absolute inset-0" aria-label="Example roommate matches">
                    {LANDING_MATCHES.map(({ position, card }) => (
                        <li key={card.initials} className="absolute [&>div]:max-w-none" style={position}>
                            <LandingPageMatchCard {...card} />
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    // Keep the examples below the hero until there is room beside its text.
    return (
        <div className="relative mx-auto mb-24 w-full max-w-sm px-6 2xl:hidden" aria-label="Example roommate matches">
            <MatchConstellation cardsRef={cardsRef} layout={layout} />
            <ul ref={cardsRef} className="relative grid gap-16 py-8">
                {LANDING_MATCHES.map(({ card }) => (
                    <li key={card.initials}>
                        <LandingPageMatchCard {...card} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
