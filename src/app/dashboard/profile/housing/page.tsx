"use client";

import { useEffect, useState } from "react";
import LifestylePreferencesCard from "@/components/LifestylePreferencesCard";
import PriceRangeSlider from "@/components/PriceRangeSlider";
import { useToast } from "@/components/ui/ToastProvider";
import {
    loadOnboardingData,
    updateOnboardingData,
} from "@/utils/onboardingStorage";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import UnsavedChangesDialog from "@/components/navigation/UnsavedChangesDialog";
import { getMySurvey, upsertSurvey } from "@/utils/api/survey";

interface HousingState {
    on_campus_locations: string[];
    honors: boolean | null;
    llc_interest: boolean | null;
    num_roommates: string | null;
    have_lease: boolean | null;
    have_lease_length: string | null;
    budget_min: number | null;
    budget_max: number | null;
}

const DEFAULT_BUDGET_MIN = 600;
const DEFAULT_BUDGET_MAX = 1400;

export default function HousingPage() {
    const { toast } = useToast();
    const [surveyExists] = useState(false);
    const [housingIntent, setHousingIntent] = useState<string | null>(null);

    const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
    const [selectedHonorsStatus, setSelectedHonorsStatus] = useState<
        boolean | null
    >(null);
    const [selectedLLCPreference, setSelectedLLCPreference] = useState<
        boolean | null
    >(null);
    const [selectedNumOfRoommates, setSelectedNumOfRoommates] = useState<
        string | null
    >(null);

    const [selectedLeaseStatus, setSelectedLeaseStatus] = useState<
        boolean | null
    >(null);
    const [selectedHaveLeaseLength, setSelectedHaveLeaseLength] = useState<
        string | null
    >(null);
    const [selectedBudgetMin, setSelectedBudgetMin] = useState<number | null>(
        null,
    );
    const [selectedBudgetMax, setSelectedBudgetMax] = useState<number | null>(
        null,
    );
    const [initialValues, setInitialValues] = useState<HousingState>({
        on_campus_locations: [],
        honors: null,
        llc_interest: null,
        num_roommates: null,
        have_lease: null,
        have_lease_length: null,
        budget_min: null,
        budget_max: null,
    });

    const [hydrated, setHydrated] = useState(false);

    const isDirty =
        hydrated &&
        (JSON.stringify(selectedLocation) !==
                JSON.stringify(initialValues.on_campus_locations) ||
            selectedHonorsStatus !== initialValues.honors ||
            selectedLLCPreference !== initialValues.llc_interest ||
            selectedNumOfRoommates !== initialValues.num_roommates ||
            selectedLeaseStatus !== initialValues.have_lease ||
            selectedHaveLeaseLength !== initialValues.have_lease_length ||
            selectedBudgetMin !== initialValues.budget_min ||
            selectedBudgetMax !== initialValues.budget_max);

    const { isDialogOpen, confirmNavigation, cancelNavigation } =
        useUnsavedChangesGuard({ isDirty });

    useEffect(() => {
        const hydrateFromStorageAndBackend = async () => {
            const saved = loadOnboardingData();
            const fallbackHousingIntent = saved.housing_intent ?? null;

            const fallbackMin = saved.budget_min ?? DEFAULT_BUDGET_MIN;
            const fallbackMax = saved.budget_max ?? DEFAULT_BUDGET_MAX;
            const fallback: HousingState = {
                on_campus_locations: Array.isArray(saved.on_campus_locations)
                    ? saved.on_campus_locations
                    : [],
                honors: saved.honors ?? null,
                llc_interest: saved.llc_interest ?? null,
                num_roommates: saved.num_roommates ?? null,
                have_lease: saved.have_lease ?? null,
                have_lease_length: saved.have_lease_length ?? null,
                budget_min: fallbackMin,
                budget_max: fallbackMax,
            };

            let normalized = fallback;
            let resolvedHousingIntent = fallbackHousingIntent;

            try {
                const survey = await getMySurvey();
                resolvedHousingIntent =
                    (survey.housing_intent as string | null | undefined) ??
                    fallbackHousingIntent;
                normalized = {
                    on_campus_locations: Array.isArray(survey.on_campus_locations)
                        ? (survey.on_campus_locations as string[])
                        : fallback.on_campus_locations,
                    honors:
                        (survey.honors as boolean | null | undefined) ??
                        fallback.honors,
                    llc_interest:
                        (survey.llc_interest as boolean | null | undefined) ??
                        fallback.llc_interest,
                    num_roommates:
                        (survey.num_roommates as string | null | undefined) ??
                        fallback.num_roommates,
                    have_lease:
                        (survey.have_lease as boolean | null | undefined) ??
                        fallback.have_lease,
                    have_lease_length:
                        (survey.have_lease_length as string | null | undefined) ??
                        fallback.have_lease_length,
                    budget_min:
                        (survey.budget_min as number | null | undefined) ??
                        fallback.budget_min,
                    budget_max:
                        (survey.budget_max as number | null | undefined) ??
                        fallback.budget_max,
                };
            } catch (error) {
                console.warn(
                    "Failed to load survey from backend, using local draft",
                    error,
                );
            }

            setHousingIntent(resolvedHousingIntent);
            setSelectedLocation(normalized.on_campus_locations);
            setSelectedHonorsStatus(normalized.honors);
            setSelectedLLCPreference(normalized.llc_interest);
            setSelectedNumOfRoommates(normalized.num_roommates);
            setSelectedLeaseStatus(normalized.have_lease);
            setSelectedHaveLeaseLength(normalized.have_lease_length);
            setSelectedBudgetMin(normalized.budget_min);
            setSelectedBudgetMax(normalized.budget_max);
            setInitialValues(normalized);

            setHydrated(true);
        };

        void hydrateFromStorageAndBackend();
    }, []);

    const handleUpdateProfile = async () => {
        if (!hydrated) return;
        if (!housingIntent) {
            toast({
                type: "error",
                title: "Living preference missing",
                description:
                    "Set your living preference in Lifestyle Personality first.",
            });
            return;
        }

        try {
            const payload: HousingState = {
                on_campus_locations: selectedLocation,
                honors: selectedHonorsStatus,
                llc_interest: selectedLLCPreference,
                num_roommates: selectedNumOfRoommates,
                have_lease: selectedLeaseStatus,
                have_lease_length: selectedHaveLeaseLength,
                budget_min: selectedBudgetMin,
                budget_max: selectedBudgetMax,
            };

            if (housingIntent === "on_campus") {
                payload.have_lease = null;
                payload.have_lease_length = null;
                payload.budget_min = null;
                payload.budget_max = null;
            } else if (housingIntent === "off_campus") {
                payload.on_campus_locations = [];
                payload.honors = null;
                payload.llc_interest = null;
                payload.num_roommates = null;
            } else {
                payload.on_campus_locations = [];
                payload.honors = null;
                payload.llc_interest = null;
                payload.num_roommates = null;
                payload.have_lease = null;
                payload.have_lease_length = null;
                payload.budget_min = null;
                payload.budget_max = null;
            }

            await upsertSurvey(payload, surveyExists);
            updateOnboardingData(payload);

            setSelectedLocation(payload.on_campus_locations);
            setSelectedHonorsStatus(payload.honors);
            setSelectedLLCPreference(payload.llc_interest);
            setSelectedNumOfRoommates(payload.num_roommates);
            setSelectedLeaseStatus(payload.have_lease);
            setSelectedHaveLeaseLength(payload.have_lease_length);
            setSelectedBudgetMin(payload.budget_min);
            setSelectedBudgetMax(payload.budget_max);
            setInitialValues(payload);

            toast({
                type: "success",
                title: "Profile updated",
                description: "Your housing preferences were saved.",
            });
        } catch (error) {
            console.error("Failed to save housing preferences", error);
            toast({
                type: "error",
                title: "Save failed",
                description: "Something wrong happened. Please try again.",
            });
        }
    };

    const handleBooleanToggle = (
        currentValue: boolean | null,
        setValue: (val: boolean | null) => void,
        newValue: boolean,
    ) => {
        setValue(currentValue === newValue ? null : newValue);
    };

    const handleStringToggle = (
        currentValue: string | null,
        setValue: (val: string | null) => void,
        newValue: string,
    ) => {
        setValue(currentValue === newValue ? null : newValue);
    };

    const handleLocationToggle = (value: string) => {
        const newLocations = selectedLocation.includes(value)
            ? selectedLocation.filter((item) => item !== value)
            : [...selectedLocation, value];

        setSelectedLocation(newLocations);

        if (!newLocations.includes("freshman_dorms")) {
            setSelectedLLCPreference(null);
        }

        const hasRoommateLocation = newLocations.some((loc) =>
            ["northside", "cc", "uv"].includes(loc),
        );
        if (!hasRoommateLocation) {
            setSelectedNumOfRoommates(null);
        }
    };

    const showFreshmanSpecifics = selectedLocation.includes("freshman_dorms");
    const showRoommateOptions = selectedLocation.some((loc) =>
        ["northside", "cc", "uv"].includes(loc),
    );
    const livingPreferenceLabel =
        housingIntent === "on_campus"
        	? "On-Campus"
        	: housingIntent === "off_campus"
        		? "Off-Campus"
        		: null;

    return (
        <>
            <UnsavedChangesDialog
                isOpen={isDialogOpen}
                onConfirm={confirmNavigation}
                onCancel={cancelNavigation}
            />
            <div className="flex flex-col justify-center items-center relative">
                <div className="w-[76%] max-h-192 bg-[#FFFFFF] rounded-2xl shadow-2xl flex flex-col">
                    <div className="text-center mt-2 relative">
                        <button
                            type="button"
                            onClick={handleUpdateProfile}
                            disabled={!isDirty}
                            className="absolute right-8 top-4 px-6 py-2 rounded-lg text-black font-medium shadow bg-linear-60 from-[#F28C00] to-[#FFC243] hover:from-[#d97706] hover:to-[#f59e0b] hover:shadow-md transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                        Update Profile
                        </button>
                        <p className="text-3xl font-bold">Housing</p>
                        <p className="text-center text-md text-gray-600 mb-2">
                        Help us find your ideal roommate by selecting your housing
                        preferences!
                        </p>
                    </div>

                    <div className="py-8 px-15 w-full flex flex-col overflow-y-auto flex-1 custom-scrollbar">
                        <h1 className="text-black text-xl font-bold">Living Preference</h1>
                        <p className="text-black text-sm mt-1 mb-2">
                        This value is managed in Lifestyle Personality.
                        </p>
                        <div className="mb-6 rounded-lg border border-[#FF9100]/40 bg-[#FFF7ED] px-4 py-3 text-sm text-gray-800">
                            <span className="font-semibold">Current setting:</span>{" "}
                            {livingPreferenceLabel ?? "Not set"}
                        </div>

                        {!livingPreferenceLabel && (
                            <p className="text-sm text-red-600 mb-4">
                            Please set living preference in Lifestyle Personality before
                            editing housing details here.
                            </p>
                        )}

                        {housingIntent === "on_campus" && (
                            <>
                                <p className="text-black text-sm font-bold mt-1 mb-2">
                                Location: Northside, UV, CC, or Freshmen dorms?
                                </p>
                                <div className="grid grid-cols-4 gap-2 mb-4 cursor-pointer">
                                    <LifestylePreferencesCard
                                        title="Northside"
                                        imageSrc="/northside_card.svg"
                                        isSelected={selectedLocation.includes("northside")}
                                        onClick={() => handleLocationToggle("northside")}
                                    />
                                    <LifestylePreferencesCard
                                        title="University Village"
                                        imageSrc="/uv_card.svg"
                                        isSelected={selectedLocation.includes("uv")}
                                        onClick={() => handleLocationToggle("uv")}
                                    />
                                    <LifestylePreferencesCard
                                        title="Canyon Creek"
                                        imageSrc="/canyon_creek_card.svg"
                                        isSelected={selectedLocation.includes("cc")}
                                        onClick={() => handleLocationToggle("cc")}
                                    />
                                    <LifestylePreferencesCard
                                        title="Freshmen Dorms"
                                        imageSrc="/freshman_dorms_card.svg"
                                        isSelected={selectedLocation.includes("freshman_dorms")}
                                        onClick={() => handleLocationToggle("freshman_dorms")}
                                    />
                                </div>

                                <p className="text-black text-sm font-bold mt-1 mb-2">
                                Are you an Honors student?
                                </p>
                                <div className="grid grid-cols-2 gap-4 mb-4 cursor-pointer">
                                    <LifestylePreferencesCard
                                        title="Yes, I am an Honors student"
                                        imageSrc="/honors_card.svg"
                                        isSelected={selectedHonorsStatus === true}
                                        onClick={() =>
                                            handleBooleanToggle(
                                                selectedHonorsStatus,
                                                setSelectedHonorsStatus,
                                                true,
                                            )
                                        }
                                    />
                                    <LifestylePreferencesCard
                                        title="No, I am not an Honors student"
                                        imageSrc="/not_honors_card.svg"
                                        isSelected={selectedHonorsStatus === false}
                                        onClick={() =>
                                            handleBooleanToggle(
                                                selectedHonorsStatus,
                                                setSelectedHonorsStatus,
                                                false,
                                            )
                                        }
                                    />
                                </div>

                                {showFreshmanSpecifics && (
                                    <>
                                        <p className="text-black text-sm mt-1 font-bold mb-2">
                                        Are you interested in being part of the Living Learning
                                        Community (LLC)?
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 mb-4 cursor-pointer">
                                            <LifestylePreferencesCard
                                                title="Yes, I would like to be a part of LLC"
                                                imageSrc="/llc_card.svg"
                                                isSelected={selectedLLCPreference === true}
                                                onClick={() =>
                                                    handleBooleanToggle(
                                                        selectedLLCPreference,
                                                        setSelectedLLCPreference,
                                                        true,
                                                    )
                                                }
                                            />
                                            <LifestylePreferencesCard
                                                title="No, I would not like to be a part of LLC"
                                                imageSrc="/not_honors_card.svg"
                                                isSelected={selectedLLCPreference === false}
                                                onClick={() =>
                                                    handleBooleanToggle(
                                                        selectedLLCPreference,
                                                        setSelectedLLCPreference,
                                                        false,
                                                    )
                                                }
                                            />
                                        </div>
                                    </>
                                )}

                                {showRoommateOptions && (
                                    <>
                                        <p className="text-black text-sm mt-1 font-bold mb-2">
                                        How many roommates is ideal?
                                        </p>
                                        <div className="grid grid-cols-4 gap-4 mb-4 cursor-pointer">
                                            <LifestylePreferencesCard
                                                title="No preference"
                                                imageSrc="/no_preference_roomate_card.svg"
                                                isSelected={selectedNumOfRoommates === "no_preference"}
                                                onClick={() =>
                                                    handleStringToggle(
                                                        selectedNumOfRoommates,
                                                        setSelectedNumOfRoommates,
                                                        "no_preference",
                                                    )
                                                }
                                            />
                                            <LifestylePreferencesCard
                                                title="One"
                                                imageSrc="/one_roomate_card.svg"
                                                isSelected={selectedNumOfRoommates === "one"}
                                                onClick={() =>
                                                    handleStringToggle(
                                                        selectedNumOfRoommates,
                                                        setSelectedNumOfRoommates,
                                                        "one",
                                                    )
                                                }
                                            />
                                            <LifestylePreferencesCard
                                                title="Two"
                                                imageSrc="/two_roomate_card.svg"
                                                isSelected={selectedNumOfRoommates === "two"}
                                                onClick={() =>
                                                    handleStringToggle(
                                                        selectedNumOfRoommates,
                                                        setSelectedNumOfRoommates,
                                                        "two",
                                                    )
                                                }
                                            />
                                            <LifestylePreferencesCard
                                                title="Three"
                                                imageSrc="/three_roomate_card.svg"
                                                isSelected={selectedNumOfRoommates === "three"}
                                                onClick={() =>
                                                    handleStringToggle(
                                                        selectedNumOfRoommates,
                                                        setSelectedNumOfRoommates,
                                                        "three",
                                                    )
                                                }
                                            />
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {housingIntent === "off_campus" && (
                            <>
                                <h1 className="text-black text-xl font-bold">Do you have a lease?</h1>
                                <p className="text-black text-sm mb-3 mt-2">
                                This will help us pair you with the right people.
                                </p>
                                <div className="grid grid-cols-2 gap-2 mb-4 cursor-pointer">
                                    <LifestylePreferencesCard
                                        title="I have a lease and need a roommate"
                                        imageSrc="/have_a_lease_card.svg"
                                        isSelected={selectedLeaseStatus === true}
                                        onClick={() =>
                                            handleBooleanToggle(
                                                selectedLeaseStatus,
                                                setSelectedLeaseStatus,
                                                true,
                                            )
                                        }
                                    />
                                    <LifestylePreferencesCard
                                        title="I do not have a lease"
                                        imageSrc="/do_not_have_a_lease_card.svg"
                                        isSelected={selectedLeaseStatus === false}
                                        onClick={() =>
                                            handleBooleanToggle(
                                                selectedLeaseStatus,
                                                setSelectedLeaseStatus,
                                                false,
                                            )
                                        }
                                    />
                                </div>

                                <h1 className="text-black text-xl font-bold">Duration:</h1>
                                <p className="text-black text-sm mb-3 mt-2">
                                    {selectedLeaseStatus
                                        ? "Pick the option that best matches how long you are looking to lease for."
                                        : "Pick the option that best matches how long the roommate would stay."}
                                </p>
                                <div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer">
                                    <LifestylePreferencesCard
                                        title="Semester"
                                        imageSrc="/semester_card.svg"
                                        isSelected={selectedHaveLeaseLength === "semester"}
                                        onClick={() =>
                                            handleStringToggle(
                                                selectedHaveLeaseLength,
                                                setSelectedHaveLeaseLength,
                                                "semester",
                                            )
                                        }
                                    />
                                    <LifestylePreferencesCard
                                        title="Academic Year"
                                        imageSrc="/academic_year_card.svg"
                                        isSelected={selectedHaveLeaseLength === "academic_year"}
                                        onClick={() =>
                                            handleStringToggle(
                                                selectedHaveLeaseLength,
                                                setSelectedHaveLeaseLength,
                                                "academic_year",
                                            )
                                        }
                                    />
                                    <LifestylePreferencesCard
                                        title="Year"
                                        imageSrc="/year_card.svg"
                                        isSelected={selectedHaveLeaseLength === "year"}
                                        onClick={() =>
                                            handleStringToggle(
                                                selectedHaveLeaseLength,
                                                setSelectedHaveLeaseLength,
                                                "year",
                                            )
                                        }
                                    />
                                </div>

                                {selectedLeaseStatus ? (
                                    <>
                                        <h1 className="text-black text-xl font-bold">Monthly Rent:</h1>
                                        <p className="text-black text-sm mb-3 mt-2">
                                        How much are you charging for the room? (This does NOT
                                        consider utilities)
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h1 className="text-black text-xl font-bold">Budget:</h1>
                                        <p className="text-black text-sm mb-3 mt-2">
                                        What is your preferred monthly rent budget?
                                        </p>
                                    </>
                                )}

                                <PriceRangeSlider
                                    minValue={selectedBudgetMin ?? 600}
                                    maxValue={selectedBudgetMax ?? 1400}
                                    onMinChange={setSelectedBudgetMin}
                                    onMaxChange={setSelectedBudgetMax}
                                    min={0}
                                    max={2000}
                                />
                            </>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}