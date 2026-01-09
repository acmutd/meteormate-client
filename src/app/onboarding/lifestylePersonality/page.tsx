"use client";
import React from "react";
import { useState, useEffect } from "react";
import LifestylePreferencesCard from "../../../../components/LifestylePreferencesCard";
import NextStepButton from "../../../../components/NextStepButton";
import { useRouter } from "next/navigation";
import ProgressHeader from "../../../../components/ProgressHeader";
import { loadOnboardingData, updateOnboardingData } from "../../../utils/onboardingStorage";

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
    const [selectedRoommatePreference, setSelectedRoommatePreference] = useState<
		string | null
	>(null);

	const [hydrated, setHydrated] = useState(false);  // again to keep track of the sekected oreferebces abd stuff

	useEffect(() => { // loading it once and the next use effect for the changes made and keeping track
		const saved = loadOnboardingData();
		setselectedCookingPreference(saved.cooking_frequency ?? null);
		setselectedPetPreferences(saved.pet_preference ?? null);
		setSelectedGuestsPreferences(saved.guests_frequency ?? null);
		setSelectedRoommatePreference(saved.roomate_closeness ?? null);
		setselectedLivingPreference(saved.housing_intent ?? null);

		setHydrated(true);
	}, []);

	useEffect(() => {
    if (!hydrated) return;
		updateOnboardingData({
			cooking_frequency: selectedCookingPreference,
			pet_preference: selectedPetPreferences,
			guests_frequency: selectedGuestsPreference,
			roomate_closeness: selectedRoommatePreference,
			housing_intent: selectedLivingPreference,
		});
	}, [
		hydrated,
		selectedCookingPreference,
		selectedPetPreferences,
		selectedGuestsPreference,
		selectedRoommatePreference,
		selectedLivingPreference,
	]);

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
		});

		router.push(`/onboarding/housing?living=${encodeURIComponent(selectedLivingPreference ?? "")}`);
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
						imageSrc="/images/fire-sign-15238.webp" //need to change this
						isSelected={selectedCookingPreference === "never"}
						onClick={() => handleToggle(selectedCookingPreference, setselectedCookingPreference, "never")}
					/>
					<LifestylePreferencesCard
						title="Rarely"
						imageSrc="/images/flambee.webp" // change this
						isSelected={selectedCookingPreference === "rarely"}
						onClick={() => handleToggle(selectedCookingPreference, setselectedCookingPreference, "rarely")}
					/>
					<LifestylePreferencesCard
						title="Often"
						imageSrc="/images/cooking-pots.webp" // change this
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
						imageSrc="/images/pawprint.webp"
						isSelected={selectedPetPreferences === "okay"}
						onClick={() => handleToggle(selectedPetPreferences, setselectedPetPreferences, "okay")}
					/>
					<LifestylePreferencesCard
						title="I'm not okay with pets"
						imageSrc="/images/no-pets.webp"
						isSelected={selectedPetPreferences === "not_okay"}
						onClick={() => handleToggle(selectedPetPreferences, setselectedPetPreferences, "not_okay")}
					/>
					<LifestylePreferencesCard
						title="I have a pet"
						imageSrc="/images/pet.webp"
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
						imageSrc="/images/no-crowd.webp"
						isSelected={selectedGuestsPreference === "never"}
						onClick={() => handleToggle(selectedGuestsPreference, setSelectedGuestsPreferences, "never")}
					/>
					<LifestylePreferencesCard
						title="Sometimes"
						imageSrc="/images/group.webp"
						isSelected={selectedGuestsPreference === "sometimes"}
						onClick={() => handleToggle(selectedGuestsPreference, setSelectedGuestsPreferences, "sometimes")}
					/>
					<LifestylePreferencesCard
						title="Often"
						imageSrc="/images/friends.webp"
						isSelected={selectedGuestsPreference === "often"}
						onClick={() => handleToggle(selectedGuestsPreference, setSelectedGuestsPreferences, "often")}
					/>
				</div>

				<p className="text-black text-sm mt-1 mb-2">
					How close would you like to be with your roommates?
				</p>
				
				<div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer">
					<LifestylePreferencesCard
						title="Not Close"
						imageSrc="/images/roommate.webp"
						isSelected={selectedRoommatePreference === "not_close"}
						onClick={() => handleToggle(selectedRoommatePreference, setSelectedRoommatePreference, "not_close")}
					/>
					<LifestylePreferencesCard
						title="Friends"
						imageSrc="/images/high-five.webp"
						isSelected={selectedRoommatePreference === "friends"}
						onClick={() => handleToggle(selectedRoommatePreference, setSelectedRoommatePreference, "friends")}
					/>
					<LifestylePreferencesCard
						title="Close Friends"
						imageSrc="/images/best-friends.webp"
						isSelected={selectedRoommatePreference === "close_friends"}
						onClick={() => handleToggle(selectedRoommatePreference, setSelectedRoommatePreference, "close_friends")}
					/>
				</div>
                
				<p className="text-black text-sm mt-1 mb-2">
					Do you plan on living on-Campus or off-Campus?
				</p>
				
				<div className="grid grid-cols-2 place-items-center gap-4 mb-4 cursor-pointer">
					<LifestylePreferencesCard
						title="On Campus"
						imageSrc="/images/school.webp"
						isSelected={selectedLivingPreference === "on_campus"}
						onClick={() => {
							handleToggle(selectedLivingPreference, setselectedLivingPreference, "on_campus");
							}}

					/>
					<LifestylePreferencesCard
						title="Off Campus"
						imageSrc="/images/residential.webp"
						isSelected={selectedLivingPreference === "off_campus"}
						onClick={() => {
							handleToggle(selectedLivingPreference, setselectedLivingPreference, "off_campus");
						}}

					/>
					

				</div>
				<div className="flex justify-center">
					<NextStepButton
						className="mt-7"
						logo={<img src="/images/peechi_duo.webp" />}
						onClick={handleNextStep}
						disabled={!selectedLivingPreference || !selectedRoommatePreference || !selectedCookingPreference || !selectedGuestsPreference || !selectedPetPreferences}
					/>
				</div>
			</div>
		</div>
	);
}
