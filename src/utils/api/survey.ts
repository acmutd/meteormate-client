import { apiFetch } from "@/utils/api/client";
import { Result } from "@/utils/types";
import {
    SurveyCreateBody,
    SurveyPayload,
    SurveyResponse,
    SurveyUpdateBody,
} from "@/types/survey";

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

// Backward-compatible API used by dashboard profile pages.
export async function getMySurvey(): Promise<SurveyResponse> {
    const response = await getSurvey();
    if (!response.ok) {
        throw new Error(`Failed to fetch survey: ${response.code} (${response.error})`);
    }

    return response.data;
}

export async function upsertSurvey(payload: SurveyPayload): Promise<SurveyResponse> {
    let response = await updateSurvey(payload as SurveyUpdateBody);

    if (!response.ok && (response.code === "404")) {
        response = await submitSurvey(payload as SurveyCreateBody);
    }

    if (!response.ok) {
        throw new Error(`Failed to save survey: ${response.code} (${response.error})`);
    }

    return response.data;
}
