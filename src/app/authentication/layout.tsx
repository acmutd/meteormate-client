import React from "react";
export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div
			className="bg-cover bg-center bg-no-repeat min-h-screen w-screen flex items-center justify-center relative"
			style={{
				background: `
					linear-gradient(to right, #1D7DAD, #03234A)
				`,
			}}
		>
			<div
				className="absolute inset-0 bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: "url('/images/stars.png')",
					filter: "brightness(3) contrast(2)",
				}}
			></div>
			<div className="relative z-10">{children}</div>
		</div>
	);
}
