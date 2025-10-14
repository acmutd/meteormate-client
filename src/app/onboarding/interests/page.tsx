"use client";
import React, { useState } from "react";
import NextStepButton from "../../../../components/NextStepButton";
import { useRouter } from "next/navigation";

export default function CreateProfilePage() {
	const router = useRouter();
	const [interests, setInterests] = useState<string[]>([]);

	const options = [
		"Travel",
		"Gaming",
		"Cooking",
		"Singing",
		"Reading",
		"Art",
		"Dance",
		"Basketball",
		"Meditation",
		"Anime",
		"Fashion",
		"Exercising",
		"Concerts",
		"Studying",
		"Thrifting",
		"Movies/Shows",
		"Photography",
		"Swimming",
		"Blogging",
		"Skating",
		"Cyclling",
		"Rock Climbing",
		"Graphic Design",
		"Programming",
		"Sleeping",
		"Psychology",
		"Instruments",
		"K-Pop",
		"Bollywood",
		"EDM",
		"Rap",
		"Music",
		"Chess",
		"Frisbee",
		"Vegan",
		"Dungeons and Dragons",
		"Board Games",
		"Cryptocurrency",
		"Languages",
		"Scrapbooking",
		"Vinyls",
		"Cozy Games",
	];

	const handleNextStep = () => {
		// Logic to handle the next step action
		console.log({ interests });
		// router.push("/onboarding/lifestylePreferences");
	};
	return (
		<div className="bg-[#252726] rounded-lg shadow-xl py-8 px-15 w-full flex flex-col">
			{/* map each option to a ui card component that is selectable, max of 10 selections */}

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
