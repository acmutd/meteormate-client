'use client';
import { useRouter } from "next/navigation";
import "./globals.css";
import { Mail, Linkedin, Instagram, MapPin } from "lucide-react";
import { FaDiscord } from 'react-icons/fa'

export default function Home() {
  const router = useRouter();

  return (
    <div className="scroll-smooth">
      {/* First section */}
      <div
      className="bg-cover bg-center bg-no-repeat text-white min-h-screen w-screen"
      style={{ backgroundImage: `url('/images/night_cover_betterVersion.png')` }}
      >

        {/* Top Navbar  */}
        <div className="flex justify-between">
          <div className="flex justify-center items-center gap-4 p-5">
            <img src="/images/MM_logo_V1.png" alt="logo" className="md:w-13 md:h-13 w-8 h-8"/>
            <h1 className="oranienbaum-regular font-extralight md:text-[24px] text-[15px] justify-center items-center">MeteorMate</h1>
          </div>
          <button className="cursor-pointer font-outfit font-normal md:text-[14px] text-[10px] p-1"><p className="outfit-regular">How It Works</p></button>

          <button className="cursor-pointer md:text-[14px] text-[10px] p-1">
            <p className="outfit-regular">Get Started</p>
          </button>
          <button className="cursor-pointer md:text-[14px] text-[10px] p-1">
            <p className="outfit-regular">Contact Us</p>
          </button>
          <button className="px-15 cursor-pointer md:text-[14px] text-[10px]"><p className="outfit-regular border-0 bg-white text-black rounded-[100px] px-5 py-2">Login</p></button>
        </div>

        {/* This div is for the center text */}
        <div className="outfit-bold mt-27">
          <h1 className="body-work font-extrabold md:text-[85px] text-[30px] flex justify-center">Find your Perfect Roommate</h1>
          <h1 className="body-work font-extrabold md:text-[85px] text-[30px] flex justify-center">Here at UT Dallas.</h1>
        </div>

        {/* for the find your roommate today button */}
          <div className="flex justify-center items-center">
            <button className="bg-white/10 md:px-7 md:py-4 p-2 rounded-[100px] border-0 md:text-[24px] text-[10px] flex justify-center button-find cursor-pointer mt-2 hover:bg-gradient-to-br from-orange-400 to-yellow-500 transition duration-2000 ease-linear">Find Your Roommate Today</button>
          </div>
      </div>
      {/* Second section */}


      {/* Third section */}
      <div id="getStarted" className="min-h-screen bg-black bg-no-repeat bg-center bg-contain text-white flex flex-col items-center justify-center"
      style={{ backgroundImage: `url('/images/STARS__GRAYSCALE_LOGO_png.png')` }}>
        <div className="flex flex-col items-center -space-y-10 mb-1">
          <h1 className="outfit-bold text-[100px]">Ready to Find Your</h1>
          <h1 className="outfit-bold text-[100px]">Perfect Match?</h1>
        </div>
        <div className="flex flex-col items-center mb-4">
          <h1 className="outfit-regular text-[20px]">Join other UTD students on the hunt for the</h1>
          <h1 className="outfit-regular text-[20px]">perfect roomate!</h1>
        </div>
        {/* Button for start your search */}
        <div className="flex justify-center items-center">
          <button className="outfit-bold md:px-7 md:py-4 p-2 rounded-[20px] border-0 md:text-[24px] text-[10px] flex justify-center button-find cursor-pointer mt-2 bg-gradient-to-br from-orange-400 to-yellow-500 hover:opacity-80 transition-opacity duration-300">Start Your Search</button>
        </div>
      </div>

      {/* Fourth section */}
      <div
        id="contactUs"
        className="bg-black bg-no-repeat bg-center bg-contain text-white flex flex-col w-full"
        style={{
          backgroundImage: "url('/images/stars_footerr.png')",
          aspectRatio: 'auto',
          minHeight: '400px',
        }}>
          <div className="mt-5 flex flex-col items-center">
            <div className="w-23 h-23 bg-[#2B2B2B] bg-opacity-50 rounded-full flex items-center justify-center">
              {/* Logo */}
              <img src="/images/MM_logo_V1.png" alt="Logo" className="w-16 h-16 object-contain"/>
            </div>
          </div>
          {/* div for the text */}
          <div className="bg-black bg-no-repeat bg-center bg-contain text-white flex flex-row items-center w-full relative px-8">
            {/* Left side text */}
            <div className="flex flex-col ml-5 outfit-regular">
              <h2>Contact us</h2>
              <div className="flex gap-y-1 flex-col outfit-regular text-white/60 py-2">
                <div className="flex items-center gap-x-3">
                  <MapPin className="w-5 h-5 text-[#509275]" />
                  <h2>University of Texas at Dallas</h2>
                </div>
                <div className="flex items-center gap-x-3">
                  <Mail className="w-5 h-5 text-[#509275]" />
                  <h2>MeteorMateSupport@gmail.com</h2>
                </div>
              </div>
            </div>
            
            {/* Center text - absolutely positioned for true centering */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-white/80">
              <h1 className="oranienbaum-regular text-[30px] mb-10">MeteorMate</h1>
              
              <div className="flex gap-10 outfit-regular text-white/60 text-sm">
                <h2 className="cursor-pointer">Home</h2>
                <h2 className="cursor-pointer">About us</h2>
                <h2 className="cursor-pointer">Contact us</h2>
              </div>
            </div>

            {/* Right side text */}
            <div className="flex flex-col ml-auto items-center">
              <h2 className="text-[50px]">Contact Us</h2>
              <p>Feel free to reach out and leave your</p>
              <p>feedback!</p>
              <div className="flex justify-center lg:justify-end space-x-4 mt-2">
              <a 
                href="https://www.linkedin.com/company/meteor-mate/posts/?feedView=all" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-transparent border-2 border-white/10 hover:bg-blue-600 hover:border-blue-600 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://www.instagram.com/meteor.mate/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-transparent border-2 border-white/10 hover:bg-pink-600 hover:border-pink-600 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://discord.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-transparent border-2 border-white/10 hover:bg-blue-400 hover:border-blue-400 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <FaDiscord className="w-5 h-5 text-white" />
              </a>
            </div>
            </div>
          </div>
          {/* Footer Bottom */}
        <div className="border-t border-white/20 mt-10 py-4 px-10 flex justify-between text-xs text-white/40 outfit-regular">
          <span>© 2025 Meteor Mate UTD. All rights reserved</span>
          <span>Powered by ACM Development</span>
          <div className="flex gap-4">
            <span className="cursor-pointer">Terms</span>
            <span className="cursor-pointer">Privacy</span>
            <span className="cursor-pointer">Data Protection</span>
          </div>
        </div>
        </div>
      </div>


  );
}
