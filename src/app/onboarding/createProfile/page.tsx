"use client";
import React from "react";
import Image from "next/image";
import NextStepButton from "../../../components/NextStepButton";
import { useRouter } from "next/navigation";
import ProgressHeader from "../../../components/ProgressHeader";
import { useRef, useState } from "react"; // mostly only for the profile picture

export default function CreateProfilePage() {
	const router = useRouter();
	const [age, setAge] = React.useState<number | "">("");
	const [firstName, setFirstName] = React.useState("");
	const [lastName, setLastName] = React.useState("");
	const [major, setMajor] = React.useState("");
	const [year, setYear] = React.useState("");
	const [gender, setGender] = React.useState("");

	//for the profile picture
	const fileInputRef = useRef<HTMLInputElement>(null);
  	const [preview, setPreview] = useState<string | null>(null);

	//to make sure before moving ahead that their whole thing is filled or not
	const isFormValid =
		firstName.trim() !== "" &&
		lastName.trim() !== "" &&
		major !== "" &&
		year !== "" &&
		gender !== "" &&
		age !== "" &&
		Number(age) > 0;


	// const PeechiDuo = require("../../../public/peechi_duo.webp");

	const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setGender(e.target.value);
	};

	const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAge(Number(e.target.value));
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

	const handleNextStep = () => {
		// Logic to handle the next step action
		if (!isFormValid) {
			alert("Please fill out all required fields.");
			return;
  		}
		console.log({ age, firstName, lastName, major, year, gender });
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
	};

	return (
		<div className="flex flex-col items-center min-h-screen">
			<ProgressHeader
				title="Create Your Profile"
				subtitle="Tell us about yourself to find your perfect roommate match."
				currentStep={1}
			/>
			<div className="bg-[#F1EBE2] rounded-lg shadow-xl py-8 px-15 mt-4 w-full flex flex-col">
				{/* profile picture */}
				<div className="flex justify-center mb-6">
					<div className="flex flex-col items-center gap-3">

					<div
						onClick={handleImageClick}
						className="w-32 h-32 rounded-full border-2 border-gray-300 cursor-pointer overflow-hidden flex items-center justify-center hover:opacity-80"
					>
						{preview ? (
						<Image
							src={preview}
							alt="Profile"
							className="w-full h-full object-cover"
						/>
						) : (
						<span className="text-gray-400 text-sm">Click to upload</span>
						)}
					</div>

					{/* Hidden file input */}
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						className="hidden"
					/>
					</div>

				</div>

				<div className="grid grid-cols-2 gap-15">
					{/* first name */}
					<div>
						<h1 className="text-black font-bold text-xs mb-2">First Name</h1>
						<div className="bg-white rounded-md p-2">
							<input
								type="text"
								placeholder="First Name"
								className="focus:outline-none w-full"
								onChange={handleFirstNameChange}
							/>
						</div>
					</div>
					{/* last name */}
					<div>
						<h1 className="text-black font-bold text-xs mb-2">Last Name</h1>
						<div className="bg-white rounded-md p-2">
							<input
								type="text"
								placeholder="Last Name"
								className="focus:outline-none w-full"
								onChange={handleLastNameChange}
							/>
						</div>
					</div>
					{/* major */}
					<div>
						<h1 className="text-black font-bold text-xs mb-2">Major</h1>
						<select
							name="major"
							className="bg-white rounded-md p-2 w-full focus:outline-none"
							defaultValue=""
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
							<option value="human-resource-management">
								Human Resource Management
							</option>
							<option value="information-technology-systems">
								Information Technology and Systems
							</option>
							<option value="marketing">Marketing</option>
							<option value="supply-chain-management">Supply Chain Management</option>

							<option value="animation-games">Animation and Games</option>
							<option value="arts-technology-emerging-communication">
								Arts, Technology, and Emerging Communication (ATEC)
							</option>
							<option value="art-history">Art History</option>
							<option value="history">History</option>
							<option value="interdisciplinary-studies">
								Interdisciplinary Studies
							</option>
							<option value="literature">Literature</option>
							<option value="philosophy">Philosophy</option>
							<option value="visual-performing-arts">Visual and Performing Arts</option>

							<option value="child-learning-development">
								Child Learning and Development
							</option>
							<option value="cognitive-science">Cognitive Science</option>
							<option value="neuroscience">Neuroscience</option>
							<option value="psychology">Psychology</option>
							<option value="speech-language-hearing">
								Speech, Language, and Hearing Sciences
							</option>

							<option value="criminology-criminal-justice">
								Criminology and Criminal Justice
							</option>
							<option value="economics">Economics</option>
							<option value="geospatial-information-sciences">
								Geospatial Information Sciences
							</option>
							<option value="international-political-economy">
								International Political Economy
							</option>
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
					</div>
					{/* year */}
					<div>
						<h1 className="text-black font-bold text-xs mb-2">Year</h1>
						<select
							name="year"
							className="bg-white rounded-md p-2 w-full focus:outline-none"
							defaultValue=""
							onChange={handleYearChange}
						>
							<option value="" disabled>
								Select an option...
							</option>
							<option value="2030">Class of 2030</option>
							<option value="2029">Class of 2029</option>
							<option value="2028">Class of 2028</option>
							<option value="2027">Class of 2027</option>
							<option value="2026">Class of 2026</option>
						</select>
					</div>
					{/* age */}
					<div>
						<h1 className="text-black font-bold text-xs mb-2">Age</h1>
						<div className="bg-white rounded-md p-2">
							<input
								type="text"
								placeholder="Age"
								className="focus:outline-none w-full"
								onChange={handleAgeChange}
							/>
						</div>
					</div>
					{/* Gender */}
					<div>
						<h1 className="text-black font-bold text-xs mb-2">Gender</h1>
						<select
							name="gender"
							className="bg-white rounded-md p-2 w-full focus:outline-none"
							defaultValue=""
							onChange={handleGenderChange}
						>
							<option value="" disabled>
								Select an option...
							</option>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
							<option value="Non-binary">Non-binary</option>
							<option value="Other">Other</option>
						</select>
					</div>
					{/* next step button */}
					{/* <h1 className="text-white text-xs">Gender</h1> */}
				</div>
				<div className="flex justify-center">
					<NextStepButton
					className={`mt-7 ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
					logo={<Image src="/peechi_duo.webp" width={1000} height={1000} alt="Peechi mascot" />}
					onClick={handleNextStep}
					disabled={!isFormValid}
					/>
				</div>
			</div>
		</div>
	);
}
