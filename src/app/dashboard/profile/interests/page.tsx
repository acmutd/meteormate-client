"use client";
import React, { useState, useEffect } from "react";
import InterestCard from "@/components/InterestCard";
import { useToast } from "@/components/ui/ToastProvider";
import {
  loadOnboardingData,
  updateOnboardingData,
} from "@/utils/onboardingStorage";

const INTEREST_ROWS = [
  ["Climbing", "Anime", "Running", "Instruments", "Reading", "Gaming"],
  ["Travel", "Blogging", "Movies", "Singing", "Shopping", "Cooking", "Art"],
  ["Organized", "Photos", "Basketball", "Music", "EDM", "Coding"],
  [
    "Bollywood",
    "Sleeping",
    "Scrapbook",
    "Legos",
    "D&D",
    "Soccer",
    "Pickleball",
  ],
  ["Chess", "Concerts", "K-Pop", "Dancing", "Languages", "Badminton"],
];

const MAX_SELECTIONS = 6;

export default function InterestsPage() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = loadOnboardingData();
    if (Array.isArray(saved.interests)) {
      setSelectedInterests(saved.interests);
    }
    setHydrated(true);
  }, []);

  const handleUpdateProfile = () => {
    if (!hydrated) return;

    updateOnboardingData({ interests: selectedInterests });
    toast({
      type: "success",
      title: "Profile updated",
      description: "Your interests were saved.",
    });
  };

  const handleToggle = (interest: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((i) => i !== interest);
      }
      if (prev.length >= MAX_SELECTIONS) {
        return prev;
      }
      return [...prev, interest];
    });
  };

  return (
    <div
      className="flex flex-col text-center justify-center items-center relative"
      style={{
        backgroundImage: "url('/stars_orange.svg')",
        backgroundSize: "cover",
      }}
    >
      <div className="w-[76%] h-192 bg-[#FFFFFF] rounded-2xl shadow-2xl">
        <div className="mt-8 ml-6 mr-6">
          <p className="text-3xl font-bold">Select Your Interests</p>
          <p className="text-center text-md text-gray-600 mb-6">
            Pick a few interests to show who you are! You may pick up to 6.
          </p>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col gap-4">
              {INTEREST_ROWS.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex gap-4 justify-center"
                  style={{
                    marginLeft: rowIndex % 2 === 1 ? "1rem" : "0",
                  }}
                >
                  {row.map((interest) => (
                    <InterestCard
                      key={interest}
                      name={interest}
                      isSelected={selectedInterests.includes(interest)}
                      onToggle={() => handleToggle(interest)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-8 mb-8">
          <button
            type="button"
            onClick={handleUpdateProfile}
            className="px-6 py-2 rounded-lg text-black font-medium shadow bg-linear-60 from-[#F28C00] to-[#FFC243] hover:from-[#d97706] hover:to-[#f59e0b] hover:shadow-md transition-all duration-200"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}
