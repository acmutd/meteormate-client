"use client";

import React, { useEffect, useRef, useState } from "react";
import StatusLayout from "./StatusLayout";

const meteorSeeds = [
	{ top: "10%", left: "12%" },
	{ top: "25%", left: "70%" },
	{ top: "55%", left: "30%" },
	{ top: "40%", left: "55%" },
	{ top: "65%", left: "75%" },
	{ top: "78%", left: "18%" },
];

export default function LoadingPage() {
	const fieldRef = useRef<HTMLDivElement | null>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;
		
		let animationFrameId: number | null = null;
		let timeoutId: NodeJS.Timeout;
		
		// Small delay to ensure DOM is ready
		timeoutId = setTimeout(() => {
			const node = fieldRef.current;
			if (!node) return;

			const meteors = node.querySelectorAll<HTMLElement>("[data-meteor]");
			if (!meteors.length) return;

			// Initialize starting positions
			meteors.forEach((meteor) => {
				meteor.style.transition = "none";
				meteor.style.opacity = "0.5";
			});

			// Use requestAnimationFrame for smooth animations
			let startTime = Date.now();

			const animate = () => {
				const elapsed = Date.now() - startTime;
				
				meteors.forEach((meteor, index) => {
					const delay = index * 200;
					const cycleTime = (elapsed - delay) % 3000;
					const progress = cycleTime / 3000;
					
					// Create smooth floating animation with varied patterns
					const x = Math.sin(progress * Math.PI * 2 + index * 0.8) * 70;
					const y = Math.cos(progress * Math.PI * 2 + index * 0.6) * 50;
					const scale = 1 + Math.sin(progress * Math.PI * 4 + index) * 0.4;
					const opacity = 0.3 + Math.sin(progress * Math.PI * 2 + index * 0.5) * 0.7;
					
					meteor.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
					meteor.style.opacity = String(Math.max(0.2, Math.min(1, opacity)));
				});
				
				animationFrameId = requestAnimationFrame(animate);
			};

			// Start animation immediately
			animate();
		}, 50);

		return () => {
			clearTimeout(timeoutId);
			if (animationFrameId !== null) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	}, [mounted]);

	return (
		<StatusLayout
			eyebrow="Loading"
			title="Warming up your MeteorMate experience"
			description="Hang tight while we fetch your data and polish the UI. The meteors above show your request blazing through our servers."
			accent="amber"
		>
			<div
				ref={fieldRef}
				className="relative mx-auto mt-4 h-64 w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-white/5"
			>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,145,0,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(80,146,117,0.15),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.08),transparent_40%)]" />

				{meteorSeeds.map((seed, index) => (
					<div
						key={index}
						data-meteor
						className="absolute aspect-square w-4 rounded-full bg-gradient-to-br from-orange-400 via-yellow-400 to-white shadow-[0_0_35px_rgba(255,145,0,0.55)]"
						style={seed}
					>
						<div className="absolute -right-10 top-1/2 h-[2px] w-10 -translate-y-1/2 bg-gradient-to-l from-orange-400/70 via-yellow-300/50 to-transparent blur-[1px]" />
					</div>
				))}
			</div>

			<p className="pt-4 text-center text-sm text-white/60">
				If this takes longer than expected, refresh once or head back to the homepage. We’ll keep
				working in the background.
			</p>
		</StatusLayout>
	);
}

