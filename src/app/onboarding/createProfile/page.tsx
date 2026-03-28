"use client";
import React from "react";
import Image from "next/image";
import NextStepButton from "../../../components/NextStepButton";
import { useRouter } from "next/navigation";
import ProgressHeader from "../../../components/ProgressHeader";
import { useRef, useState, useEffect } from "react"; // mostly only for the profile picture
import { DatePicker } from "../../../components/DatePicker";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createProfile, uploadProfilePicture } from "@/utils/api/profile";
import { Gender, Classification } from "@/types/profile";

export default function CreateProfilePage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [major, setMajor] = useState("");
	const [year, setYear] = useState("");
	const [gender, setGender] = useState("");
	const [birthday, setBirthday] = useState<string | null>(null);
	const [bio, setBio] = useState("");
	const [email, setEmail] = useState("");

	// API state
	const [isLoading, setIsLoading] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);

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

	//for the profile picture
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [base64Image, setBase64Image] = useState<string | null>(null);

	// Bio character limit
	const BIO_CHAR_LIMIT = 250;

	//to make sure before moving ahead that their whole thing is filled or not
	const isFormValid =
		name.trim() !== "" &&
		major !== "" &&
		year !== "" &&
		gender !== "" &&
		birthday !== null &&
		base64Image !== null;

	const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setGender(e.target.value);
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	const handleMajorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setMajor(e.target.value);
	};

	const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setYear(e.target.value);
	};

	const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (e.target.value.length <= BIO_CHAR_LIMIT) {
			setBio(e.target.value);
		}
	};

	const handleNextStep = async () => {
		if (!isFormValid) return;

		setApiError(null);
		setIsLoading(true);

		// Require a last name (must have a space with content after it)
		const spaceIdx = name.indexOf(" ");
		const first_name = spaceIdx === -1 ? name.trim() : name.slice(0, spaceIdx).trim();
		const last_name = spaceIdx === -1 ? "" : name.slice(spaceIdx + 1).trim();

		if (!last_name) {
			setApiError("Please enter both a first and last name.");
			setIsLoading(false);
			return;
		}

		// Create the profile
		const createResult = await createProfile({
			first_name,
			last_name,
			gender: gender as Gender,
			major,
			classification: year as Classification,
			bio,
			dob: birthday!,
			profile_picture_url: [],
		});

		if (!createResult.ok) {
			setApiError(createResult.error);
			setIsLoading(false);
			return;
		}

		// If a picture was selected, upload it
		if (base64Image) {
			const picResult = await uploadProfilePicture({ base64: base64Image });
			if (!picResult.ok) {
				setApiError(picResult.error);
				setIsLoading(false);
				return;
			}
		}

		setIsLoading(false);
		router.push("/onboarding/lifestylePreferences");
	};

	const handleImageClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// to preview the image in the icon 
		const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
        
        // Base64 data URL for the API
		const reader = new FileReader();
		reader.onload = () => setBase64Image(reader.result as string);
		reader.readAsDataURL(file);
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
				{/* Profile Picture Section */}
				<div className="mb-6">
					<h1 className="text-black font-medium text-sm mb-3">
						Your Profile Picture <span className="text-red-500">*</span>
					</h1>
					<div
						onClick={handleImageClick}
						className="bg-surface-cream w-32 h-32 rounded-xl border-2 border-dashed border-black cursor-pointer overflow-hidden flex flex-col items-center justify-center hover:opacity-80"
					>
						{preview ? (
							<Image
								src={preview}
								alt="Profile"
								width={128}
								height={128}
								className="w-full h-full object-cover"
							/>
						) : (
							<>
								<Image
									src="/upload_photo_picture.svg"
									alt="Upload Photo"
									width={128}
									height={128}
									className="size-12 mb-3"
								/>
								<span className="text-black text-[10px] text-center leading-tight">
									Upload your<br />photo
								</span>
							</>
						)}
					</div>
					{!base64Image && (
						<p className="mt-2 text-xs text-gray-400">A profile photo is required.</p>
					)}

					{/* Hidden file input */}
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						className="hidden"
					/>
				</div>

				<div className="grid grid-cols-2 gap-6">
					{/* Name */}
					<div>
						<h1 className="text-black font-medium text-sm mb-2">Name</h1>
						<input
							type="text"
							placeholder="Jane Kelper"
							className={inputStyle}
							value={name}
							onChange={handleNameChange}
						/>
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

								<option value="biomedical-engineering">Biomedical Engineering</option>
								<option value="computer-engineering">Computer Engineering</option>
								<option value="computer-science">Computer Science</option>
								<option value="data-science">Data Science</option>
								<option value="electrical-engineering">Electrical Engineering</option>
								<option value="mechanical-engineering">Mechanical Engineering</option>
								<option value="software-engineering">Software Engineering</option>

								<option value="accounting">Accounting</option>
								<option value="business-administration">Business Administration</option>
								<option value="business-analytics">Business Analytics</option>
								<option value="finance">Finance</option>
								<option value="global-business">Global Business</option>
								<option value="healthcare-management">Healthcare Management</option>
								<option value="human-resource-management">Human Resource Management</option>
								<option value="information-technology-systems">Information Technology and Systems</option>
								<option value="marketing">Marketing</option>
								<option value="supply-chain-management">Supply Chain Management</option>

								<option value="animation-games">Animation and Games</option>
								<option value="arts-technology-emerging-communication">Arts, Technology, and Emerging Communication (ATEC)</option>
								<option value="art-history">Art History</option>
								<option value="history">History</option>
								<option value="interdisciplinary-studies">Interdisciplinary Studies</option>
								<option value="literature">Literature</option>
								<option value="philosophy">Philosophy</option>
								<option value="visual-performing-arts">Visual and Performing Arts</option>

								<option value="child-learning-development">Child Learning and Development</option>
								<option value="cognitive-science">Cognitive Science</option>
								<option value="neuroscience">Neuroscience</option>
								<option value="psychology">Psychology</option>
								<option value="speech-language-hearing">Speech, Language, and Hearing Sciences</option>

								<option value="criminology-criminal-justice">Criminology and Criminal Justice</option>
								<option value="economics">Economics</option>
								<option value="geospatial-information-sciences">Geospatial Information Sciences</option>
								<option value="international-political-economy">International Political Economy</option>
								<option value="political-science">Political Science</option>
								<option value="public-affairs">Public Affairs</option>
								<option value="public-policy">Public Policy</option>
								<option value="sociology">Sociology</option>

								<option value="actuarial-science">Actuarial Science</option>
								<option value="biochemistry">Biochemistry</option>
								<option value="biology">Biology</option>
								<option value="chemistry">Chemistry</option>
								<option value="geosciences">Geosciences</option>
								<option value="mathematics">Mathematics</option>
								<option value="molecular-biology">Molecular Biology</option>
								<option value="physics">Physics</option>
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
							placeholder="Write your Bio here e.g your hobbies, interests ETC"
							className={`${inputStyle} resize-none h-32`}
							value={bio}
							onChange={handleBioChange}
							maxLength={BIO_CHAR_LIMIT}
						/>
						<div className="absolute bottom-2 right-3 text-xs text-gray-400">
							{bio.length}/{BIO_CHAR_LIMIT}
						</div>
					</div>
				</div>

				{/* Next Step Button */}
				<div className="flex justify-center">
					<NextStepButton
						className={`mt-7 ${(!isFormValid || isLoading) ? "opacity-50 cursor-not-allowed" : ""}`}
						onClick={handleNextStep}
						disabled={!isFormValid || isLoading}
					/>
					{apiError && (
						<p className="text-red-500 text-sm text-center mt-2">{apiError}</p>
					)}
				</div>
			</div>
		</div>
	);
}
