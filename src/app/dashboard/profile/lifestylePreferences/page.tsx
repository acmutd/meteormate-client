"use client";
import React from "react";
import { useState, useEffect } from "react";
import LifestylePreferencesCard from "@/components/LifestylePreferencesCard";
import {
  loadOnboardingData,
  updateOnboardingData,
} from "@/utils/onboardingStorage";

export default function LifestylePreferencesPage() {
  const [selectedWakeupTime, setSelectedWakeupTime] = useState<string | null>(
    null,
  );
  const [selectedCleanliness, setSelectedCleanliness] = useState<string | null>(
    null,
  );
  const [selectedNoiseTolerance, setSelectedNoiseTolerance] = useState<
    string | null
  >(null);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadOnboardingData();
    setSelectedWakeupTime(saved.wake_time ?? null);
    setSelectedCleanliness(saved.cleanliness ?? null);
    setSelectedNoiseTolerance(saved.noise_tolerance ?? null);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    updateOnboardingData({
      wake_time: selectedWakeupTime,
      cleanliness: selectedCleanliness,
      noise_tolerance: selectedNoiseTolerance,
    });
  }, [
    hydrated,
    selectedWakeupTime,
    selectedCleanliness,
    selectedNoiseTolerance,
  ]);

  const handleToggle = (
    currentValue: string | null,
    setValue: (val: string | null) => void,
    newValue: string,
  ) => {
    setValue(currentValue === newValue ? null : newValue);
  };

  return (
    <div
      className="flex flex-col justify-center items-center relative"
      style={{
        backgroundImage: "url('/stars_orange.svg')",
        backgroundSize: "cover",
      }}
    >
      <div className="w-[76%] min-h-180 bg-[#FFFFFF] rounded-2xl shadow-2xl">
        <div className="text-center mt-2">
          <p className="text-3xl font-bold">Lifestyle Preferences</p>
          <p className="text-center text-md text-gray-600">
            Help us find your ideal roommate by selecting your preferences!
          </p>
        </div>
        <div className="py-8 px-15 w-full flex flex-col">
          <h1 className="text-black text-xl font-bold">Wake-up Time</h1>
          <p className="text-black text-sm mt-1 mb-2">
            When are you generally the most active?
          </p>
          <div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer">
            <LifestylePreferencesCard
              title="Early Bird"
              imageSrc="/early_bird_card.svg"
              isSelected={selectedWakeupTime === "early_bird"}
              onClick={() =>
                handleToggle(
                  selectedWakeupTime,
                  setSelectedWakeupTime,
                  "early_bird",
                )
              }
            />
            <LifestylePreferencesCard
              title="Flexible"
              imageSrc="/flexible_card.svg"
              isSelected={selectedWakeupTime === "flexible"}
              onClick={() =>
                handleToggle(
                  selectedWakeupTime,
                  setSelectedWakeupTime,
                  "flexible",
                )
              }
            />
            <LifestylePreferencesCard
              title="Night Owl"
              imageSrc="/night_owl_card.svg"
              isSelected={selectedWakeupTime === "night_owl"}
              onClick={() =>
                handleToggle(
                  selectedWakeupTime,
                  setSelectedWakeupTime,
                  "night_owl",
                )
              }
            />
          </div>
          <h1 className="text-black text-xl font-bold ">Cleanliness</h1>
          <p className="text-black text-sm mt-1 mb-2">
            What is your preferred level of tidiness?
          </p>
          <div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer">
            <LifestylePreferencesCard
              title="Relaxed"
              imageSrc="/cleanliness_relaxed_card.svg"
              isSelected={selectedCleanliness === "relaxed"}
              onClick={() =>
                handleToggle(
                  selectedCleanliness,
                  setSelectedCleanliness,
                  "relaxed",
                )
              }
            />
            <LifestylePreferencesCard
              title="Tidy"
              imageSrc="/cleanliness_tidy_card.svg"
              isSelected={selectedCleanliness === "tidy"}
              onClick={() =>
                handleToggle(
                  selectedCleanliness,
                  setSelectedCleanliness,
                  "tidy",
                )
              }
            />
            <LifestylePreferencesCard
              title="Neat Freak"
              imageSrc="/cleanliness_neat_freak_card.svg"
              isSelected={selectedCleanliness === "neat_freak"}
              onClick={() =>
                handleToggle(
                  selectedCleanliness,
                  setSelectedCleanliness,
                  "neat_freak",
                )
              }
            />
          </div>
          <h1 className="text-black text-xl font-bold">Noise Tolerance</h1>
          <p className="text-black text-sm mt-1 mb-2">
            What noise level are you comfortable with?
          </p>
          <div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer">
            <LifestylePreferencesCard
              title="Quiet"
              imageSrc="/quiet_card.svg"
              isSelected={selectedNoiseTolerance === "quiet"}
              onClick={() =>
                handleToggle(
                  selectedNoiseTolerance,
                  setSelectedNoiseTolerance,
                  "quiet",
                )
              }
            />
            <LifestylePreferencesCard
              title="Moderate"
              imageSrc="/moderate_card.svg"
              isSelected={selectedNoiseTolerance === "moderate"}
              onClick={() =>
                handleToggle(
                  selectedNoiseTolerance,
                  setSelectedNoiseTolerance,
                  "moderate",
                )
              }
            />
            <LifestylePreferencesCard
              title="Loud"
              imageSrc="/loud_card.svg"
              isSelected={selectedNoiseTolerance === "loud"}
              onClick={() =>
                handleToggle(
                  selectedNoiseTolerance,
                  setSelectedNoiseTolerance,
                  "loud",
                )
              }
            />
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              title="NOT IMPLEMENTED YET" // delete later
              className="px-6 py-2 rounded-lg text-black font-medium shadow bg-linear-60 from-[#F28C00] to-[#FFC243]"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
