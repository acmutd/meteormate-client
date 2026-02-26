import { apiFetch } from "@/utils/api/client";
import { Result, UserActivityPing, UserRegisterResponse } from "../types";

// send verification code defaults to verify for new accounts, reset for password reset
export interface SendVerificationCodeOptions {
    email: string;
    uid?: string;
    purpose?: "verify" | "reset";
}

// register
export async function RegisterUser(email: string, password: string, utd_id: string): Promise<Result<UserRegisterResponse>> {
    return apiFetch<UserRegisterResponse>("/api/auth/register", {
        method: "POST",
        body: { email, password, utd_id },
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
    options: SendVerificationCodeOptions
): Promise<Result<{ message: string }>> {
    const { email, uid, purpose = "verify" } = options;
    return apiFetch<{ message: string }>("/api/auth/send-verification-code", {
        method: "POST",
        body: { email, uid, purpose },
        isPublic: true,
    });
}
