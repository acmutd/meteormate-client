"use client";
import React, {useEffect, useRef, useState} from "react";
import LogoBox from "../../../components/LogoBox";
import {useRouter} from "next/navigation";
import {validatePasswordMatch, validatePassword} from "@/utils/validation";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PasswordInput from "@/components/forms/PasswordInput";
import {useToast} from "@/components/ui/ToastProvider";
import {Check, X} from "lucide-react";

function extractErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message) return error.message;
    return fallback;
}

export default function NewPasswordPage() {
    const router = useRouter();
    const {toast} = useToast();
    const passwordRef = useRef<HTMLInputElement | null>(null);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [passwordValidation, setPasswordValidation] = useState(() =>
        validatePassword("")
    );

    // Load email + code saved earlier
    useEffect(() => {
        const storedEmail = localStorage.getItem("resetEmail");
        const storedCode = localStorage.getItem("resetCode");

        if (storedEmail) setEmail(storedEmail);
        if (storedCode) setCode(storedCode);

        // Optional: if either is missing, kick them back to Forgot Password
        // if (!storedEmail || !storedCode) router.push("/authentication/forgotPassword");
    }, [router]);

    useEffect(() => {
        passwordRef.current?.focus();
    }, []);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordValidation(validatePassword(value));

        if (confirmPassword) {
            setConfirmPasswordError(validatePasswordMatch(value, confirmPassword));
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setConfirmPasswordError(validatePasswordMatch(password, value));
    };

    const handleSubmit = async () => {
        setErrorMsg("");

        if (!password || !confirmPassword) {
            setErrorMsg("Please fill out both password fields.");
            return;
        }

        if (!passwordValidation.isValid) {
            setErrorMsg(
                "Password does not meet requirements. Please ensure it has at least 8 characters, includes uppercase, lowercase, number, and special character."
            );
            return;
        }

        const passwordMatchError = validatePasswordMatch(password, confirmPassword);
        if (passwordMatchError) {
            setConfirmPasswordError(passwordMatchError);
            return;
        }

        if (!email || !code) {
            setErrorMsg("Missing reset email or code. Please restart the reset process.");
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch(`/api/auth/reset-password`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email,
                    code,
                    new_password: password,
                }),
            });

            if (!response.ok) {
                const data = (await response.json().catch(() => ({}))) as { detail?: string };
                throw new Error(data.detail || "Failed to reset password.");
            }

            localStorage.removeItem("resetEmail");
            localStorage.removeItem("resetCode");

            toast({
                type: "success",
                title: "Password updated",
                description: "You can log in with your new password.",
            });

            router.push("../authentication");
        } catch (err: unknown) {
            console.error("Reset password error:", err);
            const errorMessage = extractErrorMessage(err, "Something went wrong.");
            setErrorMsg(errorMessage);
            toast({
                type: "error",
                title: "Couldn't update password",
                description: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const canSubmit =
        !isSubmitting &&
        passwordValidation.isValid &&
        !!confirmPassword &&
        validatePasswordMatch(password, confirmPassword) === "" &&
        !!email &&
        !!code;

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        void handleSubmit();
    };

    const RequirementLine = ({ok, children,}: {
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
            <div className="flex flex-col w-full max-w-2xl px-10">
                {/* Back Arrow */}
                <button
                    onClick={() => router.push("/authentication")}
                    className="absolute top-8 left-5 p-2 rounded-full text-zinc-600 hover:bg-zinc-400/10 border border-white/10 hover:border-orange-500/30 transition-colors"
                    aria-label="Back to login"
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

                {/* Title */}
                <div className="flex flex-col justify-center items-center text-center pb-2">
                    <h1 className="font-urbanist font-semibold md:text-[35px] text-[20px] pt-6 text-black">
                        Input New Password
                    </h1>
                    <p className="font-urbanist font-light md:text-[12px] text-[10px] text-zinc-500">
                        Choose a strong password you haven’t used before.
                    </p>
                </div>

                {/* Glass card container */}
                <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                    <form onSubmit={onSubmit} className="flex flex-col gap-3">
                        <PasswordInput
                            value={password}
                            onChange={handlePasswordChange}
                            label="Password"
                            disabled={isSubmitting}
                            showToggle
                            autoComplete="new-password"
                            inputRef={passwordRef}
                        />

                        <PasswordInput
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            label="Verify Password"
                            error={confirmPasswordError}
                            disabled={isSubmitting}
                            showToggle
                            autoComplete="new-password"
                        />

                        <div className="pt-1 space-y-1">
                            <p className="text-xs text-zinc-600 font-medium mb-2">Password requirements:</p>
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

                        {errorMsg && <p className="text-red-500 text-xs mt-2 text-center">{errorMsg}</p>}

                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className={[
                                "mt-4 mb-1 py-2 rounded-3xl",
                                "transition-all duration-200 flex items-center justify-center gap-2",
                                "border font-medium",
                                !canSubmit
                                    ? "bg-zinc-500/10 text-zinc-400 border-white/10 cursor-not-allowed"
                                    : "bg-orange-500 text-white border-orange-500/30 hover:bg-orange-400 hover:border-orange-400/40 cursor-pointer shadow-lg shadow-orange-900/20",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 focus-visible:ring-offset-0",
                            ].join(" ")}
                        >
                            {isSubmitting && <LoadingSpinner size="sm"/>}
                            {isSubmitting ? "Updating..." : "Update Password"}
                        </button>

                        <p className="text-center text-xs text-zinc-500 -mb-4">
                            If you didn’t request this reset, go back and log in normally.
                        </p>
                    </form>
                </div>
            </div>
        </LogoBox>
    );
}
