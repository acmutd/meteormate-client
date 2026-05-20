import { SurveyCreateBody, SurveyUpdateBody } from "@/types/survey";
import { RegisterUserBody, VerifyEmailBody } from "@/types/auth";
import { ProfileCreateBody, ProfileUpdateBody, ProfilePictureBody, ProfileUpdateNotificationsBody, UpdateUserProfileBody, UserDeleteProfilePicturesBody } from "@/types/profile";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";

export type ApiRequestBody =
    | RegisterUserBody
    | VerifyEmailBody
    | SurveyCreateBody
    | SurveyUpdateBody
    | ProfileCreateBody
    | ProfileUpdateBody
    | ProfilePictureBody
    | ProfileUpdateNotificationsBody
    | UpdateUserProfileBody | UserDeleteProfilePicturesBody;

export interface ApiFetchOptions {
    method?: HttpMethod;
    body?: ApiRequestBody;
    isPublic?: boolean;
}
