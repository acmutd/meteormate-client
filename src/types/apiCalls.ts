export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";

export interface ApiFetchOptions {
    method?: HttpMethod;
    body?: unknown;
    isPublic?: boolean;
}