"use client";
import React from "react";
import { isProfane } from "@/utils/profanity";
import NextStepButton from "../../../components/NextStepButton";
import { useRouter, useSearchParams } from "next/navigation";
import ProgressHeader from "../../../components/ProgressHeader";
import { useRef, useState, useEffect } from "react"; // mostly only for the profile picture
import { DatePicker } from "../../../components/DatePicker";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createProfile } from "@/utils/api/profile";
import { Gender, Classification } from "@/types/profile";
import { useOnboarding } from "@/contexts/onboardingContext";
import { majors } from "@/constants/majors";
import { useToast } from "@/components/ui/ToastProvider";

export default function CreateProfilePage() {
	const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const toastShownRef = useRef(false);
	const { markProfileCompleted } = useOnboarding();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [major, setMajor] = useState("");
	const [year, setYear] = useState("");
	const [gender, setGender] = useState("");
	const [birthday, setBirthday] = useState<string | null>(null);
	const [bio, setBio] = useState("");
	const [email, setEmail] = useState("");

	// API state
	const [isLoading, setIsLoading] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);
	const [profanityErrors, setProfanityErrors] = useState({
		firstName: false,
		lastName: false,
		bio: false,
	});

	// get user email from firebase auth
	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user && user.email) {
				setEmail(user.email);
			}
		});
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		if (!toastShownRef.current && searchParams.get("toast") === "needs-profile") {
			toast({
				type: "info",
				title: "Profile Required",
				description: "Please complete your profile details.",
			});
			toastShownRef.current = true;
		}
	}, [searchParams, toast]);

	// Bio character limit
	const BIO_CHAR_LIMIT = 250;

	//to make sure before moving ahead that their whole thing is filled or not
	const isFormValid =
		firstName.trim() !== "" &&
		lastName.trim() !== "" &&
		major !== "" &&
		year !== "" &&
		gender !== "" &&
		birthday !== null;

	const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setGender(e.target.value);
	};

	const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setFirstName(value);
		setProfanityErrors((prev) => ({
			...prev,
			firstName: isProfane(value),
		}));
	};

	const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setLastName(value);
		setProfanityErrors((prev) => ({
			...prev,
			lastName: isProfane(value),
		}));
	};

	const handleMajorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setMajor(e.target.value);
	};

	const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setYear(e.target.value);
	};

	const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		if (value.length <= BIO_CHAR_LIMIT) {
			setBio(value);
			
			// check for profanity
			setProfanityErrors((prev) => ({
				...prev,
				bio: isProfane(value),
			}));
		}
	};

	const handleNextStep = async () => {
		if (!isFormValid || Object.values(profanityErrors).some(Boolean)) return;

		setApiError(null);
		setIsLoading(true);

		// Create the profile
		const createResult = await createProfile({
			first_name: firstName.trim(),
			last_name: lastName.trim(),
			gender: gender as Gender,
			major,
			classification: year as Classification,
			bio,
			dob: birthday!,
			profile_picture_url: ["", "", "", "", ""], // placeholder, actual pictures will be uploaded in the next step
		});

        if (!createResult.ok) {
            setApiError(createResult.error);
            setIsLoading(false);
            return;
		}

		setIsLoading(false);
		markProfileCompleted(false);
		router.push("/onboarding/uploadPictures");
	};

	const inputStyle = "w-full px-4 py-3 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white";
	const selectStyle = "w-full px-4 py-3 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white appearance-none cursor-pointer";

	return (
		<div className="flex flex-col items-center min-h-screen">
			<ProgressHeader
				title="Create Your Profile"
				subtitle="Tell us about yourself to find your perfect roommate match."
				currentStep={1}
				progressImage="/peechi_progress_1.svg"
			/>
            <div className="bg-white rounded-lg shadow-2xl py-8 px-15 mt-4 w-full flex flex-col">
				<div className="grid grid-cols-2 gap-6">
					{/* Name */}
					<div className="flex gap-4">
						<div className="w-1/2">
							<h1 className="text-black font-medium text-sm mb-2">First Name</h1>
							<input
								type="text"
								placeholder="Jane"
								className={`${inputStyle} ${profanityErrors.firstName ? "border-red-500 focus:ring-red-500" : ""}`}
								value={firstName}
								onChange={handleFirstNameChange}
							/>
							{profanityErrors.firstName && (
								<p className="text-red-500 text-[10px] mt-1">Profanity is not allowed.</p>
							)}
						</div>
						<div className="w-1/2">
							<h1 className="text-black font-medium text-sm mb-2">Last Name</h1>
							<input
								type="text"
								placeholder="Kelper"
								className={`${inputStyle} ${profanityErrors.lastName ? "border-red-500 focus:ring-red-500" : ""}`}
								value={lastName}
								onChange={handleLastNameChange}
							/>
							{profanityErrors.lastName && (
								<p className="text-red-500 text-[10px] mt-1">Profanity is not allowed.</p>
							)}
						</div>
					</div>

					{/* UTD Email */}
					<div>
						<h1 className="text-black font-medium text-sm mb-2">UTD Email</h1>
						<div className="relative">
							<input
								type="text"
								value={email}
								placeholder="Loading..."
								className={`${inputStyle} bg-gray-50 text-gray-500 pr-10`}
								disabled
								readOnly
							/>
							<svg
								className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
								/>
							</svg>
						</div>
					</div>
					{/* major */}
					<div>
						<h1 className="text-black font-medium text-sm mb-2">Major</h1>
						<div className="relative">
							<select
								name="major"
								className={selectStyle}
								value={major}
								onChange={handleMajorChange}
							>
								<option value="" disabled>
									Select an option...
								</option>
                                
								{majors.map((majorOption) => (
									<option key={majorOption.value} value={majorOption.value}>
										{majorOption.label}
									</option>
								))}
							</select>
							<svg
								className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</div>

					{/* Gender */}
					<div>
						<h1 className="text-black font-medium text-sm mb-2">Gender</h1>
						<div className="relative">
							<select
								name="gender"
								className={selectStyle}
								value={gender}
								onChange={handleGenderChange}
							>
								<option value="" disabled>
									Select an option...
								</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
								<option value="non_binary">Non-binary</option>
								<option value="prefer_not_to_say">Prefer not to say</option>
								<option value="other">Other</option>
							</select>
							<svg
								className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</div>
					{/* year */}
					<div>
						<h1 className="text-black font-medium text-sm mb-2">Classification</h1>
						<div className="relative">
							<select
								name="classification"
								className={selectStyle}
								value={year}
								onChange={handleYearChange}
							>
								<option value="" disabled>
									Select an option...
								</option>
								<option value="freshman">Freshman (Class of 2030)</option>
								<option value="sophomore">Sophomore (Class of 2029)</option>
								<option value="junior">Junior (Class of 2028)</option>
								<option value="senior">Senior (Class of 2027)</option>
								<option value="graduate">Graduate Student</option>
							</select>
							<svg
								className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</div>

					{/* Birthday */}
					<div>
						<h1 className="text-black font-medium text-sm mb-2">Birthday</h1>
						<div className="[&_input]:border-primary [&_input]:focus:ring-primary">
							<DatePicker
								value={birthday}
								onChange={setBirthday}
								placeholder="Select your birthday"
							/>
						</div>
					</div>
				</div>

				{/* Bio */}
				<div className="mt-6">
					<h1 className="text-black font-medium text-sm mb-2">Bio</h1>
					<div className="relative">
						<textarea
							placeholder="Write your Bio here e.g your hobbies, interests etc"
							className={`${inputStyle} resize-none h-32 ${profanityErrors.bio ? "border-red-500 focus:ring-red-500" : ""}`}
							value={bio}
							onChange={handleBioChange}
							maxLength={BIO_CHAR_LIMIT}
						/>
						<div className="absolute bottom-2 right-3 text-xs text-gray-400">
							{bio.length}/{BIO_CHAR_LIMIT}
						</div>
					</div>
					{profanityErrors.bio && (
						<p className="text-red-500 text-xs mt-1">Profanity is not allowed in your bio.</p>
					)}
				</div>

				{/* Next Step Button */}
				<div className="flex justify-center">
					<NextStepButton
						className={`mt-7 ${(!isFormValid || isLoading || Object.values(profanityErrors).some(Boolean)) ? "opacity-50 cursor-not-allowed" : ""}`}
						onClick={handleNextStep}
						disabled={!isFormValid || isLoading || Object.values(profanityErrors).some(Boolean)}
					/>
					{apiError && (
						<p className="text-red-500 text-sm text-center mt-2">{apiError}</p>
					)}
				</div>
			</div>
		</div>
	);
}
