"use client";
import React, {useEffect, useRef, useState} from "react";
import LogoBox from "../../../components/LogoBox";
import {useRouter, useSearchParams} from "next/navigation";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function VerifyPassword() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // email passed from: /authentication/verifyPassword?email=...
    const emailFromQuery = searchParams.get("email");
    const [email] = useState(emailFromQuery || "");

    const [code, setCode] = useState<string[]>(Array(6).fill(""));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const [error, setError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => inputsRef.current[0]?.focus(), 0);
        return () => clearTimeout(t);
    }, []);

    const handleChange = (value: string, index: number) => {
        if (/^\d$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);
            setError("");

            if (index < 5) inputsRef.current[index + 1]?.focus();
        } else if (value === "") {
            const newCode = [...code];
            newCode[index] = "";
            setCode(newCode);
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

    const handleVerifyPassword = async () => {
        const verificationCode = code.join("");

        if (!email) {
            setError("Missing email. Please restart the reset password process.");
            return;
        }

        if (verificationCode.length !== 6) {
            setError("Please enter the full 6-digit code.");
            return;
        }

        try {
            setIsVerifying(true);
            setError("");

            // Verify code with backend
            const response = await fetch(`/api/auth/verify-reset-code`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email,
                    code: verificationCode,
                }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.detail || "Invalid or expired code.");
            }

            // Store for next page (so /newPassword can use it)
            sessionStorage.setItem("resetEmail", email);
            sessionStorage.setItem("resetCode", verificationCode);

            router.push("/authentication/newPassword");
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Verification failed. Please try again.";
            setError(errorMessage);
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <LogoBox logoSrc="/MM_logo_V1.webp" logoAlt="MeteorMate Logo">
            <div className="w-full px-6">
                {/* Back arrow */}
                <button
                    onClick={() => router.push("/authentication/forgotPassword")}
                    className="absolute top-8 left-5 p-2 rounded-full text-white/90 hover:text-white hover:bg-white/5 border border-white/10 hover:border-primary-hover/30 transition-colors"
                    aria-label="Back"
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
                    </svg>
                </button>

                <div className="mx-auto w-full max-w-md">
                    <div className="text-center mb-4">
            <span
                className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium tracking-wider uppercase">
              Password reset
            </span>

                        <h1 className="mt-3 font-urbanist font-semibold md:text-[35px] text-[20px] text-white">
                            Verify Code
                        </h1>

                        <p className="mt-1 font-urbanist font-light md:text-[12px] text-[10px] text-zinc-400">
                            We sent a 6-digit code to {email || "your UTD email address"}.
                        </p>
                        <p className="font-urbanist font-light md:text-[12px] text-[10px] text-zinc-400">
                            Enter it below to continue.
                        </p>
                    </div>

                    {/* Glass card */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
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
                                    disabled={isVerifying}
                                    aria-label={`Reset code digit ${index + 1}`}
                                    className={[
                                        "w-12 h-12 text-center text-xl rounded-lg",
                                        "bg-white/5 text-white",
                                        "border border-white/10",
                                        "outline-none",
                                        "focus:border-primary/40 focus:ring-2 focus:ring-primary/30",
                                        "disabled:opacity-50 disabled:cursor-not-allowed",
                                        "transition-colors",
                                    ].join(" ")}
                                />
                            ))}
                        </div>

                        {error && <p className="text-red-400 text-xs mt-3 text-center max-w-xs mx-auto">{error}</p>}

                        <button
                            onClick={handleVerifyPassword}
                            disabled={isVerifying}
                            className={[
                                "mt-5 w-full py-2 rounded-3xl",
                                "transition-all duration-200 flex items-center justify-center gap-2",
                                "border",
                                isVerifying
                                    ? "bg-white/10 text-zinc-400 border-white/10 cursor-not-allowed"
                                    : "bg-primary text-white border-primary/30 hover:bg-primary-hover hover:border-primary-hover/40 cursor-pointer",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0",
                            ].join(" ")}
                            type="button"
                        >
                            {isVerifying && <LoadingSpinner size="sm"/>}
                            {isVerifying ? "Verifying..." : "Verify Code"}
                        </button>

                        <p className="text-center text-xs text-zinc-400 mt-3">
                            Tip: You can paste digits one-by-one; use backspace to move left.
                        </p>
                    </div>
                </div>
            </div>
        </LogoBox>
    );
}
