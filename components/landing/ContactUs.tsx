"use client";
import Image from "next/image";
import { Mail, Linkedin, Instagram, MapPin } from "lucide-react";
import { FaDiscord } from "react-icons/fa";

export default function ContactUs() {
	return (
		<div
			id="contactUs"
			className="bg-black bg-no-repeat bg-center bg-contain text-white flex flex-col w-full"
			style={{
				backgroundImage: `url('/images/stars_footerr.png')`,
			}}
		>
			<div className="mt-5 flex flex-col items-center">
				<div className="w-23 h-23 bg-[#2B2B2B] bg-opacity-50 rounded-full flex items-center justify-center">
					{/* Logo */}
					<Image
						src="/images/MM_logo_V1.png"
						alt="MeteorMate Logo"
						width={64}
						height={64}
						className="w-16 h-16 object-contain"
					/>
				</div>
			</div>
			{/* div for the text */}
			<div className="bg-black bg-no-repeat bg-center bg-contain text-white flex flex-row items-center w-full relative px-8">
				{/* Left side text */}
				<div className="flex flex-col ml-5 outfit-regular">
					<h2>Contact us</h2>
					<div className="flex gap-y-1 flex-col outfit-regular text-white/60 py-2">
						<div className="flex items-center gap-x-3">
							<MapPin className="w-5 h-5 text-[#509275]" />
							<h2>University of Texas at Dallas</h2>
						</div>
						<div className="flex items-center gap-x-3">
							<Mail className="w-5 h-5 text-[#509275]" />
							<h2>MeteorMateSupport@gmail.com</h2>
						</div>
					</div>
				</div>

				{/* Center text - absolutely positioned for true centering */}
				<div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-white/80">
					<h1 className="oranienbaum-regular text-[30px] mb-10">MeteorMate</h1>

					<div className="flex gap-10 outfit-regular text-white/60 text-sm">
						<h2 className="cursor-pointer">Home</h2>
						<h2 className="cursor-pointer">About us</h2>
						<h2 className="cursor-pointer">Contact us</h2>
					</div>
				</div>

				{/* Right side text */}
				<div className="flex flex-col ml-auto items-center">
					<h2 className="text-[50px]">Contact Us</h2>
					<p>Feel free to reach out and leave your</p>
					<p>feedback!</p>
					<div className="flex justify-center lg:justify-end space-x-4 mt-2">
						<a
							href="https://www.linkedin.com/company/meteor-mate/posts/?feedView=all"
							target="_blank"
							rel="noopener noreferrer"
							className="w-12 h-12 bg-transparent border-2 border-white/10 hover:bg-blue-600 hover:border-blue-600 rounded-full flex items-center justify-center transition-colors duration-200"
						>
							<Linkedin className="w-5 h-5 text-white" />
						</a>
						<a
							href="https://www.instagram.com/meteor.mate/"
							target="_blank"
							rel="noopener noreferrer"
							className="w-12 h-12 bg-transparent border-2 border-white/10 hover:bg-pink-600 hover:border-pink-600 rounded-full flex items-center justify-center transition-colors duration-200"
						>
							<Instagram className="w-5 h-5 text-white" />
						</a>
						<a
							href="https://discord.com"
							target="_blank"
							rel="noopener noreferrer"
							className="w-12 h-12 bg-transparent border-2 border-white/10 hover:bg-blue-400 hover:border-blue-400 rounded-full flex items-center justify-center transition-colors duration-200"
						>
							<FaDiscord className="w-5 h-5 text-white" />
						</a>
					</div>
				</div>
			</div>
			{/* Footer Bottom */}
			<div className="border-t border-white/20 mt-10 py-4 px-10 flex justify-between text-xs text-white/40 outfit-regular">
				<span>© 2025 Meteor Mate UTD. All rights reserved</span>
				<span>Powered by ACM Development</span>
				<div className="flex gap-4">
					<span className="cursor-pointer">Terms</span>
					<span className="cursor-pointer">Privacy</span>
					<span className="cursor-pointer">Data Protection</span>
				</div>
			</div>
		</div>
	);
}

