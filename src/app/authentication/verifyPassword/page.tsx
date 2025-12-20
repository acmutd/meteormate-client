"use client";
import React, { useRef, useState } from "react";
import LogoBox from "../../../../components/LogoBox";
import { useRouter, useSearchParams } from "next/navigation";

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

  const handleChange = (value: string, index: number) => {
    // only accept single digit 0–9
    if (/^\d$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      setError("");

      if (index < 5 && inputsRef.current[index + 1]) {
        inputsRef.current[index + 1]?.focus();
      }
    } else if (value === "") {
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
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

      // 🔗 Hit your new backend endpoint
      const response = await fetch(
        "http://localhost:8000/api/auth/verify-reset-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            code: verificationCode,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Invalid or expired code.");
      }

      // store for the next page (so /reset-password can use it)
      localStorage.setItem("resetEmail", email);
      localStorage.setItem("resetCode", verificationCode);

      // ✅ only go to new password page *after* successful verification
      router.push("/authentication/newPassword");
    } catch (err: any) {
      console.error("Error verifying reset code:", err);
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <LogoBox logoSrc="/images/MM_logo_V1.webp" logoAlt="MeteorMate Logo">
      <div className="flex flex-col justify-center items-center text-center w-[400px]">
        <h1 className="font-urbanist font-semibold md:text-[35px] text-[20px]">
          Verify Password
        </h1>
        <p className="font-urbanist font-light md:text-[12px] text-[10px]">
          We have sent a verification code to {email || "your UTD email address"}.
        </p>
        <p className="font-urbanist font-light md:text-[12px] text-[10px]">
          Please check your inbox and input the code below to set a new
        </p>
        <p className="font-urbanist font-light md:text-[12px] text-[10px] pb-3">
          password for your account.
        </p>

        {/* code inputs */}
        <div className="flex space-x-3 justify-center">
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
              className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-xs mt-2 max-w-xs">{error}</p>
        )}

        {/* verify button */}
        <button
          onClick={handleVerifyPassword}
          disabled={isVerifying}
          className="mt-4 mb-4 bg-[#509275] text-white py-2 rounded-3xl hover:bg-gray-800 transition cursor-pointer w-[80%] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isVerifying ? "Verifying..." : "Verify Password"}
        </button>
      </div>
    </LogoBox>
  );
}
