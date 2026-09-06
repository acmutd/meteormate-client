"use client";

import React, {useEffect, useState} from "react";
import LogoBox from "../../../components/LogoBox";
import {useRouter} from "next/navigation";
import {validatePasswordMatch, validatePassword} from "@/utils/validation";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PasswordInput from "@/components/forms/PasswordInput";
import {useToast} from "@/components/ui/ToastProvider";
import {Check, X} from "lucide-react";
import {ResetPassword, SendResetPasswordCode} from "@/utils/api/auth";
import {OTP_LENGTH} from "@/constants/otp";
import OtpCodeInput from "@/components/forms/OtpCodeInput";

export default function NewPasswordPage() {
    const router = useRouter();
    const {toast} = useToast();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [passwordValidation, setPasswordValidation] = useState(() =>
        validatePassword("")
    );

    useEffect(() => {
        const storedEmail = sessionStorage.getItem("resetEmail");

        if (!storedEmail) {
            router.replace("/authentication/forgotPassword");
            return;
        }

        setEmail(storedEmail);
    }, [router]);

    const handleCodeChange = (nextCode: string[]) => {
        setCode(nextCode);
        setErrorMsg("");
    };

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

        const verificationCode = code.join("");
        if (verificationCode.length !== OTP_LENGTH) {
            setErrorMsg(`Please enter the full ${OTP_LENGTH}-digit verification code.`);
            return;
        }

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

        if (!email) {
            setErrorMsg("Missing reset email. Please restart the reset process.");
            return;
        }

        try {
            setIsSubmitting(true);

            const result = await ResetPassword(email, verificationCode, password);

            if (!result.ok) {
                throw new Error(result.error || "Failed to reset password.");
            }

            sessionStorage.removeItem("resetEmail");

            toast({
                type: "success",
                title: "Password updated",
                description: "You can log in with your new password.",
            });

            router.push("../authentication");
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Something went wrong.";
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

    const resendCode = async () => {
        if (!email || isResending) return;

        try {
            setIsResending(true);
            setErrorMsg("");

            const result = await SendResetPasswordCode(email);
            if (!result.ok) {
                throw new Error(result.error || "Failed to resend code.");
            }

            setCode(Array(OTP_LENGTH).fill(""));
            toast({
                type: "success",
                title: "Verification code sent",
                description: "Check your email for a new 6-digit code.",
            });
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to resend code. Please try again.";
            setErrorMsg(errorMessage);
            toast({
                type: "error",
                title: "Couldn't resend code",
                description: errorMessage,
            });
        } finally {
            setIsResending(false);
        }
    };

    const canSubmit =
        !isSubmitting &&
        !isResending &&
        passwordValidation.isValid &&
        !!confirmPassword &&
        validatePasswordMatch(password, confirmPassword) === "" &&
        !!email &&
        code.join("").length === OTP_LENGTH;

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

    const isBusy = isSubmitting || isResending;

    return (
        <LogoBox logoSrc="/MM_logo_V2.svg" logoAlt="MeteorMate Logo">
            <div className="flex flex-col w-full max-w-2xl px-10">
                <button
                    onClick={() => router.push("/authentication/forgotPassword")}
                    className="absolute top-8 left-5 p-2 rounded-full text-zinc-600 hover:bg-zinc-400/10 border border-white/10 hover:border-primary-hover/30 transition-colors"
                    aria-label="Back to forgot password"
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
                            d="M15.75 19.5 8.25 12l7.5-7.5"
                        />
                    </svg>
                </button>

                <div className="flex flex-col justify-center items-center text-center pb-2">
                    <h1 className="font-urbanist font-semibold md:text-[35px] text-[20px] pt-6 text-black">
                        Reset Password
                    </h1>
                    <p className="font-urbanist font-light md:text-[12px] text-[10px] text-zinc-500">
                        Enter the code from your email and choose a strong new password.
                    </p>
                </div>

                <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                    <form onSubmit={onSubmit} className="flex flex-col gap-3">
                        <div>
                            <p className="block text-sm font-urbanist font-light text-zinc-400 mb-2">
                                Verification code
                            </p>
                            <OtpCodeInput
                                value={code}
                                onChange={handleCodeChange}
                                disabled={isBusy}
                                ariaLabelPrefix="Reset code"
                                inputClassName="w-10 h-10 sm:w-12 sm:h-12"
                            />
                            <button
                                type="button"
                                onClick={resendCode}
                                disabled={isBusy}
                                className={[
                                    "w-full mt-3 text-sm underline underline-offset-4",
                                    isBusy
                                        ? "text-zinc-400 cursor-not-allowed"
                                        : "text-zinc-500 hover:text-primary-hover cursor-pointer transition-colors",
                                ].join(" ")}
                            >
                                {isResending ? "Resending..." : "Resend code"}
                            </button>
                        </div>

                        <PasswordInput
                            value={password}
                            onChange={handlePasswordChange}
                            label="Password"
                            disabled={isBusy}
                            showToggle
                            autoComplete="new-password"
                        />

                        <PasswordInput
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            label="Verify Password"
                            error={confirmPasswordError}
                            disabled={isBusy}
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
                                    : "bg-primary text-white border-primary/30 hover:bg-primary-hover hover:border-primary-hover/40 cursor-pointer shadow-lg shadow-primary/20",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0",
                            ].join(" ")}
                        >
                            {isSubmitting && <LoadingSpinner size="sm"/>}
                            {isSubmitting ? "Updating..." : "Update Password"}
                        </button>

                        <p className="text-center text-xs text-zinc-500 -mb-4">
                            If you didn&apos;t request this reset, go back and log in normally.
                        </p>
                    </form>
                </div>
            </div>
        </LogoBox>
    );
}
