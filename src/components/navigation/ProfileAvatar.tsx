"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    CURRENT_USER_CACHE_UPDATED_EVENT,
    readCachedCurrentUser,
} from "@/utils/currentUserCache";

const DEFAULT_AVATAR = "/peechi_progress_2.svg";

export default function ProfileAvatar() {
    const router = useRouter();
    const [src, setSrc] = useState<string>(DEFAULT_AVATAR);

    useEffect(() => {
        const syncAvatarFromCache = () => {
            const cached = readCachedCurrentUser();
            const first = cached?.profile?.profile_picture_url?.[0];
            setSrc(first || DEFAULT_AVATAR);
        };

        syncAvatarFromCache();
        window.addEventListener(CURRENT_USER_CACHE_UPDATED_EVENT, syncAvatarFromCache);
        window.addEventListener("storage", syncAvatarFromCache);

        return () => {
            window.removeEventListener(CURRENT_USER_CACHE_UPDATED_EVENT, syncAvatarFromCache);
            window.removeEventListener("storage", syncAvatarFromCache);
        };
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
