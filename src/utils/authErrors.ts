type FirebaseishError = {
	code?: string;
	message?: string;
};

export function getAuthErrorMessage(err: unknown): { message: string; code?: string } {
	const fallback = { message: "Something went wrong. Please try again.", code: undefined as string | undefined };
	if (!err || typeof err !== "object") return fallback;

	const e = err as FirebaseishError;
	const code = typeof e.code === "string" ? e.code : undefined;
	const rawMessage = typeof e.message === "string" ? e.message : undefined;

	if (!code) {
		return { message: rawMessage || fallback.message, code };
	}

	// Firebase Auth codes (common)
	switch (code) {
		case "auth/invalid-credential":
			return {
				code,
				message:
					"That email/password combination doesn’t match. Double-check your credentials and try again.",
			};
		case "auth/user-not-found":
			return { code, message: "No account was found for that email. Try creating an account instead." };
		case "auth/wrong-password":
			return { code, message: "Incorrect password. Try again or use “Forgot password?” to reset it." };
		case "auth/too-many-requests":
			return {
				code,
				message:
					"Too many attempts right now. Please wait a bit before trying again, or reset your password.",
			};
		case "auth/network-request-failed":
			return { code, message: "Network error. Check your connection and try again." };
		case "auth/email-already-in-use":
			return { code, message: "An account with this email already exists. Try logging in instead." };
		case "auth/weak-password":
			return {
				code,
				message:
					"Password is too weak. Use at least 8 characters with uppercase, lowercase, a number, and a special character.",
			};
		case "auth/invalid-email":
			return { code, message: "That email address looks invalid. Please check and try again." };
		default:
			return { code, message: rawMessage || "Authentication failed. Please try again." };
	}
}


