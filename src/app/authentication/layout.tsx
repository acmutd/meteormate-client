import React from "react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            className="min-h-screen w-screen flex items-center justify-center relative overflow-hidden bg-black text-white">
            {/* Stars background */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
                style={{
                    backgroundImage: "url('/stars.webp')",
                }}
            />

            <div className="absolute inset-0"/>

            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle at 20% 20%, rgba(249,115,22,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(251,146,60,0.06) 0%, transparent 50%)",
                }}
            />

            {/* Content */}
            <div className="relative z-10 w-full flex items-center justify-center">
                {children}
            </div>
        </div>
    );
}
