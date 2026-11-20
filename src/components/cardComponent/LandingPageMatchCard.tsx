"use client";

import React, { useRef, useEffect, useState } from "react";

export type SleepSchedule = "earlybird" | "flexible" | "nightowl";

export interface LandingPageMatchCardProps {
  /** Full display name */
  name: string;
  /** Short initials shown in the avatar circle */
  initials: string;
  /** Student major */
  major?: string;
  /** true = On Campus, false = Off Campus */
  onCampus: boolean;
  /** Sleep / schedule preference */
  sleepSchedule: SleepSchedule;
  /** Minimum monthly rent budget */
  budgetMin: number;
  /** Maximum monthly rent budget */
  budgetMax: number;
  /** Optional match percentage (0–100) */
  matchPercent?: number;
  /** Change handlers */
  onNameChange?: (value: string) => void;
  onInitialsChange?: (value: string) => void;
  onMajorChange?: (value: string) => void;
  onCampusChange?: (value: boolean) => void;
  onSleepScheduleChange?: (value: SleepSchedule) => void;
  onBudgetMinChange?: (value: number) => void;
  onBudgetMaxChange?: (value: number) => void;
}

// Icons 

function CampusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3.5 h-3.5"
    >
      <rect x="3" y="10" width="18" height="11" rx="1" />
      <path d="M3 10 12 3l9 7" />
      <rect x="9" y="15" width="6" height="6" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3.5 h-3.5"
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3.5 h-3.5"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function FlexIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3.5 h-3.5"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3.5 h-3.5"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

// Helpers 

const scheduleLabel: Record<SleepSchedule, string> = {
  earlybird: "Early Bird",
  flexible: "Flexible",
  nightowl: "Night Owl",
};

const scheduleOptions: { value: SleepSchedule; label: string }[] = [
  { value: "earlybird", label: "Early Bird" },
  { value: "flexible", label: "Flexible" },
  { value: "nightowl", label: "Night Owl" },
];

function ScheduleIcon({ schedule }: { schedule: SleepSchedule }) {
  if (schedule === "earlybird") return <SunIcon />;
  if (schedule === "nightowl") return <MoonIcon />;
  return <FlexIcon />;
}

// Main Component 

