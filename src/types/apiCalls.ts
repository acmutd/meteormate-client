import { SurveyCreateBody, SurveyUpdateBody } from "@/types/survey";
import { RegisterUserBody, SendVerificationCodeBody, VerifyEmailBody } from "@/types/auth";
import { UpdateUserProfileBody } from "@/types/profile";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";

export type ApiRequestBody =
    | RegisterUserBody
    | SendVerificationCodeBody
    | VerifyEmailBody
    | SurveyCreateBody
    | SurveyUpdateBody
    | UpdateUserProfileBody;

export interface ApiFetchOptions {
    method?: HttpMethod;
    body?: ApiRequestBody;
    isPublic?: boolean;
}
