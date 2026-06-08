"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { doSignOut } from "@/firebase/auth";

import {
    DiscoverIcon,
    MatchesIcon,
    MessagesIcon,
    SettingsIcon,
    ProfileIcon,
} from "@/components/icons/sidebar-icons";

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const items = [
        { label: "Discover", href: "/dashboard", icon: DiscoverIcon },
        { label: "Matches", href: "/dashboard/matches", icon: MatchesIcon },
        { label: "Notification", href: "/dashboard/notify", icon: MessagesIcon },
        { label: "Profile", href: "/dashboard/profile", icon: ProfileIcon },
    ];

    const isSettingsActive = pathname === "/dashboard/settings";

    const handleSignOut = async () => {
        await doSignOut();
        router.replace("/authentication");
    };

    const navItemClass = (active: boolean) =>
        `w-full flex items-center gap-3 px-5 py-2 rounded-md transition cursor-pointer ${
            active
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                : "text-gray-700 hover:bg-gray-50"
        }`;

    const iconClass = (active: boolean) =>
        `w-6 h-6 transition ${active ? "text-white" : "text-gray-800"}`;


    return (
        <aside className="w-70 border-r border-[#F1EADA] px-5 py-5 mx-1 mt-3 mb-3 flex flex-col">
            <nav className="space-y-2 flex-1">
                {items.map((item) => {
                    const isActive = item.href === "/dashboard/profile" 
                        ? pathname.startsWith(item.href)
                        : pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-5 py-2 rounded-md transition ${
                                isActive
                                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <Icon
                                className={`w-6 h-6 transition ${
                                    isActive ? "text-white" : "text-gray-800"
                                }`}
                            />

                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-4 border-t border-[#F1EADA] mb-2">

                <div className="rounded-md border-none bg-[#FFE5C2] px-10 py-2 mb-4 flex flex-col justify-center items-center">
                    <p className="text-[75%] text-center mb-1 text-gray-600"> Want to learn more about the other ACM products?</p>
                    {/* todo - make this button relatively positioned instead of absolute */}
                    <a href="https://acmutd.co/development"><button className="bg-linear-to-r from-primary to-secondary text-white px-12 py-1 rounded-md text-[65%] cursor-pointer items-center justify-center"> Learn More </button></a>
                </div>

                <button
                    onClick={() => router.push("/dashboard/settings")}
                    className={navItemClass(isSettingsActive)}
                >
                    <SettingsIcon className={iconClass(isSettingsActive)} />
                    <span>Settings</span>
                </button>

                <button
                    onClick={() => {
                        // todo: still need to make the logout thing working - aastha notes
                        void handleSignOut();
                    }}
                    className="w-full flex gap-2 px-4 py-2 rounded-md text-black hover:bg-gray-50 transition cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                    </svg>
                        Logout
                </button>
            </div>
        </aside>
    );
}
