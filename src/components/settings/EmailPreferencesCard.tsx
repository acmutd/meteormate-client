"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import { getProfile, updateNotifications } from "@/utils/api/profile";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function EmailPreferencesCard() {
    const { currentUser } = useAuth();
    const [marketing, setMarketing] = useState(true);
    const [matches, setMatches] = useState(true);
    const [initialMarketing, setInitialMarketing] = useState(true);
    const [initialMatches, setInitialMatches] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        let ignore = false;

        const fetchPreferences = async () => {
            if (!currentUser?.uid) {
                if (!ignore) setIsLoading(false);
                return;
            }
      
            if (!ignore) setError(null);
      
            try {
                const result = await getProfile(currentUser.uid);
        
                if (ignore) return;

                if (result.ok) {
                    const { promotional_notification, match_notification } = result.data;
                    setMarketing(promotional_notification);
                    setMatches(match_notification);
                    setInitialMarketing(promotional_notification);
                    setInitialMatches(match_notification);
                    setHasLoaded(true);
                } else {
                    setError(result.error || "Failed to load preferences");
                }
            } catch (err) {
                if (ignore) return;
                console.error("Error fetching email preferences:", err);
                setError("An unexpected error occurred");
            } finally {
                if (!ignore) setIsLoading(false);
            }
        };

        fetchPreferences();
    
        return () => {
            ignore = true;
        };
    }, [currentUser]);

    const handleSave = async () => {
        if (!currentUser) return;
    
        setIsSaving(true);
        setError(null);
        try {
            const result = await updateNotifications({
                promotional_notification: marketing,
                match_notification: matches,
            });

            if (result.ok) {
                // update initial state
                setInitialMarketing(marketing);
                setInitialMatches(matches);
            } else {
                setError(result.error || "Failed to save preferences");
            }
        } catch (err) {
            console.error("Error updating notifications:", err);
            setError("An unexpected error occurred while saving");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Email preferences</h3>

            <div className="w-full">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs relative mb-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <LoadingSpinner size="md" />
                            <p className="mt-2 text-sm text-gray-500">Loading your preferences...</p>
                        </div>
                    ) : !hasLoaded ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <p className="text-sm text-red-500">Failed to load preferences.</p>
                            <p className="text-xs text-gray-500 mt-1">Please refresh the page to try again.</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-6">
                                <div>
                                    <h4 className="font-medium text-gray-900 text-base">Marketing</h4>
                                    <p className="text-gray-500 text-sm">Receive promotional content</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMarketing(!marketing);
                                        setError(null);
                                    }}
                                    disabled={isSaving}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        marketing ? "bg-[#FF9100]" : "bg-gray-200"
                                    } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    <span className="sr-only">Enable marketing updates</span>
                                    <span
                                        className={`${
                                            marketing ? "translate-x-6" : "translate-x-1"
                                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-900 text-base">Matches</h4>
                                    <p className="text-gray-500 text-sm">Receive updates on matches</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMatches(!matches);
                                        setError(null);
                                    }}
                                    disabled={isSaving}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        matches ? "bg-[#FF9100]" : "bg-gray-200"
                                    } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    <span className="sr-only">Enable match updates</span>
                                    <span
                                        className={`${
                                            matches ? "translate-x-6" : "translate-x-1"
                                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                    />
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex justify-end flex-col items-end">
                    <button
                        type="button"
                        className={`relative flex items-center justify-center py-1 px-4 rounded-md text-white font-semibold text-md transition-all duration-200 ease-in-out ${
                            !hasLoaded || (marketing === initialMarketing && matches === initialMatches) || isSaving || isLoading
                                ? "bg-gray-300 cursor-not-allowed"
                                : "cursor-pointer hover:scale-105 bg-gradient-to-r from-[#FF9100] to-[#FFC94C] hover:from-[#E68200] hover:to-[#E3B03C]"
                        }`}
                        onClick={handleSave}
                        disabled={!hasLoaded || (marketing === initialMarketing && matches === initialMatches) || isSaving || isLoading}
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>

                    {hasLoaded && error && (
                        <div className="text-red-600 text-sm mt-2">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
