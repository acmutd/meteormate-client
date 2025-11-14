"use client";
import { useRouter } from "next/navigation";
import "./globals.css";
import { Mail, Linkedin, Instagram, MapPin } from "lucide-react";
import { FaDiscord } from "react-icons/fa";

import { Link } from "react-scroll";

export default function Home() {
	const router = useRouter();

	return (
		<div className="flex flex-col min-h-screen overflow-x-hidden scroll-smooth">
			{/* the first landing page screen  */}
			<div>
				{/* black background behind background image */}
				<div className="bg-black bg-cover bg-center bg-no-repeat min-h-screen w-screen flex items-center justify-center relative">
					<div
						className="absolute inset-0 bg-cover bg-top-left bg-no-repeat text-white min-h-screen w-screen"
						style={{
							backgroundImage: `url('/images/hero_section_background.png')`,
						}}
					>
						{/* navbar div */}
						<div className="flex justify-between">
							<div className="flex justify-center items-center gap-4 p-5">
								<img
									src="/images/MM_logo_V1.png"
									alt="logo"
									className="md:w-13 md:h-13 w-8 h-8"
								/>
								<h1 className="font-pavanam font-extralight md:text-[24px] text-[15px] justify-center items-center">
									MeteorMate
								</h1>
								<h1 className="absolute top-15 left-25 text-xs font-pavanam font-extralight">
									Powered by ACM Dev
								</h1>
							</div>
							<Link
								to="howItWorks"
								smooth={true}
								duration={500}
								className="cursor-pointer font-outfit font-normal md:text-[14px] text-[10px] p-1 w-50 text-center flex items-center justify-center"
							>
								How It Works
							</Link>

							<Link
								to="getStarted"
								smooth={true}
								duration={500}
								className="cursor-pointer md:text-[14px] text-[10px] p-1 w-50 text-center flex items-center justify-center"
							>
								Get Started
							</Link>
							<Link
								to="contactUs"
								smooth={true}
								duration={500}
								className="cursor-pointer md:text-[14px] text-[10px] p-1 w-50 flex text-center items-center justify-center"
							>
								Contact Us
							</Link>
							<button
								className="mx-13 p-2 cursor-pointer md:text-[14px] text-[10px] transition-transform duration-200 hover:scale-105 active:scale-95"
								onClick={() => router.push("/authentication")}
							>
								<p className="outfit-regular border-0 bg-white text-black rounded-[100px] px-5 py-2 transition-all duration-300 hover:shadow-lg">
									Login
								</p>
							</button>
						</div>
						{/* main landing page content */}
						<div className="flex items-end justify-between">
							<div className="flex-1 ml-10 mb-20 mt-15 self-start">
								<p className="text-sm font-bold">
									Your UTD roomate match starts here.
								</p>
								<h1 className="mt-4 text-5xl font-extrabold">
									Find your perfect roomate
								</h1>
								<h1 className="text-5xl font-extrabold">here at UT Dallas!</h1>
								<p className="mt-4 font-inter font-thin text-xl">
									Our goal it to help students like you find
								</p>
								<p className="font-inter font-thin text-xl">
									compatible roommates based on lifestyle,
								</p>
								<p className="font-inter font-thin text-xl">
									habits, and interests! Create your profile
								</p>
								<p className="font-inter font-thin text-xl">
									and explore potential matches to have a
								</p>
								<p className="font-inter font-thin text-xl">
									roommate that fits your vibe!
								</p>
								<div className="flex gap-20 mt-4">
									<Link
										to="getStarted"
										smooth={true}
										duration={500}
										className="bg-white text-black text-sm font-bold rounded-3xl px-4 py-3 cursor-pointer"
									>
										Get Started
									</Link>
									<Link
										to="howItWorks"
										smooth={true}
										duration={500}
										className="bg-white text-black text-sm font-bold rounded-3xl px-4 py-3 cursor-pointer"
									>
										Learn More
									</Link>
								</div>
							</div>
							<div className="flex items-end justify-end pb-0 pr-10 pt-32 w-1/2">
								<img 
									src="/images/laptop_model.png"
									className="max-w-full w-full object-contain"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Second screen */}
			<div
				id="howItWorks"
				className="w-screen min-h-screen bg-black flex flex-col justify-center items-center"
				style={{ backgroundImage: `url('/images/stars.png')` }}
			>
				<h1 className="text-white text-[60px] font-extrabold">
					Fast Solution and Best Matches
				</h1>
				<p className="text-white inter-tight-regular text-[20px]">
					Find your ideal roommate match with our comprehensive platform
				</p>
				<p className="text-white inter-tight-regular mb-8 text-[20px]">
					designed specificially for students just like you
				</p>
				<div className="grid grid-cols-3 gap-10">
					<div className="inter-tight-regular text-black bg-white border-0 rounded-xl flex flex-col text-center justify-center items-center px-8 py-5 w-80 h-60">
						<img
							src="/images/landing_logo1_S2.png"
							alt="AI Powered"
							className="md:w-22 md:h-17 justify-center items-center "
						/>
						<h1 className="font-bold h-10 ">AI Powered Matchmaking</h1>
						<p className="h-30">
							Our advanced algorithm analyzes personality traits and preferences
							to find you the ideal roommate.
						</p>
					</div>

					<div className="inter-tight-regular text-black bg-white border-0 rounded-xl flex flex-col text-center justify-center items-center px-8 py-5 w-80 h-60">
						<img
							src="/images/L2.png"
							alt="AI Powered"
							className="md:w-23 md:h-17 justify-center items-center"
						/>
						<h1 className="font-bold h-10">Data Driven Insights</h1>
						<p className="h-30">
							View comprehensive compatibility metrics and compare potential
							roommates using interactive charts and graphs.
						</p>
					</div>

					<div className="inter-tight-regular text-black bg-white border-0 rounded-xl flex flex-col text-center justify-center items-center px-8 py-5 w-80 h-60">
						<img
							src="/images/L3.png"
							alt="AI Powered"
							className="md:w-25 md:h-17 justify-center items-center"
						/>
						<h1 className="font-bold h-10">Multistep Verification</h1>
						<p className="h-30">
							Secure system with your school email and social media verification
							ensures all users are genuine UTD students.
						</p>
					</div>

					<div className="inter-tight-regular text-black bg-white border-0 rounded-xl flex flex-col text-center justify-center items-center px-8 py-5 w-80 h-60">
						<img
							src="/images/L4.png"
							alt="AI Powered"
							className="md:w-29 md:h-18 justify-center items-center"
						/>
						<h1 className="font-bold h-10">Privacy First</h1>
						<p className="h-30">
							Your data is always protected. You control what information you
							share and who can see it.
						</p>
					</div>

					<div className="inter-tight-regular text-black bg-white border-0 rounded-xl flex flex-col text-center justify-center items-center px-8 py-5 w-80 h-60">
						<img
							src="/images/L5.png"
							alt="AI Powered"
							className="md:w-22 md:h-17 justify-center items-center"
						/>
						<h1 className="font-bold h-10">Personalized Matchmaking</h1>
						<p className="h-30">
							Tinder styled swiping interface with detailed profile and
							compatibility scores makes finding your roommate fun and
							intuitive.
						</p>
					</div>

					<div className="inter-tight-regular text-black bg-white border-0 rounded-xl flex flex-col text-center justify-center items-center px-8 py-5 w-80 h-60">
						<img
							src="/images/L6.png"
							alt="AI Powered"
							className="md:w-25 md:h-20 justify-center items-center"
						/>
						<h1 className="font-bold h-10">Social Integration</h1>
						<p className="h-30">
							Optional social media connection for enhanced matching and
							verification.
						</p>
					</div>
				</div>
			</div>

			{/* Third section */}
			<div
				id="getStarted"
				className="min-h-screen bg-black bg-no-repeat bg-center bg-contain text-white flex flex-col items-center justify-center"
				style={{
					backgroundImage: `url('/images/STARS__GRAYSCALE_LOGO_png.png')`,
				}}
			>
				<div className="flex flex-col items-center">
					<h1 className="outfit-bold text-[100px]">Ready to Find Your</h1>
					<h1 className="outfit-bold text-[100px]">Perfect Match?</h1>
				</div>
				<div className="flex flex-col items-center mb-4">
					<h1 className="outfit-regular text-[20px]">
						Join other UTD students on the hunt for the
					</h1>
					<h1 className="outfit-regular text-[20px]">perfect roomate!</h1>
				</div>
				{/* Button for start your search */}
				<div className="flex justify-center items-center">
					<button className="outfit-bold md:px-7 md:py-4 p-2 rounded-[20px] border-0 md:text-[24px] text-[10px] flex justify-center button-find cursor-pointer mt-2 bg-gradient-to-br from-orange-400 to-yellow-500 hover:opacity-80 transition-opacity duration-300">
						Start Your Search
					</button>
				</div>
			</div>

			{/* Fourth section */}
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
						<img
							src="/images/MM_logo_V1.png"
							alt="Logo"
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
						<h1 className="oranienbaum-regular text-[30px] mb-10">
							MeteorMate
						</h1>

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
		</div>
	);
}
