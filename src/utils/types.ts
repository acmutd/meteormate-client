export interface MMApiError {
    message: string;
    code: string
};

export async function parseApiError(response: Response): Promise<MMApiError> {
    let data: unknown;

    try {
        data = await response.json()
    } catch {
        // just in case response itself has an error in it
        return { message: "Unknown server error", code: response.status.toString() }
    }

    // validation error has "details" as opposed to "detail"
    if (typeof data === "object" && data && "details" in data) {
        const valErr = data as { details: string[] }
        return {
            message: valErr.details.join("\n"),
            code: "Validation Error"
        }
    }

    // http errors only have "detail"
    if (typeof data === "object" && data && "detail" in data) {
        return {
            message: (data as { detail: string }).detail,
            code: response.status.toString()
        }
    }

    // just in case its a random error that we can't account for
    return { message: "Unexpected server error", code: response.status.toString() }
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
