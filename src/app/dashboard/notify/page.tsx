"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    loadNotifications,
    saveNotifications,
    unreadCount as getUnreadCount,
    markAllReadLocal,
    markOneReadLocal,
    type LikeNotification,
} from "@/lib/notifications";


function timeAgo(iso: string) {
    const now = Date.now();
    const then = new Date(iso).getTime();
    const diff = Math.max(0, now - then);

    const sec = Math.floor(diff / 1000);
    if (sec < 60) return `${sec}s`;

    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m`;

    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h`;

    const day = Math.floor(hr / 24);
    if (day < 7) return `${day}d`;

    const wk = Math.floor(day / 7);
    return `${wk}w`;
}

function groupLabel(iso: string) {
    const d = new Date(iso);
    const today = new Date();
    const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    ).getTime();
    const startOfThat = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

    const daysDiff = Math.floor((startOfToday - startOfThat) / (1000 * 60 * 60 * 24));
    if (daysDiff === 0) return "Today";
    if (daysDiff === 1) return "Yesterday";
    if (daysDiff < 7) return "This week";
    return "Earlier";
}

function Avatar({ name, avatarUrl }: { name: string; avatarUrl?: string | null }) {
    const initials = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("");

    return (
        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shrink-0">
            {avatarUrl ? (
                <img src={avatarUrl} alt={`${name} avatar`} className="h-full w-full object-cover" />
            ) : (
                <span className="text-sm font-semibold text-gray-700">{initials || "U"}</span>
            )}
        </div>
    );
}

// TODO: Replace with backend later
async function fetchLikeNotifications(): Promise<LikeNotification[]> {
    const now = Date.now();
    return [
        {
            id: "l1",
            createdAt: new Date(now - 3 * 60 * 1000).toISOString(),
            isRead: false,
            liker: { id: "u1", name: "Aanya", avatarUrl: null },
        },
        {
            id: "l2",
            createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
            isRead: false,
            liker: { id: "u2", name: "Farah Khan", avatarUrl: null },
        },
        {
            id: "l3",
            createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
            isRead: true,
            liker: { id: "u3", name: "Ryan", avatarUrl: null },

        },
    ];
}

// TODO: backend: POST /api/notifications/likes/mark-all-read once we have it or I dont have how the backend looks for notificaiton
async function markAllRead() {
    return true;
}

// TODO: backend: POST /api/notifications/likes/{id}/read
async function markOneRead(id: string) {
    return id;
}

