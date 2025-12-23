"use client";
import Image from "next/image";
import { Link } from "react-scroll";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingSpinner from "../LoadingSpinner";

export default function Navbar() {
	const router = useRouter();
	const [isNavigating, setIsNavigating] = useState(false);

	return (
		<div className="flex justify-between">
			<div className="flex justify-center items-center gap-4 p-5">
				<Image
					src="/images/MM_logo_V1.png"
					alt="MeteorMate Logo"
					width={52}
					height={52}
					className="md:w-13 md:h-13 w-8 h-8"
					priority
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
				className="cursor-pointer font-outfit font-normal md:text-[14px] text-[10px] p-1 w-25 h-10 mt-6 text-center flex items-center justify-center"
			>
				How It Works
			</Link>

			<Link
				to="getStarted"
				smooth={true}
				duration={500}
				className="cursor-pointer md:text-[14px] text-[10px] p-1 w-25 h-10 mt-6 text-center flex items-center justify-center"
			>
				Get Started
			</Link>
			<Link
				to="contactUs"
				smooth={true}
				duration={500}
				className="cursor-pointer font-outfit font-normal md:text-[14px] text-[10px] p-1 w-25 h-10 mt-6 flex text-center items-center justify-center"
			>
				Contact Us
			</Link>
			<button
				className="mx-13 p-2 cursor-pointer md:text-[14px] text-[10px] transition-transform duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
				onClick={() => {
					if (!isNavigating) {
						setIsNavigating(true);
						router.push("/authentication");
					}
				}}
				disabled={isNavigating}
			>
				<p className="outfit-regular border-0 bg-white text-black rounded-[100px] px-5 py-2 transition-all duration-300 hover:shadow-lg flex items-center gap-2">
					{isNavigating && <LoadingSpinner size="sm" className="border-black" />}
					Login
				</p>
			</button>
		</div>
	);
}

