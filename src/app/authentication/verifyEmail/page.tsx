"use client";
import React, { useRef, useState } from "react";
import LogoBox from "../../../../components/LogoBox";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
	const router = useRouter();
	const [code, setCode] = useState(Array(6).fill(""));
	const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
	const [email, setEmail] = useState<string | null>(null);

	React.useEffect(() => {
		import("firebase/auth").then(({ onAuthStateChanged, getAuth }) => {
			const auth = getAuth();
			onAuthStateChanged(auth, (user) => {
				setEmail(user?.email ?? null);
			});
		});
	}, []);

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
				// If current field has a value, clear it
				newCode[index] = "";
				setCode(newCode);
			} else if (index > 0) {
				// If current field is empty, move to previous field and clear it
				newCode[index - 1] = "";
				setCode(newCode);
				inputsRef.current[index - 1]?.focus();
			}
		} else if (e.key === "Delete") {
			// Delete key clears current field
			const newCode = [...code];
			newCode[index] = "";
			setCode(newCode);
		}
	};

	const handleVerifyEmail = () => {
		const verificationCode = code.join("");
		console.log("Verifying email with code:", verificationCode);
	};

	return (
		<LogoBox logoSrc="/images/MM_logo_V1.png" logoAlt="MeteorMate Logo">
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

				{/* verify button */}
				<button
					onClick={handleVerifyEmail}
					className="mt-4 mb-4 bg-[#509275] text-white py-2 rounded-3xl hover:bg-gray-800 transition cursor-pointer w-[80%]"
				>
					Verify Email
				</button>
			</div>
		</LogoBox>
	);
}
