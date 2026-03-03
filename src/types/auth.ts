export interface RegisterUserBody {
    email: string;
    password: string;
    utd_id: string;
}

// atharva said this will change in new backend pr
export interface SendVerificationCodeBody {
    email: string;
    uid?: string;
    purpose?: "verify" | "reset";
}

export interface VerifyEmailBody {
    email: string;
    code: string;
}
