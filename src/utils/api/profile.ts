import { apiFetch } from "@/utils/api/client";
import { Result } from "@/utils/types";
import {
    ProfileCreateBody,
    ProfileUpdateBody,
    ProfileResponse,
    ProfilePictureBody,
    ProfileUpdateNotificationsBody,
    UserDeleteProfilePicturesBody,
} from "@/types/profile";

// Creates a new user profile (requires all required fields)
export async function createProfile(body: ProfileCreateBody): Promise<Result<ProfileResponse>> {
    return apiFetch<ProfileResponse>("/api/profiles/create", { method: "POST", body });
}

// Updates an existing user profile (all fields optional)
export async function updateProfile(body: ProfileUpdateBody): Promise<Result<ProfileResponse>> {
    return apiFetch<ProfileResponse>("/api/profiles/update", { method: "PUT", body });
}

// Gets a user profile by UID (public endpoint)
export async function getProfile(uid: string): Promise<Result<ProfileResponse>> {
    return apiFetch<ProfileResponse>(`/api/profiles/get/${uid}`, { method: "GET", isPublic: true });
}

export async function deleteProfilePictures(body: UserDeleteProfilePicturesBody): Promise<Result<ProfileResponse>> {
    return apiFetch<ProfileResponse>("/api/profiles/delete_pictures", { method: "DELETE", body });
}

// Updates match_notification and/or promotional_notification preferences
export async function updateNotifications(
    body: ProfileUpdateNotificationsBody
): Promise<Result<ProfileResponse>> {
    return apiFetch<ProfileResponse>("/api/profiles/update_notifications", { method: "POST", body });
}
