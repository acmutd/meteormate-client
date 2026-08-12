"use client";

import EmailPreferencesCard from "@/components/settings/EmailPreferencesCard";
import InactivityCard from "@/components/settings/InactivityCard";
import DangerZoneCard from "@/components/settings/DangerZoneCard";

export default function Settings() {
    return (
        <div className="w-full max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
            <p className="mt-2 text-gray-600">Manage your account and preferences</p>

            <div className="flex flex-col gap-10 mt-8">
                <EmailPreferencesCard />
                <InactivityCard />
                <DangerZoneCard />
            </div>
        </div>
    );
}

