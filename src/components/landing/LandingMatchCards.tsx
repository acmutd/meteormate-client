"use client";

import LandingPageMatchCard, { type LandingPageMatchCardProps } from "@/components/cardComponent/LandingPageMatchCard";
import type { CSSProperties } from "react";

// Edit each position directly: left/top accept percentages or pixel numbers.
// Percentages refer to the full background canvas; width and marginTop are pixels.
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
            left: "44.084837%",
            top: "52.019427%",
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
    if (layout === "desktop") {
        return (
            <ul className="absolute inset-0 hidden xl:block" aria-label="Example roommate matches">
                {LANDING_MATCHES.map(({ position, card }) => (
                    <li key={card.initials} className="absolute [&>div]:max-w-none" style={position}>
                        <LandingPageMatchCard {...card} />
                    </li>
                ))}
            </ul>
        );
    }

    // Keep the examples readable beneath the hero on smaller screens.
    return (
        <div className="relative mx-auto mb-24 w-full max-w-sm px-6 xl:hidden" aria-label="Example roommate matches">
            <div className="pointer-events-none absolute bottom-0 left-1/2 top-2 w-px bg-[#E87500]/30" aria-hidden="true" />
            <ul className="relative grid gap-12">
                {LANDING_MATCHES.map(({ card }) => (
                    <li key={card.initials}>
                        <svg className="mx-auto mb-4 size-4 text-[#E87500]" viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M8 0 9 7 16 8 9 9 8 16 7 9 0 8 7 7Z" fill="currentColor" />
                        </svg>
                        <LandingPageMatchCard {...card} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
