import { MMApiError, Result, UserRegisterResponse } from "../types";

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
            const data = (await response.json()) as MMApiError
            return { ok: false, error: data.detail, code: response.status }
        }

        const data = (await response.json()) as UserRegisterResponse

        return { ok: true, data }
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : "Internal Server Error",
            code: 500
        }
    }
}