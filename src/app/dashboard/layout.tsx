// the main layout.tsx page which will have the wrapper - navbar and the side bar
"use client";

import Navbar from "@/components/navigation/navBar";
import Sidebar from "@/components/navigation/sideBar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Sidebar + Page Content */}
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
