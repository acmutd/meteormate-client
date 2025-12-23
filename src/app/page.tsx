"use client";
import "./globals.css";
import Navbar from "../../components/landing/Navbar";
import HeroSection from "../../components/landing/HeroSection";
import HowItWorks from "../../components/landing/HowItWorks";
import GetStarted from "../../components/landing/GetStarted";
import ContactUs from "../../components/landing/ContactUs";

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen overflow-x-hidden scroll-smooth">
			{/* Hero section with navbar */}
			<div>
				<div className="bg-black bg-cover bg-center bg-no-repeat min-h-screen w-screen flex items-center justify-center relative">
					<div
						className="absolute inset-0 bg-cover bg-top-left bg-no-repeat text-white min-h-screen w-screen"
						style={{
							backgroundImage: `url('/images/hero_section_background.png')`,
						}}
					>
						<Navbar />
						<HeroSection />
					</div>
				</div>
			</div>

			<HowItWorks />
			<GetStarted />
			<ContactUs />
		</div>
	);
}
