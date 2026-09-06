import type {Metadata} from "next";
import "./globals.css";
import Providers from "./providers";

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
            <body className="m-0 p-0" suppressHydrationWarning>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
