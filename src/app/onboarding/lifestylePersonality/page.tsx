"use client";
import React from "react";
import { useState } from "react";
import LifestylePreferencesCard from "../../../../components/LifestylePreferencesCard";
import NextStepButton from "../../../../components/NextStepButton";
import { useRouter } from "next/navigation";
import ProgressHeader from "../../../../components/ProgressHeader";

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

	const handleToggle = (
		currentValue: string | null,
		setValue: (val: string | null) => void,
		newValue: string
	) => {
		if (currentValue === newValue) {
      setValue(null);
    } else {
      setValue(newValue);
    }
	}

	

	const handleNextStep = () => {
		// Logic to handle the next step action
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
						imageSrc="/images/fire-sign-15238.png" //need to change this
						isSelected={selectedCookingPreference === "Never"}
						onClick={() => handleToggle(selectedCookingPreference, setselectedCookingPreference, "Never")}
					/>
					<LifestylePreferencesCard
						title="Rarely"
						imageSrc="/images/flambee.png" // change this
						isSelected={selectedCookingPreference === "Rarely"}
						onClick={() => handleToggle(selectedCookingPreference, setselectedCookingPreference, "Rarely")}
					/>
					<LifestylePreferencesCard
						title="Often"
						imageSrc="/images/cooking-pots.png" // change this
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
						imageSrc="/images/pawprint.png"
						isSelected={selectedPetPreferences === "Okay"}
						onClick={() => handleToggle(selectedPetPreferences, setselectedPetPreferences, "Okay")}
					/>
					<LifestylePreferencesCard
						title="I'm not okay with pets"
						imageSrc="/images/no-pets.png"
						isSelected={selectedPetPreferences === "NotOkay"}
						onClick={() => handleToggle(selectedPetPreferences, setselectedPetPreferences, "NotOkay")}
					/>
					<LifestylePreferencesCard
						title="I have a pet"
						imageSrc="/images/pet.png"
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
						imageSrc="/images/no-crowd.png"
						isSelected={selectedGuestsPreference === "Never"}
						onClick={() => handleToggle(selectedGuestsPreference, setSelectedGuestsPreferences, "Never")}
					/>
					<LifestylePreferencesCard
						title="Sometimes"
						imageSrc="/images/group.png"
						isSelected={selectedGuestsPreference === "Sometimes"}
						onClick={() => handleToggle(selectedGuestsPreference, setSelectedGuestsPreferences, "Sometimes")}
					/>
					<LifestylePreferencesCard
						title="Often"
						imageSrc="/images/friends.png"
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
						imageSrc="/images/roommate.png"
						isSelected={selectedRoommatePreference === "NotClose"}
						onClick={() => handleToggle(selectedRoommatePreference, setSelectedRoommatePreference, "NotClose")}
					/>
					<LifestylePreferencesCard
						title="Friends"
						imageSrc="/images/high-five.png"
						isSelected={selectedRoommatePreference === "Friends"}
						onClick={() => handleToggle(selectedRoommatePreference, setSelectedRoommatePreference, "Friends")}
					/>
					<LifestylePreferencesCard
						title="Close Friends"
						imageSrc="/images/best-friends.png"
						isSelected={selectedRoommatePreference === "CloseFriends"}
						onClick={() => handleToggle(selectedRoommatePreference, setSelectedRoommatePreference, "CloseFriends")}
					/>
				</div>
                
				<p className="text-black text-sm mt-1 mb-2">
					Do you plan on living on-Campus or off-Campus?
				</p>
				<div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer">
					<LifestylePreferencesCard
						title="On Campus"
						imageSrc="/images/school.png"
						isSelected={selectedLivingPreference === "onCampus"}
						onClick={() => handleToggle(selectedLivingPreference, setselectedLivingPreference, "onCampus")}
					/>
					<LifestylePreferencesCard
						title="Off Campus"
						imageSrc="/images/residential.png"
						isSelected={selectedLivingPreference === "offCampus"}
						onClick={() => handleToggle(selectedLivingPreference, setselectedLivingPreference, "offCampus")}
					/>
					
				</div>
				<div className="flex justify-center">
					<NextStepButton
						className="mt-7"
						logo={<img src="/images/peechi_duo.png" />}
						onClick={handleNextStep}
					/>
				</div>
			</div>
		</div>
	);
}
