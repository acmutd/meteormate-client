"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "./authContext";
import { fetchCurrentUser } from "@/utils/api/auth";
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

    // prevents re firing when firebase replaces user
    const uid = currentUser?.uid;
    const emailVerified = currentUser?.emailVerified;

    useEffect(() => {
        let active = true;

        async function checkOnboardingStatus() {
            // Only check if logged in and email is verified.
            if (userLoggedIn && emailVerified) {
                setIsLoading(true);
                setIsError(false);
                try {
                    // /api/auth/me returns survey_done, profile_created, and the profile with profile_picture
                    const res = await fetchCurrentUser();

                    if (!active) return;

                    if (!res.ok) {
                        resetOnboardingState();
                        setIsError(true);
                        return;
                    }

                    const userData = res.data!;
                    const profileDone = userData.profile_created;
                    const picturesDone =
                        profileDone &&
                        Array.isArray(userData.profile?.profile_picture_url) &&
                        userData.profile!.profile_picture_url.length >= MIN_PHOTOS;

                    setHasProfile(profileDone);
                    setHasPicture(picturesDone);
                    setHasSurvey(userData.survey_done);
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
                // not logged in or email verified, reset
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
    // uid + emailVerified are primitives so this only re-runs on real identity changes.
    }, [userLoggedIn, uid, emailVerified, resetOnboardingState]);

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
