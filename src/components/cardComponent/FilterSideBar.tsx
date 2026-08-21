"use client";

import Filters from "./Filters";
import RecentActivity from "./RecentActivity";

type Notification = {
  id: string;
  isRead: boolean;
  liker: {
    name: string;
  };
};

type FilterSidebarProps = {
  loadingNotifications?: boolean;
  top3?: Notification[];
};

export default function FilterSidebar({
  loadingNotifications = false,
  top3 = [],
}: FilterSidebarProps) {
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