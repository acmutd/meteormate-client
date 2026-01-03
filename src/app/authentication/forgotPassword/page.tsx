"use client";
import React, { useState } from "react";
import LogoBox from "../../../../components/LogoBox";
import { useRouter } from "next/navigation";
import { getEmailValidationError } from "@/utils/validation";
import LoadingSpinner from "../../../../components/LoadingSpinner";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(getEmailValidationError(value));
  };

  const handleResetPassword = async () => {
    // Validate email before proceeding
    const emailErr = getEmailValidationError(email);
    if (emailErr) {
      setEmailError(emailErr);
      return;
    }

  try {
    setIsSending(true);

    const response = await fetch(
      "http://localhost:8000/api/auth/send-verification-code",
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
    router.push(
      `/authentication/verifyPassword?email=${encodeURIComponent(email)}`
    );
  } catch (err: unknown) {
    console.error("Error sending reset verification:", err);
    const errorMessage = err && typeof err === "object" && "message" in err && typeof err.message === "string" 
      ? err.message 
      : "Something went wrong. Please try again.";
    setEmailError(errorMessage);
  } finally {
    setIsSending(false);
  }
};




  return (
    <LogoBox logoSrc="/images/MM_logo_V1.webp" logoAlt="MeteorMate Logo">
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
              disabled={isSending}
              className="pl-11 pr-10 border border-black py-3 rounded-3xl font-light text-[12px] md:text-[15px] text-left w-full disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          {emailError && (
            <p className="text-red-500 text-xs mt-1">{emailError}</p>
          )}
        </div>

        {/* verify button */}
        <button
          onClick={handleResetPassword}
          disabled={isSending || !!emailError || !email}
          className="mt-4 mb-4 bg-[#509275] text-white py-2 rounded-3xl hover:bg-gray-800 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSending && <LoadingSpinner size="sm" />}
          {isSending ? "Sending..." : "Reset Password"}
        </button>
      </div>
    </LogoBox>
  );
}
