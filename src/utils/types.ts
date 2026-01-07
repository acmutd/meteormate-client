export interface MMApiError {
    detail: string
}
export type Result<T> = { ok: true; data: T } | { ok: false; error: string; code: string };

export interface UserRegisterResponse {
    id: string,
    utd_id: string,
    email: string,
    created_at: string
}

export interface UserActivityPing {
    status: string
}
