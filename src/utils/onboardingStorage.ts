export type OnboardingData = {
    lifestyle?: { // preference page not the personality page
        wakeupTime: string | null;
        cleanliness: string | null;
        noiseTolerance: string | null;
    };
    interests?: string[];
    lifestylePersonality?: {  
        cookingPreference: string | null;
        petPreferences: string | null;
        guestsPreference: string | null;
        roommatePreference: string | null;
        livingPreference: string | null;
    };
};

const KEY = "meteormate_onboarding";

export function loadOnboardingData(): OnboardingData {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as OnboardingData) : {};
  } catch {
    return {};
  }
}

export function saveOnboardingData(data: OnboardingData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function updateOnboardingData(patch: Partial<OnboardingData>) {
  const current = loadOnboardingData();
  const updated = { ...current, ...patch };
  saveOnboardingData(updated);
  return updated;
}

export function clearOnboardingData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

//later to send it to the backend:
// import { loadOnboardingData, clearOnboardingData } from "@/utils/onboardingStorage";

// const submitOnboarding = async () => {
//   const data = loadOnboardingData();

//   await fetch("/api/onboarding/submit", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });

//   // optional: clear after successful submit
//   clearOnboardingData();
// };
