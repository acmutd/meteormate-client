"use client";
import React, { useRef, useState, useEffect } from "react";
import LogoBox from "../../../../components/LogoBox";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [code, setCode] = useState(Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  // Get current user's email
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setEmail(user?.email ?? null);
    });
    return () => unsubscribe();
  }, [auth]);

  // Focus first input on mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Handle input change
  const handleChange = (value: string, index: number) => {
    if (/^\d$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Focus next input
      if (index < 5 && inputsRef.current[index + 1]) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  // Handle backspace/delete
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    const newCode = [...code];

    if (e.key === "Backspace") {
      if (code[index]) {
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        newCode[index - 1] = "";
        setCode(newCode);
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "Delete") {
      newCode[index] = "";
      setCode(newCode);
    }
  };

  // Handle verify button click
  const handleVerifyEmail = async () => {
    const verificationCode = code.join("");
    if (verificationCode.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    const uid = auth.currentUser?.uid;
    if (!uid) {
      setError("User not logged in.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://YOUR_BACKEND_DOMAIN/verify-code", { // need to change here the domain otherwise it wont work
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, code: verificationCode }),
      });

      const result = await response.json();

      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Invalid or expired code.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LogoBox logoSrc="/images/MM_logo_V1.png" logoAlt="MeteorMate Logo">
      <div className="flex flex-col justify-center items-center text-center w-[400px]">
        <h1 className="font-urbanist font-semibold md:text-[35px] text-[20px]">
          Verify Email
        </h1>
        <p className="font-urbanist font-light md:text-[12px] text-[10px]">
          {email
            ? `We have sent a verification code to ${email}.`
            : "We have sent a verification code to your registered email."}
        </p>
        <p className="font-urbanist font-light md:text-[12px] text-[10px] pb-3">
          Please check your inbox and input the code below to activate your account.
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
              ref={(el) => {
				if (!inputsRef.current) inputsRef.current = [];
				inputsRef.current[index] = el;
				}}

              className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            />
          ))}
        </div>

        {/* verify button */}
        <button
          onClick={handleVerifyEmail}
          disabled={loading}
          className="mt-4 mb-4 bg-[#509275] text-white py-2 rounded-3xl hover:bg-gray-800 transition cursor-pointer w-[80%]"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        {error && (
          <p className="text-red-500 font-urbanist text-[12px]">{error}</p>
        )}
      </div>
    </LogoBox>
  );
}
