"use client";
import "./globals.css";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import GetStarted from "@/components/landing/GetStarted";
import ContactUs from "@/components/landing/ContactUs";
import StarsBackground from "@/components/landing/StarsBackground";
import StreakBackground from "@/components/landing/StreakBackground";


export default function Home() {
    return (
        <div className="relative flex flex-col min-h-screen overflow-x-hidden scroll-smooth">
            <StarsBackground count={70} color="#FF9100" />
            <StreakBackground />
            <Navbar />
            <main className="flex flex-col">
                <HeroSection />
                <HowItWorks />
                <GetStarted />
                <ContactUs />
            </main>
        </div>
    );
}
