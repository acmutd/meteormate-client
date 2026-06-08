"use client";

import React from "react";

type Chip = {
	label: string;
	selected?: boolean;
	icon?: React.ReactNode;
};

type ProfileCardBackProps = {
	name: string;
	onFlipBack?: () => void;

	interests?: Chip[];
	habits?: Chip[];
	expandedBio?: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function ChipPill({ chip }: { chip: Chip }) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-6 rounded-md px-4 py-2 text-xs font-medium border",
                chip.selected
                    ? "bg-[#FF9100] text-white border-[#FF9100]"
                    : "bg-gray-50 text-gray-700 border-gray-200"
            )}
        >
            {chip.icon}
            {chip.label}
        </span>
    );
}

export default function ProfileCardBack({
    interests = [],
    habits = [],
    expandedBio,
}: ProfileCardBackProps) {
    return (
        <div className="h-full w-full">
			
            <div className="space-y-5 text-gray-700">
                {/* Interests */}
                <div>
                    <p className="font-semibold text-gray-900 mb-2">Interests</p>
                    <div className="flex flex-wrap gap-2">
                        {interests.length === 0 ? (
                            <p className="text-gray-500">No interests added yet.</p>
                        ) : (
                            interests.map((c, i) => <ChipPill key={`${c.label}-${i}`} chip={c} />)
                        )}
                    </div>
                </div>

                {/* Habits */}
                <div>
                    <p className="font-semibold text-gray-900 mb-2">Habits</p>
                    <div className="flex flex-wrap gap-2">
                        {habits.length === 0 ? (
                            <p className="text-gray-500">No habits added yet.</p>
                        ) : (
                            habits.map((c, i) => <ChipPill key={`${c.label}-${i}`} chip={c} />)
                        )}
                    </div>
                </div>

                {/* Expanded Bio */}
                <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Expanded Bio</p>
                    <p className="text-sm leading-relaxed text-gray-600">
                        {expandedBio?.trim()
                            ? expandedBio
                            : "No expanded bio added yet."}
                    </p>
                </div>
            </div>
        </div>
    );
}