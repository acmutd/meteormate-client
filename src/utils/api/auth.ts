import { apiFetch } from "@/utils/api/client";
import { Result, UserActivityPing, UserRegisterResponse } from "../types";
import { UserProfile } from "@/types/userProfile";
import {
    readCachedCurrentUser,
    writeCachedCurrentUser,
} from "@/utils/currentUserCache";
import {
    RegisterUserBody,
    VerifyEmailBody,
} from "@/types/auth";

export interface FetchCurrentUserOptions {
    preferCache?: boolean;
    forceRefresh?: boolean;
    maxAgeMs?: number;
}

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

// send reset password code (no auth required — email passed directly)
export async function SendResetPasswordCode(email: string): Promise<Result<{ message: string }>> {
    return apiFetch<{ message: string }>(
        `/api/verification/reset_password/${encodeURIComponent(email)}`,
        { method: "GET", isPublic: true },
    );
}

// reset password with code
export async function ResetPassword(
    email: string,
    code: string,
    new_password: string,
): Promise<Result<{ message: string }>> {
    const body = { email, code, new_password };
    return apiFetch<{ message: string }>("/api/verification/reset_password", {
        method: "POST",
        body,
        isPublic: true,
    });
}

// get current user from /api/auth/me or localstorage cache
export async function fetchCurrentUser(
    options: FetchCurrentUserOptions = {},
): Promise<Result<UserProfile>> {
    const {
        preferCache = false,
        forceRefresh = false,
        maxAgeMs,
    } = options;

    if (preferCache && !forceRefresh) {
        const cachedUser = readCachedCurrentUser(maxAgeMs);
        if (cachedUser) {
            return { ok: true, data: cachedUser };
        }
    }

    const result = await apiFetch<UserProfile>("/api/auth/me", { method: "GET" });
    if (result.ok) {
        writeCachedCurrentUser(result.data);
    }

    return result;
}

// mark user as inactive
export async function markInactive(): Promise<Result<{ message: string }>> {
    return apiFetch<{ message: string }>("/api/auth/mark-inactive", { method: "POST" });
}