import { SurveyCreateBody, SurveyUpdateBody } from "@/types/survey";
import { RegisterUserBody, VerifyEmailBody } from "@/types/auth";
import { ProfileCreateBody, ProfileUpdateBody, ProfileDeletePicturesBody, ProfileUpdateNotificationsBody, UpdateUserProfileBody } from "@/types/profile";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";

export type ApiRequestBody =
    | RegisterUserBody
    | VerifyEmailBody
    | SurveyCreateBody
    | SurveyUpdateBody
    | ProfileCreateBody
    | ProfileUpdateBody
    | ProfileDeletePicturesBody
    | ProfileUpdateNotificationsBody
    | UpdateUserProfileBody;

export interface ApiFetchOptions {
    method?: HttpMethod;
    body?: ApiRequestBody;
    isPublic?: boolean;
}
