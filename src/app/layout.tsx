import type {Metadata} from "next";
import "./globals.css";
import Providers from "./providers";
import { Inter, Orelega_One, Oranienbaum, Outfit } from "next/font/google";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    display: "swap",
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const orelegaOne = Orelega_One({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-orelega-one",
    display: "swap",
});

const oranienbaum = Oranienbaum({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-oranienbaum",
    display: "swap",
});

export const metadata: Metadata = {
    title: "MeteorMate",
    description: "Your UTD roommate match starts here.",
    openGraph: {
        title: "MeteorMate",
        description: "Your UTD roommate match starts here.",
        images: ["/og.png"],
    },
    twitter: {
        card: "summary_large_image",
        images: ["/og.png"],
    },
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${outfit.variable} ${orelegaOne.variable} ${oranienbaum.variable} m-0 p-0`} suppressHydrationWarning>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
