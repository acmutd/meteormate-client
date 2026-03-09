"use client";
import Image from "next/image";
import {Link} from "react-scroll";
import {ArrowRight} from "lucide-react";

export default function HeroSection() {
    return (
        <section
            className="relative min-h-[100vh] w-full flex items-center justify-center overflow-hidden bg-black pt-32 pb-20 lg:pt-40">

            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950/90 to-black"/>
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-to-br from-[#E87500]/8 via-orange-500/3 to-[#154734]/8 blur-[200px] rounded-full animate-pulse-slow"/>
            <div
                className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-[#154734]/15 to-transparent blur-[150px]"/>

            <div className="container mx-auto px-6 z-10 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 lg:gap-24">

                    {/* Text */}
                    <div className="text-center lg:text-left max-w-lg lg:max-w-xl order-2 lg:order-1 lg:row-start-1">

                        {/* Badge */}
                        <div
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs font-semibold text-primary mb-8 mx-auto lg:mx-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inset-0 rounded-full bg-primary opacity-75"/>
                <span className="relative inset-0 rounded-full bg-primary"/>
              </span>
                            Powered by ACM Development
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-[5rem] xl:text-7xl font-black tracking-[-0.03em] bg-gradient-to-r from-white via-white/95 to-zinc-200 bg-clip-text text-transparent mb-6 leading-[0.9]">
                            Find your perfect <br/>
                            <span
                                className="block bg-gradient-to-r from-primary via-secondary to-primary-hover bg-clip-text text-transparent">
                roommate here at UT Dallas.
              </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-zinc-300 mb-10 leading-relaxed max-w-md mx-auto lg:mx-0">
                            Stop gambling with randoms. Our AI matches you with verified Comets
                            based on lifestyle, habits, and interests.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                to="getStarted"
                                smooth={true}
                                duration={800}
                                offset={-100}
                                className="group relative bg-gradient-to-r from-primary to-secondary group-hover:from-primary-hover group-hover:to-secondary-hover group-hover:shadow-xl text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-2xl hover:shadow-primary-hover/25 hover:scale-[1.02] transition-all duration-300"
                            >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                </span>
                            </Link>

                            <Link
                                to="howItWorks"
                                smooth={true}
                                duration={800}
                                offset={-100}
                                className="flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-white/20 bg-white/5 backdrop-blur-sm text-white font-medium text-lg hover:border-white/40 hover:bg-white/10 transition-all duration-300"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>

                    {/* Laptop - Vertically centered, no skew */}
                    <div
                        className="relative w-full max-w-2xl lg:max-w-3xl mx-auto lg:mx-0 row-start-1 lg:row-start-auto">
                        <div className="relative mx-auto w-full aspect-[16/10] max-w-xl lg:max-w-2xl">

                            {/* Laptop glow */}
                            <div
                                className="absolute -inset-4 md:-inset-6 bg-gradient-to-br from-[#E87500]/25 via-orange-500/10 to-[#154734]/20 rounded-2xl blur-xl opacity-75"/>

                            {/* Laptop Image - No rotation */}
                            <Image
                                src="/laptop_model.webp"
                                alt="MeteorMate Dashboard"
                                width={1000}
                                height={625}
                                className="w-full h-auto drop-shadow-2xl"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
