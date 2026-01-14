import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updatePassword
} from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user; // return only the user object
};

export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignOut = () => {
  return auth.signOut();
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (newPassword) => {
  if (!auth.currentUser) {
    return Promise.reject(new Error("No authenticated user found."));
  }
  return updatePassword(auth.currentUser, newPassword);
};

export const doSendEmailVerification = async (email, uid) => {
    try {
        // todo - change this to actual host when deploying
        const response = await fetch('http://localhost:8000/api/auth/send-verification-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                uid: uid
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send verification code');
        }

        console.log("Verification code sent successfully!");
        return response.json();
    } catch (error) {
        console.error("Error sending verification code:", error);
        throw error;
    }
};

export const getCurrentUserIdToken = async () => {
  if (!auth.currentUser) {
    throw new Error("No authenticated user found");
  }
  return await auth.currentUser.getIdToken();
}
