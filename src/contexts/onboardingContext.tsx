"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "./authContext";
import { getProfile } from "@/utils/api/profile";
import { getSurvey } from "@/utils/api/survey";
import { MIN_PHOTOS } from "@/constants/onboarding";

interface OnboardingContextType {
    isLoading: boolean;
    isError: boolean;
    hasProfile: boolean;
    hasPicture: boolean;
    hasSurvey: boolean;
    markProfileCompleted: (hasPic: boolean) => void;
    markPictureUploaded: () => void;
    markSurveyCompleted: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function useOnboarding(): OnboardingContextType {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error("useOnboarding must be used within an OnboardingProvider");
    }
    return context;
}

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
    const { currentUser, userLoggedIn } = useAuth();
  
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [hasProfile, setHasProfile] = useState(false);
    const [hasPicture, setHasPicture] = useState(false);
    const [hasSurvey, setHasSurvey] = useState(false);

    const resetOnboardingState = useCallback(() => {
        setHasProfile(false);
        setHasPicture(false);
        setHasSurvey(false);
    }, []);

    useEffect(() => {
        let active = true;

        async function checkOnboardingStatus() {
            // Only check if logged in and email is verified.
            if (userLoggedIn && currentUser?.emailVerified) {
                setIsLoading(true);
                setIsError(false);
                try {
                    const [profileRes, surveyRes] = await Promise.all([
                        getProfile(currentUser.uid),
                        getSurvey()
                    ]);

                    if (!active) return;

                    // If either critical call failed at the API level (e.g. 500), consider it an error
                    if (!profileRes.ok && profileRes.code !== "404") {
                        resetOnboardingState();
                        setIsError(true);
                        return;
                    }

                    if (profileRes.ok && profileRes.data) {
                        setHasProfile(true);
                        setHasPicture(
                            Array.isArray(profileRes.data.profile_picture_url) && 
                            profileRes.data.profile_picture_url.length >= MIN_PHOTOS
                        );
                    } else {
                        setHasProfile(false);
                        setHasPicture(false);
                    }

                    if (surveyRes.ok && surveyRes.data) {
                        setHasSurvey(true);
                    } else if (!surveyRes.ok && surveyRes.code !== "404") {
                        resetOnboardingState();
                        setIsError(true);
                    } else {
                        setHasSurvey(false);
                    }
                } catch (error) {
                    if (active) {
                        console.error("Failed to fetch onboarding status", error);
                        resetOnboardingState();
                        setIsError(true);
                    }
                } finally {
                    if (active) {
                        setIsLoading(false);
                    }
                }
            } else {
                // If not logged in or email not verified stop loading and reset states
                if (active) {
                    setIsLoading(false);
                    setIsError(false);
                    resetOnboardingState();
                }
            }
        }

        checkOnboardingStatus();

        return () => {
            active = false;
        };
    }, [userLoggedIn, currentUser]);

    const markProfileCompleted = useCallback((hasPic: boolean) => {
        setHasProfile(true);
        setHasPicture(hasPic);
    }, []);

    const markPictureUploaded = useCallback(() => {
        setHasPicture(true);
    }, []);

    const markSurveyCompleted = useCallback(() => {
        setHasSurvey(true);
    }, []);

    const value: OnboardingContextType = useMemo(() => ({
        isLoading,
        isError,
        hasProfile,
        hasPicture,
        hasSurvey,
        markProfileCompleted,
        markPictureUploaded,
        markSurveyCompleted,
    }), [
        isLoading,
        isError,
        hasProfile,
        hasPicture,
        hasSurvey,
        markProfileCompleted,
        markPictureUploaded,
        markSurveyCompleted,
    ]);

    return (
        <OnboardingContext.Provider value={value}>
            {children}
        </OnboardingContext.Provider>
    );
}
