import React, { useState } from "react";
import { validatePassword } from "@/utils/validation";

interface PasswordInputProps {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
	placeholder?: string;
	label?: string;
	error?: string;
	disabled?: boolean;
	className?: string;
	showToggle?: boolean;
	showStrength?: boolean;
	autoComplete?: string;
	inputRef?: React.Ref<HTMLInputElement>;
}

export default function PasswordInput({
	value,
	onChange,
	onBlur,
	placeholder = "Password",
	label,
	error,
	disabled = false,
	className = "",
	showToggle = false,
	showStrength = false,
	autoComplete = "current-password",
	inputRef,
}: PasswordInputProps) {
	const [showPassword, setShowPassword] = useState(false);
	const strength = showStrength ? validatePassword(value) : null;
	const strengthScore = strength
		? Object.values(strength.checks).filter(Boolean).length
		: 0;

	const strengthLabel =
		!strength || value.length === 0
			? ""
			: strengthScore <= 2
				? "Weak"
				: strengthScore === 3
					? "Good"
					: "Strong";

	const strengthColor =
		strengthScore <= 2 ? "bg-rose-500" : strengthScore === 3 ? "bg-amber-400" : "bg-emerald-500";
	const strengthPct = !strength ? 0 : Math.min(100, (strengthScore / 5) * 100);

	return (
		<div className={`flex flex-col ${className}`}>
			{label && (
				<label className="block text-sm font-urbanist font-light text-gray-700 mb-2">
					{label}
				</label>
			)}
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
					type={showPassword ? "text" : "password"}
					value={value}
					onChange={onChange}
					onBlur={onBlur}
					placeholder={placeholder}
					disabled={disabled}
					autoComplete={autoComplete}
					ref={inputRef}
					className="pl-11 pr-4 border border-black py-2 rounded-3xl font-light text-[12px] md:text-[15px] text-left w-full disabled:opacity-50 disabled:cursor-not-allowed"
				/>
				{showToggle && (
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
					>
						{showPassword ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-5 h-5"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
								/>
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-5 h-5"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
								/>
							</svg>
						)}
					</button>
				)}
			</div>
			{showStrength && value.length > 0 ? (
				<div className="mt-2">
					<div className="flex items-center justify-between">
						<p className="text-xs text-gray-600">Password strength</p>
						<p className="text-xs font-semibold text-gray-700">{strengthLabel}</p>
					</div>
					<div className="mt-1 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
						<div className={`h-full ${strengthColor} transition-all`} style={{ width: `${strengthPct}%` }} />
					</div>
					{strength && !strength.isValid ? (
						<p className="mt-1 text-[11px] text-gray-500">
							Use 8+ chars with uppercase, lowercase, number, and special character.
						</p>
					) : null}
				</div>
			) : null}
			{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
		</div>
	);
}

