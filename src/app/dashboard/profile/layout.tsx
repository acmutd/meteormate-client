"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname(); 
  const router = useRouter(); 

  const profileSections = [
    { path: "/dashboard/profile", label: "Profile" },
    { path: "/dashboard/profile/lifestylePreferences", label: "Preferences" },
    { path: "/dashboard/profile/lifestylePersonality", label: "Personality" },
    { path: "/dashboard/profile/lifestyleHabits", label: "Habits" },
    { path: "/dashboard/profile/interests", label: "Interests" },
    { path: "/dashboard/profile/housing", label: "Housing" },
  ];

  const currentIndex = profileSections.findIndex(
    (section) => section.path === pathname
  );

  const handlePrevious = () => {
    const prevIndex =
      currentIndex === 0 ? profileSections.length - 1 : currentIndex - 1;
    router.push(profileSections[prevIndex].path);
  };

  const handleNext = () => {
    const nextIndex =
      currentIndex === profileSections.length - 1 ? 0 : currentIndex + 1;
    router.push(profileSections[nextIndex].path);
  };

  return (
    <div className="relative">
      <button
        onClick={handlePrevious}
        className="fixed left-[22%] top-1/2 -translate-y-1/2 z-10 p-3"
      >
        <svg
          className="w-6 h-6 text-[#FF9100]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={4}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div>{children}</div>

      <button
        onClick={handleNext}
        className="fixed right-[5%] top-1/2 -translate-y-1/2 z-10 p-3"
      >
        <svg
          className="w-6 h-6 text-[#FF9100]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={4}
            d="M9 5l7 8-8 7"
          />
        </svg>
      </button>
    </div>
  );
}
