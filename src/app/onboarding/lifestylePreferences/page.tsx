"use client";
import React from "react";
import { useState } from "react";
import LifestylePreferencesCard from "../../../../components/LifestylePreferencesCard";
import NextStepButton from "../../../../components/NextStepButton";
import { useRouter } from "next/navigation";

export default function CreateProfilePage() {
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

	const handleNextStep = () => {
		// Logic to handle the next step action
		console.log("handling next step");
		console.log({
			selectedWakeupTime,
			selectedCleanliness,
			selectedNoiseTolerance,
		});
	};
	return (
		<div className="py-8 px-15 w-full flex flex-col">
			<h1 className="text-white text-xl font-bold">Wake-up Time</h1>
			<p className="text-white text-sm mt-1 mb-2">
				When are you the most active generally?
			</p>
			{/*grid for the 3 options*/}
			<div className="grid grid-cols-3 gap-4 mb-4">
				<LifestylePreferencesCard
					title="Early Bird"
					imageSrc="/images/early_bird_card.png"
					isSelected={selectedWakeupTime === "Early Bird"}
					onClick={() => setSelectedWakeupTime("Early Bird")}
				/>
				<LifestylePreferencesCard
					title="Flexible"
					imageSrc="/images/flexible_card.png"
					isSelected={selectedWakeupTime === "Flexible"}
					onClick={() => setSelectedWakeupTime("Flexible")}
				/>
				<LifestylePreferencesCard
					title="Night Owl"
					imageSrc="/images/night_owl_card.png"
					isSelected={selectedWakeupTime === "Night Owl"}
					onClick={() => setSelectedWakeupTime("Night Owl")}
				/>
			</div>
			<h1 className="text-white text-xl font-bold">Cleanliness</h1>
			<p className="text-white text-sm mt-1 mb-2">
				What is your preferred level of tidiness?
			</p>
			<div className="grid grid-cols-3 gap-4 mb-4">
				<LifestylePreferencesCard
					title="Orderly"
					imageSrc="/images/orderly_card.png"
					isSelected={selectedCleanliness === "Orderly"}
					onClick={() => setSelectedCleanliness("Orderly")}
				/>
				<LifestylePreferencesCard
					title="Tidy"
					imageSrc="/images/tidy_card.png"
					isSelected={selectedCleanliness === "Tidy"}
					onClick={() => setSelectedCleanliness("Tidy")}
				/>
				<LifestylePreferencesCard
					title="Neat Freak"
					imageSrc="/images/neat_freak_card.png"
					isSelected={selectedCleanliness === "Neat Freak"}
					onClick={() => setSelectedCleanliness("Neat Freak")}
				/>
			</div>
			<h1 className="text-white text-xl font-bold">Noise Tolerance</h1>
			<p className="text-white text-sm mt-1 mb-2">
				What noise level are you comfortable with?
			</p>
			<div className="grid grid-cols-3 gap-4 mb-4">
				<LifestylePreferencesCard
					title="Quiet"
					imageSrc="/images/quiet_card.png"
					isSelected={selectedNoiseTolerance === "Quiet"}
					onClick={() => setSelectedNoiseTolerance("Quiet")}
				/>
				<LifestylePreferencesCard
					title="Moderate"
					imageSrc="/images/moderate_card.png"
					isSelected={selectedNoiseTolerance === "Moderate"}
					onClick={() => setSelectedNoiseTolerance("Moderate")}
				/>
				<LifestylePreferencesCard
					title="Social"
					imageSrc="/images/social_card.png"
					isSelected={selectedNoiseTolerance === "Social"}
					onClick={() => setSelectedNoiseTolerance("Social")}
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
	);
}
