export type UserProfile = {
    id: string;
    utd_id: string;
    email: string;
    created_at: Date;
    survey_done: boolean;
    profile_created: boolean;
    survey?: import("@/types/survey").SurveyResponse; // importing since SurveyResponse is so large
    profile?: {
        user_id: string;
        gender: "female" | "male" | "non_binary" | "prefer_not_to_say" | "other";
        major: string;
        school: string;
        classification: "freshman" | "sophomore" | "junior" | "senior" | "graduate";
        created_at: Date;
        updated_at: Date;
        first_name?: string;
        last_name?: string;
        age: number;
        dob: string;
        profile_picture_url?: string[];
        bio: string;
    }
};
