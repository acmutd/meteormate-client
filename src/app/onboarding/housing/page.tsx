"use client";

import {useEffect, useState} from "react";
import LifestylePreferencesCard from "@/components/LifestylePreferencesCard";
import DoneButton from "@/components/DoneButton";
import ProgressHeader from "@/components/ProgressHeader";
import React, {useMemo} from "react";
import {useSearchParams, useRouter} from "next/navigation";
import {loadOnboardingData, updateOnboardingData, clearOnboardingData} from "@/utils/onboardingStorage";
import {getAuth} from "firebase/auth";
import PriceRangeSlider from "@/components/PriceRangeSlider";
import Image from "next/image";

const sendOnboardingData = async () => {
    try {
        const data = loadOnboardingData();
        const body = JSON.stringify(data)
        // console.log("body:", body)
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const token = await user.getIdToken();
            // console.log("bearer token: ", token)
            const response = await fetch("http://localhost:8000/api/survey", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: body,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            clearOnboardingData();
            return true
        } else {
            throw new Error("User not currently signed in.");
        }
        // console.log(body)
    } catch (error) {
        if (error instanceof Error) {
            console.error("Failed to send onboarding data:", error.message);
        } else {
            console.error("An unexpected error occurred:", error);
        }
        return false
    }
}

function OnCampusUI() {
    const router = useRouter();
    const handleNextStep = async () => {
        const success = await sendOnboardingData()
        if (success) {
            router.push("/onboarding/dashboard");
        } else {
            console.log("Something went wrong with the survey")
        }
    };

    const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
    const [selectedHonorsStatus, setSelectedHonorsStatus] = useState<boolean | null>(
        null
    );
    const [selectedLLCPreference, setSelectedLLCPreference] = useState<boolean | null>(
        null
    );
    const [selectedNumOfRoommates, setSelectedNumOfRoommates] = useState<string | null>(
        null
    );

    const [hydrated, setHydrated] = useState(false);

    useEffect(() => { // loading it once and the next use effect for the changes made and keeping track
        const saved = loadOnboardingData();
        updateOnboardingData({
            have_lease_length: "academic_year"
        })
        if (Array.isArray(saved.on_campus_locations)) {
            setSelectedLocation(saved.on_campus_locations);
        }
        setSelectedHonorsStatus(saved.honors ?? null);
        setSelectedLLCPreference(saved.llc_interest ?? null);
        setSelectedNumOfRoommates(saved.num_roommates ?? null);

        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        updateOnboardingData({
            on_campus_locations: selectedLocation,
            honors: selectedHonorsStatus,
            llc_interest: selectedLLCPreference,
            num_roommates: selectedNumOfRoommates
        });
    }, [
        hydrated,
        selectedLocation,
        selectedHonorsStatus,
        selectedLLCPreference,
        selectedNumOfRoommates
    ]);

    const handleLocationToggle = (value: string) => {
        let newLocations;
        if (selectedLocation.includes(value)) {
            newLocations = selectedLocation.filter((item) => item !== value);
        } else {
            newLocations = [...selectedLocation, value];
        }

        setSelectedLocation(newLocations);
        // check if we need to reset freshman specific data
        if (!newLocations.includes("freshman_dorms")) {
            setSelectedLLCPreference(null);
        }

        // check if we need to reset roommate data
        const hasRoommateLocation = newLocations.some(loc =>
            ["northside", "cc", "uv"].includes(loc)
        );

        if (!hasRoommateLocation) {
            setSelectedNumOfRoommates(null);
        }
    };

    const handleBooleanToggle = (
        currentValue: boolean | null,
        setValue: (val: boolean | null) => void,
        newValue: boolean
    ) => {
        if (currentValue === newValue) {
            setValue(null);
        } else {
            setValue(newValue);
        }
    };

    const handleToggle = (
        currentValue: string | null,
        setValue: (val: string | null) => void,
        newValue: string
    ) => {
        if (currentValue === newValue) {
            setValue(null);
        } else {
            setValue(newValue);
        }
    };

    // only freshman dorms selected shows LLC
    const showFreshmanSpecifics = selectedLocation.includes("freshman_dorms");
    // northside, cc, or uv
    const showRoommateOptions = selectedLocation.includes("northside") || selectedLocation.includes("cc") || selectedLocation.includes("uv");

    return (
        <div>
            <ProgressHeader 
				title="On-Campus"
				subtitle="Help us find your ideal roommate by selecting your preferences!"
				currentStep={5}
			/>
			<div className="py-8 px-15 w-full flex flex-col">
				<p className="text-black text-sm font-bold mt-1 mb-2">
					Location: Northside, UV, CC, or Freshmen dorms?
				</p>
				{/*grid for the 3 options*/}
				<div className="grid grid-cols-4 gap-2 mb-4 cursor-pointer">
					<LifestylePreferencesCard
						title="Northside"
						imageSrc="/houses.webp" //need to change this
						isSelected={selectedLocation.includes("northside")}
						onClick={() => handleLocationToggle("northside")}
					/>
					<LifestylePreferencesCard
						title="University Village"
						imageSrc="/houses.webp" //need to change this
						isSelected={selectedLocation.includes("uv")}
						onClick={() => handleLocationToggle("uv")}
					/>
					<LifestylePreferencesCard
						title="Canyon Creek"
						imageSrc="/houses.webp" //need to change this
						isSelected={selectedLocation.includes("cc")}
						onClick={() => handleLocationToggle("cc")}
					/>
					<LifestylePreferencesCard
						title="Freshmen Dorms"
						imageSrc="/3D-buildings.webp" // change this
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
						imageSrc="/badge.webp"
						isSelected={selectedHonorsStatus === true}
						onClick={() => handleBooleanToggle(selectedHonorsStatus, setSelectedHonorsStatus, true)}
					/>
					<LifestylePreferencesCard
						title="No, I am not an Honors student"
						imageSrc="/study.webp"
						isSelected={selectedHonorsStatus === false}
						onClick={() => handleBooleanToggle(selectedHonorsStatus, setSelectedHonorsStatus, false)}
					/>

				</div>

				{showFreshmanSpecifics && (
					<>
						<p className="text-black text-sm mt-1 font-bold mb-2">
							Are you interested in being part of the Living Learning Community (LLC)?
						</p>
						<div className="grid grid-cols-2 gap-4 mb-4 cursor-pointer">
							<LifestylePreferencesCard
								title="Yes, I would like to be a part of LLC"
								imageSrc="/environment.webp"
								isSelected={selectedLLCPreference === true}
								onClick={() => handleBooleanToggle(selectedLLCPreference, setSelectedLLCPreference, true)}
							/>
							<LifestylePreferencesCard
								title="No, I would not like to be a part of LLC"
								imageSrc="/reading-book.webp"
								isSelected={selectedLLCPreference === false}
								onClick={() => handleBooleanToggle(selectedLLCPreference, setSelectedLLCPreference, false)}
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
								imageSrc="/environment.webp" // need to change
								isSelected={selectedNumOfRoommates === "no_preference"}
								onClick={() => handleToggle(selectedNumOfRoommates, setSelectedNumOfRoommates, "no_preference")}
							/>
							<LifestylePreferencesCard
								title="One"
								imageSrc="/reading-book.webp" // need to change
								isSelected={selectedNumOfRoommates === "one"}
								onClick={() => handleToggle(selectedNumOfRoommates, setSelectedNumOfRoommates, "one")}
							/>
							<LifestylePreferencesCard
								title="Two"
								imageSrc="/reading-book.webp" // need to change
								isSelected={selectedNumOfRoommates === "two"}
								onClick={() => handleToggle(selectedNumOfRoommates, setSelectedNumOfRoommates, "two")}
							/>
							<LifestylePreferencesCard
								title="Three"
								imageSrc="/reading-book.webp" // need to change
								isSelected={selectedNumOfRoommates === "three"}
								onClick={() => handleToggle(selectedNumOfRoommates, setSelectedNumOfRoommates, "three")}
							/>
							
						</div>
					</>
				)}
            </div>
			<div className="flex items-center justify-center">
            <DoneButton
                                className="mt-7"
                                logo={<Image src="/peechi_duo.webp" alt="Peechi mascot"/>}
                                onClick={handleNextStep}
								disabled = {
									!selectedLocation ||
									selectedLocation.length === 0 ||
									(showFreshmanSpecifics && (selectedLLCPreference === null || selectedHonorsStatus === null)) ||
									(showRoommateOptions && !selectedNumOfRoommates)
								}
                            />
    		</div>
        </div>
    );
}

