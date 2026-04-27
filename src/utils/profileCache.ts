import { ProfileResponse } from "@/types/profile";

const PROFILE_CACHE_PREFIX = "meteormate_profile_";

interface ProfileCacheEnvelope {
    data: ProfileResponse;
    cachedAt: number;
}

function isBrowser() {
    return typeof window !== "undefined";
}

function getProfileCacheKey(uid: string) {
    return `${PROFILE_CACHE_PREFIX}${uid}`;
}

export function readCachedProfile(uid: string, maxAgeMs?: number): ProfileResponse | null {
    if (!isBrowser() || !uid) return null;

    try {
        const raw = localStorage.getItem(getProfileCacheKey(uid));
        if (!raw) return null;

        const parsed = JSON.parse(raw) as ProfileCacheEnvelope;
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

export function writeCachedProfile(profile: ProfileResponse) {
    if (!isBrowser() || !profile?.user_id) return;

    const payload: ProfileCacheEnvelope = {
        data: profile,
        cachedAt: Date.now(),
    };

    localStorage.setItem(getProfileCacheKey(profile.user_id), JSON.stringify(payload));
}

export function clearCachedProfile(uid: string) {
    if (!isBrowser() || !uid) return;
    localStorage.removeItem(getProfileCacheKey(uid));
}

export function clearAllCachedProfiles() {
    if (!isBrowser()) return;

    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (key && key.startsWith(PROFILE_CACHE_PREFIX)) {
            keysToRemove.push(key);
        }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
}
