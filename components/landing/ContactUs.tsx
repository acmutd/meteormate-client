"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Linkedin, Instagram, MapPin } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import LandingSection from "./LandingSection";

export default function ContactUs() {
    const router = useRouter();
	return (
		<LandingSection
			id="contactUs"
			className="bg-black bg-no-repeat bg-center bg-contain text-white flex flex-col w-full !py-12"
			style={{
				backgroundImage: `url('/images/stars_footerr.png')`,
			}}
		>
			{/* Main Footer Content */}
			<div className="container mx-auto px-6 md:px-10">
				{/* Top Section: Logo, Navigation, and Contact Info */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
					{/* Left: Logo and Tagline */}
					<div className="flex flex-col items-center md:items-start gap-3">
						<div className="flex items-center gap-3">
							<Image
								src="/images/MM_logo_V1.png"
								alt="MeteorMate Logo"
								width={40}
								height={40}
								className="w-10 h-10 object-contain"
							/>
							<h1 className="oranienbaum-regular text-2xl text-white">MeteorMate</h1>
						</div>
						<p className="outfit-regular text-sm text-white/60">
							Your campus connection platform
						</p>
					</div>

					{/* Center: Navigation Links */}
					<div className="flex flex-col items-center gap-3">
						<h3 className="outfit-regular text-sm font-semibold text-white/80 mb-1">Quick Links</h3>
						<div className="flex flex-col gap-2 outfit-regular text-white/60 text-sm">
							<a href="#" className="hover:text-white transition-colors cursor-pointer">Home</a>
							<a href="#howItWorks" className="hover:text-white transition-colors cursor-pointer">How It
								Works</a>
							<a href="#getStarted" className="hover:text-white transition-colors cursor-pointer">Get
								Started</a>
						</div>
					</div>

					{/* Right: Contact Info and Social Links */}
					<div className="flex flex-col items-center md:items-end gap-3">
						<h3 className="outfit-regular text-sm font-semibold text-white/80 mb-1">Get In Touch</h3>
						<div
							className="flex flex-col gap-2 outfit-regular text-white/60 text-sm items-center md:items-end">
							<div className="flex items-center gap-2">
								<MapPin className="w-4 h-4 text-[#509275]"/>
								<span>UT Dallas</span>
							</div>
							<div className="flex items-center gap-2" >
								<Mail className="w-4 h-4 text-[#509275]"/>
								<a href="mailto:info@meteormate.com" className="hover:text-white transition-colors cursor-pointer">info@meteormate.com</a>
							</div>
						</div>
						{/* Social Media Icons */}
						<div className="flex gap-3 mt-2">
							<a
								href="https://www.linkedin.com/company/acmutd/posts/?feedView=all"
								target="_blank"
								rel="noopener noreferrer"
								className="w-9 h-9 bg-transparent border border-white/10 hover:bg-blue-600 hover:border-blue-600 rounded-full flex items-center justify-center transition-colors duration-200"
							>
								<Linkedin className="w-4 h-4 text-white"/>
							</a>
							<a
								href="https://www.instagram.com/acmutd/"
								target="_blank"
								rel="noopener noreferrer"
								className="w-9 h-9 bg-transparent border border-white/10 hover:bg-pink-600 hover:border-pink-600 rounded-full flex items-center justify-center transition-colors duration-200"
							>
								<Instagram className="w-4 h-4 text-white"/>
							</a>
							<a
								href="https://discord.gg/qWsU6bPD2a"
								target="_blank"
								rel="noopener noreferrer"
								className="w-9 h-9 bg-transparent border border-white/10 hover:bg-blue-400 hover:border-blue-400 rounded-full flex items-center justify-center transition-colors duration-200"
							>
								<FaDiscord className="w-4 h-4 text-white"/>
							</a>
						</div>
					</div>
				</div>

				{/* Footer Bottom */}
				<div
					className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40 outfit-regular">
					<span className="md:flex-1 md:text-left text-center">© 2026 MeteorMate UTD</span>
					<a className="cursor-pointer hover:text-white/60 transition-colors md:flex-1 text-center" href="https://acmutd.co/development">Powered by ACM Development</a>
					<div className="flex gap-4 md:flex-1 md:justify-end justify-center">
						<button className="cursor-pointer hover:text-white/60 transition-colors"
								onClick={() => router.push("/privacy")}>Privacy & Data Protection
						</button>
					</div>
				</div>
			</div>
		</LandingSection>
	);
}

