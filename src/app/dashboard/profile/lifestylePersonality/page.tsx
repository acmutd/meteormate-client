"use client";
import React from "react";
import { useState, useEffect } from "react";
import LifestylePreferencesCard from "@/components/LifestylePreferencesCard";
import { DatePicker } from "@/components/DatePicker";
import { useToast } from "@/components/ui/ToastProvider";
import {
  loadOnboardingData,
  updateOnboardingData,
} from "@/utils/onboardingStorage";

export default function LifestylePersonalityPage() {
  const { toast } = useToast();

  const [selectedCookingPreference, setselectedCookingPreference] = useState<
    string | null
  >(null);
  const [selectedPetPreferences, setselectedPetPreferences] = useState<
    string | null
  >(null);
  const [selectedLivingPreference, setselectedLivingPreference] = useState<
    string | null
  >(null);
  const [selectedGuestsPreference, setSelectedGuestsPreferences] = useState<
    string | null
  >(null);
  const [selectedMoveInDate, setSelectedMoveInDate] = useState<string | null>(
    null,
  );

  const [hydrated, setHydrated] = useState(false); // again to keep track of the sekected oreferebces abd stuff

  useEffect(() => {
    // loading it once and the next use effect for the changes made and keeping track
    const saved = loadOnboardingData();
    setselectedCookingPreference(saved.cooking_frequency ?? null);
    setselectedPetPreferences(saved.pet_preference ?? null);
    setSelectedGuestsPreferences(saved.guests_frequency ?? null);
    setselectedLivingPreference(saved.housing_intent ?? null);
    setSelectedMoveInDate(saved.move_in_date ?? null);
    setHydrated(true);
  }, []);

  const handleUpdateProfile = () => {
    if (!hydrated) return;
    updateOnboardingData({
      cooking_frequency: selectedCookingPreference,
      pet_preference: selectedPetPreferences,
      guests_frequency: selectedGuestsPreference,
      housing_intent: selectedLivingPreference,
      move_in_date: selectedMoveInDate,
    });

    toast({
      type: "success",
      title: "Profile updated",
      description: "Your lifestyle personality preferences were saved.",
    });
  };

  const handleDateChange = (date: string | null) => {
    setSelectedMoveInDate(date);
  };

  const handleToggle = (
    currentValue: string | null,
    setValue: (val: string | null) => void,
    newValue: string,
  ) => {
    setValue(currentValue === newValue ? null : newValue);
  };

  // gets today based on local time to avoid utc shift
  const todayAsLocalYMD = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="flex flex-col justify-center items-center relative">
      <div className="w-[76%] max-h-192 bg-[#FFFFFF] rounded-2xl shadow-2xl flex flex-col">
        <div className="text-center mt-2 shrink-0">
          <p className="text-3xl font-bold">Lifestyle Personality</p>
          <p className="text-center text-md text-gray-600">
            Help us find your ideal roommate by selecting your preferences!
          </p>
        </div>
        <div className="py-8 px-15 w-full flex flex-col overflow-y-auto flex-1 custom-scrollbar">
          <p className="text-black text-sm mt-1 mb-2">How often do you cook?</p>
          {/*grid for the 3 options*/}
          <div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer">
            <LifestylePreferencesCard
              title="Never"
              imageSrc="/cooking_never_card.svg"
              isSelected={selectedCookingPreference === "never"}
              onClick={() =>
                handleToggle(
                  selectedCookingPreference,
                  setselectedCookingPreference,
                  "never",
                )
              }
            />
            <LifestylePreferencesCard
              title="Rarely"
              imageSrc="/cooking_rarely_card.svg"
              isSelected={selectedCookingPreference === "rarely"}
              onClick={() =>
                handleToggle(
                  selectedCookingPreference,
                  setselectedCookingPreference,
                  "rarely",
                )
              }
            />
            <LifestylePreferencesCard
              title="Often"
              imageSrc="/cooking_often_card.svg"
              isSelected={selectedCookingPreference === "often"}
              onClick={() =>
                handleToggle(
                  selectedCookingPreference,
                  setselectedCookingPreference,
                  "often",
                )
              }
            />
          </div>

          <p className="text-black text-sm mt-1 mb-2">Pet preferences?</p>
          <div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer">
            <LifestylePreferencesCard
              title="I'm okay with pets"
              imageSrc="/okay_with_pet_card.svg"
              isSelected={selectedPetPreferences === "okay"}
              onClick={() =>
                handleToggle(
                  selectedPetPreferences,
                  setselectedPetPreferences,
                  "okay",
                )
              }
            />
            <LifestylePreferencesCard
              title="I'm not okay with pets"
              imageSrc="/not_okay_with_pet_card.svg"
              isSelected={selectedPetPreferences === "not_okay"}
              onClick={() =>
                handleToggle(
                  selectedPetPreferences,
                  setselectedPetPreferences,
                  "not_okay",
                )
              }
            />
            <LifestylePreferencesCard
              title="I have a pet"
              imageSrc="/have_a_pet_card.svg"
              isSelected={selectedPetPreferences === "have_a_pet"}
              onClick={() =>
                handleToggle(
                  selectedPetPreferences,
                  setselectedPetPreferences,
                  "have_a_pet",
                )
              }
            />
          </div>

          <p className="text-black text-sm mt-1 mb-2">
            How often do you have guests over?
          </p>
          <div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer">
            <LifestylePreferencesCard
              title="Never"
              imageSrc="/guest_never_card.svg"
              isSelected={selectedGuestsPreference === "never"}
              onClick={() =>
                handleToggle(
                  selectedGuestsPreference,
                  setSelectedGuestsPreferences,
                  "never",
                )
              }
            />
            <LifestylePreferencesCard
              title="Sometimes"
              imageSrc="/guest_sometimes_card.svg"
              isSelected={selectedGuestsPreference === "sometimes"}
              onClick={() =>
                handleToggle(
                  selectedGuestsPreference,
                  setSelectedGuestsPreferences,
                  "sometimes",
                )
              }
            />
            <LifestylePreferencesCard
              title="Often"
              imageSrc="/guest_often_card.svg"
              isSelected={selectedGuestsPreference === "often"}
              onClick={() =>
                handleToggle(
                  selectedGuestsPreference,
                  setSelectedGuestsPreferences,
                  "often",
                )
              }
            />
          </div>

          <p className="text-black text-sm mt-1 mb-2">
            What is your move in date?
          </p>

          <div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer">
            <DatePicker
              value={selectedMoveInDate}
              onChange={handleDateChange}
              placeholder="Select a date"
              minDate={todayAsLocalYMD()}
            />
          </div>

          <p className="text-black text-sm mt-1 mb-2">
            Do you plan on living on-campus or off-campus?
          </p>

          <div className="grid grid-cols-2 place-items-center gap-4 mb-4 cursor-pointer">
            <LifestylePreferencesCard
              title="On-Campus"
              imageSrc="/on_campus_card.svg"
              isSelected={selectedLivingPreference === "on_campus"}
              onClick={() => {
                handleToggle(
                  selectedLivingPreference,
                  setselectedLivingPreference,
                  "on_campus",
                );
              }}
            />
            <LifestylePreferencesCard
              title="Off-Campus"
              imageSrc="/off_campus_card.svg"
              isSelected={selectedLivingPreference === "off_campus"}
              onClick={() => {
                handleToggle(
                  selectedLivingPreference,
                  setselectedLivingPreference,
                  "off_campus",
                );
              }}
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
  );
}
