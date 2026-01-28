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
            className="flex flex-col items-start gap-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:border-orange-500/30 hover:bg-white/10 transition-all duration-300 group">
            {/* Icon Container - Fixed height, flex centered */}
            <div
                className="relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-xl p-3 group-hover:scale-105 transition-transform">
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-2"
                />
            </div>

            <div className="space-y-2">
                <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default function HowItWorks() {
    // Removed width/height from data array
    const features: FeatureCardProps[] = [
        {
            imageSrc: "/L1.webp", // Updated from original code reference
            imageAlt: "AI Powered Matchmaking",
            title: "AI Powered Matchmaking",
            description:
                "Our algorithm weighs lifestyle, cleanliness, and personality traits to find the roommate that actually fits your day-to-day.",
        },
        {
            imageSrc: "/L2.webp",
            imageAlt: "Data Driven Insights",
            title: "Data Driven Insights",
            description:
                "Compare potential roommates with compatibility scores and metrics that make the decision simple.",
        },
        {
            imageSrc: "/L3.webp",
            imageAlt: "Multistep Verification",
            title: "Multistep Verification",
            description:
                "School email plus optional social verification helps ensure everyone on the platform is a real UTD student.",
        },
        {
            imageSrc: "/L4.webp",
            imageAlt: "Privacy First",
            title: "Privacy First",
            description:
                "You’re always in control of what you share. Reveal more details only when you’re comfortable.",
        },
        {
            imageSrc: "/L5.webp",
            imageAlt: "Personalized Matchmaking",
            title: "Swipe-based Matching",
            description:
                "A Tinder-style interface with detailed profiles makes finding your roommate feel familiar and low-friction.",
        },
        {
            imageSrc: "/L6.webp",
            imageAlt: "Social Integration",
            title: "Social Integration",
            description:
                "Optionally connect socials to add another layer of signal for compatibility and verification.",
        },
    ];

    return (
        <LandingSection
            id="howItWorks"
            className="w-full bg-black bg-cover bg-center bg-no-repeat py-24 md:py-32"
            style={{backgroundImage: `url('/stars.webp')`}}
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 space-y-4">
          <span
              className="inline-block py-1 px-3 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-medium tracking-wider uppercase">
            Features
          </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Built for <span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-200">Comets</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                        Everything you need to find your perfect match, verified and secure.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </LandingSection>
    );
}
