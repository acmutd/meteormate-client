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
import { compressImage } from "@/utils/imageCompression";
import { Gender, Classification } from "@/types/profile";
import ImageCropper from "@/components/imageHandling/ImageCropper";

export default function CreateProfilePage() {
	const router = useRouter();
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

    // image compression state
    const [compressionError, setCompressionError] = useState<string | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);

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
	const [photos, setPhotos] = useState<string[]>([]);
	const [cropImage, setCropImage] = useState<string | null>(null);
	const [isCropping, setIsCropping] = useState(false);

	const MIN_PHOTOS = 3;
	const MAX_PHOTOS = 5;

	// Bio character limit
	const BIO_CHAR_LIMIT = 250;

	//to make sure before moving ahead that their whole thing is filled or not
	const isFormValid =
		firstName.trim() !== "" &&
		lastName.trim() !== "" &&
		major !== "" &&
		year !== "" &&
		gender !== "" &&
		birthday !== null &&
		photos.length >= MIN_PHOTOS &&
		photos.length <= MAX_PHOTOS;

	const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setGender(e.target.value);
	};

	const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFirstName(e.target.value);
	};

	const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLastName(e.target.value);
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

		// Create the profile
		const createResult = await createProfile({
			first_name: firstName.trim(),
			last_name: lastName.trim(),
			gender: gender as Gender,
			major,
			classification: year as Classification,
			bio,
			dob: birthday!,
			profile_picture_url: [],
		});

        if (!createResult.ok) {
            // if profile picture is the only thing that failed, we can ignore it and retry
			if (createResult.code !== "409") {
				setApiError(createResult.error);
				setIsLoading(false);
				return;
			}
		}

		// Upload all photos
		const tempPhotos = [...photos];
		const failedUploads: string[] = [];

		for (const photoBase64 of tempPhotos) {
			const picResult = await uploadProfilePicture({ base64: photoBase64 });
			if (!picResult.ok) {
				failedUploads.push(photoBase64);
			}
		}

		// If there are failures, update the UI array to only keep failed images
		if (failedUploads.length > 0) {
			setPhotos(failedUploads);
			setApiError(`Failed to upload ${failedUploads.length} photo(s). Please try again.`);
			setIsLoading(false);
			return;
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

		setCompressionError(null);

		const reader = new FileReader();
		reader.onload = () => {
			setCropImage(reader.result as string);
			setIsCropping(true);
		};
		reader.readAsDataURL(file);
		e.target.value = "";
	};

	const handleCropDone = async (croppedDataUrl: string) => {
		setIsCropping(false);
		setCropImage(null);
		setIsCompressing(true);
		setCompressionError(null);

		try {
			// Convert base64 data URL to File object
			const res = await fetch(croppedDataUrl);
			const blob = await res.blob();
			const file = new File([blob], "cropped_image.jpg", { type: Object.hasOwn(blob, 'type') ? blob.type : "image/jpeg" });

			const compressedFile = await compressImage(file);
			
			const reader = new FileReader();
			reader.onload = () => {
				setPhotos((prev) => [...prev, reader.result as string]);
			};
			reader.readAsDataURL(compressedFile);
		} catch (error) {
			console.error("Image compression failed:", error);
			setCompressionError("Failed to process image. Please try a different photo.");
		} finally {
			setIsCompressing(false);
		}
	};

	const handleDeletePhoto = (index: number) => {
		setPhotos((prev) => prev.filter((_, i) => i !== index));
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
						Your Photos ({photos.length}/{MAX_PHOTOS}) <span className="text-red-500">*</span>
					</h1>
					<div className="flex flex-row flex-wrap gap-4 items-center">
						{/* Upload Button */}
						{photos.length < MAX_PHOTOS && (
							<button
								onClick={handleImageClick}
								disabled={isCompressing}
								className="bg-surface-cream w-32 h-32 rounded-xl border-2 border-dashed border-black cursor-pointer overflow-hidden flex flex-col items-center justify-center hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
							>
								{isCompressing ? (
									<div className="flex flex-col items-center justify-center">
										<svg className="animate-spin h-8 w-8 text-primary mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										<span className="text-black text-[10px] text-center leading-tight">
											Processing...
										</span>
									</div>
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
							</button>
						)}

						{/* Rendered Photos */}
						{photos.map((photo, idx) => (
							<div key={idx} className="relative group shrink-0 w-32 h-32 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
								<Image
									src={photo}
									alt={`Profile photo ${idx + 1}`}
									fill
									className="object-cover"
								/>
								<button
									type="button"
									onClick={() => handleDeletePhoto(idx)}
									className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700 flex items-center justify-center text-white text-xs font-bold leading-none"
									title="Delete image"
								>
									X
								</button>
							</div>
						))}
					</div>
					
					{compressionError && (
						<p className="mt-2 text-xs text-red-500">{compressionError}</p>
					)}
					{photos.length < MIN_PHOTOS && (
						<p className="mt-2 text-xs text-gray-400">A minimum of {MIN_PHOTOS} photos is required.</p>
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
					<div className="flex gap-4">
						<div className="w-1/2">
							<h1 className="text-black font-medium text-sm mb-2">First Name</h1>
							<input
								type="text"
								placeholder="Jane"
								className={inputStyle}
								value={firstName}
								onChange={handleFirstNameChange}
							/>
						</div>
						<div className="w-1/2">
							<h1 className="text-black font-medium text-sm mb-2">Last Name</h1>
							<input
								type="text"
								placeholder="Kelper"
								className={inputStyle}
								value={lastName}
								onChange={handleLastNameChange}
							/>
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
						className={`mt-7 ${(!isFormValid || isLoading || isCompressing) ? "opacity-50 cursor-not-allowed" : ""}`}
						onClick={handleNextStep}
						disabled={!isFormValid || isLoading || isCompressing}
					/>
					{apiError && (
						<p className="text-red-500 text-sm text-center mt-2">{apiError}</p>
					)}
				</div>
			</div>

			{isCropping && cropImage && (
				<ImageCropper
					image={cropImage}
					onCropDone={handleCropDone}
					onCancel={() => {
						setIsCropping(false);
						setCropImage(null);
					}}
				/>
			)}
		</div>
	);
}
