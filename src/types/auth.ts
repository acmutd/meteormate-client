export interface RegisterUserBody {
    email: string;
    password: string;
    utd_id: string;
}

export interface VerifyEmailBody {
    email: string;
    code: string;
}
