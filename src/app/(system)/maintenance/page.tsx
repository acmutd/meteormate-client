"use client";

import { useEffect, useMemo, useState } from "react";
import StatusLayout from "../status/StatusLayout";
import MaintenanceView from "../status/MaintenanceView";
import {
    clearMaintenanceState,
    maintenanceStorage,
    readMaintenanceState,
    writeMaintenanceState,
} from "@/components/system/maintenanceState";

const DEFAULT_REASON = "Brief downtime while we polish the matchmaking systems.";
const DEV_KEY = process.env.NEXT_PUBLIC_MAINTENANCE_KEY;
const IS_DEV_BUILD = process.env.NODE_ENV !== "production";

export default function MaintenanceSwitchPage() {
    const [authorized, setAuthorized] = useState<boolean>(IS_DEV_BUILD && !DEV_KEY);
    const [token, setToken] = useState("");
    const [state, setState] = useState(readMaintenanceState());
    const [reason, setReason] = useState(state.reason || DEFAULT_REASON);

    useEffect(() => {
        const sync = () => setState(readMaintenanceState());
        sync();
        window.addEventListener(maintenanceStorage.event, sync);
        const onStorage = (event: StorageEvent) => {
            if (event.key === maintenanceStorage.key) {
                sync();
            }
        };
        window.addEventListener("storage", onStorage);
        return () => {
            window.removeEventListener(maintenanceStorage.event, sync);
            window.removeEventListener("storage", onStorage);
        };
    }, []);

    useEffect(() => {
        if (!DEV_KEY && IS_DEV_BUILD) {
            setAuthorized(true);
            return;
        }

        if (DEV_KEY) {
            const cached = typeof window !== "undefined" ? window.sessionStorage.getItem("mm-maint-auth") : null;
            if (cached === DEV_KEY) {
                setAuthorized(true);
            }
        }
    }, []);

    const accessMessage = useMemo(() => {
        if (authorized) return "";
        if (!DEV_KEY) {
            return IS_DEV_BUILD
                ? "This switch is available in development without a key."
                : "Set NEXT_PUBLIC_MAINTENANCE_KEY to enable this control in production.";
        }
        return "Enter the developer access key to toggle maintenance mode.";
    }, [authorized]);

    const enableMaintenance = () => {
        const next = writeMaintenanceState({ on: true, reason, source: "local" });
        setState(next);
    };

    const disableMaintenance = () => {
        clearMaintenanceState();
        const next = readMaintenanceState();
        setState(next);
    };

    const handleAuthorize = () => {
        if (token && token === DEV_KEY) {
            setAuthorized(true);
            window.sessionStorage.setItem("mm-maint-auth", token);
        }
    };

    const lastUpdated = state.updatedAt ? new Date(state.updatedAt).toLocaleString() : "Not set";

    const isEnvForced = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

    if (!authorized && isEnvForced && state.on) {
        return <MaintenanceView reason={state.reason} />;
    }

    return (
        <StatusLayout
            eyebrow="Developer Tool"
            title="Maintenance / Downtime switch"
            description="Toggle the global maintenance screen in one click. This control is meant for developers only."
            accent="amber"
            actions={
                authorized ? (
                    <>
                        <button
                            type="button"
                            onClick={enableMaintenance}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 px-5 py-3 font-semibold text-black shadow-lg transition hover:from-orange-500 hover:to-yellow-400"
                        >
							Enable maintenance now
                        </button>
                        <button
                            type="button"
                            onClick={disableMaintenance}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
                        >
							Disable maintenance
                        </button>
                    </>
                ) : null
            }
        >
            <div className="mx-auto flex max-w-3xl flex-col gap-5 text-left text-white/80">
                <div className="grid gap-4 rounded-2xl border border-white/10 bg-black/50 p-4 md:grid-cols-2">
                    <div>
                        <p className="text-sm text-white/60">Current status</p>
                        <p className="text-xl font-semibold text-white">
                            {state.on ? "Maintenance is ACTIVE" : "Maintenance is OFF"}
                        </p>
                        <p className="text-xs text-white/50">Updated: {lastUpdated}</p>
                        {state.reason ? (
                            <p className="mt-1 text-sm text-white/70">Message: {state.reason}</p>
                        ) : null}
                        {isEnvForced ? (
                            <p className="mt-2 text-xs text-amber-300/80">
								NEXT_PUBLIC_MAINTENANCE_MODE is forcing maintenance on this build.
                            </p>
                        ) : null}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm text-white/70">User-facing message</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full rounded-2xl border border-white/15 bg-white/5 p-3 text-sm text-white outline-none focus:border-orange-400"
                            rows={3}
                            placeholder="Explain why the app is temporarily paused..."
                        />
                        <p className="text-xs text-white/50">
							This text appears on the maintenance screen and helps users know what to do next.
                        </p>
                    </div>
                </div>

                {authorized ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                        <ul className="list-disc list-inside space-y-1">
                            <li>
								Use the orange button above to trigger maintenance with a single click. All visitors
								will see the downtime page instantly.
                            </li>
                            <li>
								If you need to enforce maintenance at deploy time, set{" "}
                                <code className="rounded bg-black/40 px-2 py-1 text-xs">NEXT_PUBLIC_MAINTENANCE_MODE=true</code>.
                            </li>
                            <li>Share the Discord link with users if this is unexpected for them.</li>
                        </ul>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 space-y-3">
                        <p>{accessMessage}</p>
                        {DEV_KEY ? (
                            <div className="flex flex-col gap-2 md:flex-row md:items-center">
                                <input
                                    type="password"
                                    placeholder="Developer access key"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    className="flex-1 rounded-2xl border border-white/15 bg-black/40 px-3 py-2 text-white outline-none focus:border-orange-400"
                                />
                                <button
                                    type="button"
                                    onClick={handleAuthorize}
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 px-4 py-2 font-semibold text-black shadow-lg transition hover:from-orange-500 hover:to-yellow-400"
                                >
									Unlock
                                </button>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </StatusLayout>
    );
}
