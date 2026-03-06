"use client";

import { useEffect, useState } from "react";
import LifestylePreferencesCard from "@/components/LifestylePreferencesCard";
import PriceRangeSlider from "@/components/PriceRangeSlider";
import { useToast } from "@/components/ui/ToastProvider";
import {
    loadOnboardingData,
    updateOnboardingData,
} from "@/utils/onboardingStorage";

export default function HousingPage() {
    const { toast } = useToast();
    const [selectedLivingPreference, setSelectedLivingPreference] = useState<
        string | null
    >(null);

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

    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const saved = loadOnboardingData();

        setSelectedLivingPreference(saved.housing_intent ?? null);

        if (Array.isArray(saved.on_campus_locations)) {
            setSelectedLocation(saved.on_campus_locations);
        }
        setSelectedHonorsStatus(saved.honors ?? null);
        setSelectedLLCPreference(saved.llc_interest ?? null);
        setSelectedNumOfRoommates(saved.num_roommates ?? null);

        setSelectedLeaseStatus(saved.have_lease ?? null);
        setSelectedHaveLeaseLength(saved.have_lease_length ?? null);

        const min = saved.budget_min ?? 600;
        const max = saved.budget_max ?? 1400;
        setSelectedBudgetMin(min);
        setSelectedBudgetMax(max);

        setHydrated(true);
    }, []);

    const handleUpdateProfile = () => {
        if (!hydrated) return;

        // Keep required field populated when on-campus is selected.
        const leaseLength =
            selectedLivingPreference === "on_campus"
                ? "academic_year"
                : selectedHaveLeaseLength;

        updateOnboardingData({
            housing_intent: selectedLivingPreference,
            on_campus_locations: selectedLocation,
            honors: selectedHonorsStatus,
            llc_interest: selectedLLCPreference,
            num_roommates: selectedNumOfRoommates,
            have_lease: selectedLeaseStatus,
            have_lease_length: leaseLength,
            budget_min: selectedBudgetMin,
            budget_max: selectedBudgetMax,
        });

        toast({
            type: "success",
            title: "Profile updated",
            description: "Your housing preferences were saved.",
        });
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

    return (
        <div
            className="flex flex-col justify-center items-center relative"
            style={{
                backgroundImage: "url('/stars_orange.svg')",
                backgroundSize: "cover",
            }}
        >
            <div className="w-[76%] max-h-192 bg-[#FFFFFF] rounded-2xl shadow-2xl flex flex-col">
                <div className="text-center mt-2 shrink-0">
                    <p className="text-3xl font-bold">Housing</p>
                    <p className="text-center text-md text-gray-600">
                        Help us find your ideal roommate by selecting your housing
                        preferences!
                    </p>
                </div>

                <div className="py-8 px-15 w-full flex flex-col overflow-y-auto flex-1 custom-scrollbar">
                    <h1 className="text-black text-xl font-bold">Living Preference</h1>
                    <p className="text-black text-sm mt-1 mb-2">
                        Do you plan on living on-campus or off-campus?
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-6 cursor-pointer">
                        <LifestylePreferencesCard
                            title="On-Campus"
                            imageSrc="/on_campus_card.svg"
                            isSelected={selectedLivingPreference === "on_campus"}
                            onClick={() =>
                                handleStringToggle(
                                    selectedLivingPreference,
                                    setSelectedLivingPreference,
                                    "on_campus",
                                )
                            }
                        />
                        <LifestylePreferencesCard
                            title="Off-Campus"
                            imageSrc="/off_campus_card.svg"
                            isSelected={selectedLivingPreference === "off_campus"}
                            onClick={() =>
                                handleStringToggle(
                                    selectedLivingPreference,
                                    setSelectedLivingPreference,
                                    "off_campus",
                                )
                            }
                        />
                    </div>

                    {selectedLivingPreference === "on_campus" && (
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

                    {selectedLivingPreference === "off_campus" && (
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

                    <div className="flex justify-center mt-8">
                        <button
                            type="button"
                            onClick={handleUpdateProfile}
                            className="px-6 py-2 rounded-lg text-black font-medium shadow bg-linear-60 from-[#F28C00] to-[#FFC243] hover:from-[#d97706] hover:to-[#f59e0b] hover:shadow-md transition-all duration-200"
                        >
                            Update Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}