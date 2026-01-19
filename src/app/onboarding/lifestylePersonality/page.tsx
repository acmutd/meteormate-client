"use client";
import React from "react";
import { useState, useEffect } from "react";
import LifestylePreferencesCard from "@/components/LifestylePreferencesCard";
import NextStepButton from "@/components/NextStepButton";
import { DatePicker } from "@/components/DatePicker";
import { useRouter } from "next/navigation";
import ProgressHeader from "@/components/ProgressHeader";
import { loadOnboardingData, updateOnboardingData } from "@/utils/onboardingStorage";
import Image from "next/image";

export default function LifestylePersonalityPage() {
	const router = useRouter();

	const [selectedCookingPreference, setselectedCookingPreference] = useState<string | null>(
		null
	);
	const [selectedPetPreferences, setselectedPetPreferences] = useState<string | null>(
		null
	);
	const [selectedLivingPreference, setselectedLivingPreference] = useState<
		string | null
	>(null);
    const [selectedGuestsPreference, setSelectedGuestsPreferences] = useState<
		string | null
	>(null);
    const [selectedMoveInDate, setSelectedMoveInDate] = useState<string | null>(null);

	const [hydrated, setHydrated] = useState(false);  // again to keep track of the sekected oreferebces abd stuff

	useEffect(() => { // loading it once and the next use effect for the changes made and keeping track
		const saved = loadOnboardingData();
		setselectedCookingPreference(saved.cooking_frequency ?? null);
		setselectedPetPreferences(saved.pet_preference ?? null);
		setSelectedGuestsPreferences(saved.guests_frequency ?? null);
		setselectedLivingPreference(saved.housing_intent ?? null);
        setSelectedMoveInDate(saved.move_in_date ?? null);
        setHydrated(true);
	}, []);

	useEffect(() => {
    if (!hydrated) return;
		updateOnboardingData({
			cooking_frequency: selectedCookingPreference,
			pet_preference: selectedPetPreferences,
			guests_frequency: selectedGuestsPreference,
			housing_intent: selectedLivingPreference,
            move_in_date: selectedMoveInDate
		});
	}, [
		hydrated,
		selectedCookingPreference,
		selectedPetPreferences,
		selectedGuestsPreference,
		selectedLivingPreference,
        selectedMoveInDate
	]);

    const handleDateChange = (date: string | null) => {
        setSelectedMoveInDate(date);
    };

	const handleToggle = (
		currentValue: string | null,
		setValue: (val: string | null) => void,
		newValue: string
	) => {
		setValue(currentValue === newValue ? null : newValue);
  	};

	const handleNextStep = () => {
		// really to check if we got the stuff needed or not and debugging later
		console.log("handling next step");
		console.log({
			selectedCookingPreference,
			selectedPetPreferences,
			selectedLivingPreference,
            selectedMoveInDate
		});

		router.push(`/onboarding/housing?living=${encodeURIComponent(selectedLivingPreference ?? "")}`);
	};

    // gets today based on local time to avoid utc shift
    const todayAsLocalYMD = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

	return (
		<div>
			<ProgressHeader 
				title="Lifestyle Personality"
				subtitle="Help us find your ideal roommate by selecting your preferences!"
				currentStep={4}
			/>
			<div className="py-8 px-15 w-full flex flex-col">
				<p className="text-black text-sm mt-1 mb-2">
					How often do you cook?
				</p>
				{/*grid for the 3 options*/}
				<div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer">
					<LifestylePreferencesCard
						title="Never"
						imageSrc="/fire-sign-15238.webp" //need to change this
						isSelected={selectedCookingPreference === "never"}
						onClick={() => handleToggle(selectedCookingPreference, setselectedCookingPreference, "never")}
					/>
					<LifestylePreferencesCard
						title="Rarely"
						imageSrc="/flambee.webp" // change this
						isSelected={selectedCookingPreference === "rarely"}
						onClick={() => handleToggle(selectedCookingPreference, setselectedCookingPreference, "rarely")}
					/>
					<LifestylePreferencesCard
						title="Often"
						imageSrc="/cooking-pots.webp" // change this
						isSelected={selectedCookingPreference === "often"}
						onClick={() => handleToggle(selectedCookingPreference, setselectedCookingPreference, "often")}
					/>
				</div>
				
				<p className="text-black text-sm mt-1 mb-2">
					Pet preferences? 
				</p>
				<div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer"> 
					<LifestylePreferencesCard
						title="I'm okay with pets"
						imageSrc="/pawprint.webp"
						isSelected={selectedPetPreferences === "okay"}
						onClick={() => handleToggle(selectedPetPreferences, setselectedPetPreferences, "okay")}
					/>
					<LifestylePreferencesCard
						title="I'm not okay with pets"
						imageSrc="/no-pets.webp"
						isSelected={selectedPetPreferences === "not_okay"}
						onClick={() => handleToggle(selectedPetPreferences, setselectedPetPreferences, "not_okay")}
					/>
					<LifestylePreferencesCard
						title="I have a pet"
						imageSrc="/pet.webp"
						isSelected={selectedPetPreferences === "have_a_pet"}
						onClick={() => handleToggle(selectedPetPreferences, setselectedPetPreferences, "have_a_pet")}
					/>
				</div>
				
				<p className="text-black text-sm mt-1 mb-2">
					How often do you have guests over?
				</p>
				<div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer">
					<LifestylePreferencesCard
						title="Never"
						imageSrc="/no-crowd.webp"
						isSelected={selectedGuestsPreference === "never"}
						onClick={() => handleToggle(selectedGuestsPreference, setSelectedGuestsPreferences, "never")}
					/>
					<LifestylePreferencesCard
						title="Sometimes"
						imageSrc="/group.webp"
						isSelected={selectedGuestsPreference === "sometimes"}
						onClick={() => handleToggle(selectedGuestsPreference, setSelectedGuestsPreferences, "sometimes")}
					/>
					<LifestylePreferencesCard
						title="Often"
						imageSrc="/friends.webp"
						isSelected={selectedGuestsPreference === "often"}
						onClick={() => handleToggle(selectedGuestsPreference, setSelectedGuestsPreferences, "often")}
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
						imageSrc="/school.webp"
						isSelected={selectedLivingPreference === "on_campus"}
						onClick={() => {
							handleToggle(selectedLivingPreference, setselectedLivingPreference, "on_campus");
							}}

					/>
					<LifestylePreferencesCard
						title="Off-Campus"
						imageSrc="/residential.webp"
						isSelected={selectedLivingPreference === "off_campus"}
						onClick={() => {
							handleToggle(selectedLivingPreference, setselectedLivingPreference, "off_campus");
						}}

					/>
					

				</div>
				<div className="flex justify-center">
					<NextStepButton
						className="mt-7"
						logo={<Image src="/peechi_duo.webp"  alt="Peechi mascot"/>}
						onClick={handleNextStep}
						disabled={!selectedLivingPreference || !selectedMoveInDate || !selectedCookingPreference || !selectedGuestsPreference || !selectedPetPreferences}
					/>
				</div>
			</div>
		</div>
	);
}
