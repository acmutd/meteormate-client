"use client";

import Filters from "./Filters";
import RecentActivity from "./RecentActivity";
import { LikeNotification } from "@/lib/notifications";

type FilterSideBarProps = {
  loadingNotifications?: boolean;
  top3?: LikeNotification[];
};

export default function FilterSideBar({
    loadingNotifications = false,
    top3 = [],
}: FilterSideBarProps) {
    return (
        <aside className="w-full lg:w-[380px] xl:w-[420px] shrink-0 flex flex-col gap-6 lg:ml-auto lg:items-end">
            <Filters />

            <RecentActivity
                loadingNotifications={loadingNotifications}
                top3={top3}
            />
        </aside>
    );
}