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

export default function LifestyleHabitsPage() {
    const router = useRouter();

    const [selectedCloseness, setSelectedCloseness] = useState<string | null>(
        null
    );
    const [selectedSmokeVape, setSelectedSmokeVape] = useState<boolean>(
        false
    );
    const [selectedDrink, setSelectedDrink] = useState<boolean>(
        false
    );
    const [selectedDealbreakers, setSelectedDealbreakers] = useState<string[]>([]);

    const [hydrated, setHydrated] = useState(false); // flag for pages

    useEffect(() => {
        const saved = loadOnboardingData();
        setSelectedCloseness(saved.roommate_closeness ?? null);
        setSelectedSmokeVape(saved.smoke_vape ?? false);
        setSelectedDrink(saved.drink ?? false);
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

    const toggleBoolean = (
        current: boolean,
        setValue: (val: boolean) => void
    ) => {
        setValue(!current);
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
        router.push("/onboarding/interests");
    };
    return (
        <div className="flex flex-col min-h-screen items-center">
            <ProgressHeader
                title="Lifestyle Preferences"
                subtitle="Help us find your ideal roommate by selecting your preferences!"
                currentStep={4}
                progressImage="/peechi_progress_4.svg"
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
                        imageSrc="/not_close_card.svg"
                        isSelected={selectedCloseness === "not_close"}
                        onClick={() => handleToggle(selectedCloseness, setSelectedCloseness, "not_close")}
                    />
                    <LifestylePreferencesCard
                        title="Friends"
                        imageSrc="/friends_card.svg"
                        isSelected={selectedCloseness === "friends"}
                        onClick={() => handleToggle(selectedCloseness, setSelectedCloseness, "friends")}
                    />
                    <LifestylePreferencesCard
                        title="Close Friends"
                        imageSrc="/close_friends_card.svg"
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
                        imageSrc="/smoking_vaping_card.svg"
                        isSelected={selectedSmokeVape === true}
                        onClick={() => toggleBoolean(selectedSmokeVape, setSelectedSmokeVape)}
                    />

                    <LifestylePreferencesCard
                        title="Drinking"
                        imageSrc="/drinking_card.svg"
                        isSelected={selectedDrink === true}
                        onClick={() => toggleBoolean(selectedDrink, setSelectedDrink)}
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
