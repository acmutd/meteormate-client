type RateLimitAction = "login" | "signup";

type StoredState = {
	attempts: number[];
	blockedUntil?: number;
};

export type RateLimitCheck = {
	allowed: boolean;
	remainingAttempts: number;
	retryAfterMs?: number;
	blockedUntil?: number;
};

const SETTINGS: Record<RateLimitAction, { maxAttempts: number; windowMs: number; blockDurationMs: number; minIntervalMs: number }> =
	{
	    login: {
	        maxAttempts: 10,
	        windowMs: 15 * 60 * 1000, // 15 minutes
	        blockDurationMs: 15 * 60 * 1000,
	        minIntervalMs: 1500,
	    },
	    signup: {
	        maxAttempts: 8,
	        windowMs: 20 * 60 * 1000, // 20 minutes
	        blockDurationMs: 20 * 60 * 1000,
	        minIntervalMs: 2000,
	    },
	};

const KEY_PREFIX = "meteormate:rl:";
const isBrowser = () => typeof window !== "undefined";

const emptyState = (): StoredState => ({ attempts: [], blockedUntil: 0 });

const readState = (action: RateLimitAction): StoredState => {
    if (!isBrowser()) return emptyState();
    try {
        const raw = window.localStorage.getItem(KEY_PREFIX + action);
        if (!raw) return emptyState();
        const parsed = JSON.parse(raw) as StoredState;
        return { attempts: parsed.attempts || [], blockedUntil: parsed.blockedUntil || 0 };
    } catch (error) {
        console.error("Failed to read rate-limit state", error);
        return emptyState();
    }
};

const writeState = (action: RateLimitAction, state: StoredState) => {
    if (!isBrowser()) return;
    window.localStorage.setItem(KEY_PREFIX + action, JSON.stringify(state));
};

const pruneAttempts = (attempts: number[], windowMs: number) => {
    const now = Date.now();
    return attempts.filter((ts) => now - ts <= windowMs);
};

export const checkRateLimit = (action: RateLimitAction): RateLimitCheck => {
    const config = SETTINGS[action];
    const now = Date.now();
    const state = readState(action);
    const attempts = pruneAttempts(state.attempts, config.windowMs);

    if (state.blockedUntil && state.blockedUntil > now) {
        return {
            allowed: false,
            remainingAttempts: 0,
            retryAfterMs: state.blockedUntil - now,
            blockedUntil: state.blockedUntil,
        };
    }

    const lastAttempt = attempts[attempts.length - 1];
    if (lastAttempt && now - lastAttempt < config.minIntervalMs) {
        return {
            allowed: false,
            remainingAttempts: Math.max(config.maxAttempts - attempts.length, 0),
            retryAfterMs: config.minIntervalMs - (now - lastAttempt),
        };
    }

    return {
        allowed: true,
        remainingAttempts: Math.max(config.maxAttempts - attempts.length, 0),
    };
};

export const recordFailure = (action: RateLimitAction) => {
    const config = SETTINGS[action];
    const now = Date.now();
    const state = readState(action);
    const attempts = pruneAttempts([...state.attempts, now], config.windowMs);

    let blockedUntil = state.blockedUntil || 0;
    if (attempts.length >= config.maxAttempts) {
        blockedUntil = now + config.blockDurationMs;
    }

    const nextState: StoredState = { attempts, blockedUntil };
    writeState(action, nextState);
    return nextState;
};

export const recordSuccess = (action: RateLimitAction) => {
    const state: StoredState = { attempts: [], blockedUntil: 0 };
    writeState(action, state);
    return state;
};

export const formatRateLimitMessage = (action: RateLimitAction, check: RateLimitCheck) => {
    const actionLabel = action === "login" ? "log in" : "sign up";

    if (check.blockedUntil) {
        const minutes = Math.ceil((check.blockedUntil - Date.now()) / 60000);
        return `We paused ${actionLabel} attempts for ${minutes} minute${minutes === 1 ? "" : "s"} to protect your account. Please wait, reset your password, or contact a developer on Discord if this seems wrong.`;
    }

    if (check.retryAfterMs) {
        const seconds = Math.max(1, Math.ceil(check.retryAfterMs / 1000));
        return `You're trying to ${actionLabel} too quickly. Try again in ${seconds} second${seconds === 1 ? "" : "s"}.`;
    }

    if (!check.allowed) {
        return `Too many attempts right now. Please wait a bit before trying to ${actionLabel} again.`;
    }

    return "";
};

