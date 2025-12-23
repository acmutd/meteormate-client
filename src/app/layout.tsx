"use client";

import "./globals.css";
import { AuthProvider } from "../contexts/authContext";
import ScreenBlocker from "../../components/ScreenBlocker";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				{/* Preconnect for better font loading performance */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>

				{/* Urbanist font */}
				<link
					href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap"
					rel="stylesheet"
				/>

				{/* Oranienbaum font */}
				<link
					href="https://fonts.googleapis.com/css2?family=Oranienbaum&display=swap"
					rel="stylesheet"
				/>

				{/* Outfit font */}
				<link
					href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap"
					rel="stylesheet"
				/>
				{/* Didact Gothic font */}
				<link
					href="https://fonts.googleapis.com/css2?family=Didact+Gothic&display=swap"
					rel="stylesheet"
				></link>

				{/* Didact Inter font */}
				<link
					href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap"
					rel="stylesheet"
				></link>

				{/* inter font */}
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100;1,14..32,100&display=swap"
					rel="stylesheet"
				></link>

				{/* pavanam font */}
				<link
					href="https://fonts.googleapis.com/css2?family=Pavanam&display=swap"
					rel="stylesheet"
				></link>
			</head>
			<body className="m-0 p-0" suppressHydrationWarning>
				<AuthProvider>
					<div className="hidden md:block">{children}</div>
					<div className="block md:hidden">
						<ScreenBlocker />
					</div>
				</AuthProvider>
			</body>
		</html>
	);
}
