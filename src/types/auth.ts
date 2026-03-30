export interface RegisterUserBody {
    email: string;
    password: string;
    net_id: string;
}

export interface VerifyEmailBody {
    email: string;
    code: string;
}
