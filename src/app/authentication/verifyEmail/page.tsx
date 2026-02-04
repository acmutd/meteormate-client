"use client";
import React, {useRef, useState, useEffect} from "react";
import LogoBox from "../../../components/LogoBox";
import {useRouter} from "next/navigation";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function VerifyEmailPage() {
    const router = useRouter();

    const [code, setCode] = useState(Array(6).fill(""));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const [email, setEmail] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        setEmail(localStorage.getItem("verificationEmail"));
    }, []);

    useEffect(() => {
        const t = setTimeout(() => inputsRef.current[0]?.focus(), 0);
        return () => clearTimeout(t);
    }, []);

    const handleChange = (value: string, index: number) => {
        if (/^\d$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);
            if (index < 5) inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
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
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputsRef.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleVerifyEmail = async () => {
        const verificationCode = code.join("");
        setError(null);

        if (verificationCode.length !== 6) {
            setError("Please enter the 6-digit code.");
            return;
        }

        if (isVerifying) return;

        try {
            setIsVerifying(true);
            const storedEmail = localStorage.getItem("verificationEmail");

            if (!storedEmail) {
                setError("No email found. Please sign up again.");
                return;
            }

            const response = await fetch(`/api/auth/verify-email`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email: storedEmail,
                    code: verificationCode,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                setError(errorData.detail || "Invalid code. Please try again.");
                return;
            }

            router.push("../authentication?created=1");
        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error("Verification error:", (err as Error).message);
        } finally {
            setIsVerifying(false);
        }
    };

    const resendCode = async () => {
        const storedEmail = localStorage.getItem("verificationEmail");
        setError(null);

        if (!storedEmail) {
            setError("No email found. Please log in again.");
            return;
        }

        if (isResending) return;

        try {
            setIsResending(true);
            const res = await fetch(`/api/auth/send-verification-code`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email: storedEmail, purpose: "verify"}),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data.detail || "Failed to resend code.");
            }
        } catch {
            setError("Failed to resend code. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    const isBusy = isVerifying || isResending;

    return (
        <LogoBox logoSrc="/MM_logo_V1.webp" logoAlt="MeteorMate Logo">
            <div className="w-full px-6">
                {/* Back arrow - Dark */}
                <button
                    onClick={router.back}
                    className="absolute top-8 left-5 p-2 rounded-full text-zinc-600 hover:bg-zinc-400/10 border border-white/10 hover:border-orange-500/30 transition-colors"
                    aria-label="Go back"
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
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                    </svg>
                </button>

                <div className="mx-auto w-full max-w-md">
                    <div className="text-center mb-4">

                        <div className="flex flex-col justify-center items-center text-center">
                            <h1 className="mt-3 font-urbanist font-semibold md:text-[35px] text-[20px] text-black pt-2">
                                Verify Email
                            </h1>
                        </div>

                        <p className="mt-1 font-urbanist font-light md:text-[12px] text-[10px] text-zinc-500">
                            {email
                                ? `We sent a 6-digit code to ${email}.`
                                : "We sent a 6-digit code to your registered email."}
                        </p>

                        <p className="font-urbanist font-light md:text-[12px] text-[10px] text-zinc-500 -mb-4">
                            Enter it below to activate your account.
                        </p>
                    </div>

                    {/* Glass card */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 pt-4 pb-0">
                        <div className="flex justify-center gap-2 sm:gap-3">
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
                                    disabled={isBusy}
                                    aria-label={`Verification digit ${index + 1}`}
                                    className={[
                                        "w-12 h-12 text-center text-xl rounded-lg",
                                        "bg-white/5 text-black placeholder:text-zinc-400",
                                        "border border-zinc-300",
                                        "outline-none",
                                        "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30",
                                        "disabled:opacity-50 disabled:cursor-not-allowed",
                                        "transition-all duration-200",
                                    ].join(" ")}
                                />
                            ))}
                        </div>

                        {error && <p className="mt-3 text-sm text-red-500 text-center">{error}</p>}

                        <button
                            onClick={handleVerifyEmail}
                            disabled={isVerifying}
                            className={[
                                "mt-5 w-full py-2 rounded-3xl",
                                "transition-all duration-200 flex items-center justify-center gap-2",
                                "border font-medium",
                                isVerifying
                                    ? "bg-zinc-500/10 text-zinc-400 border-zinc-500/10 cursor-not-allowed"
                                    : "bg-orange-500 text-white border-orange-500/30 hover:bg-orange-400 hover:border-orange-400/40 cursor-pointer shadow-lg shadow-orange-900/20",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 focus-visible:ring-offset-0",
                            ].join(" ")}
                            type="button"
                        >
                            {isVerifying && <LoadingSpinner size="sm"/>}
                            {isVerifying ? "Verifying..." : "Verify Email"}
                        </button>

                        <button
                            onClick={resendCode}
                            disabled={isResending}
                            className={[
                                "w-full mt-3 text-sm underline underline-offset-4",
                                isResending
                                    ? "text-zinc-400 cursor-not-allowed"
                                    : "text-zinc-500 hover:text-orange-500 cursor-pointer transition-colors",
                            ].join(" ")}
                            type="button"
                        >
                            {isResending ? "Resending..." : "Resend code"}
                        </button>
                    </div>
                </div>
            </div>
        </LogoBox>
    );
}
