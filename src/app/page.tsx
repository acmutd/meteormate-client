'use client';
import { useRouter } from "next/navigation";
import "./globals.css";

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
    </div>

  );
}
