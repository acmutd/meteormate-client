"use client";

import {AuthProvider} from "@/contexts/authContext";
import {OnboardingProvider} from "@/contexts/onboardingContext";
import ScreenBlocker from "@/components/ScreenBlocker";
import {ToastProvider} from "@/components/ui/ToastProvider";

export default function Providers({children}: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <OnboardingProvider>
                <ToastProvider>
                    <div className="hidden md:block">{children}</div>
                    <div className="block md:hidden">
                        <ScreenBlocker/>
                    </div>
                </ToastProvider>
            </OnboardingProvider>
        </AuthProvider>
    );
}
