"use client";
import React, { useState, useEffect } from "react";
import LogoBox from "../../../../components/LogoBox";
import { useRouter } from "next/navigation";

export default function NewPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Load email + code saved earlier
  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    const storedCode = localStorage.getItem("resetCode");

    if (storedEmail) setEmail(storedEmail);
    if (storedCode) setCode(storedCode);

    // Optional: if either is missing, kick them back to Forgot Password
    // if (!storedEmail || !storedCode) {
    //   router.push("/authentication/forgotPassword");
    // }
  }, [router]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // live update match error if confirm is already filled
    if (confirmPassword && e.target.value !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async () => {
    setErrorMsg("");

    if (!password || !confirmPassword) {
      setErrorMsg("Please fill out both password fields.");
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }
    if (!email || !code) {
      setErrorMsg(
        "Missing reset email or code. Please restart the reset process."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        "http://localhost:8000/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            code,
            new_password: password,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Failed to reset password.");
      }

      // Clear local storage
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetCode");

      // Redirect to login
      router.push("../authentication");
    } catch (err: unknown) {
      console.error("Reset password error:", err);
      const errorMessage = err && typeof err === "object" && "message" in err && typeof err.message === "string" 
        ? err.message 
        : "Something went wrong.";
      setErrorMsg(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LogoBox logoSrc="/images/MM_logo_V1.png" logoAlt="MeteorMate Logo">
      <div className="flex flex-col w-full max-w-2xl px-10">
        <h1 className="font-urbanist font-semibold md:text-[35px] text-[20px] p-2">
          Input New Password
        </h1>

        {/* password */}
        <div className="flex flex-col pb-3">
          <label className="block text-sm font-urbanist font-light text-gray-700 mb-2">
            Password
          </label>
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

        {/* verify password */}
        <div className="flex flex-col">
          <label className="block text-sm font-urbanist font-light text-gray-700 mb-2">
            Verify Password
          </label>
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
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Re-Enter Password"
              className="pl-11 pr-4 border border-black py-2 rounded-3xl font-light text-[12px] md:text-[15px] text-left w-full"
            />
          </div>
          {confirmPasswordError && (
            <p className="text-red-500 text-xs mt-1">
              {confirmPasswordError}
            </p>
          )}
        </div>

        {errorMsg && (
          <p className="text-red-500 text-xs mt-2">{errorMsg}</p>
        )}

        {/* submit button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="mt-4 mb-4 bg-[#509275] text-white py-2 rounded-3xl hover:bg-gray-800 transition cursor-pointer disabled:opacity-60"
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </div>
    </LogoBox>
  );
}
