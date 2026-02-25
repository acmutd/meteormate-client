import { apiFetch } from "@/utils/api/client";
import { Result } from "@/utils/types";

export interface SurveyResponse {
    user_id: string;

    housing_intent?: string | null;

    budget_min?: number | null;
    budget_max?: number | null;
    move_in_date?: string | null;

    wake_time?: string | null;
    cleanliness?: string | null;
    noise_tolerance?: string | null;

    interests: string[];
    dealbreakers: string[];

    cooking_frequency?: string | null;
    pet_preference?: string | null;
    guests_frequency?: string | null;
    roommate_closeness?: string | null;

    on_campus_locations: string[];
    honors?: boolean | null;
    llc_interest?: boolean | null;
    num_roommates?: string | null;

    have_lease?: boolean | null;
    have_lease_length: string;

    answers: Record<string, unknown>;

    created_at: string;
    updated_at: string;

    smoke_vape: boolean;
    drink: boolean;
}

// fetches user survey for the profile page when we integrate that
export async function getSurvey(): Promise<Result<SurveyResponse>> {
    return apiFetch<SurveyResponse>("/api/survey/me", { method: "GET" });
}

// creates a new survey
export async function submitSurvey(body: unknown): Promise<Result<SurveyResponse>> {
    return apiFetch<SurveyResponse>("/api/survey", { method: "POST", body });
}

// updates a survey
export async function updateSurvey(body: unknown): Promise<Result<SurveyResponse>> {
    return apiFetch<SurveyResponse>("/api/survey", { method: "PUT", body });
}
