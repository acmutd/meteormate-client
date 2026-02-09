"use client";
import React, { useEffect, useState } from "react";
import { getCurrentUserIdToken } from "@/firebase/auth";
import { useRouter } from "next/navigation";
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
			className="bg-cover bg-center bg-no-repeat bg-white min-h-screen w-screen flex items-center justify-center relative"
			style={{
				backgroundImage: "url('/stars_orange.webp')",
			}}
		>
			<div className="relative z-10">{children}</div>
		</div>
	);
}
