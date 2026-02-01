"use client";
import React, { useEffect, useRef, useState } from "react";
import LogoBox from "../../../components/LogoBox";
import { useRouter } from "next/navigation";
import { getEmailValidationError } from "@/utils/validation";
import LoadingSpinner from "../../../components/LoadingSpinner";
import EmailInput from "@/components/forms/EmailInput";
import { useToast } from "@/components/ui/ToastProvider";

export default function VerifyEmailPage() {
  const router = useRouter();
	const { toast } = useToast();
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
    if (emailTouched) {
      setEmailError(getEmailValidationError(value));
    }
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

    const response = await fetch(
      `api/auth/send-verification-code`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          purpose: "reset", // tell backend this is a reset, not signup verification
        }),
      }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.detail || "Failed to send verification code.");
    }

    localStorage.setItem("resetEmail", email);
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
    const errorMessage = err && typeof err === "object" && "message" in err && typeof err.message === "string" 
      ? err.message 
      : "Something went wrong. Please try again.";
    setEmailTouched(true);
    setEmailError(errorMessage);
		toast({ type: "error", title: "Couldn't send code", description: errorMessage });
  } finally {
    setIsSending(false);
  }
};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		void handleResetPassword();
	};



  return (
    <LogoBox logoSrc="/MM_logo_V1.webp" logoAlt="MeteorMate Logo">
      <div className="flex flex-col w-full max-w-2xl px-10">
				{/* Back arrow to login */}
				<button
					onClick={() => router.push("/authentication")}
					className="absolute top-8 left-5 p-2 hover:bg-gray-100 rounded-full transition-colors"
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
						<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
					</svg>
				</button>

        <h1 className="font-urbanist font-semibold md:text-[35px] text-[20px] p-2">
          Forgot Password
        </h1>
        <p className="font-urbanist font-light md:text-[12px] text-[10px] pb-3">
          UTD Email
        </p>

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
						disabled={isSending || !!emailError || !email}
						className="mt-4 mb-4 bg-[#509275] text-white py-2 rounded-3xl hover:bg-gray-800 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{isSending && <LoadingSpinner size="sm" />}
						{isSending ? "Sending..." : "Reset Password"}
					</button>
				</form>
      </div>
    </LogoBox>
  );
}
