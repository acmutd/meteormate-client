"use client";
import React, { useState, useEffect } from "react";
import NextStepButton from "../../../../components/NextStepButton";
import { useRouter } from "next/navigation";
import InterestCard from '../../../../components/InterestCard';
import ProgressHeader from "../../../../components/ProgressHeader";
import {
  loadOnboardingData,
  updateOnboardingData,
} from "../../../utils/onboardingStorage";

const INTEREST_ROWS = [
	['Climbing', 'Anime', 'Running', 'Instruments', 'Reading', 'Gaming'],
	['Travel', 'Blogging', 'Movies', 'Singing', 'Shopping', 'Cooking', 'Art'],
	['Organized', 'Photos', 'Basketball', 'Music', 'EDM', 'Coding'],
	['Bollywood', 'Sleeping', 'Scrapbook', 'Legos', 'D&D', 'Soccer', 'Pickleball'],
	['Chess', 'Concerts', 'K-Pop', 'Dancing', 'Languages', 'Badminton']
];

const MAX_SELECTIONS = 6;

export default function InterestsPage() {
	const [selectedInterests, setSelectedInterests] = useState<string[]>([]);	
	const router = useRouter();
	const [hydrated, setHydrated] = useState(false); // flag for pages

	useEffect(() => {
		const saved = loadOnboardingData();
		if (Array.isArray(saved.interests)) {
		setSelectedInterests(saved.interests);
		}
		setHydrated(true);
  	}, []);

	useEffect(() => {
		if (!hydrated) return;
		updateOnboardingData({ interests: selectedInterests });
  	}, [hydrated, selectedInterests]);

	const handleNextStep = () => {
		router.push("/onboarding/lifestylePersonality");
		console.log(selectedInterests)
	}

	const handleToggle = (interest: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((i) => i !== interest);
      }
      if (prev.length >= MAX_SELECTIONS) {
        return prev;
      }
      return [...prev, interest];
    });
  };

	return (
		<div className="flex flex-col min-h-screen items-center justify-center">
			<ProgressHeader 
        title="Select Your Interests"
        subtitle="Pick a few interests to show who you are! You may pick up to 6."
        currentStep={3}
      />
			<div className="p-8">
				<div className="max-w-4xl mx-auto">
					<div className="flex flex-col gap-4">
					{INTEREST_ROWS.map((row, rowIndex) => (
						<div 
						key={rowIndex} 
						className="flex gap-4 justify-center"
						style={{ 
							marginLeft: rowIndex % 2 === 1 ? '1rem' : '0' 
						}}
						>
						{row.map(interest => (
							<InterestCard
							key={interest}
							name={interest}
							isSelected={selectedInterests.includes(interest)}
							onToggle={() => handleToggle(interest)}
							/>
						))}
						</div>
					))}
					</div>
				</div>
			</div>
			<NextStepButton
				className="mt-3 mb-4"
				logo={<img src="/images/peechi_duo.webp" />}
				onClick={handleNextStep}
			/>
		</div>
	);
}