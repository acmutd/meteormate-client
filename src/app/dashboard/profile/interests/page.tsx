"use client";
import React, { useState, useEffect } from "react";
import NextStepButton from "@/components/NextStepButton";
import { useRouter } from "next/navigation";
import InterestCard from '@/components/InterestCard';
import {
  loadOnboardingData,
  updateOnboardingData,
} from "@/utils/onboardingStorage";

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
	const [hydrated, setHydrated] = useState(false);

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
		router.push("/dashboard/profile");
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
		<div
			className="flex flex-col text-center justify-center items-center relative"
			style={{
				backgroundImage: "url('/stars_orange.svg')",
				backgroundSize: "cover",
			}}
		>
			<div className="w-[76%] h-190 bg-[#FFFFFF] rounded-2xl shadow-2xl">
				<div className="mt-8 ml-6 mr-6">
					<h1 className="text-3xl font-bold mb-8">Select Your Interests</h1>
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
				<div className="flex justify-center mt-8 mb-8">
					<NextStepButton
						className="mt-3 mb-4"
						onClick={handleNextStep}
					/>
				</div>
			</div>
		</div>
	);
}
