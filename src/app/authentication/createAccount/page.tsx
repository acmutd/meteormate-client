"use client";

import React, { useState } from "react";
import LogoBox from "../../../../components/LogoBox";
import { useRouter } from "next/navigation";
import {
	doCreateUserWithEmailAndPassword,
	doSendEmailVerification,
} from "@/firebase/auth";
//import { getAuth, sendEmailVerification } from 'firebase/auth';
import { Check, X } from "lucide-react";
import {
	validateUTDEmail,
	validatePassword,
	validatePasswordMatch,
	getEmailValidationError,
} from "@/utils/validation";
import LoadingSpinner from "../../../../components/LoadingSpinner";

export default function CreateAccountPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");
	const [passwordValidation, setPasswordValidation] = useState(
		validatePassword("")
	);

	const [isSigningUp, setIsSigningUp] = useState(false);

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEmail(value);
		setEmailError(getEmailValidationError(value));
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setPassword(value);
		const validation = validatePassword(value);
		setPasswordValidation(validation);
		
		// Update confirm password error if confirm password is already filled
		if (confirmPassword) {
			setConfirmPasswordError(validatePasswordMatch(value, confirmPassword));
		}
	};

	const handleConfirmPasswordChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value;
		setConfirmPassword(value);
		setConfirmPasswordError(validatePasswordMatch(password, value));
	};

	const handleCreateAccount = async () => {
		// Validate email
		const emailErr = getEmailValidationError(email);
		if (emailErr) {
			setEmailError(emailErr);
			return;
		}

		// Validate password
		if (!passwordValidation.isValid) {
			setEmailError("Please fix password requirements before continuing.");
			return;
		}

		// Validate password match
		const passwordMatchError = validatePasswordMatch(password, confirmPassword);
		if (passwordMatchError) {
			setConfirmPasswordError(passwordMatchError);
			return;
		}

		try {
			if (!isSigningUp) {
				setIsSigningUp(true);

				const userCredential = await doCreateUserWithEmailAndPassword(
					email,
					password
				);
				const uid = userCredential.uid;

				await doSendEmailVerification(email, uid);

				localStorage.setItem("verificationEmail", email); // todo - maybe clear this once user is verified?

				router.push("/authentication/verifyEmail");
			}
		} catch (err: unknown) {
			console.error("Signup error:", err);
			if (err && typeof err === "object" && "code" in err && err.code === "auth/email-already-in-use") {
				setEmailError("An account with this email already exists.");
			} else {
				const errorMessage = err && typeof err === "object" && "message" in err && typeof err.message === "string" 
					? err.message 
					: "Sign Up failed";
				setEmailError(errorMessage);
			}
		} finally {
			setIsSigningUp(false);
		}
	};

	// once the handleCreatingAccount is pressed and once the button is pressed too, the sendVerificationEmail is generated
	// const handleSendVerificationEmail = async () => {

	// };

	return (
		<LogoBox logoSrc="/images/MM_logo_V1.png" logoAlt="MeteorMate Logo">
			{/* Back arrow */}
			<button
				onClick={router.back}
				className="absolute top-8 left-5 p-2 hover:bg-gray-100 rounded-full transition-colors"
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

			<div className="flex flex-col justify-center items-center">
				{/* Title and subtitle */}
				<div className="flex flex-col justify-center items-center text-center w-[clamp(10rem,55vh,25rem)]">
					<h1 className="font-urbanist font-semibold text-[clamp(20px,5vh,30px)]">
						Create an Account
					</h1>
					<p className="font-urbanist font-light text-[clamp(7px,2vh,12px)] pb-3">
						Please only use your UTD Email.
					</p>
				</div>
			</div>

			{/* Form fields */}
			<div className="flex justify-center items-center">
				<div className="flex flex-col text-left w-[80%] space-y-4">
					{/* email */}
					<div className="flex flex-col">
						<label className="block text-[clamp(10px,2vh,20px)] font-urbanist font-light text-gray-700 mb-2">
							UTD Email
						</label>
						<div className="relative">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="currentColor"
								className="absolute left-4 top-1/2 transform -translate-y-1/2 w-[clamp(1rem,3vh,1.25rem)] h-[clamp(1rem,3vh,1.25rem)] text-black"
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
								className="pl-11 pr-4 border border-black py-2 rounded-3xl font-light text-[clamp(10px,2vh,15px)] text-left w-full"
							/>
						</div>
						{emailError && (
							<p className="text-red-500 text-xs mt-1">{emailError}</p>
						)}
					</div>

					{/* password */}
					<div className="flex flex-col">
						<label className="block text-[clamp(10px,2vh,20px)] font-urbanist font-light text-gray-700 mb-2">
							Password
						</label>
						<div className="relative">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="currentColor"
								className="absolute left-4 top-1/2 transform -translate-y-1/2 w-[clamp(1rem,3vh,1.25rem)] h-[clamp(1rem,3vh,1.25rem)] text-black"
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
								className="pl-11 pr-4 border border-black py-2 rounded-3xl font-light text-[clamp(10px,2vh,15px)] text-left w-full"
							/>
						</div>
					</div>

					{/* verify password */}
					<div className="flex flex-col">
						<label className="block text-[clamp(10px,2vh,20px)] font-urbanist font-light text-gray-700 mb-2">
							Verify Password
						</label>
						<div className="relative">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="currentColor"
								className="absolute left-4 top-1/2 transform -translate-y-1/2 w-[clamp(1rem,3vh,1.25rem)] h-[clamp(1rem,3vh,1.25rem)] text-black"
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
								disabled={isSigningUp}
								className="pl-11 pr-4 border border-black py-2 rounded-3xl font-light text-[clamp(10px,2vh,15px)] text-left w-full disabled:opacity-50 disabled:cursor-not-allowed"
							/>
						</div>
						{confirmPasswordError && (
							<p className=" text-red-500 text-xs">
								{confirmPasswordError}
							</p>
						)}
					</div>

					<div>
						<p className="[font-size:clamp(10px,2vh,14px)]">Passwords must:</p>
						{passwordValidation.checks.minLength ? (
							<p className="[font-size:clamp(10px,1.5vh,12px)] text-green-500 flex items-center gap-1">
								<Check className="size-[clamp(0.75rem,2vh,1.25rem)]" /> Be at least 8 characters
							</p>
						) : (
							<p className="[font-size:clamp(10px,1.5vh,12px)] text-red-500 flex items-center gap-1">
								<X className="size-[clamp(0.75rem,2vh,1.25rem)]" /> Be at least 8 characters
							</p>
						)}
						{passwordValidation.checks.lowercase ? (
							<p className="[font-size:clamp(10px,1.5vh,12px)] text-green-500 flex items-center gap-1">
								<Check className="size-[clamp(0.75rem,2vh,1.25rem)]" /> Include at least one lowercase
								letter (a-z)
							</p>
						) : (
							<p className="[font-size:clamp(10px,1.5vh,12px)] text-red-500 flex items-center gap-1">
								<X className="size-[clamp(0.75rem,2vh,1.25rem)]" /> Include at least one lowercase letter
								(a-z)
							</p>
						)}
						{passwordValidation.checks.uppercase ? (
							<p className="[font-size:clamp(10px,1.5vh,12px)] text-green-500 flex items-center gap-1">
								<Check className="size-[clamp(0.75rem,2vh,1.25rem)]" /> Include at least one uppercase
								letter (A-Z)
							</p>
						) : (
							<p className="[font-size:clamp(10px,1.5vh,12px)] text-red-500 flex items-center gap-1">
								<X className="size-[clamp(0.75rem,2vh,1.25rem)]" /> Include at least one uppercase letter
								(A-Z)
							</p>
						)}
						{passwordValidation.checks.special ? (
							<p className="[font-size:clamp(10px,1.5vh,12px)] text-green-500 flex items-center gap-1">
								<Check className="size-[clamp(0.75rem,2vh,1.25rem)]" /> Include a special character (!@#$%)
							</p>
						) : (
							<p className="[font-size:clamp(10px,1.5vh,12px)] text-red-500 flex items-center gap-1">
								<X className="size-[clamp(0.75rem,2vh,1.25rem)]" /> Include a special character (!@#$%)
							</p>
						)}
						{passwordValidation.checks.number ? (
							<p className="[font-size:clamp(10px,1.5vh,12px)] text-green-500 flex items-center gap-1">
								<Check className="size-[clamp(0.75rem,2vh,1.25rem)]" /> Include a number (0-9)
							</p>
						) : (
							<p className="[font-size:clamp(10px,1.5vh,12px)] text-red-500 flex items-center gap-1">
								<X className="size-[clamp(0.75rem,2vh,1.25rem)]" /> Include a number (0-9)
							</p>
						)}
					</div>

					{/* create account button */}
					<button
						onClick={handleCreateAccount}
						disabled={isSigningUp || !passwordValidation.isValid}
						className={`mt-4 mb-4 py-2 px-6 rounded-3xl transition-colors duration-200 flex items-center justify-center gap-2 ${
							isSigningUp || !passwordValidation.isValid
							? "bg-gray-400 text-white cursor-not-allowed"
							: "bg-[#509275] text-white hover:bg-gray-800 cursor-pointer"
						}`}
						>
						{isSigningUp && <LoadingSpinner size="sm" />}
						{isSigningUp ? "Creating..." : "Create Account"}
					</button>
				</div>
			</div>
		</LogoBox>
	);
}
