"use client";
import React, {useEffect, useRef, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import LogoBox from "../../components/LogoBox";
import {doSignInWithEmailAndPassword} from "../../firebase/auth";
import {useAuth} from "../../contexts/authContext";
import {getEmailValidationError} from "@/utils/validation";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmailInput from "@/components/forms/EmailInput";
import PasswordInput from "@/components/forms/PasswordInput";
import {useToast} from "@/components/ui/ToastProvider";
import {getAuthErrorMessage} from "@/utils/authErrors";
import {callActivityPing} from "@/utils/api/auth";

async function hasSurvey(idToken: string): Promise<boolean> {
    const res = await fetch(`api/survey/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
        },
    });

    if (res.status === 404) return false;
    if (res.ok) return true;

    if (res.status === 401) {
        throw new Error("AUTH_EXPIRED");
    }

    throw new Error(`UNEXPECTED_${res.status}`);
}

export default function LoginPage() {
    const router = useRouter();
    const {toast} = useToast();
    const auth = useAuth();
    const userLoggedIn = auth?.userLoggedIn;
    const emailRef = useRef<HTMLInputElement | null>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [emailTouched, setEmailTouched] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const toastShownRef = useRef(false);

    const searchParams = useSearchParams();
    const created = searchParams.get("created") === "1";

    // Redirect if logged in
    useEffect(() => {
        if (userLoggedIn) {
            router.push("../authentication");
        }
    }, [userLoggedIn, router]);

    useEffect(() => {
        emailRef.current?.focus();
    }, []);

    useEffect(() => {
        if (
            !toastShownRef.current &&
            searchParams.get("toast") === "not-signed-in"
        ) {
            toast({
                type: "error",
                title: "Not Signed In",
                description:
                    "You must be signed in to access your profile. Please log in to continue.",
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

        try {
            if (!isSigningIn) {
                setIsSigningIn(true);
                const userCredential = await doSignInWithEmailAndPassword(
                    email,
                    password
                );
                const idToken = await userCredential.user.getIdToken();

                const pingResponse = await callActivityPing();
                if (!pingResponse.ok) {
                    console.log(
                        `Error ${pingResponse.code} when calling activityPing: ${pingResponse.error}`
                    );
                }
                const completed = await hasSurvey(idToken);

                toast({
                    type: "success",
                    title: "Welcome back!",
                    description: "You’re now logged in.",
                });
                router.push(completed ? "/dashboard" : "../onboarding/createProfile");
            }
        } catch (err: unknown) {
            console.error("Login error:", err);
            const {message} = getAuthErrorMessage(err);
            toast({type: "error", title: "Login failed", description: message});
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
            {/* Back arrow */}
            <button
                onClick={() => router.push("/")}
                className="absolute top-8 left-5 p-2 rounded-full text-zinc-600 hover:bg-zinc-400/5 border border-white/10 hover:border-orange-500/30 transition-colors"
                aria-label="Back to landing page"
                type="button"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 pr-0.5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                </svg>
            </button>

            {/* Main Container */}
            <div className="w-full flex flex-col items-center">
                <div className="flex flex-col justify-center items-center text-center pb-2">
                    {/* Main Title */}
                    <h1 className="font-urbanist font-semibold md:text-[35px] text-[20px] pt-6 text-black">
                        Welcome to MeteorMate
                    </h1>
                    {/* Subtitle */}
                    <p className="font-urbanist font-light md:text-[12px] text-[10px] text-zinc-500">
                        Enhance your roommate search with AI powered matchmaking
                    </p>
                </div>

                {/* Glass Card */}
                <div
                    className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 sm:p-8">
                    {created && (
                        <div
                            className="mb-6 rounded-md border border-orange-500/20 bg-orange-500/10 p-3 text-sm text-orange-200 text-center"
                            role="status"
                            aria-live="polite"
                        >
                            Account created! Please log in with your credentials.
                        </div>
                    )}

                    {/* Create Account Button */}
                    <button
                        onClick={() => router.push("/authentication/createAccount")}
                        className="w-full mb-6 py-3 rounded-3xl border border-zinc-500 text-zinc-500 font-light text-sm md:text-[15px] hover:bg-white/5 hover:border-orange-400/90 hover:text-orange-400 transition-all duration-300"
                    >
                        Create an account
                    </button>

                    {/* OR Divider */}
                    <div className="flex items-center justify-center w-full gap-4 text-zinc-500 py-2 mb-4">
                        <hr className="grow border-zinc-400"/>
                        <span className="text-xs font-medium tracking-wider uppercase">
              OR
            </span>
                        <hr className="grow border-zinc-400"/>
                    </div>

                    {/* Login form */}
                    <form
                        onSubmit={onSubmit}
                        className="flex flex-col w-full space-y-5"
                    >
                        {/* Inputs */}
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

                        {/* Primary Action */}
                        <button
                            type="submit"
                            disabled={isSigningIn}
                            className={[
                                "w-full py-3 rounded-3xl transition-all duration-200 flex items-center justify-center gap-2",
                                "border font-medium",
                                isSigningIn
                                    ? "bg-white/10 text-zinc-400 border-white/10 cursor-not-allowed"
                                    : "bg-orange-500 text-white border-orange-500/30 hover:bg-orange-400 hover:border-orange-400/40 cursor-pointer shadow-lg shadow-orange-900/20",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 focus-visible:ring-offset-0",
                            ].join(" ")}
                        >
                            {isSigningIn && <LoadingSpinner size="sm"/>}
                            {isSigningIn ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    {/* Forgot Password Link */}
                    <div className="text-center mt-6 -mb-6">
                        <button
                            onClick={() => router.push("/authentication/forgotPassword")}
                            className="text-zinc-400 text-sm hover:text-orange-400 hover:underline underline-offset-4 transition-colors cursor-pointer"
                        >
                            Forgot password?
                        </button>
                    </div>
                </div>
            </div>
        </LogoBox>
    );
}
