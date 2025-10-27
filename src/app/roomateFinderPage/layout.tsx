"use client"

import "../globals.css";
import { AuthProvider } from "../../contexts/authContext";
import ScreenBlocker from "../../../components/ScreenBlocker";

export default function RoomateFinderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-cover bg-center bg-black min-h-screen w-screen flex items-center justify-center relative">
            {children}
        </div>
    );
}
