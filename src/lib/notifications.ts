export type LikeNotification = {
  id: string;
  createdAt: string;
  isRead: boolean;
  liker: { id: string; name: string; avatarUrl?: string | null };
};

const KEY = "mm_like_notifications_v1";

export function loadNotifications(): LikeNotification[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? (JSON.parse(raw) as LikeNotification[]) : [];
    } catch {
        return [];
    }
}

export function saveNotifications(items: LikeNotification[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(items));
}

export function unreadCount(items: LikeNotification[]) {
    return items.reduce((acc, n) => acc + (n.isRead ? 0 : 1), 0);
}

export function markAllReadLocal(items: LikeNotification[]) {
    return items.map((n) => ({ ...n, isRead: true }));
}

export function markOneReadLocal(items: LikeNotification[], id: string) {
    return items.map((n) => (n.id === id ? { ...n, isRead: true } : n));
}
