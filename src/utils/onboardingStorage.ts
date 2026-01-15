export type OnboardingData = {
  wake_time?: string | null;
  cleanliness?: string | null;
  noise_tolerance?: string | null;
  interests?: string[];
  cooking_frequency?: string | null;
  pet_preference?: string | null;
  guests_frequency?: string | null;
  roomate_closeness?: string | null;
  housing_intent?: string | null;
  budget_min?: number | null;
  budget_max?: number | null;
  move_in_date?: Date | null;
  lease_length?: string | null;
  dealbreakers?: string[];
  habits?: string[];
  on_campus_locations?: string[];
  honors?: boolean | null;
  llc_interest?: boolean | null;
  num_roommates?: string | null;
  have_lease?: boolean | null;
  have_lease_length?: string | null;
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
