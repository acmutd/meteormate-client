"use client";
import Image from "next/image";
import { Link } from "react-scroll";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";

export default function Navbar() {
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false);
    const [scrollOffset, setScrollOffset] = useState(-96);
    const headerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const updateOffset = () => {
            const h = headerRef.current?.getBoundingClientRect().height ?? 96;
            const px = Math.max(48, Math.ceil(h));
            setScrollOffset(-px);
            document.documentElement.style.setProperty("--navbar-height", `${px}px`);
        };

        updateOffset();
        window.addEventListener("resize", updateOffset, { passive: true });
        return () => window.removeEventListener("resize", updateOffset);
    }, []);

    return (
        <header
            ref={headerRef}
            className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black py-2"
        >
            <div className="flex w-full items-center justify-between px-3 sm:px-4">
                <button
                    type="button"
                    className="group flex cursor-pointer items-center gap-2 text-left sm:gap-3"
                    onClick={() => router.push("/")}
                    aria-label="MeteorMate home"
                >
                    <div className="relative">
                        <Image
                            src="/android-chrome-512x512.png"
                            alt="MeteorMate Logo"
                            width={56}
                            height={56}
                            className="h-11 w-11 sm:h-[52px] sm:w-[52px]"
                            priority
                        />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <h1
                            className="bg-clip-text font-outfit text-xl font-bold tracking-tight text-transparent sm:text-[26px]"
                            style={{
                                backgroundImage:
                                    "linear-gradient(90deg, #FF9100 7.76%, #F2DDBC 52.43%, #FF9100 85.1%)",
                            }}
                        >
                            MeteorMate
                        </h1>
                        <span className="self-end text-right text-[11px] font-normal text-white/70 sm:text-[13px]" style={{ fontFamily: "var(--font-inter)" }}>
                            Powered by ACM Dev
                        </span>
                    </div>
                </button>

                <nav className="hidden items-center gap-6 md:flex lg:gap-8">
                    {[
                        { to: "howItWorks", label: "How It Works" },
                        { to: "getStarted", label: "Get Started" },
                        { to: "contactUs", label: "Contact Us" },
                    ].map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            smooth={true}
                            duration={500}
                            offset={scrollOffset}
                            className="group relative cursor-pointer whitespace-nowrap text-sm text-white/90 transition-colors duration-300 hover:text-white lg:text-base"
                            style={{
                                fontFamily: "var(--font-inter)",
                                fontWeight: 400,
                                lineHeight: "100%",
                                letterSpacing: "0px",
                                textAlign: "center",
                            }}
                        >
                            {link.label}
                            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}

                    <button
                        type="button"
                        className="ml-1 inline-flex cursor-pointer items-center gap-2 rounded-xl px-[14px] py-2 font-outfit text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 lg:text-base"
                        style={{
                            border: "1.11px solid transparent",
                            background:
                                "linear-gradient(#000, #000) padding-box, linear-gradient(90deg, #FF9100 57.21%, #FFC94C 100%) border-box",
                            fontFamily: "var(--font-outfit)",
                        }}
                        onClick={() => {
                            if (!isNavigating) {
                                setIsNavigating(true);
                                router.push("/authentication");
                            }
                        }}
                        disabled={isNavigating}
                    >
                        {isNavigating && <LoadingSpinner size="sm" className="border-white" />}
                        Login
                    </button>
                    <button
                        type="button"
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF9100] to-[#FFC94C] px-[14px] py-2 font-outfit text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50 lg:text-base"
                        style={{ fontFamily: "var(--font-outfit)" }}
                        onClick={() => {
                            if (!isNavigating) {
                                setIsNavigating(true);
                                router.push("/authentication/createAccount");
                            }
                        }}
                        disabled={isNavigating}
                    >
                        {isNavigating && <LoadingSpinner size="sm" className="border-black" />}
                        Sign up
                    </button>
                </nav>

                <div className="flex items-center gap-2 md:hidden">
                    <button
                        type="button"
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 font-outfit text-xs font-semibold text-white disabled:opacity-50"
                        style={{
                            border: "1.11px solid transparent",
                            background:
                                "linear-gradient(#000, #000) padding-box, linear-gradient(90deg, #FF9100 57.21%, #FFC94C 100%) border-box",
                            fontFamily: "var(--font-outfit)",
                        }}
                        onClick={() => {
                            if (!isNavigating) {
                                setIsNavigating(true);
                                router.push("/authentication");
                            }
                        }}
                        disabled={isNavigating}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-gradient-to-r from-[#FF9100] to-[#FFC94C] px-3 py-2 font-outfit text-xs font-semibold text-black disabled:opacity-50"
                        style={{ fontFamily: "var(--font-outfit)" }}
                        onClick={() => {
                            if (!isNavigating) {
                                setIsNavigating(true);
                                router.push("/authentication/createAccount");
                            }
                        }}
                        disabled={isNavigating}
                    >
                        Sign up
                    </button>
                </div>
            </div>
        </header>
    );
}
