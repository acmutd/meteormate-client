"use client";
import { LikeNotification } from "@/lib/notifications";

type RecentActivityProps = {
  loadingNotifications?: boolean;
  top3?: LikeNotification[];
};

export default function RecentActivity({
  loadingNotifications = false,
  top3 = [],
}: RecentActivityProps) {
  return (
    <section className="rounded-2xl border w-full lg:w-[75%] border-[#F1EADA] bg-white shadow-sm py-6 px-10 max-h-90 overflow-auto">
      <div className="flex items-center gap-2 mb-5">
        <EyeIcon />
        <p className="text-sm font-semibold text-gray-900">
          Recent activity
        </p>
      </div>

      {loadingNotifications && (
        <p className="text-sm text-gray-500">Loading...</p>
      )}

      {!loadingNotifications && top3.length === 0 && (
        <p className="text-sm text-gray-500">No notifications yet.</p>
      )}

      {!loadingNotifications && top3.length > 0 && (
        <div className="space-y-3">
          {top3.map((n) => (
            <div
              key={n.id}
              className={[
                "rounded-xl px-3 py-2 transition",
                n.isRead ? "bg-white" : "bg-[#FFF7ED]",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-900 truncate">
                  <span className="font-semibold">{n.liker?.name}</span>{" "}
                  liked your profile
                </p>

                {!n.isRead && (
                  <span className="shrink-0 h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6 text-gray-900"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
}