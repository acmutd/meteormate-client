"use client";

import React from "react";

type MatchOverlayProps = {
	open: boolean;
	onClose: () => void;
	onConfirm?: () => void;

	leftImg: string;
	rightImg: string;
	rightName?: string;

	meteorLeftPng: string;  // e.g. "/meteor-left.png"
	meteorRightPng: string; // e.g. "/meteor-right.png"
};

function AvatarCircle({ src, alt }: { src: string; alt: string }) {
	return (
		<div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-white overflow-hidden shadow-md bg-white">
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img src={src} alt={alt} className="h-full w-full object-cover" />
		</div>
	);
}

export function ItsAMatchOverlay({
	open,
	onClose,
	onConfirm,
	leftImg,
	rightImg,
	rightName = "them",
	meteorLeftPng,
	meteorRightPng,
}: MatchOverlayProps) {
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-[2000]">
			{/* Backdrop: less blur, less dark */}
			<button
				type="button"
				aria-label="Close match modal"
				onClick={onClose}
				className="cursor-pointer absolute inset-0 bg-black/35 backdrop-blur-[1px]"
			/>

			{/* Content (no box) */}
			<div className="relative h-full w-full flex items-center justify-center px-4">
				<div className="relative w-full max-w-4xl">
					{/* Title */}
					<h2 className="text-center text-5xl sm:text-6xl font-extrabold text-white tracking-tight drop-shadow">
						IT&apos;S A MATCH!
					</h2>

					{/* Meteors + Avatars */}
					<div className="relative mt-8 sm:mt-10 flex items-center justify-center">
						{/* Left meteor PNG */}
						<div className="absolute left-0 sm:left-6 top-0 sm:-top-2 w-[170px] sm:w-[240px] pointer-events-none">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={meteorLeftPng}
								alt="Meteor left"
								className="w-full h-auto drop-shadow-lg"
							/>
						</div>

						{/* Right meteor PNG */}
						<div className="absolute right-0 sm:right-6 top-0 sm:-top-2 w-[170px] sm:w-[240px] pointer-events-none">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={meteorRightPng}
								alt="Meteor right"
								className="w-full h-auto drop-shadow-lg"
							/>
						</div>

						{/* Middle row */}
						<div className="relative flex items-center gap-6 sm:gap-10">
							<AvatarCircle src={leftImg} alt="Your profile photo" />

							<div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#FF9100] shadow-lg flex items-center justify-center">
								<span className="text-white text-xl sm:text-2xl">★</span>
							</div>

							<AvatarCircle src={rightImg} alt={`${rightName}'s profile photo`} />
						</div>
					</div>

					{/* Subtitle */}
					<p className="mt-6 text-center text-white/90 text-lg sm:text-xl drop-shadow">
						You matched with{" "}
						<span className="font-semibold text-white">{rightName}</span>!
					</p>

					{/* Button */}
					<div className="mt-6 flex justify-center">
						<button
							type="button"
							onClick={onConfirm ?? onClose}
							className="cursor-pointer rounded-2xl bg-[#FF9100] px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-md hover:shadow-lg transition"
						>
							Confirm Match
						</button>
					</div>

					{/* Optional close text */}
					<div className="mt-4 flex justify-center">
						<button
							type="button"
							onClick={onClose}
							className="cursor-pointer text-sm text-white/80 hover:text-white underline underline-offset-4"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}