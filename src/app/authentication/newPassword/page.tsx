"use client";
import React, { useEffect, useRef, useState } from "react";
import LogoBox from "../../../../components/LogoBox";
import { useRouter } from "next/navigation";
import { validatePasswordMatch, validatePassword } from "@/utils/validation";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import PasswordInput from "../../../../components/forms/PasswordInput";
import { useToast } from "@/components/ui/ToastProvider";

export default function NewPasswordPage() {
  const router = useRouter();
	const { toast } = useToast();
	const passwordRef = useRef<HTMLInputElement | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
	const [passwordValidation, setPasswordValidation] = useState(() => validatePassword(""));

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

	useEffect(() => {
		passwordRef.current?.focus();
	}, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
		setPasswordValidation(validatePassword(value));
    // Live update match error if confirm password is already filled
    if (confirmPassword) {
      setConfirmPasswordError(validatePasswordMatch(value, confirmPassword));
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      setErrorMsg("Password does not meet requirements. Please ensure it has at least 8 characters, includes uppercase, lowercase, number, and special character.");
      return;
    }

    // Validate password match
    const passwordMatchError = validatePasswordMatch(password, confirmPassword);
    if (passwordMatchError) {
      setConfirmPasswordError(passwordMatchError);
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
			toast({ type: "success", title: "Password updated", description: "You can log in with your new password." });
      router.push("../authentication");
    } catch (err: unknown) {
      console.error("Reset password error:", err);
      const errorMessage = err && typeof err === "object" && "message" in err && typeof err.message === "string" 
        ? err.message 
        : "Something went wrong.";
      setErrorMsg(errorMessage);
			toast({ type: "error", title: "Couldn't update password", description: errorMessage });
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

  return (
    <LogoBox logoSrc="/images/MM_logo_V1.png" logoAlt="MeteorMate Logo">
      <div className="flex flex-col w-full max-w-2xl px-10">
        <h1 className="font-urbanist font-semibold md:text-[35px] text-[20px] p-2">
          Input New Password
        </h1>

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

        {errorMsg && (
          <p className="text-red-500 text-xs mt-2">{errorMsg}</p>
        )}

        {/* submit button */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-4 mb-4 bg-[#509275] text-white py-2 rounded-3xl hover:bg-gray-800 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting && <LoadingSpinner size="sm" />}
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
				</form>
      </div>
    </LogoBox>
  );
}
