"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./authContext";
import { getProfile } from "@/utils/api/profile";
import { getSurvey } from "@/utils/api/survey";
import { MIN_PHOTOS } from "@/app/onboarding/uploadPictures/page";

interface OnboardingContextType {
    isLoading: boolean;
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
    const [hasProfile, setHasProfile] = useState(false);
    const [hasPicture, setHasPicture] = useState(false);
    const [hasSurvey, setHasSurvey] = useState(false);

    useEffect(() => {
        async function checkOnboardingStatus() {
            // Only check if logged in and email is verified.
            if (userLoggedIn && currentUser?.emailVerified) {
                setIsLoading(true);
                try {
                    const [profileRes, surveyRes] = await Promise.all([
                        getProfile(currentUser.uid),
                        getSurvey()
                    ]);

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
                    } else {
                        setHasSurvey(false);
                    }
                } catch (error) {
                    console.error("Failed to fetch onboarding status", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                // If not logged in or email not verified, stop loading.
                setIsLoading(false);
            }
        }

        checkOnboardingStatus();
    }, [userLoggedIn, currentUser]);

    const markProfileCompleted = (hasPic: boolean) => {
        setHasProfile(true);
        setHasPicture(hasPic);
    };

    const markPictureUploaded = () => {
        setHasPicture(true);
    };

    const markSurveyCompleted = () => {
        setHasSurvey(true);
    };

    const value: OnboardingContextType = {
        isLoading,
        hasProfile,
        hasPicture,
        hasSurvey,
        markProfileCompleted,
        markPictureUploaded,
        markSurveyCompleted,
    };

    return (
        <OnboardingContext.Provider value={value}>
            {children}
        </OnboardingContext.Provider>
    );
}
