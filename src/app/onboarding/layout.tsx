import React from "react";
export default function CreateProfilePageLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div
			className="bg-cover bg-center bg-no-repeat bg-white min-h-screen w-screen flex items-center justify-center relative"
			style={{
				backgroundImage: "url('/images/stars_orange.webp')",
			}}
		>
			<div className="relative z-10">{children}</div>
		</div>
	);
}
