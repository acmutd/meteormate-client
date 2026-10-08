"use client";
import "./globals.css";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import GetStarted from "@/components/landing/GetStarted";
import ContactUs from "@/components/landing/ContactUs";
import StarBackground from "@/components/landing/StarBackground";
import LandingMatchCards from "@/components/landing/LandingMatchCards";

export default function Home() {
    return (
        <div className="relative bg-black overflow-hidden">
            <div className="absolute top-0 inset-x-0 z-0 pointer-events-none">
                <StarBackground seed={129} />
                <LandingMatchCards layout="desktop" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen overflow-x-hidden scroll-smooth">
                <Navbar />
                <main className="flex flex-col">
                    <HeroSection />
                    <LandingMatchCards />
                    <HowItWorks />
                    <GetStarted />
                    <ContactUs />
                </main>
            </div>
        </div>
    );
}
