"use client"

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CreateProfilePageLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();

	return (
		<div
			className="bg-cover bg-center bg-no-repeat bg-white min-h-screen w-screen flex items-center justify-center relative bg-fixed"
			style={{
				backgroundImage: "url('/stars_orange.svg')",
			}}
		>
			<button
				onClick={() => router.back()}
				className="absolute top-8 left-8 z-50 hover:opacity-70 transition-opacity"
				aria-label="Go back"
			>
				<Image
					src="/back_arrow.svg"
					alt="Back"
					width={24}
					height={24}
					className="w-8 h-8 lg:w-12 lg:h-12"
				/>
			</button>
			<div className="relative z-10">{children}</div>
		</div>
	);
}
