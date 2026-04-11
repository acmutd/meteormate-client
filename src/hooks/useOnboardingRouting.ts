import { useAuth } from "@/contexts/authContext";
import { useOnboarding } from "@/contexts/onboardingContext";

export function useOnboardingRouting() {
    const { currentUser, userLoggedIn } = useAuth();
    const { isLoading: onboardingLoading, hasProfile, hasPicture, hasSurvey } = useOnboarding();

    // determines what page the user should be on
    const getRequiredRoute = (): string | null => {
        if (!userLoggedIn || !currentUser) return null;

        if (!currentUser.emailVerified) return "/authentication/verifyEmail";

        if (onboardingLoading) return null;
        if (!hasProfile) return "/onboarding/createProfile?toast=needs-profile";
        if (!hasPicture) return "/onboarding/uploadPictures?toast=needs-pictures";
        if (!hasSurvey) return "/onboarding/lifestylePreferences?toast=needs-survey";

        return null;
    };

    const requiredRoute = getRequiredRoute();

    // Explicit flags to help components avoid guesswork
    const isVerificationRequired = !!(userLoggedIn && currentUser && !currentUser.emailVerified);
    const isOnboardingComplete = !!(
        userLoggedIn &&
        currentUser?.emailVerified &&
        !onboardingLoading &&
        hasProfile &&
        hasPicture &&
        hasSurvey
    );

    return {
        requiredRoute,
        isLoading: onboardingLoading,
        isReady: !onboardingLoading,
        isVerificationRequired,
        isOnboardingComplete
    };
}
