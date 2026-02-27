import { apiFetch } from "@/utils/api/client";
import { Result } from "@/utils/types";
import { SurveyCreateBody, SurveyResponse, SurveyUpdateBody } from "@/types/survey";

// fetches user survey for the profile page when we integrate that
export async function getSurvey(): Promise<Result<SurveyResponse>> {
    return apiFetch<SurveyResponse>("/api/survey/me", { method: "GET" });
}

// creates a new survey
export async function submitSurvey(body: SurveyCreateBody): Promise<Result<SurveyResponse>> {
    return apiFetch<SurveyResponse>("/api/survey", { method: "POST", body });
}

// updates a survey
export async function updateSurvey(body: SurveyUpdateBody): Promise<Result<SurveyResponse>> {
    return apiFetch<SurveyResponse>("/api/survey", { method: "PUT", body });
}
