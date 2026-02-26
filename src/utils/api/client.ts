import { auth } from "@/firebase/firebase";
import { parseApiError, Result } from "@/utils/types";
import { ApiFetchOptions } from "@/types/apiCalls";

export async function apiFetch<T>(
    path: string,
    options: ApiFetchOptions = {}
): Promise<Result<T>> {
    const { method = "GET", body, isPublic = false } = options;

    try {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (!isPublic) {
            const user = auth.currentUser;

            if (!user) {
                return {
                    ok: false,
                    error: "You are not signed in. Please log in and try again.",
                    code: "401",
                };
            }

            const token = await user.getIdToken();
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(path, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const { message, code } = await parseApiError(response);
            return { ok: false, error: message, code };
        }

        // No body to parse
        if (response.status === 204) {
            return { ok: true, data: undefined as T };
        }

        const data = (await response.json()) as T;
        return { ok: true, data };

    } catch (error) {
        // network errors
        return {
            ok: false,
            error: error instanceof Error ? error.message : "Unexpected network error",
            code: "500",
        };
    }
}
