import { apiFetch } from "@/utils/api/client";
import { Result, UserActivityPing, UserRegisterResponse } from "../types";
import { UserProfile } from "@/types/userProfile";
import {
    RegisterUserBody,
    SendVerificationCodeBody,
    VerifyEmailBody,
} from "@/types/auth";

// register
export async function RegisterUser(email: string, password: string, utd_id: string): Promise<Result<UserRegisterResponse>> {
    const body: RegisterUserBody = { email, password, utd_id };
    return apiFetch<UserRegisterResponse>("/api/auth/register", {
        method: "POST",
        body,
        isPublic: true,
    });
}

// activity ping
export async function ActivityPing(): Promise<Result<UserActivityPing>> {
    return apiFetch<UserActivityPing>("/api/auth/activity-ping", { method: "GET" });
}

// delete user
export async function DeleteUser(): Promise<Result<void>> {
    return apiFetch<void>("/api/auth/delete", { method: "DELETE" });
}

export async function SendVerificationCode(
    options: SendVerificationCodeBody
): Promise<Result<{ message: string }>> {
    const body: SendVerificationCodeBody = { ...options, purpose: options.purpose ?? "verify" };
    return apiFetch<{ message: string }>("/api/auth/send-verification-code", {
        method: "POST",
        body,
        isPublic: true,
    });
}

// verify email with code
export async function VerifyEmail(email: string, code: string): Promise<Result<{ message: string }>> {
    const body: VerifyEmailBody = { email, code };
    return apiFetch<{ message: string }>("/api/auth/verify-email", {
        method: "POST",
        body,
        isPublic: true,
    });
}

// get current user
export async function fetchCurrentUser(): Promise<Result<UserProfile>> {
    return apiFetch<UserProfile>("/api/auth/me", { method: "GET" });
}
