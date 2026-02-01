"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LogoBox from "../../components/LogoBox";
import { doSignInWithEmailAndPassword } from "../../firebase/auth";
import { useAuth } from "../../contexts/authContext";
import { useSearchParams } from "next/navigation";
import { getEmailValidationError } from "@/utils/validation";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmailInput from "@/components/forms/EmailInput";
import PasswordInput from "@/components/forms/PasswordInput";
import { useToast } from "@/components/ui/ToastProvider";
import { getAuthErrorMessage } from "@/utils/authErrors";
import { callActivityPing } from "@/utils/api/auth";

async function hasSurvey(idToken: string): Promise<boolean> {
	const res = await fetch(
		`api/survey/me`,
		{
			method: "GET",
			headers: {
				Authorization: `Bearer ${idToken}`,
				"Content-Type": "application/json",
			},
		}
	);

	if (res.status === 404) return false; // no survey → go to survey
	if (res.ok) return true;             // survey exists → dashboard

	if (res.status === 401) {
		throw new Error("AUTH_EXPIRED");
	}

	throw new Error(`UNEXPECTED_${res.status}`);
}

export default function LoginPage() {
	const router = useRouter();
	const { toast } = useToast();
	const auth = useAuth(); // avoid destructuring directly
	const userLoggedIn = auth?.userLoggedIn;
	const emailRef = useRef<HTMLInputElement | null>(null);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [emailTouched, setEmailTouched] = useState(false);
	const [isSigningIn, setIsSigningIn] = useState(false);
	const toastShownRef = useRef(false);

	// to know if we should show the red banner and disable/hide the "create an account" button
	const searchParams = useSearchParams();
	const created = searchParams.get("created") === "1";

	// If already logged in, redirect
	useEffect(() => {
		if (userLoggedIn) {
			router.push("../authentication"); // this pushs it back to the authentication
		}
	}, [userLoggedIn, router]);

	useEffect(() => {
		emailRef.current?.focus();
	}, []);

	useEffect(() => {
		if (!toastShownRef.current && searchParams.get("toast") === "not-signed-in") {
			toast({
				type: "error",
				title: "Not Signed In",
				description: "You must be signed in to access your profile. Please log in to continue."
			});
			toastShownRef.current = true;
		}
	}, [searchParams, toast]);

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
		setPassword(e.target.value);
	};

	const handleLogin = async () => {
		setEmailTouched(true);

		const emailErr = getEmailValidationError(email);
		if (emailErr) {
			setEmailError(emailErr);
			return;
		}

		//then we try to get if is signing in is true whne the value is flipped then we set the value to be actually true and then call signing with email and password and then router.push it to the createAccount page
		try {
			if (!isSigningIn) {
				setIsSigningIn(true);
				const userCredential = await doSignInWithEmailAndPassword(email, password);
				const idToken = await userCredential.user.getIdToken(); // getting the firebase token here

				const pingResponse = await callActivityPing(); 

				if (!pingResponse.ok) {
					console.log(`Error ${pingResponse.code} when calling activityPing: ${pingResponse.error}`)
				}
				const completed = await hasSurvey(idToken);

				toast({
					type: "success",
					title: "Welcome back!",
					description: "You’re now logged in.",
				});
				router.push(completed ? "/dashboard" : "../onboarding/createProfile"); // hopefully this works
			}
		} catch (err: unknown) { //just in case there's a problem signing in 
			console.error("Login error:", err);
			const { message } = getAuthErrorMessage(err);
			toast({ type: "error", title: "Login failed", description: message });
			setEmailTouched(true);
			setEmailError(message);
		} finally {
			setIsSigningIn(false);
		}
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		void handleLogin();
	};

	return (
		<LogoBox logoSrc="/MM_logo_V1.webp" logoAlt="MeteorMate Logo">
			{/* Back arrow to landing */}
			<button
				onClick={() => router.push("/")}
				className="absolute top-8 left-5 p-2 hover:bg-gray-100 rounded-full transition-colors"
				aria-label="Back to landing page"
				type="button"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={2}
					stroke="currentColor"
					className="w-6 h-6"
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
				</svg>
			</button>
			<div className="flex flex-col justify-center items-center text-center ">
				<h1 className="font-urbanist font-semibold md:text-[35px] text-[20px] pt-2">
					Welcome to MeteorMate
				</h1>
				<p className="font-urbanist font-light md:text-[12px] text-[10px] pb-3">
					Enhance your roommate search with AI powered matchmaking
				</p>
				{created && (
					<div
						className="w-[85%] mx-auto mb-3 rounded-md border border-red-400 bg-red-100 p-3 text-sm text-red-700"
						role="status"
						aria-live="polite"
					>
						Account has been created — log in with your credentials.
					</div>
				)}

				<button
					onClick={() => router.push("/authentication/createAccount")}
					className="cursor-pointer border border-black py-3 rounded-3xl w-[85%] font-light text-[12px] md:text-[15px] m-2"
				>
					Create an account
				</button>
			</div>

			{/* OR line */}
			<div className="flex items-center justify-center w-[80%] gap-4 text-black py-4 mx-auto">
				<hr className="grow border border-gray-800 border-b-0" />
				<span className="text-sm whitespace-nowrap">OR</span>
				<hr className="grow border border-gray-800 border-b-0" />
			</div>

			{/* Login form (Enter submits) */}
			<form onSubmit={onSubmit} className="flex justify-center items-center">
				<div className="flex flex-col text-left w-[85%] space-y-4 relative">
					<EmailInput
						value={email}
						onChange={handleEmailChange}
						onBlur={handleEmailBlur}
						disabled={isSigningIn}
						error={emailError}
						inputRef={emailRef}
					/>

					<PasswordInput
						value={password}
						onChange={handlePasswordChange}
						disabled={isSigningIn}
						showToggle
						autoComplete="current-password"
					/>

					<button
						type="submit"
						disabled={isSigningIn}
						className="bg-[#509275] text-white rounded-3xl hover:bg-gray-800 transition cursor-pointer py-3 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{isSigningIn && <LoadingSpinner size="sm" />}
						{isSigningIn ? "Logging in..." : "Login"}
					</button>
				</div>
			</form>

			{/* Forgot password */}
			<div className="text-right mt-2">
				<button
					onClick={() => router.push("/authentication/forgotPassword")}
					className="text-black text-sm hover:underline cursor-pointer"
				>
					Forgot password?
				</button>
			</div>
		</LogoBox>);
}
