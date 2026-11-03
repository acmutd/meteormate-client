"use client";
import Image from "next/image";
import LandingSection from "./LandingSection";

interface FeatureCardProps {
    number: number;
    icon: "profile" | "match" | "chat";
    title: string;
    description: string;
    connectNext?: boolean;
}

function FeatureIcon({ icon }: { icon: FeatureCardProps["icon"] }) {
    const iconSrc = {
        profile: "/profile.svg",
        match: "/meteor.svg",
        chat: "/chat.svg",
    }[icon];

    return (
        <Image
            src={iconSrc}
            alt=""
            aria-hidden="true"
            width={90}
            height={90}
            className="h-[90px] w-[90px] object-contain"
        />
    );
}

function FeatureCard({
    number,
    icon,
    title,
    description,
    connectNext = false,
}: FeatureCardProps) {
    return (
        <div
            className={`group relative z-10 flex h-[323px] w-[250px] flex-col items-center rounded-[10px] border-[0.8px] border-transparent bg-[linear-gradient(#1A1919,#1A1919),radial-gradient(46.34%_46.47%_at_49.53%_53.53%,#F8E1CB_0%,#FCD59F_100%)] [background-clip:padding-box,border-box] [background-origin:border-box] px-5 pt-[14px] text-center font-[family-name:var(--font-outfit)] transition-colors duration-300 hover:bg-[linear-gradient(#211F1C,#211F1C),radial-gradient(46.34%_46.47%_at_49.53%_53.53%,#F8E1CB_0%,#FCD59F_100%)] ${
                connectNext
                    ? "after:absolute after:left-full after:top-1/2 after:hidden after:h-[3px] after:w-[76px] after:bg-gradient-to-r after:from-[#FF9100]/30 after:to-[#FFC94C]/30 after:content-[''] lg:after:block"
                    : ""
            }`}
        >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(90deg,#FF9100_57.21%,#FFC94C_100%)] font-[family-name:var(--font-orelega-one)] text-base font-bold leading-none text-white">
                {number}
            </div>
            <div className="mt-4 flex h-[130px] w-[130px] shrink-0 items-center justify-center rounded-full border border-[#29251F] bg-[#201E1A] transition-transform duration-300 group-hover:scale-105">
                <FeatureIcon icon={icon} />
            </div>
            <div className="mt-4 space-y-2">
                <h3 className="text-center text-2xl font-medium text-white transition-colors group-hover:text-primary">
                    {title}
                </h3>
                <p className="text-center text-sm font-light leading-[19px] text-[#EEEEEE]">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default function HowItWorks() {
    const features: FeatureCardProps[] = [
        {
            number: 1,
            icon: "profile",
            title: "Create Your Profile",
            description:
                "Tell us about your lifestyle, preferences, and what you’re looking for.",
        },
        {
            number: 2,
            icon: "match",
            title: "We Matchmake",
            description:
                "Our algorithm analyzes compatibility and finds your best match.",
        },
        {
            number: 3,
            icon: "chat",
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
                <h2 className="outfit-bold mb-4 text-7xl font-bold">How MeteorMate Works</h2>
                <p className="outfit font-light text-3xl">
                    You&apos;re just a few steps away from finding your perfect match
                </p>
            </div>
            <div className="mx-auto grid max-w-[900px] grid-cols-1 justify-items-center gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-[72px]">
                {features.map((feature, index) => (
                    <FeatureCard
                        key={feature.title}
                        {...feature}
                        connectNext={index < features.length - 1}
                    />
                ))}
            </div>
        </LandingSection>
    );
}
