import { ProfileResponse } from "./profile";
import { SurveyResponse } from "./survey";

export type UserProfile = {
    id: string;
    utd_id: string;
    email: string;
    created_at: Date;
    survey_done: boolean;
    profile_created: boolean;
    profile?: ProfileResponse;
    survey?: SurveyResponse;
};
