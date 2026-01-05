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
	// Note: Use generic messages for security-sensitive errors to avoid revealing account existence
	switch (code) {
		// Login errors - use generic message to prevent account enumeration
		case "auth/invalid-credential":
		case "auth/user-not-found":
		case "auth/wrong-password":
			return {
				code,
				message:
					"Invalid email or password. Please check your credentials and try again.",
			};
		
		case "auth/too-many-requests":
			return {
				code,
				message:
					"Too many attempts right now. Please wait a bit before trying again.",
			};
		
		case "auth/network-request-failed":
			return { code, message: "Network error. Check your connection and try again." };
		
		// Signup errors - use generic message to prevent account enumeration
		case "auth/email-already-in-use":
			return { 
				code, 
				message: "Unable to create account with this email. Please try a different email or log in if you already have an account." 
			};
		
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


