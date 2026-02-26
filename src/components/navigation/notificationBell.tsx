"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    loadNotifications,
    saveNotifications,
    unreadCount as getUnreadCount,
    markAllReadLocal,
    markOneReadLocal,
    type LikeNotification,
} from "@/lib/notifications";


export default function NotificationBell() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<LikeNotification[]>([]); //TODO: connect with backend later - aastha
    const unread = getUnreadCount(items);

    const ref = useRef<HTMLDivElement | null>(null);

  // close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }   
    }   ;
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);
    useEffect(() => {
        const refresh = () => setItems(loadNotifications());

        refresh(); 

        window.addEventListener("storage", refresh);
        return () => window.removeEventListener("storage", refresh);
    }, []);

    useEffect(() => {
        if (open) setItems(loadNotifications());
    }, [open]);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((v) => !v)}
                className=" cursor-pointer relative p-2 rounded-full hover:bg-gray-100 transition"
                aria-label="Notifications"
            >
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-gray-800"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9a6 6 0 0 0-12 0v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
                </svg>

                {unread > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-orange-400 text-white text-[10px] flex items-center justify-center">
                    {unread > 9 ? "9+" : unread}
                </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-[#F1EADA] bg-white shadow-lg overflow-hidden">
                    <div className="px-4 py-3 flex items-center justify-between border-b border-[#F1EADA]">
                        <p className="font-semibold text-gray-900">Notifications</p>
                        <button
                            onClick={() => {
                                setItems((prev) => {
                                    const next = markAllReadLocal(prev);
                                    saveNotifications(next);
                                    return next;
                                });
                            }}
                            className="cursor-pointer text-xs text-gray-600 hover:text-gray-900"
                        >
                            Mark all read
                        </button>
                    </div>

                    <div className="max-h-72 overflow-auto">
                        {items.length === 0 ? (
                            <div className="px-4 py-6 text-center text-sm text-gray-500">
                            You’re all caught up 🎉
                            </div>
                        ) : (
                            items
                            .slice()
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .slice(0, 6)
                            .map((n) => (
                                <button
                                key={n.id}
                                onClick={() => {
                                    const next = markOneReadLocal(items, n.id);
                                    setItems(next);
                                    saveNotifications(next);
                                    setOpen(false);
                                    router.push("/dashboard/matches");
                                }}
                                className="cursor-pointer w-full text-left px-4 py-3 hover:bg-gray-50 transition"
                                >
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    <span className="font-semibold">{n.liker.name}</span> liked your profile
                                    {!n.isRead && (
                                    <span className="ml-2 inline-block h-2 w-2 rounded-full bg-orange-400 align-middle" />
                                    )}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {new Date(n.createdAt).toLocaleString()}
                                </p>
                                </button>
                            ))
                        )}
                    </div>


                    <div className="px-4 py-3 border-t border-[#F1EADA]">
                        <button
                            onClick={() => router.push("/dashboard/notify")}
                            className="w-full text-sm font-medium text-gray-800 hover:text-black"
                        >
                            View all notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
