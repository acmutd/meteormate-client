import { auth } from "@/firebase/firebase";
import { parseApiError, Result, UserActivityPing, UserRegisterResponse } from "../types";

export async function callRegisterRoute(email: string, password: string, utd_id: string): Promise<Result<UserRegisterResponse>> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': JSON.stringify({
                email,
                password,
                utd_id
            })
        });

        if (!response.ok) {
            const { message, code } = await parseApiError(response)
            return { ok: false, error: message, code }
        }

        const data = (await response.json()) as UserRegisterResponse

        return { ok: true, data }
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : "Internal Server Error",
            code: "500"
        }
    }
}

export async function callActivityPing(): Promise<Result<UserActivityPing>> {
    try {
        const user = auth.currentUser;
        if (!user) {
            return { ok: false, error: 'User not authenticated, please sign in or try again', code: "401" }
        }

        const userToken = await user.getIdToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URLL}/auth/activity-ping`, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
        });

        if (!response.ok) {
            const { message, code } = await parseApiError(response)
            return { ok: false, error: message, code }
        }

        const data = (await response.json()) as UserActivityPing

        return { ok: true, data }
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : "Internal Server Error",
            code: "500"
        }
    }
}
