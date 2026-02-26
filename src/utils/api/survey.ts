import { apiFetch } from "@/utils/api/client";
import { Result } from "@/utils/types";
import { SurveyCreate, SurveyResponse, SurveyUpdate } from "@/types/survey";

// fetches user survey for the profile page when we integrate that
export async function getSurvey(): Promise<Result<SurveyResponse>> {
    return apiFetch<SurveyResponse>("/api/survey/me", { method: "GET" });
}

// creates a new survey
export async function submitSurvey(body: SurveyCreate): Promise<Result<SurveyResponse>> {
    return apiFetch<SurveyResponse>("/api/survey", { method: "POST", body });
}

// updates a survey
export async function updateSurvey(body: SurveyUpdate): Promise<Result<SurveyResponse>> {
    return apiFetch<SurveyResponse>("/api/survey", { method: "PUT", body });
}
