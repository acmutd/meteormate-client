"use client";

import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                const idToken = await firebaseUser.getIdToken();
                setToken(idToken);
            } else {
                setToken(null);
                router.push("/authentication?toast=not-signed-in");
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth, router]);

    const refreshToken = async () => {
        if (!user) return;

        const newToken = await user.getIdToken(true); // force refresh
        setToken(newToken);
    };

    if (loading) {
        return <div className="p-6">Loading…</div>;
    }

    if (!user) {
        return <div className="p-6">Not logged in</div>;
    }

    return (
        <div className="p-6 space-y-4 max-w-3xl">
            <h1 className="text-2xl font-semibold">Dashboard</h1>

            <div className="bg-gray-100 p-4 rounded">
                <div className="font-medium">User UUID (UID)</div>
                <div className="break-all text-sm">{user.uid}</div>
            </div>

            <div className="bg-gray-100 p-4 rounded">
                <div className="font-medium mb-2">Bearer Token (ID Token)</div>
                <div className="break-all text-xs whitespace-pre-wrap">
                    {token}
                </div>
            </div>

            <button
                onClick={refreshToken}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
                Refresh Bearer Token
            </button>
        </div>
    );
}
