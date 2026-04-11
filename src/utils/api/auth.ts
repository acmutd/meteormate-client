import { apiFetch } from "@/utils/api/client";
import { Result, UserActivityPing, UserRegisterResponse } from "../types";
import { UserProfile } from "@/types/userProfile";
import {
    RegisterUserBody,
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
): Promise<Result<{ message: string }>> {
    return apiFetch<{ message: string }>("/api/verification/account_verification", {
        method: "GET",
    });
}

// verify email with code
export async function VerifyEmail(email: string, code: string): Promise<Result<{ message: string }>> {
    const body: VerifyEmailBody = { email, code };
    return apiFetch<{ message: string }>("/api/verification/account_verification", {
        method: "POST",
        body,
    });
}

// get current user
export async function fetchCurrentUser(): Promise<Result<UserProfile>> {
    return apiFetch<UserProfile>("/api/auth/me", { method: "GET" });
}

// mark user as inactive
export async function markInactive(): Promise<Result<{ message: string }>> {
    return apiFetch<{ message: string }>("/api/auth/mark-inactive", { method: "POST" });
}