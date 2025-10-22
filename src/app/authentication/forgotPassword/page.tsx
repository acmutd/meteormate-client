"use client";
import React, { useRef, useState } from "react";
import LogoBox from "../../../../components/LogoBox";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [code, setCode] = useState(Array(6).fill(""));
	const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const [emailError, setEmailError] = useState(""); 
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
	const handleResetPassword = () => {
		
	}

	return (
		<LogoBox logoSrc="/images/MM_logo_V1.png" logoAlt="MeteorMate Logo">
			<div className="flex flex-col w-full max-w-2xl px-10">
				<h1 className="font-urbanist font-semibold md:text-[35px] text-[20px] p-2">
					Forgot Password
				</h1>
				<p className="font-urbanist font-light md:text-[12px] text-[10px] pb-3">
					UTD Email
				</p>
				<div className="relative w-full flex flex-col">
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
                        placeholder="abc123452@utdallas.edu"
                        className="pl-11 pr-10 border border-black py-3 rounded-3xl font-light text-[12px] md:text-[15px] text-left w-full"
                        />
                    </div>
                    {emailError && (
                        <p className="text-red-500 text-xs mt-1">{emailError}</p>
                    )}
                    </div>


				{/* code */}
				{/* <div className="flex space-x-3 justify-center">
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
				</div> */}

				{/* verify button */}
				<button
					onClick={() => router.push("/authentication/verifyPassword")}
					className="mt-4 mb-4 bg-[#509275] text-white py-2 rounded-3xl hover:bg-gray-800 transition cursor-pointer"
				>
					Reset Password
				</button>
			</div>
		</LogoBox>
	);
}
