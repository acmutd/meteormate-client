// the main layout.tsx page which will have the wrapper - navbar and the side bar
"use client";

import Navbar from "@/components/navigation/navBar";
import Sidebar from "@/components/navigation/sideBar";
import { useAuth } from "@/contexts/authContext";
import { useOnboardingRouting } from "@/hooks/useOnboardingRouting";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AppLayout({
    children,
}: {
  children: React.ReactNode;
}) {
    const { userLoggedIn, loading } = useAuth();
    const { requiredRoute, isLoading, isReady } = useOnboardingRouting();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentFullPath = useMemo(() => {
        const params = searchParams?.toString();
        return pathname + (params ? `?${params}` : "");
    }, [pathname, searchParams]);

    useEffect(() => {
        if (!loading && !userLoggedIn) {
            router.replace("/authentication?toast=not-signed-in");
        } else if (!loading && userLoggedIn && isReady && requiredRoute && requiredRoute !== currentFullPath) {
            router.replace(requiredRoute);
        }
    }, [loading, userLoggedIn, isReady, requiredRoute, router, currentFullPath]);

    if (loading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!userLoggedIn) {
        return null;
    }

    if (requiredRoute && requiredRoute !== currentFullPath) {
        return null;
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Top Navbar */}
            <Navbar />

            {/* Sidebar + Page Content */}
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="flex-1 p-6 overflow-y-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
