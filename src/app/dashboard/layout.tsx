// the main layout.tsx page which will have the wrapper - navbar and the side bar
"use client";

import Navbar from "@/components/navigation/navBar";
import Sidebar from "@/components/navigation/sideBar";
import { useAuth } from "@/contexts/authContext";
import { useOnboardingRouting } from "@/hooks/useOnboardingRouting";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userLoggedIn, loading } = useAuth();
  const { requiredRoute, isLoading, isReady } = useOnboardingRouting();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !userLoggedIn) {
      router.replace("/authentication?toast=not-signed-in");
    } else if (!loading && userLoggedIn && isReady && requiredRoute) {
      router.replace(requiredRoute);
    }
  }, [loading, userLoggedIn, isReady, requiredRoute, router]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!userLoggedIn || requiredRoute) {
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
