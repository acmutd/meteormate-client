"use client";
import "./globals.css";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import GetStarted from "@/components/landing/GetStarted";
import ContactUs from "@/components/landing/ContactUs";
import StarsBackground from "@/components/landing/StarsBackground";
import StreakBackground from "@/components/landing/StreakBackground";
import LandingMatchCards from "@/components/landing/LandingMatchCards";

export default function Home() {
    return (
        <div className="relative isolate flex flex-col min-h-screen overflow-x-hidden scroll-smooth">
            <StarsBackground count={70} color="#FF9100" />
            <StreakBackground />
            {/* Preserve the cards' coordinate canvas independently of the star field. */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-0 aspect-[1440/4000]">
                <LandingMatchCards layout="desktop" />
            </div>
            <Navbar />
            <main className="relative z-10 flex flex-col">
                <HeroSection />
                <LandingMatchCards />
                <HowItWorks />
                <GetStarted />
                <ContactUs />
            </main>
        </div>
    );
}
