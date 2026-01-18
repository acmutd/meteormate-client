"use server";

import { adminAuth } from "@/lib/firebaseAdmin";
import {
  checkLoginLimit,
  checkSignupLimit,
  checkPasswordResetLimit,
} from "@/utils/rateLimit";

function getClientIp(headers: any): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return headers.get("x-real-ip") || "unknown";
}

export async function loginAction(
  email: string,
  password: string,
  headers: any
) {
  const clientIp = getClientIp(headers);
  const identifier = `${clientIp}:${email}`;

  const allowed = await checkLoginLimit(identifier);
  if (!allowed) {
    return {
      success: false,
      error: "Too many login attempts. Please try again in 10 minutes.",
    };
  }

  try {
    const customToken = await adminAuth.createCustomToken(email);
    return { success: true, token: customToken };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Authentication failed",
    };
  }
}

export async function signupAction(
  email: string,
  password: string,
  headers: any
) {
  const clientIp = getClientIp(headers);
  const allowed = await checkSignupLimit(clientIp);

  if (!allowed) {
    return {
      success: false,
      error: "Too many signup attempts from this IP. Please try again in 1 hour.",
    };
  }

  try {
    const userRecord = await adminAuth.createUser({
      email,
      password,
    });
    const customToken = await adminAuth.createCustomToken(userRecord.uid);
    return { success: true, token: customToken, uid: userRecord.uid };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Signup failed",
    };
  }
}

export async function resetPasswordAction(
  email: string,
  headers: any
) {
  const clientIp = getClientIp(headers);
  const identifier = `${clientIp}:${email}`;

  const allowed = await checkPasswordResetLimit(identifier);
  if (!allowed) {
    return {
      success: false,
      error: "Too many password reset attempts. Please try again in 1 hour.",
    };
  }

  try {
    await adminAuth.sendPasswordResetEmail(email);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Password reset request failed",
    };
  }
}
