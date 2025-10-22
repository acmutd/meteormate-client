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
