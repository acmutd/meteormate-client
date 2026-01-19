"use client";

import React, { useEffect, useRef, useState } from "react";
import LogoBox from "../../../../components/LogoBox";
import { useRouter } from "next/navigation";
import {
	doSendEmailVerification,
} from "@/firebase/auth";
import { Check, X } from "lucide-react";
import {
	validatePassword,
	validatePasswordMatch,
	getEmailValidationError,
} from "@/utils/validation";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import EmailInput from "../../../../components/forms/EmailInput";
import PasswordInput from "../../../../components/forms/PasswordInput";
import { useToast } from "@/components/ui/ToastProvider";
import { getAuthErrorMessage } from "@/utils/authErrors";
import { callRegisterRoute } from "@/utils/api/auth"

export default function CreateAccountPage() {
	const router = useRouter();
	const { toast } = useToast();
	const emailRef = useRef<HTMLInputElement | null>(null);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [emailTouched, setEmailTouched] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");
	const [passwordValidation, setPasswordValidation] = useState(
		validatePassword("")
	);

	const [isSigningUp, setIsSigningUp] = useState(false);

	useEffect(() => {
		emailRef.current?.focus();
	}, []);

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEmail(value);
		if (emailTouched) {
			setEmailError(getEmailValidationError(value));
		}
	};

	const handleEmailBlur = () => {
		setEmailTouched(true);
		setEmailError(getEmailValidationError(email));
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
		setEmailTouched(true);

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

				const utd_id = email.split('@')[0] // axm240143@utdallas.edu

				const authResponse = await callRegisterRoute(email, password, utd_id)
				
				if (!authResponse.ok) {
					toast({
						type: "error",
						title: authResponse.code,
						description: authResponse.error
					});

					return;
				}

				const userCredentials = authResponse.data;

				await doSendEmailVerification(email, userCredentials.id);

				localStorage.setItem("verificationEmail", email); // todo - maybe clear this once user is verified?

				toast({
					type: "success",
					title: "Account created",
					description: "We sent you a verification code. Check your email to continue.",
				});
				router.push("/authentication/verifyEmail");
			}
		} catch (err: unknown) {
			console.error("Signup error:", err);
			const { message } = getAuthErrorMessage(err);
			toast({ type: "error", title: "Sign up failed", description: message });
			setEmailTouched(true);
			setEmailError(message);
		} finally {
			setIsSigningUp(false);
		}
	};

	const canSubmit =
		!isSigningUp &&
		!!email &&
		!getEmailValidationError(email) &&
		passwordValidation.isValid &&
		!!confirmPassword &&
		validatePasswordMatch(password, confirmPassword) === "";

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		void handleCreateAccount();
	};

	// once the handleCreatingAccount is pressed and once the button is pressed too, the sendVerificationEmail is generated
	// const handleSendVerificationEmail = async () => {

	// };

	return (
		<LogoBox logoSrc="/images/MM_logo_V1.webp" logoAlt="MeteorMate Logo">
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
				<form onSubmit={onSubmit} className="flex flex-col text-left w-[80%] space-y-4">
					<EmailInput
						value={email}
						onChange={handleEmailChange}
						onBlur={handleEmailBlur}
						label="UTD Email"
						error={emailError}
						disabled={isSigningUp}
						inputRef={emailRef}
					/>

					<PasswordInput
						value={password}
						onChange={handlePasswordChange}
						onBlur={() => setPasswordValidation(validatePassword(password))}
						label="Password"
						disabled={isSigningUp}
						showToggle
						autoComplete="new-password"
					/>

					<PasswordInput
						value={confirmPassword}
						onChange={handleConfirmPasswordChange}
						onBlur={() => setConfirmPasswordError(validatePasswordMatch(password, confirmPassword))}
						label="Verify Password"
						error={confirmPasswordError}
						disabled={isSigningUp}
						showToggle
						autoComplete="new-password"
					/>

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
						type="submit"
						disabled={!canSubmit}
						className={`mt-4 mb-4 py-2 px-6 rounded-3xl transition-colors duration-200 flex items-center justify-center gap-2 ${!canSubmit
							? "bg-gray-400 text-white cursor-not-allowed"
							: "bg-[#509275] text-white hover:bg-gray-800 cursor-pointer"
							}`}
					>
						{isSigningUp && <LoadingSpinner size="sm" />}
						{isSigningUp ? "Creating..." : "Create Account"}
					</button>
				</form>
			</div>
		</LogoBox>
	);
}
