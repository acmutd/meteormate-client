import { apiFetch } from "@/utils/api/client";
import { Result, UserActivityPing, UserRegisterResponse } from "../types";

// send verification code defaults to verify for new accounts, reset for password reset
export interface SendVerificationCodeOptions {
    email: string;
    uid?: string;
    purpose?: "verify" | "reset";
}

// register
export async function callRegisterRoute(email: string, password: string, utd_id: string): Promise<Result<UserRegisterResponse>> {
    return apiFetch<UserRegisterResponse>("/api/auth/register", {
        method: "POST",
        body: { email, password, utd_id },
        unauthenticated: true,
    });
}

// activity ping
export async function callActivityPing(): Promise<Result<UserActivityPing>> {
    return apiFetch<UserActivityPing>("/api/auth/activity-ping", { method: "GET" });
}

// delete user
export async function callDeleteUser(): Promise<Result<void>> {
    return apiFetch<void>("/api/auth/delete", { method: "DELETE" });
}

export async function callSendVerificationCode(
    options: SendVerificationCodeOptions
): Promise<Result<{ message: string }>> {
    const { email, uid, purpose = "verify" } = options;
    return apiFetch<{ message: string }>("/api/auth/send-verification-code", {
        method: "POST",
        body: { email, uid, purpose },
        unauthenticated: true,
    });
}
