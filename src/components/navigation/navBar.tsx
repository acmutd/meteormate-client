"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NotificationBell from "@/components/navigation/notificationBell";
import ProfileAvatar from "@/components/navigation/ProfileAvatar";

export default function Navbar() {
    const router = useRouter();

    return (
        <header className="shadow-lg shadow-gray-100">
            {/* Main thing starts here I dont know if we even need the header maybe to make it static later ?!  */}
            <div className=" h-14 w-full flex items-center justify-between px-6 md:px-10 py-10"> {/* todo: Here we can just add the mx-auto to take care of the spacing once the things like profile is added - aastha notes */}
                
                <button className="relative flex items-center gap-4 group cursor-pointer" onClick={() => router.push("/dashboard")}> {/* I dont know about the on click here right now we will work on it later*/}
                    
                    <div className="relative">
                        <Image
                            src="/MM_logo_V1.webp"
                            alt="MeteorMate Logo"
                            width={56}
                            height={56}
                            className="transition-transform duration-300 group-hover:scale-110"
                            priority
                        />
                        {/* Subtle glow effect around logo */}
                        <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    
                    <div className="flex flex-col leading-tight items-start">
                        <h1 className="font-pavanam font-bold md:text-2xl text-lg tracking-tight bg-gradient-to-r from-primary via-secondary to-primary-hover bg-clip-text text-transparent">
                            MeteorMate
                        </h1>
                        <span className="text-[10px] md:text-xs font-pavanam font-medium text-black/70 uppercase tracking-widest">
                            Powered by ACM Dev
                        </span>
                    </div>

                </button>

                {/* Need to add the notification here and the profile here and add the condition on the notification */}
                <div className="flex gap-6">
                    <NotificationBell />
                    <ProfileAvatar />
                </div>
                
                
            </div>
        </header>
    );
}

