"use client";

import { useState } from "react";
import LifestylePreferencesCard from "../../../../components/LifestylePreferencesCard";
import DoneButton from "../../../../components/DoneButton";
import ProgressHeader from "../../../../components/ProgressHeader";
import React, { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";



function OnCampusUI() {
	const router = useRouter();
	const handleNextStep = () => {
		router.push("/onboarding/dashboard");
	};

    const [selectedLocation, setSelectedLocation] = useState<string | null>(
        null
    );
    const [selectedHonorsStatus, setSelectedHonorsStatus] = useState<string | null>(
        null
    );
    const [selectedLLCPreference, setSelectedLLCPreference] = useState<
        string | null
    >(null);
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

    return (
        <div>
            <ProgressHeader 
				title="On Campus"
				subtitle="Help us find your ideal roommate by selecting your preferences!"
				currentStep={5}
			/>
			<div className="py-8 px-15 w-full flex flex-col">
				<p className="text-black text-sm font-bold mt-1 mb-2">
					Location: UV or Freshmen Dorms?
				</p>
				{/*grid for the 3 options*/}
				<div className="grid grid-cols-2 gap-2 mb-4 cursor-pointer">
					<LifestylePreferencesCard
						title="University Village"
						imageSrc="/images/houses.webp" //need to change this
						isSelected={selectedLocation === "UV"}
						onClick={() => handleToggle(selectedLocation, setSelectedLocation, "UV")}
					/>
					<LifestylePreferencesCard
						title="Freshmen Dorms"
						imageSrc="/images/3D-buildings.webp" // change this
						isSelected={selectedLocation === "FD"}
						onClick={() => handleToggle(selectedLocation, setSelectedLocation, "FD")}
					/>
					
				</div>
				
				<p className="text-black text-sm font-bold mt-1 mb-2">
					Are you an Honors student?
				</p>
				<div className="grid grid-cols-2 gap-4 mb-4 cursor-pointer"> 
					<LifestylePreferencesCard
						title="Yes, I am an honors student"
						imageSrc="/images/badge.webp"
						isSelected={selectedHonorsStatus === "yes"}
						onClick={() => handleToggle(selectedHonorsStatus, setSelectedHonorsStatus, "yes")}
					/>
					<LifestylePreferencesCard
						title="No, I am not an honors student"
						imageSrc="/images/study.webp"
						isSelected={selectedHonorsStatus === "no"}
						onClick={() => handleToggle(selectedHonorsStatus, setSelectedHonorsStatus, "no")}
					/>
					
				</div>
				
				<p className="text-black text-sm mt-1 font-bold mb-2">
					Are you interested in being part of the Living Learning Community?
				</p>
				<div className="grid grid-cols-2 gap-4 mb-4 cursor-pointer">
					<LifestylePreferencesCard
						title="Yes, I would like to be a part of LLC"
						imageSrc="/images/environment.webp"
						isSelected={selectedLLCPreference === "Yes"}
						onClick={() => handleToggle(selectedLLCPreference, setSelectedLLCPreference, "Yes")}
					/>
					<LifestylePreferencesCard
						title="No, I would not like to be a part of LLC"
						imageSrc="/images/reading-book.webp"
						isSelected={selectedLLCPreference === "No"}
						onClick={() => handleToggle(selectedLLCPreference, setSelectedLLCPreference, "No")}
					/>
					
				</div>
            </div>
			<div className="flex items-center justify-center">
            <DoneButton
                                className="mt-7"
                                logo={<img src="/images/peechi_duo.webp" />}
                                onClick={handleNextStep}
								disabled = {!selectedLLCPreference || !selectedHonorsStatus || !selectedLocation}
								
                            />
    		</div>
        </div>
  );
}

function OffCampusUI() {
	const router = useRouter();
	const handleNextStep = () => {
		router.push("/onboarding/dashboard");
	};

    const [selectedLeaseStatus, setSelectedLeaseStatus] = useState<string | null>(
        null
    );
    const [selectedFindingPreference, setSelectedFindingPreference] = useState<
        string | null
    >(null);

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
						imageSrc="/images/houses.webp" //need to change this
						isSelected={selectedLeaseStatus === "yes"}
						onClick={() => handleToggle(selectedLeaseStatus, setSelectedLeaseStatus, "yes")}
					/>
					<LifestylePreferencesCard
						title="I do not have a lease"
						imageSrc="/images/3D-buildings.webp" // change this
						isSelected={selectedLeaseStatus === "no"}
						onClick={() => handleToggle(selectedLeaseStatus, setSelectedLeaseStatus, "no")}
					/>
					
				</div>
				
				<h1 className="text-black text-xl font-bold">Have a lease: </h1>
                <p className="text-black text-sm mb-3 mt-2">
					Pick the option that best matches how long the roommate would stay.
				</p>
				<div className="grid grid-cols-2 gap-4 mb-4 cursor-pointer"> 
					<LifestylePreferencesCard
						title="I am looking to offer the room temporarily"
						imageSrc="/images/badge.webp"
						isSelected={selectedFindingPreference === "temp"}
						onClick={() => handleToggle(selectedFindingPreference, setSelectedFindingPreference, "temp")}
					/>
					<LifestylePreferencesCard
						title="I am looking to offer the room for long-term"
						imageSrc="/images/study.webp"
						isSelected={selectedFindingPreference === "LongTerm"}
						onClick={() => handleToggle(selectedFindingPreference, setSelectedFindingPreference, "LongTerm")}
					/>
					
				</div>
				
				
            </div>
			<div className="flex items-center justify-center">
            <DoneButton
                                className="mt-7"
                                logo={<img src="/images/peechi_duo.webp" />}
                                onClick={handleNextStep}
								disabled = {!selectedFindingPreference || !selectedLeaseStatus}
								
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

  
  return (
    <div className="p-6">
      {living === "onCampus" ? (
        <OnCampusUI />
      ) : living === "offCampus" ? (
        <OffCampusUI />
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
