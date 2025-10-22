import { auth } from "./firebase";
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  sendPasswordResetEmail, 
  signInWithEmailAndPassword, 
  updatePassword 
} from "firebase/auth";

// ✅ Create a new user
export const doCreateUserWithEmailAndPassword = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user; // return only the user object
};

// ✅ Sign in existing user
export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// ✅ Sign out current user
export const doSignOut = () => {
  return auth.signOut();
};

// ✅ Send password reset email
export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

// ❌ FIXED: updatePassword requires the *new password*, not the email
export const doPasswordChange = (newPassword) => {
  if (!auth.currentUser) {
    return Promise.reject(new Error("No authenticated user found."));
  }
  return updatePassword(auth.currentUser, newPassword);
};

// ✅ Send verification email
export const doSendEmailVerification = (user) => {
  if (!user) {
    return Promise.reject(new Error("User object is missing."));
  }

  // The redirect URL after the user clicks the verification link
  const verificationUrl = `${window.location.origin}/authentication/verifyEmail`;

  return sendEmailVerification(user, {
    url: verificationUrl,
    handleCodeInApp: true, // ✅ Recommended for Firebase email verification
  })
  .then(() => {
    console.log("Verification email sent successfully!");
  })
  .catch((error) => {
    console.error("Error sending verification email:", error);
    throw error;
  });
};
