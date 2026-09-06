"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import MaintenanceView from "@/app/(system)/status/MaintenanceView";
import {
    MAINTENANCE_EVENT,
    maintenanceStorage,
    MaintenanceState,
    readMaintenanceState,
} from "./maintenanceState";

type Props = {
	children: React.ReactNode;
};

export default function MaintenanceGate({ children }: Props) {
    const pathname = usePathname();
    const bypassMaintenance = pathname?.startsWith("/maintenance");
    const [state, setState] = useState<MaintenanceState>(readMaintenanceState());

    useEffect(() => {
        const sync = () => setState(readMaintenanceState());
        const onStorage = (event: StorageEvent) => {
            if (event.key === maintenanceStorage.key) {
                sync();
            }
        };

        sync();
        window.addEventListener("storage", onStorage);
        window.addEventListener(MAINTENANCE_EVENT, sync);
        return () => {
            window.removeEventListener("storage", onStorage);
            window.removeEventListener(MAINTENANCE_EVENT, sync);
        };
    }, []);

    if (bypassMaintenance) {
        return <>{children}</>;
    }

    if (state.on) {
        return <MaintenanceView reason={state.reason} />;
    }

    return <>{children}</>;
}

