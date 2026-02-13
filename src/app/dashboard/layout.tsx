// the main layout.tsx page which will have the wrapper - navbar and the side bar
"use client";

import Navbar from "@/components/navigation/navBar";
import Sidebar from "@/components/navigation/sideBar";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !userLoggedIn) {
      router.push("/authentication?toast=not-signed-in");
    }
  }, [loading, userLoggedIn, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!userLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Sidebar + Page Content */}
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
