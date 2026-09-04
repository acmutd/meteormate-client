import { apiFetch } from "@/utils/api/client";
import { Result } from "@/utils/types";
import {
    readCachedProfile,
    writeCachedProfile,
} from "@/utils/profileCache";
import {
    ProfileCreateBody,
    ProfileUpdateBody,
    ProfileResponse,
    ProfileUpdateNotificationsBody,
} from "@/types/profile";

export interface FetchProfileOptions {
    preferCache?: boolean;
    forceRefresh?: boolean;
    maxAgeMs?: number;
}

function updateProfileCache(result: Result<ProfileResponse>) {
    if (result.ok) {
        writeCachedProfile(result.data);
    }
}

// Creates a new user profile (requires all required fields)
export async function createProfile(body: ProfileCreateBody): Promise<Result<ProfileResponse>> {
    const result = await apiFetch<ProfileResponse>("/api/profiles/create", {
        method: "POST",
        body,
    });
    updateProfileCache(result);
    return result;
}

// Updates an existing user profile (all fields optional)
export async function updateProfile(body: ProfileUpdateBody): Promise<Result<ProfileResponse>> {
    const result = await apiFetch<ProfileResponse>("/api/profiles/update", {
        method: "PUT",
        body,
    });
    updateProfileCache(result);
    return result;
}

// Gets a user profile by UID with optional local storage caching
export async function fetchProfile(
    uid: string,
    options: FetchProfileOptions = {},
): Promise<Result<ProfileResponse>> {
    const {
        preferCache = false,
        forceRefresh = false,
        maxAgeMs,
    } = options;

    if (preferCache && !forceRefresh) {
        const cachedProfile = readCachedProfile(uid, maxAgeMs);
        if (cachedProfile) {
            return { ok: true, data: cachedProfile };
        }
    }

    const result = await apiFetch<ProfileResponse>(`/api/profiles/get/${uid}`, {
        method: "GET",
        isPublic: true,
    });

    updateProfileCache(result);
    return result;
}

// Gets a user profile by UID (public endpoint)
export async function getProfile(uid: string): Promise<Result<ProfileResponse>> {
    return fetchProfile(uid);
}

// Updates match_notification and/or promotional_notification preferences
export async function updateNotifications(
    body: ProfileUpdateNotificationsBody
): Promise<Result<ProfileResponse>> {
    const result = await apiFetch<ProfileResponse>("/api/profiles/update_notifications", {
        method: "POST",
        body,
    });
    updateProfileCache(result);
    return result;
}
