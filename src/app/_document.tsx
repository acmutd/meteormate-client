import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
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
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
