import { SurveyResponse } from "@/types/survey";
import { UserProfile } from "@/types/userProfile";

export type PotentialMatch = {
    uid: string;
    profile: NonNullable<UserProfile["profile"]>;
    survey: SurveyResponse;
};

export type PotentialMatchesResponse = {
    matches: PotentialMatch[];
};