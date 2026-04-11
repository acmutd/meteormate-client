import { useAuth } from "@/contexts/authContext";
import { useOnboarding } from "@/contexts/onboardingContext";

export function useOnboardingRouting() {
    const { currentUser, userLoggedIn } = useAuth();
    const { isLoading, hasProfile, hasPicture, hasSurvey } = useOnboarding();

    const getRequiredRoute = (): string | null => {
        if (!userLoggedIn || !currentUser) return null;

        if (!currentUser.emailVerified) return "/authentication/verifyEmail";

        if (isLoading) return null;

        if (!hasProfile) return "/onboarding/createProfile";
        if (!hasPicture) return "/onboarding/uploadPictures";
        if (!hasSurvey) return "/onboarding/lifestylePreferences";

        return null;
    };

    const requiredRoute = getRequiredRoute();

    return { requiredRoute, isLoading, isReady: !isLoading };
}
