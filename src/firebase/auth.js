import {auth} from "./firebase";

import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updatePassword } from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
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

export const doPasswordChange = (email) => {
    return updatePassword(auth.currentUser, password);
};

// the following is for email verification - to verify the user is a utd student I guess
export const doSendEmailVerification = (email) => {
    const user = auth.currentUser;

    const verificationUrl = `${window.location.origin}/verifyEmail`; // or any redirect URL

    return sendEmailVerification(user, { url: verificationUrl })
        .then(() => {
            console.log("Verification email sent!");
        })
        .catch((error) => {
            console.error("Error sending verification email:", error);
            throw error;
        });
};

