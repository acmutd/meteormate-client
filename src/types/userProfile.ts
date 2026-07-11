import { SurveyResponse } from "@/types/survey";

export type UserProfile = {
    id: string;
    utd_id: string;
    email: string;
    created_at: Date;
    survey_done: boolean;
    profile_created: boolean;
<<<<<<< HEAD
    survey?: SurveyResponse;
=======
>>>>>>> origin
    profile?: {
        user_id: string;
        gender: "female" | "male" | "non_binary" | "prefer_not_to_say" | "other";
        major: string;
<<<<<<< HEAD
        school: string;
=======
>>>>>>> origin
        classification: "freshman" | "sophomore" | "junior" | "senior" | "graduate";
        created_at: Date;
        updated_at: Date;
        first_name?: string;
        last_name?: string;
<<<<<<< HEAD
        dob: string;
=======
        age: number;
>>>>>>> origin
        profile_picture_url?: string[];
        bio: string;
    }
};
