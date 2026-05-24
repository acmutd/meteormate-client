"use client";

import React, {useEffect, useRef, useState} from "react";
import LogoBox from "../../../components/LogoBox";
import {useRouter} from "next/navigation";
import {getEmailValidationError} from "@/utils/validation";
import LoadingSpinner from "../../../components/LoadingSpinner";
import EmailInput from "@/components/forms/EmailInput";
import {useToast} from "@/components/ui/ToastProvider";

export default function VerifyEmailPage() {
    const router = useRouter();
    const {toast} = useToast();

    const emailRef = useRef<HTMLInputElement | null>(null);

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [emailTouched, setEmailTouched] = useState(false);
    const [isSending, setIsSending] = useState(false);

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

    const handleResetPassword = async () => {
        setEmailTouched(true);

        const emailErr = getEmailValidationError(email);
        if (emailErr) {
            setEmailError(emailErr);
            return;
        }

        try {
            setIsSending(true);

            const response = await fetch(`/api/auth/send-verification-code`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email,
                    purpose: "reset",
                }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.detail || "Failed to send verification code.");
            }

            sessionStorage.setItem("resetEmail", email);

            toast({
                type: "success",
                title: "Verification code sent",
                description: "Check your email for the 6-digit code.",
            });

            router.push(
                `/authentication/verifyPassword?email=${encodeURIComponent(email)}`
            );
        } catch (err: unknown) {
            console.error("Error sending reset verification:", err);

            const errorMessage =
                err &&
                typeof err === "object" &&
                "message" in err &&
                typeof err.message === "string"
                    ? err.message
                    : "Something went wrong. Please try again.";

            setEmailTouched(true);
            setEmailError(errorMessage);

            toast({
                type: "error",
                title: "Couldn't send code",
                description: errorMessage,
            });
        } finally {
            setIsSending(false);
        }
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        void handleResetPassword();
    };

    const canSubmit =
        !isSending && !!email && !getEmailValidationError(email) && !emailError;

    return (
        <LogoBox logoSrc="/MM_logo_V2.svg" logoAlt="MeteorMate Logo">
            <div className="flex flex-col w-full max-w-2xl px-10">
                {/* Back arrow */}
                <button
                    onClick={() => router.push("/authentication")}
                    className="absolute top-8 left-5 p-2 rounded-full text-zinc-600 hover:bg-zinc-400/10 border border-white/10 hover:border-primary-hover/30 transition-colors"
                    aria-label="Back to login"
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

                {/* Title */}
                <div className="flex flex-col justify-center items-center text-center pb-2">
                    <h1 className="font-urbanist font-semibold md:text-[35px] text-[20px] pt-6 text-black">
                        Forgot Password
                    </h1>
                    <p className="font-urbanist font-light md:text-[12px] text-[10px] text-zinc-500">
                        Enter your UTD email and we’ll send a 6-digit verification code.
                    </p>
                </div>

                {/* Glass card container */}
                <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                    <form onSubmit={onSubmit} className="flex flex-col">
                        <EmailInput
                            value={email}
                            onChange={handleEmailChange}
                            onBlur={handleEmailBlur}
                            placeholder="abc123452@utdallas.edu"
                            disabled={isSending}
                            error={emailError}
                            inputRef={emailRef}
                        />

                        {/* verify button */}
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className={[
                                "mt-4 -mb-4 py-2 rounded-3xl",
                                "transition-all duration-200 flex items-center justify-center gap-2",
                                "border font-medium",
                                !canSubmit
                                    ? "bg-zinc-500/10 text-zinc-400 border-white/10 cursor-not-allowed"
                                    : "bg-primary text-white border-primary/30 hover:bg-primary-hover hover:border-primary-hover/40 cursor-pointer shadow-lg shadow-primary/20",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0",
                            ].join(" ")}
                        >
                            {isSending && <LoadingSpinner size="sm"/>}
                            {isSending ? "Sending..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
        </LogoBox>
    );
}
