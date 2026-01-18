export const authErrorMapping: Record<string, string> = {
	"auth/email-already-in-use": "An account with this email already exists.",
	"auth/invalid-email": "The email address is invalid.",
	"auth/operation-not-allowed": "This operation is not allowed.",
	"auth/weak-password": "The password is too weak.",
	"auth/user-disabled": "This account has been disabled.",
	"auth/user-not-found": "No account found with this email.",
	"auth/wrong-password": "Incorrect password.",
	"auth/too-many-requests": "Too many attempts. Please try again later.",
	"auth/network-request-failed": "Network error. Please check your connection.",
	"auth/invalid-credential": "Invalid email or password.",
};

export function getAuthErrorMessage(errorCode: string): string {
	return authErrorMapping[errorCode] || "An authentication error occurred.";
}
