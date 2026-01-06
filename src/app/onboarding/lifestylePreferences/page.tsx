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

export default function LifestylePreferencesPage() {
	const router = useRouter();

	const [selectedWakeupTime, setSelectedWakeupTime] = useState<string | null>(
		null
	);
	const [selectedCleanliness, setSelectedCleanliness] = useState<string | null>(
		null
	);
	const [selectedNoiseTolerance, setSelectedNoiseTolerance] = useState<
		string | null
	>(null);

	const [hydrated, setHydrated] = useState(false); // flag for pages

	useEffect(() => {
    const saved = loadOnboardingData();
    const lifestyle = saved.lifestyle;
    if (lifestyle) {
      setSelectedWakeupTime(lifestyle.wakeupTime ?? null);
      setSelectedCleanliness(lifestyle.cleanliness ?? null);
      setSelectedNoiseTolerance(lifestyle.noiseTolerance ?? null);
    }
    setHydrated(true);
  }, []);

	
	useEffect(() => {
    if (!hydrated) return;

    updateOnboardingData({
      lifestyle: {
        wakeupTime: selectedWakeupTime,
        cleanliness: selectedCleanliness,
        noiseTolerance: selectedNoiseTolerance,
      },
    });
  }, [hydrated, selectedWakeupTime, selectedCleanliness, selectedNoiseTolerance]);
	
	const handleToggle = (
		currentValue: string | null,
    	setValue: (val: string | null) => void,
    	newValue: string
  	) => {
    		setValue(currentValue === newValue ? null : newValue);
  	};

	const handleNextStep = () => {
		router.push("/onboarding/interests");
	};
	return (
		<div>
			<ProgressHeader 
				title="Lifestyle Preferences"
				subtitle="Help us find your ideal roommate by selecting your preferences!"
				currentStep={2}
			/>
			<div className="py-8 px-15 w-full flex flex-col">
				<h1 className="text-black text-xl font-bold">Wake-up Time</h1>
				<p className="text-black text-sm mt-1 mb-2">
					When are you the most active generally?
				</p>
				{/*grid for the 3 options*/}
				<div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer">
					<LifestylePreferencesCard
						title="Early Bird"
						imageSrc="/images/early_bird_card.webp"
						isSelected={selectedWakeupTime === "Early Bird"}
						onClick={() => handleToggle(selectedWakeupTime, setSelectedWakeupTime, "Early Bird")}
					/>
					<LifestylePreferencesCard
						title="Flexible"
						imageSrc="/images/flexible_card.webp"
						isSelected={selectedWakeupTime === "Flexible"}
						onClick={() => handleToggle(selectedWakeupTime, setSelectedWakeupTime, "Flexible")}
					/>
					<LifestylePreferencesCard
						title="Night Owl"
						imageSrc="/images/night_owl_card.webp"
						isSelected={selectedWakeupTime === "Night Owl"}
						onClick={() => handleToggle(selectedWakeupTime, setSelectedWakeupTime, "Night Owl")}
					/>
				</div>
				<h1 className="text-black text-xl font-bold ">Cleanliness</h1>
				<p className="text-black text-sm mt-1 mb-2">
					What is your preferred level of tidiness?
				</p>
				<div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer">
					<LifestylePreferencesCard
						title="Orderly"
						imageSrc="/images/orderly_card.webp"
						isSelected={selectedCleanliness === "Orderly"}
						onClick={() => handleToggle(selectedCleanliness, setSelectedCleanliness, "Orderly")}
					/>
					<LifestylePreferencesCard
						title="Tidy"
						imageSrc="/images/tidy_card.webp"
						isSelected={selectedCleanliness === "Tidy"}
						onClick={() => handleToggle(selectedCleanliness, setSelectedCleanliness, "Tidy")}
					/>
					<LifestylePreferencesCard
						title="Neat Freak"
						imageSrc="/images/neat_freak_card.webp"
						isSelected={selectedCleanliness === "Neat Freak"}
						onClick={() => handleToggle(selectedCleanliness, setSelectedCleanliness, "Neat Freak")}
					/>
				</div>
				<h1 className="text-black text-xl font-bold">Noise Tolerance</h1>
				<p className="text-black text-sm mt-1 mb-2">
					What noise level are you comfortable with?
				</p>
				<div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer">
					<LifestylePreferencesCard
						title="Quiet"
						imageSrc="/images/quiet_card.webp"
						isSelected={selectedNoiseTolerance === "Quiet"}
						onClick={() => handleToggle(selectedNoiseTolerance, setSelectedNoiseTolerance, "Quiet")}
					/>
					<LifestylePreferencesCard
						title="Moderate"
						imageSrc="/images/moderate_card.webp"
						isSelected={selectedNoiseTolerance === "Moderate"}
						onClick={() => handleToggle(selectedNoiseTolerance, setSelectedNoiseTolerance, "Moderate")}
					/>
					<LifestylePreferencesCard
						title="Social"
						imageSrc="/images/social_card.webp"
						isSelected={selectedNoiseTolerance === "Social"}
						onClick={() => handleToggle(selectedNoiseTolerance, setSelectedNoiseTolerance, "Social")}
					/>
				</div>
				<div className="flex justify-center">
					<NextStepButton
						className="mt-7"
						logo={<img src="/images/peechi_duo.webp" />}
						onClick={handleNextStep}
						disabled = {!selectedCleanliness || !selectedNoiseTolerance || !selectedWakeupTime}
					/>
				</div>
			</div>
		</div>
	);
}