export default function LandingPageMatchCard({
  name,
  initials,
  major,
  onCampus,
  sleepSchedule,
  budgetMin,
  budgetMax,
  matchPercent,
  onNameChange,
  onInitialsChange,
  onMajorChange,
  onCampusChange,
  onSleepScheduleChange,
  onBudgetMinChange,
  onBudgetMaxChange,
}: LandingPageMatchCardProps) {
  const isEditable =
    onNameChange ||
    onInitialsChange ||
    onMajorChange ||
    onCampusChange ||
    onSleepScheduleChange ||
    onBudgetMinChange ||
    onBudgetMaxChange;

  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -999, y: -999 });
  const [glowOpacity, setGlowOpacity] = useState(0);

  useEffect(() => {
    const ACTIVATION_RADIUS = 200; 

    const handleMouseMove = (e: MouseEvent) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();

      // Position relative to the card (for the radial-gradient origin)
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

      // Shortest distance from cursor to card edge
      const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
      const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
      const distance = Math.sqrt(dx * dx + dy * dy);

      setGlowOpacity(Math.max(0, 1 - distance / ACTIVATION_RADIUS));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Outer div acts as the glowing border via 1px padding + radial-gradient background.
  // Inner div covers it with the card's dark bg, leaving only the border ring visible.
  const wrapperStyle = {
    background: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, rgba(232, 124, 0, ${glowOpacity}) 0%, transparent 70%)`,
    borderRadius: "0.75rem",
    padding: "1px",
  };

  return (
    <div ref={cardRef} style={wrapperStyle} className="relative w-full max-w-sm">
      <div className="rounded-xl bg-[#1a1a1a] shadow-2xl p-3 flex items-center gap-3">
        {/* ── Avatar ── */}
        <div className="shrink-0 w-16 h-16 rounded-full bg-[#1a1a1a] border-2 border-[#E87C00] flex items-center justify-center">
          {isEditable ? (
            <input
              type="text"
              value={initials}
              maxLength={3}
              onChange={(e) => onInitialsChange?.(e.target.value.toUpperCase())}
              className="w-10 text-center text-base font-bold text-[#E87C00] bg-transparent outline-none uppercase tracking-widest"
              placeholder="AB"
            />
          ) : (
            <span className="text-base font-bold text-[#E87C00] uppercase tracking-widest">
              {initials}
            </span>
          )}
        </div>

        {/* ── Body ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          {/* Name row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              {isEditable ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => onNameChange?.(e.target.value)}
                  className="text-base font-bold text-white bg-transparent outline-none border-b border-transparent focus:border-[#E87C00] transition-colors w-full truncate"
                  placeholder="Full Name"
                />
              ) : (
                <h2 className="text-base font-bold text-white truncate">{name}</h2>
              )}
              {/* Major sublabel */}
              {isEditable ? (
                <input
                  type="text"
                  value={major ?? ""}
                  onChange={(e) => onMajorChange?.(e.target.value)}
                  className="text-xs text-gray-400 bg-transparent outline-none border-b border-transparent focus:border-gray-500 transition-colors w-full truncate mt-0.5"
                  placeholder="Major"
                />
              ) : (
                major && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">{major}</p>
                )
              )}
            </div>

            {/* Match badge */}
            {matchPercent !== undefined && (
              <div className="shrink-0 rounded-full border-2 border-[#E87C00] px-2.5 py-0.5 text-xs font-bold text-[#E87C00] whitespace-nowrap">
                {matchPercent}% Match
              </div>
            )}
          </div>

          {/* Divider */}
          <hr className="border-[#2e2e2e]" />

          {/* ── Info pills ── */}
          <div className="flex items-center gap-0 text-xs text-[#E87C00] flex-wrap">
            {/* Location toggle */}
            <div className="flex items-center gap-1.5 pr-3 border-r border-[#2e2e2e]">
              <CampusIcon />
              {isEditable ? (
                <button
                  onClick={() => onCampusChange?.(!onCampus)}
                  className="font-semibold text-[#E87C00] hover:opacity-80 transition-opacity whitespace-nowrap"
                >
                  {onCampus ? "On Campus" : "Off Campus"}
                </button>
              ) : (
                <span className="font-semibold whitespace-nowrap">
                  {onCampus ? "On Campus" : "Off Campus"}
                </span>
              )}
            </div>

            {/* Sleep schedule */}
            <div className="flex items-center gap-1 px-2 border-r border-[#2e2e2e]">
              <ScheduleIcon schedule={sleepSchedule} />
              {isEditable ? (
                <select
                  value={sleepSchedule}
                  onChange={(e) =>
                    onSleepScheduleChange?.(e.target.value as SleepSchedule)
                  }
                  className="bg-transparent text-[#E87C00] font-semibold outline-none cursor-pointer text-xs"
                >
                  {scheduleOptions.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      className="bg-[#1a1a1a] text-[#E87C00]"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="font-semibold whitespace-nowrap">
                  {scheduleLabel[sleepSchedule]}
                </span>
              )}
            </div>

            {/* Budget range */}
            <div className="flex items-center gap-1 pl-1.5">
              <DollarIcon />
              {isEditable ? (
                <div className="flex items-center gap-1 font-semibold">
                  <span className="text-[#E87C00]">$</span>
                  <input
                    type="number"
                    value={budgetMin}
                    min={0}
                    onChange={(e) =>
                      onBudgetMinChange?.(Math.min(Number(e.target.value), budgetMax - 1))
                    }
                    className="w-10 bg-transparent text-[#E87C00] outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-[#E87C00]">–</span>
                  <span className="text-[#E87C00]">$</span>
                  <input
                    type="number"
                    value={budgetMax}
                    min={budgetMin + 1}
                    onChange={(e) =>
                      onBudgetMaxChange?.(Math.max(Number(e.target.value), budgetMin + 1))
                    }
                    className="w-10 bg-transparent text-[#E87C00] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              ) : (
                <span className="font-semibold whitespace-nowrap">
                  ${budgetMin.toLocaleString()}–${budgetMax.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
