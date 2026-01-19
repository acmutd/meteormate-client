"use client";
import Image from "next/image";
import { Link } from "react-scroll";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";

export default function Navbar() {
	const router = useRouter();
	const [isNavigating, setIsNavigating] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [scrollOffset, setScrollOffset] = useState(-96);
	const headerRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const onScroll = () => setIsScrolled(window.scrollY > 12);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		const updateOffset = () => {
			const h = headerRef.current?.getBoundingClientRect().height ?? 96;
			const px = Math.max(48, Math.ceil(h));
			setScrollOffset(-px);
			document.documentElement.style.setProperty("--navbar-height", `${px}px`);
		};

		updateOffset();
		window.addEventListener("resize", updateOffset, { passive: true });
		return () => window.removeEventListener("resize", updateOffset);
	}, []);

	return (
		<header
			ref={headerRef}
			className={[
				"fixed top-0 left-0 right-0 z-50",
				"transition-all duration-500",
				isScrolled 
					? "bg-black/30 backdrop-blur-lg border-b border-white/10 shadow-2xl py-2" 
					: "bg-transparent py-4",
			].join(" ")}
		>
			<div className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10">
				<div className="relative flex items-center gap-4 group cursor-pointer" onClick={() => router.push("/")}>
					<div className="relative">
						<Image
							src="/MM_logo_V1.webp"
							alt="MeteorMate Logo"
							width={56}
							height={56}
							className="md:w-14 md:h-14 w-10 h-10 transition-transform duration-300 group-hover:scale-110"
							priority
						/>
						{/* Subtle glow effect around logo */}
						<div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
					</div>
					<div className="flex flex-col leading-tight">
						<h1 className="font-pavanam font-bold md:text-2xl text-lg tracking-tight bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">
							MeteorMate
						</h1>
						<span className="text-[10px] md:text-xs font-pavanam font-medium text-white/70 uppercase tracking-widest">
							Powered by ACM Dev
						</span>
					</div>
				</div>

				<nav className="hidden md:flex items-center gap-10">
					{[
						{ to: "howItWorks", label: "How It Works" },
						{ to: "getStarted", label: "Get Started" },
						{ to: "contactUs", label: "Contact Us" },
					].map((link) => (
						<Link
							key={link.to}
							to={link.to}
							smooth={true}
							duration={500}
							offset={scrollOffset}
							className="relative cursor-pointer font-outfit font-medium text-lg text-white/90 hover:text-white transition-colors duration-300 group"
						>
							{link.label}
							<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-yellow-500 transition-all duration-300 group-hover:w-full" />
						</Link>
					))}

					<button
						className="ml-4 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
						onClick={() => {
							if (!isNavigating) {
								setIsNavigating(true);
								router.push("/authentication");
							}
						}}
						disabled={isNavigating}
					>
						<span className="outfit-bold border-0 bg-gradient-to-br from-orange-400 to-yellow-500 text-white rounded-full px-8 py-3 transition-all duration-300 group-hover:from-orange-500 group-hover:to-yellow-400 group-hover:shadow-xl shadow-lg inline-flex items-center gap-3 text-base">
							{isNavigating && (
								<LoadingSpinner size="sm" className="border-white" />
							)}
							Login
						</span>
					</button>
				</nav>

				{/* Mobile Login Button - keeping it simple but bigger */}
				<div className="md:hidden flex items-center">
					<button
						className="cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 group"
						onClick={() => {
							if (!isNavigating) {
								setIsNavigating(true);
								router.push("/authentication");
							}
						}}
						disabled={isNavigating}
					>
						<span className="outfit-bold bg-gradient-to-br from-orange-400 to-yellow-500 text-white rounded-full px-5 py-2 text-sm inline-flex items-center gap-2 shadow-md">
							{isNavigating && <LoadingSpinner size="sm" className="border-white" />}
							Login
						</span>
					</button>
				</div>
			</div>
		</header>
	);
}

