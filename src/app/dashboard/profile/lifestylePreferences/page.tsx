"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import LifestylePreferencesCard from "@/components/LifestylePreferencesCard";
import {
  loadOnboardingData,
  updateOnboardingData,
} from "@/utils/onboardingStorage";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import UnsavedChangesDialog from "@/components/navigation/UnsavedChangesDialog";

interface LifestylePreferencesState {
  wake_time: string | null;
  cleanliness: string | null;
  noise_tolerance: string | null;
}

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
  const [initialValues, setInitialValues] = useState<LifestylePreferencesState>({
    wake_time: null,
    cleanliness: null,
    noise_tolerance: null,
  });

  const [hydrated, setHydrated] = useState(false);
  const { toast } = useToast();

  const isDirty =
    hydrated &&
    (selectedWakeupTime !== initialValues.wake_time ||
      selectedCleanliness !== initialValues.cleanliness ||
      selectedNoiseTolerance !== initialValues.noise_tolerance);

  const { isDialogOpen, confirmNavigation, cancelNavigation } =
    useUnsavedChangesGuard({ isDirty });

  useEffect(() => {
    const saved = loadOnboardingData();
    const normalized: LifestylePreferencesState = {
      wake_time: saved.wake_time ?? null,
      cleanliness: saved.cleanliness ?? null,
      noise_tolerance: saved.noise_tolerance ?? null,
    };

    setSelectedWakeupTime(normalized.wake_time);
    setSelectedCleanliness(normalized.cleanliness);
    setSelectedNoiseTolerance(normalized.noise_tolerance);
    setInitialValues(normalized);
    setHydrated(true);
  }, []);

  const handleUpdateProfile = () => {
    if (!hydrated) return;

    updateOnboardingData({
      wake_time: selectedWakeupTime,
      cleanliness: selectedCleanliness,
      noise_tolerance: selectedNoiseTolerance,
    });

    setInitialValues({
      wake_time: selectedWakeupTime,
      cleanliness: selectedCleanliness,
      noise_tolerance: selectedNoiseTolerance,
    });

    toast({
      type: "success",
      title: "Profile updated",
      description: "Your lifestyle preferences were saved.",
    });
  };

  const handleToggle = (
    currentValue: string | null,
    setValue: (val: string | null) => void,
    newValue: string,
  ) => {
    setValue(currentValue === newValue ? null : newValue);
  };

  return (
    <>
      <UnsavedChangesDialog
        isOpen={isDialogOpen}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
      />
      <div className="flex flex-col justify-center items-center relative">
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
                onClick={handleUpdateProfile}
                className="px-6 py-2 rounded-lg text-black font-medium shadow bg-linear-60 from-[#F28C00] to-[#FFC243] hover:from-[#d97706] hover:to-[#f59e0b] hover:shadow-md transition-all duration-200"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
