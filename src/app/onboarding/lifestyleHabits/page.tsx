"use client";
import React from "react";
import {useState, useEffect} from "react";
import LifestylePreferencesCard from "@/components/LifestylePreferencesCard";
import NextStepButton from "@/components/NextStepButton";
import {useRouter} from "next/navigation";
import ProgressHeader from "@/components/ProgressHeader";
import {
    loadOnboardingData,
    updateOnboardingData,
} from "@/utils/onboardingStorage"; // we are just storing the information here to save the progress and eventually send it all to the backend in one go
import Image from "next/image";

export default function LifestyleHabitsPage() {
    const router = useRouter();

    const [selectedCloseness, setSelectedCloseness] = useState<string | null>(
        null
    );
    const [selectedSmokeVape, setSelectedSmokeVape] = useState<boolean | null>(
        null
    );
    const [selectedDrink, setSelectedDrink] = useState<boolean | null>(
        null
    );
    const [selectedDealbreakers, setSelectedDealbreakers] = useState<string[]>([]);

    const [hydrated, setHydrated] = useState(false); // flag for pages

    useEffect(() => {
        const saved = loadOnboardingData();
        setSelectedCloseness(saved.roommate_closeness ?? null);
        setSelectedSmokeVape(saved.smoke_vape ?? null);
        setSelectedDrink(saved.drink ?? null);
        if (Array.isArray(saved.dealbreakers)) {
            setSelectedDealbreakers(saved.dealbreakers);
        }
        setHydrated(true);
    }, []);


    useEffect(() => {
        if (!hydrated) return;

        updateOnboardingData({
            roommate_closeness: selectedCloseness,
            smoke_vape: selectedSmokeVape,
            drink: selectedDrink,
            dealbreakers: selectedDealbreakers,
        });
    }, [hydrated, selectedCloseness, selectedSmokeVape, selectedDrink, selectedDealbreakers]);

    const handleToggle = (
        currentValue: string | null,
        setValue: (val: string | null) => void,
        newValue: string
    ) => {
        setValue(currentValue === newValue ? null : newValue);
    };

    const toggleNullableTrue = (
        current: boolean | null,
        setValue: (val: boolean | null) => void
    ) => {
        setValue(current === true ? null : true);
    };

    const handleDealbreakerToggle = (dealbreaker: string) => {
        setSelectedDealbreakers((prev) => {
                if (prev.includes(dealbreaker)) {
                    return prev.filter((i) => i !== dealbreaker);
                }
                return [...prev, dealbreaker];
            }
        )
    };

    const handleNextStep = () => {
        console.log(selectedCloseness, selectedSmokeVape, selectedDrink, selectedDealbreakers)
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
                    How close would you like to be with your roommates?
                </p>
                {/*grid for the 3 options*/}
                <div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer">
                    <LifestylePreferencesCard
                        title="Not Close"
                        imageSrc="/roommate.webp"
                        isSelected={selectedCloseness === "not_close"}
                        onClick={() => handleToggle(selectedCloseness, setSelectedCloseness, "not_close")}
                    />
                    <LifestylePreferencesCard
                        title="Friends"
                        imageSrc="/high-five.webp"
                        isSelected={selectedCloseness === "friends"}
                        onClick={() => handleToggle(selectedCloseness, setSelectedCloseness, "friends")}
                    />
                    <LifestylePreferencesCard
                        title="Close Friends"
                        imageSrc="/best-friends.webp"
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
                        imageSrc="/orderly_card.webp"
                        isSelected={selectedSmokeVape === true}
                        onClick={() => toggleNullableTrue(selectedSmokeVape, setSelectedSmokeVape)}
                    />

                    <LifestylePreferencesCard
                        title="Drinking"
                        imageSrc="/tidy_card.webp"
                        isSelected={selectedDrink === true}
                        onClick={() => toggleNullableTrue(selectedDrink, setSelectedDrink)}
                    />
                </div>
                <h1 className="text-black text-xl font-bold">Dealbreakers</h1>
                <p className="text-black text-sm mt-1 mb-2">
                    Please select all of your dealbreakers.
                </p>
                <div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer">
                    <LifestylePreferencesCard
                        title="Smoking/Vaping"
                        imageSrc="/quiet_card.webp"
                        isSelected={selectedDealbreakers.includes("smoke_vape")}
                        onClick={() => handleDealbreakerToggle("smoke_vape")}
                    />
                    <LifestylePreferencesCard
                        title="Drinking"
                        imageSrc="/moderate_card.webp"
                        isSelected={selectedDealbreakers.includes("drink")}
                        onClick={() => handleDealbreakerToggle("drink")}
                    />
                    <LifestylePreferencesCard
                        title="Same Gender Roommates"
                        imageSrc="/social_card.webp"
                        isSelected={selectedDealbreakers.includes("same_gender")}
                        onClick={() => handleDealbreakerToggle("same_gender")}
                    />
                </div>
                <div className="flex justify-center">
                    <NextStepButton
                        className="mt-7"
                        onClick={handleNextStep}
                        disabled={!selectedCloseness}
                    />
                </div>
            </div>
        </div>
    );
}
