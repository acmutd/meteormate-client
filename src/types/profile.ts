export type Gender = "female" | "male" | "non_binary" | "prefer_not_to_say" | "other";

export type Classification = "freshman" | "sophomore" | "junior" | "senior" | "graduate";

export interface ProfileCreateBody {
    gender: Gender;
    major: string;
    classification: Classification;
    bio: string;
    profile_picture_url: string[];
    first_name: string;
    last_name: string;
    dob: string;
    match_notification?: boolean;
    promotional_notification?: boolean;
}

export interface ProfileUpdateBody {
    gender?: Gender | null;
    major?: string | null;
    classification?: Classification | null;
    bio?: string | null;
    profile_picture_url?: string[] | null;
    first_name?: string | null;
    last_name?: string | null;
    dob?: string | null;
    match_notification?: boolean | null;
    promotional_notification?: boolean | null;
}

export interface ProfileResponse {
    user_id: string;
    gender: Gender;
    major: string;
    classification: Classification;
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string;
    age: number;
    dob: string;
    profile_picture_url: string[];
    bio: string;
    match_notification: boolean;
    promotional_notification: boolean;
}

export interface ProfilePictureBody {
    base64: string;
}
export interface ProfileUpdateNotificationsBody {
    match_notification?: boolean | null;
    promotional_notification?: boolean | null;
}
export interface UpdateUserProfileBody {
    major: string;
    gender: string;
    classification: string;
    bio: string;
    dob: string | null;
}
