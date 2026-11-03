"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import LandingSection from "./LandingSection";
import { GraduationCap, Heart, Shield, Users, Filter, Phone } from 'lucide-react'; // Or your icon library

const features = [
  { icon: GraduationCap, title: 'Built for UTD Students' },
  { icon: Heart, title: 'Make lasting connections' },
  { icon: Shield, title: 'Safe & Verified' },
  { icon: Users, title: 'Lifestyle Compatibility' },
  { icon: Filter, title: 'Smart Filters That Idk...' },
  { icon: Phone, title: 'Real Conversations' },
];

export default function GetStarted() {
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false);

    return (
        <LandingSection
            id="getStarted"
            className="min-h-screen text-white flex flex-col items-center justify-center"
        >
            <div className="flex flex-col items-center">
                <p className="text-3xl font-light">* more than just a match</p>
                <h3 className="outfit-bold text-6xl">Find The <span className="bg-[linear-gradient(90deg,#FF9100_23.08%,#FFC94C_65.87%)] bg-clip-text text-transparent">Perfect</span> Roommate</h3>
                <p className="text-3xl font-light text-center w-240">Whether you’re an early bird or a night owl, a neat freak or a cozy creative. MeteorMate will help you find someone who fits your vibe.</p>
            </div>

            {/*Grid for features*/}
            <div className="text-white p-12">
                <div className="grid grid-cols-1 md:grid-cols-3">
                    {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <div
                        key={index}
                        className={`
                            flex flex-col items-center justify-center p-8 text-center bg-black
                            border-gray-800
                            /* Vertical divider lines between columns (except the last column on desktop) */
                            md:[&:not(:nth-child(3n))]:border-r
                            /* Horizontal divider lines between rows (except the last row) */
                            [&:not(:nth-last-child(-n+3))]:border-b
                        `}
                        >
                        <Icon className="w-12 h-12 text-amber-500 mb-6" />
                        <p className="text-xl font-medium max-w-[200px]">{feature.title}</p>
                        </div>
                    );
                    })}
                </div>
            </div>

            {/* Button for start your search */}
            <div className="flex justify-center items-center">
                <button
                    onClick={() => {
                        if (!isNavigating) {
                            setIsNavigating(true);
                            router.push("/authentication/createAccount");
                        }
                    }}
                    disabled={isNavigating}
                    className="outfit-regular text-xl text-black w-[234px] h-[66px] rounded-[16px] border border-[#FFAA64] bg-gradient-to-r from-[#FF9100] via-[#FF9100] via-[35.1%] to-[#FFC94C] [background-clip:padding-box] bg-gradient-to-br from-primary to-secondary hover:opacity-80 transition-opacity duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isNavigating && <LoadingSpinner size="sm" />}
                    Start Your Search!
                </button>
            </div>
        </LandingSection>
    );
}
