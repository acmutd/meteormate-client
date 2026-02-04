"use client";
import Image from "next/image";

export default function ProfileAvatar() {
    return (
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-300 cursor-pointer hover:ring-2 hover:ring-orange-400 transition">
            <Image
                src="/profile-pic-PH.png" // put this in /public
                alt="User profile placeholder"
                fill
                className="object-cover"
            />
        </div>
    );
}
