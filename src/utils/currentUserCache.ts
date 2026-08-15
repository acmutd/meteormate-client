import { UserProfile } from "@/types/userProfile";

const CURRENT_USER_CACHE_KEY = "meteormate_current_user";

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
}

export function clearCachedCurrentUser() {
    if (!isBrowser()) return;
    localStorage.removeItem(CURRENT_USER_CACHE_KEY);
}
