"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import LandingSection from "./LandingSection";

export default function GetStarted() {
	const router = useRouter();
	const [isNavigating, setIsNavigating] = useState(false);

	return (
		<LandingSection
			id="getStarted"
			className="min-h-screen bg-black bg-no-repeat bg-center bg-contain text-white flex flex-col items-center justify-center"
			style={{
				backgroundImage: `url('/images/STARS__GRAYSCALE_LOGO_png.webp')`,
			}}
		>
			<div className="flex flex-col items-center">
				<h1 className="outfit-bold text-[100px]">Ready to Find Your</h1>
				<h1 className="outfit-bold text-[100px]">Perfect Match?</h1>
			</div>
			<div className="flex flex-col items-center mb-4">
				<h1 className="outfit-regular text-[20px]">
					Join other UTD students on the hunt for the
				</h1>
				<h1 className="outfit-regular text-[20px]">perfect roommate!</h1>
			</div>
			{/* Button for start your search */}
			<div className="flex justify-center items-center">
				<button
					onClick={() => {
						if (!isNavigating) {
							setIsNavigating(true);
							router.push("/authentication/createAccount");
						}
					}}
					disabled={isNavigating}
					className="outfit-bold md:px-7 md:py-4 p-2 rounded-[20px] border-0 md:text-[24px] text-[10px] flex justify-center items-center gap-2 button-find cursor-pointer mt-2 bg-gradient-to-br from-orange-400 to-yellow-500 hover:opacity-80 transition-opacity duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
				>
					{isNavigating && <LoadingSpinner size="sm" />}
					Start Your Search
				</button>
			</div>
		</LandingSection>
	);
}

