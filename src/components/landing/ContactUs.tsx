"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Linkedin, Instagram, MapPin } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import LandingSection from "./LandingSection";
import StarsBackground from "./StarsBackground";

export default function ContactUs() {
    const router = useRouter();
    return (
        <LandingSection
            id="contactUs"
            className="relative isolate w-full overflow-hidden bg-transparent !py-8 text-white md:!py-9"
        >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-black" />
            <StarsBackground
                count={64}
                color="#777777"
                opacity={0.2}
                fixed={false}
                background={false}
            />
            <div className="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-8">
                <div className="grid grid-cols-1 items-center gap-8 py-2 md:min-h-[166px] md:grid-cols-3 md:gap-8">
                    <div className="flex flex-col items-center gap-3 md:items-start">
                        <h2 className="outfit-regular text-lg text-white">Contact Us</h2>
                        <div className="flex flex-col gap-2 outfit-regular text-sm text-white/60">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-[#509275]" />
                                <span>University of Texas at Dallas</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5 text-[#509275]" />
                                <a href="mailto:MeteorMateSupport@gmail.com" className="transition-colors hover:text-white">
                                    MeteorMateSupport@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#252525]">
                            <Image
                                src="/android-chrome-512x512.png"
                                alt="MeteorMate"
                                width={60}
                                height={60}
                                className="h-[60px] w-[60px] object-contain"
                            />
                        </div>
                        <h2 className="oranienbaum-regular text-2xl text-white">MeteorMate</h2>
                        <nav aria-label="Footer navigation" className="mt-3 flex gap-8 outfit-regular text-sm text-white/60">
                            <a href="#" className="transition-colors hover:text-white">Home</a>
                            <a href="#aboutUs" className="transition-colors hover:text-white">About us</a>
                            <a href="#contactUs" className="transition-colors hover:text-white">Contact us</a>
                        </nav>
                    </div>

                    <div className="flex flex-col items-center gap-2 md:items-end">
                        <h2 className="oranienbaum-regular text-4xl text-white md:text-[44px]">Contact Us</h2>
                        <p className="max-w-[250px] text-center outfit-regular text-sm text-white/70 md:text-right">
                            Feel free to reach out and leave your feedback!
                        </p>
                        <div className="mt-1 flex gap-3">
                            <a
                                href="https://www.linkedin.com/company/acmutd/posts/?feedView=all"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 transition-colors hover:bg-blue-600"
                            >
                                <Linkedin className="h-4 w-4" />
                            </a>
                            <a
                                href="https://www.instagram.com/acmutd/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 transition-colors hover:bg-pink-600"
                            >
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a
                                href="https://discord.gg/qWsU6bPD2a"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Discord"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 transition-colors hover:bg-blue-400"
                            >
                                <FaDiscord className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-4 outfit-regular text-xs text-white/50 md:flex-row">
                    <span className="text-center md:flex-1 md:text-left">© 2025 Meteor Mate UTD. All rights reserved</span>
                    <a className="text-center transition-colors hover:text-white/70 md:flex-1" href="https://acmutd.co/development">
                        Powered by ACM Development
                    </a>
                    <div className="flex justify-center gap-8 md:flex-1 md:justify-end">
                        <button className="transition-colors hover:text-white/70" onClick={() => router.push("/privacy")}>
                            Terms
                        </button>
                        <button className="transition-colors hover:text-white/70" onClick={() => router.push("/privacy")}>
                            Privacy
                        </button>
                        <button className="transition-colors hover:text-white/70" onClick={() => router.push("/privacy")}>
                            Data Protection
                        </button>
                    </div>
                </div>
            </div>
        </LandingSection>
    );
}
