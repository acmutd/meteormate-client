"use client";
import React from "react";
import { useState, useEffect } from "react";
import LifestylePreferencesCard from "@/components/LifestylePreferencesCard";
import { useToast } from "@/components/ui/ToastProvider";
import {
  loadOnboardingData,
  updateOnboardingData,
} from "@/utils/onboardingStorage"; // we are just storing the information here to save the progress and eventually send it all to the backend in one go
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import UnsavedChangesDialog from "@/components/navigation/UnsavedChangesDialog";

interface LifestyleHabitsState {
  roommate_closeness: string | null;
  smoke_vape: boolean | null;
  drink: boolean | null;
  dealbreakers: string[];
}

export default function LifestyleHabitsPage() {
  const { toast } = useToast();

  const [selectedCloseness, setSelectedCloseness] = useState<string | null>(
    null,
  );
  const [selectedSmokeVape, setSelectedSmokeVape] = useState<boolean | null>(
    null,
  );
  const [selectedDrink, setSelectedDrink] = useState<boolean | null>(null);
  const [selectedDealbreakers, setSelectedDealbreakers] = useState<string[]>(
    [],
  );
  const [initialValues, setInitialValues] = useState<LifestyleHabitsState>({
    roommate_closeness: null,
    smoke_vape: null,
    drink: null,
    dealbreakers: [],
  });

  const [hydrated, setHydrated] = useState(false); // flag for pages

  const isDirty =
    hydrated &&
    (selectedCloseness !== initialValues.roommate_closeness ||
      selectedSmokeVape !== initialValues.smoke_vape ||
      selectedDrink !== initialValues.drink ||
      JSON.stringify(selectedDealbreakers) !==
        JSON.stringify(initialValues.dealbreakers));

  const { isDialogOpen, confirmNavigation, cancelNavigation } =
    useUnsavedChangesGuard({ isDirty });

  useEffect(() => {
    const saved = loadOnboardingData();
    const normalized: LifestyleHabitsState = {
      roommate_closeness: saved.roommate_closeness ?? null,
      smoke_vape: saved.smoke_vape ?? null,
      drink: saved.drink ?? null,
      dealbreakers: Array.isArray(saved.dealbreakers) ? saved.dealbreakers : [],
    };

    setSelectedCloseness(normalized.roommate_closeness);
    setSelectedSmokeVape(normalized.smoke_vape);
    setSelectedDrink(normalized.drink);
    setSelectedDealbreakers(normalized.dealbreakers);
    setInitialValues(normalized);
    setHydrated(true);
  }, []);

  const handleUpdateProfile = () => {
    if (!hydrated) return;

    updateOnboardingData({
      roommate_closeness: selectedCloseness,
      smoke_vape: selectedSmokeVape,
      drink: selectedDrink,
      dealbreakers: selectedDealbreakers,
    });

    setInitialValues({
      roommate_closeness: selectedCloseness,
      smoke_vape: selectedSmokeVape,
      drink: selectedDrink,
      dealbreakers: selectedDealbreakers,
    });

    toast({
      type: "success",
      title: "Profile updated",
      description: "Your lifestyle habits preferences were saved.",
    });
  };

  const handleToggle = (
    currentValue: string | null,
    setValue: (val: string | null) => void,
    newValue: string,
  ) => {
    setValue(currentValue === newValue ? null : newValue);
  };

  const toggleNullableTrue = (
    current: boolean | null,
    setValue: (val: boolean | null) => void,
  ) => {
    setValue(current === true ? null : true);
  };

  const handleDealbreakerToggle = (dealbreaker: string) => {
    setSelectedDealbreakers((prev) => {
      if (prev.includes(dealbreaker)) {
        return prev.filter((i) => i !== dealbreaker);
      }
      return [...prev, dealbreaker];
    });
  };
  
  return (
    <>
      <UnsavedChangesDialog
        isOpen={isDialogOpen}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
      />
      <div className="flex flex-col justify-center items-center relative">
        <div className="w-[76%] max-h-192 bg-[#FFFFFF] rounded-2xl shadow-2xl flex flex-col">
        <div className="text-center mt-2 shrink-0">
          <p className="text-3xl font-bold">Lifestyle Preferences</p>
          <p className="text-center text-md text-gray-600">
            Help us find your ideal roommate by selecting your preferences!
          </p>
        </div>
        <div className="py-8 px-15 w-full flex flex-col">
          <h1 className="text-black text-xl font-bold">Closeness</h1>
          <p className="text-black text-sm mt-1 mb-2">
            How close would you like to be with your roommates?
          </p>
          {/*grid for the 3 options*/}
          <div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer">
            <LifestylePreferencesCard
              title="Not Close"
              imageSrc="/not_close_card.svg"
              isSelected={selectedCloseness === "not_close"}
              onClick={() =>
                handleToggle(
                  selectedCloseness,
                  setSelectedCloseness,
                  "not_close",
                )
              }
            />
            <LifestylePreferencesCard
              title="Friends"
              imageSrc="/friends_card.svg"
              isSelected={selectedCloseness === "friends"}
              onClick={() =>
                handleToggle(selectedCloseness, setSelectedCloseness, "friends")
              }
            />
            <LifestylePreferencesCard
              title="Close Friends"
              imageSrc="/close_friends_card.svg"
              isSelected={selectedCloseness === "close_friends"}
              onClick={() =>
                handleToggle(
                  selectedCloseness,
                  setSelectedCloseness,
                  "close_friends",
                )
              }
            />
          </div>
          <h1 className="text-black text-xl font-bold ">Habits</h1>
          <p className="text-black text-sm mt-1 mb-2">
            Please select ALL that apply. This is only to help us match you.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-4 cursor-pointer">
            <LifestylePreferencesCard
              title="Smoking/Vaping"
              imageSrc="/smoking_vaping_card.svg"
              isSelected={selectedSmokeVape === true}
              onClick={() =>
                toggleNullableTrue(selectedSmokeVape, setSelectedSmokeVape)
              }
            />

            <LifestylePreferencesCard
              title="Drinking"
              imageSrc="/drinking_card.svg"
              isSelected={selectedDrink === true}
              onClick={() =>
                toggleNullableTrue(selectedDrink, setSelectedDrink)
              }
            />
          </div>
          <h1 className="text-black text-xl font-bold">Dealbreakers</h1>
          <p className="text-black text-sm mt-1 mb-2">
            Please select all of your dealbreakers.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer">
            <LifestylePreferencesCard
              title="Smoking/Vaping"
              imageSrc="/smoking_vaping_card.svg"
              isSelected={selectedDealbreakers.includes("smoke_vape")}
              onClick={() => handleDealbreakerToggle("smoke_vape")}
            />
            <LifestylePreferencesCard
              title="Drinking"
              imageSrc="/drinking_card.svg"
              isSelected={selectedDealbreakers.includes("drink")}
              onClick={() => handleDealbreakerToggle("drink")}
            />
            <LifestylePreferencesCard
              title="Same Gender Roommates"
              imageSrc="/co-ed_roomates_card.svg"
              isSelected={selectedDealbreakers.includes("same_gender")}
              onClick={() => handleDealbreakerToggle("same_gender")}
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
