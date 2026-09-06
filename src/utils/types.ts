export interface MMApiError {
    message: string;
    code: string
};

const toErrorMessage = (value: unknown): string => {
    if (typeof value === "string") return value;
    if (Array.isArray(value)) {
        return value.map(toErrorMessage).join("\n");
    }
    if (typeof value === "object" && value) {
        if ("msg" in value && typeof value.msg === "string") return value.msg;
        if ("message" in value && typeof value.message === "string") return value.message;
        return JSON.stringify(value);
    }
    return String(value);
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
        const valErr = data as { details: unknown }
        return {
            message: toErrorMessage(valErr.details),
            code: "Validation Error"
        }
    }

    // http errors only have "detail"
    if (typeof data === "object" && data && "detail" in data) {
        return {
            message: toErrorMessage((data as { detail: unknown }).detail),
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