export default function NotificationPage() {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<LikeNotification[]>([]);
    const [filter, setFilter] = useState<"all" | "unread">("all");
    const [error, setError] = useState<string | null>(null);

    const unreadCount = useMemo(() => getUnreadCount(items), [items]);

    const grouped = useMemo(() => {
        const visible = filter === "unread" ? items.filter((n) => !n.isRead) : items;

        const sorted = [...visible].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const map = new Map<string, LikeNotification[]>();
        for (const n of sorted) {
            const label = groupLabel(n.createdAt);
            if (!map.has(label)) map.set(label, []);
        map.get(label)!.push(n);
        }
        return Array.from(map.entries());
    }, [items, filter]);

    // loading notifications here really
    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);
                setError(null);

                let data = loadNotifications();

                if (data.length === 0) {
                    data = await fetchLikeNotifications();
                    saveNotifications(data);
                }

                if (mounted) setItems(data);
            } catch (e: unknown) {
                if (mounted) setError(e instanceof Error ? e.message : "Something went wrong");
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
            setItems((prev) => {
                const next = markAllReadLocal(prev);
                saveNotifications(next);
                return next;
            });
        };
    }, []);


    const handleMarkAllRead = async () => {
        if (unreadCount === 0) return;
        await markAllRead();

        setItems((prev) => {
            const next = markAllReadLocal(prev);
            saveNotifications(next);
            return next;
        });
    };


    const MATCHES_URL = "/dashboard/matches";
    const router = useRouter();

    const handleOpen = async (n: LikeNotification) => {
        await markOneRead(n.id);

        setItems((prev) => {
            const next = markOneReadLocal(prev, n.id);
            saveNotifications(next);
            return next;
        });

        router.push(MATCHES_URL);
    };


    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold">
                    Your{" "}
                        <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                    notifications
                        </span>
                    </h2>
                </div>

                <button
                    onClick={handleMarkAllRead}
                    className="cursor-pointer px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 border border-[#F1EADA]"
                >
                Mark all as read
                </button>
            </div>

            {/* filters */}
            <div className="mt-4 flex items-center gap-2">
                <button
                    onClick={() => setFilter("all")}
                    className={`cursor-pointer px-4 py-2 rounded-2xl text-sm font-medium transition ${
                        filter === "all"
                            ? "bg-linear-to-r from-primary to-secondary text-white shadow-md"
                            : "border border-[#F1EADA] text-gray-700 hover:bg-gray-50"
                    }`}
                >
                All
                    {unreadCount > 0 && (
                        <span
                            className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                filter === "all"
                                    ? "bg-white/20 text-white"
                                    : "bg-gray-200 text-gray-700"
                            }`}
                        >
                            {unreadCount}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setFilter("unread")}
                    className={`cursor-pointer px-4 py-2 rounded-2xl text-sm font-medium transition ${
                        filter === "unread"
                            ? "bg-linear-to-r from-primary to-secondary text-white shadow-md"
                            : "border border-[#F1EADA] text-gray-700 hover:bg-gray-50"
                    }`}
                >
                Unread
                </button>
            </div>


            {/* main content */}
            <div className="mt-5">
                {loading && (
                    <div className="border border-[#F1EADA] rounded-xl p-5 text-sm text-gray-600">
                    Loading notifications…
                    </div>
                )}

                {!loading && error && (
                    <div className="border border-[#F1EADA] rounded-xl p-5">
                        <p className="text-sm font-medium text-gray-900">Couldn’t load.</p>
                        <p className="text-sm text-gray-600 mt-1">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="cursor-pointer mt-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 border border-[#F1EADA]"
                        >
                    Retry
                        </button>
                    </div>
                )}

                {!loading && !error && items.length === 0 && (
                    <div className="border border-[#F1EADA] rounded-xl p-8 text-center">
                        <p className="text-sm font-medium text-gray-900">No likes yet</p>
                        <p className="text-sm text-gray-600 mt-1">
                    When someone likes your profile, it’ll show up here.
                        </p>
                        <Link
                            href="/dashboard"
                            className="cursor-pointer inline-flex mt-4 px-4 py-2 rounded-md text-sm font-medium bg-linear-to-r from-primary to-secondary text-white shadow-md"
                        >
                    Go to Discover
                        </Link>
                    </div>
                )}

                {!loading && !error && items.length > 0 && (
                    <div className="space-y-6">
                        {grouped.map(([label, list]) => (
                            <div key={label}>
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                    {label}
                                </div>

                                {/* Individual notification bubbles */}
                                <div className="space-y-3">
                                    {list.map((n) => (
                                        <button
                                            key={n.id}
                                            onClick={() => handleOpen(n)}
                                            className={[
                                                "cursor-pointer w-full text-left flex items-center gap-3 px-5 py-4",
                                                "rounded-xl border border-[#F1EADA]",
                                                "shadow-sm hover:shadow-md",
                                                "transition-all duration-200",
                                                "hover:-translate-y-[1px] active:translate-y-0",
                                                n.isRead ? "bg-white" : "bg-[#FFF7ED]",
                                            ].join(" ")}
                                        >
                                            <Avatar name={n.liker.name} avatarUrl={n.liker.avatarUrl} />

                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm text-gray-900 truncate">
                                                    <span className="font-semibold">{n.liker.name}</span>{" "}
                                liked your profile
                                                    {!n.isRead && (
                                                        <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary align-middle" />
                                                    )}
                                                </p>

                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {timeAgo(n.createdAt)}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
