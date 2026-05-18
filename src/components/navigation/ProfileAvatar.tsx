"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { readCachedCurrentUser } from "@/utils/currentUserCache";

export default function ProfileAvatar() {
    const router = useRouter();
    const [src, setSrc] = useState<string>("/peechi_progress_2.svg");

    useEffect(() => {
        try {
            const cached = readCachedCurrentUser();
            const first = cached?.profile?.profile_picture_url?.[0];
            if (first) setSrc(first);
        } catch (e) {
            // ignore and keep placeholder
            console.warn("ProfileAvatar: no cached profile image; using placeholder", e);
        }
    }, []);

    return (
        <button
            className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-300 cursor-pointer hover:ring-2 hover:ring-primary-hover transition"
            onClick={() => router.push("/dashboard/profile")}
        >
            <Image src={src} alt="User profile" fill className="object-cover" />
        </button>
    );
}
