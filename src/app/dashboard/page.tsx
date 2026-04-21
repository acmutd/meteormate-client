"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCurrentUser } from "@/utils/api/auth";
import { UserProfile } from "@/types/userProfile";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProfileCard from "@/components/cardComponent/ProfileCard";

export default function Discover() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
        try {
            const res = await fetchCurrentUser({ preferCache: true, maxAgeMs: 5 * 60 * 1000 });
            if (!res.ok) throw new Error(res.error || "Failed to fetch user");
            setUser(res.data);
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
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!user) return null;
    return (
        <div className="flex justify-center py-7">
            <ProfileCard
                name="Aastha Sheth"
                subtitle="Comp sci. major - senior"
                images={["/p2.png", "/p3.jpg","/p2.png"]}
                tags={[
                { label: "Does not have a lease", tone: "orange"},
                { label: "Year long lease", tone: "orange"},
                { label: "$1200 Rent range", tone: "orange"},
                { label: "Has a pet", tone: "gray" },
                ]}
                bio="Easygoing, clean, and respectful roommate. I value communication, shared spaces that stay organized, and a chill home vibe..."
                onDislike={() => console.log("dislike")}
                onRewind={() => console.log("rewind")}
                onLike={() => console.log("like")}
                back={{
                            interests: [
                                { label: "Music", selected: true },
                                { label: "Art", selected: true },
                                { label: "Lifting" },
                                { label: "Hiking" },
                                { label: "Video Games" },
                            ],
                            habits: [
                                { label: "Quiet", selected: true },
                                { label: "Tidy", selected: true },
                                { label: "Okay With Pets", selected: true },
                                { label: "Cooks Often" },
                                { label: "Early Bird" },
                            ],
                            expandedBio:
                                "Easygoing, clean, and respectful roommate. I value communication, shared spaces that stay organized, and a chill home vibe. To do for mm: nuke atharva. WOHOOOOOOOOOOOOOOOOOOOOOOOOo",
                        }}
            />
        </div>
    );
}
