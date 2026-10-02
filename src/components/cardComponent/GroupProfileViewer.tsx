"use client";

import React, { useState } from "react";
import StackedCarousel from "@/components/cardComponent/imageCarousel";
import ProfileCardBack from "@/components/cardComponent/ProfileCardBack";
import { cn } from "@/utils/cn";
import { X } from "lucide-react";

type Chip = {
  label: string;
  selected?: boolean;
  icon?: React.ReactNode;
};

export type GroupProfile = {
  name: string;
  subtitle?: string;
  images: string[];
  bio?: string;
  interests?: Chip[];
  habits?: Chip[];
  expandedBio?: string;
};

type GroupProfileViewerProps = {
  profile: GroupProfile;
  onClose: () => void;
};

export default function GroupProfileViewer({
  profile,
  onClose,
}: GroupProfileViewerProps) {
  const [flipped, setFlipped] = useState(false);
  const [peek, setPeek] = useState(false);
  const [peekDown, setPeekDown] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [showReportMenu, setShowReportMenu] = useState(false);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Close viewer */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close profile"
          className="absolute right-2 top-2 z-[80] flex h-10 w-10 items-center justify-center rounded-full border border-[#F1EADA] bg-white shadow-md transition hover:bg-orange-50 sm:right-4 sm:top-4"
        >
          <X size={20} className="text-gray-700" />
        </button>

        <div className="flex w-full justify-center">
          <div className="w-full max-w-md sm:max-w-xl lg:max-w-195">
            <div className="[perspective:1200px] relative h-[560px] w-full sm:h-[620px] lg:h-[720px]">
              <div
                className={cn(
                  "relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]",
                  flipped
                    ? "[transform:rotateY(-180deg)]"
                    : peek
                      ? peekDown
                        ? "[transform:rotateY(-10deg)]"
                        : "[transform:rotateY(-7deg)]"
                      : "[transform:rotateY(0deg)]"
                )}
              >
                {/* FRONT FACE */}
                <div
                  className={cn(
                    "absolute inset-0 h-full w-full",
                    "[backface-visibility:hidden] [-webkit-backface-visibility:hidden]",
                    "[transform:rotateY(0deg)]"
                  )}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-[#F1EADA] bg-white p-6 shadow-xl">
                    {/* Report menu */}
                    <div className="absolute right-8 top-8 z-30">
                      <button
                        type="button"
                        onClick={() =>
                          setShowReportMenu((value) => !value)
                        }
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#F1EADA] bg-white/80 shadow-sm backdrop-blur transition hover:bg-gray-100"
                        aria-label="Profile options"
                      >
                        <div className="flex flex-col gap-[3px]">
                          <span className="h-1 w-1 rounded-full bg-gray-700" />
                          <span className="h-1 w-1 rounded-full bg-gray-700" />
                          <span className="h-1 w-1 rounded-full bg-gray-700" />
                        </div>
                      </button>

                      {showReportMenu && (
                        <div className="absolute right-0 mt-2 w-32 rounded-xl border border-[#F1EADA] bg-white p-1 shadow-lg">
                          <button
                            type="button"
                            onClick={() => {
                              console.log("Report user");
                              setShowReportMenu(false);
                            }}
                            className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                          >
                            Report user
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Profile images */}
                    <div className="relative overflow-hidden rounded-[22px]">
                      <StackedCarousel
                        images={profile.images}
                        altPrefix={profile.name}
                      />

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-5 py-4">
                        <h2 className="text-2xl font-bold text-white drop-shadow-sm">
                          {profile.name}
                        </h2>

                        {profile.subtitle && (
                          <p className="text-sm text-white/90 drop-shadow-sm">
                            {profile.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Interests / tags */}
                    {profile.interests &&
                      profile.interests.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-3">
                          {profile.interests.map((interest, index) => (
                            <span
                              key={`${interest.label}-${index}`}
                              className={cn(
                                "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium",
                                interest.selected
                                  ? "border-[#FF9100] bg-primary text-white"
                                  : "border-gray-200 bg-gray-50 text-gray-700"
                              )}
                            >
                              {interest.icon}
                              {interest.label}
                            </span>
                          ))}
                        </div>
                      )}

                    {/* Short bio */}
                    {profile.bio && (
                      <p className="mt-5 text-[17px] leading-relaxed text-gray-600">
                        {profile.bio}
                      </p>
                    )}

                    {/* Flip hint */}
                    {showHint && !flipped && (
                      <div className="animate-fade-in absolute bottom-16 right-4 z-30">
                        <div className="relative rounded-xl border border-[#F1EADA] bg-white px-4 py-2 text-sm text-gray-700 shadow-md">
                          Flip over to see more details!

                          <div className="absolute -bottom-2 right-4 h-3 w-3 rotate-45 border-b border-l border-[#F1EADA] bg-white" />
                        </div>
                      </div>
                    )}

                    {/* Flip button */}
                    <button
                      type="button"
                      aria-label="Flip card"
                      onMouseEnter={() => setPeek(true)}
                      onMouseLeave={() => {
                        setPeek(false);
                        setPeekDown(false);
                      }}
                      onMouseDown={() => setPeekDown(true)}
                      onMouseUp={() => setPeekDown(false)}
                      onClick={() => {
                        setFlipped(true);
                        setShowHint(false);
                      }}
                      className="group absolute bottom-4 right-4 z-20 h-12 w-12 cursor-pointer rounded-2xl"
                    >
                      <span className="pointer-events-none absolute bottom-0 right-0 h-5 w-5 rounded-tl-2xl border-l border-t border-[#F1EADA] bg-white/60" />
                    </button>
                  </div>
                </div>

                {/* BACK FACE */}
                <div
                  className={cn(
                    "absolute inset-0 h-full w-full",
                    "[backface-visibility:hidden] [-webkit-backface-visibility:hidden]",
                    "[transform:rotateY(180deg)]"
                  )}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-[#F1EADA] bg-white p-6 shadow-xl">
                    <div className="h-full overflow-auto">
                      <ProfileCardBack
                        name={profile.name}
                        interests={profile.interests}
                        habits={profile.habits}
                        expandedBio={profile.expandedBio}
                      />
                    </div>

                    {/* Flip back button */}
                    <button
                      type="button"
                      aria-label="Flip back"
                      onMouseEnter={() => setPeek(true)}
                      onMouseLeave={() => {
                        setPeek(false);
                        setPeekDown(false);
                      }}
                      onMouseDown={() => setPeekDown(true)}
                      onMouseUp={() => setPeekDown(false)}
                      onClick={() => setFlipped(false)}
                      className="group absolute bottom-4 right-4 z-20 h-12 w-12 cursor-pointer rounded-2xl"
                    >
                      <span className="pointer-events-none absolute bottom-0 right-0 h-5 w-5 rounded-tl-2xl border-l border-t border-[#F1EADA] bg-white/60" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}