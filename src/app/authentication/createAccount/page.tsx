"use client";
import React, { useState } from "react";
import LogoBox from "../../../../components/LogoBox";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/authContext";
import { doCreateUserWithEmailAndPassword, doSendEmailVerification } from "@/firebase/auth";
import { getAuth, sendEmailVerification } from "firebase/auth";
//import { getAuth, sendEmailVerification } from 'firebase/auth';
import firebase from "firebase/compat/app";
import { getFunctions, httpsCallable } from "firebase/functions";

export default function CreateAccountPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");
	
	const auth = useAuth(); // need this for the variable
	//const userLoggedIn = auth?.userLoggedIn; 
 	const [isSigningUp, setIsSigningUp] = useState(false);



	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEmail(value);

		if (!value.endsWith("@utdallas.edu")) {
			setEmailError("Email must end with @utdallas.edu");
		} else {
			setEmailError("");
		}
		
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleConfirmPasswordChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value;
		setConfirmPassword(value);
		if (value !== password) {
			setConfirmPasswordError("Passwords do not match");
		} else {
			setConfirmPasswordError("");
		}
	};

	
	// handle create accont through the verification email
	// const handleCreateAccount = async () => {
	// 	if (!email.endsWith("@utdallas.edu")) return setEmailError("UTD email required.");
	// 	if (password !== confirmPassword) return setConfirmPasswordError("Passwords do not match");

	// 	try {
	// 		setIsSigningUp(true);

	// 		// Create user
	// 		const newUser = await doCreateUserWithEmailAndPassword(email, password);

	// 		// Send verification email
	// 		await doSendEmailVerification(newUser);

	// 		// Redirect to verify page
	// 		router.push("/authentication/verifyEmail");

	// 	} catch (err: any) {
	// 		console.error(err);
	// 	} finally {
	// 		setIsSigningUp(false);
	// 	}
	// };
	
	// handle create account through the 6 digit code
	const handleCreateAccount = async () => {
		if (!email.endsWith("@utdallas.edu")) return setEmailError("UTD email required.");
		if (password !== confirmPassword) return setConfirmPasswordError("Passwords do not match");

		try {
			setIsSigningUp(true);

			// Create user in Firebase Auth
			const newUser = await doCreateUserWithEmailAndPassword(email, password);

			// Call your Python backend to send verification code
			await fetch("https://YOUR_BACKEND_DOMAIN/send-code", { // need to add my domain here please dont forget
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, uid: newUser.uid }),
			});

			router.push("/authentication/verifyEmail");

		} catch (err: any) {
			console.error(err);
		} finally {
			setIsSigningUp(false);
		}
	};


	


	return (
		<LogoBox logoSrc="/images/MM_logo_V1.png" logoAlt="MeteorMate Logo">
			{/* Back arrow */}
			<button
				onClick={router.back}
				className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={2}
					stroke="currentColor"
					className="w-6 h-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M15.75 19.5L8.25 12l7.5-7.5"
					/>
				</svg>
			</button>

			{/* Title and subtitle */}
			<div className="flex flex-col justify-center items-center text-center w-[400px]">
				<h1 className="font-urbanist font-semibold md:text-[35px] text-[20px]">
					Create an Account
				</h1>
				<p className="font-urbanist font-light md:text-[12px] text-[10px] pb-3">
					Please only use your UTD Email.
				</p>
			</div>

			{/* Form fields */}
			<div className="flex justify-center items-center">
				<div className="flex flex-col text-left w-[80%] space-y-4">
					{/* email */}
					<div className="flex flex-col">
						<label className="block text-sm font-urbanist font-light text-gray-700 mb-2">
							UTD Email
						</label>
						<div className="relative">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="currentColor"
								className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
								/>
							</svg>
							<input
								type="email"
								value={email}
								onChange={handleEmailChange}
								placeholder="Email"
								className="pl-11 pr-4 border border-black py-2 rounded-3xl font-light text-[12px] md:text-[15px] text-left w-full"
							/>
						</div>
						{emailError && (
							<p className="text-red-500 text-xs mt-1">{emailError}</p>
						)}
					</div>

					{/* password */}
					<div className="flex flex-col">
						<label className="block text-sm font-urbanist font-light text-gray-700 mb-2">
							Password
						</label>
						<div className="relative">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="currentColor"
								className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
								/>
							</svg>
							<input
								type="password"
								value={password}
								onChange={handlePasswordChange}
								placeholder="Password"
								className="pl-11 pr-4 border border-black py-2 rounded-3xl font-light text-[12px] md:text-[15px] text-left w-full"
							/>
						</div>
					</div>

					{/* verify password */}
					<div className="flex flex-col">
						<label className="block text-sm font-urbanist font-light text-gray-700 mb-2">
							Verify Password
						</label>
						<div className="relative">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="currentColor"
								className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
								/>
							</svg>
							<input
								type="password"
								value={confirmPassword}
								onChange={handleConfirmPasswordChange}
								placeholder="Re-Enter Password"
								className="pl-11 pr-4 border border-black py-2 rounded-3xl font-light text-[12px] md:text-[15px] text-left w-full"
							/>
						</div>
						{confirmPasswordError && (
							<p className="text-red-500 text-xs mt-1">
								{confirmPasswordError}
							</p>
						)}
					</div>

					{/* create account button */}
					<button
						onClick={handleCreateAccount}
						disabled={isSigningUp}
						className={`mt-4 mb-4 py-2 rounded-3xl transition cursor-pointer ${
							isSigningUp
								? "bg-gray-400 text-white"
								: "bg-[#509275] text-white hover:bg-gray-800"
						}`}
					>
						{isSigningUp ? "Creating..." : "Create Account"}
					</button>

				</div>
			</div>

		</LogoBox>
	);
}
