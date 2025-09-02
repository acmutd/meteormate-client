"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LogoBox from "../../../components/LogoBox";

export default function LoginPage() {
	const router = useRouter(); // making the router for the navigation system across pages
	const [email, setEmail] = useState(""); // to get user input for the utd emails
	const [password, setPassword] = useState(""); // for their password variables
	const [emailError, setEmailError] = useState(""); // to check for the email error that is not ending with @utdallas.edu

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// what this function is doing is that, its handling email changes
		const value = e.target.value; // gets a value from the handleEmail change
		setEmail(value); // and sets the email

		if (!value.endsWith("@utdallas.edu")) {
			// check if the email is corrct or not
			setEmailError("Email must end with @utdallas.edu"); // if not correct then shows Email error
		} else {
			setEmailError(""); // otherwise pass
		}
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// function to handle the passwords
		setPassword(e.target.value);
	};

	const handleLogin = () => {
		// handles the login
		if (!email.endsWith("@utdallas.edu")) {
			setEmailError("Please enter a valid @utdallas.edu email.");
			return;
		}

		console.log("Logging in with", { email, password }); // for us to check console logging
	};

	return (
		<LogoBox logoSrc="/images/MM_logo_V1.png" logoAlt="MeteorMate Logo">
			<div className="flex flex-col justify-center items-center text-center">
				<h1 className="font-urbanist font-semibold md:text-[35px] text-[20px]">
					Welcome to MeteorMate
				</h1>
				<p className="font-urbanist font-light md:text-[12px] text-[10px] pb-3">
					Enhance your roommate search with AI powered matchmaking
				</p>
				<button
					onClick={() => router.push("/authentication/createAccount")}
					className="cursor-pointer border border-black py-2 rounded-3xl w-[80%] font-light text-[12px] md:text-[15px]"
				>
					Create an account
				</button>
			</div>

			{/* Creating the OR line here - aastha */}
			<div className="flex items-center justify-center w-[80%] gap-4 text-black py-4 mx-auto">
				<hr className="flex-grow border border-gray-800 border-b-0" />
				<span className="text-sm whitespace-nowrap">OR</span>
				<hr className="flex-grow border border-gray-800 border-b-0" />
			</div>

			{/* THis is all the login stuff below OR - aastha */}
			<div className="flex justify-center items-center">
				<div className="flex flex-col text-left w-[80%] space-y-4">
					<div className="relative w-full">
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
						{emailError && (
							<p className="text-red-500 text-xs mt-1">{emailError}</p>
						)}
					</div>

					<div className="relative w-full">
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

					<button
						onClick={handleLogin}
						className="bg-[#509275] text-white py-2 rounded-3xl hover:bg-gray-800 transition cursor-pointer"
					>
						Login
					</button>
				</div>
			</div>

			{/* this is the forgot password button */}
			<div className="text-right mt-2">
				<button className="text-black text-sm hover:underline cursor-pointer">
					Forgot password?
				</button>
			</div>
		</LogoBox>
	);
}
