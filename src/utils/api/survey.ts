import { apiFetch } from "@/utils/api/client";
import { Result } from "@/utils/types";
import {
    SurveyCreateBody,
    SurveyPayload,
    SurveyResponse,
    SurveyUpdateBody,
} from "@/types/survey";
import { fetchCurrentUser } from "@/utils/api/auth";
import {
    readCachedCurrentUser,
    writeCachedCurrentUser,
} from "@/utils/currentUserCache";

// survey comes from /api/auth/me
export async function getSurvey(): Promise<Result<SurveyResponse>> {
    const userResponse = await fetchCurrentUser({
        preferCache: true,
        maxAgeMs: 5 * 60 * 1000, // (minute) x (secondsPerMinute) x (milisecondsPerSecond). This is 5 minutes
    });

    if (!userResponse.ok) {
        return {
            ok: false,
            error: userResponse.error,
            code: userResponse.code,
        };
    }

    if (!userResponse.data.survey) {
        const refreshedResponse = await fetchCurrentUser({ forceRefresh: true });
        if (!refreshedResponse.ok) {
            return {
                ok: false,
                error: refreshedResponse.error,
                code: refreshedResponse.code,
            };
        }

        if (!refreshedResponse.data.survey) {
            return {
                ok: false,
                error: "Survey not found",
                code: "404",
            };
        }

        return { ok: true, data: refreshedResponse.data.survey };
    }

    return { ok: true, data: userResponse.data.survey };
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

export async function upsertSurvey(
    payload: SurveyPayload,
    surveyDone?: boolean,
): Promise<SurveyResponse> {
    let response = surveyDone
        ? await updateSurvey(payload as SurveyUpdateBody)
        : await submitSurvey(payload as SurveyCreateBody);

    if (!response.ok && response.code === "404") {
        response = surveyDone
            ? await submitSurvey(payload as SurveyCreateBody)
            : await updateSurvey(payload as SurveyUpdateBody);
    }

    if (!response.ok) {
        throw new Error(`Failed to save survey: ${response.code} (${response.error})`);
    }

    const cachedUser = readCachedCurrentUser();
    if (cachedUser) {
        writeCachedCurrentUser({
            ...cachedUser,
            survey: response.data,
            survey_done: true,
        });
    }

    return response.data;
}
