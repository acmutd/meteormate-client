"use client";
import Image from "next/image";
import { Link } from "react-scroll";
import { useEffect, useState } from "react";

export default function HeroSection() {
	const [navScrollOffset, setNavScrollOffset] = useState(-96);

	useEffect(() => {
		const read = () => {
			const raw = getComputedStyle(document.documentElement)
				.getPropertyValue("--navbar-height")
				.trim();
			const px = Number.parseFloat(raw.replace("px", "")) || 96;
			setNavScrollOffset(-Math.max(48, Math.ceil(px)));
		};
		read();
		window.addEventListener("resize", read, { passive: true });
		return () => window.removeEventListener("resize", read);
	}, []);

	return (
		<section
			id="home"
			className="relative min-h-screen w-screen bg-black bg-cover bg-top-left bg-no-repeat text-white"
			style={{ backgroundImage: `url('/images/hero_section_background.webp')` }}
		>
			{/* spacing for fixed navbar */}
			<div className="pt-24 md:pt-28">
				<div className="flex items-center justify-between">
					<div className="flex-1 ml-10 lg:mb-20 lg:mt-15 md:mt-5 self-start">
						<p className="md:text-xs text-sm font-bold">
							Your UTD roomate match starts here.
						</p>
						<h1 className="mt-4 lg:text-5xl text-3xl font-extrabold">
							Find your perfect roomate
						</h1>
						<h1 className="md:text-3xl lg:text-5xl font-extrabold">
							here at UT Dallas!
						</h1>
						<p className="mt-4 font-inter font-thin md:text-sm lg:text-xl">
							Our goal it to help students like you find
						</p>
						<p className="font-inter font-thin md:text-sm lg:text-xl">
							compatible roommates based on lifestyle,
						</p>
						<p className="font-inter font-thin md:text-sm lg:text-xl">
							habits, and interests! Create your profile
						</p>
						<p className="font-inter font-thin md:text-sm lg:text-xl">
							and explore potential matches to have a
						</p>
						<p className="font-inter font-thin md:text-sm lg:text-xl">
							roommate that fits your vibe!
						</p>
						<div className="flex items-center gap-20 mt-4">
							<Link
								to="getStarted"
								smooth={true}
								duration={500}
								offset={navScrollOffset}
								className="bg-white text-black lg:text-sm font-bold rounded-3xl lg:px-4 lg:py-3 md:text-xs md:px-2 md:py-2 cursor-pointer"
							>
								Get Started
							</Link>
							<Link
								to="howItWorks"
								smooth={true}
								duration={500}
								offset={navScrollOffset}
								className="bg-white text-black lg:text-sm font-bold rounded-3xl lg:px-4 lg:py-3 md:text-xs md:px-2 md:py-2 cursor-pointer"
							>
								Learn More
							</Link>
						</div>
					</div>
					<div className="flex items-end justify-end pb-0 pr-10 lg:pt-28 md:pt-20 w-1/2">
						<Image
							src="/images/laptop_model.png"
							alt="Laptop showing MeteorMate interface"
							width={800}
							height={600}
							className="max-w-full w-full object-contain"
							priority
						/>
					</div>
				</div>
			</div>
		</section>
	);
}

