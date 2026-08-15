const STORAGE_KEY = "meteormate:maintenance-state";
export const MAINTENANCE_EVENT = "meteormate:maintenance-change";

export type MaintenanceState = {
	on: boolean;
	reason?: string;
	updatedAt?: number;
	source?: "env" | "local";
};

const ENV_ON = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";
const ENV_REASON = process.env.NEXT_PUBLIC_MAINTENANCE_REASON;

const isBrowser = () => typeof window !== "undefined";

const fromEnv = (): MaintenanceState => ({
    on: ENV_ON,
    reason: ENV_REASON,
    updatedAt: ENV_ON ? Date.now() : undefined,
    source: "env",
});

export function readMaintenanceState(): MaintenanceState {
    const fallback = fromEnv();

    if (!isBrowser()) {
        return fallback;
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return fallback;
    }

    try {
        const parsed = JSON.parse(raw) as MaintenanceState;
        const nextState: MaintenanceState = {
            on: Boolean(parsed.on) || fallback.on,
            reason: parsed.reason || fallback.reason,
            updatedAt: parsed.updatedAt || Date.now(),
            source: parsed.source ?? "local",
        };

        return nextState;
    } catch (error) {
        console.error("Unable to read maintenance state from storage", error);
        return fallback;
    }
}

const notify = () => {
    if (!isBrowser()) return;
    window.dispatchEvent(new Event(MAINTENANCE_EVENT));
};

export function writeMaintenanceState(next: MaintenanceState): MaintenanceState {
    if (!isBrowser()) {
        return next;
    }

    const payload: MaintenanceState = {
        on: Boolean(next.on),
        reason: next.reason,
        updatedAt: next.updatedAt ?? Date.now(),
        source: "local",
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    notify();
    return payload;
}

export function clearMaintenanceState() {
    if (!isBrowser()) return;
    window.localStorage.removeItem(STORAGE_KEY);
    notify();
}

export const maintenanceStorage = {
    key: STORAGE_KEY,
    read: readMaintenanceState,
    write: writeMaintenanceState,
    clear: clearMaintenanceState,
    event: MAINTENANCE_EVENT,
};

