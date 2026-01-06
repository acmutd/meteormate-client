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
		const lp = saved.lifestylePersonality;

		if (lp) {
		setselectedCookingPreference(lp.cookingPreference ?? null);
		setselectedPetPreferences(lp.petPreferences ?? null);
		setSelectedGuestsPreferences(lp.guestsPreference ?? null);
		setSelectedRoommatePreference(lp.roommatePreference ?? null);
		setselectedLivingPreference(lp.livingPreference ?? null);
		}

		setHydrated(true);
	}, []);

	useEffect(() => {
    if (!hydrated) return;
		updateOnboardingData({
		lifestylePersonality: {
			cookingPreference: selectedCookingPreference,
			petPreferences: selectedPetPreferences,
			guestsPreference: selectedGuestsPreference,
			roommatePreference: selectedRoommatePreference,
			livingPreference: selectedLivingPreference,
		},
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
						isSelected={selectedCookingPreference === "Never"}
						onClick={() => handleToggle(selectedCookingPreference, setselectedCookingPreference, "Never")}
					/>
					<LifestylePreferencesCard
						title="Rarely"
						imageSrc="/images/flambee.webp" // change this
						isSelected={selectedCookingPreference === "Rarely"}
						onClick={() => handleToggle(selectedCookingPreference, setselectedCookingPreference, "Rarely")}
					/>
					<LifestylePreferencesCard
						title="Often"
						imageSrc="/images/cooking-pots.webp" // change this
						isSelected={selectedCookingPreference === "Often"}
						onClick={() => handleToggle(selectedCookingPreference, setselectedCookingPreference, "Often")}
					/>
				</div>
				
				<p className="text-black text-sm mt-1 mb-2">
					Pet preferences? 
				</p>
				<div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer"> 
					<LifestylePreferencesCard
						title="I'm okay with pets"
						imageSrc="/images/pawprint.webp"
						isSelected={selectedPetPreferences === "Okay"}
						onClick={() => handleToggle(selectedPetPreferences, setselectedPetPreferences, "Okay")}
					/>
					<LifestylePreferencesCard
						title="I'm not okay with pets"
						imageSrc="/images/no-pets.webp"
						isSelected={selectedPetPreferences === "NotOkay"}
						onClick={() => handleToggle(selectedPetPreferences, setselectedPetPreferences, "NotOkay")}
					/>
					<LifestylePreferencesCard
						title="I have a pet"
						imageSrc="/images/pet.webp"
						isSelected={selectedPetPreferences === "HaveAPet"}
						onClick={() => handleToggle(selectedPetPreferences, setselectedPetPreferences, "HaveAPet")}
					/>
				</div>
				
				<p className="text-black text-sm mt-1 mb-2">
					How often do you have guests over?
				</p>
				<div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer">
					<LifestylePreferencesCard
						title="Never"
						imageSrc="/images/no-crowd.webp"
						isSelected={selectedGuestsPreference === "Never"}
						onClick={() => handleToggle(selectedGuestsPreference, setSelectedGuestsPreferences, "Never")}
					/>
					<LifestylePreferencesCard
						title="Sometimes"
						imageSrc="/images/group.webp"
						isSelected={selectedGuestsPreference === "Sometimes"}
						onClick={() => handleToggle(selectedGuestsPreference, setSelectedGuestsPreferences, "Sometimes")}
					/>
					<LifestylePreferencesCard
						title="Often"
						imageSrc="/images/friends.webp"
						isSelected={selectedGuestsPreference === "Often"}
						onClick={() => handleToggle(selectedGuestsPreference, setSelectedGuestsPreferences, "Often")}
					/>
				</div>

				<p className="text-black text-sm mt-1 mb-2">
					How close would you like to be with your roommates?
				</p>
				
				<div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer">
					<LifestylePreferencesCard
						title="Not Close"
						imageSrc="/images/roommate.webp"
						isSelected={selectedRoommatePreference === "NotClose"}
						onClick={() => handleToggle(selectedRoommatePreference, setSelectedRoommatePreference, "NotClose")}
					/>
					<LifestylePreferencesCard
						title="Friends"
						imageSrc="/images/high-five.webp"
						isSelected={selectedRoommatePreference === "Friends"}
						onClick={() => handleToggle(selectedRoommatePreference, setSelectedRoommatePreference, "Friends")}
					/>
					<LifestylePreferencesCard
						title="Close Friends"
						imageSrc="/images/best-friends.webp"
						isSelected={selectedRoommatePreference === "CloseFriends"}
						onClick={() => handleToggle(selectedRoommatePreference, setSelectedRoommatePreference, "CloseFriends")}
					/>
				</div>
                
				<p className="text-black text-sm mt-1 mb-2">
					Do you plan on living on-Campus or off-Campus?
				</p>
				
				<div className="grid grid-cols-2 place-items-center gap-4 mb-4 cursor-pointer">
					<LifestylePreferencesCard
						title="On Campus"
						imageSrc="/images/school.webp"
						isSelected={selectedLivingPreference === "onCampus"}
						onClick={() => {
							handleToggle(selectedLivingPreference, setselectedLivingPreference, "onCampus");
							}}

					/>
					<LifestylePreferencesCard
						title="Off Campus"
						imageSrc="/images/residential.webp"
						isSelected={selectedLivingPreference === "offCampus"}
						onClick={() => {
							handleToggle(selectedLivingPreference, setselectedLivingPreference, "offCampus");
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
