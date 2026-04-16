"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const profileSections = [
    { path: "/dashboard/profile", label: "Profile" },
    { path: "/dashboard/profile/uploadPictures", label: "Pictures" },
    { path: "/dashboard/profile/lifestylePreferences", label: "Preferences" },
    { path: "/dashboard/profile/lifestyleHabits", label: "Habits" },
    { path: "/dashboard/profile/interests", label: "Interests" },
    { path: "/dashboard/profile/lifestylePersonality", label: "Personality" },
    { path: "/dashboard/profile/housing", label: "Housing" },
  ];

  const currentIndex = profileSections.findIndex(
    (section) => section.path === pathname,
  );

  const resolvedCurrentIndex = currentIndex === -1 ? 0 : currentIndex;
  const previousIndex =
    resolvedCurrentIndex === 0
      ? profileSections.length - 1
      : resolvedCurrentIndex - 1;
  const nextIndex =
    resolvedCurrentIndex === profileSections.length - 1
      ? 0
      : resolvedCurrentIndex + 1;
  const previousPath = profileSections[previousIndex].path;
  const nextPath = profileSections[nextIndex].path;

  return (
    <div
      className="relative min-h-full"
      style={{
        backgroundImage: "url('/stars_orange.svg')",
        backgroundSize: "cover",
      }}
    >
      <Link
        href={previousPath}
        className="group fixed left-[22%] top-1/2 -translate-y-1/2 z-10 p-3 duration-200 hover:-translate-x-1 hover:scale-105"
      >
        <svg
          className="h-10 w-10 group-hover:scale-110"
          fill="none"
          viewBox="0 0 24 24"
        >
          <defs>
            <linearGradient id="arrowGradientLeft" x1="8" y1="5" x2="16" y2="19" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFD36B" />
              <stop offset="1" stopColor="#F58200" />
            </linearGradient>
          </defs>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={4}
            stroke="url(#arrowGradientLeft)"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </Link>

      <div>{children}</div>

      <Link
        href={nextPath}
        className="group fixed right-[5%] top-1/2 -translate-y-1/2 z-10 p-3 duration-200 hover:translate-x-1 hover:scale-105"
      >
        <svg
          className="h-10 w-10 group-hover:scale-110"
          fill="none"
          viewBox="0 0 24 24"
        >
          <defs>
            <linearGradient id="arrowGradientRight" x1="8" y1="5" x2="16" y2="19" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFD36B" />
              <stop offset="1" stopColor="#F58200" />
            </linearGradient>
          </defs>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={4}
            stroke="url(#arrowGradientRight)"
            d="M9 5l7 8-8 7"
          />
        </svg>
      </Link>
    </div>
  );
}
