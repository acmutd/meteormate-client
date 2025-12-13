"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LogoBox from "../../../components/LogoBox";
import { doSignInWithEmailAndPassword } from "../../firebase/auth";
import { useAuth } from "../../contexts/authContext";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
	const router = useRouter();
	const auth = useAuth(); // avoid destructuring directly
	const userLoggedIn = auth?.userLoggedIn;

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [isSigningIn, setIsSigningIn] = useState(false);

  // to know if we should show the red banner and disable/hide the "create an account" button
  const searchParams = useSearchParams();
  const created = searchParams.get("created") === "1";

  // If already logged in, redirect
  useEffect(() => {
    if (userLoggedIn) {
      router.push("../authentication"); // this pushs it back to the authentication
    }
  }, [userLoggedIn, router]);

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

	const handleLogin = async () => {
        router.push("/onboarding/createProfile")
	// 	if (!email.endsWith("@utdallas.edu")) {
	// 		setEmailError("Please enter a valid @utdallas.edu email.");
	// 		return;
	// 	} // just making sure that the email ends with @utdallas.edu

	// //then we try to get if is signing in is true whne the value is flipped then we set the value to be actually true and then call signing with email and password and then router.push it to the createAccount page
    // try {
    //   if (!isSigningIn) {
    //     setIsSigningIn(true);
    //     await doSignInWithEmailAndPassword(email, password);
    //     router.push("../dashboard"); // redirect after login CHANGE HERE ONCE THE HOME PAGE IS UP
    //   }
    // } catch (err: any) { //just in case there's a problem signing in 
    //   console.error("Login error:", err);
    //   setEmailError(err.message || "Login failed"); // for what reasons
    // } finally {
    //   setIsSigningIn(false);
    // }
  };

  return (
    <LogoBox logoSrc="/images/MM_logo_V1.png" logoAlt="MeteorMate Logo">
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

        {/* Login form */}
        <div className="flex justify-center items-center">
            <div className="flex flex-col text-left w-[85%] space-y-4 relative">
                {/* Email field */}
                <div className="flex flex-col">
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

                {/* Password field */}
                <div className="flex flex-col">
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

                <button
                    onClick={handleLogin}
                    disabled={isSigningIn}
                    className="bg-[#509275] text-white rounded-3xl hover:bg-gray-800 transition cursor-pointer py-3"
                >
                    {isSigningIn ? "Logging in..." : "Login"}
                </button>
            </div>
        </div>

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
