"use client";
import { Link } from "react-scroll";
import { ArrowRight } from "lucide-react";
import StarBackground from "./StarBackground";

export default function HeroSection() {
    return (
        <section
            className="relative min-h-[100vh] w-full flex items-center justify-center overflow-hidden bg-black pt-32 pb-20 lg:pt-40">

            {/* Star background Good seeds: 41 42 59 83 yes (I went through 100 seeds)*/}
            <StarBackground seed={83} /> 

            <div className="container mx-auto px-6 z-10 relative">
                <div className="flex flex-col items-start text-left max-w-xl">

                    {/* Badge */}
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs font-semibold text-primary mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inset-0 rounded-full bg-primary opacity-75"/>
                            <span className="relative inset-0 rounded-full bg-primary"/>
                        </span>
                        Powered by ACM Development
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-[5rem] xl:text-6xl font-black tracking-[-0.03em] mb-6 leading-[1.1]">
                        <span className="bg-gradient-to-r from-white via-white/95 to-zinc-200 bg-clip-text text-transparent">Find your</span>
                        <br/>
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">perfect roommate</span>
                        <br/>
                        <span className="bg-gradient-to-r from-white via-white/95 to-zinc-200 bg-clip-text text-transparent">here at UT Dallas</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-zinc-300 mb-10 leading-relaxed max-w-md">
                        Our smart matcher helps you find compatible roommates based on lifestyle, habits, and what matters most to you.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to="getStarted"
                            smooth={true}
                            duration={800}
                            offset={-100}
                            className="group bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-semibold px-8 py-4 rounded-2xl text-lg shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                        >
                            <span className="flex items-center gap-2">
                                Start Your Search!
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                            </span>
                        </Link>

                        <Link
                            to="howItWorks"
                            smooth={true}
                            duration={800}
                            offset={-100}
                            className="flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-orange-500 bg-black text-white font-semibold text-lg hover:bg-orange-500/10 transition-all duration-300 cursor-pointer"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