function OffCampusUI() {
    const router = useRouter();
    const handleNextStep = async () => {
        const success = await sendOnboardingData()
        if (success) {
            router.push("/onboarding/dashboard");
        } else {
            console.log("Something went wrong with the survey")
        }
    };

    const [selectedLeaseStatus, setSelectedLeaseStatus] = useState<boolean | null>(
        null
    );
    const [selectedHaveLeaseLength, setSelectedHaveLeaseLength] = useState<string | null>(
        null
    );
    const [selectedBudgetMin, setSelectedBudgetMin] = useState<number | null>(
        null
    );
    const [selectedBudgetMax, setSelectedBudgetMax] = useState<number | null>(
        null
    );

    const [hydrated, setHydrated] = useState(false);

    useEffect(() => { // loading it once and the next use effect for the changes made and keeping track
        const saved = loadOnboardingData();
        setSelectedLeaseStatus(saved.have_lease ?? null);
        setSelectedHaveLeaseLength(saved.have_lease_length ?? null);
        setSelectedBudgetMin(saved.budget_min ?? null);
        setSelectedBudgetMax(saved.budget_max ?? null);


        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        updateOnboardingData({
            have_lease: selectedLeaseStatus,
            have_lease_length: selectedHaveLeaseLength,
            budget_min: selectedBudgetMin,
            budget_max: selectedBudgetMax,
        });
    }, [
        hydrated,
        selectedLeaseStatus,
        selectedHaveLeaseLength,
        selectedBudgetMin,
        selectedBudgetMax
    ]);

    const handleToggle = (
        currentValue: string | null,
        setValue: (val: string | null) => void,
        newValue: string
    ) => {
        if (currentValue === newValue) {
            setValue(null);
        } else {
            setValue(newValue);
        }
    }

    const handleBooleanToggle = (
        currentValue: boolean | null,
        setValue: (val: boolean | null) => void,
        newValue: boolean
    ) => {
        if (currentValue === newValue) {
            setValue(null);
        } else {
            setValue(newValue);
        }
    };

    return (
        <div>
            <ProgressHeader
                title="Off Campus"
                subtitle="Help us find your ideal roommate by selecting your preferences!"
                currentStep={5}
            />
            <div className="py-8 px-15 w-full flex flex-col">
                <h1 className="text-black text-xl font-bold">Do you have a lease?</h1>
                <p className="text-black text-sm mb-3 mt-2">
					This will help us pair you with the right people.
				</p>
				{/*grid for the 3 options*/}
				<div className="grid grid-cols-2 gap-2 mb-4 cursor-pointer">
					<LifestylePreferencesCard
						title="I have a lease and need a roommate"
						imageSrc="/houses.webp" //need to change this
						isSelected={selectedLeaseStatus === true}
						onClick={() => handleBooleanToggle(selectedLeaseStatus, setSelectedLeaseStatus, true)}
					/>
					<LifestylePreferencesCard
						title="I do not have a lease"
						imageSrc="/3D-buildings.webp" // change this
						isSelected={selectedLeaseStatus === false}
						onClick={() => handleBooleanToggle(selectedLeaseStatus, setSelectedLeaseStatus, false)}
					/>

				</div>

				<h1 className="text-black text-xl font-bold">Duration: </h1>
				<p className="text-black text-sm mb-3 mt-2">
					{selectedLeaseStatus
						? "Pick the option that best matches how long you are looking to lease for."
						: "Pick the option that best matches how long the roommate would stay."
					}
				</p>
				<div className="grid grid-cols-3 gap-4 mb-4 cursor-pointer">
					<LifestylePreferencesCard
						title="Semester"
						imageSrc="/badge.webp"
						isSelected={selectedHaveLeaseLength === "semester"}
						onClick={() => handleToggle(selectedHaveLeaseLength, setSelectedHaveLeaseLength, "semester")
						}
					/>
					<LifestylePreferencesCard
						title="Academic Year"
						imageSrc="/study.webp"
						isSelected={selectedHaveLeaseLength === "academic_year"}
						onClick={() => handleToggle(selectedHaveLeaseLength, setSelectedHaveLeaseLength, "academic_year")
						}
					/>
					<LifestylePreferencesCard
						title="Year"
						imageSrc="/study.webp"
						isSelected={selectedHaveLeaseLength === "year"}
						onClick={() => handleToggle(selectedHaveLeaseLength, setSelectedHaveLeaseLength, "year")
						}
					/>
					
				</div>
				{selectedLeaseStatus && (
					<>
						<h1 className="text-black text-xl font-bold">Monthly Rent: </h1>
						<p className="text-black text-sm mb-3 mt-2">
							How much are you charging for the room? (This does NOT consider utilities)
						</p>
					</>
				)}
				{!selectedLeaseStatus && (
					<>
						<h1 className="text-black text-xl font-bold">Budget: </h1>
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
				
				
            </div>
            <div className="flex items-center justify-center">
                <DoneButton
                    className="mt-7"
                    logo={<Image src="/images/peechi_duo.webp" alt="Peechi mascot"/>}
                    onClick={handleNextStep}
                    disabled={!selectedHaveLeaseLength || selectedLeaseStatus === null}

                />
            </div>
        </div>
    );
}

export default function HousingPage() {

    const router = useRouter();
    const searchParams = useSearchParams();

    const living = useMemo(
        () => searchParams.get("living") ?? "",
        [searchParams]
    );

    useEffect(() => {
        const saved = loadOnboardingData()
        console.log(saved)
    })

    return (
        <div className="p-6">
            {living === "on_campus" ? (
                <OnCampusUI/>
            ) : living === "off_campus" ? (
                <OffCampusUI/>
            ) : (
                <div>
                    <p className="text-red-600 text-sm">
                        No living preference passed. Please go back and select one.
                    </p>
                    <button
                        className="mt-4 px-4 py-2 rounded-lg border"
                        onClick={() => router.back()}
                    >
                        Go back
                    </button>
                </div>


            )}

        </div>
    );
}
