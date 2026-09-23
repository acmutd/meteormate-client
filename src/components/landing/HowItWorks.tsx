"use client";
import Image from "next/image";
import LandingSection from "./LandingSection";

interface FeatureCardProps {
    imageSrc: string;
    imageAlt: string;
    title: string;
    description: string;
    // Removed imageWidth/Height from props to enforce CSS sizing
}

function FeatureCard({
    imageSrc,
    imageAlt,
    title,
    description,
}: FeatureCardProps) {
    return (
        <div
            className="font-[family-name:var(--font-outfit)] w-80 h-100 rounded-2xl border border-transparent bg-[linear-gradient(#1A1919,#1A1919),radial-gradient(46.34%_46.47%_at_49.53%_53.53%,#F8E1CB_0%,#FCD59F_100%)] [background-clip:padding-box,border-box] [background-origin:border-box] flex flex-col items-start gap-5 p-6 transition-all duration-300 group align-middle">
            {/* Icon Container - Fixed height, flex centered */}
            <div
                className="relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-xl p-3 group-hover:scale-105 transition-transform">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-[#FF9100] to-[#FFC94C] font-bold text-white shadow-md text-xl">
                    <p>1</p>
                </div>
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-2"
                />
            </div>
        
            <div className="space-y-2">
                <h3 className="outfit text-center text-2xl font-medium text-white group-hover:text-primary transition-colors">
                    {title}
                </h3>
                <p className="outfit font-light text-[#EEEEEE] text-center">
                    {description}
                </p>
            </div>
            <div className="-z-9 absolute top-10/4 -left-[10%] h-32 w-[120%] rotate-18 bg-gradient-to-r from-transparent via-orange-500/40 to-transparent blur-2xl"></div>
                <div className="-z-9 absolute -bottom-500 -right-20 h-[500px] w-[500px] rounded-full bg-radial from-amber-500/60 via-orange-600/20 to-transparent blur-3xl"></div>
                <div className="-z-9 absolute -bottom-450 -left-10 h-64 w-64 rounded-full bg-radial from-amber-500/50 via-orange-600/20 to-transparent blur-2xl"></div>
                <div className="-z-9 absolute top-5/4 -left-70 h-12 -rotate-5 w-256 bg-gradient-to-r from-transparent via-orange-500/40 to-transparent blur-xl pointer-events-none"></div>
                <div className="-z-9 absolute top-7/4 -right-70 h-12 w-256 -rotate-18 bg-gradient-to-r from-transparent via-orange-500/40 to-transparent blur-xl pointer-events-none"></div>
        </div>
    );
}

export default function HowItWorks() {
    // Removed width/height from data array
    const features: FeatureCardProps[] = [
        {
            imageSrc: "/L1.webp", // Updated from original code reference
            imageAlt: "AI Powered Matchmaking",
            title: "Create Your Profile",
            description:
                "Tell us about your lifestyle, preferences, and what you’re looking for.",
        },
        {
            imageSrc: "/L2.webp",
            imageAlt: "Data Driven Insights",
            title: "We Matchmake",
            description:
                "Our algorithm analyzes compatibility and finds your best match.",
        },
        {
            imageSrc: "/L3.webp",
            imageAlt: "Multistep Verification",
            title: "You Chat",
            description:
                "Reach out via email, get to know each other, and find your perfect roommate!",
        },
    ];

    return (
        <LandingSection
            id="howItWorks"
            className="w-full py-24 md:py-32"
            
        >
            
            <div className="mb-12 text-center text-white">
                <h2 className="outfit-bold text-7xl font-bold mb-4 font-outfit extra-bold">How MeteorMate Works</h2>
                <p className="outfit font-light text-3xl font-inter">
                    You're just a few steps away from finding your perfect match
                </p>
            </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 justify-self-center">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>

        </LandingSection>
    );
}
