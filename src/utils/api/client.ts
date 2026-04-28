import { auth } from "@/firebase/firebase";
import { parseApiError, Result } from "@/utils/types";
import { ApiFetchOptions } from "@/types/apiCalls";

const isDev = process.env.NODE_ENV === 'development';
const baseUrl = isDev ? (process.env.NEXT_PUBLIC_API_BASE_URL || "") : "";

export async function apiFetch<T>(
    path: string,
    options: ApiFetchOptions = {}
): Promise<Result<T>> {
    // Ensure path starts with a slash, and remove any trailing slash from baseUrl
    const cleanedPath = path.startsWith('/') ? path : `/${path}`;
    const cleanedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const finalUrl = `${cleanedBaseUrl}${cleanedPath}`;

    // console.log(`[API FETCH] ${options.method || 'GET'} -> ${finalUrl}`);
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

        const response = await fetch(finalUrl, {
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

        const text = await response.text();
        const data = text ? (JSON.parse(text) as T) : (undefined as T);
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
