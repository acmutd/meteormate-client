"use client";
import "./globals.css";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import GetStarted from "@/components/landing/GetStarted";
import ContactUs from "@/components/landing/ContactUs";
import StarBackground from "@/components/landing/StarBackground";

export default function Home() {
    return (
        <div className="relative bg-black overflow-hidden">
            <div className="absolute top-0 inset-x-0 z-0 pointer-events-none">
                {/* yes i went thru 129 different seeds and i decided to settle w this */}
                <StarBackground seed={129} /> 
            </div>

            <div className="relative z-10 flex flex-col min-h-screen overflow-x-hidden scroll-smooth">
                <Navbar />
                <main className="flex flex-col">
                    <HeroSection />
                    <HowItWorks />
                    <GetStarted />
                    <ContactUs />
                </main>
            </div>
        </div>
    );
}
