export type HousingIntent = "on_campus" | "off_campus" | "both";

export type WakeTime = "early_bird" | "flexible" | "night_owl";

export type Cleanliness = "relaxed" | "tidy" | "neat_freak";

export type NoiseTolerance = "quiet" | "moderate" | "loud";

export type CookingFrequency = "never" | "rarely" | "often";

export type PetPreference = "okay" | "not_okay" | "have_a_pet";

export type GuestsFrequency = "never" | "sometimes" | "often";

export type RoommateCloseness = "not_close" | "friends" | "close_friends";

export type Dealbreaker = "smoke_vape" | "drink" | "same_gender";

export type OnCampusLocation = "uv" | "cc" | "freshman_dorms" | "northside";

export type NumRoommates = "no_preference" | "one" | "two" | "three";

export type HaveLeaseLength = "semester" | "academic_year" | "year";

export interface SurveyCreateBody {
    housing_intent?: HousingIntent | null;

    budget_min?: number | null;
    budget_max?: number | null;
    move_in_date?: string | null;

    wake_time?: WakeTime | null;
    cleanliness?: Cleanliness | null;
    noise_tolerance?: NoiseTolerance | null;

    interests?: string[];
    dealbreakers?: Dealbreaker[];

    cooking_frequency?: CookingFrequency | null;
    pet_preference?: PetPreference | null;
    guests_frequency?: GuestsFrequency | null;
    roommate_closeness?: RoommateCloseness | null;

    on_campus_locations?: OnCampusLocation[];
    honors?: boolean | null;
    llc_interest?: boolean | null;
    num_roommates?: NumRoommates | null;

    have_lease?: boolean | null;
    have_lease_length: HaveLeaseLength;

    answers?: Record<string, unknown>;

    smoke_vape?: boolean;
    drink?: boolean;
}

export interface SurveyUpdateBody {
    housing_intent?: HousingIntent | null;

    budget_min?: number | null;
    budget_max?: number | null;
    move_in_date?: string | null;

    wake_time?: WakeTime | null;
    cleanliness?: Cleanliness | null;
    noise_tolerance?: NoiseTolerance | null;

    interests?: string[] | null;
    dealbreakers?: Dealbreaker[] | null;

    cooking_frequency?: CookingFrequency | null;
    pet_preference?: PetPreference | null;
    guests_frequency?: GuestsFrequency | null;
    roommate_closeness?: RoommateCloseness | null;

    on_campus_locations?: OnCampusLocation[] | null;
    honors?: boolean | null;
    llc_interest?: boolean | null;
    num_roommates?: NumRoommates | null;

    have_lease?: boolean | null;
    have_lease_length?: HaveLeaseLength | null;

    answers?: Record<string, unknown> | null;

    smoke_vape?: boolean;
    drink?: boolean;
}

// Shared payload used by upsert flows (POST first, then PUT fallback)
export interface SurveyPayload {
    housing_intent?: string | null;

    budget_min?: number | null;
    budget_max?: number | null;
    move_in_date?: string | null;

    wake_time?: string | null;
    cleanliness?: string | null;
    noise_tolerance?: string | null;

    interests?: string[];
    dealbreakers?: string[];

    cooking_frequency?: string | null;
    pet_preference?: string | null;
    guests_frequency?: string | null;
    roommate_closeness?: string | null;

    on_campus_locations?: string[];
    honors?: boolean | null;
    llc_interest?: boolean | null;
    num_roommates?: string | null;

    have_lease?: boolean | null;
    have_lease_length?: string | null;

    answers?: Record<string, unknown>;

    smoke_vape?: boolean;
    drink?: boolean;
}

export interface SurveyResponse {
    user_id: string;

    housing_intent?: HousingIntent | null;

    budget_min?: number | null;
    budget_max?: number | null;
    move_in_date?: string | null;

    wake_time?: WakeTime | null;
    cleanliness?: Cleanliness | null;
    noise_tolerance?: NoiseTolerance | null;

    interests: string[];
    dealbreakers: Dealbreaker[];

    cooking_frequency?: CookingFrequency | null;
    pet_preference?: PetPreference | null;
    guests_frequency?: GuestsFrequency | null;
    roommate_closeness?: RoommateCloseness | null;

    on_campus_locations: OnCampusLocation[];
    honors?: boolean | null;
    llc_interest?: boolean | null;
    num_roommates?: NumRoommates | null;

    have_lease?: boolean | null;
    have_lease_length: HaveLeaseLength;

    answers: Record<string, unknown>;

    created_at: string;
    updated_at: string;

    smoke_vape: boolean;
    drink: boolean;
}