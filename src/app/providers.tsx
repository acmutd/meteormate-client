"use client";

import {AuthProvider} from "@/contexts/authContext";
import ScreenBlocker from "@/components/ScreenBlocker";
import {ToastProvider} from "@/components/ui/ToastProvider";

export default function Providers({children}: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ToastProvider>
                <div className="hidden md:block">{children}</div>
                <div className="block md:hidden">
                    <ScreenBlocker/>
                </div>
            </ToastProvider>
        </AuthProvider>
    );
}
