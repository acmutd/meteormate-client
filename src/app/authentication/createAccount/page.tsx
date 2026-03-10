"use client";

import React, {useEffect, useRef, useState} from "react";
import LogoBox from "../../../components/LogoBox";
import {useRouter} from "next/navigation";
import {RegisterUser, SendVerificationCode} from "@/utils/api/auth";
import {Check, X} from "lucide-react";
import {
    validatePassword,
    validatePasswordMatch,
    getEmailValidationError,
} from "@/utils/validation";
import LoadingSpinner from "../../../components/LoadingSpinner";
import EmailInput from "@/components/forms/EmailInput";
import PasswordInput from "@/components/forms/PasswordInput";
import {useToast} from "@/components/ui/ToastProvider";
import {getAuthErrorMessage} from "@/utils/authErrors";


export default function CreateAccountPage() {
    const router = useRouter();
    const {toast} = useToast();

    const emailRef = useRef<HTMLInputElement | null>(null);

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [emailTouched, setEmailTouched] = useState(false);

    const [password, setPassword] = useState("");
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
        if (emailTouched) setEmailError(getEmailValidationError(value));
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

        if (!passwordValidation.isValid) {
            setEmailError("Please fix password requirements before continuing.");
            return;
        }

        const passwordMatchError = validatePasswordMatch(password, confirmPassword);
        if (passwordMatchError) {
            setConfirmPasswordError(passwordMatchError);
            return;
        }

        try {
            if (!isSigningUp) {
                setIsSigningUp(true);

                const utd_id = email.split("@")[0];

                const authResponse = await RegisterUser(email, password, utd_id);

                if (!authResponse.ok) {
                    toast({
                        type: "error",
                        title: authResponse.code,
                        description: authResponse.error,
                    });
                    return;
                }

                const userCredentials = authResponse.data;

                // set email in local storage
                localStorage.setItem("verificationEmail", email);
                router.push("./verifyEmail");

                const verifyResult = await SendVerificationCode({ email, uid: userCredentials.id });

                if (!verifyResult.ok) {
                    toast({
                        type: "error",
                        title: "Could not send verification email",
                        description: verifyResult.error,
                    });
                    return;
                }

                toast({
                    type: "success",
                    title: "Account created",
                    description: "We sent you a verification code. Check your email to continue.",
                });

                // navigate only after everything is set up
                router.push("./verifyEmail");

            }
        } catch (err: unknown) {
            console.error("Signup error:", err);
            const {message} = getAuthErrorMessage(err);
            toast({type: "error", title: "Sign up failed", description: message});
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

    const RequirementLine = ({
                                 ok,
                                 children,
                             }: {
        ok: boolean;
        children: React.ReactNode;
    }) => (
        <p
            className={[
                "[font-size:clamp(10px,1.5vh,12px)] flex items-center gap-1",
                ok ? "text-emerald-500" : "text-red-400",
            ].join(" ")}
        >
            {ok ? (
                <Check className="size-[clamp(0.75rem,2vh,1.25rem)]"/>
            ) : (
                <X className="size-[clamp(0.75rem,2vh,1.25rem)]"/>
            )}
            {children}
        </p>
    );

    return (
        <LogoBox logoSrc="/MM_logo_V1.webp" logoAlt="MeteorMate Logo">
            <button
                onClick={router.back}
                className="absolute top-8 left-5 p-2 rounded-full text-zinc-600 hover:bg-zinc-400/10 border border-white/10 hover:border-primary-hover/30 transition-colors"
                aria-label="Go back"
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

            <div className="w-full flex flex-col items-center">
                {/* Title + subtitle */}
                <div className="flex flex-col justify-center items-center text-center w-[clamp(10rem,55vh,25rem)]">
                    <h1 className="font-urbanist font-semibold text-black text-[clamp(20px,5vh,30px)] pt-6">
                        Create an Account
                    </h1>
                    <p className="font-urbanist font-light text-zinc-500 text-[clamp(7px,2vh,12px)]">
                        Please only use your UTD Email.
                    </p>
                </div>

                {/* Glass card container */}
                <div className="w-full flex justify-center items-center">
                    <div
                        className="w-[92%] sm:w-[80%] max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                        <form onSubmit={onSubmit} className="flex flex-col text-left space-y-4">
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
                                onBlur={() =>
                                    setConfirmPasswordError(
                                        validatePasswordMatch(password, confirmPassword)
                                    )
                                }
                                label="Verify Password"
                                error={confirmPasswordError}
                                disabled={isSigningUp}
                                showToggle
                                autoComplete="new-password"
                            />

                            <div className="pt-1">
                                {/* Section Title */}
                                <p className="[font-size:clamp(10px,2vh,14px)] text-zinc-600 mb-1">
                                    Passwords must:
                                </p>

                                <RequirementLine ok={passwordValidation.checks.minLength}>
                                    At least 8 characters
                                </RequirementLine>
                                <RequirementLine ok={passwordValidation.checks.lowercase}>
                                    At least one lowercase letter (a-z)
                                </RequirementLine>
                                <RequirementLine ok={passwordValidation.checks.uppercase}>
                                    At least one uppercase letter (A-Z)
                                </RequirementLine>
                                <RequirementLine ok={passwordValidation.checks.number}>
                                    At least one number (0-9)
                                </RequirementLine>
                                <RequirementLine ok={passwordValidation.checks.special}>
                                    At least one special character (!@#$%)
                                </RequirementLine>
                            </div>

                            {/* Create account button */}
                            <button
                                type="submit"
                                disabled={!canSubmit}
                                className={[
                                    "mt-4 -mb-4 py-2 px-6 rounded-3xl",
                                    "transition-all duration-200 flex items-center justify-center gap-2",
                                    "border font-medium",
                                    !canSubmit
                                        ? "bg-zinc-500/10 text-zinc-400 border-white/10 cursor-not-allowed"
                                        : "bg-primary text-white border-primary/30 hover:bg-primary-hover hover:border-primary-hover/40 cursor-pointer shadow-lg shadow-primary/20",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0",
                                ].join(" ")}
                            >
                                {isSigningUp && <LoadingSpinner size="sm"/>}
                                {isSigningUp ? "Creating..." : "Create Account"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </LogoBox>
    );
}
