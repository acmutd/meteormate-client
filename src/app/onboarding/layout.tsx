"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getCurrentUserIdToken } from "@/firebase/auth";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function CreateProfilePageLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const checkAuth = async () => {
			try {
				await getCurrentUserIdToken();
				setLoading(false);
			} catch (err) {
				console.error("Onboarding auth error:", err);
				router.push("/authentication?toast=not-signed-in");
			}
		};
		checkAuth();
	}, [router]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-black">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

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
