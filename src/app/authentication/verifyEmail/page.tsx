"use client";
import React, { useRef, useState } from "react";
import LogoBox from "../../../../components/LogoBox";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
	const router = useRouter(); // NEW: actually use the router
	const [code, setCode] = useState(Array(6).fill(""));
	const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
	const [email] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null); // NEW: error message state

	const handleChange = (value: string, index: number) => {
		if (/^\d$/.test(value)) {
			const newCode = [...code];
			newCode[index] = value;
			setCode(newCode);

			if (index < 5 && inputsRef.current[index + 1]) {
				inputsRef.current[index + 1]?.focus();
			}
		}
	};

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		index: number
	) => {
		if (e.key === "Backspace") {
			const newCode = [...code];
			if (code[index]) {
				newCode[index] = "";
				setCode(newCode);
			} else if (index > 0) {
				newCode[index - 1] = "";
				setCode(newCode);
				inputsRef.current[index - 1]?.focus();
			}
		} else if (e.key === "Delete") {
			const newCode = [...code];
			newCode[index] = "";
			setCode(newCode);
		}
	};

	const handleVerifyEmail = async () => {
		const verificationCode = code.join("");
		setError(null); // NEW: clear any previous error

		if (verificationCode.length !== 6) {
			setError("Please enter the 6-digit code.");
			return;
		}

		try {
			const email = localStorage.getItem("verificationEmail");

			if (!email) {
				setError("No email found. Please sign up again.");
				return;
			}

			const response = await fetch("http://localhost:8000/api/auth/verify-email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: email,
					code: verificationCode,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				// NEW: show a red error message above the button
				setError(errorData.detail || "Invalid code. Please try again.");
				return;
			}

			// success -> reroute to login
			// NEW:
			router.push("../authentication");
		} catch (err) {
			setError("Something went wrong. Please try again.");
			console.error("Verification error:", (err as Error).message);
		}
	};

	const resendCode = async () => {
		const email = localStorage.getItem("verificationEmail");
		if (!email) {
			setError("No email found. Please log in again.");
			return;
		}

		try {
			const res = await fetch("http://localhost:8000/api/auth/send-verification-code", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, purpose: "verify" }),
			});

			if (!res.ok) {
			const data = await res.json().catch(() => ({}));
			setError(data.detail || "Failed to resend code.");
			}
		} catch {
			setError("Failed to resend code. Please try again.");
		}
	};


	return (
		<LogoBox logoSrc="/images/MM_logo_V1.webp" logoAlt="MeteorMate Logo">
			<div className="flex flex-col justify-center items-center text-center w-[400px]">
				<h1 className="font-urbanist font-semibold md:text-[35px] text-[20px]">
					Verify Email
				</h1>
				<p className="font-urbanist font-light md:text-[12px] text-[10px]">
					{email
						? `We have sent a verification code to ${email}.`
						: "We have sent a verification code to your registered email."}
				</p>
				<p className="font-urbanist font-light md:text-[12px] text-[10px] pb-3">
					Please check your inbox and input the code below to activate your
					account.
				</p>

				{/* code */}
				<div className="flex space-x-3 justify-center">
					{code.map((digit, index) => (
						<input
							key={index}
							type="text"
							inputMode="numeric"
							maxLength={1}
							value={digit}
							onChange={(e) => handleChange(e.target.value, index)}
							onKeyDown={(e) => handleKeyDown(e, index)}
							ref={(el: HTMLInputElement | null) => {
								inputsRef.current[index] = el;
							}}
							className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
						/>
					))}
				</div>

				{/* NEW: inline error message */}
				{error && (
					<p className="mt-3 text-sm text-red-600">{error}</p>
				)}

				{/* verify button */}
				<button
					onClick={handleVerifyEmail}
					className="mt-4 mb-4 bg-[#509275] text-white py-2 rounded-3xl hover:bg-gray-800 transition cursor-pointer w-[80%]"
				>
					Verify Email
				</button>

				<button
					onClick={resendCode}
					className="text-sm text-gray-600 underline hover:text-black mt-2 cursor-pointer"
					>
					Resend code
				</button>

			</div>
		</LogoBox>
	);
}
