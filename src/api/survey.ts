import { getCurrentUserIdToken } from "@/firebase/auth";

export interface SurveyPayload {
  housing_intent?: string | null;
  budget_min?: number | null;
  budget_max?: number | null;
  move_in_date?: string | null;
  wake_time?: string | null;
  cleanliness?: string | null;
  noise_tolerance?: string | null;
  interests?: string[];
  dealbreakers?: string[];
  cooking_frequency?: string | null;
  pet_preference?: string | null;
  guests_frequency?: string | null;
  roommate_closeness?: string | null;
  on_campus_locations?: string[];
  honors?: boolean | null;
  llc_interest?: boolean | null;
  num_roommates?: string | null;
  have_lease?: boolean | null;
  have_lease_length?: string | null;
  answers?: Record<string, unknown>;
  smoke_vape?: boolean;
  drink?: boolean;
}

export interface SurveyResponse {
  user_id: string;
  housing_intent: string | null;
  budget_min: number | null;
  budget_max: number | null;
  move_in_date: string | null;
  wake_time: string | null;
  cleanliness: string | null;
  noise_tolerance: string | null;
  interests: string[];
  dealbreakers: string[];
  cooking_frequency: string | null;
  pet_preference: string | null;
  guests_frequency: string | null;
  roommate_closeness: string | null;
  on_campus_locations: string[];
  honors: boolean | null;
  llc_interest: boolean | null;
  num_roommates: string | null;
  have_lease: boolean | null;
  have_lease_length: string | null;
  answers: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  smoke_vape: boolean;
  drink: boolean;
}

interface SurveyErrorBody {
  detail?: string;
}

async function getErrorDetail(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as SurveyErrorBody;
    return data.detail ? ` (${data.detail})` : "";
  } catch {
    return "";
  }
}

async function authenticatedSurveyRequest(
  path: string,
  options: RequestInit,
): Promise<Response> {
  const token = await getCurrentUserIdToken();

  return fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });
}

export async function getMySurvey(): Promise<SurveyResponse> {
  const response = await authenticatedSurveyRequest("/api/survey/me", {
    method: "GET",
  });

  if (!response.ok) {
    const detail = await getErrorDetail(response);
    throw new Error(`Failed to fetch survey: ${response.status}${detail}`);
  }

  return (await response.json()) as SurveyResponse;
}

export async function upsertSurvey(
  payload: SurveyPayload,
): Promise<SurveyResponse> {
  let response = await authenticatedSurveyRequest("/api/survey", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await getErrorDetail(response);
    const isAlreadyExists =
      response.status === 400 && detail.toLowerCase().includes("already exists");

    if (isAlreadyExists) {
      response = await authenticatedSurveyRequest("/api/survey", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    }
  }

  if (!response.ok) {
    const detail = await getErrorDetail(response);
    throw new Error(`Failed to save survey: ${response.status}${detail}`);
  }

  return (await response.json()) as SurveyResponse;
}
