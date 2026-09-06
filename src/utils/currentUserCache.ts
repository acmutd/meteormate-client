import type { UserProfile } from "@/types/userProfile";
import type { ProfileResponse } from "@/types/profile";

const CURRENT_USER_CACHE_KEY = "meteormate_current_user";
export const CURRENT_USER_CACHE_UPDATED_EVENT = "meteormate:current-user-cache-updated";

interface CurrentUserCacheEnvelope {
    data: UserProfile;
    cachedAt: number;
}

function isBrowser() {
    return typeof window !== "undefined";
}

export function readCachedCurrentUser(maxAgeMs?: number): UserProfile | null {
    if (!isBrowser()) return null;

    try {
        const raw = localStorage.getItem(CURRENT_USER_CACHE_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw) as CurrentUserCacheEnvelope;
        if (!parsed || typeof parsed !== "object") return null;
        if (!parsed.data || typeof parsed.cachedAt !== "number") return null;

        if (typeof maxAgeMs === "number" && maxAgeMs >= 0) {
            const ageMs = Date.now() - parsed.cachedAt;
            if (ageMs > maxAgeMs) return null;
        }

        return parsed.data;
    } catch {
        return null;
    }
}

export function writeCachedCurrentUser(user: UserProfile) {
    if (!isBrowser()) return;
    const payload: CurrentUserCacheEnvelope = {
        data: user,
        cachedAt: Date.now(),
    };

    localStorage.setItem(CURRENT_USER_CACHE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new Event(CURRENT_USER_CACHE_UPDATED_EVENT));
}

export function updateCachedCurrentUserProfile(profile: ProfileResponse) {
    const currentUser = readCachedCurrentUser();
    if (!currentUser) return;

    writeCachedCurrentUser({
        ...currentUser,
        profile,
        profile_created: true,
    });
}

export function clearCachedCurrentUser() {
    if (!isBrowser()) return;
    localStorage.removeItem(CURRENT_USER_CACHE_KEY);
    window.dispatchEvent(new Event(CURRENT_USER_CACHE_UPDATED_EVENT));
}
