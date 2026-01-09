"use client";
import Image from "next/image";
import LandingSection from "./LandingSection";

interface FeatureCardProps {
	imageSrc: string;
	imageAlt: string;
	title: string;
	description: string;
	imageWidth: number;
	imageHeight: number;
}

function FeatureCard({
	imageSrc,
	imageAlt,
	title,
	description,
	imageWidth,
	imageHeight,
}: FeatureCardProps) {
	return (
		<div className="inter-tight-regular text-black bg-white border-0 rounded-xl flex flex-col text-center justify-center items-center px-8 py-5 w-80 h-60">
			<Image
				src={imageSrc}
				alt={imageAlt}
				width={imageWidth}
				height={imageHeight}
				className="justify-center items-center"
			/>
			<h1 className="font-bold h-10">{title}</h1>
			<p className="h-30">{description}</p>
		</div>
	);
}

export default function HowItWorks() {
	const features = [
		{
			imageSrc: "/images/landing_logo1_S2.webp",
			imageAlt: "AI Powered Matchmaking Icon",
			title: "AI Powered Matchmaking",
			description:
				"Our advanced algorithm analyzes personality traits and preferences to find you the ideal roommate.",
			imageWidth: 88,
			imageHeight: 68,
		},
		{
			imageSrc: "/images/L2.webp",
			imageAlt: "Data Driven Insights Icon",
			title: "Data Driven Insights",
			description:
				"View comprehensive compatibility metrics and compare potential roommates using interactive charts and graphs.",
			imageWidth: 92,
			imageHeight: 68,
		},
		{
			imageSrc: "/images/L3.webp",
			imageAlt: "Multistep Verification Icon",
			title: "Multistep Verification",
			description:
				"Secure system with your school email and social media verification ensures all users are genuine UTD students.",
			imageWidth: 100,
			imageHeight: 68,
		},
		{
			imageSrc: "/images/L4.webp",
			imageAlt: "Privacy First Icon",
			title: "Privacy First",
			description:
				"Your data is always protected. You control what information you share and who can see it.",
			imageWidth: 116,
			imageHeight: 72,
		},
		{
			imageSrc: "/images/L5.webp",
			imageAlt: "Personalized Matchmaking Icon",
			title: "Personalized Matchmaking",
			description:
				"Tinder styled swiping interface with detailed profile and compatibility scores makes finding your roommate fun and intuitive.",
			imageWidth: 88,
			imageHeight: 68,
		},
		{
			imageSrc: "/images/L6.webp",
			imageAlt: "Social Integration Icon",
			title: "Social Integration",
			description:
				"Optional social media connection for enhanced matching and verification.",
			imageWidth: 100,
			imageHeight: 80,
		},
	];

	return (
		<LandingSection
			id="howItWorks"
			className="w-screen min-h-screen bg-black flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat"
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
				{features.map((feature, index) => (
					<FeatureCard key={index} {...feature} />
				))}
			</div>
		</LandingSection>
	);
}

