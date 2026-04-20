"use client";
import React, { useState, useEffect } from "react";
import InterestCard from "@/components/InterestCard";
import { useToast } from "@/components/ui/ToastProvider";
import {
  loadOnboardingData,
  updateOnboardingData,
} from "@/utils/onboardingStorage";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import UnsavedChangesDialog from "@/components/navigation/UnsavedChangesDialog";
import { getMySurvey, upsertSurvey } from "@/utils/api/survey";

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
  const [initialInterests, setInitialInterests] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [surveyExists, setSurveyExists] = useState(false);
  const { toast } = useToast();

  const isDirty =
    hydrated &&
    JSON.stringify(selectedInterests) !== JSON.stringify(initialInterests);

  const { isDialogOpen, confirmNavigation, cancelNavigation } =
    useUnsavedChangesGuard({ isDirty });

  useEffect(() => {
    const hydrateFromStorageAndBackend = async () => {
      const saved = loadOnboardingData();
      const fallback = Array.isArray(saved.interests)
        ? saved.interests
        : [];

      let normalized = fallback;

      try {
        const survey = await getMySurvey();
        normalized = Array.isArray(survey.interests)
          ? (survey.interests as string[])
          : fallback;
        setSurveyExists(true);
      } catch (error) {
        console.warn(
          "Failed to load survey from backend, using local draft",
          error,
        );
        setSurveyExists(false);
      }

      setSelectedInterests(normalized);
      setInitialInterests(normalized);
      setHydrated(true);
    };

    void hydrateFromStorageAndBackend();
  }, []);

  const handleUpdateProfile = async () => {
    if (!hydrated) return;

    try {
      const payload = { interests: selectedInterests };

      await upsertSurvey(payload, surveyExists);
      updateOnboardingData(payload);
      setInitialInterests(selectedInterests);
      toast({
        type: "success",
        title: "Profile updated",
        description: "Your interests were saved.",
      });
    } catch (error) {
      console.error("Failed to save interests", error);
      toast({
        type: "error",
        title: "Save failed",
        description: "Something wrong happened. Please try again.",
      });
    }
  };

  const handleToggle = (interest: string) => {
    const isAlreadySelected = selectedInterests.includes(interest);
    const hasReachedLimit = selectedInterests.length >= MAX_SELECTIONS;

    if (!isAlreadySelected && hasReachedLimit) {
      toast({
        type: "error",
        title: "Limit Reached",
        description: `You can only select up to ${MAX_SELECTIONS} interests.`,
      });
      return;
    }

    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((i) => i !== interest);
      }
      return [...prev, interest];
    });
  };

  return (
    <>
      <UnsavedChangesDialog
        isOpen={isDialogOpen}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
      />
      <div className="flex flex-col text-center justify-center items-center relative">
        <div className="w-[76%] h-192 bg-[#FFFFFF] rounded-2xl shadow-2xl">
        <div className="text-center mt-2 relative">
          <button
            type="button"
            onClick={handleUpdateProfile}
            disabled={!isDirty}
            className="absolute right-8 top-4 px-6 py-2 rounded-lg text-black font-medium shadow bg-linear-60 from-[#F28C00] to-[#FFC243] hover:from-[#d97706] hover:to-[#f59e0b] hover:shadow-md transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Update Profile
          </button>
          <p className="text-3xl font-bold">Select Your Interests</p>
          <p className="text-center text-md text-gray-600 mb-14">
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
        </div>
      </div>
    </>
  );
}
