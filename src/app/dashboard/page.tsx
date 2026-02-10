"use client";
import React, { useEffect, useState } from "react";
import { getCurrentUserIdToken } from "@/firebase/auth";
import { useRouter } from "next/navigation";
import { fetchCurrentUser } from "@/api/auth";
import { UserProfile } from "@/types/userProfile";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Dashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getCurrentUserIdToken();
        const data = await fetchCurrentUser(token);
        setUser(data);
      } catch (err) {
        console.error("Dashboard auth error:", err);
        router.push("/authentication?toast=not-signed-in");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <div className="grid gap-6">
          <div className="bg-zinc-900 p-6 rounded-lg border border-white/10">
            <h2 className="text-2xl mb-4">
              Welcome, {user.profile?.first_name || "User"}
            </h2>
            <p className="text-zinc-400">Your dashboard is being built.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
