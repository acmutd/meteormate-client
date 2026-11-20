"use client"
import LandingPageMatchCard from "@/components/cardComponent/LandingPageMatchCard";


export default function Test () {
    return (
        <div>
            <br />
            <br />
            <br />
            <br />

            <LandingPageMatchCard
            name="Amelia B."
            initials="AB"
            major="Computer Science"
            onCampus={true}
            sleepSchedule="earlybird"
            budgetMin={1800}
            budgetMax={1200}
            matchPercent={74}
            />
        </div>
)

}