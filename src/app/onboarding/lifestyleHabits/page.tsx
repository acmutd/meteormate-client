"use client";
import React from "react";
import { useState, useEffect} from "react";
import LifestylePreferencesCard from "../../../../components/LifestylePreferencesCard";
import NextStepButton from "../../../../components/NextStepButton";
import { useRouter } from "next/navigation";
import ProgressHeader from "../../../../components/ProgressHeader";
import {
  loadOnboardingData,
  updateOnboardingData,
} from "../../../utils/onboardingStorage"; // we are just storing the information here to save the progress and eventually send it all to the backend in one go

export default function LifestyleHabitsPage() {
    const router = useRouter();

    const [selectedCloseness, setSelectedCloseness] = useState<string | null>(
        null
    );
    const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
    const [selectedDealbreakers, setSelectedDealbreakers] = useState<string[]>([]);

    const [hydrated, setHydrated] = useState(false); // flag for pages

    useEffect(() => {
        const saved = loadOnboardingData();
        setSelectedCloseness(saved.roomate_closeness ?? null);
        if (Array.isArray(saved.habits)) {
            setSelectedHabits(saved.habits);
        }
        if (Array.isArray(saved.dealbreakers)) {
            setSelectedDealbreakers(saved.dealbreakers);
        }
        setHydrated(true);
  }, []);

    
    useEffect(() => {
    if (!hydrated) return;

    updateOnboardingData({
            roomate_closeness: selectedCloseness,
            habits: selectedHabits,
            dealbreakers: selectedDealbreakers,
    });
  }, [hydrated, selectedCloseness, selectedHabits, selectedDealbreakers]);
    
    const handleToggle = (
        currentValue: string | null,
        setValue: (val: string | null) => void,
        newValue: string
    ) => {
            setValue(currentValue === newValue ? null : newValue);
    };

    const handleHabitsToggle = (habit: string) => {
        setSelectedHabits((prev) => {
            if (prev.includes(habit)) {
                return prev.filter((i) => i !== habit);
            }
            return [...prev, habit];
        }
    )};

    const handleDealbreakerToggle = (dealbreaker: string) => {
        setSelectedDealbreakers((prev) => {
            if (prev.includes(dealbreaker)) {
                return prev.filter((i) => i !== dealbreaker);
            }
            return [...prev, dealbreaker];
        }
    )};

    const handleNextStep = () => {
        console.log(selectedCloseness, selectedHabits, selectedDealbreakers)
        router.push("/onboarding/interests");
    };
    return (
        <div>
            <ProgressHeader 
                title="Lifestyle Preferences"
                subtitle="Help us find your ideal roommate by selecting your preferences!"
                currentStep={3}
            />
            <div className="py-8 px-15 w-full flex flex-col">
                <h1 className="text-black text-xl font-bold">Closeness</h1>
                <p className="text-black text-sm mt-1 mb-2">
                    How close would you like to be with your roomates?
                </p>
                {/*grid for the 3 options*/}
                <div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer">
					<LifestylePreferencesCard
						title="Not Close"
						imageSrc="/images/roommate.webp"
						isSelected={selectedCloseness === "not_close"}
						onClick={() => handleToggle(selectedCloseness, setSelectedCloseness, "not_close")}
					/>
					<LifestylePreferencesCard
						title="Friends"
						imageSrc="/images/high-five.webp"
						isSelected={selectedCloseness === "friends"}
						onClick={() => handleToggle(selectedCloseness, setSelectedCloseness, "friends")}
					/>
					<LifestylePreferencesCard
						title="Close Friends"
						imageSrc="/images/best-friends.webp"
						isSelected={selectedCloseness === "close_friends"}
						onClick={() => handleToggle(selectedCloseness, setSelectedCloseness, "close_friends")}
					/>
				</div>
                <h1 className="text-black text-xl font-bold ">Habits</h1>
                <p className="text-black text-sm mt-1 mb-2">
                    Please select ALL that apply. This is only to help us match you.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4 cursor-pointer">
                    <LifestylePreferencesCard
                        title="Smoking/Vaping"
                        imageSrc="/images/orderly_card.webp"
                        isSelected={selectedHabits.includes("smoke_vape")}
                        onClick={() => handleHabitsToggle("smoke_vape")}
                    />
                    <LifestylePreferencesCard
                        title="Drinking"
                        imageSrc="/images/tidy_card.webp"
                        isSelected={selectedHabits.includes("drink")}
                        onClick={() => handleHabitsToggle("drink")}
                    />
                </div>
                <h1 className="text-black text-xl font-bold">Dealbreakers</h1>
                <p className="text-black text-sm mt-1 mb-2">
                    Please select all of your dealbreakers.
                </p>
                <div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer">
                    <LifestylePreferencesCard
                        title="Smoking/Vaping"
                        imageSrc="/images/quiet_card.webp"
                        isSelected={selectedDealbreakers.includes("smoke_vape")}
                        onClick={() => handleDealbreakerToggle("smoke_vape")}
                    />
                    <LifestylePreferencesCard
                        title="Drinking"
                        imageSrc="/images/moderate_card.webp"
                        isSelected={selectedDealbreakers.includes("drink")}
                        onClick={() => handleDealbreakerToggle("drink")}
                    />
                    <LifestylePreferencesCard
                        title="Co-ed roomates"
                        imageSrc="/images/social_card.webp"
                        isSelected={selectedDealbreakers.includes("same_gender")}
                        onClick={() => handleDealbreakerToggle("same_gender")}
                    />
                </div>
                <div className="flex justify-center">
                    <NextStepButton
                        className="mt-7"
                        logo={<img src="/images/peechi_duo.webp" />}
                        onClick={handleNextStep}
                        disabled = {!selectedCloseness }
                    />
                </div>
            </div>
        </div>
    );
}
