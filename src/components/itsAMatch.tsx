"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type MatchOverlayProps = {
	open: boolean;
	onClose: () => void;
	onConfirm?: () => void;

	leftImg: string;
	rightImg: string;
	rightName?: string;
};

function AvatarCircle({ src, alt }: { src: string; alt: string }) {
	return (
		<div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-white overflow-hidden shadow-md bg-white mt-5">
			<Image
				src={src}
				alt={alt}
				fill
				className="object-cover"
				sizes="(max-width: 640px) 80px, 96px"
			/>
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

}: MatchOverlayProps) {
	if (!open) return null;
    const router = useRouter();

	return (
		<div className="fixed inset-0 z-[2000]">
			<button
				type="button"
				aria-label="Close match modal"
				onClick={onClose}
				className="cursor-pointer absolute inset-0 bg-black/35 backdrop-blur-[1px]"
			/>

			
			<div className="relative h-full w-full flex items-center justify-center px-4">
				<div className="relative w-full max-w-4xl">
					
					<h2 className="text-center text-5xl sm:text-6xl font-extrabold text-white tracking-tight drop-shadow">
						IT&apos;S A MATCH!
					</h2>

					
					<div className="relative mt-8 sm:mt-10 flex items-center justify-center">
                        {/* Avatar row wrapper (THIS is the positioning anchor) */}
                        <div className="relative inline-flex items-center gap-6 sm:gap-10 mt-2">
                            {/* LEFT meteor (centered over left avatar) */}
                            <div
                                className={`
                                    absolute
                                    left-0
                                    -top-12 sm:-top-18
                                    -translate-x-2/3
                                    pointer-events-none
                                    w-[100px] sm:w-[180px]
                                `}
                            >
                                <svg
                                    viewBox="0 0 142 128"
                                    className="w-full -rotate-3 h-auto"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M0.779746 0.00235648C0.898646 0.0105909 1.01764 0.039821 1.12154 0.0716924C1.2264 0.103922 1.34347 0.147291 1.46822 0.198646L1.86666 0.374427L1.8774 0.37931V0.380286C15.4565 6.99481 69.6777 34.9071 85.436 42.4067C85.7315 42.5037 85.9309 42.5239 86.059 42.5053C86.1601 42.4904 86.2282 42.4508 86.2934 42.3617C86.4303 42.1348 86.5351 41.7611 86.5864 41.2387C86.6374 40.7181 86.6317 40.1086 86.5942 39.4701C86.5174 38.1647 86.3226 36.8934 86.2397 35.9818V35.9809C85.756 31.9873 85.2097 27.8155 84.7358 23.7777L84.7348 23.767V23.7563C84.6679 22.9169 84.5398 21.7889 84.56 20.7719C84.5703 20.2591 84.6174 19.7437 84.7387 19.2826C84.8594 18.8242 85.065 18.3746 85.4204 18.0414L85.4506 18.0141L85.4858 17.9897C86.175 17.515 86.9295 17.7379 87.4702 18.017C87.7428 18.1578 88.0141 18.3395 88.2612 18.5209L88.9126 19.0219L88.9301 19.0346L88.9477 19.0512C102.949 31.7504 124.591 52.0769 140.012 66.2563L141.916 68.0033C131.89 64.9879 120.806 65.2451 110.351 69.4926C87.2553 78.876 75.5346 104.346 82.8608 127.718C64.1044 110.169 44.1722 91.5033 29.2524 77.477L28.6655 76.9223C28.0609 76.3354 27.4312 75.6644 27.0268 75.0326L27.019 75.0219C26.6906 74.4823 26.5192 73.9364 26.6626 73.4272C26.8113 72.9004 27.241 72.6014 27.6596 72.433C28.0806 72.2639 28.5923 72.1818 29.101 72.1401C29.3591 72.1189 29.6282 72.1074 29.8969 72.102L30.6977 72.1L30.7085 72.101H30.7182C34.1501 72.2731 37.6205 72.7626 41.0004 73.0795H41.0044C43.0894 73.2893 44.809 73.4694 46.4145 73.3813C46.7301 73.3627 47.0296 73.3303 47.2866 73.2709C47.5492 73.2101 47.7287 73.1305 47.8364 73.0483C47.9267 72.9791 47.9605 72.9144 47.9682 72.8276C47.9777 72.7161 47.9474 72.5043 47.7602 72.1547C43.1076 65.0223 33.2342 50.4137 23.5493 36.101C13.8563 21.7763 4.35088 7.74522 0.474082 1.8256L0.46627 1.81486C0.289013 1.52907 0.14799 1.2731 0.0717383 1.06193C0.0348417 0.959534 -0.00466711 0.818806 0.000449287 0.667396C0.00652855 0.495234 0.0763497 0.269199 0.293418 0.121497C0.476168 -0.00239932 0.672386 -0.00500129 0.779746 0.00235648Z"
                                        fill="white"
                                    />
                                </svg>
                            </div>

                            {/* RIGHT meteor (centered over right avatar) */}
                            <div
                                className={`
                                    absolute
                                    right-0
                                    -top-12 sm:-top-18
                                    translate-x-2/3
                                    pointer-events-none
                                    w-[100px] sm:w-[180px]
                                    scale-x-[-1]
                                `}
                            >
                                <svg
                                    viewBox="0 0 142 128"
                                    className="w-full -rotate-3 h-auto"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M0.779746 0.00235648C0.898646 0.0105909 1.01764 0.039821 1.12154 0.0716924C1.2264 0.103922 1.34347 0.147291 1.46822 0.198646L1.86666 0.374427L1.8774 0.37931V0.380286C15.4565 6.99481 69.6777 34.9071 85.436 42.4067C85.7315 42.5037 85.9309 42.5239 86.059 42.5053C86.1601 42.4904 86.2282 42.4508 86.2934 42.3617C86.4303 42.1348 86.5351 41.7611 86.5864 41.2387C86.6374 40.7181 86.6317 40.1086 86.5942 39.4701C86.5174 38.1647 86.3226 36.8934 86.2397 35.9818V35.9809C85.756 31.9873 85.2097 27.8155 84.7358 23.7777L84.7348 23.767V23.7563C84.6679 22.9169 84.5398 21.7889 84.56 20.7719C84.5703 20.2591 84.6174 19.7437 84.7387 19.2826C84.8594 18.8242 85.065 18.3746 85.4204 18.0414L85.4506 18.0141L85.4858 17.9897C86.175 17.515 86.9295 17.7379 87.4702 18.017C87.7428 18.1578 88.0141 18.3395 88.2612 18.5209L88.9126 19.0219L88.9301 19.0346L88.9477 19.0512C102.949 31.7504 124.591 52.0769 140.012 66.2563L141.916 68.0033C131.89 64.9879 120.806 65.2451 110.351 69.4926C87.2553 78.876 75.5346 104.346 82.8608 127.718C64.1044 110.169 44.1722 91.5033 29.2524 77.477L28.6655 76.9223C28.0609 76.3354 27.4312 75.6644 27.0268 75.0326L27.019 75.0219C26.6906 74.4823 26.5192 73.9364 26.6626 73.4272C26.8113 72.9004 27.241 72.6014 27.6596 72.433C28.0806 72.2639 28.5923 72.1818 29.101 72.1401C29.3591 72.1189 29.6282 72.1074 29.8969 72.102L30.6977 72.1L30.7085 72.101H30.7182C34.1501 72.2731 37.6205 72.7626 41.0004 73.0795H41.0044C43.0894 73.2893 44.809 73.4694 46.4145 73.3813C46.7301 73.3627 47.0296 73.3303 47.2866 73.2709C47.5492 73.2101 47.7287 73.1305 47.8364 73.0483C47.9267 72.9791 47.9605 72.9144 47.9682 72.8276C47.9777 72.7161 47.9474 72.5043 47.7602 72.1547C43.1076 65.0223 33.2342 50.4137 23.5493 36.101C13.8563 21.7763 4.35088 7.74522 0.474082 1.8256L0.46627 1.81486C0.289013 1.52907 0.14799 1.2731 0.0717383 1.06193C0.0348417 0.959534 -0.00466711 0.818806 0.000449287 0.667396C0.00652855 0.495234 0.0763497 0.269199 0.293418 0.121497C0.476168 -0.00239932 0.672386 -0.00500129 0.779746 0.00235648Z"
                                        fill="white"
                                    />
                                </svg>
                            </div>

                            {/* Avatars */}
                            <AvatarCircle src={leftImg} alt="Your profile photo" />

                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#FF9100] shadow-lg flex items-center justify-center">
                                <span className="text-white text-xl sm:text-2xl">★</span>
                            </div>

                            <AvatarCircle src={rightImg} alt={`${rightName}'s profile photo`} />
                        </div>
                    </div>

					
					<p className="mt-6 text-center text-white/90 text-lg sm:text-xl drop-shadow">
						You matched with{" "}
						<span className="font-semibold text-white">{rightName}</span>!
					</p>

					
					<div className="mt-6 flex justify-center">
						<button
							type="button"
							onClick={() => {
                                if (onConfirm) onConfirm();
                                else onClose();
                                router.push("./dashboard/matches");
                            }}
							className="cursor-pointer rounded-2xl bg-[#FF9100] px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-md hover:shadow-lg transition"
						>
							Go to Matches
						</button>
					</div>

					
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